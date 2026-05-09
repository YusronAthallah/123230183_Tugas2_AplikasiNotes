// Import Package dan File
const express = require("express");
const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes");

// Inisialisasi Express dan Cors
const app = express();
const cors = require("cors");

app.use(cors()); // Izinkan semua origin (bisa disesuaikan untuk produksi)

// Izinkan origin frontend lokal yang umum dipakai saat development
// app.use(
//   cors({
//     origin: [
//       "http://localhost",
//       "http://localhost:5173",
//       "http://127.0.0.1:5500",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true, // Jika butuh kirim cookie/session
//   }),
// );

// Middleware untuk parsing JSON
app.use(express.json());

// Route dasar untuk testing
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Setting Routes
require("./schema/User"); // Untuk generate Tabel Users
app.use("/api/v1/users", userRoutes); // Untuk setting routes user

// Sync Database dan Jalankan Server
const port = process.env.PORT || 3000;
sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(port, () => console.log(`Server running on port ${port}`));
});
