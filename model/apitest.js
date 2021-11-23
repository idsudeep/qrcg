
const { query } = require("express");
const { MongoClient } = require("mongodb");
const { now } = require("mongoose");

 
// Replace the following with your Atlas connection string                                                                                                                                        
// const url = "mongodb+srv://idsudeep:PasswordShared@goingdown.pn9y1.mongodb.net/test?retryWrites=true&w=majority";

 const issueDate = new Date().toLocaleDateString();



const client = new MongoClient('mongodb://localhost');
 
 // The database to use
 const dbName = "test";
                      
 async function run() {
    try {
         await client.connect();
        //  console.log(" MongoDb Connected ");
         const db = client.db(dbName);

         const col = db.collection("userProfile");
         var selfId = require('mongodb').ObjectID;
         var userid = 10002;
         var takenById = 1001;
         var subjectCode = 977;
         var qrcode = 9898;                                                                                                                                                  
        var  Doc = {
                "takenById": takenById,
                "subjectCode":subjectCode,                                                                                                                                 
                "createAt": issueDate ,                                                                                                                                  
                "presents": [ 
                  {"userid": selfId,
                   "mode": "P",
                 "qrcode":qrcode} ]
                }
       const queryOne = await col.findOne({"subjectCode":subjectCode, "createAt":issueDate});

          if(queryOne != null){

          const oneMoreQuery = await col.findOne({"subjectCode":subjectCode,"presents.qrcode":qrcode,"createAt":issueDate});
          var storelastQr = null;
          oneMoreQuery.presents.forEach(item => {storelastQr= item.qrcode;});
          console.log(oneMoreQuery + '  Push Query');
       if(storelastQr == qrcode){

          const validateUserBeforePush = await col.findOne({"subjectCode":subjectCode,"presents.userid":userid,"createAt":issueDate});
            if(validateUserBeforePush == null){ 
              console.log("waiting to Push");
              console.log(validateUserBeforePush);
              var myarr = {"userid":userid,
              "mode": "P",
            "qrcode":qrcode};
       let pushOne = await col.updateOne({"subjectCode":subjectCode,"createAt":issueDate },{$push:{presents:{$each:[myarr]}}});
              

            }else{console.log("User Already Exist");}
      }else{console.log('invalid Qrcode');}
    
     }else{
                  var newDoc = {
                    "takenById": takenById,
                    "subjectCode":subjectCode,                                                                                                                                 
                    "createAt": issueDate, // June 7, 1954                                                                                                                                  
                    "presents": [{
                        "userid":'Default',
                          "mode":'P',
                        "qrcode":qrcode}]
                    }
                let insertNew = await col.insertOne(newDoc);
                console.log('Default Data ');}       

        } catch (err) {
         console.log(err.stack);
     }

 
     finally {
        await client.close();
    }
}

run().catch(console.dir);