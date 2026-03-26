// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Import your app
import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});