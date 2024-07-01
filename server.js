const express = require("express");
const ip = require("ip");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const OPENWEATHERMAP_API_KEY = "73c5abf033e0d9c90c11cfbd5fb3b94c"; 

app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name || "Visitor";

  //Visitor's IP address
  const visitorIp = req.ip || ip.address();

  try {
    // Fetch the location of the visitor using ipwhois.app
    const locationResponse = await axios.get(`https://ipwhois.app/json/${visitorIp}`);
    

    // Extrat city and country
    const { city, country } = locationResponse.data;

    // Fetch weather using OpenWeatherMap
    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`);
  

    // Get temperature information
    const temperature = weatherResponse.data.main.temp;

    // Construct greetings message using the format given
    const greetings = `Hello, ${visitorName}!, the temperature is ${temperature}°C in ${city}, ${country}.`;

    const responseData = {
      client_ip: visitorIp,
      location: `${city},${country}`,
      greetings: greetings,
    };

    // Respond with the constructed data
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

const PORT = 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});








