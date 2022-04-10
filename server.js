require('dotenv').config();
let mongoose = require('mongoose')
const express = require('express');
const cors = require('cors');
const app = express();
//console.log(process.env.SECRET_KEY)

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

let urlSchema = new mongoose.Schema({
  original: {type: String, required: true},
  short:Number
})
let Url = mongoose.model("url", urlSchema);
let bodyParser = require("body-parser");
//app.use(bodyParser.urlencoded({ extended: true }))


app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

jsonObject={};
app.post("/api/shorturl", bodyParser.urlencoded({ extended: false}), (req, res, next)=>{
 console.log(req.body.url)
 
  /* jsonObject["original_url"] = req.body.url;
  jsonObject["short_url"] = 1*/
res.json(jsonObject)
} )
/*app.get("/api/shorturl/:num", (req, res, next)=>{
  let num = req.params.num;
  jsonObject["orinal_url"] = 'https://freeCodeCamp.org';
  jsonObject["short_url"] = 1
res.json(jsonObject)
} )*/