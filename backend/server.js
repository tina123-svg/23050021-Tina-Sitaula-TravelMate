const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Server } = require("socket.io");
const connectDB = require("./src/config/db");
const app = express();
const http = require("http");
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);
app.set("trust proxy", 1);

// Socket.io connection
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});


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
app.use("/api/notifications", require("./src/routes/notificationRoutes"));
app.use('/uploads', express.static('uploads'));






// Connect DB and start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});