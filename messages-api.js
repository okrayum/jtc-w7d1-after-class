// To use this app you can use "npm run start1"
const express = require("express");
const app = express();

const PORT = 3000;

// Middleware
app.use(express.json());

// Too Many Requests Middleware
let messageCount = 0;
const messageLimiter = (req, res, next) => {
  if (messageCount >= 5) return res.status(429).json({ message: "Too many requests" });
  
  messageCount++;
  next();
}

// API POST endpoint
app.post("/messages", messageLimiter, (req, res) => {
  const { text } = req.body;
  console.log("Text", text);

  if (!text || text === "") return res.status(400).json({ message: "No message sent" });

  return res.status(200).json({ message: "Message received loud and clear" });
});


// Starts the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});