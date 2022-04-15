require("dotenv").config();
let mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();
mongoose.connect(process.env.SECRET_KEY, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//console.log(process.env.SECRET_KEY)
// Basic Configuration
const port = process.env.PORT || 3000;
//console.log(process.env.PORT)---undefined;

//TEST MONGODB CONNECTION---
const db = process.env.SECRET_KEY;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));
//---TEST MONGODB CONNECTION

app.use(cors());

let urlSchema = new mongoose.Schema({
  original_url: { type: String, required: true },
  short_url: Number,
});
let Url = mongoose.model("url", urlSchema);
let bodyParser = require("body-parser");
//app.use(bodyParser.urlencoded({ extended: true }))

app.use("/public", express.static(`${process.cwd()}/public`));
//console.log("cwd()", process.cwd())
//console.log("__dirname", _dirname)
app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

let jsonObject = {};
app.post(
  "/api/shorturl",
  bodyParser.urlencoded({ extended: false }),
  (req, res) => {
    let inputUrl = req.body.url;
    let urlRegex = new RegExp(
      /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
    );
    if (!inputUrl.match(urlRegex)) {
      console.log("invalid url");
      return res.json({ error: "Invalid URL" });
    }
    jsonObject["original_url"] = inputUrl;
    let inputShort = 1;

    async function doWork() {
      let dataFound = {};
      console.log("befor await");
      try {
        //  await Url.findOne({ original_url: inputUrl }, (error, data) => {
        //   if (error) {
        //     console.log(error);
        //   } else {
        //     dataFound = data;
        //     console.log("dataFound", dataFound);
        //   }
        // });

        const dataExist = await Url.findOne({ original_url: inputUrl });

        console.log("result----", dataExist);

        //exec((error, result) => {
        //   if (dataExist === null) {
        //     const existingJsonObject = await Url.findOne({}).sort({
        //       short_url: "desc",
        //     });
        //     console.log(
        //       "This is the biggest short number Object----",
        //       existingJsonObject
        //     );

        //   console.log("short + 1");
        //   inputShort = existingJsonObject === null ? 1 : existingJsonObject.short_url + 1;
        // }
        if (dataExist !== null) {
          console.log(
            "dataFound exist and going to print it",
            dataExist.original_url,
            dataExist.short_url
          );
          res.json({
            original_url: dataExist.original_url,
            short_url: dataExist.short_url,
          });
          console.log("existed url printed", jsonObject);
        } else {
          const existingJsonObject = await Url.findOne({}).sort({
            short_url: "desc",
          });
          console.log(
            "This is the biggest short number Object----",
            existingJsonObject
          );

        console.log("short + 1");
        inputShort = existingJsonObject === null ? 1 : existingJsonObject.short_url + 1;
         const newJsonObject= await Url.findOneAndUpdate(
            { original_url: inputUrl },
            { original_url: inputUrl, short_url: inputShort },
            { new: true, upsert: true },
            // (error, savedUrl) => {
            //   console.log("I am going to creat a new url");
            //   if (!error) {
            //     jsonObject["short_url"] = savedUrl.short_url;
            //     console.log("short", jsonObject);
            //     res.json(jsonObject);
            //   }
            // }
            );
            console.log("I am going to creat a new url");
              jsonObject["short_url"] = newJsonObject.short_url;
              res.json(jsonObject);
           
        }
      } catch (error) {
        console.error("error", error);
      }
    }

    doWork();
  }
);
app.get("/api/shorturl/:num", (req, res) => {
  let num = req.params.num;
  Url.findOne({ short_url: num }, (error, result) => {
    if (!error && result !== null) {
      res.redirect(result.original_url);
      console.log("url redirected");
    } else {
      res.json("URL not found");
    }
  });
});
