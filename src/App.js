import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

const API_URL = 'https://be-tugas3-tcc-183-385639935267.us-central1.run.app/api/notes';

function App() {
  const [notes, setNotes] = useState([]);
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(API_URL);
      setNotes(res.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { judul, isi };
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${editId}`, data);
      } else {
        await axios.post(API_URL, data);
      }
      resetForm();
      fetchNotes();
    } catch (error) {
      alert('Gagal menyimpan catatan.');
    }
  };

  const editNote = (note) => {
    setJudul(note.judul);
    setIsi(note.isi);
    setIsEditing(true);
    setEditId(note.id);
    document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' });
  };

  const deleteNote = async (id) => {
    if (!window.confirm('Hapus catatan ini?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchNotes();
    } catch (error) {
      alert('Gagal menghapus catatan.');
    }
  };

  const resetForm = () => {
    setJudul('');
    setIsi('');
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div className="container">
      <h1>Aplikasi Notes</h1>

      <div className="card form-card">
        <h2>{isEditing ? 'Edit Catatan' : 'Tambah Catatan'}</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="judul">Judul</label>
          <input
            type="text"
            id="judul"
            placeholder="Judul catatan..."
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required
          />
          <label htmlFor="isi">Isi</label>
          <textarea
            id="isi"
            rows="4"
            placeholder="Isi catatan..."
            value={isi}
            onChange={(e) => setIsi(e.target.value)}
            required
          ></textarea>
          <div className="form-buttons">
            <button type="submit" className="btn btn-save">
              {isEditing ? 'Perbarui' : 'Simpan'}
            </button>
            {isEditing && (
              <button type="button" className="btn btn-cancel" onClick={resetForm}>
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      <h2>
        Daftar Catatan <span className="count">({notes.length})</span>
      </h2>
      <div id="notes-list">
        {notes.length === 0 ? (
          <p className="empty-msg">Belum ada catatan.</p>
        ) : (
          notes.map((note) => (
            <div className="note-item" key={note.id}>
              <h3>{note.judul}</h3>
              <div className="note-date">
                {new Date(note.tanggal_dibuat).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <div className="note-body">{note.isi}</div>
              <div className="note-actions">
                <button className="btn btn-edit" onClick={() => editNote(note)}>
                  Edit
                </button>
                <button className="btn btn-delete" onClick={() => deleteNote(note.id)}>
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
