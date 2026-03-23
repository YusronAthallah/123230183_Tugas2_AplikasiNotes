require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));


app.post('/api/notes', async (req, res) => {
    try {
        const { judul, isi } = req.body;
        if (!judul || !isi) {
            return res.status(400).json({ error: 'Judul dan isi catatan tidak boleh kosong' });
        }
        const query = 'INSERT INTO notes (judul, isi, tanggal_dibuat) VALUES (?, ?, NOW())';
        const [result] = await db.query(query, [judul, isi]);
        res.status(201).json({ message: 'Catatan berhasil ditambahkan', id: result.insertId });
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ error: 'Terjadi kesalahan pada server saat menambah catatan' });
    }
});

app.get('/api/notes', async (req, res) => {
    try {
        const query = 'SELECT * FROM notes ORDER BY tanggal_dibuat DESC';
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Terjadi kesalahan pada server saat mengambil daftar catatan' });
    }
});

app.get('/api/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM notes WHERE id = ?';
        const [rows] = await db.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Catatan tidak ditemukan' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error fetching note by id:', error);
        res.status(500).json({ error: 'Terjadi kesalahan pada server saat mengambil catatan' });
    }
});

app.put('/api/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { judul, isi } = req.body;
        if (!judul || !isi) {
            return res.status(400).json({ error: 'Judul dan isi catatan tidak boleh kosong' });
        }
        const query = 'UPDATE notes SET judul = ?, isi = ? WHERE id = ?';
        const [result] = await db.query(query, [judul, isi, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Catatan tidak ditemukan' });
        }
        res.status(200).json({ message: 'Catatan berhasil diperbarui' });
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Terjadi kesalahan pada server saat memperbarui catatan' });
    }
});

app.delete('/api/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM notes WHERE id = ?';
        const [result] = await db.query(query, [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Catatan tidak ditemukan' });
        }
        res.status(200).json({ message: 'Catatan berhasil dihapus' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Terjadi kesalahan pada server saat menghapus catatan' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});