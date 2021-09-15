// Calling the packages that we need

const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const bp = require("body-parser");
const qr = require("qrcode");


app.set('views', path.join(__dirname,'views'));
app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.use(express.static('./views'));

app.get("/", (req, res) => {
    
    res.render("index");
   
});


app.post("/generate", (req, res) => {

    res.render("index");
});

// Setting up the port for listening requests
app.listen(port, () => console.log("Server at 5000"));