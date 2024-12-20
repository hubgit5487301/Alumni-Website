const axios = require('axios');
const sharp = require('sharp');
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Event = require('../models/events');  
const Alumni = require('../models/users');  

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017');
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};


async function resizeImage(inputImage, quality, format, maxSize) {
  if (!inputImage) {
    return null;
  }

  const match = inputImage.match(/^data:image\/([a-zA-Z]*);base64,([^\"]*)/);
  if (!match) {
    throw new Error('Invalid image');
  }

  const base64Body = match[2];
  const padLength = (base64Body.match(/=+$/) || [''])[0].length;
  const sizeInBytes = ((base64Body.length * 3) / 4 - padLength);

  const imageType = match[1];
  const imageBuffer = Buffer.from(base64Body, 'base64');
  const metadata = await sharp(imageBuffer).metadata();
  let { width, height } = metadata;
  let resizedBuffer = imageBuffer;
  let initialSize = sizeInBytes;

  try {
    while (sizeInBytes >= maxSize && quality > 1) {
      const newWidth = Math.floor(width * 0.3);
      resizedBuffer = await sharp(resizedBuffer)
        .resize({ width: newWidth })
        .toFormat(format, { quality })
        .toBuffer();

      const newBase64 = resizedBuffer.toString('base64');
      const newSize = (newBase64.length * 3) / 4 - (newBase64.match(/=+$/) || [''])[0].length;
      const progress = ((initialSize - newSize) / initialSize) * 100;
      console.log(`Progress: ${Math.round(progress)}%`);
      if (newSize <= maxSize) {
        break;
      }
      quality -= 10;
    }

    const resizedBase64String = `data:image/${imageType};base64,${resizedBuffer.toString('base64')}`;
    return resizedBase64String;
  } catch (err) {
    console.error('Error resizing image', err);
    throw err;
  }
}


async function convertImageToBase64(imageUrl) {
  try {
    
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    
    
    const base64Image = `data:image/jpeg;base64,${Buffer.from(response.data).toString('base64')}`;
    
    
    const resizedImage = await resizeImage(base64Image, 60, 'webp', 100000);
    return resizedImage;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
}

async function generateMockDataForEvents() {
  await connectDB();

  
  const mockEvents = Array.from({ length: 1 }, () => ({
    userid: '248650',
    name: faker.commerce.productName(),
    date: faker.date.future(),
    location: faker.location.city(),
    contact_info: {
      email: faker.internet.email(),
      phone_no: faker.phone.number(),
    },
    event_des: faker.lorem.paragraph(),
    event_file: 'temp',  
    event_logo: '',  
    applicants: [],
  }));

  
  for (const event of mockEvents) {
    const base64Logo = await convertImageToBase64(faker.image.url());  
    event.event_logo = base64Logo;
  }

  
  const insertedEvents = await Event.insertMany(mockEvents);
  console.log('Mock Events Data Inserted!');

  
  const eventIds = insertedEvents.map(event => ({ event_id: event._id.toString() }));

  
  const userIdToUpdate = '248650';  

  
  const user = await Alumni.findOne({ userid: userIdToUpdate });
  if (user) {
    
    user.data.event_ids = eventIds;

    
    await user.save();
    console.log(`Event IDs added to user with userid: ${userIdToUpdate}`);

    
    const updatedUser = await Alumni.findOne({ userid: userIdToUpdate });
    console.log(updatedUser.data.event_ids);  
  } else {
    console.log('User not found!');
  }

  mongoose.disconnect();
}


generateMockDataForEvents();
