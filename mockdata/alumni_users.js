// Required modules
require('dotenv').config({path:'../.env'});
const mongoose = require('mongoose');
const crypto = require('crypto'); // For password hashing
const path = require('path');   // Still useful for model path if not in same dir

// Import your Mongoose model (ensure the path is correct relative to this script)
const Alumni = require('../models/users'); // IMPORTANT: Verify this path

// --- Configuration ---
// MongoDB Connection URI: Replace 'yourDatabaseName' with your actual database name.
 // IMPORTANT: Update with your DB URI and name
// const MONGO_URI = process.env.mongoURI
const MONGO_URI = 'mongodb://localhost:27017/'; // Local MongoDB URI
console.log(MONGO_URI)
// --- Hashing Functions (as provided by user) ---
/**
 * Hashes a password using a randomly generated salt.
 * @param {string} getpassword - The plain text password.
 * @returns {{salt: string, passwordhash: string}} An object containing the salt and the hashed password.
 */
function hashPassword(getpassword) {
  const salt = crypto.randomBytes(16).toString('hex');
  // In Node.js, pbkdf2Sync expects the hash (passwordhash here) to be named 'passwordhash' for consistency with your schema.
  const passwordhash = crypto.pbkdf2Sync(getpassword, salt, 1000, 64, 'sha256').toString('hex');
  return { salt, passwordhash }; // Corrected to match expected 'passwordhash' field name
}

// This function is defined as per your input but not directly used in this import script's primary flow.
// It would be used for verifying a password during login.
// function hashloginPassword (password, salt) {
//   const passwordhash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');
//   return passwordhash;
// }

// --- Embedded JSON Data ---
// This data is the result of processing 'download.json' with the specified transformations.
// (BE/ITE -> CSE, EIE -> ECE, and UserID suffix to 2 digits)
const usersJsonData = [
  {
    "personname": "ABHINIT KUMAR SINGH",
    "userid": "07CSE01",
    "usertype": "alumni",
    "email": "abhinit.singh001@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2007",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "ASSISTANT QUALITY MANAGER at SUPA STAR FOODS PVT. LTD., UDHYOG VIHAR PHASE 4, GURGAON",
      "experience": "ASSISTANT QUALITY MANAGER at SUPA STAR FOODS PVT. LTD., UDHYOG VIHAR PHASE 4, GURGAON",
      "contactinfo": "9818137509",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Abhishek Sharma",
    "userid": "07CSE02",
    "usertype": "alumni",
    "email": "asabhi188@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2007",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Assistant Manager at Engrow Enviro Technocrats",
      "experience": "Assistant Manager at Engrow Enviro Technocrats",
      "contactinfo": "9452091107",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Akshay kumar",
    "userid": "06CSE01",
    "usertype": "alumni",
    "email": "akshayrajpathak@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2006",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "No input provided",
      "experience": "No input provided",
      "contactinfo": "8840336044",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Anurag Chaudhary",
    "userid": "08CSE01",
    "usertype": "alumni",
    "email": "anuragchaudhary77@hotmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2008",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Asst. Manager at G K winding wires ltd",
      "experience": "Asst. Manager at G K winding wires ltd",
      "contactinfo": "9711787843",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Anurag Ojha",
    "userid": "03CSE01",
    "usertype": "alumni",
    "email": "ojhaanurag83@yahoo.in",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2003",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "HOD - PPIC at INBISCO INDIA",
      "experience": "HOD - PPIC at INBISCO INDIA",
      "contactinfo": "9558673562",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Avinash Kumar Sharma",
    "userid": "07CSE03",
    "usertype": "alumni",
    "email": "avinashsharma754@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2007",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "QA Manager at Suppletek Industries Pvt Ltd",
      "experience": "QA Manager at Suppletek Industries Pvt Ltd",
      "contactinfo": "7087010995",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Chandan Singh",
    "userid": "05CSE01",
    "usertype": "alumni",
    "email": "er.singhchandan@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2005",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Manager Operations at Vark snack food pvt ltd",
      "experience": "Manager Operations at Vark snack food pvt ltd",
      "contactinfo": "7827913092",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "MAYANK GOVIL",
    "userid": "07CSE04",
    "usertype": "alumni",
    "email": "mgovil96@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2007",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Production Manager at B.B. FOODS PVT. LTD.",
      "experience": "Production Manager at B.B. FOODS PVT. LTD.",
      "contactinfo": "7060980611",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Neeraj agarwal",
    "userid": "06CSE02",
    "usertype": "alumni",
    "email": "erneerajagarwal@rediffmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2006",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Asst manager at Axis bank",
      "experience": "Asst manager at Axis bank",
      "contactinfo": "9411410897",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "nikhil kumar gupta",
    "userid": "06CSE03",
    "usertype": "alumni",
    "email": "nik_btech@yahoo.co.in",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2006",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Process Engineer at Kansai Nerolac Pvt Ltd",
      "experience": "Process Engineer at Kansai Nerolac Pvt Ltd",
      "contactinfo": "7376566168",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Prashant Chauhan",
    "userid": "07CSE05",
    "usertype": "alumni",
    "email": "chauhan_prashant@live.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2007",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Senior Database Admin at Wipro Technology",
      "experience": "Senior Database Admin at Wipro Technology",
      "contactinfo": "9878410463",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "praveen",
    "userid": "07CSE06",
    "usertype": "alumni",
    "email": "praveen07bt@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2007",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "No input provided",
      "experience": "No input provided",
      "contactinfo": "9451229382",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Prem Bharti",
    "userid": "06CSE04",
    "usertype": "alumni",
    "email": "greentecheemind@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2006",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Project Manager at Uneecops technologies ltd",
      "experience": "Project Manager at Uneecops technologies ltd",
      "contactinfo": "9540694381",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "RASHMI JADON",
    "userid": "07CSE07",
    "usertype": "alumni",
    "email": "rashmi.jadon1991@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2007",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Quality Head at Robust trade link",
      "experience": "Quality Head at Robust trade link",
      "contactinfo": "8859442761",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Ratika Sharma",
    "userid": "06CSE05",
    "usertype": "alumni",
    "email": "ratika@kamalautoworkd.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2006",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Owner at Kamlesh Autowheels Pvt. Ltd. Etah",
      "experience": "Owner at Kamlesh Autowheels Pvt. Ltd. Etah",
      "contactinfo": "9917966666",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Richa Singh",
    "userid": "06CSE06",
    "usertype": "alumni",
    "email": "richasinghbt@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2006",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "PhD scholar at Sardar swaran Singh national institute of Bioenergy, kapurthala, punjab",
      "experience": "PhD scholar at Sardar swaran Singh national institute of Bioenergy, kapurthala, punjab",
      "contactinfo": "7982572369",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Yatin Tigdania",
    "userid": "05CSE02",
    "usertype": "alumni",
    "email": "er.yatin09@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2005",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Deputy Manager at Apcer life sciences",
      "experience": "Deputy Manager at Apcer life sciences",
      "contactinfo": "9643169220",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Alok kumar mishra",
    "userid": "06CE01",
    "usertype": "alumni",
    "email": "alokme2005@yahoo.co.in",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2006",
      "branch": "CE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Junior engineer at Wrd jharkhand",
      "experience": "Junior engineer at Wrd jharkhand",
      "contactinfo": "9452540598",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Anurag yadav",
    "userid": "06CE02",
    "usertype": "alumni",
    "email": "anuragyadavchandravanshi@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2006",
      "branch": "CE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Director at Nss Buildcon pvt ltd",
      "experience": "Director at Nss Buildcon pvt ltd",
      "contactinfo": "9557555553",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Arpit Mathur",
    "userid": "07CE01",
    "usertype": "alumni",
    "email": "arpit07ce07@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2007",
      "branch": "CE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Asst highway engineer at Consulting engineers groups",
      "experience": "Asst highway engineer at Consulting engineers groups",
      "contactinfo": "9713801737",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "BRIJ KISHOR MORYA",
    "userid": "05CE01",
    "usertype": "alumni",
    "email": "brijmorya786@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2005",
      "branch": "CE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Junior Engineer at Mcd delhi",
      "experience": "Junior Engineer at Mcd delhi",
      "contactinfo": "8800717410",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Deepankar Singh",
    "userid": "07CE02",
    "usertype": "alumni",
    "email": "deepankarsingh21@yahoo.in",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2007",
      "branch": "CE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Assistant Engineer at (Panchayati Raj) Zila Panchayat",
      "experience": "Assistant Engineer at (Panchayati Raj) Zila Panchayat",
      "contactinfo": "9756874193",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Ghanshyam Gupta",
    "userid": "04CE01",
    "usertype": "alumni",
    "email": "ghanshyam.gupta48@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2004",
      "branch": "CE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "SSE at Indian Railways",
      "experience": "SSE at Indian Railways",
      "contactinfo": "9648671595",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Jayankesh Singh",
    "userid": "06CE03",
    "usertype": "alumni",
    "email": "jayankesh@iiserb.ac.in",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2006",
      "branch": "CE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Maintenance Engineer at Indian Institute of Science Education & Research , Bhopal",
      "experience": "Maintenance Engineer at Indian Institute of Science Education & Research , Bhopal",
      "contactinfo": "7389945804",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Kapil kant swaroop",
    "userid": "05CE02",
    "usertype": "alumni",
    "email": "kapilkantswaroop@yahoo.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2005",
      "branch": "CE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "T&P Officer at U.P. Technical education department",
      "experience": "T&P Officer at U.P. Technical education department",
      "contactinfo": "9027519968",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Love dixit",
    "userid": "08CE01",
    "usertype": "alumni",
    "email": "lovedxt41@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2008",
      "branch": "CE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Officer at Biltech building elements ltd",
      "experience": "Officer at Biltech building elements ltd",
      "contactinfo": "7043503301",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Mohd iqbal malik",
    "userid": "08CE02",
    "usertype": "alumni",
    "email": "ermalik1989@yahoo.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2008",
      "branch": "CE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Assistant engineer at PWD (R&B) JAMMU",
      "experience": "Assistant engineer at PWD (R&B) JAMMU",
      "contactinfo": "9622057697",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Rohit Roushan",
    "userid": "02CE01",
    "usertype": "alumni",
    "email": "rohit.rousha@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2002",
      "branch": "CE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Engg at Mcd",
      "experience": "Engg at Mcd",
      "contactinfo": "8527531556",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Saurabh Jindal",
    "userid": "04CE02",
    "usertype": "alumni",
    "email": "jindal_iet@hotmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2004",
      "branch": "CE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Manager at TATA Power",
      "experience": "Manager at TATA Power",
      "contactinfo": "9871222690",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Udaivir Singh",
    "userid": "02CE02",
    "usertype": "alumni",
    "email": "jeudaiveer@yahoo.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2002",
      "branch": "CE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Junior Enginer at Lucknow Development authority Lucknow",
      "experience": "Junior Enginer at Lucknow Development authority Lucknow",
      "contactinfo": "9927990422",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Vivek krishna singh",
    "userid": "06CE04",
    "usertype": "alumni",
    "email": "vivekkrishnasingh@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2006",
      "branch": "CE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "J.E (civil) at IISER Bhopal",
      "experience": "J.E (civil) at IISER Bhopal",
      "contactinfo": "9713007007",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Alok rajan rai",
    "userid": "06CSE07",
    "usertype": "alumni",
    "email": "alokrrai06cs@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2006",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "I.t. engineer at C.dot",
      "experience": "I.t. engineer at C.dot",
      "contactinfo": "7007353693",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Ashish Kumar",
    "userid": "00CSE01",
    "usertype": "alumni",
    "email": "ashishsp2002@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2000",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Training & Placement Officer at Sharda Group of Institutions",
      "experience": "Training & Placement Officer at Sharda Group of Institutions",
      "contactinfo": "9639014454",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Bhumika Agrahari",
    "userid": "08CSE02",
    "usertype": "alumni",
    "email": "coolbhumi@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2008",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Equity analyst at JM financial",
      "experience": "Equity analyst at JM financial",
      "contactinfo": "9634081254",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "CHANDRA PRAKASH",
    "userid": "06CSE08",
    "usertype": "alumni",
    "email": "Singh_862006@yahoo.co.in",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2006",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Assistant Manager at UBI",
      "experience": "Assistant Manager at UBI",
      "contactinfo": "8757212775",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Durgesh Kumar Tiwari",
    "userid": "08CSE03",
    "usertype": "alumni",
    "email": "duek.cs15@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2008",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Asst. Manager at SMPCL",
      "experience": "Asst. Manager at SMPCL",
      "contactinfo": "9410008068",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Durgesh Pratap Singh",
    "userid": "07CSE08",
    "usertype": "alumni",
    "email": "durgeshsingh0018@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2007",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Mission Manager at UPPCL",
      "experience": "Mission Manager at UPPCL",
      "contactinfo": "8791345939",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Harsh Sharma",
    "userid": "09CSE01",
    "usertype": "alumni",
    "email": "harsh.sharma10070@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2009",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Software developer at American express",
      "experience": "Software developer at American express",
      "contactinfo": "9971780550",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "kaushal dev singh",
    "userid": "02CSE01",
    "usertype": "alumni",
    "email": "dev.kaush@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2002",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "No input provided",
      "experience": "No input provided",
      "contactinfo": "9634126661",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Manish Kumar",
    "userid": "06CSE09",
    "usertype": "alumni",
    "email": "1989man@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2006",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "CRA at DMRC",
      "experience": "CRA at DMRC",
      "contactinfo": "8445841392",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Mrdul kunar",
    "userid": "09CSE02",
    "usertype": "alumni",
    "email": "mradulkunae1989@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2009",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "LLB at Delhi University",
      "experience": "LLB at Delhi University",
      "contactinfo": "7520567335",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Nagendra Pal Singh",
    "userid": "99CSE01",
    "usertype": "alumni",
    "email": "er.npsingh@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1999",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "DO at LIC Of INDIA",
      "experience": "DO at LIC Of INDIA",
      "contactinfo": "9760884854",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Narendra Singh",
    "userid": "06CSE10",
    "usertype": "alumni",
    "email": "nandi987@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2006",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Director at Registered Business",
      "experience": "Director at Registered Business",
      "contactinfo": "9005293255",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Nisheet Kumar",
    "userid": "01CSE01",
    "usertype": "alumni",
    "email": "er.nkumar@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2001",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Director at Noida Fresh",
      "experience": "Director at Noida Fresh",
      "contactinfo": "9927090390",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Nitin Chandra",
    "userid": "98CSE01",
    "usertype": "alumni",
    "email": "nitinchan@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1998",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Vice President at Royal Bank of Scotland",
      "experience": "Vice President at Royal Bank of Scotland",
      "contactinfo": "9910114326",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Pragati yadav",
    "userid": "04CSE01",
    "usertype": "alumni",
    "email": "pragati.yadav87@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2004",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Technical Lead at Myntra designs Pvt ltd",
      "experience": "Technical Lead at Myntra designs Pvt ltd",
      "contactinfo": "9582463388",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "RAJEEV PANDEY",
    "userid": "98CSE02",
    "usertype": "alumni",
    "email": "rajeev98iet@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1998",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Asst.Prof. at RGPV (MP)",
      "experience": "Asst.Prof. at RGPV (MP)",
      "contactinfo": "9479907881",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Ritesh Agarwal",
    "userid": "98CSE03",
    "usertype": "alumni",
    "email": "ritesh_iit2003@yahoo.co.in",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1998",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Pricipal Software Engineer at Cadence Design Systems, Noida",
      "experience": "Pricipal Software Engineer at Cadence Design Systems, Noida",
      "contactinfo": "9911071198",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Shailendra Kumar",
    "userid": "00CSE02",
    "usertype": "alumni",
    "email": "extremeshailendra@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2000",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Asst. Manager at Entab Infotech",
      "experience": "Asst. Manager at Entab Infotech",
      "contactinfo": "8860001123",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Somesh Shandilya",
    "userid": "04CSE02",
    "usertype": "alumni",
    "email": "somesh.shandilya@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2004",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Assistant Professor at Faculty of Engineering and Technology, Agra College, Agra.",
      "experience": "Assistant Professor at Faculty of Engineering and Technology, Agra College, Agra.",
      "contactinfo": "9412811419",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Sumit gangwar",
    "userid": "09CSE03",
    "usertype": "alumni",
    "email": "sumitgangwar0@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2009",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Sales manager at Pacific Green infraheights pvt Ltd",
      "experience": "Sales manager at Pacific Green infraheights pvt Ltd",
      "contactinfo": "8171771556",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Vijay Abrol",
    "userid": "01CSE02",
    "usertype": "alumni",
    "email": "Samajwad@gmail.Com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2001",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Proprietor at Libra Infratechh",
      "experience": "Proprietor at Libra Infratechh",
      "contactinfo": "9219779999",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Vipul Uniyal",
    "userid": "99CSE02",
    "usertype": "alumni",
    "email": "vipuluniyal81@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1999",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Co-Founder at NexionPro Services LLP",
      "experience": "Co-Founder at NexionPro Services LLP",
      "contactinfo": "8800439583",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Abhishek Kumar",
    "userid": "00ECE01",
    "usertype": "alumni",
    "email": "kumar.abhi@hotmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2000",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Consultant at SAP India",
      "experience": "Consultant at SAP India",
      "contactinfo": "9999111615",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Abhishek Varshney",
    "userid": "00ECE02",
    "usertype": "alumni",
    "email": "abhishek.varshney@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2000",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Senior Project Manager at General Electric",
      "experience": "Senior Project Manager at General Electric",
      "contactinfo": "8800394840",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Anil Singh",
    "userid": "01ECE01",
    "usertype": "alumni",
    "email": "anilsingh.rf@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2001",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Senior Manager at Huawei Technologies",
      "experience": "Senior Manager at Huawei Technologies",
      "contactinfo": "7838929282",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Ankit Sharma",
    "userid": "99ECE01",
    "usertype": "alumni",
    "email": "ankitsharma81@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1999",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "No input provided",
      "experience": "No input provided",
      "contactinfo": "9560502503",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Ankur Saxena",
    "userid": "00ECE03",
    "usertype": "alumni",
    "email": "ankursaxena.india@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2000",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Project Manager at DXC Technolgies Ltd",
      "experience": "Project Manager at DXC Technolgies Ltd",
      "contactinfo": "9990046066",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Anurag Bhardwaj",
    "userid": "98ECE01",
    "usertype": "alumni",
    "email": "anuragbhardwaj81@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1998",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Head - Business Developement at Flipkart",
      "experience": "Head - Business Developement at Flipkart",
      "contactinfo": "9990824666",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Arun Pratap Singh Yadav",
    "userid": "99ECE02",
    "usertype": "alumni",
    "email": "apsyadav@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1999",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Service Product Manager at Nokia",
      "experience": "Service Product Manager at Nokia",
      "contactinfo": "919717599243",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Ashish Dubey",
    "userid": "06ECE01",
    "usertype": "alumni",
    "email": "ashishsplendor@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2006",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "No input provided",
      "experience": "No input provided",
      "contactinfo": "7428236620",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "ASHISH KUMAR",
    "userid": "06ECE02",
    "usertype": "alumni",
    "email": "ashishec13@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2006",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "R & D ENGINEER at POWERTAC",
      "experience": "R & D ENGINEER at POWERTAC",
      "contactinfo": "9457776662",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "ASHWANI KUMAR",
    "userid": "09ECE01",
    "usertype": "alumni",
    "email": "pintukr19@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2009",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "EMBEDDED ENGINEER ROBOTICS",
      "experience": "EMBEDDED ENGINEER ROBOTICS",
      "contactinfo": "9013242049",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Baldev singh",
    "userid": "00ECE04",
    "usertype": "alumni",
    "email": "bittu.4chaudhary@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2000",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Lecturer at Govt.polytechnic jhansi",
      "experience": "Lecturer at Govt.polytechnic jhansi",
      "contactinfo": "9411683901",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Deepak Jain",
    "userid": "98ECE02",
    "usertype": "alumni",
    "email": "deepak.jain@fracton.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1998",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Director at Fracton Technologies",
      "experience": "Director at Fracton Technologies",
      "contactinfo": "8447750638",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Deepak Kumar",
    "userid": "99ECE03",
    "usertype": "alumni",
    "email": "deepak.rf@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1999",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Network Planning & Optimization Specialist at Nokia Pvt. Ltd",
      "experience": "Network Planning & Optimization Specialist at Nokia Pvt. Ltd",
      "contactinfo": "8376803656",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "GAURAV AGARWAL",
    "userid": "02ECE01",
    "usertype": "alumni",
    "email": "hi.imgaurav@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2002",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "No input provided",
      "experience": "No input provided",
      "contactinfo": "9760045789",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Gaurav Kumar Singh",
    "userid": "01ECE02",
    "usertype": "alumni",
    "email": "singh.gauravdev7@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2001",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Chairperson at R.K.G.M Institute Of Technology and Management Sikandra Agra",
      "experience": "Chairperson at R.K.G.M Institute Of Technology and Management Sikandra Agra",
      "contactinfo": "9760468737",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "HARENDRA NARAYAN",
    "userid": "00ECE05",
    "usertype": "alumni",
    "email": "narayan.harendra@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2000",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "IAS at Govt Of India,Madhya Prades",
      "experience": "IAS at Govt Of India,Madhya Prades",
      "contactinfo": "8000442100",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Kumar Vaibhav",
    "userid": "01ECE03",
    "usertype": "alumni",
    "email": "kumarvaibhav2003@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2001",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Team Lead at Accenture Solutions",
      "experience": "Team Lead at Accenture Solutions",
      "contactinfo": "8005858497",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Mohit Khandelwal",
    "userid": "04ECE01",
    "usertype": "alumni",
    "email": "mohitkh1984@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2004",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Controls Engineer at General Electric",
      "experience": "Controls Engineer at General Electric",
      "contactinfo": "9871074489",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Mohit Kumar",
    "userid": "01ECE04",
    "usertype": "alumni",
    "email": "mohit.dt@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2001",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Dy. Manager at Reliance JIO",
      "experience": "Dy. Manager at Reliance JIO",
      "contactinfo": "7009226256",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Navin singhal",
    "userid": "99ECE04",
    "usertype": "alumni",
    "email": "vinayakglasstechsolutions@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1999",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Owner at G. S. Enterprise",
      "experience": "Owner at G. S. Enterprise",
      "contactinfo": "8193066000",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Pankaj Gautam",
    "userid": "07ECE01",
    "usertype": "alumni",
    "email": "pankajgautamiet@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2007",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Jila vistarak at B.J.P.",
      "experience": "Jila vistarak at B.J.P.",
      "contactinfo": "9557510951",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Prabhakar Saxena",
    "userid": "98ECE03",
    "usertype": "alumni",
    "email": "prabhakar_ec@rediffmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1998",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Sr. Manager at HAL",
      "experience": "Sr. Manager at HAL",
      "contactinfo": "9881300886",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Pradeep Kumar",
    "userid": "99ECE05",
    "usertype": "alumni",
    "email": "pradeep@addnum.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1999",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Solution Manager at Nokia",
      "experience": "Solution Manager at Nokia",
      "contactinfo": "9910852299",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Pravesh Shrivastava",
    "userid": "07ECE02",
    "usertype": "alumni",
    "email": "prv.shri@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2007",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Team Leader at BT-Data & Surveying Services India Pvt Ltd",
      "experience": "Team Leader at BT-Data & Surveying Services India Pvt Ltd",
      "contactinfo": "9910688794",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Rajat Kumar",
    "userid": "98ECE04",
    "usertype": "alumni",
    "email": "rajblink1981@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1998",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Specialist at Ericsson",
      "experience": "Specialist at Ericsson",
      "contactinfo": "8861005085",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Ram Prakash",
    "userid": "98ECE05",
    "usertype": "alumni",
    "email": "ram.prakash22@outlook.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1998",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Sr. Manager at KEC International Ltd",
      "experience": "Sr. Manager at KEC International Ltd",
      "contactinfo": "9971117445",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "ratika bhardwaj",
    "userid": "03ECE01",
    "usertype": "alumni",
    "email": "ratika_bhardwaj2001@yahoo.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2003",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Asst Manager Marketing at Arc International",
      "experience": "Asst Manager Marketing at Arc International",
      "contactinfo": "9643843049",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Sandeep Sharma",
    "userid": "98ECE06",
    "usertype": "alumni",
    "email": "sandeep.5g@outlook.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1998",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "GM at Ericsson Global",
      "experience": "GM at Ericsson Global",
      "contactinfo": "8826298724",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Sanjeev Kumar",
    "userid": "01ECE05",
    "usertype": "alumni",
    "email": "skumar111982@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2001",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Manager at Bharti AIrtel Limited",
      "experience": "Manager at Bharti AIrtel Limited",
      "contactinfo": "9971108829",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Shailendra Pratap Singh",
    "userid": "06ECE03",
    "usertype": "alumni",
    "email": "spsingh.licdo@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2006",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "DEVELOPMENT OFFICER at Life Insurance Corporuption Of India",
      "experience": "DEVELOPMENT OFFICER at Life Insurance Corporuption Of India",
      "contactinfo": "8534900444",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Shantanu srivastava",
    "userid": "08ECE01",
    "usertype": "alumni",
    "email": "shantanusri123@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2008",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Engineer at Idea cellular ltd.",
      "experience": "Engineer at Idea cellular ltd.",
      "contactinfo": "9540001047",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Shishupal Singh",
    "userid": "98ECE07",
    "usertype": "alumni",
    "email": "shakyarsp@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1998",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Zonal Project Manager at Nokia Solutions and Networks",
      "experience": "Zonal Project Manager at Nokia Solutions and Networks",
      "contactinfo": "9539684446",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Shivangi",
    "userid": "02ECE02",
    "usertype": "alumni",
    "email": "neha.hopes@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2002",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Dy Manager at BHEL",
      "experience": "Dy Manager at BHEL",
      "contactinfo": "9953160476",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "UPENDRA KUMAR MISHRA",
    "userid": "10ECE01",
    "usertype": "alumni",
    "email": "mishraupen.92@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2010",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Mtech at davv indore mp",
      "experience": "Mtech at davv indore mp",
      "contactinfo": "8285161491",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Veer Singh",
    "userid": "05ECE01",
    "usertype": "alumni",
    "email": "veersingh9587@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2005",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "No input provided",
      "experience": "No input provided",
      "contactinfo": "8373917039",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Abhay Singh",
    "userid": "02ECE03",
    "usertype": "alumni",
    "email": "si.abhay@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2002",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Asst. Manager at Armacell India Pvt Ltd",
      "experience": "Asst. Manager at Armacell India Pvt Ltd",
      "contactinfo": "9899853087",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "ALOK PACHAURI",
    "userid": "02ECE04",
    "usertype": "alumni",
    "email": "alokpachauri2000@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2002",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "S.D.O. at BSNL",
      "experience": "S.D.O. at BSNL",
      "contactinfo": "9412811547",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Amit Yadav",
    "userid": "07ECE03",
    "usertype": "alumni",
    "email": "amit.dreams06@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2007",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Deputy Manager at UKB Electronics PVT Ltd",
      "experience": "Deputy Manager at UKB Electronics PVT Ltd",
      "contactinfo": "8882248098",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Ankush Pratap",
    "userid": "08ECE02",
    "usertype": "alumni",
    "email": "ankush.pratap@yahoo.in",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2008",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Instrumentation and Control Engineer at AHI Carrier Fzc Sharjah",
      "experience": "Instrumentation and Control Engineer at AHI Carrier Fzc Sharjah",
      "contactinfo": "9761642850",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Ashish Kumar Mogha",
    "userid": "02ECE05",
    "usertype": "alumni",
    "email": "mogha.npl@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2002",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Deputy Manager at Larsen & Toubro ltd",
      "experience": "Deputy Manager at Larsen & Toubro ltd",
      "contactinfo": "9779245398",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "aviral sharma",
    "userid": "03ECE02",
    "usertype": "alumni",
    "email": "aviralsharma06@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2003",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "senior consultant at atos",
      "experience": "senior consultant at atos",
      "contactinfo": "9871126703",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Diwakar Gupta",
    "userid": "02ECE06",
    "usertype": "alumni",
    "email": "diwakar.divi@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2002",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "No input provided",
      "experience": "No input provided",
      "contactinfo": "9560199910",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Dr. Om prakash verma",
    "userid": "04ECE02",
    "usertype": "alumni",
    "email": "vermaop@nitj.ac.in",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2004",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "ASSISTANT PROFESSOR at NIT JALANDHAR",
      "experience": "ASSISTANT PROFESSOR at NIT JALANDHAR",
      "contactinfo": "7579279839",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "JITENDER chaudhary",
    "userid": "02ECE07",
    "usertype": "alumni",
    "email": "jeet_engg_sai@yahoo.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2002",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "AO-IT at LIC of India",
      "experience": "AO-IT at LIC of India",
      "contactinfo": "9015551152",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "PRAVEEN KUSHWAHA",
    "userid": "02ECE08",
    "usertype": "alumni",
    "email": "ei.praveen@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2002",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "JTO at BSNL",
      "experience": "JTO at BSNL",
      "contactinfo": "9412221718",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Rahul Agnihotri",
    "userid": "07ECE04",
    "usertype": "alumni",
    "email": "rahul.agnihotri277@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2007",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Sr. Engineer Quality at Bajaj Electricals Ltd.",
      "experience": "Sr. Engineer Quality at Bajaj Electricals Ltd.",
      "contactinfo": "9012708631",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Sanju Singh rajput",
    "userid": "06ECE04",
    "usertype": "alumni",
    "email": "err.sanjurajputt@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2006",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "SR.engg. at Ksw India Pvt Ltd",
      "experience": "SR.engg. at Ksw India Pvt Ltd",
      "contactinfo": "7065780094",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Waris akhtar",
    "userid": "04ECE03",
    "usertype": "alumni",
    "email": "waris.akhtar@jspl.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2004",
      "branch": "ECE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Deputy Manager at Jindal Steel & Power Limited",
      "experience": "Deputy Manager at Jindal Steel & Power Limited",
      "contactinfo": "9685700181",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Abhishek Dubey",
    "userid": "06CSE11",
    "usertype": "alumni",
    "email": "abhishekdubeyit@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2006",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "HOD (Computer Science) at BPS Public School, Vidya Vihar, Etah",
      "experience": "HOD (Computer Science) at BPS Public School, Vidya Vihar, Etah",
      "contactinfo": "9358533665",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Manvendra Singh",
    "userid": "07CSE09",
    "usertype": "alumni",
    "email": "monukushwaha09@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2007",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Junior Engineer at Samsung India",
      "experience": "Junior Engineer at Samsung India",
      "contactinfo": "9811168931",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Rahul Sisodiya",
    "userid": "07CSE10",
    "usertype": "alumni",
    "email": "rsrahulsisodiya@live.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2007",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Team Leader at Progressive Infotech Pvt. Ltd.",
      "experience": "Team Leader at Progressive Infotech Pvt. Ltd.",
      "contactinfo": "9752859857",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Vikash Kumar",
    "userid": "06CSE12",
    "usertype": "alumni",
    "email": "vikashkrthakur@yahoo.co.in",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2006",
      "branch": "CSE",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Project Asst -III, Software Engineer at CSIR CRRI",
      "experience": "Project Asst -III, Software Engineer at CSIR CRRI",
      "contactinfo": "8750991020",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Abhishek Mohan",
    "userid": "99ME01",
    "usertype": "alumni",
    "email": "abhishek248mohan@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1999",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Senior Manager at Isgec Heavy Engineering Limited",
      "experience": "Senior Manager at Isgec Heavy Engineering Limited",
      "contactinfo": "9971255110",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Ajay Kumar dakch",
    "userid": "99ME02",
    "usertype": "alumni",
    "email": "ajay.dakch@in.edag.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1999",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Group leader at Edag engineering and design India pvt Ltd",
      "experience": "Group leader at Edag engineering and design India pvt Ltd",
      "contactinfo": "9999199948",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Alok Chandra",
    "userid": "00ME01",
    "usertype": "alumni",
    "email": "alokchandra_7@hotmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2000",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Secretary at Mini Shikshan Prashikshan Society",
      "experience": "Secretary at Mini Shikshan Prashikshan Society",
      "contactinfo": "9319202129",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Amit Agarwal",
    "userid": "98ME01",
    "usertype": "alumni",
    "email": "amitiet05@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1998",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "DGM at Jindal Mectec private limited",
      "experience": "DGM at Jindal Mectec private limited",
      "contactinfo": "9911523339",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "amit goldi",
    "userid": "05ME01",
    "usertype": "alumni",
    "email": "amitgoldi7@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2005",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Ass. Manager at Aster Building solutions pvt. Ltd.",
      "experience": "Ass. Manager at Aster Building solutions pvt. Ltd.",
      "contactinfo": "7600213743",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Amit Singh Rana",
    "userid": "02ME01",
    "usertype": "alumni",
    "email": "mechfire4@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2002",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Deputy Manager at Amity Noida",
      "experience": "Deputy Manager at Amity Noida",
      "contactinfo": "8791011777",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "ANIL gangwar",
    "userid": "99ME03",
    "usertype": "alumni",
    "email": "er.anilgangwar9@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1999",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Chairman at Dr.ram bahadur singh memorial degree college milak",
      "experience": "Chairman at Dr.ram bahadur singh memorial degree college milak",
      "contactinfo": "8171211111",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Anil Kumar Singh",
    "userid": "07ME01",
    "usertype": "alumni",
    "email": "anil07me03@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2007",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Maintenance Engineer at Silverton speciality Pvt LTD",
      "experience": "Maintenance Engineer at Silverton speciality Pvt LTD",
      "contactinfo": "9027661976",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Ankit Agrawal",
    "userid": "03ME01",
    "usertype": "alumni",
    "email": "ankit_agra@rediffmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2003",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "National - Head at Mohani Tea Leaves Pvt Ltd",
      "experience": "National - Head at Mohani Tea Leaves Pvt Ltd",
      "contactinfo": "8800558071",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Ankit Mittal",
    "userid": "01ME01",
    "usertype": "alumni",
    "email": "ankit8085@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2001",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Design Engineer at Fluor Corp",
      "experience": "Design Engineer at Fluor Corp",
      "contactinfo": "9650237766",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Atul Kumar Singh",
    "userid": "04ME01",
    "usertype": "alumni",
    "email": "atul5169@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2004",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "No input provided",
      "experience": "No input provided",
      "contactinfo": "8003190940",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "AVIJEET SURYAVANSHI",
    "userid": "07ME02",
    "usertype": "alumni",
    "email": "avijeetsuryavanshi@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2007",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Technical Manager-Design (CAD/CAM/CAE) at CADSoft Technologies",
      "experience": "Technical Manager-Design (CAD/CAM/CAE) at CADSoft Technologies",
      "contactinfo": "9917991708",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "AVNISH KUMAR SINGH",
    "userid": "98ME02",
    "usertype": "alumni",
    "email": "krsingh.avnish@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1998",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Sr Manager at NTPC",
      "experience": "Sr Manager at NTPC",
      "contactinfo": "9412771802",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Bhoopendra Singh",
    "userid": "00ME02",
    "usertype": "alumni",
    "email": "bhoopendra.singh@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2000",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Founder at GMATINSIGHT",
      "experience": "Founder at GMATINSIGHT",
      "contactinfo": "9999687183",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "BRIJESH KUMAR",
    "userid": "99ME04",
    "usertype": "alumni",
    "email": "brijesh2209@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1999",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Manager at ARVOS Energy",
      "experience": "Manager at ARVOS Energy",
      "contactinfo": "9873274098",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Chhatra Pal Singh",
    "userid": "98ME03",
    "usertype": "alumni",
    "email": "call2cpsingh@yahoo.co.in",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1998",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Manager at Hindustan Aeronautics Limited",
      "experience": "Manager at Hindustan Aeronautics Limited",
      "contactinfo": "9422244815",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Dr SURYA PRAKASH",
    "userid": "02ME02",
    "usertype": "alumni",
    "email": "suryayadav8383@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2002",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Assistant Professor at BML Munjal University Gurgaon",
      "experience": "Assistant Professor at BML Munjal University Gurgaon",
      "contactinfo": "7877445401",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Gajender Kumar",
    "userid": "10ME01",
    "usertype": "alumni",
    "email": "kumar.gk.93@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2010",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Engineer at Havells India Ltd",
      "experience": "Engineer at Havells India Ltd",
      "contactinfo": "8791324022",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Harendra Kumar",
    "userid": "99ME05",
    "usertype": "alumni",
    "email": "kumarharendra48@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1999",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Manager at Hindustan Aeronautics Limited",
      "experience": "Manager at Hindustan Aeronautics Limited",
      "contactinfo": "9936442375",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Hemant k singh",
    "userid": "99ME06",
    "usertype": "alumni",
    "email": "hemantkumar_iet@rediffmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1999",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Sr manager at Tata motors",
      "experience": "Sr manager at Tata motors",
      "contactinfo": "7755001941",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Jitendra pal singh",
    "userid": "05ME02",
    "usertype": "alumni",
    "email": "singhjitendra22@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2005",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Project engineer at Simplex infrastructure limited",
      "experience": "Project engineer at Simplex infrastructure limited",
      "contactinfo": "7016573325",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Jitendra Varshney",
    "userid": "06ME01",
    "usertype": "alumni",
    "email": "j.varshneymech@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2006",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Director at Tanwar Enterprises",
      "experience": "Director at Tanwar Enterprises",
      "contactinfo": "9891474205",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Manish Dixit",
    "userid": "07ME03",
    "usertype": "alumni",
    "email": "manishdixit90@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2007",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Asst. Professor at Institute of engineering and technology khandari Agra",
      "experience": "Asst. Professor at Institute of engineering and technology khandari Agra",
      "contactinfo": "8273525600",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Manish Katara",
    "userid": "98ME04",
    "usertype": "alumni",
    "email": "katara.manish2002@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1998",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Govt",
      "experience": "Govt",
      "contactinfo": "7073884434",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Mayank saraswat",
    "userid": "07ME04",
    "usertype": "alumni",
    "email": "saraswatmayank89@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2007",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Executive at Stumpp Schuele & Somappa Auto Suspension Sysstems Pvt. Ltd. Gurgaon",
      "experience": "Executive at Stumpp Schuele & Somappa Auto Suspension Sysstems Pvt. Ltd. Gurgaon",
      "contactinfo": "8830237386",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Narendra Singh",
    "userid": "01ME02",
    "usertype": "alumni",
    "email": "narendramech84@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2001",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "No input provided",
      "experience": "No input provided",
      "contactinfo": "9897565520",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Nishit Singh",
    "userid": "99ME07",
    "usertype": "alumni",
    "email": "nishit.singh@nexionpro.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1999",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Co-Founder at NexionPro Services LLP",
      "experience": "Co-Founder at NexionPro Services LLP",
      "contactinfo": "8800255422",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Nitin Kishore",
    "userid": "03ME02",
    "usertype": "alumni",
    "email": "nitin2gud4u@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2003",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Sr Engineer at BHEL",
      "experience": "Sr Engineer at BHEL",
      "contactinfo": "9690122229",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "PIYUSH CHAUDHARY",
    "userid": "03ME03",
    "usertype": "alumni",
    "email": "er.piyush07@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2003",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "No input provided",
      "experience": "No input provided",
      "contactinfo": "8077207879",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Rajat",
    "userid": "03ME04",
    "usertype": "alumni",
    "email": "rajat2mech@yahoo.co.in",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2003",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Project Manager at Allan Lloyds Events",
      "experience": "Project Manager at Allan Lloyds Events",
      "contactinfo": "9528602388",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Rajesh Singh",
    "userid": "09ME01",
    "usertype": "alumni",
    "email": "rajeshyadav3112@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2009",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Project Associate",
      "experience": "Project Associate",
      "contactinfo": "7503346504",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Rashid khan",
    "userid": "05ME03",
    "usertype": "alumni",
    "email": "rashidkhan1987@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2005",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Asst. Prof. at DCTM,Palwal",
      "experience": "Asst. Prof. at DCTM,Palwal",
      "contactinfo": "8218691377",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Ravindra Singh",
    "userid": "07ME05",
    "usertype": "alumni",
    "email": "rsdj3553@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2007",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "No input provided",
      "experience": "No input provided",
      "contactinfo": "9808784727",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Sachin Dev",
    "userid": "07ME06",
    "usertype": "alumni",
    "email": "sachindev157@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2007",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Asset manager",
      "experience": "Asset manager",
      "contactinfo": "7408441485",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Sandeep Dahiya",
    "userid": "03ME05",
    "usertype": "alumni",
    "email": "rajdahiya2003@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2003",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Deputy Manager at ASK AUTOMOTIVE P LTD",
      "experience": "Deputy Manager at ASK AUTOMOTIVE P LTD",
      "contactinfo": "7417469873",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Saurabh Pachauri",
    "userid": "06ME02",
    "usertype": "alumni",
    "email": "saurabhme.pachauri@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2006",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Asstt. Professor at IET Kandari Agra",
      "experience": "Asstt. Professor at IET Kandari Agra",
      "contactinfo": "9027088364",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "SHARDHA NAND SINGH",
    "userid": "04ME02",
    "usertype": "alumni",
    "email": "singh_shardha@rediffmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2004",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Assistant Manager at ONGC Petro additions Limited",
      "experience": "Assistant Manager at ONGC Petro additions Limited",
      "contactinfo": "9099999383",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "SHASHANK SHEKHAR",
    "userid": "10ME02",
    "usertype": "alumni",
    "email": "shanksrajput92@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2010",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "No input provided",
      "experience": "No input provided",
      "contactinfo": "8285028210",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Sumit kumar",
    "userid": "03ME06",
    "usertype": "alumni",
    "email": "sumitsks91@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2003",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Assist. Professor at Sachdeva institute of engineering and technology",
      "experience": "Assist. Professor at Sachdeva institute of engineering and technology",
      "contactinfo": "9997431361",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Tarun kumar",
    "userid": "07ME07",
    "usertype": "alumni",
    "email": "tarunkumar89781@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2007",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "ATO at Department of technical education u.p",
      "experience": "ATO at Department of technical education u.p",
      "contactinfo": "8130625111",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "TEJ PRATAP SINGH",
    "userid": "07ME08",
    "usertype": "alumni",
    "email": "tejpratap_singh8180@rediffmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2007",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "No input provided",
      "experience": "No input provided",
      "contactinfo": "8449932153",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Ujjwal Kumar",
    "userid": "04ME03",
    "usertype": "alumni",
    "email": "ujjwal.k150385@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2004",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Demand and Supply Planning Mgr. at ABInbev",
      "experience": "Demand and Supply Planning Mgr. at ABInbev",
      "contactinfo": "97152854657",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Vaibhav Kumar",
    "userid": "03ME07",
    "usertype": "alumni",
    "email": "vaibhav_kgupta@yahoo.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "2003",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Manager at Tata Chemicals Ltd.",
      "experience": "Manager at Tata Chemicals Ltd.",
      "contactinfo": "8408955544",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "vijay dixit",
    "userid": "99ME08",
    "usertype": "alumni",
    "email": "vijay_99me20@rediffmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1999",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Manager at STEEL AUTHORITY INDIA LIMITED",
      "experience": "Manager at STEEL AUTHORITY INDIA LIMITED",
      "contactinfo": "9407982832",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "vipulchakravarty",
    "userid": "99ME09",
    "usertype": "alumni",
    "email": "rush2vipul@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1999",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Engineering Manager at Larsen & Toubro Limited",
      "experience": "Engineering Manager at Larsen & Toubro Limited",
      "contactinfo": "9818820678",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Vivek chadha",
    "userid": "98ME05",
    "usertype": "alumni",
    "email": "vivek.chadha.itw@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1998",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Regional Sales Manager at Henkel Adhesives Technologies",
      "experience": "Regional Sales Manager at Henkel Adhesives Technologies",
      "contactinfo": "9310065535",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  },
  {
    "personname": "Vivek Kumar Singh",
    "userid": "99ME10",
    "usertype": "alumni",
    "email": "vksingh18881@gmail.com",
    "userprivacy": "public",
    "salt": "",
    "passwordhash": "",
    "personimage": "Empty",
    "details": {
      "batch": "1999",
      "branch": "ME",
      "aboutme": "No input provided",
      "education": "No input provided",
      "currentrole": "Director at Chipsnkits Technologies Pvt Ltd",
      "experience": "Director at Chipsnkits Technologies Pvt Ltd",
      "contactinfo": "9718534313",
      "resume": "empty"
    },
    "data": {
      "job_ids": [],
      "event_ids": []
    },
    "verified": true
  }
]; // End of usersJsonData

/**
 * Connects to the MongoDB database.
 */
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit process with failure
  }
};

/**
 * Processes user data (hashes passwords) and inserts it into the MongoDB collection.
 */
async function loadDataFromJsonToDb() {
  // 1. Connect to the database
  await connectDB();

  try {
    // 2. Validate embedded JSON data
    if (!Array.isArray(usersJsonData)) {
      console.error("Error: Embedded user data (usersJsonData) is not an array.");
      return;
    }
    if (usersJsonData.length === 0) {
      console.log("Embedded user data is empty. No data to insert.");
      return;
    }
    console.log(`Processing ${usersJsonData.length} records from embedded JSON data.`);

    // 3. Process users: Set password to userid and hash it
    const processedUsers = [];
    for (const rawUser of usersJsonData) {
      const userData = { ...rawUser }; // Create a shallow copy

      if (!userData.userid || typeof userData.userid !== 'string' || userData.userid.trim() === '') {
        console.warn(`Skipping user due to missing or invalid userid. Record: ${JSON.stringify(userData)}`);
        continue;
      }

      try {
        const plainPassword = userData.userid; // Password will be the userid

        // Use the hashPassword function defined in this script
        const hashingResult = hashPassword(plainPassword); // This now uses the crypto-based function

        // The hashPassword function returns { salt, passwordhash }
        // Ensure your Alumni model schema has fields named 'salt' and 'passwordhash'
        userData.salt = hashingResult.salt;
        userData.passwordhash = hashingResult.passwordhash; // Ensure this matches your schema field name

        // Remove any temporary error fields that might have been added in previous processing steps
        delete userData.userid_update_error;
        delete userData.userid_parse_error;

        processedUsers.push(userData);

      } catch (error) {
        console.error(`Error hashing password for user with userid '${userData.userid}': ${error.message}`);
        continue; // Skip this user on hashing error
      }
    }

    if (processedUsers.length === 0) {
      console.log("No users were successfully processed for database insertion.");
      return;
    }

    // 4. Insert the processed data into the MongoDB collection
    console.log(`Attempting to insert ${processedUsers.length} processed users into the '${Alumni.collection.name}' collection...`);

    // Optional: Clear the collection before inserting new data
    // console.log("Clearing existing data from the collection...");
    // await Alumni.deleteMany({});
    // console.log("Collection cleared.");

    const result = await Alumni.insertMany(processedUsers, { ordered: false });
    console.log(`Successfully inserted ${result.length} users into the database.`);

    if (result.length !== processedUsers.length) {
        console.warn(`Could not insert all processed users. Expected: ${processedUsers.length}, Inserted: ${result.length}. Check for individual errors if 'ordered: false' was used.`);
    }

  } catch (error) {
    console.error("An error occurred during the data loading process:", error);
    if (error.writeErrors) {
        console.error("Specific write errors:", error.writeErrors);
    }
  } finally {
    // 5. Close the MongoDB connection
    console.log("Disconnecting from MongoDB...");
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
}

// --- Run the Script ---
loadDataFromJsonToDb().catch(error => {
  console.error("Unhandled error in loadDataFromJsonToDb:", error);
  mongoose.disconnect();
});

/*
Instructions to use this script:
1.  Save this code: Save it as a `.js` file (e.g., `importEmbeddedData.js`) in your Node.js project.
2.  Model Path:
    * Ensure the path to your Mongoose model (`../models/users` or similar) in the `require` statement is correct relative to where you save this script.
3.  Install Dependencies: If you haven't already, in your project's root terminal:
    npm install mongoose
    (The `crypto` module is built-in, no separate install needed.)
4.  Configure:
    * Update `MONGO_URI` at the top of the script with your correct MongoDB connection string and database name.
5.  Schema Check:
    * Verify that your `Alumni` Mongoose model schema has fields named `salt` (String) and `passwordhash` (String) to store the hashed password components.
6.  Run the script: Execute it from your terminal (navigate to the directory where you saved it):
    node importEmbeddedData.js
7.  Verify: Check your MongoDB database and the specified collection to confirm the data has been inserted with correctly hashed passwords and salts.
*/
