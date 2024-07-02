require("dotenv").config()
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const OPENWEATHERMAP_API_KEY =
  process.env.OPENWEATHERMAP_API_KEY ; 

app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name || "Visitor";

  // Attempt to get the client's IP address, considering Vercel's proxy setup
  const visitorIp =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  

  try {
    // Fetch the location of the visitor using ipwhois.app
    const locationResponse = await axios.get(
      `https://ipwhois.app/json/${visitorIp}`
    );


    // Extract city and country
    const { city, country } = locationResponse.data;

    if (!city || !country) {
      throw new Error("City or country not found in location response");
    }

    // Fetch weather using OpenWeatherMap
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`
    );
   

    // Get temperature information
    const temperature = weatherResponse.data.main.temp;

    // Construct greetings message using the given format
    const greetings = `Hello, ${visitorName}! The temperature is ${temperature}°C in ${city}, ${country}.`;

    const responseData = {
      client_ip: visitorIp,
      location: `${city},${country}`,
      greetings: greetings,
    };

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
