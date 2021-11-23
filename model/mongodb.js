
const { MongoClient } = require("mongodb");
const { now } = require("mongoose");
 
// Replace the following with your Atlas connection string                                                                                                                                        
// const url = "mongodb+srv://idsudeep:PasswordShared@goingdown.pn9y1.mongodb.net/test?retryWrites=true&w=majority";

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
                                                                                                                                                            

         // Find one document
          let qz = {"presents.mode": "A"};
         const myDoc = await col.findOne({"presents.userid":1634833919250});
         const filterone =await col.findOne({"subjectCode":977});
         console.log(filterone.createAt);
      
         if(myDoc){console.log("User Already Exist");}
         if(!myDoc){
            let Doc = {
                "takenById": 1001,
                "subjectCode": 0977,                                                                                                                                 
                "createAt": new Date('y-m-d'), // June 7, 1954                                                                                                                                  
                "presents": [ 
                  {"userid": new Date().getTime(),
                   "mode": "P",
                 "qrcode":22/7} ]
            }

            let query = await col.insertOne(Doc);
            console.log(query);
   
         }


         

        } catch (err) {
         console.log(err.stack);
     }

 
     finally {
        await client.close();
    }
}

run().catch(console.dir);