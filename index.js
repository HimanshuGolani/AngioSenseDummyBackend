import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";

const app = express();

// Enable CORS for your Express server
app.use(cors());

// Serve on port 8000
const PORT = 8000;

// Create HTTP server to attach WebSocket Server to
const server = app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

// Create WebSocket Server
const wss = new WebSocketServer({ server });

// Function to generate random sensor data with realistic pulse rate range
const generateSensorData = () => {
  const baseTemperature = 37; // Adjust for chosen measurement method (oral, rectal, etc.)
  const temperatureVariation = Math.random() * 0.5 - 0.25; // Random variation between -0.25 and 0.25 degrees

  // Generate pulse rate within the typical resting range (60-100 bpm)
  const pulseRate = Math.floor(Math.random() * (100 - 60 + 1) + 60);

  return {
    beatsPerMinute: pulseRate.toFixed(2),
    boiImpedance: (Math.random() * (1200 - 200) + 200).toFixed(2), // Wider impedance range
    SpO2: (Math.random() * (100 - 95) + 95).toFixed(2),
    bodyTemperature: (baseTemperature + temperatureVariation).toFixed(2),
    timestamp: Math.floor(Date.now() / 1000).toString(),
  };
};

// Handle WebSocket connections
wss.on("connection", (ws) => {
  console.log("New client connected");

  // Send random sensor data every 2 seconds
  const intervalId = setInterval(() => {
    const sensorData = generateSensorData();
    ws.send(JSON.stringify(sensorData));
  }, 2000);

  // Handle disconnection
  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(intervalId); // Stop sending data when client disconnects
  });

  // Handle errors
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

// Serve a test endpoint to verify the server is running
app.get("/", (req, res) => {
  res.send("WebSocket server is running.");
});
