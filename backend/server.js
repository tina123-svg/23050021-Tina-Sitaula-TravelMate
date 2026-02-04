const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./src/config/db");
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));
app.use("/api/agency", require("./src/routes/agencyRoutes"));
app.use("/api/agency", require("./src/routes/bookingRoutes"));
app.use("/api/agency", require("./src/routes/profileRoutes"));
app.use("/api", require("./src/routes/travelerRoutes"));
app.use('/api/traveler/bookings', require('./src/routes/travelerBookingRoutes'));
app.use('/api/traveler', require('./src/routes/travelerProfileRoutes'));
app.use("/api/agency", require("./src/routes/agencyReviewRoutes"));
app.use('/api/payment', require('./src/routes/paymentRoutes'));
app.use("/api/wishlist", require("./src/routes/wishlistRoutes"));

app.use('/uploads', express.static('uploads'));






// Connect DB and start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});