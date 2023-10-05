const express = require("express");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const https = require("https");
const csvtojson = require("csvtojson");
const cors = require('cors')

const app = express();
const port = 3000;

const getTemperature =
  "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m";

// app.use(express.static("public"));

app.use(cors());

app.get("/getcities", (req, res) => {
  try {
    const data = fs.readFileSync("./gb.csv", "utf8");

    csvtojson()
      .fromString(data)
      .then((jsonObj) => {
        console.log(jsonObj);
        res.json(jsonObj);
      });

    //res.send('test');
  } catch (err) {
    console.error(err);
    res.send(err);
  }
});

app.get("/getTemperature", (req, res) => {
  try {
    const lat = req.query.lat;
    const lng = req.query.lng;

    const parsedUrl =
      "https://api.open-meteo.com/v1/forecast?latitude=" +
      lat +
      "&longitude=" +
      lng +
      "&hourly=temperature_2m";

    let request = https.get(parsedUrl, (response) => {
      if (response.statusCode !== 200) {
        console.error(
          `Did not get an OK from the server. Code: ${response.statusCode}`
        );
        response.resume();
        return;
      }

      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      console.log(data);

      response.on("close", () => {
        console.log("Retrieved all data");
        //console.log(JSON.parse(data));
        res.send(data);
      });
    });

    // console.log(req.query.lat);
  } catch (err) {
    console.error(err);
    res.send(err);
  }
});

// app.get("/getTemperature", (req, res) => {
//   const cityName = req.query.cityName.toLowerCase();
//   const csvFile = "gb.csv";
//   //res.sendFile(path.join(__dirname, 'gb.csv'));

//   // Read and parse the CSV file
//   const csvData = [];
//   fs.createReadStream(csvFile)
//     .pipe(csv())
//     .on("data", (row) => {
//       const city = row.city.toLowerCase();
//       if (city === cityName) {
//         csvData.push(row);
//       }
//     })
//     .on("end", () => {
//       if (csvData.length > 0) {
//         const temperature = csvData[0].temperature;
//         res.send(`The current temperature in ${cityName} is ${temperature}°C.`);
//       } else {
//         res.status(404).send("City not found in the data file.");
//       }
//     });
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
