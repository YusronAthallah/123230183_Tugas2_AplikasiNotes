const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Mendefinisikan struktur tabel Notes
const Note = sequelize.define("Note", {
  judul: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  isi: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
}, {
  timestamps: true, // Otomatis membuat createdAt dan updatedAt
  tableName: 'notes' // Nama tabel di database
});

module.exports = Note;