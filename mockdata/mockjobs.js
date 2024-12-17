const axios = require('axios');
const sharp = require('sharp');
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Job = require('../models/jobs');  
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



async function resizeimage(inputimage, quality, format, size) {
  if(!inputimage) {
    return null;
  }

  const match = inputimage.match(/^data:image\/([a-zA-Z]*);base64,([^\"]*)/);
  if(!match) {
    throw new Error('invalid image');
  }

  const base64body = match[2];
  const padlength = (base64body.match(/=+$/) || [''])[0].length;
  const sizeinbytes = ((base64body.length * 3) / 4 - padlength);
  let initialSize = sizeinbytes;

  const imagetype = match[1];
  const imagebuffer = Buffer.from(base64body, 'base64');const metadata = await sharp(imagebuffer).metadata();
  let { width, height } = metadata;
  let resizedbuffer = '' ;
  try {
    resizedbuffer = imagebuffer;
  while ( sizeinbytes >= size && quality >1) {
    const newWidth = Math.floor(width * 0.3);
     resizedbuffer = await sharp(resizedbuffer)
     .resize({width: newWidth})
    .toFormat(format, {quality})
    .toBuffer();

    const newbase64 = resizedbuffer.toString('base64');
    const newsize = (newbase64.length * 3) / 4 - (newbase64.match(/=+$/) || [''])[0].length;
    const progress = ((initialSize - newsize) / initialSize) * 100;
      console.log(`Progress: ${Math.round(progress)}%`);
    if(newsize <= size) {
      break;
    }
     quality -= 10 ;
  }
    const resizedBase64String = `data:image/${imagetype};base64,${resizedbuffer.toString('base64')}`;
    return resizedBase64String;
 }
  catch(err) {
    console.error('error resizing image', err);
    throw err;
  }
}



async function convertImageToBase64(imageUrl) {
  try {
    
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    
    
    const base64Image = `data:image/jpeg;base64,${Buffer.from(response.data).toString('base64')}`;
    const image = resizeimage(base64Image, 60, 'webp', 100000);
    return image;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
}

async function generateMockData() {
  await connectDB();

  
  const mockJobs = Array.from({ length: 5 }, () => ({
    job_tittle: faker.person.jobTitle(),
    job_location: faker.location.city(),
    job_salary: faker.finance.amount(300000, 1000000, 5000, '₹'),
    job_type: faker.helpers.arrayElement(['Full Time', 'Part Time', 'Contract']),
    job_level: faker.helpers.arrayElement(['Entry Level', 'Mid Level', 'Senior Level']),
    job_des: faker.lorem.paragraph(),
    job_edu: faker.helpers.arrayElement(['Bachelor\'s Degree', 'Master\'s Degree', 'Ph.D']),
    job_exp_level: faker.number.int({ min: 0, max: 10 }).toString(),
    job_deadline: faker.date.future(),
    job_app_email: faker.internet.email(),
    job_resume: faker.helpers.arrayElement(['Yes', 'No']),
    job_company_name: faker.company.name(),
    job_company_website: faker.internet.url(),
    job_company_des: faker.lorem.paragraph(),
    job_contact_info: faker.phone.number(),
    job_company_logo: '',  
    applicants: []
  }));

  
  for (const job of mockJobs) {
    const base64Logo = await convertImageToBase64(faker.image.url());  
    job.job_company_logo = base64Logo;
  }

  
  const insertedJobs = await Job.insertMany(mockJobs);
  console.log('Mock Data Inserted!');

  
  const jobIds = insertedJobs.map(job => ({ job_id: job._id.toString() }));

  
  const userIdToUpdate = '248650';  

  
  const user = await Alumni.findOne({ userid: userIdToUpdate });
  if (user) {
    
    user.data.job_ids = jobIds;

    
    await user.save();
    console.log(`Job IDs added to user with userid: ${userIdToUpdate}`);

    
    const updatedUser = await Alumni.findOne({ userid: userIdToUpdate });
    console.log(updatedUser.data.job_ids);  
  } else {
    console.log('User not found!');
  }

  mongoose.disconnect();
}

generateMockData()
