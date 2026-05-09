const noteModel = require("../models/noteModels");

// 1. GET ALL NOTES (Mengambil semua catatan)
const getAllNotes = async (req, res) => {
  try {
    const allDataNotes = await noteModel.findAll();
    res.status(200).json({
      message: "Notes retrieved successfully",
      data: allDataNotes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving notes",
      error: error.message,
    });
  }
};

// 2. GET NOTE BY ID (Mengambil satu catatan spesifik)
const getNoteById = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await noteModel.findById(id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json({
      message: "Note retrieved successfully",
      data: note,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving note",
      error: error.message,
    });
  }
};

// 3. CREATE NOTE (Membuat catatan baru)
const createNote = async (req, res) => {
  const { judul, isi } = req.body; // Menggunakan 'judul' dan 'isi' sesuai UI kamu
  try {
    const newNote = await noteModel.create({ judul, isi });
    res.status(201).json({
      message: "Note created successfully",
      data: newNote,
    });
  } catch (error) {
    res.status(400).json({
      message: "Validation error",
      error: error.message,
    });
  }
};

// 4. UPDATE NOTE (Mengedit catatan)
const updateNote = async (req, res) => {
  const { id } = req.params;
  const { judul, isi } = req.body;
  try {
    const note = await noteModel.findById(id);
    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    const updatedNote = await noteModel.updateById(id, { judul, isi });
    res.status(200).json({
      message: "Note updated successfully",
      data: updatedNote,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating note",
      error: error.message,
    });
  }
};

// 5. DELETE NOTE (Menghapus catatan)
const deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await noteModel.findById(id);
    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    const deletedNote = await noteModel.deleteById(id);
    res.status(200).json({
      message: "Note deleted successfully",
      data: deletedNote,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting note",
      error: error.message,
    });
  }
};

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};