const express = require("express");
const ip = require("ip");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/hello", (req, res) => {
  const visitorName = req.query.visitor_name || "Mark";

  // Simulate the client's IP address from New York or a default 127.0.0.1
  const visitorIp = ip.address() || "127.0.0.1";

  // Assuming the visitor is from New York according to the assignment
  const location = {
    city: "New York",
  };

  // Function to handle the location data
  function handleLocation(location) {
    const city = location.city || "unknown location";

    // Placeholder for actual weather data
    const weather = "11 degrees Celsius";

    res.json({
      client_ip: visitorIp,
      location: city,
      greeting: `Hello, ${visitorName}! The temperature is ${weather} in ${city}`,
    });
  }

  handleLocation(location);
});

// Assign port number
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
