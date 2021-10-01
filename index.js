// Calling the packages that we need

const express = require("express");
const app = express();
const PORT =  process.env.PORT || 3000;
const bp = require("body-parser");
const qr = require("qrcode");
const { render } = require("ejs");
  
app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

// Simple routing to the index.ejs file
app.get("/", (req, res) => {
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



// Blank input
// Incase of blank in the index.ejs file, return error 
// Error  - Empty Data!

app.get("/qrcg",(req,res)=>{
    
    res.setHeader("Access-Control-Allow-Origin: *");
    const url = req.query.url;
    console.log(url +'This Console');

    
   
    qr.toDataURL(url, (err, src) => {
        if (err) res.send("Error occured");

        res.json({src});
       
      
    });


    
});
app.post("/search", (req, res) => {
    const url = req.body.url;
    console.log(url +'This Console');

    if (url.length === 0) 
    res.send("Empty Data!");
   
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

// Setting up the port for listening requests
app.listen(PORT, () => console.log("Server at 3000"));