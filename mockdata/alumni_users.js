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
const MONGO_URI = process.env.mongoURI
// const MONGO_URI = 'mongodb://localhost:27017/'; // Local MongoDB URI
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
// const usersJsonData = [
//   {
//     "personname": "ABHINIT KUMAR SINGH",
//     "userid": "07CSE01",
//     "usertype": "alumni",
//     "email": "abhinit.singh001@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2007",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "ASSISTANT QUALITY MANAGER at SUPA STAR FOODS PVT. LTD., UDHYOG VIHAR PHASE 4, GURGAON",
//       "experience": "ASSISTANT QUALITY MANAGER at SUPA STAR FOODS PVT. LTD., UDHYOG VIHAR PHASE 4, GURGAON",
//       "contactinfo": "9818137509",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Abhishek Sharma",
//     "userid": "07CSE02",
//     "usertype": "alumni",
//     "email": "asabhi188@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2007",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Assistant Manager at Engrow Enviro Technocrats",
//       "experience": "Assistant Manager at Engrow Enviro Technocrats",
//       "contactinfo": "9452091107",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Akshay kumar",
//     "userid": "06CSE01",
//     "usertype": "alumni",
//     "email": "akshayrajpathak@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2006",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "No input provided",
//       "experience": "No input provided",
//       "contactinfo": "8840336044",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Anurag Chaudhary",
//     "userid": "08CSE01",
//     "usertype": "alumni",
//     "email": "anuragchaudhary77@hotmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2008",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Asst. Manager at G K winding wires ltd",
//       "experience": "Asst. Manager at G K winding wires ltd",
//       "contactinfo": "9711787843",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Anurag Ojha",
//     "userid": "03CSE01",
//     "usertype": "alumni",
//     "email": "ojhaanurag83@yahoo.in",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2003",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "HOD - PPIC at INBISCO INDIA",
//       "experience": "HOD - PPIC at INBISCO INDIA",
//       "contactinfo": "9558673562",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Avinash Kumar Sharma",
//     "userid": "07CSE03",
//     "usertype": "alumni",
//     "email": "avinashsharma754@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2007",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "QA Manager at Suppletek Industries Pvt Ltd",
//       "experience": "QA Manager at Suppletek Industries Pvt Ltd",
//       "contactinfo": "7087010995",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Chandan Singh",
//     "userid": "05CSE01",
//     "usertype": "alumni",
//     "email": "er.singhchandan@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2005",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Manager Operations at Vark snack food pvt ltd",
//       "experience": "Manager Operations at Vark snack food pvt ltd",
//       "contactinfo": "7827913092",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "MAYANK GOVIL",
//     "userid": "07CSE04",
//     "usertype": "alumni",
//     "email": "mgovil96@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2007",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Production Manager at B.B. FOODS PVT. LTD.",
//       "experience": "Production Manager at B.B. FOODS PVT. LTD.",
//       "contactinfo": "7060980611",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Neeraj agarwal",
//     "userid": "06CSE02",
//     "usertype": "alumni",
//     "email": "erneerajagarwal@rediffmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2006",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Asst manager at Axis bank",
//       "experience": "Asst manager at Axis bank",
//       "contactinfo": "9411410897",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "nikhil kumar gupta",
//     "userid": "06CSE03",
//     "usertype": "alumni",
//     "email": "nik_btech@yahoo.co.in",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2006",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Process Engineer at Kansai Nerolac Pvt Ltd",
//       "experience": "Process Engineer at Kansai Nerolac Pvt Ltd",
//       "contactinfo": "7376566168",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Prashant Chauhan",
//     "userid": "07CSE05",
//     "usertype": "alumni",
//     "email": "chauhan_prashant@live.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2007",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Senior Database Admin at Wipro Technology",
//       "experience": "Senior Database Admin at Wipro Technology",
//       "contactinfo": "9878410463",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "praveen",
//     "userid": "07CSE06",
//     "usertype": "alumni",
//     "email": "praveen07bt@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2007",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "No input provided",
//       "experience": "No input provided",
//       "contactinfo": "9451229382",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Prem Bharti",
//     "userid": "06CSE04",
//     "usertype": "alumni",
//     "email": "greentecheemind@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2006",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Project Manager at Uneecops technologies ltd",
//       "experience": "Project Manager at Uneecops technologies ltd",
//       "contactinfo": "9540694381",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "RASHMI JADON",
//     "userid": "07CSE07",
//     "usertype": "alumni",
//     "email": "rashmi.jadon1991@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2007",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Quality Head at Robust trade link",
//       "experience": "Quality Head at Robust trade link",
//       "contactinfo": "8859442761",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Ratika Sharma",
//     "userid": "06CSE05",
//     "usertype": "alumni",
//     "email": "ratika@kamalautoworkd.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2006",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Owner at Kamlesh Autowheels Pvt. Ltd. Etah",
//       "experience": "Owner at Kamlesh Autowheels Pvt. Ltd. Etah",
//       "contactinfo": "9917966666",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Richa Singh",
//     "userid": "06CSE06",
//     "usertype": "alumni",
//     "email": "richasinghbt@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2006",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "PhD scholar at Sardar swaran Singh national institute of Bioenergy, kapurthala, punjab",
//       "experience": "PhD scholar at Sardar swaran Singh national institute of Bioenergy, kapurthala, punjab",
//       "contactinfo": "7982572369",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Yatin Tigdania",
//     "userid": "05CSE02",
//     "usertype": "alumni",
//     "email": "er.yatin09@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2005",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Deputy Manager at Apcer life sciences",
//       "experience": "Deputy Manager at Apcer life sciences",
//       "contactinfo": "9643169220",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Alok kumar mishra",
//     "userid": "06CE01",
//     "usertype": "alumni",
//     "email": "alokme2005@yahoo.co.in",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2006",
//       "branch": "CE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Junior engineer at Wrd jharkhand",
//       "experience": "Junior engineer at Wrd jharkhand",
//       "contactinfo": "9452540598",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Anurag yadav",
//     "userid": "06CE02",
//     "usertype": "alumni",
//     "email": "anuragyadavchandravanshi@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2006",
//       "branch": "CE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Director at Nss Buildcon pvt ltd",
//       "experience": "Director at Nss Buildcon pvt ltd",
//       "contactinfo": "9557555553",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Arpit Mathur",
//     "userid": "07CE01",
//     "usertype": "alumni",
//     "email": "arpit07ce07@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2007",
//       "branch": "CE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Asst highway engineer at Consulting engineers groups",
//       "experience": "Asst highway engineer at Consulting engineers groups",
//       "contactinfo": "9713801737",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "BRIJ KISHOR MORYA",
//     "userid": "05CE01",
//     "usertype": "alumni",
//     "email": "brijmorya786@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2005",
//       "branch": "CE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Junior Engineer at Mcd delhi",
//       "experience": "Junior Engineer at Mcd delhi",
//       "contactinfo": "8800717410",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Deepankar Singh",
//     "userid": "07CE02",
//     "usertype": "alumni",
//     "email": "deepankarsingh21@yahoo.in",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2007",
//       "branch": "CE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Assistant Engineer at (Panchayati Raj) Zila Panchayat",
//       "experience": "Assistant Engineer at (Panchayati Raj) Zila Panchayat",
//       "contactinfo": "9756874193",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Ghanshyam Gupta",
//     "userid": "04CE01",
//     "usertype": "alumni",
//     "email": "ghanshyam.gupta48@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2004",
//       "branch": "CE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "SSE at Indian Railways",
//       "experience": "SSE at Indian Railways",
//       "contactinfo": "9648671595",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Jayankesh Singh",
//     "userid": "06CE03",
//     "usertype": "alumni",
//     "email": "jayankesh@iiserb.ac.in",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2006",
//       "branch": "CE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Maintenance Engineer at Indian Institute of Science Education & Research , Bhopal",
//       "experience": "Maintenance Engineer at Indian Institute of Science Education & Research , Bhopal",
//       "contactinfo": "7389945804",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Kapil kant swaroop",
//     "userid": "05CE02",
//     "usertype": "alumni",
//     "email": "kapilkantswaroop@yahoo.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2005",
//       "branch": "CE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "T&P Officer at U.P. Technical education department",
//       "experience": "T&P Officer at U.P. Technical education department",
//       "contactinfo": "9027519968",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Love dixit",
//     "userid": "08CE01",
//     "usertype": "alumni",
//     "email": "lovedxt41@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2008",
//       "branch": "CE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Officer at Biltech building elements ltd",
//       "experience": "Officer at Biltech building elements ltd",
//       "contactinfo": "7043503301",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Mohd iqbal malik",
//     "userid": "08CE02",
//     "usertype": "alumni",
//     "email": "ermalik1989@yahoo.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2008",
//       "branch": "CE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Assistant engineer at PWD (R&B) JAMMU",
//       "experience": "Assistant engineer at PWD (R&B) JAMMU",
//       "contactinfo": "9622057697",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Rohit Roushan",
//     "userid": "02CE01",
//     "usertype": "alumni",
//     "email": "rohit.rousha@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2002",
//       "branch": "CE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Engg at Mcd",
//       "experience": "Engg at Mcd",
//       "contactinfo": "8527531556",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Saurabh Jindal",
//     "userid": "04CE02",
//     "usertype": "alumni",
//     "email": "jindal_iet@hotmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2004",
//       "branch": "CE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Manager at TATA Power",
//       "experience": "Manager at TATA Power",
//       "contactinfo": "9871222690",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Udaivir Singh",
//     "userid": "02CE02",
//     "usertype": "alumni",
//     "email": "jeudaiveer@yahoo.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2002",
//       "branch": "CE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Junior Enginer at Lucknow Development authority Lucknow",
//       "experience": "Junior Enginer at Lucknow Development authority Lucknow",
//       "contactinfo": "9927990422",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Vivek krishna singh",
//     "userid": "06CE04",
//     "usertype": "alumni",
//     "email": "vivekkrishnasingh@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2006",
//       "branch": "CE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "J.E (civil) at IISER Bhopal",
//       "experience": "J.E (civil) at IISER Bhopal",
//       "contactinfo": "9713007007",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Alok rajan rai",
//     "userid": "06CSE07",
//     "usertype": "alumni",
//     "email": "alokrrai06cs@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2006",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "I.t. engineer at C.dot",
//       "experience": "I.t. engineer at C.dot",
//       "contactinfo": "7007353693",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Ashish Kumar",
//     "userid": "00CSE01",
//     "usertype": "alumni",
//     "email": "ashishsp2002@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2000",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Training & Placement Officer at Sharda Group of Institutions",
//       "experience": "Training & Placement Officer at Sharda Group of Institutions",
//       "contactinfo": "9639014454",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Bhumika Agrahari",
//     "userid": "08CSE02",
//     "usertype": "alumni",
//     "email": "coolbhumi@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2008",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Equity analyst at JM financial",
//       "experience": "Equity analyst at JM financial",
//       "contactinfo": "9634081254",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "CHANDRA PRAKASH",
//     "userid": "06CSE08",
//     "usertype": "alumni",
//     "email": "Singh_862006@yahoo.co.in",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2006",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Assistant Manager at UBI",
//       "experience": "Assistant Manager at UBI",
//       "contactinfo": "8757212775",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Durgesh Kumar Tiwari",
//     "userid": "08CSE03",
//     "usertype": "alumni",
//     "email": "duek.cs15@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2008",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Asst. Manager at SMPCL",
//       "experience": "Asst. Manager at SMPCL",
//       "contactinfo": "9410008068",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Durgesh Pratap Singh",
//     "userid": "07CSE08",
//     "usertype": "alumni",
//     "email": "durgeshsingh0018@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2007",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Mission Manager at UPPCL",
//       "experience": "Mission Manager at UPPCL",
//       "contactinfo": "8791345939",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Harsh Sharma",
//     "userid": "09CSE01",
//     "usertype": "alumni",
//     "email": "harsh.sharma10070@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2009",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Software developer at American express",
//       "experience": "Software developer at American express",
//       "contactinfo": "9971780550",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "kaushal dev singh",
//     "userid": "02CSE01",
//     "usertype": "alumni",
//     "email": "dev.kaush@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2002",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "No input provided",
//       "experience": "No input provided",
//       "contactinfo": "9634126661",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Manish Kumar",
//     "userid": "06CSE09",
//     "usertype": "alumni",
//     "email": "1989man@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2006",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "CRA at DMRC",
//       "experience": "CRA at DMRC",
//       "contactinfo": "8445841392",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Mrdul kunar",
//     "userid": "09CSE02",
//     "usertype": "alumni",
//     "email": "mradulkunae1989@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2009",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "LLB at Delhi University",
//       "experience": "LLB at Delhi University",
//       "contactinfo": "7520567335",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Nagendra Pal Singh",
//     "userid": "99CSE01",
//     "usertype": "alumni",
//     "email": "er.npsingh@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1999",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "DO at LIC Of INDIA",
//       "experience": "DO at LIC Of INDIA",
//       "contactinfo": "9760884854",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Narendra Singh",
//     "userid": "06CSE10",
//     "usertype": "alumni",
//     "email": "nandi987@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2006",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Director at Registered Business",
//       "experience": "Director at Registered Business",
//       "contactinfo": "9005293255",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Nisheet Kumar",
//     "userid": "01CSE01",
//     "usertype": "alumni",
//     "email": "er.nkumar@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2001",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Director at Noida Fresh",
//       "experience": "Director at Noida Fresh",
//       "contactinfo": "9927090390",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Nitin Chandra",
//     "userid": "98CSE01",
//     "usertype": "alumni",
//     "email": "nitinchan@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1998",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Vice President at Royal Bank of Scotland",
//       "experience": "Vice President at Royal Bank of Scotland",
//       "contactinfo": "9910114326",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Pragati yadav",
//     "userid": "04CSE01",
//     "usertype": "alumni",
//     "email": "pragati.yadav87@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2004",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Technical Lead at Myntra designs Pvt ltd",
//       "experience": "Technical Lead at Myntra designs Pvt ltd",
//       "contactinfo": "9582463388",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "RAJEEV PANDEY",
//     "userid": "98CSE02",
//     "usertype": "alumni",
//     "email": "rajeev98iet@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1998",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Asst.Prof. at RGPV (MP)",
//       "experience": "Asst.Prof. at RGPV (MP)",
//       "contactinfo": "9479907881",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Ritesh Agarwal",
//     "userid": "98CSE03",
//     "usertype": "alumni",
//     "email": "ritesh_iit2003@yahoo.co.in",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1998",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Pricipal Software Engineer at Cadence Design Systems, Noida",
//       "experience": "Pricipal Software Engineer at Cadence Design Systems, Noida",
//       "contactinfo": "9911071198",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Shailendra Kumar",
//     "userid": "00CSE02",
//     "usertype": "alumni",
//     "email": "extremeshailendra@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2000",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Asst. Manager at Entab Infotech",
//       "experience": "Asst. Manager at Entab Infotech",
//       "contactinfo": "8860001123",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Somesh Shandilya",
//     "userid": "04CSE02",
//     "usertype": "alumni",
//     "email": "somesh.shandilya@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2004",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Assistant Professor at Faculty of Engineering and Technology, Agra College, Agra.",
//       "experience": "Assistant Professor at Faculty of Engineering and Technology, Agra College, Agra.",
//       "contactinfo": "9412811419",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Sumit gangwar",
//     "userid": "09CSE03",
//     "usertype": "alumni",
//     "email": "sumitgangwar0@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2009",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Sales manager at Pacific Green infraheights pvt Ltd",
//       "experience": "Sales manager at Pacific Green infraheights pvt Ltd",
//       "contactinfo": "8171771556",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Vijay Abrol",
//     "userid": "01CSE02",
//     "usertype": "alumni",
//     "email": "Samajwad@gmail.Com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2001",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Proprietor at Libra Infratechh",
//       "experience": "Proprietor at Libra Infratechh",
//       "contactinfo": "9219779999",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Vipul Uniyal",
//     "userid": "99CSE02",
//     "usertype": "alumni",
//     "email": "vipuluniyal81@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1999",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Co-Founder at NexionPro Services LLP",
//       "experience": "Co-Founder at NexionPro Services LLP",
//       "contactinfo": "8800439583",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Abhishek Kumar",
//     "userid": "00ECE01",
//     "usertype": "alumni",
//     "email": "kumar.abhi@hotmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2000",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Consultant at SAP India",
//       "experience": "Consultant at SAP India",
//       "contactinfo": "9999111615",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Abhishek Varshney",
//     "userid": "00ECE02",
//     "usertype": "alumni",
//     "email": "abhishek.varshney@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2000",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Senior Project Manager at General Electric",
//       "experience": "Senior Project Manager at General Electric",
//       "contactinfo": "8800394840",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Anil Singh",
//     "userid": "01ECE01",
//     "usertype": "alumni",
//     "email": "anilsingh.rf@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2001",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Senior Manager at Huawei Technologies",
//       "experience": "Senior Manager at Huawei Technologies",
//       "contactinfo": "7838929282",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Ankit Sharma",
//     "userid": "99ECE01",
//     "usertype": "alumni",
//     "email": "ankitsharma81@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1999",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "No input provided",
//       "experience": "No input provided",
//       "contactinfo": "9560502503",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Ankur Saxena",
//     "userid": "00ECE03",
//     "usertype": "alumni",
//     "email": "ankursaxena.india@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2000",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Project Manager at DXC Technolgies Ltd",
//       "experience": "Project Manager at DXC Technolgies Ltd",
//       "contactinfo": "9990046066",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Anurag Bhardwaj",
//     "userid": "98ECE01",
//     "usertype": "alumni",
//     "email": "anuragbhardwaj81@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1998",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Head - Business Developement at Flipkart",
//       "experience": "Head - Business Developement at Flipkart",
//       "contactinfo": "9990824666",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Arun Pratap Singh Yadav",
//     "userid": "99ECE02",
//     "usertype": "alumni",
//     "email": "apsyadav@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1999",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Service Product Manager at Nokia",
//       "experience": "Service Product Manager at Nokia",
//       "contactinfo": "919717599243",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Ashish Dubey",
//     "userid": "06ECE01",
//     "usertype": "alumni",
//     "email": "ashishsplendor@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2006",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "No input provided",
//       "experience": "No input provided",
//       "contactinfo": "7428236620",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "ASHISH KUMAR",
//     "userid": "06ECE02",
//     "usertype": "alumni",
//     "email": "ashishec13@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2006",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "R & D ENGINEER at POWERTAC",
//       "experience": "R & D ENGINEER at POWERTAC",
//       "contactinfo": "9457776662",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "ASHWANI KUMAR",
//     "userid": "09ECE01",
//     "usertype": "alumni",
//     "email": "pintukr19@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2009",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "EMBEDDED ENGINEER ROBOTICS",
//       "experience": "EMBEDDED ENGINEER ROBOTICS",
//       "contactinfo": "9013242049",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Baldev singh",
//     "userid": "00ECE04",
//     "usertype": "alumni",
//     "email": "bittu.4chaudhary@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2000",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Lecturer at Govt.polytechnic jhansi",
//       "experience": "Lecturer at Govt.polytechnic jhansi",
//       "contactinfo": "9411683901",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Deepak Jain",
//     "userid": "98ECE02",
//     "usertype": "alumni",
//     "email": "deepak.jain@fracton.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1998",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Director at Fracton Technologies",
//       "experience": "Director at Fracton Technologies",
//       "contactinfo": "8447750638",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Deepak Kumar",
//     "userid": "99ECE03",
//     "usertype": "alumni",
//     "email": "deepak.rf@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1999",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Network Planning & Optimization Specialist at Nokia Pvt. Ltd",
//       "experience": "Network Planning & Optimization Specialist at Nokia Pvt. Ltd",
//       "contactinfo": "8376803656",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "GAURAV AGARWAL",
//     "userid": "02ECE01",
//     "usertype": "alumni",
//     "email": "hi.imgaurav@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2002",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "No input provided",
//       "experience": "No input provided",
//       "contactinfo": "9760045789",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Gaurav Kumar Singh",
//     "userid": "01ECE02",
//     "usertype": "alumni",
//     "email": "singh.gauravdev7@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2001",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Chairperson at R.K.G.M Institute Of Technology and Management Sikandra Agra",
//       "experience": "Chairperson at R.K.G.M Institute Of Technology and Management Sikandra Agra",
//       "contactinfo": "9760468737",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "HARENDRA NARAYAN",
//     "userid": "00ECE05",
//     "usertype": "alumni",
//     "email": "narayan.harendra@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2000",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "IAS at Govt Of India,Madhya Prades",
//       "experience": "IAS at Govt Of India,Madhya Prades",
//       "contactinfo": "8000442100",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Kumar Vaibhav",
//     "userid": "01ECE03",
//     "usertype": "alumni",
//     "email": "kumarvaibhav2003@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2001",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Team Lead at Accenture Solutions",
//       "experience": "Team Lead at Accenture Solutions",
//       "contactinfo": "8005858497",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Mohit Khandelwal",
//     "userid": "04ECE01",
//     "usertype": "alumni",
//     "email": "mohitkh1984@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2004",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Controls Engineer at General Electric",
//       "experience": "Controls Engineer at General Electric",
//       "contactinfo": "9871074489",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Mohit Kumar",
//     "userid": "01ECE04",
//     "usertype": "alumni",
//     "email": "mohit.dt@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2001",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Dy. Manager at Reliance JIO",
//       "experience": "Dy. Manager at Reliance JIO",
//       "contactinfo": "7009226256",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Navin singhal",
//     "userid": "99ECE04",
//     "usertype": "alumni",
//     "email": "vinayakglasstechsolutions@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1999",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Owner at G. S. Enterprise",
//       "experience": "Owner at G. S. Enterprise",
//       "contactinfo": "8193066000",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Pankaj Gautam",
//     "userid": "07ECE01",
//     "usertype": "alumni",
//     "email": "pankajgautamiet@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2007",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Jila vistarak at B.J.P.",
//       "experience": "Jila vistarak at B.J.P.",
//       "contactinfo": "9557510951",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Prabhakar Saxena",
//     "userid": "98ECE03",
//     "usertype": "alumni",
//     "email": "prabhakar_ec@rediffmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1998",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Sr. Manager at HAL",
//       "experience": "Sr. Manager at HAL",
//       "contactinfo": "9881300886",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Pradeep Kumar",
//     "userid": "99ECE05",
//     "usertype": "alumni",
//     "email": "pradeep@addnum.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1999",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Solution Manager at Nokia",
//       "experience": "Solution Manager at Nokia",
//       "contactinfo": "9910852299",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Pravesh Shrivastava",
//     "userid": "07ECE02",
//     "usertype": "alumni",
//     "email": "prv.shri@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2007",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Team Leader at BT-Data & Surveying Services India Pvt Ltd",
//       "experience": "Team Leader at BT-Data & Surveying Services India Pvt Ltd",
//       "contactinfo": "9910688794",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Rajat Kumar",
//     "userid": "98ECE04",
//     "usertype": "alumni",
//     "email": "rajblink1981@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1998",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Specialist at Ericsson",
//       "experience": "Specialist at Ericsson",
//       "contactinfo": "8861005085",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Ram Prakash",
//     "userid": "98ECE05",
//     "usertype": "alumni",
//     "email": "ram.prakash22@outlook.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1998",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Sr. Manager at KEC International Ltd",
//       "experience": "Sr. Manager at KEC International Ltd",
//       "contactinfo": "9971117445",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "ratika bhardwaj",
//     "userid": "03ECE01",
//     "usertype": "alumni",
//     "email": "ratika_bhardwaj2001@yahoo.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2003",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Asst Manager Marketing at Arc International",
//       "experience": "Asst Manager Marketing at Arc International",
//       "contactinfo": "9643843049",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Sandeep Sharma",
//     "userid": "98ECE06",
//     "usertype": "alumni",
//     "email": "sandeep.5g@outlook.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1998",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "GM at Ericsson Global",
//       "experience": "GM at Ericsson Global",
//       "contactinfo": "8826298724",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Sanjeev Kumar",
//     "userid": "01ECE05",
//     "usertype": "alumni",
//     "email": "skumar111982@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2001",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Manager at Bharti AIrtel Limited",
//       "experience": "Manager at Bharti AIrtel Limited",
//       "contactinfo": "9971108829",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Shailendra Pratap Singh",
//     "userid": "06ECE03",
//     "usertype": "alumni",
//     "email": "spsingh.licdo@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2006",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "DEVELOPMENT OFFICER at Life Insurance Corporuption Of India",
//       "experience": "DEVELOPMENT OFFICER at Life Insurance Corporuption Of India",
//       "contactinfo": "8534900444",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Shantanu srivastava",
//     "userid": "08ECE01",
//     "usertype": "alumni",
//     "email": "shantanusri123@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2008",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Engineer at Idea cellular ltd.",
//       "experience": "Engineer at Idea cellular ltd.",
//       "contactinfo": "9540001047",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Shishupal Singh",
//     "userid": "98ECE07",
//     "usertype": "alumni",
//     "email": "shakyarsp@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1998",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Zonal Project Manager at Nokia Solutions and Networks",
//       "experience": "Zonal Project Manager at Nokia Solutions and Networks",
//       "contactinfo": "9539684446",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Shivangi",
//     "userid": "02ECE02",
//     "usertype": "alumni",
//     "email": "neha.hopes@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2002",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Dy Manager at BHEL",
//       "experience": "Dy Manager at BHEL",
//       "contactinfo": "9953160476",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "UPENDRA KUMAR MISHRA",
//     "userid": "10ECE01",
//     "usertype": "alumni",
//     "email": "mishraupen.92@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2010",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Mtech at davv indore mp",
//       "experience": "Mtech at davv indore mp",
//       "contactinfo": "8285161491",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Veer Singh",
//     "userid": "05ECE01",
//     "usertype": "alumni",
//     "email": "veersingh9587@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2005",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "No input provided",
//       "experience": "No input provided",
//       "contactinfo": "8373917039",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Abhay Singh",
//     "userid": "02ECE03",
//     "usertype": "alumni",
//     "email": "si.abhay@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2002",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Asst. Manager at Armacell India Pvt Ltd",
//       "experience": "Asst. Manager at Armacell India Pvt Ltd",
//       "contactinfo": "9899853087",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "ALOK PACHAURI",
//     "userid": "02ECE04",
//     "usertype": "alumni",
//     "email": "alokpachauri2000@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2002",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "S.D.O. at BSNL",
//       "experience": "S.D.O. at BSNL",
//       "contactinfo": "9412811547",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Amit Yadav",
//     "userid": "07ECE03",
//     "usertype": "alumni",
//     "email": "amit.dreams06@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2007",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Deputy Manager at UKB Electronics PVT Ltd",
//       "experience": "Deputy Manager at UKB Electronics PVT Ltd",
//       "contactinfo": "8882248098",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Ankush Pratap",
//     "userid": "08ECE02",
//     "usertype": "alumni",
//     "email": "ankush.pratap@yahoo.in",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2008",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Instrumentation and Control Engineer at AHI Carrier Fzc Sharjah",
//       "experience": "Instrumentation and Control Engineer at AHI Carrier Fzc Sharjah",
//       "contactinfo": "9761642850",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Ashish Kumar Mogha",
//     "userid": "02ECE05",
//     "usertype": "alumni",
//     "email": "mogha.npl@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2002",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Deputy Manager at Larsen & Toubro ltd",
//       "experience": "Deputy Manager at Larsen & Toubro ltd",
//       "contactinfo": "9779245398",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "aviral sharma",
//     "userid": "03ECE02",
//     "usertype": "alumni",
//     "email": "aviralsharma06@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2003",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "senior consultant at atos",
//       "experience": "senior consultant at atos",
//       "contactinfo": "9871126703",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Diwakar Gupta",
//     "userid": "02ECE06",
//     "usertype": "alumni",
//     "email": "diwakar.divi@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2002",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "No input provided",
//       "experience": "No input provided",
//       "contactinfo": "9560199910",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Dr. Om prakash verma",
//     "userid": "04ECE02",
//     "usertype": "alumni",
//     "email": "vermaop@nitj.ac.in",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2004",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "ASSISTANT PROFESSOR at NIT JALANDHAR",
//       "experience": "ASSISTANT PROFESSOR at NIT JALANDHAR",
//       "contactinfo": "7579279839",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "JITENDER chaudhary",
//     "userid": "02ECE07",
//     "usertype": "alumni",
//     "email": "jeet_engg_sai@yahoo.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2002",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "AO-IT at LIC of India",
//       "experience": "AO-IT at LIC of India",
//       "contactinfo": "9015551152",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "PRAVEEN KUSHWAHA",
//     "userid": "02ECE08",
//     "usertype": "alumni",
//     "email": "ei.praveen@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2002",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "JTO at BSNL",
//       "experience": "JTO at BSNL",
//       "contactinfo": "9412221718",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Rahul Agnihotri",
//     "userid": "07ECE04",
//     "usertype": "alumni",
//     "email": "rahul.agnihotri277@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2007",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Sr. Engineer Quality at Bajaj Electricals Ltd.",
//       "experience": "Sr. Engineer Quality at Bajaj Electricals Ltd.",
//       "contactinfo": "9012708631",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Sanju Singh rajput",
//     "userid": "06ECE04",
//     "usertype": "alumni",
//     "email": "err.sanjurajputt@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2006",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "SR.engg. at Ksw India Pvt Ltd",
//       "experience": "SR.engg. at Ksw India Pvt Ltd",
//       "contactinfo": "7065780094",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Waris akhtar",
//     "userid": "04ECE03",
//     "usertype": "alumni",
//     "email": "waris.akhtar@jspl.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2004",
//       "branch": "ECE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Deputy Manager at Jindal Steel & Power Limited",
//       "experience": "Deputy Manager at Jindal Steel & Power Limited",
//       "contactinfo": "9685700181",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Abhishek Dubey",
//     "userid": "06CSE11",
//     "usertype": "alumni",
//     "email": "abhishekdubeyit@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2006",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "HOD (Computer Science) at BPS Public School, Vidya Vihar, Etah",
//       "experience": "HOD (Computer Science) at BPS Public School, Vidya Vihar, Etah",
//       "contactinfo": "9358533665",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Manvendra Singh",
//     "userid": "07CSE09",
//     "usertype": "alumni",
//     "email": "monukushwaha09@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2007",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Junior Engineer at Samsung India",
//       "experience": "Junior Engineer at Samsung India",
//       "contactinfo": "9811168931",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Rahul Sisodiya",
//     "userid": "07CSE10",
//     "usertype": "alumni",
//     "email": "rsrahulsisodiya@live.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2007",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Team Leader at Progressive Infotech Pvt. Ltd.",
//       "experience": "Team Leader at Progressive Infotech Pvt. Ltd.",
//       "contactinfo": "9752859857",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Vikash Kumar",
//     "userid": "06CSE12",
//     "usertype": "alumni",
//     "email": "vikashkrthakur@yahoo.co.in",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2006",
//       "branch": "CSE",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Project Asst -III, Software Engineer at CSIR CRRI",
//       "experience": "Project Asst -III, Software Engineer at CSIR CRRI",
//       "contactinfo": "8750991020",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Abhishek Mohan",
//     "userid": "99ME01",
//     "usertype": "alumni",
//     "email": "abhishek248mohan@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1999",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Senior Manager at Isgec Heavy Engineering Limited",
//       "experience": "Senior Manager at Isgec Heavy Engineering Limited",
//       "contactinfo": "9971255110",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Ajay Kumar dakch",
//     "userid": "99ME02",
//     "usertype": "alumni",
//     "email": "ajay.dakch@in.edag.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1999",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Group leader at Edag engineering and design India pvt Ltd",
//       "experience": "Group leader at Edag engineering and design India pvt Ltd",
//       "contactinfo": "9999199948",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Alok Chandra",
//     "userid": "00ME01",
//     "usertype": "alumni",
//     "email": "alokchandra_7@hotmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2000",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Secretary at Mini Shikshan Prashikshan Society",
//       "experience": "Secretary at Mini Shikshan Prashikshan Society",
//       "contactinfo": "9319202129",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Amit Agarwal",
//     "userid": "98ME01",
//     "usertype": "alumni",
//     "email": "amitiet05@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1998",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "DGM at Jindal Mectec private limited",
//       "experience": "DGM at Jindal Mectec private limited",
//       "contactinfo": "9911523339",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "amit goldi",
//     "userid": "05ME01",
//     "usertype": "alumni",
//     "email": "amitgoldi7@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2005",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Ass. Manager at Aster Building solutions pvt. Ltd.",
//       "experience": "Ass. Manager at Aster Building solutions pvt. Ltd.",
//       "contactinfo": "7600213743",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Amit Singh Rana",
//     "userid": "02ME01",
//     "usertype": "alumni",
//     "email": "mechfire4@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2002",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Deputy Manager at Amity Noida",
//       "experience": "Deputy Manager at Amity Noida",
//       "contactinfo": "8791011777",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "ANIL gangwar",
//     "userid": "99ME03",
//     "usertype": "alumni",
//     "email": "er.anilgangwar9@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1999",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Chairman at Dr.ram bahadur singh memorial degree college milak",
//       "experience": "Chairman at Dr.ram bahadur singh memorial degree college milak",
//       "contactinfo": "8171211111",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Anil Kumar Singh",
//     "userid": "07ME01",
//     "usertype": "alumni",
//     "email": "anil07me03@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2007",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Maintenance Engineer at Silverton speciality Pvt LTD",
//       "experience": "Maintenance Engineer at Silverton speciality Pvt LTD",
//       "contactinfo": "9027661976",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Ankit Agrawal",
//     "userid": "03ME01",
//     "usertype": "alumni",
//     "email": "ankit_agra@rediffmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2003",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "National - Head at Mohani Tea Leaves Pvt Ltd",
//       "experience": "National - Head at Mohani Tea Leaves Pvt Ltd",
//       "contactinfo": "8800558071",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Ankit Mittal",
//     "userid": "01ME01",
//     "usertype": "alumni",
//     "email": "ankit8085@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2001",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Design Engineer at Fluor Corp",
//       "experience": "Design Engineer at Fluor Corp",
//       "contactinfo": "9650237766",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Atul Kumar Singh",
//     "userid": "04ME01",
//     "usertype": "alumni",
//     "email": "atul5169@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2004",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "No input provided",
//       "experience": "No input provided",
//       "contactinfo": "8003190940",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "AVIJEET SURYAVANSHI",
//     "userid": "07ME02",
//     "usertype": "alumni",
//     "email": "avijeetsuryavanshi@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2007",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Technical Manager-Design (CAD/CAM/CAE) at CADSoft Technologies",
//       "experience": "Technical Manager-Design (CAD/CAM/CAE) at CADSoft Technologies",
//       "contactinfo": "9917991708",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "AVNISH KUMAR SINGH",
//     "userid": "98ME02",
//     "usertype": "alumni",
//     "email": "krsingh.avnish@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1998",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Sr Manager at NTPC",
//       "experience": "Sr Manager at NTPC",
//       "contactinfo": "9412771802",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Bhoopendra Singh",
//     "userid": "00ME02",
//     "usertype": "alumni",
//     "email": "bhoopendra.singh@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2000",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Founder at GMATINSIGHT",
//       "experience": "Founder at GMATINSIGHT",
//       "contactinfo": "9999687183",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "BRIJESH KUMAR",
//     "userid": "99ME04",
//     "usertype": "alumni",
//     "email": "brijesh2209@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1999",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Manager at ARVOS Energy",
//       "experience": "Manager at ARVOS Energy",
//       "contactinfo": "9873274098",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Chhatra Pal Singh",
//     "userid": "98ME03",
//     "usertype": "alumni",
//     "email": "call2cpsingh@yahoo.co.in",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1998",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Manager at Hindustan Aeronautics Limited",
//       "experience": "Manager at Hindustan Aeronautics Limited",
//       "contactinfo": "9422244815",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Dr SURYA PRAKASH",
//     "userid": "02ME02",
//     "usertype": "alumni",
//     "email": "suryayadav8383@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2002",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Assistant Professor at BML Munjal University Gurgaon",
//       "experience": "Assistant Professor at BML Munjal University Gurgaon",
//       "contactinfo": "7877445401",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Gajender Kumar",
//     "userid": "10ME01",
//     "usertype": "alumni",
//     "email": "kumar.gk.93@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2010",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Engineer at Havells India Ltd",
//       "experience": "Engineer at Havells India Ltd",
//       "contactinfo": "8791324022",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Harendra Kumar",
//     "userid": "99ME05",
//     "usertype": "alumni",
//     "email": "kumarharendra48@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1999",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Manager at Hindustan Aeronautics Limited",
//       "experience": "Manager at Hindustan Aeronautics Limited",
//       "contactinfo": "9936442375",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Hemant k singh",
//     "userid": "99ME06",
//     "usertype": "alumni",
//     "email": "hemantkumar_iet@rediffmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1999",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Sr manager at Tata motors",
//       "experience": "Sr manager at Tata motors",
//       "contactinfo": "7755001941",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Jitendra pal singh",
//     "userid": "05ME02",
//     "usertype": "alumni",
//     "email": "singhjitendra22@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2005",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Project engineer at Simplex infrastructure limited",
//       "experience": "Project engineer at Simplex infrastructure limited",
//       "contactinfo": "7016573325",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Jitendra Varshney",
//     "userid": "06ME01",
//     "usertype": "alumni",
//     "email": "j.varshneymech@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2006",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Director at Tanwar Enterprises",
//       "experience": "Director at Tanwar Enterprises",
//       "contactinfo": "9891474205",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Manish Dixit",
//     "userid": "07ME03",
//     "usertype": "alumni",
//     "email": "manishdixit90@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2007",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Asst. Professor at Institute of engineering and technology khandari Agra",
//       "experience": "Asst. Professor at Institute of engineering and technology khandari Agra",
//       "contactinfo": "8273525600",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Manish Katara",
//     "userid": "98ME04",
//     "usertype": "alumni",
//     "email": "katara.manish2002@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1998",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Govt",
//       "experience": "Govt",
//       "contactinfo": "7073884434",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Mayank saraswat",
//     "userid": "07ME04",
//     "usertype": "alumni",
//     "email": "saraswatmayank89@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2007",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Executive at Stumpp Schuele & Somappa Auto Suspension Sysstems Pvt. Ltd. Gurgaon",
//       "experience": "Executive at Stumpp Schuele & Somappa Auto Suspension Sysstems Pvt. Ltd. Gurgaon",
//       "contactinfo": "8830237386",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Narendra Singh",
//     "userid": "01ME02",
//     "usertype": "alumni",
//     "email": "narendramech84@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2001",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "No input provided",
//       "experience": "No input provided",
//       "contactinfo": "9897565520",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Nishit Singh",
//     "userid": "99ME07",
//     "usertype": "alumni",
//     "email": "nishit.singh@nexionpro.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1999",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Co-Founder at NexionPro Services LLP",
//       "experience": "Co-Founder at NexionPro Services LLP",
//       "contactinfo": "8800255422",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Nitin Kishore",
//     "userid": "03ME02",
//     "usertype": "alumni",
//     "email": "nitin2gud4u@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2003",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Sr Engineer at BHEL",
//       "experience": "Sr Engineer at BHEL",
//       "contactinfo": "9690122229",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "PIYUSH CHAUDHARY",
//     "userid": "03ME03",
//     "usertype": "alumni",
//     "email": "er.piyush07@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2003",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "No input provided",
//       "experience": "No input provided",
//       "contactinfo": "8077207879",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Rajat",
//     "userid": "03ME04",
//     "usertype": "alumni",
//     "email": "rajat2mech@yahoo.co.in",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2003",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Project Manager at Allan Lloyds Events",
//       "experience": "Project Manager at Allan Lloyds Events",
//       "contactinfo": "9528602388",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Rajesh Singh",
//     "userid": "09ME01",
//     "usertype": "alumni",
//     "email": "rajeshyadav3112@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2009",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Project Associate",
//       "experience": "Project Associate",
//       "contactinfo": "7503346504",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Rashid khan",
//     "userid": "05ME03",
//     "usertype": "alumni",
//     "email": "rashidkhan1987@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2005",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Asst. Prof. at DCTM,Palwal",
//       "experience": "Asst. Prof. at DCTM,Palwal",
//       "contactinfo": "8218691377",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Ravindra Singh",
//     "userid": "07ME05",
//     "usertype": "alumni",
//     "email": "rsdj3553@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2007",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "No input provided",
//       "experience": "No input provided",
//       "contactinfo": "9808784727",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Sachin Dev",
//     "userid": "07ME06",
//     "usertype": "alumni",
//     "email": "sachindev157@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2007",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Asset manager",
//       "experience": "Asset manager",
//       "contactinfo": "7408441485",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Sandeep Dahiya",
//     "userid": "03ME05",
//     "usertype": "alumni",
//     "email": "rajdahiya2003@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2003",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Deputy Manager at ASK AUTOMOTIVE P LTD",
//       "experience": "Deputy Manager at ASK AUTOMOTIVE P LTD",
//       "contactinfo": "7417469873",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Saurabh Pachauri",
//     "userid": "06ME02",
//     "usertype": "alumni",
//     "email": "saurabhme.pachauri@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2006",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Asstt. Professor at IET Kandari Agra",
//       "experience": "Asstt. Professor at IET Kandari Agra",
//       "contactinfo": "9027088364",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "SHARDHA NAND SINGH",
//     "userid": "04ME02",
//     "usertype": "alumni",
//     "email": "singh_shardha@rediffmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2004",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Assistant Manager at ONGC Petro additions Limited",
//       "experience": "Assistant Manager at ONGC Petro additions Limited",
//       "contactinfo": "9099999383",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "SHASHANK SHEKHAR",
//     "userid": "10ME02",
//     "usertype": "alumni",
//     "email": "shanksrajput92@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2010",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "No input provided",
//       "experience": "No input provided",
//       "contactinfo": "8285028210",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Sumit kumar",
//     "userid": "03ME06",
//     "usertype": "alumni",
//     "email": "sumitsks91@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2003",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Assist. Professor at Sachdeva institute of engineering and technology",
//       "experience": "Assist. Professor at Sachdeva institute of engineering and technology",
//       "contactinfo": "9997431361",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Tarun kumar",
//     "userid": "07ME07",
//     "usertype": "alumni",
//     "email": "tarunkumar89781@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2007",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "ATO at Department of technical education u.p",
//       "experience": "ATO at Department of technical education u.p",
//       "contactinfo": "8130625111",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "TEJ PRATAP SINGH",
//     "userid": "07ME08",
//     "usertype": "alumni",
//     "email": "tejpratap_singh8180@rediffmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2007",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "No input provided",
//       "experience": "No input provided",
//       "contactinfo": "8449932153",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Ujjwal Kumar",
//     "userid": "04ME03",
//     "usertype": "alumni",
//     "email": "ujjwal.k150385@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2004",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Demand and Supply Planning Mgr. at ABInbev",
//       "experience": "Demand and Supply Planning Mgr. at ABInbev",
//       "contactinfo": "97152854657",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Vaibhav Kumar",
//     "userid": "03ME07",
//     "usertype": "alumni",
//     "email": "vaibhav_kgupta@yahoo.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "2003",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Manager at Tata Chemicals Ltd.",
//       "experience": "Manager at Tata Chemicals Ltd.",
//       "contactinfo": "8408955544",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "vijay dixit",
//     "userid": "99ME08",
//     "usertype": "alumni",
//     "email": "vijay_99me20@rediffmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1999",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Manager at STEEL AUTHORITY INDIA LIMITED",
//       "experience": "Manager at STEEL AUTHORITY INDIA LIMITED",
//       "contactinfo": "9407982832",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "vipulchakravarty",
//     "userid": "99ME09",
//     "usertype": "alumni",
//     "email": "rush2vipul@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1999",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Engineering Manager at Larsen & Toubro Limited",
//       "experience": "Engineering Manager at Larsen & Toubro Limited",
//       "contactinfo": "9818820678",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Vivek chadha",
//     "userid": "98ME05",
//     "usertype": "alumni",
//     "email": "vivek.chadha.itw@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1998",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Regional Sales Manager at Henkel Adhesives Technologies",
//       "experience": "Regional Sales Manager at Henkel Adhesives Technologies",
//       "contactinfo": "9310065535",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   },
//   {
//     "personname": "Vivek Kumar Singh",
//     "userid": "99ME10",
//     "usertype": "alumni",
//     "email": "vksingh18881@gmail.com",
//     "userprivacy": "public",
//     "salt": "",
//     "passwordhash": "",
//     "personimage": "Empty",
//     "details": {
//       "batch": "1999",
//       "branch": "ME",
//       "aboutme": "No input provided",
//       "education": "No input provided",
//       "currentrole": "Director at Chipsnkits Technologies Pvt Ltd",
//       "experience": "Director at Chipsnkits Technologies Pvt Ltd",
//       "contactinfo": "9718534313",
//       "resume": "empty"
//     },
//     "data": {
//       "job_ids": [],
//       "event_ids": []
//     },
//     "verified": true
//   }
// ]; // End of usersJsonData
const usersJsonData = [
    {
        "personname": "Arpit Mishra",
        "userid": "13CSE01",
        "usertype": "alumni",
        "email": "mishraarpit199@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "8687510802",
            "resume": "empty"
        }
    },
    {
        "personname": "Deepak Panday",
        "userid": "13CSE02",
        "usertype": "alumni",
        "email": "deepakpanday2311@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Software Developer at Rigil Stratsoft Pvt. Ltd.",
            "experience": "Software Developer at Rigil Stratsoft Pvt. Ltd.",
            "contactinfo": "9927400130",
            "resume": "empty"
        }
    },
    {
        "personname": "Pragya Gupta",
        "userid": "11CSE03",
        "usertype": "alumni",
        "email": "pragya.gupta2613@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "web developer at waas technology",
            "experience": "web developer at waas technology",
            "contactinfo": "9696264677",
            "resume": "empty"
        }
    },
    {
        "personname": "Disha Jain",
        "userid": "13CSE04",
        "usertype": "alumni",
        "email": "smartdisha41@gmal.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Software Engineer at HCL Technologies",
            "experience": "Software Engineer at HCL Technologies",
            "contactinfo": "8860042472",
            "resume": "empty"
        }
    },
    {
        "personname": "Hari Prakash Verma",
        "userid": "13CSE05",
        "usertype": "alumni",
        "email": "hpverma1502@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "",
            "resume": "empty"
        }
    },
    {
        "personname": "Kshitij Gaurav",
        "userid": "13CSE06",
        "usertype": "alumni",
        "email": "grvksh22@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Technical Analyst at HCL Technologies",
            "experience": "Technical Analyst at HCL Technologies",
            "contactinfo": "7376869054",
            "resume": "empty"
        }
    },
    {
        "personname": "DEEP ASHUTOSH VIMAL",
        "userid": "13CSE07",
        "usertype": "alumni",
        "email": "deepashutoshvimal@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "9411433161",
            "resume": "empty"
        }
    },
    {
        "personname": "Aradhana",
        "userid": "11CSE08",
        "usertype": "alumni",
        "email": "aradhanagautam9@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "CSE",
            "aboutme": "N/A",
            "education": "No input provided",
            "currentrole": "Software Developer at Inoday Consultancy Pvt Ltd.",
            "experience": "Software Developer at Inoday Consultancy Pvt Ltd.",
            "contactinfo": "8860743308",
            "resume": "empty"
        }
    },
    {
        "personname": "Accupwew",
        "userid": "14CSE09",
        "usertype": "alumni",
        "email": "Accupwew@sengi.top",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2014",
            "branch": "CSE",
            "aboutme": "1024MB Kingston",
            "education": "No input provided",
            "currentrole": "Trainee at google",
            "experience": "Trainee at google",
            "contactinfo": "",
            "resume": "empty"
        }
    },
    {
        "personname": "GAURAV KUMAR",
        "userid": "11CSE10",
        "usertype": "alumni",
        "email": "gaurav06011991@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working at Subhatech Technical Services",
            "experience": "Working at Subhatech Technical Services",
            "contactinfo": "9759521234",
            "resume": "empty"
        }
    },
    {
        "personname": "ABHISHEK PANDEY",
        "userid": "11CSE11",
        "usertype": "alumni",
        "email": "abhishekpandey_93@hotmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "CSE",
            "aboutme": "I miss my college....",
            "education": "No input provided",
            "currentrole": "Self Startup at AKT PRIVATE INTERNATIONAL LIMITED",
            "experience": "Self Startup at AKT PRIVATE INTERNATIONAL LIMITED",
            "contactinfo": "9415806685",
            "resume": "empty"
        }
    },
    {
        "personname": "ALOK KUMAR",
        "userid": "13CSE12",
        "usertype": "alumni",
        "email": "akumar0821@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "9759529702",
            "resume": "empty"
        }
    },
    {
        "personname": "Jon snow",
        "userid": "13CSE13",
        "usertype": "alumni",
        "email": "jonsnow@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Bastard at Winterfall",
            "experience": "Bastard at Winterfall",
            "contactinfo": "9696 969696",
            "resume": "empty"
        }
    },
    {
        "personname": "Varsha kumari",
        "userid": "13CSE14",
        "usertype": "alumni",
        "email": "varshapal3333@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "PG-DAC at CDAC",
            "experience": "PG-DAC at CDAC",
            "contactinfo": "9897848800",
            "resume": "empty"
        }
    },
    {
        "personname": "Durgesh Kumar Yadav",
        "userid": "13CSE15",
        "usertype": "alumni",
        "email": "durgeshyadav20@hotmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam at Civil services",
            "experience": "Preparing for Competative exam at Civil services",
            "contactinfo": "9454620394",
            "resume": "empty"
        }
    },
    {
        "personname": "Hemant Singh",
        "userid": "11CSE16",
        "usertype": "alumni",
        "email": "hemantsingh237@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "7895222615",
            "resume": "empty"
        }
    },
    {
        "personname": "Chandrasen Yadav",
        "userid": "13CSE17",
        "usertype": "alumni",
        "email": "chandrasenyadav31@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "9411617955",
            "resume": "empty"
        }
    },
    {
        "personname": "Sandeep kumar",
        "userid": "11CSE18",
        "usertype": "alumni",
        "email": "singh.s.ss216@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "9997027392",
            "resume": "empty"
        }
    },
    {
        "personname": "Mahika singh",
        "userid": "11CSE19",
        "usertype": "alumni",
        "email": "mahika382@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "IT Recruiter at Success pact",
            "experience": "IT Recruiter at Success pact",
            "contactinfo": "9810330226",
            "resume": "empty"
        }
    },
    {
        "personname": "Vijay Baranwal",
        "userid": "11CSE20",
        "usertype": "alumni",
        "email": "vijay94baranwal@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "7290942850",
            "resume": "empty"
        }
    },
    {
        "personname": "Harshita Saini",
        "userid": "12CSE21",
        "usertype": "alumni",
        "email": "sainiharshita2529@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Software Engineer at TO THE NEW",
            "experience": "Software Engineer at TO THE NEW",
            "contactinfo": "8791544269",
            "resume": "empty"
        }
    },
    {
        "personname": "Shobhit Dubey",
        "userid": "11CSE22",
        "usertype": "alumni",
        "email": "shobhitdubey05@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Doing Higher Education",
            "experience": "Doing Higher Education",
            "contactinfo": "7042891102",
            "resume": "empty"
        }
    },
    {
        "personname": "Shubham Shukla",
        "userid": "13CSE23",
        "usertype": "alumni",
        "email": "shk.shubham@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Software Engineer at Wirecamp",
            "experience": "Software Engineer at Wirecamp",
            "contactinfo": "7349235825",
            "resume": "empty"
        }
    },
    {
        "personname": "Aviral Chaudhari",
        "userid": "13ME01",
        "usertype": "alumni",
        "email": "aviralchaudhari@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "student at post graduation diploma in tool design & Cad/Cam at indo danish tool room",
            "experience": "student at post graduation diploma in tool design & Cad/Cam at indo danish tool room",
            "contactinfo": "09651266182",
            "resume": "empty"
        }
    },
    {
        "personname": "Divas sahu",
        "userid": "13ME02",
        "usertype": "alumni",
        "email": "divassahu16@gmail.co",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Student at nil",
            "experience": "Student at nil",
            "contactinfo": "08273488567",
            "resume": "empty"
        }
    },
    {
        "personname": "mahmood ali siddique",
        "userid": "13ME03",
        "usertype": "alumni",
        "email": "mahmoodali.siddique@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "faculty at future institute bareilly",
            "experience": "faculty at future institute bareilly",
            "contactinfo": "09359284271",
            "resume": "empty"
        }
    },
    {
        "personname": "krati singh",
        "userid": "13ME04",
        "usertype": "alumni",
        "email": "kratiswa@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "student at made easy",
            "experience": "student at made easy",
            "contactinfo": "07309257505",
            "resume": "empty"
        }
    },
    {
        "personname": "pawan kumar singh",
        "userid": "13ME05",
        "usertype": "alumni",
        "email": "pks1311995@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "student at preparation for mba",
            "experience": "student at preparation for mba",
            "contactinfo": "08765355298",
            "resume": "empty"
        }
    },
    {
        "personname": "shahrukh khan",
        "userid": "13ME06",
        "usertype": "alumni",
        "email": "srkshann39@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "engineer at invensign technosys pvt ltd",
            "experience": "engineer at invensign technosys pvt ltd",
            "contactinfo": "08755022971",
            "resume": "empty"
        }
    },
    {
        "personname": "vishal shrivastava",
        "userid": "13ME07",
        "usertype": "alumni",
        "email": "shrvishal007@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "student at nil",
            "experience": "student at nil",
            "contactinfo": "09454008428",
            "resume": "empty"
        }
    },
    {
        "personname": "Shashi lata rawat",
        "userid": "11CSE24",
        "usertype": "alumni",
        "email": "shashirawat2229@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Business analyst at Hcl technologies",
            "experience": "Business analyst at Hcl technologies",
            "contactinfo": "8448801774",
            "resume": "empty"
        }
    },
    {
        "personname": "Prateek kumar dubey",
        "userid": "13ME08",
        "usertype": "alumni",
        "email": "prateekd565@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Doing Higher Education",
            "experience": "Doing Higher Education",
            "contactinfo": "8979209492",
            "resume": "empty"
        }
    },
    {
        "personname": "ajay kumar kushwaha",
        "userid": "13ME09",
        "usertype": "alumni",
        "email": "ajaykumarkushwaha889@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "student at nil",
            "experience": "student at nil",
            "contactinfo": "08445171776",
            "resume": "empty"
        }
    },
    {
        "personname": "anup kumar pal",
        "userid": "13ME10",
        "usertype": "alumni",
        "email": "anups7210@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "student at nil",
            "experience": "student at nil",
            "contactinfo": "08417848395",
            "resume": "empty"
        }
    },
    {
        "personname": "Rajat malik",
        "userid": "13ME11",
        "usertype": "alumni",
        "email": "rajatmalikiitr@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ME",
            "aboutme": "A good initiative by faculties of IET Agra",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "9084103760",
            "resume": "empty"
        }
    },
    {
        "personname": "Hariom pandey",
        "userid": "11ME12",
        "usertype": "alumni",
        "email": "hariom.pandey65@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Enginnering at Jindal pvt ltd.",
            "experience": "Enginnering at Jindal pvt ltd.",
            "contactinfo": "8604569768",
            "resume": "empty"
        }
    },
    {
        "personname": "VIKKY",
        "userid": "13ME13",
        "usertype": "alumni",
        "email": "vikkypardhans@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam at KD CAMPUS DELHI",
            "experience": "Preparing for Competative exam at KD CAMPUS DELHI",
            "contactinfo": "7291812988",
            "resume": "empty"
        }
    },
    {
        "personname": "Adnan Alam",
        "userid": "11ME14",
        "usertype": "alumni",
        "email": "alam826699@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "8266997759",
            "resume": "empty"
        }
    },
    {
        "personname": "Kritarth Singh",
        "userid": "11ME15",
        "usertype": "alumni",
        "email": "kritarths700@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "7376899473",
            "resume": "empty"
        }
    },
    {
        "personname": "SADAV ANSARI",
        "userid": "11ECE01",
        "usertype": "alumni",
        "email": "SADAVANSARI92@GMAIL.COM",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "ECE",
            "aboutme": "NETWORK ENGINEER AT HCL INFOTECH LTD NOIDA : DEC-15 TO NOV -17",
            "education": "No input provided",
            "currentrole": "CISCO VOICE ENGINEER at AVAYA GLOBAL CONNECT LTD",
            "experience": "CISCO VOICE ENGINEER at AVAYA GLOBAL CONNECT LTD",
            "contactinfo": "8287117110",
            "resume": "empty"
        }
    },
    {
        "personname": "RAHUL KUMAR YADAV",
        "userid": "12ECE02",
        "usertype": "alumni",
        "email": "iamrahulkyadav@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "8470914713",
            "resume": "empty"
        }
    },
    {
        "personname": "Priyank Yadav",
        "userid": "11ECE03",
        "usertype": "alumni",
        "email": "priyankyadav012@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "PLC Programmer and Business Development Manager at Redcliffe Energy Pvt Ltd",
            "experience": "PLC Programmer and Business Development Manager at Redcliffe Energy Pvt Ltd",
            "contactinfo": "7838452218",
            "resume": "empty"
        }
    },
    {
        "personname": "Ajay kumar maurya",
        "userid": "11ME16",
        "usertype": "alumni",
        "email": "ajay963410@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Mechanical engineer at Sureland industrial fire safety limited(Air CBD shunyi Beijing China)",
            "experience": "Mechanical engineer at Sureland industrial fire safety limited(Air CBD shunyi Beijing China)",
            "contactinfo": "9005936138",
            "resume": "empty"
        }
    },
    {
        "personname": "Sunil Kumar Pal",
        "userid": "12ME17",
        "usertype": "alumni",
        "email": "sunilpal263@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Sr. Engineer at Quality Needles Pvt. Ltd.",
            "experience": "Sr. Engineer at Quality Needles Pvt. Ltd.",
            "contactinfo": "9058176297",
            "resume": "empty"
        }
    },
    {
        "personname": "Vivekanand",
        "userid": "12ECE04",
        "usertype": "alumni",
        "email": "itsvickysen@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Process Engineer at GDN Enterprises Pvt Ltd, Noida",
            "experience": "Process Engineer at GDN Enterprises Pvt Ltd, Noida",
            "contactinfo": "9161218099",
            "resume": "empty"
        }
    },
    {
        "personname": "Vipin Kumar Maurya",
        "userid": "12ECE05",
        "usertype": "alumni",
        "email": "vipinmaurya2010@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Student at MNNIT ALLAHABAD",
            "experience": "Student at MNNIT ALLAHABAD",
            "contactinfo": "8954005854",
            "resume": "empty"
        }
    },
    {
        "personname": "ANUP KUMAR PAL",
        "userid": "13ME18",
        "usertype": "alumni",
        "email": "anups7210@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "8931885814",
            "resume": "empty"
        }
    },
    {
        "personname": "BRIJESH KUMAR PATHAK",
        "userid": "13ME19",
        "usertype": "alumni",
        "email": "brijeshpathak337@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam at MADE EASY",
            "experience": "Preparing for Competative exam at MADE EASY",
            "contactinfo": "8279953670",
            "resume": "empty"
        }
    },
    {
        "personname": "NAMRATA BANSAL",
        "userid": "11CSE25",
        "usertype": "alumni",
        "email": "namratabnsl2@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Self Startup at PASHUPATI PLYWOOD INDUSTRIES",
            "experience": "Self Startup at PASHUPATI PLYWOOD INDUSTRIES",
            "contactinfo": "7376500398",
            "resume": "empty"
        }
    },
    {
        "personname": "Rajesh kumar",
        "userid": "13ME20",
        "usertype": "alumni",
        "email": "rajesh13me31@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "8126327855",
            "resume": "empty"
        }
    },
    {
        "personname": "AMAN PAL",
        "userid": "13ME21",
        "usertype": "alumni",
        "email": "amanpalme2108@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "9557233076",
            "resume": "empty"
        }
    },
    {
        "personname": "Shweta Singh",
        "userid": "11CSE26",
        "usertype": "alumni",
        "email": "ssingh@corbus.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Senior Associate 1 at Corbus",
            "experience": "Senior Associate 1 at Corbus",
            "contactinfo": "8979999774",
            "resume": "empty"
        }
    },
    {
        "personname": "shyam kumar singh",
        "userid": "12ECE06",
        "usertype": "alumni",
        "email": "shyam94570@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "8077532303",
            "resume": "empty"
        }
    },
    {
        "personname": "Anu Priya Gupta",
        "userid": "12ECE07",
        "usertype": "alumni",
        "email": "anupriyagupta2805@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Associate at Amazon",
            "experience": "Associate at Amazon",
            "contactinfo": "8130681321",
            "resume": "empty"
        }
    },
    {
        "personname": "SUNIL KUMAR",
        "userid": "12ECE08",
        "usertype": "alumni",
        "email": "sunil10495@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "ECE",
            "aboutme": "HI SIR",
            "education": "No input provided",
            "currentrole": "M TECH SCHOLAR at DAYALBAGH EDUCATIONAL INSTITUTE(DEEMED UNIVERSITY) AGRA",
            "experience": "M TECH SCHOLAR at DAYALBAGH EDUCATIONAL INSTITUTE(DEEMED UNIVERSITY) AGRA",
            "contactinfo": "8410483201",
            "resume": "empty"
        }
    },
    {
        "personname": "suyash sonwani",
        "userid": "13ME22",
        "usertype": "alumni",
        "email": "suyashsnwn489@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "7579947719",
            "resume": "empty"
        }
    },
    {
        "personname": "devesh kumar",
        "userid": "11ECE09",
        "usertype": "alumni",
        "email": "deveshkumar.ec@live.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Allahabad",
            "experience": "Allahabad",
            "contactinfo": "9415503049",
            "resume": "empty"
        }
    },
    {
        "personname": "Vishal Kumar",
        "userid": "11ME23",
        "usertype": "alumni",
        "email": "kumarvishal591@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "ME",
            "aboutme": "Best",
            "education": "No input provided",
            "currentrole": "Doing Higher Education at ITI diesel engine mechanic",
            "experience": "Doing Higher Education at ITI diesel engine mechanic",
            "contactinfo": "9045436105",
            "resume": "empty"
        }
    },
    {
        "personname": "Mohammed Danisj",
        "userid": "11ME24",
        "usertype": "alumni",
        "email": "mohddanish736@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "ME",
            "aboutme": "Pls Check marksheet before printing there are lots of silly mistakes,and give it on time.",
            "education": "No input provided",
            "currentrole": "Assistant Engineer at Balaji Action Buildwell",
            "experience": "Assistant Engineer at Balaji Action Buildwell",
            "contactinfo": "9917717800",
            "resume": "empty"
        }
    },
    {
        "personname": "Ashish Verma",
        "userid": "12CSE27",
        "usertype": "alumni",
        "email": "ashishverma140193@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "9250217855",
            "resume": "empty"
        }
    },
    {
        "personname": "Jeetesh kumar yadav",
        "userid": "13ME25",
        "usertype": "alumni",
        "email": "jeetesh234@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "8923404192",
            "resume": "empty"
        }
    },
    {
        "personname": "ANKUR AWASTHI",
        "userid": "13ME26",
        "usertype": "alumni",
        "email": "ankurawsthi17@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "student at Coimbatore marine college",
            "experience": "student at Coimbatore marine college",
            "contactinfo": "8535094885",
            "resume": "empty"
        }
    },
    {
        "personname": "Pushpendra Kumar",
        "userid": "13ME27",
        "usertype": "alumni",
        "email": "kumarpushpendra068@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ME",
            "aboutme": "I would like to thanks My whole Mech.Deptt. Also Director Sir ,and My friends For supporting me .",
            "education": "No input provided",
            "currentrole": "Site Engineer at Standered Air Conditioning .( L&T construction Ltd)",
            "experience": "Site Engineer at Standered Air Conditioning .( L&T construction Ltd)",
            "contactinfo": "9956708023",
            "resume": "empty"
        }
    },
    {
        "personname": "Reshama Singh patel",
        "userid": "13CSE28",
        "usertype": "alumni",
        "email": "reshamapatel1jan95@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "CSE",
            "aboutme": "No issue",
            "education": "No input provided",
            "currentrole": "Agra at It kha daru agra",
            "experience": "Agra at It kha daru agra",
            "contactinfo": "7895214868",
            "resume": "empty"
        }
    },
    {
        "personname": "ANJANEY KUMAR",
        "userid": "12ECE10",
        "usertype": "alumni",
        "email": "anjaneyvishwakarma@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "ECE",
            "aboutme": "I WANT TO BE AN ENGINEER\r\nIT'S MY GOAL",
            "education": "No input provided",
            "currentrole": "M.TECH. at GATE",
            "experience": "M.TECH. at GATE",
            "contactinfo": "7991728061",
            "resume": "empty"
        }
    },
    {
        "personname": "AMIT KUMAR",
        "userid": "13ME28",
        "usertype": "alumni",
        "email": "amit180197@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "7783945379",
            "resume": "empty"
        }
    },
    {
        "personname": "SUSHEEL ARGAL",
        "userid": "12CSE29",
        "usertype": "alumni",
        "email": "argalanuj@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "9411809061",
            "resume": "empty"
        }
    },
    {
        "personname": "shubham sawant",
        "userid": "12CSE30",
        "usertype": "alumni",
        "email": "sweetsawant2@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "student at Niit",
            "experience": "student at Niit",
            "contactinfo": "9319787719",
            "resume": "empty"
        }
    },
    {
        "personname": "sanni gorav",
        "userid": "11ME29",
        "usertype": "alumni",
        "email": "sunnygaurav03@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "8979558585",
            "resume": "empty"
        }
    },
    {
        "personname": "Ankesh soni",
        "userid": "11ME30",
        "usertype": "alumni",
        "email": "ankeshsoniimport@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Training offOfficer at Govt. ITI bhopal",
            "experience": "Training offOfficer at Govt. ITI bhopal",
            "contactinfo": "9753299904",
            "resume": "empty"
        }
    },
    {
        "personname": "Sadish katiyar",
        "userid": "11CSE31",
        "usertype": "alumni",
        "email": "sadish.katiyar@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "CSE",
            "aboutme": "I am from batch 2002-06 which is not reflecting here",
            "education": "No input provided",
            "currentrole": "Manager at Hcl",
            "experience": "Manager at Hcl",
            "contactinfo": "7042133333",
            "resume": "empty"
        }
    },
    {
        "personname": "VIJAY KUMAR",
        "userid": "11ME31",
        "usertype": "alumni",
        "email": "vijaykc6020@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Self Startup",
            "experience": "Self Startup",
            "contactinfo": "9719136020",
            "resume": "empty"
        }
    },
    {
        "personname": "VINAY KUMAR",
        "userid": "13ECE11",
        "usertype": "alumni",
        "email": "vinaykumar5500@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ECE",
            "aboutme": "I have done my B.E in 2017 with E.C branch. my roll no is 138005450029. and now i am preparing for CIVIL SERVECIES. i was thankful to all our teachers and H.O.D sir for their support and guidance.",
            "education": "No input provided",
            "currentrole": "CIVIL SERVECIES at COACHING",
            "experience": "CIVIL SERVECIES at COACHING",
            "contactinfo": "9807888051",
            "resume": "empty"
        }
    },
    {
        "personname": "Vinay Kumar",
        "userid": "12CSE32",
        "usertype": "alumni",
        "email": "vinaysoni95@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Software developer at Inoday consultancy pvt ltd",
            "experience": "Software developer at Inoday consultancy pvt ltd",
            "contactinfo": "8920056556",
            "resume": "empty"
        }
    },
    {
        "personname": "Rustam Kumar Bind",
        "userid": "12CSE33",
        "usertype": "alumni",
        "email": "rustam10494@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "8922070144",
            "resume": "empty"
        }
    },
    {
        "personname": "Priyanka Mangla",
        "userid": "02CSE34",
        "usertype": "alumni",
        "email": "priyanka.mangla8@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Technical lead at Hcl Technologies",
            "experience": "Technical lead at Hcl Technologies",
            "contactinfo": "9999044493",
            "resume": "empty"
        }
    },
    {
        "personname": "ROBIN SINGH",
        "userid": "12ME32",
        "usertype": "alumni",
        "email": "rbnsingh234@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "9450719196",
            "resume": "empty"
        }
    },
    {
        "personname": "Dheerendra Kumar",
        "userid": "12ECE12",
        "usertype": "alumni",
        "email": "dheerendra002d@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Project Engineer at Relince Jio & VodafoneLTE Project",
            "experience": "Project Engineer at Relince Jio & VodafoneLTE Project",
            "contactinfo": "8737998467",
            "resume": "empty"
        }
    },
    {
        "personname": "Akhilesh Kumar Maurya",
        "userid": "09CSE35",
        "usertype": "alumni",
        "email": "maurya_akhilesh@ymail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2009",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Software Development Engineer at RevX Technology Pvt. Ltd.",
            "experience": "Software Development Engineer at RevX Technology Pvt. Ltd.",
            "contactinfo": "8553066971",
            "resume": "empty"
        }
    },
    {
        "personname": "Priyank Singj",
        "userid": "02ME33",
        "usertype": "alumni",
        "email": "priyank881@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Project Officer (PO) at United Nations Development Program (UNDP)",
            "experience": "Project Officer (PO) at United Nations Development Program (UNDP)",
            "contactinfo": "9997567676",
            "resume": "empty"
        }
    },
    {
        "personname": "Vishal kumar gautam",
        "userid": "12CSE36",
        "usertype": "alumni",
        "email": "gautamvishal7@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Trainee Software Engineer at Orchestrate systems pvt ltd",
            "experience": "Trainee Software Engineer at Orchestrate systems pvt ltd",
            "contactinfo": "9794948879",
            "resume": "empty"
        }
    },
    {
        "personname": "AKASH KATIYAR",
        "userid": "09CSE37",
        "usertype": "alumni",
        "email": "akashkatiyar0@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2009",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "SSE at Infosys Limited",
            "experience": "SSE at Infosys Limited",
            "contactinfo": "9790709392",
            "resume": "empty"
        }
    },
    {
        "personname": "Sumit gangwar",
        "userid": "09CSE38",
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
        }
    },
    {
        "personname": "Nishit Singh",
        "userid": "99ME34",
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
        }
    },
    {
        "personname": "Shivangi",
        "userid": "02ECE13",
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
        }
    },
    {
        "personname": "NEERAJ KUMAR GUPTA",
        "userid": "13ECE14",
        "usertype": "alumni",
        "email": "neerajkumargupta10895@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "8909648944",
            "resume": "empty"
        }
    },
    {
        "personname": "Prashant Chaudhary",
        "userid": "11CSE39",
        "usertype": "alumni",
        "email": "prashantchaudhary@live.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "CSE",
            "aboutme": "Will be going for MS in Computer Science with specialization in Machine Learning from Germany at the end of year",
            "education": "No input provided",
            "currentrole": "Aerospace Engineer at Honeywell",
            "experience": "Aerospace Engineer at Honeywell",
            "contactinfo": "9916630039",
            "resume": "empty"
        }
    },
    {
        "personname": "Shaifali singh",
        "userid": "13ECE15",
        "usertype": "alumni",
        "email": "shaifalisingh123@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "+12012048658",
            "resume": "empty"
        }
    },
    {
        "personname": "Anurag kumar yadav",
        "userid": "09CSE40",
        "usertype": "alumni",
        "email": "anuiet09@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2009",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Owner at Systemcare Technologies",
            "experience": "Owner at Systemcare Technologies",
            "contactinfo": "9818266072",
            "resume": "empty"
        }
    },
    {
        "personname": "Hemant k singh",
        "userid": "99ME35",
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
        }
    },
    {
        "personname": "Ravinder",
        "userid": "08CSE41",
        "usertype": "alumni",
        "email": "sahuthewise@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "CSE",
            "aboutme": "It is great to see, how IET has grown as an institution and it would be a wonderful experience for me to come meet current student and share whatever little I've learned after passing out.",
            "education": "No input provided",
            "currentrole": "Account Manager at Lyxel Labs Digital Pvt. Ltd.",
            "experience": "Account Manager at Lyxel Labs Digital Pvt. Ltd.",
            "contactinfo": "7838217016",
            "resume": "empty"
        }
    },
    {
        "personname": "AKHILESH KUMAR SAVITA",
        "userid": "13ECE16",
        "usertype": "alumni",
        "email": "ak237832@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "9084782439",
            "resume": "empty"
        }
    },
    {
        "personname": "KIRTI BHUSHAN",
        "userid": "02CSE42",
        "usertype": "alumni",
        "email": "erkirtibhushan@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "CSE",
            "aboutme": "Good initiative, let us know in what ways we can pay back to our college.",
            "education": "No input provided",
            "currentrole": "Test manager at RBS",
            "experience": "Test manager at RBS",
            "contactinfo": "9212627719",
            "resume": "empty"
        }
    },
    {
        "personname": "Rahul Pandey",
        "userid": "08ECE17",
        "usertype": "alumni",
        "email": "rahul090890@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Senior Software Engineer",
            "experience": "Senior Software Engineer",
            "contactinfo": "8884330222",
            "resume": "empty"
        }
    },
    {
        "personname": "Amit Gurjar",
        "userid": "01CSE43",
        "usertype": "alumni",
        "email": "eramit82@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2001",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "ARchitect at NIIT USA",
            "experience": "ARchitect at NIIT USA",
            "contactinfo": "6104005816",
            "resume": "empty"
        }
    },
    {
        "personname": "pradeep singh rai",
        "userid": "08CSE44",
        "usertype": "alumni",
        "email": "pradeep.rai.dun@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Manager Operation at Lyxellabs Pvt. Ltd",
            "experience": "Manager Operation at Lyxellabs Pvt. Ltd",
            "contactinfo": "7838477662",
            "resume": "empty"
        }
    },
    {
        "personname": "Puja",
        "userid": "02IT01",
        "usertype": "alumni",
        "email": "erpujasinha@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "IT",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Offshore Manager at Symantec",
            "experience": "Offshore Manager at Symantec",
            "contactinfo": "9096553400",
            "resume": "empty"
        }
    },
    {
        "personname": "Arun Singh",
        "userid": "01CSE45",
        "usertype": "alumni",
        "email": "arun.satyapal@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2001",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Project manager at Hewlett-Packard",
            "experience": "Project manager at Hewlett-Packard",
            "contactinfo": "9901751564",
            "resume": "empty"
        }
    },
    {
        "personname": "Khursheed Alam",
        "userid": "02CE01",
        "usertype": "alumni",
        "email": "nngc.delhi@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "CE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Proprieter at Newton Infratech",
            "experience": "Proprieter at Newton Infratech",
            "contactinfo": "9910740786",
            "resume": "empty"
        }
    },
    {
        "personname": "Chandra Shekhar",
        "userid": "02CSE46",
        "usertype": "alumni",
        "email": "shekhar.crs@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Manager at Bank of Baroda",
            "experience": "Manager at Bank of Baroda",
            "contactinfo": "9005605551",
            "resume": "empty"
        }
    },
    {
        "personname": "Sumit Dhingra",
        "userid": "02ECE18",
        "usertype": "alumni",
        "email": "sumitd1982@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Claims Exec at AJG",
            "experience": "Claims Exec at AJG",
            "contactinfo": "0430516646",
            "resume": "empty"
        }
    },
    {
        "personname": "Akhilesh yadav",
        "userid": "99ME36",
        "usertype": "alumni",
        "email": "akhilesh_9a@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Staff Engineer at Stryker Corporation",
            "experience": "Staff Engineer at Stryker Corporation",
            "contactinfo": "9818624847",
            "resume": "empty"
        }
    },
    {
        "personname": "Amitesh Kumar Das",
        "userid": "02ECE19",
        "usertype": "alumni",
        "email": "amitesh_das51@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Manager at Genpact",
            "experience": "Manager at Genpact",
            "contactinfo": "7065727818",
            "resume": "empty"
        }
    },
    {
        "personname": "Abhishek Singh",
        "userid": "10ECE20",
        "usertype": "alumni",
        "email": "rahulgabhishek@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2010",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Bss engineer at Airtel communications",
            "experience": "Bss engineer at Airtel communications",
            "contactinfo": "9473507626",
            "resume": "empty"
        }
    },
    {
        "personname": "Vailaish Saini",
        "userid": "02CSE47",
        "usertype": "alumni",
        "email": "vailaish@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Product Specialist at Nucleus Software",
            "experience": "Product Specialist at Nucleus Software",
            "contactinfo": "9871238814",
            "resume": "empty"
        }
    },
    {
        "personname": "Prashant Chauhan",
        "userid": "07CSE48",
        "usertype": "alumni",
        "email": "chauhan_prashant@live.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CSE",
            "aboutme": "Such an amazing step from the side of university to see this change for our future generation.",
            "education": "No input provided",
            "currentrole": "Senior Database Admin at Wipro Technology",
            "experience": "Senior Database Admin at Wipro Technology",
            "contactinfo": "9878410463",
            "resume": "empty"
        }
    },
    {
        "personname": "RANJEET",
        "userid": "06CSE49",
        "usertype": "alumni",
        "email": "singh847@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "PMT at Triton healthcare Chennai",
            "experience": "PMT at Triton healthcare Chennai",
            "contactinfo": "7409116490",
            "resume": "empty"
        }
    },
    {
        "personname": "Shrey Kapil",
        "userid": "10ME37",
        "usertype": "alumni",
        "email": "shrkpl794@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2010",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Programmer analyst at Cognizant technology solutions",
            "experience": "Programmer analyst at Cognizant technology solutions",
            "contactinfo": "8682951513",
            "resume": "empty"
        }
    },
    {
        "personname": "BRIJESH KUMAR",
        "userid": "99ME38",
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
        }
    },
    {
        "personname": "Vartika Dubey",
        "userid": "07CSE50",
        "usertype": "alumni",
        "email": "vartika.dubey07@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "8447692213",
            "resume": "empty"
        }
    },
    {
        "personname": "SAJAN DEV PRASAD KANCHAN",
        "userid": "06CE02",
        "usertype": "alumni",
        "email": "saajan.ce@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CE",
            "aboutme": "I am very thankful to be a part of IETien Agra.",
            "education": "No input provided",
            "currentrole": "Assistant Engineer (Gazetted officer ) at Town & Country Planning Department Uttar Pradesh",
            "experience": "Assistant Engineer (Gazetted officer ) at Town & Country Planning Department Uttar Pradesh",
            "contactinfo": "9450200812",
            "resume": "empty"
        }
    },
    {
        "personname": "Kapil kant swaroop",
        "userid": "05CE03",
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
        }
    },
    {
        "personname": "Mujahid Saleem",
        "userid": "06CE04",
        "usertype": "alumni",
        "email": "msaleem.ce@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Managing Director at A S Constructions",
            "experience": "Managing Director at A S Constructions",
            "contactinfo": "9837404042",
            "resume": "empty"
        }
    },
    {
        "personname": "Richa Singh",
        "userid": "06CSE51",
        "usertype": "alumni",
        "email": "richasinghbt@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CSE",
            "aboutme": "Specialisation in biogas technology and renewable energy.",
            "education": "No input provided",
            "currentrole": "PhD scholar at Sardar swaran Singh national institute of Bioenergy, kapurthala, punjab",
            "experience": "PhD scholar at Sardar swaran Singh national institute of Bioenergy, kapurthala, punjab",
            "contactinfo": "7982572369",
            "resume": "empty"
        }
    },
    {
        "personname": "Vishnu Vaid",
        "userid": "06CSE52",
        "usertype": "alumni",
        "email": "ibsvishnu@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "9711730629",
            "resume": "empty"
        }
    },
    {
        "personname": "Parul Bajaj",
        "userid": "02ECE21",
        "usertype": "alumni",
        "email": "parulbajaj34@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "9651226897",
            "resume": "empty"
        }
    },
    {
        "personname": "RAJEEV PANDEY",
        "userid": "98CSE53",
        "usertype": "alumni",
        "email": "rajeev98iet@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "CSE",
            "aboutme": "Nil",
            "education": "No input provided",
            "currentrole": "Asst.Prof. at RGPV (MP)",
            "experience": "Asst.Prof. at RGPV (MP)",
            "contactinfo": "9479907881",
            "resume": "empty"
        }
    },
    {
        "personname": "Saurabh Shrotriya",
        "userid": "10ECE22",
        "usertype": "alumni",
        "email": "saurabh@solarinertia.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2010",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Manager - Projects at SolarInertia Power Private Limited",
            "experience": "Manager - Projects at SolarInertia Power Private Limited",
            "contactinfo": "9719523149",
            "resume": "empty"
        }
    },
    {
        "personname": "Vipul Uniyal",
        "userid": "99CSE54",
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
        }
    },
    {
        "personname": "Pradeep Kumar",
        "userid": "12ECE23",
        "usertype": "alumni",
        "email": "pradeepkumar85663@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "ECE",
            "aboutme": "Thanks iet",
            "education": "No input provided",
            "currentrole": "Preparation at Dristi Ias new Delhi",
            "experience": "Preparation at Dristi Ias new Delhi",
            "contactinfo": "9634161856",
            "resume": "empty"
        }
    },
    {
        "personname": "Renukesh Verma",
        "userid": "07CSE55",
        "usertype": "alumni",
        "email": "renukeshv@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "CEO/Director at BLESSIo",
            "experience": "CEO/Director at BLESSIo",
            "contactinfo": "9582174678",
            "resume": "empty"
        }
    },
    {
        "personname": "Ritwick Kumar",
        "userid": "98CSE56",
        "usertype": "alumni",
        "email": "ritwick.kumar@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working at Boston Scientific",
            "experience": "Working at Boston Scientific",
            "contactinfo": "8860639963",
            "resume": "empty"
        }
    },
    {
        "personname": "Kumar Preet",
        "userid": "06CSE57",
        "usertype": "alumni",
        "email": "biotechkrpreet@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CSE",
            "aboutme": "miss u IET",
            "education": "No input provided",
            "currentrole": "Doing Higher Education at svpuat",
            "experience": "Doing Higher Education at svpuat",
            "contactinfo": "8057103277",
            "resume": "empty"
        }
    },
    {
        "personname": "Rahul Kumar",
        "userid": "13ECE24",
        "usertype": "alumni",
        "email": "rahulkahata@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ECE",
            "aboutme": "Mole on the neck",
            "education": "No input provided",
            "currentrole": "Student at Diet hathrash",
            "experience": "Student at Diet hathrash",
            "contactinfo": "8052294315",
            "resume": "empty"
        }
    },
    {
        "personname": "Alok kumar mishra",
        "userid": "06CE05",
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
        }
    },
    {
        "personname": "Jayankesh Singh",
        "userid": "06CE06",
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
        }
    },
    {
        "personname": "Nitin Chandra",
        "userid": "98CSE58",
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
        }
    },
    {
        "personname": "Shailendra Pratap Singh",
        "userid": "06ECE25",
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
        }
    },
    {
        "personname": "Sandeep Sharma",
        "userid": "98ECE26",
        "usertype": "alumni",
        "email": "sandeep.5g@outlook.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "ECE",
            "aboutme": "It's a great initiative. Happy to connect back to roots",
            "education": "No input provided",
            "currentrole": "GM at Ericsson Global",
            "experience": "GM at Ericsson Global",
            "contactinfo": "8826298724",
            "resume": "empty"
        }
    },
    {
        "personname": "Tej Singh",
        "userid": "98ECE27",
        "usertype": "alumni",
        "email": "tej_singh1@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Self Startup at Mokshika computers",
            "experience": "Self Startup at Mokshika computers",
            "contactinfo": "9810973997",
            "resume": "empty"
        }
    },
    {
        "personname": "Rahul Singh",
        "userid": "98CSE59",
        "usertype": "alumni",
        "email": "rahul.singh.maan@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Assistant Vice President at Bank of America",
            "experience": "Assistant Vice President at Bank of America",
            "contactinfo": "9581567700",
            "resume": "empty"
        }
    },
    {
        "personname": "Atul Shrivastava",
        "userid": "98CSE60",
        "usertype": "alumni",
        "email": "atulshr@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "CSE",
            "aboutme": "It is always good to hear back from the college I spent 4 years and be in touch.",
            "education": "No input provided",
            "currentrole": "Director at Encoding Enhancers Pvt Ltd",
            "experience": "Director at Encoding Enhancers Pvt Ltd",
            "contactinfo": "9910322270",
            "resume": "empty"
        }
    },
    {
        "personname": "Ram Prakash",
        "userid": "98ECE28",
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
        }
    },
    {
        "personname": "Praveen kumar Yadav",
        "userid": "07ECE29",
        "usertype": "alumni",
        "email": "pkyadav36@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "ECE",
            "aboutme": "Started job at GUJARAT AMBUJA EXPORTS LTD,AHMEDABAD",
            "education": "No input provided",
            "currentrole": "Maintenance Head(Electrical engg deptt) at maxbros ventures india ltd,manesar GURGAON",
            "experience": "Maintenance Head(Electrical engg deptt) at maxbros ventures india ltd,manesar GURGAON",
            "contactinfo": "9084998889",
            "resume": "empty"
        }
    },
    {
        "personname": "AVIJEET SURYAVANSHI",
        "userid": "07ME39",
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
        }
    },
    {
        "personname": "Dushyant Raj Singh",
        "userid": "99ME40",
        "usertype": "alumni",
        "email": "1982drs@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "DM- Plant Engineering",
            "experience": "DM- Plant Engineering",
            "contactinfo": "9999199941",
            "resume": "empty"
        }
    },
    {
        "personname": "Anurag kumar saroj",
        "userid": "13ECE30",
        "usertype": "alumni",
        "email": "anuragkumar0594@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam at KD campus",
            "experience": "Preparing for Competative exam at KD campus",
            "contactinfo": "8057106855",
            "resume": "empty"
        }
    },
    {
        "personname": "Sumit kumar",
        "userid": "03ME41",
        "usertype": "alumni",
        "email": "sumitsks91@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "ME",
            "aboutme": "Ok",
            "education": "No input provided",
            "currentrole": "Assist. Professor at Sachdeva institute of engineering and technology",
            "experience": "Assist. Professor at Sachdeva institute of engineering and technology",
            "contactinfo": "9997431361",
            "resume": "empty"
        }
    },
    {
        "personname": "Prince",
        "userid": "07CE07",
        "usertype": "alumni",
        "email": "prince0063@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "JE at MCD",
            "experience": "JE at MCD",
            "contactinfo": "9560569108",
            "resume": "empty"
        }
    },
    {
        "personname": "Mradul Sharma",
        "userid": "05CSE61",
        "usertype": "alumni",
        "email": "er.mradulsharma@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2005",
            "branch": "CSE",
            "aboutme": "Good work",
            "education": "No input provided",
            "currentrole": "Asst.Manager at Purlieus Inc",
            "experience": "Asst.Manager at Purlieus Inc",
            "contactinfo": "9582845363",
            "resume": "empty"
        }
    },
    {
        "personname": "Deepak",
        "userid": "98CSE62",
        "usertype": "alumni",
        "email": "deepakgarg01@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "9560569997",
            "resume": "empty"
        }
    },
    {
        "personname": "Vishal Saxena",
        "userid": "00CSE63",
        "usertype": "alumni",
        "email": "vishalsaxen@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Senior Education Developer at BMC Software",
            "experience": "Senior Education Developer at BMC Software",
            "contactinfo": "9284524383",
            "resume": "empty"
        }
    },
    {
        "personname": "Priyansh Sharma",
        "userid": "07IT02",
        "usertype": "alumni",
        "email": "er.priyanshsharma@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "IT",
            "aboutme": "I\u2019m highly obliged that I have been asked to be a part of such glorious event.\r\nIt will be my suit opportunity to come and join alumni.",
            "education": "No input provided",
            "currentrole": "Engineer at Ericsson",
            "experience": "Engineer at Ericsson",
            "contactinfo": "8010690174",
            "resume": "empty"
        }
    },
    {
        "personname": "Rahul kumar yadav",
        "userid": "07ME42",
        "usertype": "alumni",
        "email": "rkyadav8169@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Sr engineer at Samsung India electronics pvt ltd",
            "experience": "Sr engineer at Samsung India electronics pvt ltd",
            "contactinfo": "8285872846",
            "resume": "empty"
        }
    },
    {
        "personname": "Arun kumar",
        "userid": "07CSE64",
        "usertype": "alumni",
        "email": "arunyadav8138@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Lecturer at Technical education",
            "experience": "Lecturer at Technical education",
            "contactinfo": "9711182619",
            "resume": "empty"
        }
    },
    {
        "personname": "Abhishek Varshney",
        "userid": "00ECE31",
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
        }
    },
    {
        "personname": "Mavi Nigam",
        "userid": "00ME43",
        "usertype": "alumni",
        "email": "mavinigam@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Deputy Manager - IT at Humboldt Wedag India Pvt. Ltd.",
            "experience": "Deputy Manager - IT at Humboldt Wedag India Pvt. Ltd.",
            "contactinfo": "9999328488",
            "resume": "empty"
        }
    },
    {
        "personname": "ANJANI KUMAR DUBEY",
        "userid": "00ME44",
        "usertype": "alumni",
        "email": "anjanibksc@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Consulto at Tata Consultancy Services",
            "experience": "Consulto at Tata Consultancy Services",
            "contactinfo": "9717040552",
            "resume": "empty"
        }
    },
    {
        "personname": "Manish Singh",
        "userid": "00ECE32",
        "usertype": "alumni",
        "email": "pmanish.sachan@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Scientist D at CAIR, DRDO, Bangalore",
            "experience": "Scientist D at CAIR, DRDO, Bangalore",
            "contactinfo": "8105565826",
            "resume": "empty"
        }
    },
    {
        "personname": "Prabhakar Saxena",
        "userid": "98ECE33",
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
        }
    },
    {
        "personname": "Amit Agarwal",
        "userid": "98ME45",
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
        }
    },
    {
        "personname": "Vikash Verma",
        "userid": "01CSE65",
        "usertype": "alumni",
        "email": "vikky2005@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2001",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working at TCS",
            "experience": "Working at TCS",
            "contactinfo": "3331026421",
            "resume": "empty"
        }
    },
    {
        "personname": "Sandeep Gurjar",
        "userid": "01CSE66",
        "usertype": "alumni",
        "email": "sandeep.sandy1984@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2001",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Sr Architect at Dairyland power coop",
            "experience": "Sr Architect at Dairyland power coop",
            "contactinfo": "8750430600",
            "resume": "empty"
        }
    },
    {
        "personname": "Baldev singh",
        "userid": "00ECE34",
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
        }
    },
    {
        "personname": "Radhakant singh",
        "userid": "07CSE67",
        "usertype": "alumni",
        "email": "radhey.2611@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CSE",
            "aboutme": "I ET was the best time for all of us..\r\nUnforgetable days of college life.",
            "education": "No input provided",
            "currentrole": "Project manager at Jharkhand Nagar vikas(JUIDCO)",
            "experience": "Project manager at Jharkhand Nagar vikas(JUIDCO)",
            "contactinfo": "9582277075",
            "resume": "empty"
        }
    },
    {
        "personname": "Asif Khan",
        "userid": "98CSE68",
        "usertype": "alumni",
        "email": "asifkhan10@rediffmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Assistant Professor at GNIOT, GREATER NOIDA",
            "experience": "Assistant Professor at GNIOT, GREATER NOIDA",
            "contactinfo": "9871811916",
            "resume": "empty"
        }
    },
    {
        "personname": "Anurag yadav",
        "userid": "06CE08",
        "usertype": "alumni",
        "email": "anuragyadavchandravanshi@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CE",
            "aboutme": "Felling great & waiting for...",
            "education": "No input provided",
            "currentrole": "Director at Nss Buildcon pvt ltd",
            "experience": "Director at Nss Buildcon pvt ltd",
            "contactinfo": "09557555553",
            "resume": "empty"
        }
    },
    {
        "personname": "Ritesh Agarwal",
        "userid": "98CSE69",
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
        }
    },
    {
        "personname": "Pawan Singh",
        "userid": "06CE09",
        "usertype": "alumni",
        "email": "pawancooljatt@yahoo.in",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Associate manager QA/QC at GMR Infrastructures Limited",
            "experience": "Associate manager QA/QC at GMR Infrastructures Limited",
            "contactinfo": "9982615148",
            "resume": "empty"
        }
    },
    {
        "personname": "Vikrant pratap",
        "userid": "07CSE70",
        "usertype": "alumni",
        "email": "vikrant289334@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Self Startup at Kushagra treders",
            "experience": "Self Startup at Kushagra treders",
            "contactinfo": "9870861125",
            "resume": "empty"
        }
    },
    {
        "personname": "Anil Kumar",
        "userid": "01CSE71",
        "usertype": "alumni",
        "email": "eranil84@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2001",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "SharePoint Architect at DuPont",
            "experience": "SharePoint Architect at DuPont",
            "contactinfo": "9891850046",
            "resume": "empty"
        }
    },
    {
        "personname": "Kshitiz Kaushik",
        "userid": "07CSE72",
        "usertype": "alumni",
        "email": "kaushik1945@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Captain at Army",
            "experience": "Captain at Army",
            "contactinfo": "8492959019",
            "resume": "empty"
        }
    },
    {
        "personname": "Ajeet Singh",
        "userid": "00ECE35",
        "usertype": "alumni",
        "email": "singhajeet82@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "PROJECT MANAGER at HINDUSTAN AERONAUTICS LIMITED",
            "experience": "PROJECT MANAGER at HINDUSTAN AERONAUTICS LIMITED",
            "contactinfo": "+917376011616",
            "resume": "empty"
        }
    },
    {
        "personname": "Ghanshyam Gupta",
        "userid": "04CE10",
        "usertype": "alumni",
        "email": "ghanshyam.gupta48@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "CE",
            "aboutme": "Woh kehte hai na ,humari life bhi bilkul hindi picture filmo jaise hi hoti hai last me happy ending aur agar happy ending na ho to ,\"Picture abhi baaki hai\".",
            "education": "No input provided",
            "currentrole": "SSE at Indian Railways",
            "experience": "SSE at Indian Railways",
            "contactinfo": "9648671595",
            "resume": "empty"
        }
    },
    {
        "personname": "Chhatra Pal Singh",
        "userid": "98ME46",
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
            "contactinfo": "09422244815",
            "resume": "empty"
        }
    },
    {
        "personname": "Pawan kumar singh",
        "userid": "04CE11",
        "usertype": "alumni",
        "email": "pawan04ce33@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "CE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Sr.section engineer at Indian railways",
            "experience": "Sr.section engineer at Indian railways",
            "contactinfo": "9675228180",
            "resume": "empty"
        }
    },
    {
        "personname": "Ashish Kumar sharma",
        "userid": "07CE12",
        "usertype": "alumni",
        "email": "ashishshrm57@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Manager at Bharti Airtel",
            "experience": "Manager at Bharti Airtel",
            "contactinfo": "95577777189",
            "resume": "empty"
        }
    },
    {
        "personname": "Yamnish Nagpal",
        "userid": "03CSE73",
        "usertype": "alumni",
        "email": "yamnish.nagpal@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "CSE",
            "aboutme": "Would like to help alumni with jobs and other ways also by taking special lectures",
            "education": "No input provided",
            "currentrole": "Branch manager at Indusind bank",
            "experience": "Branch manager at Indusind bank",
            "contactinfo": "9811459104",
            "resume": "empty"
        }
    },
    {
        "personname": "Harendra Prakash",
        "userid": "04CE13",
        "usertype": "alumni",
        "email": "harendra_prakash@rediffmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "CE",
            "aboutme": "Just open all the engineering branches and get removed the tag of UPTU. IET should be as a Grand Tag.",
            "education": "No input provided",
            "currentrole": "Scientist at Ministry of Water Resources",
            "experience": "Scientist at Ministry of Water Resources",
            "contactinfo": "08077949631",
            "resume": "empty"
        }
    },
    {
        "personname": "Pradeep Kumar Mishra",
        "userid": "03CSE74",
        "usertype": "alumni",
        "email": "pradeep281001@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "CSE",
            "aboutme": "Would like to get updates about my college.",
            "education": "No input provided",
            "currentrole": "Manager at Dr. Reddys lab",
            "experience": "Manager at Dr. Reddys lab",
            "contactinfo": "7093400378",
            "resume": "empty"
        }
    },
    {
        "personname": "Satya Pal singh",
        "userid": "07ECE36",
        "usertype": "alumni",
        "email": "spsinghjadon88@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working at Taptech automation",
            "experience": "Working at Taptech automation",
            "contactinfo": "9811851554",
            "resume": "empty"
        }
    },
    {
        "personname": "Anish Akhauri",
        "userid": "04CE14",
        "usertype": "alumni",
        "email": "anish.akhauri@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "CE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Lead Engineer at Brillio LLC",
            "experience": "Lead Engineer at Brillio LLC",
            "contactinfo": "9620387164",
            "resume": "empty"
        }
    },
    {
        "personname": "Abhishek kumar",
        "userid": "04CE15",
        "usertype": "alumni",
        "email": "abhisheart143@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "CE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Asst Manager at Bangur Cement Ltd",
            "experience": "Asst Manager at Bangur Cement Ltd",
            "contactinfo": "9097593060",
            "resume": "empty"
        }
    },
    {
        "personname": "Mohd Shahnawaze Ansari",
        "userid": "00CSE75",
        "usertype": "alumni",
        "email": "shah.csengg@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Scientist at Centre of Nanotechnology, King Abdulaziz University, Jeddah",
            "experience": "Scientist at Centre of Nanotechnology, King Abdulaziz University, Jeddah",
            "contactinfo": "00966531264998",
            "resume": "empty"
        }
    },
    {
        "personname": "Yogendra kumar",
        "userid": "04CE16",
        "usertype": "alumni",
        "email": "katariarke@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "CE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Assistant Engineer at Rural works Department, uttarakhand",
            "experience": "Assistant Engineer at Rural works Department, uttarakhand",
            "contactinfo": "7830107836",
            "resume": "empty"
        }
    },
    {
        "personname": "Anjneya Ashirvad Bhardwaj",
        "userid": "02ECE37",
        "usertype": "alumni",
        "email": "anjneya.bh@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Manager at Lanco Infratech limited",
            "experience": "Manager at Lanco Infratech limited",
            "contactinfo": "9818259081",
            "resume": "empty"
        }
    },
    {
        "personname": "Padmakar Jha",
        "userid": "07CSE76",
        "usertype": "alumni",
        "email": "monucs.iet@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Senior Network Administrator at Wipro infotech",
            "experience": "Senior Network Administrator at Wipro infotech",
            "contactinfo": "9987129187",
            "resume": "empty"
        }
    },
    {
        "personname": "Yash Sharma",
        "userid": "04CE17",
        "usertype": "alumni",
        "email": "10.yashu@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "CE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Manager-Projects at Lotus Greens Developers Pvt. Ltd",
            "experience": "Manager-Projects at Lotus Greens Developers Pvt. Ltd",
            "contactinfo": "9873719099",
            "resume": "empty"
        }
    },
    {
        "personname": "Vipin Kumar Bhaskar",
        "userid": "07CE18",
        "usertype": "alumni",
        "email": "vipin2184@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Site engineer at Ganpatimega builders, agra",
            "experience": "Site engineer at Ganpatimega builders, agra",
            "contactinfo": "9058837817",
            "resume": "empty"
        }
    },
    {
        "personname": "Manvendra Singh",
        "userid": "07IT03",
        "usertype": "alumni",
        "email": "monukushwaha09@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "IT",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Junior Engineer at Samsung India",
            "experience": "Junior Engineer at Samsung India",
            "contactinfo": "9811168931",
            "resume": "empty"
        }
    },
    {
        "personname": "Rajesh shah",
        "userid": "04CE19",
        "usertype": "alumni",
        "email": "win.rajeshshah@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "CE",
            "aboutme": "Good work",
            "education": "No input provided",
            "currentrole": "Je at Djb",
            "experience": "Je at Djb",
            "contactinfo": "9650222455",
            "resume": "empty"
        }
    },
    {
        "personname": "Harendra Kumar",
        "userid": "99ME47",
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
        }
    },
    {
        "personname": "Kuldeep Singh Tomar",
        "userid": "98ECE38",
        "usertype": "alumni",
        "email": "KuldeepTomar111@Gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Project Manager at Infosys Limited",
            "experience": "Project Manager at Infosys Limited",
            "contactinfo": "+353871707483",
            "resume": "empty"
        }
    },
    {
        "personname": "Hari Om Garg",
        "userid": "98ECE39",
        "usertype": "alumni",
        "email": "garg.hariom@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Project Manager at HCL America Inc.",
            "experience": "Project Manager at HCL America Inc.",
            "contactinfo": "+1-425-503-0532",
            "resume": "empty"
        }
    },
    {
        "personname": "AVNISH KUMAR SINGH",
        "userid": "98ME48",
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
        }
    },
    {
        "personname": "Dushyant Singh",
        "userid": "00ECE40",
        "usertype": "alumni",
        "email": "dushyant_singh2004@rediffmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "ECE",
            "aboutme": "Happy to see the initiative taken by the institute to gather all the alumni information",
            "education": "No input provided",
            "currentrole": "Associate Prof. at RBS Engg. Tech. Campus Bichpuri Agra",
            "experience": "Associate Prof. at RBS Engg. Tech. Campus Bichpuri Agra",
            "contactinfo": "8171393616",
            "resume": "empty"
        }
    },
    {
        "personname": "Raj Kumar Gaba",
        "userid": "98CSE77",
        "usertype": "alumni",
        "email": "rajkumar_gana@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "CSE",
            "aboutme": "Keep doing good",
            "education": "No input provided",
            "currentrole": "Sr Business Manager at Force Motors Ltd",
            "experience": "Sr Business Manager at Force Motors Ltd",
            "contactinfo": "9829797404",
            "resume": "empty"
        }
    },
    {
        "personname": "Navin singhal",
        "userid": "99ECE41",
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
        }
    },
    {
        "personname": "Amit Kumar",
        "userid": "00ECE42",
        "usertype": "alumni",
        "email": "amitsanger08@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "MANAGER at Airports Authority of India",
            "experience": "MANAGER at Airports Authority of India",
            "contactinfo": "9790896412",
            "resume": "empty"
        }
    },
    {
        "personname": "Vivek Singh",
        "userid": "98CSE78",
        "usertype": "alumni",
        "email": "viveksingh81@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working at Juniper Networks Inc",
            "experience": "Working at Juniper Networks Inc",
            "contactinfo": "+14084767932",
            "resume": "empty"
        }
    },
    {
        "personname": "ABHISHEK SINGH",
        "userid": "06CSE79",
        "usertype": "alumni",
        "email": "abhishek.singh936@outlook.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Sr Business Analyst at Uneecops Technoloy",
            "experience": "Sr Business Analyst at Uneecops Technoloy",
            "contactinfo": "7800849501",
            "resume": "empty"
        }
    },
    {
        "personname": "Avdesh Gupta",
        "userid": "00CSE80",
        "usertype": "alumni",
        "email": "avdeshgupta10@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "ASM at Panasonic India private ltd",
            "experience": "ASM at Panasonic India private ltd",
            "contactinfo": "8696558666",
            "resume": "empty"
        }
    },
    {
        "personname": "akhilesh singh",
        "userid": "00CSE81",
        "usertype": "alumni",
        "email": "Akhilsingh.iet@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working at kailash nursery",
            "experience": "Working at kailash nursery",
            "contactinfo": "7599259435",
            "resume": "empty"
        }
    },
    {
        "personname": "Nidhi Gupta",
        "userid": "06CSE82",
        "usertype": "alumni",
        "email": "nidhi4112@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Manager HR at MTC",
            "experience": "Manager HR at MTC",
            "contactinfo": "7090654666",
            "resume": "empty"
        }
    },
    {
        "personname": "Priyank Singh",
        "userid": "00CSE83",
        "usertype": "alumni",
        "email": "priyank.ksingh@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Destination Manager at Lebara Ltd",
            "experience": "Destination Manager at Lebara Ltd",
            "contactinfo": "9873631203",
            "resume": "empty"
        }
    },
    {
        "personname": "Shailendra pratap singh",
        "userid": "00CSE84",
        "usertype": "alumni",
        "email": "spsingh1981@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "CSE",
            "aboutme": "Good to see the initiative by college.much appreciated. Looking forward to connect with more folks",
            "education": "No input provided",
            "currentrole": "Staff Engineer/manager at Qualcomm",
            "experience": "Staff Engineer/manager at Qualcomm",
            "contactinfo": "9581159191",
            "resume": "empty"
        }
    },
    {
        "personname": "Ashish Kumar",
        "userid": "00CSE85",
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
        }
    },
    {
        "personname": "Nirmal kumar",
        "userid": "98ME49",
        "usertype": "alumni",
        "email": "parthnirmal.40@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "ME",
            "aboutme": "None",
            "education": "No input provided",
            "currentrole": "Asst.Professor at PSIT KANPUR",
            "experience": "Asst.Professor at PSIT KANPUR",
            "contactinfo": "9927081433",
            "resume": "empty"
        }
    },
    {
        "personname": "AMIT KUMAR SHUKLA",
        "userid": "12ME50",
        "usertype": "alumni",
        "email": "shuklaamit519@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Site Engineer at Golden Enterprises Co.",
            "experience": "Site Engineer at Golden Enterprises Co.",
            "contactinfo": "9208144942",
            "resume": "empty"
        }
    },
    {
        "personname": "shubham sawant",
        "userid": "12CSE86",
        "usertype": "alumni",
        "email": "sweetsawant2@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "student at Niit",
            "experience": "student at Niit",
            "contactinfo": "9319787719",
            "resume": "empty"
        }
    },
    {
        "personname": "Anshu Kumar",
        "userid": "03ECE43",
        "usertype": "alumni",
        "email": "anshukumar1983@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Self Startup",
            "experience": "Self Startup",
            "contactinfo": "9036411974",
            "resume": "empty"
        }
    },
    {
        "personname": "Bhawani Singh",
        "userid": "09CSE87",
        "usertype": "alumni",
        "email": "bhawanisingh33@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2009",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "7204651633",
            "resume": "empty"
        }
    },
    {
        "personname": "Arun Pratap Singh Yadav",
        "userid": "99ECE44",
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
            "contactinfo": "+919717599243",
            "resume": "empty"
        }
    },
    {
        "personname": "Chandan Singh",
        "userid": "05CSE88",
        "usertype": "alumni",
        "email": "er.singhchandan@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2005",
            "branch": "CSE",
            "aboutme": "Miss my college days...",
            "education": "No input provided",
            "currentrole": "Manager Operations at Vark snack food pvt ltd",
            "experience": "Manager Operations at Vark snack food pvt ltd",
            "contactinfo": "7827913092",
            "resume": "empty"
        }
    },
    {
        "personname": "VIVEK RAJ",
        "userid": "06CSE89",
        "usertype": "alumni",
        "email": "vivekraj.iet@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CSE",
            "aboutme": "B +ve",
            "education": "No input provided",
            "currentrole": "Faculty at Narayana IIT/PMT",
            "experience": "Faculty at Narayana IIT/PMT",
            "contactinfo": "9430441335",
            "resume": "empty"
        }
    },
    {
        "personname": "Dr. Vivek Kumar Patel",
        "userid": "03ME51",
        "usertype": "alumni",
        "email": "vivek@mnnit.ac.in",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Assistant Professor at Motilal Nehru N.I.T. Allahabad",
            "experience": "Assistant Professor at Motilal Nehru N.I.T. Allahabad",
            "contactinfo": "9455120700",
            "resume": "empty"
        }
    },
    {
        "personname": "Abhishek Mohan",
        "userid": "99ME52",
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
        }
    },
    {
        "personname": "Reema Malhotra",
        "userid": "98CSE90",
        "usertype": "alumni",
        "email": "getreema@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Manager at Cognizant",
            "experience": "Manager at Cognizant",
            "contactinfo": "4793062729",
            "resume": "empty"
        }
    },
    {
        "personname": "Chandrashekhar kumar",
        "userid": "04CE20",
        "usertype": "alumni",
        "email": "csazad99@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "CE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "JE at SDMC",
            "experience": "JE at SDMC",
            "contactinfo": "9313727893",
            "resume": "empty"
        }
    },
    {
        "personname": "Abhishek Saurabh",
        "userid": "03ME53",
        "usertype": "alumni",
        "email": "abhishek.iet.mech03@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "ME",
            "aboutme": "Spent the most wonderful years of my life here",
            "education": "No input provided",
            "currentrole": "Manager at Hindustan Aeronautics Limited",
            "experience": "Manager at Hindustan Aeronautics Limited",
            "contactinfo": "9794633249",
            "resume": "empty"
        }
    },
    {
        "personname": "Mohd shahrukh",
        "userid": "13ME54",
        "usertype": "alumni",
        "email": "mohd.shahrukha1994@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Quality Inspection Engineer at M. M CASTING PVT LTD",
            "experience": "Quality Inspection Engineer at M. M CASTING PVT LTD",
            "contactinfo": "9720978007",
            "resume": "empty"
        }
    },
    {
        "personname": "Anil Kumar Tiwari",
        "userid": "02ECE45",
        "usertype": "alumni",
        "email": "anil3187@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Director at Centilium Interactive Pvt Ltd",
            "experience": "Director at Centilium Interactive Pvt Ltd",
            "contactinfo": "9897410000",
            "resume": "empty"
        }
    },
    {
        "personname": "DURGESH PASWAN",
        "userid": "13ME55",
        "usertype": "alumni",
        "email": "durgeshndfriends@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Quality engineer at Daylight filtration blue mount ro Bakoli delhi",
            "experience": "Quality engineer at Daylight filtration blue mount ro Bakoli delhi",
            "contactinfo": "7840011860",
            "resume": "empty"
        }
    },
    {
        "personname": "Devendra Kumar shivhare",
        "userid": "05ME56",
        "usertype": "alumni",
        "email": "devendra.shivhare9@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2005",
            "branch": "ME",
            "aboutme": "Maintenance of heavy earth moving machinery",
            "education": "No input provided",
            "currentrole": "Mechanical Engineer at AL-EZ TRADING TRANSPORTING AND CONTRACTING CO.LLC, Oman",
            "experience": "Mechanical Engineer at AL-EZ TRADING TRANSPORTING AND CONTRACTING CO.LLC, Oman",
            "contactinfo": "+96893455783",
            "resume": "empty"
        }
    },
    {
        "personname": "Ajender",
        "userid": "06CSE91",
        "usertype": "alumni",
        "email": "ajender.chauhan898@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CSE",
            "aboutme": "CHANDIGARH 43",
            "education": "No input provided",
            "currentrole": "Software development at Beckon delve",
            "experience": "Software development at Beckon delve",
            "contactinfo": "9457201003",
            "resume": "empty"
        }
    },
    {
        "personname": "UPENDRA KUMAR MISHRA",
        "userid": "10ECE46",
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
        }
    },
    {
        "personname": "Nisha",
        "userid": "05ECE47",
        "usertype": "alumni",
        "email": "nisha14nandini@gmail.co",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2005",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Assistant professor at Shri ram college muzaffarnagar",
            "experience": "Assistant professor at Shri ram college muzaffarnagar",
            "contactinfo": "9891117442",
            "resume": "empty"
        }
    },
    {
        "personname": "HEM SINGH PARIHAR",
        "userid": "04CE21",
        "usertype": "alumni",
        "email": "hem_singh33@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "CE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "9411837649",
            "resume": "empty"
        }
    },
    {
        "personname": "PAWAN KUMAR CHAURASIA",
        "userid": "13ECE48",
        "usertype": "alumni",
        "email": "pkchaurasia03@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ECE",
            "aboutme": "PG-DAC (Post Graduation- Diploma in Advanced Computing)",
            "education": "No input provided",
            "currentrole": "Student at CDAC (Center for Development of Advanced Computing)",
            "experience": "Student at CDAC (Center for Development of Advanced Computing)",
            "contactinfo": "8533073224",
            "resume": "empty"
        }
    },
    {
        "personname": "Mayank Goyal",
        "userid": "99ECE49",
        "usertype": "alumni",
        "email": "mayankgoyal21@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working at Ciena",
            "experience": "Working at Ciena",
            "contactinfo": "98107728811",
            "resume": "empty"
        }
    },
    {
        "personname": "Rajesh Singh",
        "userid": "09ME57",
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
        }
    },
    {
        "personname": "Sandeep Rajeev Kachhap",
        "userid": "02ECE50",
        "usertype": "alumni",
        "email": "KACHHAP.SANDEEP@GMAIL.COM",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Sr. SECTION ENGINEER at INTEGRAL COACH FACTORY, CHENNAI",
            "experience": "Sr. SECTION ENGINEER at INTEGRAL COACH FACTORY, CHENNAI",
            "contactinfo": "9500146235",
            "resume": "empty"
        }
    },
    {
        "personname": "Akhilendra Singh",
        "userid": "08CE22",
        "usertype": "alumni",
        "email": "akhil.ce12@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "CE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Project Engineer at Welspun group",
            "experience": "Project Engineer at Welspun group",
            "contactinfo": "9414211498",
            "resume": "empty"
        }
    },
    {
        "personname": "Gufran khan",
        "userid": "02ECE51",
        "usertype": "alumni",
        "email": "gufran.khan1212@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Franchise Manager at Telenor india Comm. Pvt Ltd",
            "experience": "Franchise Manager at Telenor india Comm. Pvt Ltd",
            "contactinfo": "8127792786",
            "resume": "empty"
        }
    },
    {
        "personname": "Saurabh Sharma",
        "userid": "98ME58",
        "usertype": "alumni",
        "email": "anurabh@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Sr. Manager at VE Commercial Vehicles Limited",
            "experience": "Sr. Manager at VE Commercial Vehicles Limited",
            "contactinfo": "9752542752",
            "resume": "empty"
        }
    },
    {
        "personname": "Umakant@ Choudhary",
        "userid": "98CSE92",
        "usertype": "alumni",
        "email": "uma.iet@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Sr. Officer at Macleods pharmaceutical Ltd, Sikkim India",
            "experience": "Sr. Officer at Macleods pharmaceutical Ltd, Sikkim India",
            "contactinfo": "09411486046",
            "resume": "empty"
        }
    },
    {
        "personname": "Rajat",
        "userid": "03ME59",
        "usertype": "alumni",
        "email": "rajat2mech@yahoo.co.in",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "ME",
            "aboutme": "Great initiative by college management and staff.",
            "education": "No input provided",
            "currentrole": "Project Manager at Allan Lloyds Events",
            "experience": "Project Manager at Allan Lloyds Events",
            "contactinfo": "9528602388",
            "resume": "empty"
        }
    },
    {
        "personname": "Rahul",
        "userid": "05ME60",
        "usertype": "alumni",
        "email": "rhsingh3@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2005",
            "branch": "ME",
            "aboutme": "Rahul Banarasi",
            "education": "No input provided",
            "currentrole": "Engineer at Indian railway",
            "experience": "Engineer at Indian railway",
            "contactinfo": "8840755214",
            "resume": "empty"
        }
    },
    {
        "personname": "Amit kumar gautam",
        "userid": "07IT04",
        "usertype": "alumni",
        "email": "amitgautam826@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "IT",
            "aboutme": "Always happy every movement life not come back.",
            "education": "No input provided",
            "currentrole": "Project engineer at Technosys",
            "experience": "Project engineer at Technosys",
            "contactinfo": "9717196396",
            "resume": "empty"
        }
    },
    {
        "personname": "Dheeraj Singh",
        "userid": "08CSE93",
        "usertype": "alumni",
        "email": "Dheerajugi@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Co-Chairman at Uttam Group of Institutions",
            "experience": "Co-Chairman at Uttam Group of Institutions",
            "contactinfo": "9997755996",
            "resume": "empty"
        }
    },
    {
        "personname": "Mohit Rawat",
        "userid": "99CSE94",
        "usertype": "alumni",
        "email": "mohitrawat19@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Software Development Manager at Cognizant Technology Solutions",
            "experience": "Software Development Manager at Cognizant Technology Solutions",
            "contactinfo": "+19493780629",
            "resume": "empty"
        }
    },
    {
        "personname": "Jayant Kimothi",
        "userid": "02CSE95",
        "usertype": "alumni",
        "email": "jayant.kimothi@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Team lead",
            "experience": "Team lead",
            "contactinfo": "9873991533",
            "resume": "empty"
        }
    },
    {
        "personname": "Dig Vijay Singh Chauhan",
        "userid": "98ECE52",
        "usertype": "alumni",
        "email": "cdigvijay@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Security architecture",
            "experience": "Security architecture",
            "contactinfo": "9845802564",
            "resume": "empty"
        }
    },
    {
        "personname": "Dharmendra Singh",
        "userid": "06ECE53",
        "usertype": "alumni",
        "email": "dsingh7361@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "ECE",
            "aboutme": "My best wishes with u all",
            "education": "No input provided",
            "currentrole": "Assistant Professor at SHUATS",
            "experience": "Assistant Professor at SHUATS",
            "contactinfo": "9411205797",
            "resume": "empty"
        }
    },
    {
        "personname": "Vibhu Agrawal",
        "userid": "05ME61",
        "usertype": "alumni",
        "email": "vibhu85in@yahoo.co.in",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2005",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Manager Purchase at Siemens Ltd.",
            "experience": "Manager Purchase at Siemens Ltd.",
            "contactinfo": "9899016440",
            "resume": "empty"
        }
    },
    {
        "personname": "jitendra kumar",
        "userid": "01ECE54",
        "usertype": "alumni",
        "email": "jitendra.kumar24@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2001",
            "branch": "ECE",
            "aboutme": "see u all soon",
            "education": "No input provided",
            "currentrole": "Asst. Manager at Jio",
            "experience": "Asst. Manager at Jio",
            "contactinfo": "9997457660",
            "resume": "empty"
        }
    },
    {
        "personname": "DHANANJAY",
        "userid": "07CE23",
        "usertype": "alumni",
        "email": "dhananjay.chaudhary080@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Self Startup",
            "experience": "Self Startup",
            "contactinfo": "9897705326",
            "resume": "empty"
        }
    },
    {
        "personname": "Ravindra Kumar Rahul",
        "userid": "08ME62",
        "usertype": "alumni",
        "email": "ravindrakrahul@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "9412510297",
            "resume": "empty"
        }
    },
    {
        "personname": "Jitendra Varshney",
        "userid": "06ME63",
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
        }
    },
    {
        "personname": "Ratan singh dinkar",
        "userid": "05CE24",
        "usertype": "alumni",
        "email": "ratan.dinkar@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2005",
            "branch": "CE",
            "aboutme": "BE Hons civil",
            "education": "No input provided",
            "currentrole": "site Engineer civil at Hscc(I)Ltd noida",
            "experience": "site Engineer civil at Hscc(I)Ltd noida",
            "contactinfo": "9557957889",
            "resume": "empty"
        }
    },
    {
        "personname": "Siddharth Saxena",
        "userid": "02CSE96",
        "usertype": "alumni",
        "email": "virtuoso.sidh@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Project Manager at Yokogawa",
            "experience": "Project Manager at Yokogawa",
            "contactinfo": "8808379955",
            "resume": "empty"
        }
    },
    {
        "personname": "Amit Gupta",
        "userid": "04CSE97",
        "usertype": "alumni",
        "email": "amitgupta04cs06.it@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Backup Addministrator at IBM",
            "experience": "Backup Addministrator at IBM",
            "contactinfo": "9990004303",
            "resume": "empty"
        }
    },
    {
        "personname": "RAHUL SHARMA",
        "userid": "02ECE55",
        "usertype": "alumni",
        "email": "rahul3372@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "EXECUTIVE OPERATIONS at THE ZEBRAS",
            "experience": "EXECUTIVE OPERATIONS at THE ZEBRAS",
            "contactinfo": "9911794810",
            "resume": "empty"
        }
    },
    {
        "personname": "Ayush Shankar Pandey",
        "userid": "12CSE98",
        "usertype": "alumni",
        "email": "ayushshankarpandey@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Self Startup",
            "experience": "Self Startup",
            "contactinfo": "7459071058",
            "resume": "empty"
        }
    },
    {
        "personname": "Niharika Mishra",
        "userid": "09ME64",
        "usertype": "alumni",
        "email": "niharikamishra754@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2009",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Manager-Trade finance and Operations at IMR metallurgical resources ag",
            "experience": "Manager-Trade finance and Operations at IMR metallurgical resources ag",
            "contactinfo": "9819863353",
            "resume": "empty"
        }
    },
    {
        "personname": "Rahul upadhyay",
        "userid": "06CE25",
        "usertype": "alumni",
        "email": "rahulnov05@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Engineer at Project and development India limited noida",
            "experience": "Engineer at Project and development India limited noida",
            "contactinfo": "9368987111",
            "resume": "empty"
        }
    },
    {
        "personname": "Nidheesh Goel",
        "userid": "03ME65",
        "usertype": "alumni",
        "email": "nidheesh.goel1984@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "ME",
            "aboutme": "Good initiative by IET.",
            "education": "No input provided",
            "currentrole": "Astt. Manager at Samsung Electronics",
            "experience": "Astt. Manager at Samsung Electronics",
            "contactinfo": "9990045501",
            "resume": "empty"
        }
    },
    {
        "personname": "Rahul Pandey",
        "userid": "02ECE56",
        "usertype": "alumni",
        "email": "pandey.rahul1983@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Co-founder",
            "experience": "Co-founder",
            "contactinfo": "8884651709",
            "resume": "empty"
        }
    },
    {
        "personname": "Lalit gautam",
        "userid": "06ECE57",
        "usertype": "alumni",
        "email": "gautam1221@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "ECE",
            "aboutme": "I am ready to attend any related function or query",
            "education": "No input provided",
            "currentrole": "Asst manager at Union bank of india",
            "experience": "Asst manager at Union bank of india",
            "contactinfo": "7738284606",
            "resume": "empty"
        }
    },
    {
        "personname": "Vipin",
        "userid": "10ME66",
        "usertype": "alumni",
        "email": "vipinkumar10me@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2010",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "8810039076",
            "resume": "empty"
        }
    },
    {
        "personname": "HIMANSHU JADON",
        "userid": "06CSE99",
        "usertype": "alumni",
        "email": "hjadon@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working at Corporation bank",
            "experience": "Working at Corporation bank",
            "contactinfo": "8467956346",
            "resume": "empty"
        }
    },
    {
        "personname": "Tarun Sharma",
        "userid": "06ECE58",
        "usertype": "alumni",
        "email": "tarun06ei53@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "ECE",
            "aboutme": "No",
            "education": "No input provided",
            "currentrole": "AM at hotel",
            "experience": "AM at hotel",
            "contactinfo": "9953530681",
            "resume": "empty"
        }
    },
    {
        "personname": "Alok Gupta",
        "userid": "99CSE100",
        "usertype": "alumni",
        "email": "rush2alok@yahoo.co.in",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Delivery Manager at TechMahindra Americas",
            "experience": "Delivery Manager at TechMahindra Americas",
            "contactinfo": "+14252738740",
            "resume": "empty"
        }
    },
    {
        "personname": "ALOK KUMAR YADAV",
        "userid": "08IT05",
        "usertype": "alumni",
        "email": "alokyadav.28feb@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "IT",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "CME at Nokia network solutions",
            "experience": "CME at Nokia network solutions",
            "contactinfo": "9336682903",
            "resume": "empty"
        }
    },
    {
        "personname": "VIJAY PAL",
        "userid": "08IT06",
        "usertype": "alumni",
        "email": "vijayiet9236@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "IT",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "9412423884",
            "resume": "empty"
        }
    },
    {
        "personname": "Devevendra Kumar",
        "userid": "98ECE59",
        "usertype": "alumni",
        "email": "Deviet78@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "ECE",
            "aboutme": "All is well. .....",
            "education": "No input provided",
            "currentrole": "Owner at Dev Industries",
            "experience": "Owner at Dev Industries",
            "contactinfo": "9319102924",
            "resume": "empty"
        }
    },
    {
        "personname": "Yogendra Singh",
        "userid": "06CSE101",
        "usertype": "alumni",
        "email": "yogen90@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Phd at Svpa&t",
            "experience": "Phd at Svpa&t",
            "contactinfo": "9027649777",
            "resume": "empty"
        }
    },
    {
        "personname": "Akshata Lavania",
        "userid": "02CSE102",
        "usertype": "alumni",
        "email": "akshatalavania@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Analytics Manager",
            "experience": "Analytics Manager",
            "contactinfo": "9899047124",
            "resume": "empty"
        }
    },
    {
        "personname": "Abhishek",
        "userid": "07CSE103",
        "usertype": "alumni",
        "email": "abhisheksingh07cs@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CSE",
            "aboutme": "I am very excited for this because I want  to do some thing and also meet with my old Buddies.",
            "education": "No input provided",
            "currentrole": "Senior GIS Expert at NF infratech",
            "experience": "Senior GIS Expert at NF infratech",
            "contactinfo": "9582401854",
            "resume": "empty"
        }
    },
    {
        "personname": "Vikash Babu",
        "userid": "07IT07",
        "usertype": "alumni",
        "email": "vkraj07it@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "IT",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "9456448313",
            "resume": "empty"
        }
    },
    {
        "personname": "PIYUSH CHAUDHARY",
        "userid": "03ME67",
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
            "currentrole": "Self Startup",
            "experience": "Self Startup",
            "contactinfo": "8077207879",
            "resume": "empty"
        }
    },
    {
        "personname": "Sanjeev nayak",
        "userid": "10ME68",
        "usertype": "alumni",
        "email": "sanjeevnayak1826@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2010",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Plant manager at kapilakrishi udhyog",
            "experience": "Plant manager at kapilakrishi udhyog",
            "contactinfo": "8445954078",
            "resume": "empty"
        }
    },
    {
        "personname": "Jitendra",
        "userid": "07ECE60",
        "usertype": "alumni",
        "email": "jitendraverma352@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Area sales manager at MEDILIFE TECHNOLOGIES",
            "experience": "Area sales manager at MEDILIFE TECHNOLOGIES",
            "contactinfo": "9582290029",
            "resume": "empty"
        }
    },
    {
        "personname": "vineet sharma",
        "userid": "07IT08",
        "usertype": "alumni",
        "email": "sharma.vineet883@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "IT",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "assistant teacher at basic education up",
            "experience": "assistant teacher at basic education up",
            "contactinfo": "8445276009",
            "resume": "empty"
        }
    },
    {
        "personname": "Rahul Sisodiya",
        "userid": "07IT09",
        "usertype": "alumni",
        "email": "rsrahulsisodiya@live.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "IT",
            "aboutme": "No comment..!!",
            "education": "No input provided",
            "currentrole": "Team Leader at Progressive Infotech Pvt. Ltd.",
            "experience": "Team Leader at Progressive Infotech Pvt. Ltd.",
            "contactinfo": "9752859857",
            "resume": "empty"
        }
    },
    {
        "personname": "Vibhor Singhal",
        "userid": "02CSE104",
        "usertype": "alumni",
        "email": "vibhor83@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working at BCG",
            "experience": "Working at BCG",
            "contactinfo": "9717531813",
            "resume": "empty"
        }
    },
    {
        "personname": "Rashid khan",
        "userid": "05ME69",
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
        }
    },
    {
        "personname": "Shailendra Kumar",
        "userid": "00CSE105",
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
        }
    },
    {
        "personname": "Gajender Kumar",
        "userid": "10ME70",
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
        }
    },
    {
        "personname": "Saurabh",
        "userid": "06CSE106",
        "usertype": "alumni",
        "email": "spathakmnit@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Sr. Engg. Process at Sentini Bioproducts Pvt. Ltd. Vijayawada",
            "experience": "Sr. Engg. Process at Sentini Bioproducts Pvt. Ltd. Vijayawada",
            "contactinfo": "8317652681",
            "resume": "empty"
        }
    },
    {
        "personname": "Ranjan kumar",
        "userid": "99CSE107",
        "usertype": "alumni",
        "email": "ranjan.hcl@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Sr Manager at PEC ltd",
            "experience": "Sr Manager at PEC ltd",
            "contactinfo": "9769231630",
            "resume": "empty"
        }
    },
    {
        "personname": "HARVEER SINGH",
        "userid": "07IT10",
        "usertype": "alumni",
        "email": "HARSHCHAHAR15@GMAIL.COM",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "IT",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Assistant Manager at ERICSSON INDIA LTD.",
            "experience": "Assistant Manager at ERICSSON INDIA LTD.",
            "contactinfo": "8588872731",
            "resume": "empty"
        }
    },
    {
        "personname": "Ashwani Purwar",
        "userid": "06CSE108",
        "usertype": "alumni",
        "email": "purwar.ashwin@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working at UP Govt",
            "experience": "Working at UP Govt",
            "contactinfo": "9453247297",
            "resume": "empty"
        }
    },
    {
        "personname": "Anurag Chaudhary",
        "userid": "08CSE109",
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
        }
    },
    {
        "personname": "Gaurav singh",
        "userid": "08CSE110",
        "usertype": "alumni",
        "email": "gs27986@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Microbiologist at Romson",
            "experience": "Microbiologist at Romson",
            "contactinfo": "7669070876",
            "resume": "empty"
        }
    },
    {
        "personname": "Ujjwal Kumar",
        "userid": "04ME71",
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
            "contactinfo": "+971528546657",
            "resume": "empty"
        }
    },
    {
        "personname": "Bhoopendra Singh",
        "userid": "00ME72",
        "usertype": "alumni",
        "email": "bhoopendra.singh@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "ME",
            "aboutme": "Delighted to see efforts of college in making an alumni base to help college reputation grow.",
            "education": "No input provided",
            "currentrole": "Founder at GMATINSIGHT",
            "experience": "Founder at GMATINSIGHT",
            "contactinfo": "9999687183",
            "resume": "empty"
        }
    },
    {
        "personname": "Aniruddh Mishra",
        "userid": "02CSE111",
        "usertype": "alumni",
        "email": "er.aniruddhmishra@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "CSE",
            "aboutme": "My job is transferrable anywhere in india.But currently posted in Meghalaya",
            "education": "No input provided",
            "currentrole": "Branch Manager at Central Bank of India",
            "experience": "Branch Manager at Central Bank of India",
            "contactinfo": "9871783558",
            "resume": "empty"
        }
    },
    {
        "personname": "Akhilesh kumar dubey",
        "userid": "00ME73",
        "usertype": "alumni",
        "email": "23.akhilesh@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "ME",
            "aboutme": "Would love to interact with the students on career guidance and various other prospects.",
            "education": "No input provided",
            "currentrole": "Asst. General Manager at Larsen & Toubro Limited",
            "experience": "Asst. General Manager at Larsen & Toubro Limited",
            "contactinfo": "+919925247441",
            "resume": "empty"
        }
    },
    {
        "personname": "Anurag Shrivastava",
        "userid": "00ME74",
        "usertype": "alumni",
        "email": "anurag.shrivastava@in.bosch.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Zonal Manager at Bosch Ltd",
            "experience": "Zonal Manager at Bosch Ltd",
            "contactinfo": "9876078077",
            "resume": "empty"
        }
    },
    {
        "personname": "Anurag Gupta",
        "userid": "06CSE112",
        "usertype": "alumni",
        "email": "gupta_anurag@hotmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Sr. Executive at Mother Dairy F & V Pvt. Ltd.",
            "experience": "Sr. Executive at Mother Dairy F & V Pvt. Ltd.",
            "contactinfo": "9650145155",
            "resume": "empty"
        }
    },
    {
        "personname": "Shalabh Kumar",
        "userid": "00ECE61",
        "usertype": "alumni",
        "email": "shalabhkumar24@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "tech lead at Borqs software solutions",
            "experience": "tech lead at Borqs software solutions",
            "contactinfo": "7042237143",
            "resume": "empty"
        }
    },
    {
        "personname": "Alok Chandra",
        "userid": "00ME75",
        "usertype": "alumni",
        "email": "alokchandra_7@hotmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "ME",
            "aboutme": "Worked in MNCs for around 9 years. Now taking care of family business.",
            "education": "No input provided",
            "currentrole": "Secretary at Mini Shikshan Prashikshan Society",
            "experience": "Secretary at Mini Shikshan Prashikshan Society",
            "contactinfo": "9319202129",
            "resume": "empty"
        }
    },
    {
        "personname": "Ashwani Gautam",
        "userid": "02ECE62",
        "usertype": "alumni",
        "email": "ashwani.gautam16@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "ECE",
            "aboutme": "Institute of Excellece",
            "education": "No input provided",
            "currentrole": "Assistant Manager at Power Plant",
            "experience": "Assistant Manager at Power Plant",
            "contactinfo": "8718900016",
            "resume": "empty"
        }
    },
    {
        "personname": "Geeta Saraswat",
        "userid": "00CSE113",
        "usertype": "alumni",
        "email": "geetasaraswat@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "CSE",
            "aboutme": "IET  khandari is the reason for all my success and achievement in my professional careers . Miss my days when I was in studying BE comp science .. 2000 batch . Lovely memories",
            "education": "No input provided",
            "currentrole": "Senior application developer at CIti group",
            "experience": "Senior application developer at CIti group",
            "contactinfo": "+16395714024",
            "resume": "empty"
        }
    },
    {
        "personname": "Sharad Chauhan",
        "userid": "99CSE114",
        "usertype": "alumni",
        "email": "Sharad23@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "IT Delivery Director at Y&L Consulting",
            "experience": "IT Delivery Director at Y&L Consulting",
            "contactinfo": "+12108500952",
            "resume": "empty"
        }
    },
    {
        "personname": "Anubha Agarwal",
        "userid": "00CSE115",
        "usertype": "alumni",
        "email": "anubha.ag1@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "9044987980",
            "resume": "empty"
        }
    },
    {
        "personname": "susheel kumar",
        "userid": "12ECE63",
        "usertype": "alumni",
        "email": "susheelsonu16@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "SALES DEVELOPEMENT MANAGER at HDFC LIFE",
            "experience": "SALES DEVELOPEMENT MANAGER at HDFC LIFE",
            "contactinfo": "9760077755",
            "resume": "empty"
        }
    },
    {
        "personname": "HARENDRA NARAYAN",
        "userid": "00ECE64",
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
        }
    },
    {
        "personname": "Mrdul kunar",
        "userid": "09CSE116",
        "usertype": "alumni",
        "email": "mradulkunae1989@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2009",
            "branch": "CSE",
            "aboutme": "Doing LLB",
            "education": "No input provided",
            "currentrole": "LLB at Delhi University",
            "experience": "LLB at Delhi University",
            "contactinfo": "7520567335",
            "resume": "empty"
        }
    },
    {
        "personname": "Pragati yadav",
        "userid": "04CSE117",
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
        }
    },
    {
        "personname": "Saurabh Pachauri",
        "userid": "06ME76",
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
        }
    },
    {
        "personname": "Anuj Yadav",
        "userid": "06ECE65",
        "usertype": "alumni",
        "email": "anujy352@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "State Head at Xiaomi India",
            "experience": "State Head at Xiaomi India",
            "contactinfo": "9540899878",
            "resume": "empty"
        }
    },
    {
        "personname": "Shailesh Kumar Mishra",
        "userid": "06ECE66",
        "usertype": "alumni",
        "email": "shailesh_mishra1985@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Sr. Engineer at Eaton Power Quality Pvt Ltd",
            "experience": "Sr. Engineer at Eaton Power Quality Pvt Ltd",
            "contactinfo": "9545375326",
            "resume": "empty"
        }
    },
    {
        "personname": "Jitendra pal singh",
        "userid": "05ME77",
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
        }
    },
    {
        "personname": "Manish Dixit",
        "userid": "07ME78",
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
        }
    },
    {
        "personname": "amit goldi",
        "userid": "05ME79",
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
        }
    },
    {
        "personname": "Ajeet Singh Yadav",
        "userid": "99ME80",
        "usertype": "alumni",
        "email": "ajeetsinghyadavme@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Asst. Professor at I.E.T. khandari Agra",
            "experience": "Asst. Professor at I.E.T. khandari Agra",
            "contactinfo": "9259918937",
            "resume": "empty"
        }
    },
    {
        "personname": "Ajeet Singh Yadav",
        "userid": "99ME81",
        "usertype": "alumni",
        "email": "ajeetsinghyadavme@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Asst. Professor at I.E.T. khandari Agra",
            "experience": "Asst. Professor at I.E.T. khandari Agra",
            "contactinfo": "9259918937",
            "resume": "empty"
        }
    },
    {
        "personname": "Abhishek Sharma",
        "userid": "07CSE118",
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
        }
    },
    {
        "personname": "Ankit Trivedi",
        "userid": "13ECE67",
        "usertype": "alumni",
        "email": "ankitiet123@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Doing Higher Education at CDAC",
            "experience": "Doing Higher Education at CDAC",
            "contactinfo": "8687073555",
            "resume": "empty"
        }
    },
    {
        "personname": "Shashank Rathore",
        "userid": "11CSE119",
        "usertype": "alumni",
        "email": "shashankrathore991@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Software engineer at Ics",
            "experience": "Software engineer at Ics",
            "contactinfo": "9935014195",
            "resume": "empty"
        }
    },
    {
        "personname": "DEEPIKA SINGH",
        "userid": "98CSE120",
        "usertype": "alumni",
        "email": "deepika.rudresh@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "MANAGER at HINDUSTAN AERONAUTICS LIMITED",
            "experience": "MANAGER at HINDUSTAN AERONAUTICS LIMITED",
            "contactinfo": "9453623715",
            "resume": "empty"
        }
    },
    {
        "personname": "Anurag Bhardwaj",
        "userid": "98ECE68",
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
        }
    },
    {
        "personname": "Deepak Jain",
        "userid": "98ECE69",
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
        }
    },
    {
        "personname": "ALOK PACHAURI",
        "userid": "02ECE70",
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
        }
    },
    {
        "personname": "Durgesh Kumar Tiwari",
        "userid": "08CSE121",
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
        }
    },
    {
        "personname": "Waris akhtar",
        "userid": "04ECE71",
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
        }
    },
    {
        "personname": "Waris akhtar",
        "userid": "04ECE72",
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
        }
    },
    {
        "personname": "Rahul",
        "userid": "14CSE122",
        "usertype": "alumni",
        "email": "anujkk05@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2014",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "8958858752",
            "resume": "empty"
        }
    },
    {
        "personname": "ajay kumar chaurasia",
        "userid": "06ECE73",
        "usertype": "alumni",
        "email": "akchaurasia.be@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "9456049525",
            "resume": "empty"
        }
    },
    {
        "personname": "Bhumika Agrahari",
        "userid": "08CSE123",
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
        }
    },
    {
        "personname": "Prabhat chandra yadav",
        "userid": "08ME82",
        "usertype": "alumni",
        "email": "met.2.prabhat@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "S.M at Ford",
            "experience": "S.M at Ford",
            "contactinfo": "9452235854",
            "resume": "empty"
        }
    },
    {
        "personname": "Prabhat chandra yadav",
        "userid": "08ME83",
        "usertype": "alumni",
        "email": "met.2.prabhat@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "S.M at Ford",
            "experience": "S.M at Ford",
            "contactinfo": "9452235854",
            "resume": "empty"
        }
    },
    {
        "personname": "Anmol Singh",
        "userid": "99ECE74",
        "usertype": "alumni",
        "email": "singh.anmol@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Principal Research Analyst at Gartner",
            "experience": "Principal Research Analyst at Gartner",
            "contactinfo": "+6583830385",
            "resume": "empty"
        }
    },
    {
        "personname": "Ravindra singh",
        "userid": "10ME84",
        "usertype": "alumni",
        "email": "iet7ravindra@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2010",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "8447601140",
            "resume": "empty"
        }
    },
    {
        "personname": "Abhishek kumar singh",
        "userid": "07CSE124",
        "usertype": "alumni",
        "email": "abhisheksingh07cs@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CSE",
            "aboutme": "Thanks.",
            "education": "No input provided",
            "currentrole": "GIS Expert at NF infratech",
            "experience": "GIS Expert at NF infratech",
            "contactinfo": "9582401854",
            "resume": "empty"
        }
    },
    {
        "personname": "HIMANSHU SRIVASTAVA",
        "userid": "10ME85",
        "usertype": "alumni",
        "email": "srivastavahimanshu002@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2010",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "TECHNICAL HEAD and CAD TRAINER at BESTECH SOLUTIONS",
            "experience": "TECHNICAL HEAD and CAD TRAINER at BESTECH SOLUTIONS",
            "contactinfo": "8896388963",
            "resume": "empty"
        }
    },
    {
        "personname": "Rahul Sharma",
        "userid": "03CSE125",
        "usertype": "alumni",
        "email": "rahul_31785@yahoo.co.in",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Assistant General Manager at Genomesense",
            "experience": "Assistant General Manager at Genomesense",
            "contactinfo": "9714665544",
            "resume": "empty"
        }
    },
    {
        "personname": "SUMIT KUMAR PANDEY",
        "userid": "10ME86",
        "usertype": "alumni",
        "email": "ambeshambi@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2010",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Engineer at DVB technology Pvt Ltd",
            "experience": "Engineer at DVB technology Pvt Ltd",
            "contactinfo": "7909004397",
            "resume": "empty"
        }
    },
    {
        "personname": "Anurag Ojha",
        "userid": "03CSE126",
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
        }
    },
    {
        "personname": "ratika bhardwaj",
        "userid": "03ECE75",
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
        }
    },
    {
        "personname": "Sadish katiyar",
        "userid": "02CSE127",
        "usertype": "alumni",
        "email": "sadish.katiyar@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Manger at HCL",
            "experience": "Manger at HCL",
            "contactinfo": "7042133333",
            "resume": "empty"
        }
    },
    {
        "personname": "Sadish katiyar",
        "userid": "02CSE128",
        "usertype": "alumni",
        "email": "sadish.katiyar@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Manger at HCL",
            "experience": "Manger at HCL",
            "contactinfo": "7042133333",
            "resume": "empty"
        }
    },
    {
        "personname": "Saurav Rathore",
        "userid": "00ECE76",
        "usertype": "alumni",
        "email": "saurav.es@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "ECE",
            "aboutme": "Really happy to be a part of this community",
            "education": "No input provided",
            "currentrole": "Consultant",
            "experience": "Consultant",
            "contactinfo": "469 610 7744",
            "resume": "empty"
        }
    },
    {
        "personname": "Amit Singh Rana",
        "userid": "02ME87",
        "usertype": "alumni",
        "email": "mechfire4@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "ME",
            "aboutme": "Great initiative to gather all batchmates.",
            "education": "No input provided",
            "currentrole": "Deputy Manager at Amity Noida",
            "experience": "Deputy Manager at Amity Noida",
            "contactinfo": "8791011777",
            "resume": "empty"
        }
    },
    {
        "personname": "Nitin Saxena",
        "userid": "08ECE77",
        "usertype": "alumni",
        "email": "Nitinsaxena_one@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Sr. Engineer at Schneider Electric",
            "experience": "Sr. Engineer at Schneider Electric",
            "contactinfo": "9711787118",
            "resume": "empty"
        }
    },
    {
        "personname": "Ankit Agrawal",
        "userid": "03ME88",
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
        }
    },
    {
        "personname": "Sandeep Yadav",
        "userid": "09ME89",
        "usertype": "alumni",
        "email": "sandip14490@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2009",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Production Engineer at SRMM ENVIRONMENT EQUIPMENT",
            "experience": "Production Engineer at SRMM ENVIRONMENT EQUIPMENT",
            "contactinfo": "7977884308",
            "resume": "empty"
        }
    },
    {
        "personname": "Ashish Dubey",
        "userid": "06ECE78",
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
            "currentrole": "Self Startup",
            "experience": "Self Startup",
            "contactinfo": "7428236620",
            "resume": "empty"
        }
    },
    {
        "personname": "Shahnawaz Ahmad",
        "userid": "03CE26",
        "usertype": "alumni",
        "email": "shahnawaz_iet@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "CE",
            "aboutme": "LNG  tank project",
            "education": "No input provided",
            "currentrole": "Senior project engineer at Hyundai engineering",
            "experience": "Senior project engineer at Hyundai engineering",
            "contactinfo": "+919852516243",
            "resume": "empty"
        }
    },
    {
        "personname": "Love dixit",
        "userid": "08CE27",
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
        }
    },
    {
        "personname": "Love dixit",
        "userid": "08CE28",
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
        }
    },
    {
        "personname": "GAURAV AGARWAL",
        "userid": "02ECE79",
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
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "9760045789",
            "resume": "empty"
        }
    },
    {
        "personname": "Pravendra kumar rawat",
        "userid": "08CSE129",
        "usertype": "alumni",
        "email": "pkrawat777@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Asst Manager at Varun Beverages ltd Nuh Mewat Haryana (Pepsi)",
            "experience": "Asst Manager at Varun Beverages ltd Nuh Mewat Haryana (Pepsi)",
            "contactinfo": "8923444777",
            "resume": "empty"
        }
    },
    {
        "personname": "Pravendra kumar rawat",
        "userid": "08CSE130",
        "usertype": "alumni",
        "email": "pkrawat777@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Asst Manager at Varun Beverages ltd (Pepsi)",
            "experience": "Asst Manager at Varun Beverages ltd (Pepsi)",
            "contactinfo": "8923444777",
            "resume": "empty"
        }
    },
    {
        "personname": "Vaibhav Kumar",
        "userid": "03ME90",
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
        }
    },
    {
        "personname": "Deepak Sharma",
        "userid": "03CSE131",
        "usertype": "alumni",
        "email": "deepak2185@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "9560706770",
            "resume": "empty"
        }
    },
    {
        "personname": "SUMIT VERMA",
        "userid": "98ECE80",
        "usertype": "alumni",
        "email": "sumitmpverma@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "ECE",
            "aboutme": "Glad to see the development in the college. I wish it all the very best.",
            "education": "No input provided",
            "currentrole": "VICE PRESIDENT at ICICI SECURITIES LTD.",
            "experience": "VICE PRESIDENT at ICICI SECURITIES LTD.",
            "contactinfo": "9599107819",
            "resume": "empty"
        }
    },
    {
        "personname": "aviral sharma",
        "userid": "03ECE81",
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
        }
    },
    {
        "personname": "Himanshu Bhaskar",
        "userid": "03ME91",
        "usertype": "alumni",
        "email": "himanshubhaskar87@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "ME",
            "aboutme": "Government polytechnic lucknow",
            "education": "No input provided",
            "currentrole": "Lecturer Mechanical at Technical Education Department U.P.",
            "experience": "Lecturer Mechanical at Technical Education Department U.P.",
            "contactinfo": "8958742803",
            "resume": "empty"
        }
    },
    {
        "personname": "Dr. Om prakash verma",
        "userid": "04ECE82",
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
        }
    },
    {
        "personname": "PAWAN KUMAR SINGH",
        "userid": "13ME92",
        "usertype": "alumni",
        "email": "pks1311995@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "8765355298",
            "resume": "empty"
        }
    },
    {
        "personname": "Arun Agrawal",
        "userid": "03ECE83",
        "usertype": "alumni",
        "email": "arunagrawal.16@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Manager at Reliance jio infocomm Ltd",
            "experience": "Manager at Reliance jio infocomm Ltd",
            "contactinfo": "7300094117",
            "resume": "empty"
        }
    },
    {
        "personname": "Devendra kushwaha",
        "userid": "99CSE132",
        "usertype": "alumni",
        "email": "devendra.kush@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Project manager at Fiserv",
            "experience": "Project manager at Fiserv",
            "contactinfo": "8800499520",
            "resume": "empty"
        }
    },
    {
        "personname": "AYUSH GUPTA",
        "userid": "03ME93",
        "usertype": "alumni",
        "email": "tech_ayush85@yahoo.co.in",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "9445953659",
            "resume": "empty"
        }
    },
    {
        "personname": "Bhanu pratap",
        "userid": "03ME94",
        "usertype": "alumni",
        "email": "pratapsyn@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "ME",
            "aboutme": "Thanks",
            "education": "No input provided",
            "currentrole": "Assistant manager at SYNDICATE BANK",
            "experience": "Assistant manager at SYNDICATE BANK",
            "contactinfo": "7049750716",
            "resume": "empty"
        }
    },
    {
        "personname": "Saurabh sharma",
        "userid": "03ME95",
        "usertype": "alumni",
        "email": "2574476265@qq.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "GM at Shenzhen Cpplus Intetnational Ltd",
            "experience": "GM at Shenzhen Cpplus Intetnational Ltd",
            "contactinfo": "+8613590487415",
            "resume": "empty"
        }
    },
    {
        "personname": "Kapil Goswami",
        "userid": "99ECE84",
        "usertype": "alumni",
        "email": "kapilgoswami2575@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Lecturer (Gazetted) at Govt. Polytechnic, Jhansi",
            "experience": "Lecturer (Gazetted) at Govt. Polytechnic, Jhansi",
            "contactinfo": "09456674149",
            "resume": "empty"
        }
    },
    {
        "personname": "Varun Singh Pal",
        "userid": "03ECE85",
        "usertype": "alumni",
        "email": "varunsinghpal@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Finance Manager at Atlantic Construction LLC",
            "experience": "Finance Manager at Atlantic Construction LLC",
            "contactinfo": "096892695534",
            "resume": "empty"
        }
    },
    {
        "personname": "Ravindra Singh",
        "userid": "07ME96",
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
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "9808784727",
            "resume": "empty"
        }
    },
    {
        "personname": "Ankit Mittal",
        "userid": "01ME97",
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
        }
    },
    {
        "personname": "VINAY KUMAR SINGH",
        "userid": "03ME98",
        "usertype": "alumni",
        "email": "vinay.mech05@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "lecturer at technical education",
            "experience": "lecturer at technical education",
            "contactinfo": "7408434673",
            "resume": "empty"
        }
    },
    {
        "personname": "Anuj Sharma",
        "userid": "98CSE133",
        "usertype": "alumni",
        "email": "anuj1_ietk@yahoo.co.in",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working at Infosys",
            "experience": "Working at Infosys",
            "contactinfo": "9130052450",
            "resume": "empty"
        }
    },
    {
        "personname": "Mukund Keshoraiya",
        "userid": "03ME99",
        "usertype": "alumni",
        "email": "mkeshoraiya@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Asst. Manager - HR at Honda Cars India Ltd.",
            "experience": "Asst. Manager - HR at Honda Cars India Ltd.",
            "contactinfo": "9911550757",
            "resume": "empty"
        }
    },
    {
        "personname": "Ravindra Singh",
        "userid": "10ME100",
        "usertype": "alumni",
        "email": "iet7ravindra@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2010",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "8447601140",
            "resume": "empty"
        }
    },
    {
        "personname": "Vijay Abrol",
        "userid": "01CSE134",
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
        }
    },
    {
        "personname": "Km Shalini Tiwari",
        "userid": "10ME101",
        "usertype": "alumni",
        "email": "18139592518nish@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2010",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "8175091975",
            "resume": "empty"
        }
    },
    {
        "personname": "Bal Mukund Sharma",
        "userid": "03CSE135",
        "usertype": "alumni",
        "email": "mukundsharma26@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "+358469391634",
            "resume": "empty"
        }
    },
    {
        "personname": "Nitin Kishore",
        "userid": "03ME102",
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
        }
    },
    {
        "personname": "Sandeep Dahiya",
        "userid": "03ME103",
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
        }
    },
    {
        "personname": "Mohd.Akbar Ansari",
        "userid": "04ME104",
        "usertype": "alumni",
        "email": "ansari.1822@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Self Startup",
            "experience": "Self Startup",
            "contactinfo": "9335211281",
            "resume": "empty"
        }
    },
    {
        "personname": "Vishwa Pratap Singh Chauhan",
        "userid": "03ME105",
        "usertype": "alumni",
        "email": "vchauhan2218@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Q.C.Manager at AMI CYLINDERS",
            "experience": "Q.C.Manager at AMI CYLINDERS",
            "contactinfo": "9457039715",
            "resume": "empty"
        }
    },
    {
        "personname": "Mohammad Ilyas Mirza",
        "userid": "03CE29",
        "usertype": "alumni",
        "email": "mirzailyasbe@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "CE",
            "aboutme": "I miss those days",
            "education": "No input provided",
            "currentrole": "Assistance engineers at JAMMU and KASHMIR GOVERNMENT",
            "experience": "Assistance engineers at JAMMU and KASHMIR GOVERNMENT",
            "contactinfo": "01942427897",
            "resume": "empty"
        }
    },
    {
        "personname": "Amrit Raj",
        "userid": "10ME106",
        "usertype": "alumni",
        "email": "amritraj03@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2010",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Design Engineer",
            "experience": "Design Engineer",
            "contactinfo": "8400240990",
            "resume": "empty"
        }
    },
    {
        "personname": "Vedvrat",
        "userid": "02ECE86",
        "usertype": "alumni",
        "email": "r.ved.hbti@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "9598393055",
            "resume": "empty"
        }
    },
    {
        "personname": "Rohit Roushan",
        "userid": "02CE30",
        "usertype": "alumni",
        "email": "rohit.rousha@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "CE",
            "aboutme": "Good",
            "education": "No input provided",
            "currentrole": "Engg at Mcd",
            "experience": "Engg at Mcd",
            "contactinfo": "8527531556",
            "resume": "empty"
        }
    },
    {
        "personname": "Ashish shukla",
        "userid": "07CSE136",
        "usertype": "alumni",
        "email": "ashish8409@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Research coordinator at ITS DENTAL COLLEGE",
            "experience": "Research coordinator at ITS DENTAL COLLEGE",
            "contactinfo": "8800456520",
            "resume": "empty"
        }
    },
    {
        "personname": "Avinash Kumar Sharma",
        "userid": "07CSE137",
        "usertype": "alumni",
        "email": "avinashsharma754@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CSE",
            "aboutme": "I need my Degree.",
            "education": "No input provided",
            "currentrole": "QA Manager at Suppletek Industries Pvt Ltd",
            "experience": "QA Manager at Suppletek Industries Pvt Ltd",
            "contactinfo": "7087010995",
            "resume": "empty"
        }
    },
    {
        "personname": "SHAILENDRA",
        "userid": "06ME107",
        "usertype": "alumni",
        "email": "shailendra1001@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "ME",
            "aboutme": "After Engineering completed M. Tech (Production) from NIT Allahabad 2007-2009 batch and received Gold Medal for securing First Position in class. Joined BHEL in November 2008,presently working at BHEL Kolkata.",
            "education": "No input provided",
            "currentrole": "Dy. Manager at BHEL",
            "experience": "Dy. Manager at BHEL",
            "contactinfo": "8902496063",
            "resume": "empty"
        }
    },
    {
        "personname": "Raj Kumar Rai",
        "userid": "03CE31",
        "usertype": "alumni",
        "email": "rajkumarrai1982@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "CE",
            "aboutme": "Government can make engineer diploma holder not degree holders",
            "education": "No input provided",
            "currentrole": "Sr. Assistant at P W D Allahabad",
            "experience": "Sr. Assistant at P W D Allahabad",
            "contactinfo": "9839938557",
            "resume": "empty"
        }
    },
    {
        "personname": "Ashish Kumar Mogha",
        "userid": "02ECE87",
        "usertype": "alumni",
        "email": "mogha.npl@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "ECE",
            "aboutme": "Working in thermal power plant which is located near to Chandigarh.",
            "education": "No input provided",
            "currentrole": "Deputy Manager at Larsen & Toubro ltd",
            "experience": "Deputy Manager at Larsen & Toubro ltd",
            "contactinfo": "9779245398",
            "resume": "empty"
        }
    },
    {
        "personname": "Navinder Singh",
        "userid": "02ME108",
        "usertype": "alumni",
        "email": "navinder02@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Dy. MANAGER at IPGCL PPCL NEW DELHI",
            "experience": "Dy. MANAGER at IPGCL PPCL NEW DELHI",
            "contactinfo": "9560366461",
            "resume": "empty"
        }
    },
    {
        "personname": "Mohd iqbal malik",
        "userid": "08CE32",
        "usertype": "alumni",
        "email": "ermalik1989@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "CE",
            "aboutme": "I feel proud to be a student of IET khandari",
            "education": "No input provided",
            "currentrole": "Assistant engineer at PWD (R&B) JAMMU",
            "experience": "Assistant engineer at PWD (R&B) JAMMU",
            "contactinfo": "9622057697",
            "resume": "empty"
        }
    },
    {
        "personname": "Syed Farmanul Hoda",
        "userid": "07ME109",
        "usertype": "alumni",
        "email": "farman282002@yahoo.co.in",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Safety Supervisor at Oil& Gas refinery construction",
            "experience": "Safety Supervisor at Oil& Gas refinery construction",
            "contactinfo": "9572103143",
            "resume": "empty"
        }
    },
    {
        "personname": "Abhinav",
        "userid": "01ECE88",
        "usertype": "alumni",
        "email": "aabhinavv@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2001",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working at Actelis Networks",
            "experience": "Working at Actelis Networks",
            "contactinfo": "9910854222",
            "resume": "empty"
        }
    },
    {
        "personname": "Harish Singh Bilal",
        "userid": "07ME110",
        "usertype": "alumni",
        "email": "harish460@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Asst. Production Manager at Interarch Building products Pvt LTD.",
            "experience": "Asst. Production Manager at Interarch Building products Pvt LTD.",
            "contactinfo": "09003784207",
            "resume": "empty"
        }
    },
    {
        "personname": "Ajay Kumar dakch",
        "userid": "99ME111",
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
        }
    },
    {
        "personname": "ANIL gangwar",
        "userid": "99ME112",
        "usertype": "alumni",
        "email": "er.anilgangwar9@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ME",
            "aboutme": "I m happy to know about this event.i a coming iet.......",
            "education": "No input provided",
            "currentrole": "Chairman at Dr.ram bahadur singh memorial degree college milak",
            "experience": "Chairman at Dr.ram bahadur singh memorial degree college milak",
            "contactinfo": "8171211111",
            "resume": "empty"
        }
    },
    {
        "personname": "NAGESH PAL SINGH",
        "userid": "99ME113",
        "usertype": "alumni",
        "email": "nageshpalsingh@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "DY MANAGER at ENGINEERS INDIA LIMITED",
            "experience": "DY MANAGER at ENGINEERS INDIA LIMITED",
            "contactinfo": "8291406596",
            "resume": "empty"
        }
    },
    {
        "personname": "Dinesh Pratap Singh",
        "userid": "99ME114",
        "usertype": "alumni",
        "email": "dineshpratap@rediffmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Senior Manager at Daimler",
            "experience": "Senior Manager at Daimler",
            "contactinfo": "9509511122",
            "resume": "empty"
        }
    },
    {
        "personname": "Chandra Bhanu Singh",
        "userid": "99ME115",
        "usertype": "alumni",
        "email": "bhanu_alakh@rediffmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ME",
            "aboutme": "Good start by our IET",
            "education": "No input provided",
            "currentrole": "Assistant Engineer at UPRVUNL",
            "experience": "Assistant Engineer at UPRVUNL",
            "contactinfo": "9415903011",
            "resume": "empty"
        }
    },
    {
        "personname": "Durjendra Singh",
        "userid": "99ECE89",
        "usertype": "alumni",
        "email": "durjendra.singh@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "AM2 at Samsung",
            "experience": "AM2 at Samsung",
            "contactinfo": "9887005384",
            "resume": "empty"
        }
    },
    {
        "personname": "Manoj Dixit",
        "userid": "99CSE138",
        "usertype": "alumni",
        "email": "manojdixit.8.fzd@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Self Startup",
            "experience": "Self Startup",
            "contactinfo": "9927025135",
            "resume": "empty"
        }
    },
    {
        "personname": "Nitin Varshney",
        "userid": "99CSE139",
        "usertype": "alumni",
        "email": "nitincreative@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working at Infosys technologies",
            "experience": "Working at Infosys technologies",
            "contactinfo": "9503403103",
            "resume": "empty"
        }
    },
    {
        "personname": "Prabhat Kumar Soni",
        "userid": "99ME116",
        "usertype": "alumni",
        "email": "fmasoni2004@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Sr. Manager at Hero Motors",
            "experience": "Sr. Manager at Hero Motors",
            "contactinfo": "9811255389",
            "resume": "empty"
        }
    },
    {
        "personname": "DIWAKAR TIWRI",
        "userid": "99ME117",
        "usertype": "alumni",
        "email": "diwakarway2@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ME",
            "aboutme": "Thanks University to connect with aluminai. Late but good step.",
            "education": "No input provided",
            "currentrole": "Vice President at Phoenix Pharmaceutical",
            "experience": "Vice President at Phoenix Pharmaceutical",
            "contactinfo": "8755056060",
            "resume": "empty"
        }
    },
    {
        "personname": "Piyush Mishra",
        "userid": "99ME118",
        "usertype": "alumni",
        "email": "piyushmishra_9@rediffmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Manager at Punjab National Bank",
            "experience": "Manager at Punjab National Bank",
            "contactinfo": "9915728067",
            "resume": "empty"
        }
    },
    {
        "personname": "Adarsh saini",
        "userid": "99ME119",
        "usertype": "alumni",
        "email": "adarsh.saini32@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Self Startup",
            "experience": "Self Startup",
            "contactinfo": "8218121271",
            "resume": "empty"
        }
    },
    {
        "personname": "Amit Yadav",
        "userid": "07ECE90",
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
        }
    },
    {
        "personname": "Rahul Agnihotri",
        "userid": "07ECE91",
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
        }
    },
    {
        "personname": "Keshav kumar",
        "userid": "08ECE92",
        "usertype": "alumni",
        "email": "keshavkumar425@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "ECE",
            "aboutme": "Suparbaijar",
            "education": "No input provided",
            "currentrole": "B E at Fasility",
            "experience": "B E at Fasility",
            "contactinfo": "9454910566",
            "resume": "empty"
        }
    },
    {
        "personname": "Divyajyot Singh",
        "userid": "03ME120",
        "usertype": "alumni",
        "email": "divyajyot.singh@rediffmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Deputy Manager at Engineers India Limited",
            "experience": "Deputy Manager at Engineers India Limited",
            "contactinfo": "8157966880",
            "resume": "empty"
        }
    },
    {
        "personname": "Anubhav Agarwal",
        "userid": "04ECE93",
        "usertype": "alumni",
        "email": "agarwalanubhav84@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "9716888874",
            "resume": "empty"
        }
    },
    {
        "personname": "Ajay pratap singh",
        "userid": "07ECE94",
        "usertype": "alumni",
        "email": "baghel.ajay1@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Site Engg at ERDA",
            "experience": "Site Engg at ERDA",
            "contactinfo": "7669420009",
            "resume": "empty"
        }
    },
    {
        "personname": "Manoj kumar",
        "userid": "00ME121",
        "usertype": "alumni",
        "email": "manoj_kumar1283@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Dyp.Manager at Shree Cement Ltd.",
            "experience": "Dyp.Manager at Shree Cement Ltd.",
            "contactinfo": "8890313157",
            "resume": "empty"
        }
    },
    {
        "personname": "Pankaj Gautam",
        "userid": "07ECE95",
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
        }
    },
    {
        "personname": "Kaushik Jha",
        "userid": "06CSE140",
        "usertype": "alumni",
        "email": "jhakaushik21@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Scientist at ACSEN HYVEG pvt ltd",
            "experience": "Scientist at ACSEN HYVEG pvt ltd",
            "contactinfo": "9459400161",
            "resume": "empty"
        }
    },
    {
        "personname": "ravi",
        "userid": "98CSE141",
        "usertype": "alumni",
        "email": "ravi.grade@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Area Incharge at Hatyway",
            "experience": "Area Incharge at Hatyway",
            "contactinfo": "8826291422",
            "resume": "empty"
        }
    },
    {
        "personname": "Nisheet Kumar",
        "userid": "01CSE142",
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
        }
    },
    {
        "personname": "Harish Singh Bilal",
        "userid": "07ME122",
        "usertype": "alumni",
        "email": "harish460@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Asst. Production Manager at Interarch Building products Pvt LTD.",
            "experience": "Asst. Production Manager at Interarch Building products Pvt LTD.",
            "contactinfo": "09003784207",
            "resume": "empty"
        }
    },
    {
        "personname": "Deepak Kumar",
        "userid": "02ME123",
        "usertype": "alumni",
        "email": "deepak19862006@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Executive Engineer at Oil & Natural Gas Corporation",
            "experience": "Executive Engineer at Oil & Natural Gas Corporation",
            "contactinfo": "9491069196",
            "resume": "empty"
        }
    },
    {
        "personname": "Aseem Kumar",
        "userid": "02ME124",
        "usertype": "alumni",
        "email": "aseemkrshrivastav@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Director & Chief Consultant at VDT Pipeline Integrity Solutions Private Limited",
            "experience": "Director & Chief Consultant at VDT Pipeline Integrity Solutions Private Limited",
            "contactinfo": "9687617662",
            "resume": "empty"
        }
    },
    {
        "personname": "VIJAY SINGH GAUTAM",
        "userid": "99ME125",
        "usertype": "alumni",
        "email": "gautam.r08@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Team Member at Andrtz Hydro Pvt Ltd",
            "experience": "Team Member at Andrtz Hydro Pvt Ltd",
            "contactinfo": "9582517262",
            "resume": "empty"
        }
    },
    {
        "personname": "SHASHANK SHEKHAR",
        "userid": "10ME126",
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
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "8285028210",
            "resume": "empty"
        }
    },
    {
        "personname": "SHASHANK SHEKHAR",
        "userid": "10ME127",
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
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "8285028210",
            "resume": "empty"
        }
    },
    {
        "personname": "Dr SURYA PRAKASH",
        "userid": "02ME128",
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
        }
    },
    {
        "personname": "Ashish",
        "userid": "03ME129",
        "usertype": "alumni",
        "email": "ashish_iet07@yahoo.co.in",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "ME",
            "aboutme": "Yes we can",
            "education": "No input provided",
            "currentrole": "Doing Higher Education",
            "experience": "Doing Higher Education",
            "contactinfo": "9897482331",
            "resume": "empty"
        }
    },
    {
        "personname": "Rupesh Chaturvedi",
        "userid": "05ECE96",
        "usertype": "alumni",
        "email": "chaturvedi.rupesh@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2005",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Sales and service engineer at Total solutions",
            "experience": "Sales and service engineer at Total solutions",
            "contactinfo": "9899214196",
            "resume": "empty"
        }
    },
    {
        "personname": "Ashish",
        "userid": "03ME130",
        "usertype": "alumni",
        "email": "ashish_iet07@yahoo.co.in",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "ME",
            "aboutme": "Yes we can",
            "education": "No input provided",
            "currentrole": "Doing Higher Education",
            "experience": "Doing Higher Education",
            "contactinfo": "9897482331",
            "resume": "empty"
        }
    },
    {
        "personname": "Vivek krishna singh",
        "userid": "06CE33",
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
        }
    },
    {
        "personname": "Sanju Singh rajput",
        "userid": "06ECE97",
        "usertype": "alumni",
        "email": "err.sanjurajputt@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "ECE",
            "aboutme": "Sanju",
            "education": "No input provided",
            "currentrole": "SR.engg. at Ksw India Pvt Ltd",
            "experience": "SR.engg. at Ksw India Pvt Ltd",
            "contactinfo": "7065780094",
            "resume": "empty"
        }
    },
    {
        "personname": "Gaurav Kumar",
        "userid": "99ME131",
        "usertype": "alumni",
        "email": "gaurav_fariha@rediffmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Manager Engineering at Nestle India Limited",
            "experience": "Manager Engineering at Nestle India Limited",
            "contactinfo": "9814100663",
            "resume": "empty"
        }
    },
    {
        "personname": "Atul Kumar Yadav",
        "userid": "04IT11",
        "usertype": "alumni",
        "email": "atul.iet18@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "IT",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "9716668177",
            "resume": "empty"
        }
    },
    {
        "personname": "Harsh Sharma",
        "userid": "09CSE143",
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
        }
    },
    {
        "personname": "TEJ PRATAP SINGH",
        "userid": "07ME132",
        "usertype": "alumni",
        "email": "tejpratap_singh8180@rediffmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "ME",
            "aboutme": "I have 3 year work experience in quality assurance but present iam preparing for gov't job",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "8449932153",
            "resume": "empty"
        }
    },
    {
        "personname": "Vivek Kumar Singh",
        "userid": "99ME133",
        "usertype": "alumni",
        "email": "vksingh18881@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ME",
            "aboutme": "Thanks for this initiative",
            "education": "No input provided",
            "currentrole": "Director at Chipsnkits Technologies Pvt Ltd",
            "experience": "Director at Chipsnkits Technologies Pvt Ltd",
            "contactinfo": "9718534313",
            "resume": "empty"
        }
    },
    {
        "personname": "Diwakar Gupta",
        "userid": "02ECE98",
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
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "9560199910",
            "resume": "empty"
        }
    },
    {
        "personname": "Hemant Kumar",
        "userid": "06CSE144",
        "usertype": "alumni",
        "email": "hemantgautam.iet@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CSE",
            "aboutme": "!!**\u00a1!**\u00a1!!!",
            "education": "No input provided",
            "currentrole": "Self Startup at self business",
            "experience": "Self Startup at self business",
            "contactinfo": "8736885555",
            "resume": "empty"
        }
    },
    {
        "personname": "Hemant k singh",
        "userid": "99ME134",
        "usertype": "alumni",
        "email": "hemantkumar_iet@rediffmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ME",
            "aboutme": "Will join alumni meet",
            "education": "No input provided",
            "currentrole": "Sr mgr at Tata motors",
            "experience": "Sr mgr at Tata motors",
            "contactinfo": "7755001941",
            "resume": "empty"
        }
    },
    {
        "personname": "VICKY GAUTAM",
        "userid": "99ME135",
        "usertype": "alumni",
        "email": "vgautam.barc@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Scientific Officer at Bhabha Atomic Research Center",
            "experience": "Scientific Officer at Bhabha Atomic Research Center",
            "contactinfo": "9223268232",
            "resume": "empty"
        }
    },
    {
        "personname": "Atul Kumar Singh",
        "userid": "04ME136",
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
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "8003190940",
            "resume": "empty"
        }
    },
    {
        "personname": "Amit Yadav",
        "userid": "07ECE99",
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
        }
    },
    {
        "personname": "Neeraj agarwal",
        "userid": "06CSE145",
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
        }
    },
    {
        "personname": "Neeraj agarwal",
        "userid": "06CSE146",
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
        }
    },
    {
        "personname": "ASHWANI KUMAR",
        "userid": "09ECE100",
        "usertype": "alumni",
        "email": "pintukr19@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2009",
            "branch": "ECE",
            "aboutme": "NA",
            "education": "No input provided",
            "currentrole": "EMBEDDED ENGINEER ROBOTICS",
            "experience": "EMBEDDED ENGINEER ROBOTICS",
            "contactinfo": "9013242049",
            "resume": "empty"
        }
    },
    {
        "personname": "Veer Singh",
        "userid": "05ECE101",
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
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "8373917039",
            "resume": "empty"
        }
    },
    {
        "personname": "Manish vimal",
        "userid": "99ME137",
        "usertype": "alumni",
        "email": "manish_citd@yahoo.co.in",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Manager at Pentair",
            "experience": "Manager at Pentair",
            "contactinfo": "9873441650",
            "resume": "empty"
        }
    },
    {
        "personname": "Vineet Sarswat",
        "userid": "07ME138",
        "usertype": "alumni",
        "email": "er.vineetsarswat@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "ME",
            "aboutme": "Working As Loco Pilot  in Indian Railways.",
            "education": "No input provided",
            "currentrole": "Loco Pilot at Indian Railway",
            "experience": "Loco Pilot at Indian Railway",
            "contactinfo": "9027195075",
            "resume": "empty"
        }
    },
    {
        "personname": "Deepak Tomar",
        "userid": "03CSE147",
        "usertype": "alumni",
        "email": "dpk.tomer@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Ass. Manager at Ferro Scrap Nigam Limited",
            "experience": "Ass. Manager at Ferro Scrap Nigam Limited",
            "contactinfo": "7587098146",
            "resume": "empty"
        }
    },
    {
        "personname": "Arun Mishra",
        "userid": "06ECE102",
        "usertype": "alumni",
        "email": "arunmishrra@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "CPC, Purchase at Delta Power Solutions, Plot No.38",
            "experience": "CPC, Purchase at Delta Power Solutions, Plot No.38",
            "contactinfo": "8307456290",
            "resume": "empty"
        }
    },
    {
        "personname": "Gaurav Mishra",
        "userid": "02IT12",
        "usertype": "alumni",
        "email": "gauravmishra88@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "IT",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Team Lead at Delloite Consulting",
            "experience": "Team Lead at Delloite Consulting",
            "contactinfo": "9911735607",
            "resume": "empty"
        }
    },
    {
        "personname": "Akshay kumar",
        "userid": "06CSE148",
        "usertype": "alumni",
        "email": "akshayrajpathak@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CSE",
            "aboutme": "It's great that IET is starting alumni meet. My best wishes to all.",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "8840336044",
            "resume": "empty"
        }
    },
    {
        "personname": "Rajnesh kumar chaudhary",
        "userid": "02IT13",
        "usertype": "alumni",
        "email": "er.rajneshchaudhary@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "IT",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Self Startup",
            "experience": "Self Startup",
            "contactinfo": "7017459633",
            "resume": "empty"
        }
    },
    {
        "personname": "Shiv Shankar yadav",
        "userid": "07CSE149",
        "usertype": "alumni",
        "email": "ssyadav8245@gmail.comgmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Site engineer at Oriental infrastructure pvt. Ltd.",
            "experience": "Site engineer at Oriental infrastructure pvt. Ltd.",
            "contactinfo": "9027609528",
            "resume": "empty"
        }
    },
    {
        "personname": "DESH DEEPAK",
        "userid": "07CE34",
        "usertype": "alumni",
        "email": "yadavdeepak877@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam at MADE EASY",
            "experience": "Preparing for Competative exam at MADE EASY",
            "contactinfo": "9808126624",
            "resume": "empty"
        }
    },
    {
        "personname": "Ankush Pratap",
        "userid": "08ECE103",
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
        }
    },
    {
        "personname": "Raghvendra Kumar gathaina",
        "userid": "01CSE150",
        "usertype": "alumni",
        "email": "raghvendra.gathaina@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2001",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Senior manager at Jio",
            "experience": "Senior manager at Jio",
            "contactinfo": "7900071165",
            "resume": "empty"
        }
    },
    {
        "personname": "Harsh Dalal",
        "userid": "02IT14",
        "usertype": "alumni",
        "email": "789harsh@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "IT",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Self Startup",
            "experience": "Self Startup",
            "contactinfo": "8750476151",
            "resume": "empty"
        }
    },
    {
        "personname": "Piyush srivastava",
        "userid": "06CSE151",
        "usertype": "alumni",
        "email": "piyush.srivastava34@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Assistant manager at Aakash educational ltd",
            "experience": "Assistant manager at Aakash educational ltd",
            "contactinfo": "8976521962",
            "resume": "empty"
        }
    },
    {
        "personname": "RAJAN KUMAR UPADHYAY",
        "userid": "04ECE104",
        "usertype": "alumni",
        "email": "smaoty700@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "FOUNDING MEMBER at IPRATHAM",
            "experience": "FOUNDING MEMBER at IPRATHAM",
            "contactinfo": "7489032289",
            "resume": "empty"
        }
    },
    {
        "personname": "Santosh Gaurav",
        "userid": "04ECE105",
        "usertype": "alumni",
        "email": "sgaurav101@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Dy. Manager at Steel Authority Of India Ltd.",
            "experience": "Dy. Manager at Steel Authority Of India Ltd.",
            "contactinfo": "8986874277",
            "resume": "empty"
        }
    },
    {
        "personname": "Satendra Kumar Nigam",
        "userid": "06CSE152",
        "usertype": "alumni",
        "email": "satendra.nigam30@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "9259067521",
            "resume": "empty"
        }
    },
    {
        "personname": "Pradeep Kumar",
        "userid": "99ECE106",
        "usertype": "alumni",
        "email": "pradeep@addnum.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ECE",
            "aboutme": "Thanks",
            "education": "No input provided",
            "currentrole": "Solution Manager at Nokia",
            "experience": "Solution Manager at Nokia",
            "contactinfo": "9910852299",
            "resume": "empty"
        }
    },
    {
        "personname": "Sushant Gupta",
        "userid": "99CSE153",
        "usertype": "alumni",
        "email": "gupt.sushant@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Sr. Staff Engr. at A10 Networks",
            "experience": "Sr. Staff Engr. at A10 Networks",
            "contactinfo": "9663367040",
            "resume": "empty"
        }
    },
    {
        "personname": "Pradip Singh",
        "userid": "99ME139",
        "usertype": "alumni",
        "email": "psingh_iitb@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Chief Engineering & Maintenance at Golcha Group",
            "experience": "Chief Engineering & Maintenance at Golcha Group",
            "contactinfo": "7389938609",
            "resume": "empty"
        }
    },
    {
        "personname": "Awadh Bajpai",
        "userid": "99CSE154",
        "usertype": "alumni",
        "email": "awadhbajpai81@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "System Architect at Netinsight AB, Sweden",
            "experience": "System Architect at Netinsight AB, Sweden",
            "contactinfo": "+46-765350659",
            "resume": "empty"
        }
    },
    {
        "personname": "Hemant",
        "userid": "99ECE107",
        "usertype": "alumni",
        "email": "hemantsoni8@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Lt col at Indian Army",
            "experience": "Lt col at Indian Army",
            "contactinfo": "7738873584",
            "resume": "empty"
        }
    },
    {
        "personname": "Mayank goyal",
        "userid": "00ME140",
        "usertype": "alumni",
        "email": "myservicepoint@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Owner at My service point",
            "experience": "Owner at My service point",
            "contactinfo": "9897877984",
            "resume": "empty"
        }
    },
    {
        "personname": "Vikalp Sharma",
        "userid": "03CE35",
        "usertype": "alumni",
        "email": "sharma.vikalp@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "CE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Manager at HCL Technologies",
            "experience": "Manager at HCL Technologies",
            "contactinfo": "9811677946",
            "resume": "empty"
        }
    },
    {
        "personname": "Akhilesh Yadav",
        "userid": "99ME141",
        "usertype": "alumni",
        "email": "akhilesh_9a@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Staff Engineer at Stryker Global Technology Centre",
            "experience": "Staff Engineer at Stryker Global Technology Centre",
            "contactinfo": "9818624847",
            "resume": "empty"
        }
    },
    {
        "personname": "Nitin Malhotra",
        "userid": "99CSE155",
        "usertype": "alumni",
        "email": "malhotra.nishu@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "0439478209",
            "resume": "empty"
        }
    },
    {
        "personname": "Nitin Malhotra",
        "userid": "99CSE156",
        "usertype": "alumni",
        "email": "malhotra.nishu@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "0439478209",
            "resume": "empty"
        }
    },
    {
        "personname": "vijay dixit",
        "userid": "99ME142",
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
        }
    },
    {
        "personname": "Deepak Kumar",
        "userid": "99ECE108",
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
        }
    },
    {
        "personname": "Ratika Sharma",
        "userid": "06CSE157",
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
        }
    },
    {
        "personname": "Animesh Rai",
        "userid": "06CSE158",
        "usertype": "alumni",
        "email": "animesh_rai3@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Assistant Professor at AKGEC GZB",
            "experience": "Assistant Professor at AKGEC GZB",
            "contactinfo": "8750903063",
            "resume": "empty"
        }
    },
    {
        "personname": "Ashutosh",
        "userid": "02ME143",
        "usertype": "alumni",
        "email": "dreamrider03@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Assistant professor at Sanskriti University",
            "experience": "Assistant professor at Sanskriti University",
            "contactinfo": "9548712957",
            "resume": "empty"
        }
    },
    {
        "personname": "Uma singh",
        "userid": "08CSE159",
        "usertype": "alumni",
        "email": "umasingh27@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "9889947572",
            "resume": "empty"
        }
    },
    {
        "personname": "Ram kumar",
        "userid": "98CSE160",
        "usertype": "alumni",
        "email": "ram.be.cs@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "BBM at HDFC Bank",
            "experience": "BBM at HDFC Bank",
            "contactinfo": "9412173948",
            "resume": "empty"
        }
    },
    {
        "personname": "Prem Bharti",
        "userid": "06CSE161",
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
        }
    },
    {
        "personname": "gaurav singh",
        "userid": "99CSE162",
        "usertype": "alumni",
        "email": "gasingh@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Senior Program Manager at BICS",
            "experience": "Senior Program Manager at BICS",
            "contactinfo": "+32473654913",
            "resume": "empty"
        }
    },
    {
        "personname": "ABHISHEK PARIHAR",
        "userid": "98CSE163",
        "usertype": "alumni",
        "email": "abhi15a@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Manager at ONGC",
            "experience": "Manager at ONGC",
            "contactinfo": "9968282612",
            "resume": "empty"
        }
    },
    {
        "personname": "Shishupal Singh",
        "userid": "98ECE109",
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
        }
    },
    {
        "personname": "Pawan Kumar",
        "userid": "98ME144",
        "usertype": "alumni",
        "email": "pawankumar1agra@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Design engineer at Jacobs engineering India Pvt Ltd",
            "experience": "Design engineer at Jacobs engineering India Pvt Ltd",
            "contactinfo": "9811592041",
            "resume": "empty"
        }
    },
    {
        "personname": "Abhishek Kumar",
        "userid": "00ECE110",
        "usertype": "alumni",
        "email": "kumar.abhi@hotmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "ECE",
            "aboutme": "Good initiative.",
            "education": "No input provided",
            "currentrole": "Consultant at SAP India",
            "experience": "Consultant at SAP India",
            "contactinfo": "9999111615",
            "resume": "empty"
        }
    },
    {
        "personname": "Umakant Pandey",
        "userid": "06CSE164",
        "usertype": "alumni",
        "email": "umakant1901@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "System Engineer at Net Access India Ltd",
            "experience": "System Engineer at Net Access India Ltd",
            "contactinfo": "8527801068",
            "resume": "empty"
        }
    },
    {
        "personname": "SUNIL KUMAR",
        "userid": "03ME145",
        "usertype": "alumni",
        "email": "sunilbarc@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working at BARC",
            "experience": "Working at BARC",
            "contactinfo": "9894978290",
            "resume": "empty"
        }
    },
    {
        "personname": "Rahul pratap singh",
        "userid": "11CSE165",
        "usertype": "alumni",
        "email": "rahulpratapsingh2793@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working at Revenue department",
            "experience": "Working at Revenue department",
            "contactinfo": "7618160145",
            "resume": "empty"
        }
    },
    {
        "personname": "Kuhu shishodia",
        "userid": "08CSE166",
        "usertype": "alumni",
        "email": "kuhushishodia89@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Sr. Analyst at HCL Technologies",
            "experience": "Sr. Analyst at HCL Technologies",
            "contactinfo": "9958434535",
            "resume": "empty"
        }
    },
    {
        "personname": "Shivendra Prakash",
        "userid": "06CE36",
        "usertype": "alumni",
        "email": "shivendra.prakash143@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Asst Engineer at Uttarakhand pwd",
            "experience": "Asst Engineer at Uttarakhand pwd",
            "contactinfo": "9458175894",
            "resume": "empty"
        }
    },
    {
        "personname": "Dhrati Sharma",
        "userid": "08CSE167",
        "usertype": "alumni",
        "email": "dsharma10d@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Software engineer at Adobe",
            "experience": "Software engineer at Adobe",
            "contactinfo": "9632566933",
            "resume": "empty"
        }
    },
    {
        "personname": "Pushpendra kumar",
        "userid": "07CE37",
        "usertype": "alumni",
        "email": "pushpendra.ceiet@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "AHE at SAI consulting",
            "experience": "AHE at SAI consulting",
            "contactinfo": "9882876818",
            "resume": "empty"
        }
    },
    {
        "personname": "Ankit Srivastava",
        "userid": "08ECE111",
        "usertype": "alumni",
        "email": "ank.sri2009@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Director at Swargiya Ram Samujh Uma Jyoti Dharmarth Hospital, Bon Voyage tours & travels",
            "experience": "Director at Swargiya Ram Samujh Uma Jyoti Dharmarth Hospital, Bon Voyage tours & travels",
            "contactinfo": "8447102946",
            "resume": "empty"
        }
    },
    {
        "personname": "Preeti kushwah",
        "userid": "08CSE168",
        "usertype": "alumni",
        "email": "jiya.pritee@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "8450995136",
            "resume": "empty"
        }
    },
    {
        "personname": "Yogesh kumar",
        "userid": "07ECE112",
        "usertype": "alumni",
        "email": "yogesh.tech83@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Engineer at IGL",
            "experience": "Engineer at IGL",
            "contactinfo": "9990571795",
            "resume": "empty"
        }
    },
    {
        "personname": "BRIJ KISHOR MORYA",
        "userid": "05CE38",
        "usertype": "alumni",
        "email": "brijmorya786@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2005",
            "branch": "CE",
            "aboutme": "N. A",
            "education": "No input provided",
            "currentrole": "Junior Engineer at Mcd delhi",
            "experience": "Junior Engineer at Mcd delhi",
            "contactinfo": "8800717410",
            "resume": "empty"
        }
    },
    {
        "personname": "Renukesh verma",
        "userid": "07CSE169",
        "usertype": "alumni",
        "email": "renukeshv@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "CEO at Blessio",
            "experience": "CEO at Blessio",
            "contactinfo": "9582174678",
            "resume": "empty"
        }
    },
    {
        "personname": "Pratyush Sinha",
        "userid": "07CSE170",
        "usertype": "alumni",
        "email": "pratyush_cooldude@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "RA at DBT",
            "experience": "RA at DBT",
            "contactinfo": "9650940627",
            "resume": "empty"
        }
    },
    {
        "personname": "Vivek chadha",
        "userid": "98ME146",
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
        }
    },
    {
        "personname": "Jyotsna Jha",
        "userid": "07CSE171",
        "usertype": "alumni",
        "email": "jyotsna.iet@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Doing Higher Education",
            "experience": "Doing Higher Education",
            "contactinfo": "7892669256",
            "resume": "empty"
        }
    },
    {
        "personname": "Bhoopendra Kumar",
        "userid": "08ECE113",
        "usertype": "alumni",
        "email": "bkvermaiet@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "IOS Developer at it",
            "experience": "IOS Developer at it",
            "contactinfo": "9205726030",
            "resume": "empty"
        }
    },
    {
        "personname": "Soumya Sheel",
        "userid": "06ECE114",
        "usertype": "alumni",
        "email": "iet.sheel@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Senior Associate at Moody\u2019s Analytics",
            "experience": "Senior Associate at Moody\u2019s Analytics",
            "contactinfo": "9450711874",
            "resume": "empty"
        }
    },
    {
        "personname": "Nitin Srivastava",
        "userid": "98ME147",
        "usertype": "alumni",
        "email": "nitin.srivastava06@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Project Manager at Sconce Solutions",
            "experience": "Project Manager at Sconce Solutions",
            "contactinfo": "7262002204",
            "resume": "empty"
        }
    },
    {
        "personname": "Pravesh Shrivastava",
        "userid": "07ECE115",
        "usertype": "alumni",
        "email": "prv.shri@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "ECE",
            "aboutme": "Working in Noida Location, Headquarter in California USA.",
            "education": "No input provided",
            "currentrole": "Team Leader at BT-Data & Surveying Services India Pvt Ltd",
            "experience": "Team Leader at BT-Data & Surveying Services India Pvt Ltd",
            "contactinfo": "9910688794",
            "resume": "empty"
        }
    },
    {
        "personname": "Satyendra Kumar Pandey",
        "userid": "07ECE116",
        "usertype": "alumni",
        "email": "satyendra.pandey.iet49@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "R&D engineering. at Led lights",
            "experience": "R&D engineering. at Led lights",
            "contactinfo": "7503344490",
            "resume": "empty"
        }
    },
    {
        "personname": "Vishal kumar",
        "userid": "06CSE172",
        "usertype": "alumni",
        "email": "mr.vishalpratapsingh@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CSE",
            "aboutme": "Waiting eagerly for the day",
            "education": "No input provided",
            "currentrole": "Rm at Vodafone",
            "experience": "Rm at Vodafone",
            "contactinfo": "9709018570",
            "resume": "empty"
        }
    },
    {
        "personname": "Manish Katara",
        "userid": "98ME148",
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
            "currentrole": "Working at Govt",
            "experience": "Working at Govt",
            "contactinfo": "7073884434",
            "resume": "empty"
        }
    },
    {
        "personname": "Sonika Dheer",
        "userid": "99ECE117",
        "usertype": "alumni",
        "email": "sonika.dheer@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Assistant Vice President at US Bancorp",
            "experience": "Assistant Vice President at US Bancorp",
            "contactinfo": "+19523806345",
            "resume": "empty"
        }
    },
    {
        "personname": "ashish kumar",
        "userid": "07CE39",
        "usertype": "alumni",
        "email": "ak791268@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CE",
            "aboutme": "No",
            "education": "No input provided",
            "currentrole": "no at self",
            "experience": "no at self",
            "contactinfo": "9457954291",
            "resume": "empty"
        }
    },
    {
        "personname": "Shruti Srivastava",
        "userid": "09CSE173",
        "usertype": "alumni",
        "email": "shruti_srivastava91@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2009",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Software engineer at Net world point it solution",
            "experience": "Software engineer at Net world point it solution",
            "contactinfo": "8920840539",
            "resume": "empty"
        }
    },
    {
        "personname": "MAYANK GOVIL",
        "userid": "07CSE174",
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
        }
    },
    {
        "personname": "Mayank",
        "userid": "08ME149",
        "usertype": "alumni",
        "email": "er.mayank_2012@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Site Engineer at KEI industries",
            "experience": "Site Engineer at KEI industries",
            "contactinfo": "7830804494",
            "resume": "empty"
        }
    },
    {
        "personname": "Anil Singh",
        "userid": "01ECE118",
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
        }
    },
    {
        "personname": "kaushal dev singh",
        "userid": "02CSE175",
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
            "currentrole": "Self Startup",
            "experience": "Self Startup",
            "contactinfo": "9634126661",
            "resume": "empty"
        }
    },
    {
        "personname": "Praveen yadav",
        "userid": "05CE40",
        "usertype": "alumni",
        "email": "veeryadav05@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2005",
            "branch": "CE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Self Startup",
            "experience": "Self Startup",
            "contactinfo": "09412861828",
            "resume": "empty"
        }
    },
    {
        "personname": "Narendra Singh",
        "userid": "01ME150",
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
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "9897565520",
            "resume": "empty"
        }
    },
    {
        "personname": "Ronit roy",
        "userid": "08ECE119",
        "usertype": "alumni",
        "email": "ronitroy539@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "ECE",
            "aboutme": "Jain temple",
            "education": "No input provided",
            "currentrole": "Self Startup at M/s lataenterprises",
            "experience": "Self Startup at M/s lataenterprises",
            "contactinfo": "9639702894",
            "resume": "empty"
        }
    },
    {
        "personname": "Vijay kumar",
        "userid": "01ECE120",
        "usertype": "alumni",
        "email": "vijaykimar2113@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2001",
            "branch": "ECE",
            "aboutme": "I am pleased to be part of IET Agra family",
            "education": "No input provided",
            "currentrole": "Manager at Vodafone",
            "experience": "Manager at Vodafone",
            "contactinfo": "9839315916",
            "resume": "empty"
        }
    },
    {
        "personname": "Atul kumar upadhyay",
        "userid": "01ECE121",
        "usertype": "alumni",
        "email": "atulford@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2001",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Dy Manager at HFCL",
            "experience": "Dy Manager at HFCL",
            "contactinfo": "8860956946",
            "resume": "empty"
        }
    },
    {
        "personname": "Ashutosh Kumar Chand",
        "userid": "02ECE122",
        "usertype": "alumni",
        "email": "ashutosh_02ec13@yahoo.co.in",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Territory Manager at Parker Hannifin India Pvt. Ltd.",
            "experience": "Territory Manager at Parker Hannifin India Pvt. Ltd.",
            "contactinfo": "9811356698",
            "resume": "empty"
        }
    },
    {
        "personname": "pradeep verma",
        "userid": "01ME151",
        "usertype": "alumni",
        "email": "pradeep4usa@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2001",
            "branch": "ME",
            "aboutme": "Me cool",
            "education": "No input provided",
            "currentrole": "noida at verma construction co.",
            "experience": "noida at verma construction co.",
            "contactinfo": "9871226814",
            "resume": "empty"
        }
    },
    {
        "personname": "Narendra Gautam",
        "userid": "98ME152",
        "usertype": "alumni",
        "email": "narendra.kumar@hindware.in",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "QA Head at Hindware",
            "experience": "QA Head at Hindware",
            "contactinfo": "7665003180",
            "resume": "empty"
        }
    },
    {
        "personname": "Lokendra singh",
        "userid": "04CSE176",
        "usertype": "alumni",
        "email": "lokendra11@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Analysr at Fiserv",
            "experience": "Analysr at Fiserv",
            "contactinfo": "9711956548",
            "resume": "empty"
        }
    },
    {
        "personname": "Rekha Baghel",
        "userid": "04CSE177",
        "usertype": "alumni",
        "email": "rekha_cs46@rediffmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Assistant professor at Galgotias college of engineering and technology",
            "experience": "Assistant professor at Galgotias college of engineering and technology",
            "contactinfo": "8447996440",
            "resume": "empty"
        }
    },
    {
        "personname": "Somesh Shandilya",
        "userid": "04CSE178",
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
        }
    },
    {
        "personname": "ashutosh pradeep",
        "userid": "09ME153",
        "usertype": "alumni",
        "email": "ashusmarty786@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2009",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "PO at RRB",
            "experience": "PO at RRB",
            "contactinfo": "9997517795",
            "resume": "empty"
        }
    },
    {
        "personname": "Sanjeev Kumar",
        "userid": "01ECE123",
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
        }
    },
    {
        "personname": "Arpit Mathur",
        "userid": "07CE41",
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
        }
    },
    {
        "personname": "Arpit Mathur",
        "userid": "07CE42",
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
        }
    },
    {
        "personname": "Nirbhay Srivastava",
        "userid": "00ME154",
        "usertype": "alumni",
        "email": "nirbhaysri@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Head-Std & Quality Assurance at Capital Goods Skill Council",
            "experience": "Head-Std & Quality Assurance at Capital Goods Skill Council",
            "contactinfo": "8130439888",
            "resume": "empty"
        }
    },
    {
        "personname": "Nirbhay Srivastava",
        "userid": "00ME155",
        "usertype": "alumni",
        "email": "nirbhaysri@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Head-Std & Quality Assurance at Capital Goods Skill Council",
            "experience": "Head-Std & Quality Assurance at Capital Goods Skill Council",
            "contactinfo": "8130439888",
            "resume": "empty"
        }
    },
    {
        "personname": "Nirbhay Srivastava",
        "userid": "00ME156",
        "usertype": "alumni",
        "email": "nirbhaysri@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Head-Std & Quality Assurance at Capital Goods Skill Council",
            "experience": "Head-Std & Quality Assurance at Capital Goods Skill Council",
            "contactinfo": "8130439888",
            "resume": "empty"
        }
    },
    {
        "personname": "Lehquish",
        "userid": "02ECE124",
        "usertype": "alumni",
        "email": "lehquish@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "9818089898",
            "resume": "empty"
        }
    },
    {
        "personname": "Lehquish",
        "userid": "02ECE125",
        "usertype": "alumni",
        "email": "lehquish@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "9818089898",
            "resume": "empty"
        }
    },
    {
        "personname": "sonika rawat",
        "userid": "09CSE179",
        "usertype": "alumni",
        "email": "swtsonisam@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2009",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "9654648994",
            "resume": "empty"
        }
    },
    {
        "personname": "Kapil gupta",
        "userid": "98ME157",
        "usertype": "alumni",
        "email": "kapilgupta4all@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Inspector at Income tax department",
            "experience": "Inspector at Income tax department",
            "contactinfo": "9969298504",
            "resume": "empty"
        }
    },
    {
        "personname": "anju rani",
        "userid": "04IT15",
        "usertype": "alumni",
        "email": "anju14sharma@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "IT",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "9953384328",
            "resume": "empty"
        }
    },
    {
        "personname": "Manendra Sikarwar",
        "userid": "00ECE126",
        "usertype": "alumni",
        "email": "Manojsikarwar2@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Branch Manager at Fowler Westrup India pvt Ltd",
            "experience": "Branch Manager at Fowler Westrup India pvt Ltd",
            "contactinfo": "8954033033",
            "resume": "empty"
        }
    },
    {
        "personname": "Mohit Khandelwal",
        "userid": "04ECE127",
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
        }
    },
    {
        "personname": "Nagendra Pal Singh",
        "userid": "99CSE180",
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
        }
    },
    {
        "personname": "Abhijit Banerjee",
        "userid": "00ECE128",
        "usertype": "alumni",
        "email": "abhijit-banerjee@hotmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "ECE",
            "aboutme": "Nice to connect with college",
            "education": "No input provided",
            "currentrole": "Project Manager at L&T Technology Services",
            "experience": "Project Manager at L&T Technology Services",
            "contactinfo": "7490026978",
            "resume": "empty"
        }
    },
    {
        "personname": "Pawan Yadav",
        "userid": "00ME158",
        "usertype": "alumni",
        "email": "pawangenetco@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "ME",
            "aboutme": "Good to hear !!",
            "education": "No input provided",
            "currentrole": "Sr. Managar - Sales & Operations at Genetco. LLC. Muscat Oman",
            "experience": "Sr. Managar - Sales & Operations at Genetco. LLC. Muscat Oman",
            "contactinfo": "+96897658757",
            "resume": "empty"
        }
    },
    {
        "personname": "Pravindra Singh",
        "userid": "99ME159",
        "usertype": "alumni",
        "email": "pamuchaudhry@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ME",
            "aboutme": "No.",
            "education": "No input provided",
            "currentrole": "Project Manager at ACIL",
            "experience": "Project Manager at ACIL",
            "contactinfo": "9540686924",
            "resume": "empty"
        }
    },
    {
        "personname": "Pravindra Singh",
        "userid": "99ME160",
        "usertype": "alumni",
        "email": "pamuchaudhry@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ME",
            "aboutme": "No.",
            "education": "No input provided",
            "currentrole": "Project Manager at ACIL",
            "experience": "Project Manager at ACIL",
            "contactinfo": "9540686924",
            "resume": "empty"
        }
    },
    {
        "personname": "Alok rajan rai",
        "userid": "06CSE181",
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
        }
    },
    {
        "personname": "DHARAMVIR singh",
        "userid": "07ME161",
        "usertype": "alumni",
        "email": "dsyadav485@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "ME",
            "aboutme": "Work is worship",
            "education": "No input provided",
            "currentrole": "Self employ",
            "experience": "Self employ",
            "contactinfo": "9540909154",
            "resume": "empty"
        }
    },
    {
        "personname": "Tarun kumar",
        "userid": "07ME162",
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
        }
    },
    {
        "personname": "Saif khan",
        "userid": "12ECE129",
        "usertype": "alumni",
        "email": "saif30iet@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Software Engineer at Aricent",
            "experience": "Software Engineer at Aricent",
            "contactinfo": "9738475399",
            "resume": "empty"
        }
    },
    {
        "personname": "CHANDRA PRAKASH",
        "userid": "06CSE182",
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
        }
    },
    {
        "personname": "Yatin Tigdania",
        "userid": "05CSE183",
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
        }
    },
    {
        "personname": "Manish Kumar",
        "userid": "06CSE184",
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
        }
    },
    {
        "personname": "Manish Kumar",
        "userid": "06CSE185",
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
        }
    },
    {
        "personname": "Vikash Kumar",
        "userid": "06IT16",
        "usertype": "alumni",
        "email": "vikashkrthakur@yahoo.co.in",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "IT",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Project Asst -III, Software Engineer at CSIR CRRI",
            "experience": "Project Asst -III, Software Engineer at CSIR CRRI",
            "contactinfo": "8750991020",
            "resume": "empty"
        }
    },
    {
        "personname": "Mayank saraswat",
        "userid": "07ME163",
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
        }
    },
    {
        "personname": "Madhupriya",
        "userid": "06CSE186",
        "usertype": "alumni",
        "email": "madhupriya360@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "8192097730",
            "resume": "empty"
        }
    },
    {
        "personname": "Alok Singh Rajput",
        "userid": "06CSE187",
        "usertype": "alumni",
        "email": "alokoracle007@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CSE",
            "aboutme": "G8",
            "education": "No input provided",
            "currentrole": "Sr. Executive at Bharti Airtel",
            "experience": "Sr. Executive at Bharti Airtel",
            "contactinfo": "7042891503",
            "resume": "empty"
        }
    },
    {
        "personname": "Kumari Sarita",
        "userid": "06ME164",
        "usertype": "alumni",
        "email": "saritaei.kumari4@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "ME",
            "aboutme": "NA",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "9911837110",
            "resume": "empty"
        }
    },
    {
        "personname": "Hemant Kumar",
        "userid": "06CSE188",
        "usertype": "alumni",
        "email": "er.hemantkumaragr@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Officer at PNB",
            "experience": "Officer at PNB",
            "contactinfo": "9412800116",
            "resume": "empty"
        }
    },
    {
        "personname": "Abhishek Dubey",
        "userid": "06IT17",
        "usertype": "alumni",
        "email": "abhishekdubeyit@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "IT",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "HOD (Computer Science) at BPS Public School, Vidya Vihar, Etah",
            "experience": "HOD (Computer Science) at BPS Public School, Vidya Vihar, Etah",
            "contactinfo": "9358533665",
            "resume": "empty"
        }
    },
    {
        "personname": "nikhil kumar gupta",
        "userid": "06CSE189",
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
        }
    },
    {
        "personname": "Kumari Sarita",
        "userid": "06ME165",
        "usertype": "alumni",
        "email": "saritaei.kumari4@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "ME",
            "aboutme": "NA",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "9911837110",
            "resume": "empty"
        }
    },
    {
        "personname": "Kumari Sarita",
        "userid": "06ME166",
        "usertype": "alumni",
        "email": "saritaei.kumari4@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "ME",
            "aboutme": "NA",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "9911837110",
            "resume": "empty"
        }
    },
    {
        "personname": "Bhoopendra singh",
        "userid": "12ECE130",
        "usertype": "alumni",
        "email": "bhanukus444@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Associate Engineer at Velocis system pvt. Ltd.",
            "experience": "Associate Engineer at Velocis system pvt. Ltd.",
            "contactinfo": "8708367629",
            "resume": "empty"
        }
    },
    {
        "personname": "Ruchi Radha",
        "userid": "04IT18",
        "usertype": "alumni",
        "email": "ruchi.radha2012@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "IT",
            "aboutme": "It is a very good initiative. Please release data for till now how many alumni have registered as it will give thrust for good participation of alumni.",
            "education": "No input provided",
            "currentrole": "Sr. Manager-IT at Punjab National Bank",
            "experience": "Sr. Manager-IT at Punjab National Bank",
            "contactinfo": "9718651129",
            "resume": "empty"
        }
    },
    {
        "personname": "Adarsh Saini",
        "userid": "99ME167",
        "usertype": "alumni",
        "email": "adarsh.saini32@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "8218121271",
            "resume": "empty"
        }
    },
    {
        "personname": "Rahul Srivastava",
        "userid": "04ECE131",
        "usertype": "alumni",
        "email": "rahulsrivastav431984@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Assistant Manager at NTL ELECTRONICS INDIA LTD.",
            "experience": "Assistant Manager at NTL ELECTRONICS INDIA LTD.",
            "contactinfo": "9719582598",
            "resume": "empty"
        }
    },
    {
        "personname": "Ankit Kumar yadav",
        "userid": "03ECE132",
        "usertype": "alumni",
        "email": "ankity15@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Network planning and optimisation engine. at Nokia Networks",
            "experience": "Network planning and optimisation engine. at Nokia Networks",
            "contactinfo": "8939672851",
            "resume": "empty"
        }
    },
    {
        "personname": "Ankur Saxena",
        "userid": "00ECE133",
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
        }
    },
    {
        "personname": "Pankaj",
        "userid": "98CSE190",
        "usertype": "alumni",
        "email": "pankajkumar1009@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Engineer at Job",
            "experience": "Engineer at Job",
            "contactinfo": "9962518622",
            "resume": "empty"
        }
    },
    {
        "personname": "Pankaj",
        "userid": "00CSE191",
        "usertype": "alumni",
        "email": "pankajkumar1009@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Engineer at Job",
            "experience": "Engineer at Job",
            "contactinfo": "9962518622",
            "resume": "empty"
        }
    },
    {
        "personname": "Pankaj",
        "userid": "98CSE192",
        "usertype": "alumni",
        "email": "pankajkumar1009@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Engineer at Job",
            "experience": "Engineer at Job",
            "contactinfo": "9962518622",
            "resume": "empty"
        }
    },
    {
        "personname": "Pankaj",
        "userid": "98CSE193",
        "usertype": "alumni",
        "email": "pankajkumar1009@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Engineer at Job",
            "experience": "Engineer at Job",
            "contactinfo": "9962518622",
            "resume": "empty"
        }
    },
    {
        "personname": "VIVEK SINGH",
        "userid": "06ECE134",
        "usertype": "alumni",
        "email": "etah1988@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Doing Higher Education",
            "experience": "Doing Higher Education",
            "contactinfo": "9412426933",
            "resume": "empty"
        }
    },
    {
        "personname": "Jitin Kumar Tiwari",
        "userid": "04ME168",
        "usertype": "alumni",
        "email": "jitinkumartiwari@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Associate Vice President at Moody\u2019s Analytics",
            "experience": "Associate Vice President at Moody\u2019s Analytics",
            "contactinfo": "9718069339",
            "resume": "empty"
        }
    },
    {
        "personname": "Narendra Singh",
        "userid": "06CSE194",
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
        }
    },
    {
        "personname": "Anil prakash bhatt",
        "userid": "98CSE195",
        "usertype": "alumni",
        "email": "anil07me04@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Sr. Quality Engineer at Hegde precision products Pvt LTD",
            "experience": "Sr. Quality Engineer at Hegde precision products Pvt LTD",
            "contactinfo": "9897615961",
            "resume": "empty"
        }
    },
    {
        "personname": "JASWANT SINGH",
        "userid": "07ME169",
        "usertype": "alumni",
        "email": "jaswantsingh6546@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Doing Higher Education",
            "experience": "Doing Higher Education",
            "contactinfo": "7017365995",
            "resume": "empty"
        }
    },
    {
        "personname": "vipulchakravarty",
        "userid": "99ME170",
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
        }
    },
    {
        "personname": "Devendra Sachdeva",
        "userid": "00ECE135",
        "usertype": "alumni",
        "email": "devsachdeva@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Sr. Project Manager at Sumtotal Systems",
            "experience": "Sr. Project Manager at Sumtotal Systems",
            "contactinfo": "9100065596",
            "resume": "empty"
        }
    },
    {
        "personname": "Sumit gangwar",
        "userid": "09CSE196",
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
            "currentrole": "Sr.managar at Pacific green infraheight pvt ltf",
            "experience": "Sr.managar at Pacific green infraheight pvt ltf",
            "contactinfo": "8171771556",
            "resume": "empty"
        }
    },
    {
        "personname": "Dev Pal",
        "userid": "07ME171",
        "usertype": "alumni",
        "email": "dev.7075@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "ME",
            "aboutme": "Alumni Registration",
            "education": "No input provided",
            "currentrole": "ALP at INDIAN RAILWAY",
            "experience": "ALP at INDIAN RAILWAY",
            "contactinfo": "+918909310310",
            "resume": "empty"
        }
    },
    {
        "personname": "Dev Pal",
        "userid": "07ME172",
        "usertype": "alumni",
        "email": "dev.7075@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "ME",
            "aboutme": "Alumni Registration",
            "education": "No input provided",
            "currentrole": "ALP at INDIAN RAILWAY",
            "experience": "ALP at INDIAN RAILWAY",
            "contactinfo": "+918909310310",
            "resume": "empty"
        }
    },
    {
        "personname": "ABHINIT KUMAR SINGH",
        "userid": "07CSE197",
        "usertype": "alumni",
        "email": "abhinit.singh001@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CSE",
            "aboutme": "WHAT IS THE DATE OF ALUMNI...?",
            "education": "No input provided",
            "currentrole": "ASSISTANT QUALITY MANAGER at SUPA STAR FOODS PVT. LTD., UDHYOG VIHAR PHASE 4, GURGAON",
            "experience": "ASSISTANT QUALITY MANAGER at SUPA STAR FOODS PVT. LTD., UDHYOG VIHAR PHASE 4, GURGAON",
            "contactinfo": "+919818137509",
            "resume": "empty"
        }
    },
    {
        "personname": "Shiv Shankar Gupta",
        "userid": "98CSE198",
        "usertype": "alumni",
        "email": "gupta.sshiv@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Engineering Manager at Intel",
            "experience": "Engineering Manager at Intel",
            "contactinfo": "9342539451",
            "resume": "empty"
        }
    },
    {
        "personname": "Sachin Dev",
        "userid": "07ME173",
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
        }
    },
    {
        "personname": "JAMALUDDIN",
        "userid": "98CSE199",
        "usertype": "alumni",
        "email": "jamalbasti@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Doing Higher Education",
            "experience": "Doing Higher Education",
            "contactinfo": "9565670832",
            "resume": "empty"
        }
    },
    {
        "personname": "Gaurav Kumar Singh",
        "userid": "01ECE136",
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
        }
    },
    {
        "personname": "Manish Kumar Sharma",
        "userid": "04ME174",
        "usertype": "alumni",
        "email": "manishokar@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Senior Manager at Elite It Service India Pvt. Ltd",
            "experience": "Senior Manager at Elite It Service India Pvt. Ltd",
            "contactinfo": "9990243350",
            "resume": "empty"
        }
    },
    {
        "personname": "SHARDHA NAND SINGH",
        "userid": "04ME175",
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
        }
    },
    {
        "personname": "AKHIL KUMAR SINGH",
        "userid": "10ME176",
        "usertype": "alumni",
        "email": "akhilkumar.singh9@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2010",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "QA at Vamani overseas pvt ltd. Prithla, palbal",
            "experience": "QA at Vamani overseas pvt ltd. Prithla, palbal",
            "contactinfo": "9808906438",
            "resume": "empty"
        }
    },
    {
        "personname": "Pushpendra Kumar",
        "userid": "04ME177",
        "usertype": "alumni",
        "email": "pushpendra1986@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Scientific Officer at Nuclear power corporation of India limited",
            "experience": "Scientific Officer at Nuclear power corporation of India limited",
            "contactinfo": "9413358109",
            "resume": "empty"
        }
    },
    {
        "personname": "Kumar Vaibhav",
        "userid": "01ECE137",
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
        }
    },
    {
        "personname": "Mohit Kumar",
        "userid": "01ECE138",
        "usertype": "alumni",
        "email": "mohit.dt@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2001",
            "branch": "ECE",
            "aboutme": "01EC35",
            "education": "No input provided",
            "currentrole": "Dy. Manager at Reliance JIO",
            "experience": "Dy. Manager at Reliance JIO",
            "contactinfo": "7009226256",
            "resume": "empty"
        }
    },
    {
        "personname": "Saurabh Jindal",
        "userid": "04CE43",
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
        }
    },
    {
        "personname": "ASHISH KUMAR",
        "userid": "06ECE139",
        "usertype": "alumni",
        "email": "ashishec13@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "ECE",
            "aboutme": "I AM VERY HAPPY AFTER 7 YEAR  BECAUSE I WILL MEET TO MY ALL COLLEAGUES AND FACULTY MEMBERS.",
            "education": "No input provided",
            "currentrole": "R & D ENGINEER at POWERTAC",
            "experience": "R & D ENGINEER at POWERTAC",
            "contactinfo": "9457776662",
            "resume": "empty"
        }
    },
    {
        "personname": "Bhoopendra",
        "userid": "04ME178",
        "usertype": "alumni",
        "email": "shakyabhoopendra@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Quality Engineer at Tuv sud south asia pvt. Ltd.",
            "experience": "Quality Engineer at Tuv sud south asia pvt. Ltd.",
            "contactinfo": "9760204839",
            "resume": "empty"
        }
    },
    {
        "personname": "Bhoopendra",
        "userid": "04ME179",
        "usertype": "alumni",
        "email": "shakyabhoopendra@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Quality Engineer at Tuv sud south asia pvt. Ltd.",
            "experience": "Quality Engineer at Tuv sud south asia pvt. Ltd.",
            "contactinfo": "9760204839",
            "resume": "empty"
        }
    },
    {
        "personname": "AMIT KUMAR SHARMA",
        "userid": "98ME180",
        "usertype": "alumni",
        "email": "amit_k_sharma@whirlpool.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Senior Manager at Whirlpool of India Ltd",
            "experience": "Senior Manager at Whirlpool of India Ltd",
            "contactinfo": "9850634723",
            "resume": "empty"
        }
    },
    {
        "personname": "Pankaj verma",
        "userid": "01ME181",
        "usertype": "alumni",
        "email": "pankajverma0501@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2001",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "assistant professor at B.b.d.n.i.t.m,lucknow",
            "experience": "assistant professor at B.b.d.n.i.t.m,lucknow",
            "contactinfo": "8400028848",
            "resume": "empty"
        }
    },
    {
        "personname": "Sushil Saraswat",
        "userid": "06ECE140",
        "usertype": "alumni",
        "email": "saraswat007ss@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Communication Technician at Indian Air Force",
            "experience": "Communication Technician at Indian Air Force",
            "contactinfo": "7014320596",
            "resume": "empty"
        }
    },
    {
        "personname": "Krishna pachauri",
        "userid": "08ME182",
        "usertype": "alumni",
        "email": "Krishnapachauriiet@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "ME",
            "aboutme": "I am research and development engineer in clutch company",
            "education": "No input provided",
            "currentrole": "Research and development engineer at Kie engineering pvt ltd",
            "experience": "Research and development engineer at Kie engineering pvt ltd",
            "contactinfo": "8881594888",
            "resume": "empty"
        }
    },
    {
        "personname": "Vishnu Vaid",
        "userid": "06CSE200",
        "usertype": "alumni",
        "email": "ibsvishnu@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "9711730629",
            "resume": "empty"
        }
    },
    {
        "personname": "KULDEEP YADAV",
        "userid": "12ECE141",
        "usertype": "alumni",
        "email": "akstheme@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "M.Tech Scholar at The LNMIIT ,Jaipur Rajsthan",
            "experience": "M.Tech Scholar at The LNMIIT ,Jaipur Rajsthan",
            "contactinfo": "9460522004",
            "resume": "empty"
        }
    },
    {
        "personname": "MANOJ YADAV",
        "userid": "11ME183",
        "usertype": "alumni",
        "email": "manojyadav00728@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Mechanical engineer at M/s Balaji cement industries pvt ltd nepal",
            "experience": "Mechanical engineer at M/s Balaji cement industries pvt ltd nepal",
            "contactinfo": "7895476456",
            "resume": "empty"
        }
    },
    {
        "personname": "mohit dixit",
        "userid": "14ME184",
        "usertype": "alumni",
        "email": "dixitm2022@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2014",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Doing Higher Education",
            "experience": "Doing Higher Education",
            "contactinfo": "9760604403",
            "resume": "empty"
        }
    },
    {
        "personname": "Vivek Kumar Sharma",
        "userid": "98CSE201",
        "usertype": "alumni",
        "email": "viveklibran@hotmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working at Fujitsu Consulting",
            "experience": "Working at Fujitsu Consulting",
            "contactinfo": "9711809733",
            "resume": "empty"
        }
    },
    {
        "personname": "Mohd Arif",
        "userid": "09CSE202",
        "usertype": "alumni",
        "email": "aarif.ansari04@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2009",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "CEO at Systemcare Technologies",
            "experience": "CEO at Systemcare Technologies",
            "contactinfo": "8802849990",
            "resume": "empty"
        }
    },
    {
        "personname": "Anil Kumar Singh",
        "userid": "07ME185",
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
        }
    },
    {
        "personname": "Shashank singh patel",
        "userid": "07CSE203",
        "usertype": "alumni",
        "email": "shashank.patel16@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CSE",
            "aboutme": "Dealing in Services",
            "education": "No input provided",
            "currentrole": "Engineer at HCL Services",
            "experience": "Engineer at HCL Services",
            "contactinfo": "8588856045",
            "resume": "empty"
        }
    },
    {
        "personname": "Abhay Singh",
        "userid": "02ECE142",
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
        }
    },
    {
        "personname": "Ankit Sharma",
        "userid": "99ECE143",
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
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "9560502503",
            "resume": "empty"
        }
    },
    {
        "personname": "ASHWANI KUMAR",
        "userid": "09ECE144",
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
            "currentrole": "R&D IN EMBEDDED ROBOTICS at DUCAT",
            "experience": "R&D IN EMBEDDED ROBOTICS at DUCAT",
            "contactinfo": "9013242049",
            "resume": "empty"
        }
    },
    {
        "personname": "RASHMI JADON",
        "userid": "07CSE204",
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
        }
    },
    {
        "personname": "Alok kumar",
        "userid": "07CSE205",
        "usertype": "alumni",
        "email": "aryaa786@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Co-founder at APT SOLUTIONS AND SERVICES",
            "experience": "Co-founder at APT SOLUTIONS AND SERVICES",
            "contactinfo": "7080101292",
            "resume": "empty"
        }
    },
    {
        "personname": "Rajat Kumar",
        "userid": "98ECE145",
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
        }
    },
    {
        "personname": "PRAVEEN KUSHWAHA",
        "userid": "02ECE146",
        "usertype": "alumni",
        "email": "ei.praveen@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "ECE",
            "aboutme": "Ok",
            "education": "No input provided",
            "currentrole": "JTO at BSNL",
            "experience": "JTO at BSNL",
            "contactinfo": "9412221718",
            "resume": "empty"
        }
    },
    {
        "personname": "Shantanu srivastava",
        "userid": "08ECE147",
        "usertype": "alumni",
        "email": "shantanusri123@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "ECE",
            "aboutme": "Still trying to be more better",
            "education": "No input provided",
            "currentrole": "Engineer at Idea cellular ltd.",
            "experience": "Engineer at Idea cellular ltd.",
            "contactinfo": "9540001047",
            "resume": "empty"
        }
    },
    {
        "personname": "Satyapal Singh",
        "userid": "08ECE148",
        "usertype": "alumni",
        "email": "ss100490@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Owner at SATSANGI TRADERS AGRA",
            "experience": "Owner at SATSANGI TRADERS AGRA",
            "contactinfo": "9634445263",
            "resume": "empty"
        }
    },
    {
        "personname": "Sonendra Pratap Singh",
        "userid": "03ECE149",
        "usertype": "alumni",
        "email": "sonendrapratapsingh@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Assistant Manager at Gramin Bank Of Aryavart",
            "experience": "Assistant Manager at Gramin Bank Of Aryavart",
            "contactinfo": "9634129787",
            "resume": "empty"
        }
    },
    {
        "personname": "Mradul Sharma",
        "userid": "02ECE150",
        "usertype": "alumni",
        "email": "varuchin@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Self Startup",
            "experience": "Self Startup",
            "contactinfo": "8958600221",
            "resume": "empty"
        }
    },
    {
        "personname": "JITENDER chaudhary",
        "userid": "02ECE151",
        "usertype": "alumni",
        "email": "jeet_engg_sai@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "ECE",
            "aboutme": "Good job",
            "education": "No input provided",
            "currentrole": "AO-IT at LIC of India",
            "experience": "AO-IT at LIC of India",
            "contactinfo": "9015551152",
            "resume": "empty"
        }
    },
    {
        "personname": "Shashank Sharma",
        "userid": "98ME186",
        "usertype": "alumni",
        "email": "Sharmashashank24@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "State material coordinator at Jio",
            "experience": "State material coordinator at Jio",
            "contactinfo": "8755747881",
            "resume": "empty"
        }
    },
    {
        "personname": "Lokendra Narayan Tripathi",
        "userid": "03CE44",
        "usertype": "alumni",
        "email": "lokendrarites@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "CE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "9839423507",
            "resume": "empty"
        }
    },
    {
        "personname": "HEMRAJ SINGH",
        "userid": "12ME187",
        "usertype": "alumni",
        "email": "hemraj.gica@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "ME",
            "aboutme": "SLIET PUNJAB",
            "education": "No input provided",
            "currentrole": "M.TECH at Center university Punjab (SLIET)",
            "experience": "M.TECH at Center university Punjab (SLIET)",
            "contactinfo": "9456947963",
            "resume": "empty"
        }
    },
    {
        "personname": "Deepankar Singh",
        "userid": "07CE45",
        "usertype": "alumni",
        "email": "deepankarsingh21@yahoo.in",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CE",
            "aboutme": "I'm also selected as a Assistant Engineer in Nagar Nigam in Dec., 2017",
            "education": "No input provided",
            "currentrole": "Assistant Engineer at (Panchayati Raj) Zila Panchayat",
            "experience": "Assistant Engineer at (Panchayati Raj) Zila Panchayat",
            "contactinfo": "9756874193",
            "resume": "empty"
        }
    },
    {
        "personname": "ankur Singh sagar",
        "userid": "08ME188",
        "usertype": "alumni",
        "email": "sagarankur90@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "ME",
            "aboutme": "We are looking new job and attand allumini",
            "education": "No input provided",
            "currentrole": "quality assurance engineer at micro machines private limited Faridabad",
            "experience": "quality assurance engineer at micro machines private limited Faridabad",
            "contactinfo": "9810398688",
            "resume": "empty"
        }
    },
    {
        "personname": "Jitendra Kumar",
        "userid": "07CE46",
        "usertype": "alumni",
        "email": "jeetuchittor@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "9286261835",
            "resume": "empty"
        }
    },
    {
        "personname": "praveen",
        "userid": "07CSE206",
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
            "currentrole": "Self Startup",
            "experience": "Self Startup",
            "contactinfo": "9451229382",
            "resume": "empty"
        }
    },
    {
        "personname": "Sumit gangwar",
        "userid": "09CSE207",
        "usertype": "alumni",
        "email": "sumitgangwar0@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2009",
            "branch": "CSE",
            "aboutme": "Right now working in real estate as a sr. Manager",
            "education": "No input provided",
            "currentrole": "Sr. Manager at Pacific green infraheight pvt ltd",
            "experience": "Sr. Manager at Pacific green infraheight pvt ltd",
            "contactinfo": "8171771556",
            "resume": "empty"
        }
    },
    {
        "personname": "Amit kaushik",
        "userid": "02CSE208",
        "usertype": "alumni",
        "email": "amit_kaushik18@yahoo.co.in",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Sr.S.O at Relaxo footwear Ltd.",
            "experience": "Sr.S.O at Relaxo footwear Ltd.",
            "contactinfo": "9992204606",
            "resume": "empty"
        }
    },
    {
        "personname": "Ashutosh Kumar Pachauri",
        "userid": "08ECE152",
        "usertype": "alumni",
        "email": "ashu210990@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Engineer at HP",
            "experience": "Engineer at HP",
            "contactinfo": "08802661220",
            "resume": "empty"
        }
    },
    {
        "personname": "Ashutosh Kumar Pachauri",
        "userid": "08ECE153",
        "usertype": "alumni",
        "email": "ashu210990@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Engineer at HP",
            "experience": "Engineer at HP",
            "contactinfo": "08802661220",
            "resume": "empty"
        }
    },
    {
        "personname": "Ravi Kant Rai",
        "userid": "12ME189",
        "usertype": "alumni",
        "email": "ravikantrai21@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "QUALITY CONTROL ENGINEER at EMKAY AUTOMOBILE INDUSTRIES LTD.",
            "experience": "QUALITY CONTROL ENGINEER at EMKAY AUTOMOBILE INDUSTRIES LTD.",
            "contactinfo": "7065634259",
            "resume": "empty"
        }
    },
    {
        "personname": "Varun Singh",
        "userid": "02CSE209",
        "usertype": "alumni",
        "email": "er.varunsingh@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Client Partner at Tata Consultancy Services",
            "experience": "Client Partner at Tata Consultancy Services",
            "contactinfo": "+27735258709",
            "resume": "empty"
        }
    },
    {
        "personname": "Sunil singh Bhadauria",
        "userid": "03ME190",
        "usertype": "alumni",
        "email": "sunilbhadauria48@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "ME",
            "aboutme": "Ok",
            "education": "No input provided",
            "currentrole": "Manager at Paluck technologies Pvt ltd",
            "experience": "Manager at Paluck technologies Pvt ltd",
            "contactinfo": "9810054553",
            "resume": "empty"
        }
    },
    {
        "personname": "Udaivir Singh",
        "userid": "02CE47",
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
            "contactinfo": "09927990422",
            "resume": "empty"
        }
    },
    {
        "personname": "Udaivir Singh",
        "userid": "02CE48",
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
            "contactinfo": "09927990422",
            "resume": "empty"
        }
    },
    {
        "personname": "Manoj kumarSagar",
        "userid": "02ME191",
        "usertype": "alumni",
        "email": "aemanojsagar@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "ME",
            "aboutme": "Pleasure & memorise thinks",
            "education": "No input provided",
            "currentrole": "AE at UP Development Aouthority",
            "experience": "AE at UP Development Aouthority",
            "contactinfo": "9643326701",
            "resume": "empty"
        }
    },
    {
        "personname": "Munish Raj Swaroop",
        "userid": "02CE49",
        "usertype": "alumni",
        "email": "munishce@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "CE",
            "aboutme": "Thank you",
            "education": "No input provided",
            "currentrole": "AE at UPRNN",
            "experience": "AE at UPRNN",
            "contactinfo": "9719051512",
            "resume": "empty"
        }
    },
    {
        "personname": "himanshu bajpai",
        "userid": "12ME192",
        "usertype": "alumni",
        "email": "bajpaih67@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "m tech at nit Uttarakhand",
            "experience": "m tech at nit Uttarakhand",
            "contactinfo": "9997444383",
            "resume": "empty"
        }
    },
    {
        "personname": "Munish Raj Swaroop",
        "userid": "02CE50",
        "usertype": "alumni",
        "email": "munishce@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "CE",
            "aboutme": "Thank you",
            "education": "No input provided",
            "currentrole": "AE at UPRNN",
            "experience": "AE at UPRNN",
            "contactinfo": "9719051512",
            "resume": "empty"
        }
    },
    {
        "personname": "Durgesh Pratap Singh",
        "userid": "07CSE210",
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
        }
    },
    {
        "personname": "Abha Verma",
        "userid": "13CSE211",
        "usertype": "alumni",
        "email": "abhaverma0526@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Software Engineer at TCS",
            "experience": "Software Engineer at TCS",
            "contactinfo": "9457432280",
            "resume": "empty"
        }
    },
    {
        "personname": "GAURAV YADAV",
        "userid": "07CSE212",
        "usertype": "alumni",
        "email": "gaurav.cool8425@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "ASM at Tata Motors Ltd.",
            "experience": "ASM at Tata Motors Ltd.",
            "contactinfo": "9410253745",
            "resume": "empty"
        }
    },
    {
        "personname": "ABHISHEK KUMAR",
        "userid": "07CSE213",
        "usertype": "alumni",
        "email": "kumar.abhi8066@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "IT ASSISTANT at ROTO PUMPS LTD.",
            "experience": "IT ASSISTANT at ROTO PUMPS LTD.",
            "contactinfo": "7011906899",
            "resume": "empty"
        }
    },
    {
        "personname": "Monu kumar",
        "userid": "08ECE154",
        "usertype": "alumni",
        "email": "monusikarwar2008@Gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "8477880203",
            "resume": "empty"
        }
    },
    {
        "personname": "Lovekush",
        "userid": "07ECE155",
        "usertype": "alumni",
        "email": "lovekush8027@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Rf engineer at Jio",
            "experience": "Rf engineer at Jio",
            "contactinfo": "8923845405",
            "resume": "empty"
        }
    },
    {
        "personname": "Rajeev kumar",
        "userid": "04CSE214",
        "usertype": "alumni",
        "email": "rajeev.ce44@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "8920350296",
            "resume": "empty"
        }
    },
    {
        "personname": "ASFI RIZVI",
        "userid": "06ME193",
        "usertype": "alumni",
        "email": "asfirizvi@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "MANAGER at TIRUPATI ENGINEERS (PMC-ALIMCO)",
            "experience": "MANAGER at TIRUPATI ENGINEERS (PMC-ALIMCO)",
            "contactinfo": "7985142029",
            "resume": "empty"
        }
    },
    {
        "personname": "Mohammed obaid ahmed",
        "userid": "09ME194",
        "usertype": "alumni",
        "email": "mdobaidshah@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2009",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "HSE engineer at Al sabah",
            "experience": "HSE engineer at Al sabah",
            "contactinfo": "+971556261124",
            "resume": "empty"
        }
    },
    {
        "personname": "Vikas chaurasia",
        "userid": "98ME195",
        "usertype": "alumni",
        "email": "vikascha123@yahoo.co.in",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working",
            "experience": "Working",
            "contactinfo": "9650337411",
            "resume": "empty"
        }
    },
    {
        "personname": "Avishekh Das",
        "userid": "06CSE215",
        "usertype": "alumni",
        "email": "avishekh.das@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Senior Technical Writer at Cisco Systems",
            "experience": "Senior Technical Writer at Cisco Systems",
            "contactinfo": "9916008078",
            "resume": "empty"
        }
    },
    {
        "personname": "Pankaj pathak",
        "userid": "06IT19",
        "usertype": "alumni",
        "email": "pankajpandits1331@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "IT",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Director at Ram security services",
            "experience": "Director at Ram security services",
            "contactinfo": "7017299941",
            "resume": "empty"
        }
    },
    {
        "personname": "Pankaj pathak",
        "userid": "06IT20",
        "usertype": "alumni",
        "email": "pankajpandits1331@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "IT",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Director at Ram security services",
            "experience": "Director at Ram security services",
            "contactinfo": "7017299941",
            "resume": "empty"
        }
    },
    {
        "personname": "anshu choudhary",
        "userid": "06CSE216",
        "usertype": "alumni",
        "email": "anshu.nird@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working at National Institute of Rural Development and Panchayati Raj",
            "experience": "Working at National Institute of Rural Development and Panchayati Raj",
            "contactinfo": "9985378349",
            "resume": "empty"
        }
    },
    {
        "personname": "Bhoopendra Ratan Shakya",
        "userid": "00ECE156",
        "usertype": "alumni",
        "email": "brshakya08@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Lecturer at Government polytechnic Mainpuri",
            "experience": "Lecturer at Government polytechnic Mainpuri",
            "contactinfo": "9919219734",
            "resume": "empty"
        }
    },
    {
        "personname": "Khushboo Sachan",
        "userid": "10CSE217",
        "usertype": "alumni",
        "email": "ipassionate.khushboo@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2010",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working at Lnt infotech",
            "experience": "Working at Lnt infotech",
            "contactinfo": "9167615613",
            "resume": "empty"
        }
    },
    {
        "personname": "Krishna Kant Upadhyay",
        "userid": "99CSE218",
        "usertype": "alumni",
        "email": "amchipolice@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "IPS at GoI",
            "experience": "IPS at GoI",
            "contactinfo": "7720008688",
            "resume": "empty"
        }
    },
    {
        "personname": "Mukesh Yadav",
        "userid": "98ME196",
        "usertype": "alumni",
        "email": "mukesh_iaf25@rediffmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Senior Engineer at Defence",
            "experience": "Senior Engineer at Defence",
            "contactinfo": "9129191332",
            "resume": "empty"
        }
    },
    {
        "personname": "Pankaj pathak",
        "userid": "06IT21",
        "usertype": "alumni",
        "email": "pankajpandits1331@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "IT",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Director at Ram security services",
            "experience": "Director at Ram security services",
            "contactinfo": "7017299941",
            "resume": "empty"
        }
    },
    {
        "personname": "Pankaj pathak",
        "userid": "06IT22",
        "usertype": "alumni",
        "email": "pankajpandits1331@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2006",
            "branch": "IT",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Director at Ram security services",
            "experience": "Director at Ram security services",
            "contactinfo": "7017299941",
            "resume": "empty"
        }
    },
    {
        "personname": "Satyavir Singh Rana",
        "userid": "08ME197",
        "usertype": "alumni",
        "email": "satyavir.rana@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "ME",
            "aboutme": "I'm very exiting for alumni meet.",
            "education": "No input provided",
            "currentrole": "Assistant Area Manager at TAFE LTD.",
            "experience": "Assistant Area Manager at TAFE LTD.",
            "contactinfo": "8791498850",
            "resume": "empty"
        }
    },
    {
        "personname": "Pravesh Shrivastava",
        "userid": "07ECE157",
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
            "currentrole": "Asst Manager at National Data & Surveying Services, USA",
            "experience": "Asst Manager at National Data & Surveying Services, USA",
            "contactinfo": "9910688794",
            "resume": "empty"
        }
    },
    {
        "personname": "ANANT SHAYANAM",
        "userid": "00CSE219",
        "usertype": "alumni",
        "email": "anant.u21mba@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "MANAGER- SOFTWARE DEVELOPMENT & TESTING at HORIBA",
            "experience": "MANAGER- SOFTWARE DEVELOPMENT & TESTING at HORIBA",
            "contactinfo": "9958560471",
            "resume": "empty"
        }
    },
    {
        "personname": "Shipra jadon",
        "userid": "08ECE158",
        "usertype": "alumni",
        "email": "shiprajadon11@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "8755285246",
            "resume": "empty"
        }
    },
    {
        "personname": "Rinku chaudhary",
        "userid": "08IT23",
        "usertype": "alumni",
        "email": "rik2011.chaudhary@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "IT",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Sr. Software engineer at Landis +gyr",
            "experience": "Sr. Software engineer at Landis +gyr",
            "contactinfo": "8506951645",
            "resume": "empty"
        }
    },
    {
        "personname": "Gajendra pal singh",
        "userid": "98ME198",
        "usertype": "alumni",
        "email": "gajendra.vee@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "ME",
            "aboutme": "Every moment is an strugal, we must enjoy it and keep on move forward.",
            "education": "No input provided",
            "currentrole": "MD at Global Finr Art corporation",
            "experience": "MD at Global Finr Art corporation",
            "contactinfo": "9868622406",
            "resume": "empty"
        }
    },
    {
        "personname": "Abhinnet Kumar",
        "userid": "01CSE220",
        "usertype": "alumni",
        "email": "abhineet_splash@yahoo.co.in",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2001",
            "branch": "CSE",
            "aboutme": "I will attend 31-March-2018",
            "education": "No input provided",
            "currentrole": "Senior Engineer at AT&T Communications India Ltd",
            "experience": "Senior Engineer at AT&T Communications India Ltd",
            "contactinfo": "9911878902",
            "resume": "empty"
        }
    },
    {
        "personname": "Vivek Sharma",
        "userid": "07CSE221",
        "usertype": "alumni",
        "email": "viveksharma25791@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CSE",
            "aboutme": "Tilak bazar",
            "education": "No input provided",
            "currentrole": "Md at Secure medical devices Pvt.ltd",
            "experience": "Md at Secure medical devices Pvt.ltd",
            "contactinfo": "9457001218",
            "resume": "empty"
        }
    },
    {
        "personname": "Lone Shafkat Lone",
        "userid": "14ME199",
        "usertype": "alumni",
        "email": "loneshafkat999@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2014",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Doing Higher Education",
            "experience": "Doing Higher Education",
            "contactinfo": "7006520264",
            "resume": "empty"
        }
    },
    {
        "personname": "Mohita Chauhan",
        "userid": "07CSE222",
        "usertype": "alumni",
        "email": "mohitachauhan626@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Hr at Pwc",
            "experience": "Hr at Pwc",
            "contactinfo": "7838942443",
            "resume": "empty"
        }
    },
    {
        "personname": "Aman Saxena",
        "userid": "07IT24",
        "usertype": "alumni",
        "email": "aman0922@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2007",
            "branch": "IT",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Working at Hcl",
            "experience": "Working at Hcl",
            "contactinfo": "8826243334",
            "resume": "empty"
        }
    },
    {
        "personname": "Avtar singh",
        "userid": "03ECE159",
        "usertype": "alumni",
        "email": "singhavtar_18j@yahoo.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Manager at Nahar industrial enterprises Ltd, Ludhiana",
            "experience": "Manager at Nahar industrial enterprises Ltd, Ludhiana",
            "contactinfo": "9897759995",
            "resume": "empty"
        }
    },
    {
        "personname": "ashish sharma",
        "userid": "03ME200",
        "usertype": "alumni",
        "email": "sharmaashish1985@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Assistant Engineer at UPSEB",
            "experience": "Assistant Engineer at UPSEB",
            "contactinfo": "9412753304",
            "resume": "empty"
        }
    },
    {
        "personname": "Nischal saxena",
        "userid": "98CSE223",
        "usertype": "alumni",
        "email": "nischal.saxena@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Software engineer advance at Siemens PLM",
            "experience": "Software engineer advance at Siemens PLM",
            "contactinfo": "5135508731",
            "resume": "empty"
        }
    },
    {
        "personname": "Chandan Kumar Yadav",
        "userid": "10ME201",
        "usertype": "alumni",
        "email": "chandan.yadaw20@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2010",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "MEP Engineer at Duserve facilities management DWC LLC",
            "experience": "MEP Engineer at Duserve facilities management DWC LLC",
            "contactinfo": "+971589951359",
            "resume": "empty"
        }
    },
    {
        "personname": "Mukesh Yadav",
        "userid": "98ME202",
        "usertype": "alumni",
        "email": "mukesh_iaf25@rediffmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1998",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Senior Engineer at Defence",
            "experience": "Senior Engineer at Defence",
            "contactinfo": "9129191332",
            "resume": "empty"
        }
    },
    {
        "personname": "BHUVANESH KUMAR SHARMA",
        "userid": "02ME203",
        "usertype": "alumni",
        "email": "BKSHARMA81@GMAIL.COM",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "CO- FOUNDER at VDT PIPELINE INTEGRITY SOLUTIONS PVT LTD",
            "experience": "CO- FOUNDER at VDT PIPELINE INTEGRITY SOLUTIONS PVT LTD",
            "contactinfo": "09712403281",
            "resume": "empty"
        }
    },
    {
        "personname": "sachin kumar",
        "userid": "02IT25",
        "usertype": "alumni",
        "email": "sachinkr.accenture@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "IT",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Team lead at Accenture",
            "experience": "Team lead at Accenture",
            "contactinfo": "7042729967",
            "resume": "empty"
        }
    },
    {
        "personname": "vivek kumar pal",
        "userid": "13ECE160",
        "usertype": "alumni",
        "email": "vivekpal172@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2013",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "9956305802",
            "resume": "empty"
        }
    },
    {
        "personname": "Abhinav Prakash",
        "userid": "05CSE224",
        "usertype": "alumni",
        "email": "abhinavprk@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2005",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "MSc. at TU Darmstadt",
            "experience": "MSc. at TU Darmstadt",
            "contactinfo": "17685619465",
            "resume": "empty"
        }
    },
    {
        "personname": "Sadav Ansari",
        "userid": "11ECE161",
        "usertype": "alumni",
        "email": "sadavansari92@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2011",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Cisco VoIP & Wireless Engineer at HCL Infotech Ltd",
            "experience": "Cisco VoIP & Wireless Engineer at HCL Infotech Ltd",
            "contactinfo": "8287117110",
            "resume": "empty"
        }
    },
    {
        "personname": "Satyavir Singh Rana",
        "userid": "08ME204",
        "usertype": "alumni",
        "email": "satyavir.rana@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Area Manager at TAFE LTD",
            "experience": "Area Manager at TAFE LTD",
            "contactinfo": "8791498850",
            "resume": "empty"
        }
    },
    {
        "personname": "Dileep kumar",
        "userid": "08ME205",
        "usertype": "alumni",
        "email": "dileep.yadav93@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "ME",
            "aboutme": "I currently looking for startup",
            "education": "No input provided",
            "currentrole": "Engineer at Elentec India Pvt. Ltd.",
            "experience": "Engineer at Elentec India Pvt. Ltd.",
            "contactinfo": "9690330264",
            "resume": "empty"
        }
    },
    {
        "personname": "Prateek Saxena",
        "userid": "08ME206",
        "usertype": "alumni",
        "email": "prateeksaxena1991@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Manufacturing Head at Rajhans Pressing",
            "experience": "Manufacturing Head at Rajhans Pressing",
            "contactinfo": "7417979293",
            "resume": "empty"
        }
    },
    {
        "personname": "Ankur Sharma",
        "userid": "02CSE225",
        "usertype": "alumni",
        "email": "ankur16.sharma@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2002",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Head- Software Deveplemt at Accretive technologies Pvt LTD",
            "experience": "Head- Software Deveplemt at Accretive technologies Pvt LTD",
            "contactinfo": "9810439971",
            "resume": "empty"
        }
    },
    {
        "personname": "Kapil Sharma",
        "userid": "00CSE226",
        "usertype": "alumni",
        "email": "kaps23dec@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Project Manager at IBM Canada",
            "experience": "Project Manager at IBM Canada",
            "contactinfo": "+16473816150",
            "resume": "empty"
        }
    },
    {
        "personname": "Bhoopendra Singh",
        "userid": "00ME207",
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
        }
    },
    {
        "personname": "Rajat Sharma",
        "userid": "03ME208",
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
            "currentrole": "Project Manager- International Sales at Allan Lloyds Group",
            "experience": "Project Manager- International Sales at Allan Lloyds Group",
            "contactinfo": "9528602388",
            "resume": "empty"
        }
    },
    {
        "personname": "Yogesh Verma",
        "userid": "00ME209",
        "usertype": "alumni",
        "email": "letsbringchange2011@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "ME",
            "aboutme": "www.thriveme.in",
            "education": "No input provided",
            "currentrole": "CEO at THRIVME",
            "experience": "CEO at THRIVME",
            "contactinfo": "+91993625594",
            "resume": "empty"
        }
    },
    {
        "personname": "Nirbhay Srivastava",
        "userid": "00ME210",
        "usertype": "alumni",
        "email": "to.nirbhay@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Head - Standard &Quality Assurance at Capital Goods Skill Council",
            "experience": "Head - Standard &Quality Assurance at Capital Goods Skill Council",
            "contactinfo": "8130439888",
            "resume": "empty"
        }
    },
    {
        "personname": "PUSHKAR KUMAR",
        "userid": "08ME211",
        "usertype": "alumni",
        "email": "mspushkar@rediffmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Asst. Mgr. at Godrej & Boyce Mfg. Co. Ltd.",
            "experience": "Asst. Mgr. at Godrej & Boyce Mfg. Co. Ltd.",
            "contactinfo": "8051080977",
            "resume": "empty"
        }
    },
    {
        "personname": "Sonal jagarwal",
        "userid": "08CSE227",
        "usertype": "alumni",
        "email": "sonalsinghh89@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "UI/UX designer at SpiceJet",
            "experience": "UI/UX designer at SpiceJet",
            "contactinfo": "9560120752",
            "resume": "empty"
        }
    },
    {
        "personname": "Ravinder Kumar",
        "userid": "01ECE162",
        "usertype": "alumni",
        "email": "pgp27044@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2001",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Business Architect - Asia Africa at Monsanto India Ltd",
            "experience": "Business Architect - Asia Africa at Monsanto India Ltd",
            "contactinfo": "8169867387",
            "resume": "empty"
        }
    },
    {
        "personname": "Peeyush Rohilla",
        "userid": "00CSE228",
        "usertype": "alumni",
        "email": "peeyushrohilla@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Managing Partner at Synergy Engineers",
            "experience": "Managing Partner at Synergy Engineers",
            "contactinfo": "9910003238",
            "resume": "empty"
        }
    },
    {
        "personname": "Pravesh Shrivastava",
        "userid": "07ECE163",
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
            "currentrole": "Team Leader at National Data & Surveying Services, USA",
            "experience": "Team Leader at National Data & Surveying Services, USA",
            "contactinfo": "9910688794",
            "resume": "empty"
        }
    },
    {
        "personname": "Ayushshankarpandey",
        "userid": "12CSE229",
        "usertype": "alumni",
        "email": "ayushshankarpandey@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Self Startup at Devraj Trader\u2019s",
            "experience": "Self Startup at Devraj Trader\u2019s",
            "contactinfo": "9457130738",
            "resume": "empty"
        }
    },
    {
        "personname": "Ayushshankarpandey",
        "userid": "12CSE230",
        "usertype": "alumni",
        "email": "ayushshankarpandey@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2012",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Self Startup at Devraj Trader\u2019s",
            "experience": "Self Startup at Devraj Trader\u2019s",
            "contactinfo": "9457130738",
            "resume": "empty"
        }
    },
    {
        "personname": "Manoj kumar",
        "userid": "99ME212",
        "usertype": "alumni",
        "email": "manojkumaranuragi@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "1999",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "General Manager at Kalyan steel product pvt Ltd.",
            "experience": "General Manager at Kalyan steel product pvt Ltd.",
            "contactinfo": "9897882013",
            "resume": "empty"
        }
    },
    {
        "personname": "ASHEESH KUMAR",
        "userid": "03CE51",
        "usertype": "alumni",
        "email": "asheeshkumar2005@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "CE",
            "aboutme": "HELLO",
            "education": "No input provided",
            "currentrole": "ASSSISTANT COMMISSIONER at GOVERMENT OF UTTAR PARDESH",
            "experience": "ASSSISTANT COMMISSIONER at GOVERMENT OF UTTAR PARDESH",
            "contactinfo": "9760722974",
            "resume": "empty"
        }
    },
    {
        "personname": "jyoti baghel",
        "userid": "08CSE231",
        "usertype": "alumni",
        "email": "jyotib876@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "CSE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Preparing for Competative exam",
            "experience": "Preparing for Competative exam",
            "contactinfo": "8006800078",
            "resume": "empty"
        }
    },
    {
        "personname": "VISHVENDRA SINGH MALIK",
        "userid": "08IT26",
        "usertype": "alumni",
        "email": "vsmalik2020@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "IT",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "REVENUE INSPECTOR at DEPT OF REVENUE,GOVT OF UTTAR PRADESH",
            "experience": "REVENUE INSPECTOR at DEPT OF REVENUE,GOVT OF UTTAR PRADESH",
            "contactinfo": "9027673689",
            "resume": "empty"
        }
    },
    {
        "personname": "LOKESH KUMAR SINGH",
        "userid": "09ME213",
        "usertype": "alumni",
        "email": "lokeshsng10@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2009",
            "branch": "ME",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "HEAD CASHIER at UCO BANK",
            "experience": "HEAD CASHIER at UCO BANK",
            "contactinfo": "9997518159",
            "resume": "empty"
        }
    },
    {
        "personname": "RISHIBRIND KUMAR UPADHYAY",
        "userid": "05ECE164",
        "usertype": "alumni",
        "email": "rishibrind1989@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2005",
            "branch": "ECE",
            "aboutme": "No input provided",
            "education": "No input provided",
            "currentrole": "Ph.D. student at IIT(BHU) Varanasi",
            "experience": "Ph.D. student at IIT(BHU) Varanasi",
            "contactinfo": "9289438536",
            "resume": "empty"
        }
    },
    {
        "personname": "RATISH KUMAR",
        "userid": "08ECE165",
        "usertype": "alumni",
        "email": "ratish90@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2008",
            "branch": "ECE",
            "aboutme": "MORE RISK MORE GAIN...",
            "education": "No input provided",
            "currentrole": "DIRECTOR at ACADEMY OF ADVANCE STUDIES DELHI-86",
            "experience": "DIRECTOR at ACADEMY OF ADVANCE STUDIES DELHI-86",
            "contactinfo": "8766247847",
            "resume": "empty"
        }
    },
    {
        "personname": "Imran Husain",
        "userid": "03CE52",
        "usertype": "alumni",
        "email": "imranhusain.spn@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2003",
            "branch": "CE",
            "aboutme": "I am really miss khandari campus.",
            "education": "No input provided",
            "currentrole": "Lecturer at Integral university Lucknow",
            "experience": "Lecturer at Integral university Lucknow",
            "contactinfo": "8858041300",
            "resume": "empty"
        }
    },
    {
        "personname": "Saurabh Kumar Singh",
        "userid": "00CSE232",
        "usertype": "alumni",
        "email": "erskumars@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2000",
            "branch": "CSE",
            "aboutme": "Lets use this Alumni network for growth and opportunities",
            "education": "No input provided",
            "currentrole": "Manager at Capgemini",
            "experience": "Manager at Capgemini",
            "contactinfo": "9869533928",
            "resume": "empty"
        }
    },
    {
        "personname": "Nitin kumar",
        "userid": "04ECE166",
        "usertype": "alumni",
        "email": "nitin.kumar.er@gmail.com",
        "userprivacy": "public",
        "salt": "",
        "passwordhash": "",
        "personimage": "Empty",
        "details": {
            "batch": "2004",
            "branch": "ECE",
            "aboutme": "Hi I am Nitin kumar of batch 2004-08 with branch ECE.After passing out from IET I got admission in NIT Jaipur for Mtech. During Mtech I also cleared Engg services-2010.so my success story started from Iet.",
            "education": "No input provided",
            "currentrole": "Asst Manager (Air traffic control) at Airports Authority of India",
            "experience": "Asst Manager (Air traffic control) at Airports Authority of India",
            "contactinfo": "7045867442",
            "resume": "empty"
        }
    }
];
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
