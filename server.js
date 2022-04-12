require('dotenv').config();
let mongoose = require('mongoose')
const express = require('express');
const cors = require('cors');
const app = express();
//console.log(process.env.SECRET_KEY)

// Basic Configuration
const port = process.env.PORT || 3000;
//console.log(process.env.PORT)---undefined;

app.use(cors());

let urlSchema = new mongoose.Schema({
  original: { type: String, required: true },
  short: Number
})
let Url = mongoose.model("url", urlSchema);
let bodyParser = require("body-parser");
//app.use(bodyParser.urlencoded({ extended: true }))


app.use('/public', express.static(`${process.cwd()}/public`));
//console.log("cwd()", process.cwd())
//console.log("__dirname", _dirname)
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

jsonObject = {};
app.post("/api/shorturl", bodyParser.urlencoded({ extended: false }), (req, res, next) => {

  jsonObject["original_url"] = req.body.url;
  let inputShort = 1;
  //find the bigest short_url number in database, if its  1/0? let new short_url =1, else short_url=shorturl++; if(!error)res.json(jsonObject),else 
  Url.findOne({})
    .sort({ short: "desc " })
    .exec((error, result) => {
      if (!error && result != undefined) {
        inputShort = result.short + 1;
      };
      if (!error) {
        url.findOneAndUpdate({ original: req.body.url }, { original: req.body.url, short: inputShort }, { new: true, upsert: true }, (error, savedUrl) => {
          if (!error) {
            jsonObject["short_url"] = savedUrl.short;
            res.json(jsonObject)
          }
        })
      }
    })
  jsonObject["short_url"] = short;
  // console.log(req.body)
  res.json(jsonObject)
})
/*app.get("/api/shorturl/:num", (req, res, next)=>{
  let num = req.params.num;
  jsonObject["orinal_url"] = 'https://freeCodeCamp.org';
  jsonObject["short_url"] = 1
res.json(jsonObject)
} )*/