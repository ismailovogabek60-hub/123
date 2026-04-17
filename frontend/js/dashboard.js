// js/dashboard.js - Dashboard logic (CRUD, Chat, Stats)

// --- Auth Check ---
const currentUser = DB.getSession();
if (!currentUser) {
    window.location.href = 'index.html';
}

document.getElementById('userName').innerText = currentUser.username;
document.getElementById('userRole').innerText = currentUser.role;

// --- Load Stats ---
function loadStats() {
    document.getElementById('postCount').innerText = DB.getPosts().length;
    document.getElementById('userCount').innerText = DB.getUsers().length;
    document.getElementById('msgCount').innerText = DB.getMessages().length;
}

// --- Load Posts (READ) ---
function loadPosts() {
    const posts = DB.getPosts();
    const list = document.getElementById('postsList');

    if (posts.length === 0) {
        list.innerHTML = '<div class="empty-state"><span>📭</span><p>Hozircha postlar yo\'q. Birinchi postingizni yarating!</p></div>';
        loadStats();
        return;
    }

    list.innerHTML = posts.map(post => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="post-card h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge bg-primary bg-opacity-25 text-primary">@${post.username}</span>
                        <small class="text-secondary">${new Date(post.created_at).toLocaleDateString('uz')}</small>
                    </div>
                    <h5 class="mt-2">${post.title}</h5>
                    <p class="text-secondary small">${post.description}</p>
                    <div class="d-flex gap-2 mt-3">
                        <button class="btn btn-sm btn-outline-warning" onclick="openEdit(${post.id})">✏️ Tahrirlash</button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deletePost(${post.id})">🗑️ O'chirish</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    loadStats();
}

// --- Create Post ---
document.getElementById('addPostForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('postTitle').value;
    const desc = document.getElementById('postDesc').value;

    DB.addPost(currentUser.id, currentUser.username, title, desc);

    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('addPostModal')).hide();
    document.getElementById('addPostForm').reset();
    loadPosts();
});

// --- Delete Post ---
function deletePost(id) {
    if (!confirm('Haqiqatan ham o\'chirmoqchimisiz?')) return;
    DB.deletePost(id);
    loadPosts();
}

// --- Edit Post ---
function openEdit(id) {
    const post = DB.getPosts().find(p => p.id === id);
    if (!post) return;
    document.getElementById('editPostId').value = post.id;
    document.getElementById('editTitle').value = post.title;
    document.getElementById('editDesc').value = post.description;
    new bootstrap.Modal(document.getElementById('editPostModal')).show();
}

document.getElementById('editPostForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(document.getElementById('editPostId').value);
    const title = document.getElementById('editTitle').value;
    const desc = document.getElementById('editDesc').value;

    DB.updatePost(id, title, desc);

    bootstrap.Modal.getInstance(document.getElementById('editPostModal')).hide();
    loadPosts();
});

// --- Chat ---
function loadChat() {
    const msgs = DB.getMessages();
    const box = document.getElementById('chatBox');
    if (msgs.length === 0) {
        box.innerHTML = '<p class="text-secondary text-center small py-4">Hozircha xabarlar yo\'q</p>';
        return;
    }
    box.innerHTML = msgs.map(m => `
        <div class="chat-msg">
            <strong>${m.username}</strong>
            <span class="text-secondary small ms-2">${new Date(m.created_at).toLocaleTimeString('uz')}</span>
            <p class="mb-0 mt-1">${m.message}</p>
        </div>
    `).join('');
    box.scrollTop = box.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;
    DB.addMessage(currentUser.id, currentUser.username, msg);
    input.value = '';
    loadChat();
    loadStats();
}

document.getElementById('chatInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// --- Logout ---
function logout() {
    DB.clearSession();
    window.location.href = 'index.html';
}

// --- Init ---
loadPosts();
loadChat();
