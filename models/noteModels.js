const Note = require("../schema/Note"); // Import schema yang baru dibuat

// Mengambil semua data
const findAll = async () => {
  return await Note.findAll();
};

// Mengambil data berdasarkan ID
const findById = async (id) => {
  return await Note.findByPk(id);
};

// Membuat data baru
const create = async (data) => {
  return await Note.create(data);
};

// Mengupdate data berdasarkan ID
const updateById = async (id, data) => {
  // Lakukan update terlebih dahulu
  await Note.update(data, { where: { id: id } });
  // Kembalikan data terbaru setelah diupdate
  return await Note.findByPk(id);
};

// Menghapus data berdasarkan ID
const deleteById = async (id) => {
  const note = await Note.findByPk(id); // Cari datanya dulu untuk dikembalikan
  if (note) {
    await Note.destroy({ where: { id: id } }); // Hapus jika ada
  }
  return note;
};

// Export semua fungsi agar bisa dipakai di noteController.js
module.exports = {
  findAll,
  findById,
  create,
  updateById,
  deleteById,
};