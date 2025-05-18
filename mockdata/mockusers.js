const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Alumni = require('../models/users');  // Make sure the correct path is used for your model
const {hashPassword, hashloginPassword} = require('../config/util')
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

async function generateMockData() {
  await connectDB();

  const currentYear = new Date().getFullYear();  // Get current year

  // Generate users for both student (0-3 years ago) and alumni (4+ years ago)
  const mockUsers = Array.from({ length: 50 }, () => {
    // Randomly select between alumni and student
    const isAlumni = faker.datatype.boolean(); // 50% chance to be alumni
    let year;

    // Determine the year based on the usertype (alumni or student)
    if (isAlumni) {
      // Alumni: Random year between 1995 and currentYear - 4 (at least 4 years ago)
      year = faker.number.int({ min: currentYear - 25, max: currentYear - 4 });
    } else {
      // Student: Random year between currentYear - 3 and currentYear
      year = faker.number.int({ min: currentYear - 3, max: currentYear });
    }

    const yearShort = year.toString().slice(-2);  // Get last two digits of the year
    const branches = ['CSE', 'ME', 'EE', 'ECE', 'CE'];
    const branch = faker.helpers.arrayElement(branches);
    const uniqueNo = faker.number.int({ min: 1, max: 100 });

    // Pad uniqueNo with a leading zero if it's between 1 and 9
    const paddedUniqueNo = uniqueNo < 10 ? `0${uniqueNo}` : uniqueNo;

    const userid = `${yearShort}${branch}${paddedUniqueNo}`;

    // Determine usertype based on years since admission
    const admissionYear = parseInt(year);  // Full year of admission (e.g., 2018)
    const usertype = (currentYear - admissionYear) >= 4 ? 'alumni' : 'student';  // User is alumni if 4+ years since admission

    return {
      personname: faker.person.fullName(),
      userid: userid,
      usertype: usertype,
      email: faker.internet.email(),
      userprivacy: faker.helpers.arrayElement(['public', 'private']),
      salt: faker.string.uuid(),
      passwordhash: faker.internet.password(),
      personimage: faker.image.avatar(),
      details: {
        batch: year.toString(), // Full year of admission
        branch: branch,
        aboutme: faker.lorem.sentence(),
        education: faker.lorem.sentence(),
        currentrole: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        contactinfo: faker.phone.number(),
        resume: '', // Empty resume field
      },
      data: {
        job_ids: [],
        event_ids: []
      },
      verified: true,
    };
  });

  // Insert the mock users into the database
  const insertedUsers = await Alumni.insertMany(mockUsers);
  console.log('Mock Users Inserted!');
  mongoose.disconnect();
}

generateMockData();
