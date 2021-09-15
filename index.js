// Calling the packages that we need

const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const bp = require("body-parser");
const qr = require("qrcode");

// Using the ejs (Embedded JavaScript templates) as our template engine
// and call the body parser  - middleware for parsing bodies from URL
//                           - middleware for parsing json objects
app.set('views', path.join(__dirname,'views'));
app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.use(express.static('./views'));
// Simple routing to the index.ejs file
app.get("/", (req, res) => {
    const fcode = 'Code';

    qr.toDataURL(fcode, (err,src)=>{
        if (err) res.send("Error occured");
        res.render("index" , {src});
    });
   
});

// Blank input
// Incase of blank in the index.ejs file, return error 
// Error  - Empty Data!
app.post("/generate", (req, res) => {
    const url = req.body.url;

    if (url.length === 0) 
    res.send("Empty Data!");
   
    qr.toDataURL(url, (err, src) => {
        if (err) res.send("Error occured");

     
        res.render("index", { src });
    });
});

// Setting up the port for listening requests
app.listen(port, () => console.log("Server at 5000"));