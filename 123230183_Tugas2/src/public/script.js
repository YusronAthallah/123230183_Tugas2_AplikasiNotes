const API_URL = 'http://localhost:3000/api/notes';

const noteForm = document.getElementById('note-form');
const noteIdInput = document.getElementById('note-id');
const judulInput = document.getElementById('judul');
const isiInput = document.getElementById('isi');
const notesList = document.getElementById('notes-list');
const formTitle = document.getElementById('form-title');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');
const noteCount = document.getElementById('note-count');

let isEditing = false;
let notes = [];

document.addEventListener('DOMContentLoaded', fetchNotes);

async function fetchNotes() {
    try {
        const res = await fetch(API_URL);
        notes = await res.json();
        renderNotes();
    } catch (err) {
        notesList.innerHTML = '<p class="empty-msg">Gagal terhubung ke server.</p>';
    }
}

function renderNotes() {
    noteCount.textContent = '(' + notes.length + ')';

    if (notes.length === 0) {
        notesList.innerHTML = '<p class="empty-msg">Belum ada catatan.</p>';
        return;
    }

    notesList.innerHTML = '';
    notes.forEach(function (note) {
        var date = new Date(note.tanggal_dibuat);
        var formatted = date.toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        var div = document.createElement('div');
        div.className = 'note-item';
        div.innerHTML =
            '<h3>' + escapeHTML(note.judul) + '</h3>' +
            '<div class="note-date">' + formatted + '</div>' +
            '<div class="note-body">' + escapeHTML(note.isi) + '</div>' +
            '<div class="note-actions">' +
                '<button class="btn btn-edit" onclick="editNote(' + note.id + ')">Edit</button>' +
                '<button class="btn btn-delete" onclick="deleteNote(' + note.id + ')">Hapus</button>' +
            '</div>';
        notesList.appendChild(div);
    });
}

function escapeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
}

noteForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    var data = { judul: judulInput.value, isi: isiInput.value };

    try {
        if (isEditing) {
            await fetch(API_URL + '/' + noteIdInput.value, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }
        resetForm();
        fetchNotes();
    } catch (err) {
        alert('Gagal menyimpan catatan.');
    }
});

function editNote(id) {
    var note = notes.find(function (n) { return n.id === id; });
    if (!note) return;

    noteIdInput.value = note.id;
    judulInput.value = note.judul;
    isiInput.value = note.isi;

    isEditing = true;
    formTitle.textContent = 'Edit Catatan';
    saveBtn.textContent = 'Perbarui';
    cancelBtn.style.display = 'inline-block';
    document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' });
    judulInput.focus();
}

async function deleteNote(id) {
    if (!confirm('Hapus catatan ini?')) return;
    try {
        await fetch(API_URL + '/' + id, { method: 'DELETE' });
        fetchNotes();
    } catch (err) {
        alert('Gagal menghapus catatan.');
    }
}

cancelBtn.addEventListener('click', resetForm);

function resetForm() {
    isEditing = false;
    noteForm.reset();
    noteIdInput.value = '';
    formTitle.textContent = 'Tambah Catatan';
    saveBtn.textContent = 'Simpan';
    cancelBtn.style.display = 'none';
}