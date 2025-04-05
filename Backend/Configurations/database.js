const mongoose = require('mongoose');
require('dotenv').config();

const dbConnect = async ()=>{
  try{
  await mongoose.connect(process.env.DATABASE_URL);
  console.log('Connected to MongoDB');
  }
  catch(err){
  console.log('Connection to MongoDB failed...');
  }
}

module.exports = dbConnect;