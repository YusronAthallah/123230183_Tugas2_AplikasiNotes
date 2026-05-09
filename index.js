const express = require("express");
const sequelize = require("./config/database");
const noteRoutes = require("./routes/noteRoutes");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Notes Berjalan!");
});

// Panggil Schema agar tabel digenerate oleh Sequelize
require("./schema/Note"); 

// Daftarkan route notes
app.use("/api/notes", noteRoutes);

const port = process.env.PORT || 3000;

// Sync dan jalankan
sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(err => {
  console.error("Gagal sinkron database:", err);
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port} (DB Error)`);
  });
});