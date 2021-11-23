
const mongoose = require("mongoose");

// Replace this with your MONGOURI.
// const MONGOURI = "mongodb+srv://idsudeep:PasswordShared@goingdown.pn9y1.mongodb.net/test?retryWrites=true&w=majority";

const MONGOURI ='mongodb://localhost';

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology:true
    });
    console.log("Connected to DB for Mongoose !!");
  } catch (e) {
  
    throw e;
  }

};


  module.exports = InitiateMongoServer;
