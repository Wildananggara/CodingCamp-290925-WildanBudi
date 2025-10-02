// Ambil elemen-elemen DOM yang dibutuhkan
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const dateInput = document.getElementById('date-input');
const todoList = document.getElementById('todo-list');
const filterSelect = document.getElementById('filter-select');
const errorMessage = document.getElementById('error-message');

// Array untuk menyimpan data To-Do
let todos = [];

// Fungsi untuk Validasi Input Form
function validateInput(text, date) {
    if (text.trim() === "") {
        errorMessage.textContent = "Kolom kegiatan tidak boleh kosong!";
        return false;
    }
    if (date.trim() === "") {
        errorMessage.textContent = "Tanggal harus diisi!";
        return false;
    }
    // Cek apakah tanggal yang dimasukkan adalah tanggal di masa lalu
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Atur jam ke 00:00:00 untuk perbandingan yang akurat
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    // Perbandingan dilakukan hanya jika tanggal dipilih. Jika tanggal hari ini, dianggap valid.
    if (selectedDate < today) {
        errorMessage.textContent = "Tanggal tidak boleh di masa lalu!";
        return false;
    }

    errorMessage.textContent = ""; // Kosongkan pesan error jika valid
    return true;
}

// Fungsi untuk menambah To-Do baru
function addTodo(event) {
    event.preventDefault(); // Mencegah submit form bawaan

    const todoText = todoInput.value.trim();
    const todoDate = dateInput.value;

    if (validateInput(todoText, todoDate)) {
        const newTodo = {
            id: Date.now(), // ID unik menggunakan timestamp
            text: todoText,
            date: todoDate,
            completed: false
        };

        todos.push(newTodo);
        saveTodos();
        renderTodos();

        // Reset form
        todoInput.value = '';
        dateInput.value = '';
    }
}

// Fungsi untuk menghapus To-Do
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// Fungsi untuk mengubah status selesai To-Do
function toggleComplete(id) {
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex > -1) {
        todos[todoIndex].completed = !todos[todoIndex].completed;
        saveTodos();
        renderTodos();
    }
}

// Fungsi untuk menyimpan To-Do ke Local Storage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Fungsi untuk memuat To-Do dari Local Storage
function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
    }
}

// Fungsi untuk merender/menampilkan To-Do List
function renderTodos() {
    // Kosongkan list yang sudah ada
    todoList.innerHTML = '';

    const currentFilter = filterSelect.value;
    
    // Filter array todos berdasarkan pilihan filter
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'all') {
            return true;
        } else if (currentFilter === 'completed') {
            return todo.completed;
        } else if (currentFilter === 'pending') {
            return !todo.completed;
        }
    });

    // Urutkan berdasarkan tanggal (yang paling dekat tampil duluan)
    filteredTodos.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Buat elemen HTML untuk setiap To-Do
    filteredTodos.forEach(todo => {
        const listItem = document.createElement('li');
        listItem.classList.add('todo-item');
        if (todo.completed) {
            listItem.classList.add('completed');
        }

        listItem.setAttribute('data-id', todo.id);

        listItem.innerHTML = `
            <div class="todo-content">
                <span class="todo-text">${todo.text}</span>
                <span class="todo-date">Target: ${new Date(todo.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <button class="delete-button">Hapus</button>
        `;

        // Event listener untuk tombol Hapus
        const deleteBtn = listItem.querySelector('.delete-button');
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

        // Event listener untuk mengubah status selesai (klik di konten)
        const todoContent = listItem.querySelector('.todo-content');
        todoContent.addEventListener('click', () => toggleComplete(todo.id));

        todoList.appendChild(listItem);
    });
}

// --- Event Listeners ---
// 1. Tambah To-Do
todoForm.addEventListener('submit', addTodo);

// 2. Filter To-Do List
filterSelect.addEventListener('change', renderTodos);

// --- Inisialisasi ---
loadTodos(); // Muat data saat halaman dimuat
renderTodos(); // Tampilkan To-Do List