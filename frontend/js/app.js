// frontend/js/app.js - Main Frontend Logic

// --- Auth Toggle ---
function toggleAuth(showRegister) {
    document.getElementById('loginForm').classList.toggle('d-none', showRegister);
    document.getElementById('registerForm').classList.toggle('d-none', !showRegister);
}


// --- AJAX Requests ---

// Login
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('email', document.getElementById('loginEmail').value);
        formData.append('password', document.getElementById('loginPass').value);

        const res = await fetch('../backend/auth.php?action=login', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();

        if (res.ok) {
            window.location.href = 'dashboard.html';
        } else {
            alert(data.error || 'Xatolik yuz berdi');
        }
    };
}

// Check Auth
async function checkAuth() {
    const res = await fetch('../backend/auth.php?action=check');
    if (!res.ok) {
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'index.html';
        }
    } else {
        const data = await res.json();
        const userDisplay = document.getElementById('userName');
        if (userDisplay) userDisplay.innerText = data.user.username;
    }
}

// Logout
async function logout() {
    await fetch('../backend/auth.php?action=logout');
    window.location.href = 'index.html';
}

// Load Posts (Read)
async function loadPosts() {
    const res = await fetch('../api/posts.php');
    const posts = await res.json();
    const list = document.getElementById('postsList');
    if (!list) return;

    list.innerHTML = posts.map(post => `
        <div class="col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-sm overflow-hidden">
                ${post.image_url ? `<img src="../${post.image_url}" class="card-img-top" style="height: 200px; object-fit: cover;">` : ''}
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text text-muted">${post.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-primary">@${post.username}</small>
                        <button class="btn btn-sm btn-outline-danger" onclick="deletePost(${post.id})">O'chirish</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    const count = document.getElementById('postCount');
    if (count) count.innerText = posts.length;
}

// Create Post
if (document.getElementById('addPostForm')) {
    document.getElementById('addPostForm').onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', document.getElementById('postTitle').value);
        formData.append('description', document.getElementById('postDesc').value);
        const img = document.getElementById('postImage').files[0];
        if (img) formData.append('image', img);

        const res = await fetch('../api/posts.php', {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            // Close modal using Bootstrap API
            const modal = bootstrap.Modal.getInstance(document.getElementById('addPostModal'));
            modal.hide();
            document.getElementById('addPostForm').reset();
            loadPosts();
        } else {
            const data = await res.json();
            alert(data.error || 'Post yaratib bo\'lmadi');
        }
    };
}

// Delete Post
async function deletePost(id) {
    if (!confirm('Haqiqatan ham ushbu postni o\'chirmoqchimisiz?')) return;

    const res = await fetch('../api/posts.php', {
        method: 'DELETE',
        body: `id=${id}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    if (res.ok) {
        loadPosts();
    } else {
        alert('O\'chirib bo\'lmadi');
    }
}
