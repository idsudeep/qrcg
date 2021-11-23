// Calling the packages that we need

const { MongoClient } = require("mongodb");
const express = require("express");
const dateNow = require("moment");

  
const issueDate = dateNow().format("DD/MM/YYYY");

const mongoUri = "mongodb+srv://idsudeep:PasswordShared@goingdown.pn9y1.mongodb.net/thankyou-mongodb?retryWrites=true&w=majority";
const dbName = "thankyou-mongodb";
const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });


const mysql = require("mysql"); 
const app = express();
app.use(express.json());
const PORT =  process.env.PORT || 3000;
const bp = require("body-parser");
const qr = require("qrcode");
const { render, compile } = require("ejs");
const path = require("path");
const e = require("express");
const { isNull } = require("util");
const { createConnection } = require("net");

  
app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.use(express.static(__dirname +path.sep+ '/public'));
// Simple routing to the index.ejs file
app.get("/index", (req, res) => {
    const fcode = null;

    if(fcode){
        qr.toDataURL(fcode, (err,src)=>{
            if (err) res.send("Error occured");
            res.render("index" , {src});
        });

    }else{

        let fcode = 'code';
        qr.toDataURL(fcode, (err,src)=>{
            if (err) res.send("Error occured");
            res.render("index" , {src});
        });
    }

 
   
});

app.get("/getUserTable",(req,res)=>{

async function getUserTable(){
    try{
        await client.connect();
        db = client.db(dbName);

        const sem = req.query.sem;
        const course = req.query.course;
        const subCode = req.query.subCode;
        const collName = course+sem+'_'+subCode;
        let cHere =  await db.collection(collName).find({"status":"P"}).toArray();
    
        console.log(cHere);
       var arrresp = [];
            cHere.forEach(i => {arrresp.push({"std_id":i.userid,"status":i.status});});
                res.json({arrresp}); 
    }catch(error){ console.log(error.stack);}
    finally{
        await client.close();
    }
}
getUserTable().catch(console.dir);
});
app.get("/removeUser",(req,res)=>{
  
    async function removeUser(){
        try{
            await client.connect();
            db = client.db(dbName);
    
            const sem = req.query.sem;
            const course = req.query.course;
            const subCode = req.query.subCode;
            const collName = course+sem+'_'+subCode;
            var removeid = req.query.delId;
            
            let cHere =  await db.collection(collName).deleteOne({"userid":removeid});
            if(cHere.deletedCount !=0){
                res.setHeader("Access-Control-Allow-Origin","*");
                res.json({Title:'request Completed with Success'});
            }
        
        }catch(error){ console.log(error.stack);}
        finally{
            await client.close();
        }
    }
    removeUser().catch(console.dir);
    });
app.get("/qrcg",(req,res)=>{
    
      res.setHeader("Access-Control-Allow-Origin", "*");
     
     
    const url = req.query.url;
    // console.log(url +'This Console');

    
   
    qr.toDataURL(url, (err, src) => {
        if (err) res.send("Error occured");

        res.json({src});
       
      
    });


    
});

app.post("/generate", (req, res) => {
    const url = req.body.url;
    console.log(url +'This Console');

    if (url.length === 0) 
    res.send("Empty Data!");
   
    qr.toDataURL(url, (err, src) => {
        if (err) res.send("Error occured");

        res.render("index", { src });
    });
});

app.get("/getQrcodec",(req,res)=>{

    async function getQrcodec(){
        try{
            await client.connect();
            let db = client.db(dbName);
            let documentloc = db.collection(req.query.collection);
            const data = await documentloc.find().sort({_id:-1}).limit(1).toArray();
            if(data){
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.json({sub_code:data[0].subCode,qrcode:data[0].qrcode});}
        }catch(error){console.log(error.stack);}
        finally{
            await client.close();
        }
    }
    getQrcodec().catch(console.dir);
});
app.get("/insertOneQ",(req,res)=>{

    const subjectCode = req.query.subCode;
    const userCode = req.query.userCode;
    const conCol = req.query.conCol;
    const getQrcode = req.query.qrCode;
    async function insertOneF(){
        try{

            await client.connect();
            let db = client.db(dbName);
            let documentloc = db.collection(conCol);
            let findOneQ = await documentloc.findOne({userid:userCode});
            res.setHeader("Access-Control-Allow-Origin", "*");
            if(findOneQ != null){res.json({Title:'User Already Exist.'});}
            if(findOneQ ==null){
                var codeQ = Math.floor(Math.random() * 69069);
                var insertArr = {userid:userCode,subCode:subjectCode,issueDate:issueDate,status:"P",qrcode:codeQ};
                runQuery = await documentloc.insertOne(insertArr);
                res.json({Title:'update SuccessFully.'})
            }
        }catch(error){console.log(error.stack);}
        finally{
            await client.close();
        }
    }
insertOneF().catch(console.dir);
});
app.get("/reqforqueryusingpush",(req,res)=>{

    async function run() {
        try {
             await client.connect();
        
             const db = client.db(dbName);
    
             const col = db.collection("userProfile");
             var selfId = require('mongodb').ObjectID;
             var userid = 10005;
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
              
           if(storelastQr == qrcode){
    
              const validateUserBeforePush = await col.findOne({"subjectCode":subjectCode,"presents.userid":userid,"createAt":issueDate});
                if(validateUserBeforePush == null){ 
                  console.log("waiting to Push");
                 
                  var myarr = {"userid":userid,
                  "mode": "P",
                "qrcode":qrcode};
           let pushOne = await col.updateOne({"subjectCode":subjectCode,"createAt":issueDate },{$push:{presents:{$each:[myarr]}}});
                  res.json({"Title":"Push Data into DB"});
    
                }else{console.log("User Already Exist"); res.json({"Title":"User Already Exist"}); }
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
                    console.log('Default Data ');
                    res.json({"Title":"Default Data"});
                }       
    
            } catch (err) {
             console.log(err.stack);
         }
    
     
         finally {
            await client.close();
        }
    }
    
    run().catch(console.dir);
    

});

app.get("/dbmovereq",(req,res)=>{
    var sem = req.query.sem;
    var course = req.query.course;
    var subCode = req.query.subCode;
     
    var collectionName = course+sem+'_'+subCode;
 
    async function start(){
        try{
            await client.connect();
            const db = client.db(dbName);
            const colName = db.collection(collectionName);
            const queryled = await colName.findOne({"subCode":subCode});
          
        if(queryled){
           let arritem = [];
            let qs = await colName.find({"status":"P" ,"subCode":subCode});
           
        if(await qs.count() >=1){
           
            for await (const doc of qs) {
                arritem.push({"stdid":doc.userid,"subCode":doc.subCode,"issueDate":doc.issueDate,"status":doc.status});
                 }
                 const conn = mysql.createConnection({
                   host:"localhost",
                   user:"root",
                   database:"ps",
                   password:""
               });
               conn.connect((error)=>{
                   if(error){
                       res.json({Title:'error in Db connection '});
                   }
                 
               })
               let  pd = [];
               let vq = await colName.findOne({"status":"P" ,"subCode":subCode});
               console.log(vq);
               for(var i=0; i<1; i++){pd.push(vq.issueDate);}
                   var id = pd[0];
                 
   
               var query1 = "SELECT issue_date FROM atbl where issue_date=" + mysql.escape(id);
               conn.query(query1, function (err, result, fields) {
                    if (err) throw err;
                   
                    if(result.length !=0 && result[0].issue_date == pd[0]){
                        res.json({Title:'Data is Upto Date '});
                    }
                    if(result.length ==0){
                       conn.query(
                           'INSERT INTO atbl (regno,sub_code,issue_date,status) VALUES ?',
                           [arritem.map(item => [item.stdid,item.subCode,item.issueDate,item.status])],
                           (error, results) => {
                               res.json({Title:"success on Update Query "});
                              
                           });
                    }
               });
        }else{res.json({Title:"Raise Update QS"});}
      
        }else{res.json({Title:"Raise Query Result N0t Found."});}

        }catch(error){}
        finally{await client.close(); }
    }
    start().catch(console.dir);

})

app.get("/getstatusbefore",(req,res)=>{
  
    var sem = req.query.sem;
    var course = req.query.course;
    var subCode = req.query.subCode;
     
    var collectionName = course+sem+'_'+subCode;

    async function run(){
        try{
            await client.connect();
            const db = client.db(dbName);
            const colName = db.collection(collectionName);
            var pusharr = [];
            let objArr ={};
            const queryforA = await colName.findOne({"status":"A"});
            if(queryforA !=null){
             const queryforP = await colName.countDocuments({"status":"P"});
                objArr['faculty_id'] =queryforA.faculty_id;
                objArr['last_taken_date']=queryforA.issueDate;
                objArr['subCode']=queryforA.subCode;
                objArr['no_of_row']=queryforP;  
                pusharr.push(objArr);
                res.setHeader("Access-Control-Allow-Origin", "*");
            res.json(objArr);
            res.end();
            }else{ res.json({errormsg:"Zero results , Assign new"});}
        }catch(error){
            console.log(error.stack);
        }
        finally{
            await client.close();
        }
    }
    run().catch(console.dir);

});
app.get("/cleardbreq",(req,res)=>{
  

    var sem = req.query.sem;
    var course = req.query.course;
    var subCode = req.query.subCode;
     
    var collectionName = course+sem+'_'+subCode;

    async function run(){
        try{
            await client.connect();
            const db = client.db(dbName);
            const colName = db.collection(collectionName);
            var pusharr = [];
            let objArr ={};
            const findSubject = await colName.findOne({"subCode":subCode});
         
            if(!!findSubject && findSubject.subCode !=null){
            let deleteQuery = await colName.deleteMany({"subCode":subCode});
            if(deleteQuery){res.json({Title:"Data Deleted",statusCode:'204'})}        
        }else{
            res.json({Title:"Empty Data , Assign Attendance"});
        }

        }catch(error){
            console.log(error.stack);
        }
        finally{
            await client.close();
        }
    }
    run().catch(console.dir);

});

app.get("/assignnew", (req,res)=>{
    var sem = req.query.sem;
    var course = req.query.course;
    var subCode = req.query.subCode;
    var facultyID = req.query.faculty_id;
    var collectionName = course+sem+'_'+subCode;
    async function startNew(){

        try{
            await client.connect();
            const db = client.db(dbName);
            const colName = db.collection(collectionName);
           
            let findCollection = await colName.findOne({"subCode":subCode});
       if(findCollection != null){
           res.json({statusCode:'204',Title:"Geetting  ready For Assign "});
       }else if(findCollection == null ){
        var qcode = Math.floor(Math.random() * 10);
           var darr = {'faculty_id':facultyID ,"subCode":subCode,"issueDate":issueDate,"status":"A","qrcode":qcode};
           let Queryinsert = await colName.insertOne(darr);

           res.json({statusCode:'200',Title:"New Record Insert"});
       }
        }catch(error){
          console.log(error.stack);      
        }
        finally{
            await client.close();
        }
    }
    startNew().catch(console.dir);

})
app.get("/getCodeForG",(req,res)=>{
    var sem = req.query.sem;
    var subCode = req.query.subCode;
    var course = req.query.course;
    let collName = course+sem+'_'+subCode;
    async function getStart(){
        try{
            await client.connect();
            const db =  client.db(dbName);
            
            const colName = db.collection(collName);

            let cCount = await colName.countDocuments({"subCode":subCode});
           if(cCount !=0){
            const data = await colName.find().sort({_id:-1}).limit(1).toArray();
           if(data){res.json({statusCode:'200',qrcode:data[0].qrcode});}
         }
         
        }catch(error){ console.log(error.stack);}
        finally{
            await client.close();
        }
    }

    getStart().catch(console.dir);

});
app.get("/requestQuery",(req,res)=>{
  var qrcode= req.body.qrcode || null ;
  var userid = req.body.userid;
  var subCode = req.body.subCode;
  var collectionName = req.body.collectionName;
   
  res.render("addsub",{qrcode});

     
});

// Setting up the port for listening requests
app.listen(PORT, () => console.log("Server at 3000"));