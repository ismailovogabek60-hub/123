// js/db.js - localStorage Database (SQLite o'rniga)
// Barcha ma'lumotlar brauzerning localStorage'ida saqlanadi

const DB = {
    // Initialize database with default data
    init() {
        if (!localStorage.getItem('db_initialized')) {
            const defaultPass = 'password'; // Demo parol
            const users = [
                { id: 1, username: 'admin', email: 'admin@example.com', password: defaultPass, role: 'admin', created_at: new Date().toISOString() },
                { id: 2, username: 'teacher', email: 'teacher@example.com', password: defaultPass, role: 'teacher', created_at: new Date().toISOString() },
                { id: 3, username: 'student', email: 'student@example.com', password: defaultPass, role: 'student', created_at: new Date().toISOString() }
            ];
            const posts = [
                { id: 1, user_id: 1, username: 'admin', title: 'Birinchi Post', description: 'Bu loyihaning birinchi posti. CRUD operatsiyalarini sinab ko\'ring!', image_url: '', created_at: new Date().toISOString() },
                { id: 2, user_id: 2, username: 'teacher', title: 'JavaScript Asoslari', description: 'JavaScript zamonaviy web dasturlashning asosiy tili hisoblanadi.', image_url: '', created_at: new Date().toISOString() }
            ];
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('posts', JSON.stringify(posts));
            localStorage.setItem('messages', JSON.stringify([]));
            localStorage.setItem('next_user_id', '4');
            localStorage.setItem('next_post_id', '3');
            localStorage.setItem('db_initialized', 'true');
        }
    },

    // --- USERS ---
    getUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    },
    findUserByEmail(email) {
        return this.getUsers().find(u => u.email === email);
    },
    addUser(username, email, password, role = 'student') {
        const users = this.getUsers();
        if (users.find(u => u.email === email)) return { error: 'Bu email allaqachon ro\'yxatdan o\'tgan' };
        if (users.find(u => u.username === username)) return { error: 'Bu foydalanuvchi nomi band' };
        const id = parseInt(localStorage.getItem('next_user_id') || '1');
        const user = { id, username, email, password, role, created_at: new Date().toISOString() };
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('next_user_id', String(id + 1));
        return { success: true, user };
    },

    // --- POSTS (CRUD) ---
    getPosts() {
        return JSON.parse(localStorage.getItem('posts') || '[]').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },
    addPost(user_id, username, title, description, image_url = '') {
        const posts = this.getPosts();
        const id = parseInt(localStorage.getItem('next_post_id') || '1');
        posts.push({ id, user_id, username, title, description, image_url, created_at: new Date().toISOString() });
        localStorage.setItem('posts', JSON.stringify(posts));
        localStorage.setItem('next_post_id', String(id + 1));
        return { success: true };
    },
    updatePost(id, title, description) {
        const posts = this.getPosts();
        const i = posts.findIndex(p => p.id === id);
        if (i === -1) return { error: 'Post topilmadi' };
        posts[i].title = title;
        posts[i].description = description;
        localStorage.setItem('posts', JSON.stringify(posts));
        return { success: true };
    },
    deletePost(id) {
        let posts = this.getPosts();
        posts = posts.filter(p => p.id !== id);
        localStorage.setItem('posts', JSON.stringify(posts));
        return { success: true };
    },

    // --- SESSION ---
    setSession(user) {
        sessionStorage.setItem('current_user', JSON.stringify(user));
    },
    getSession() {
        const u = sessionStorage.getItem('current_user');
        return u ? JSON.parse(u) : null;
    },
    clearSession() {
        sessionStorage.removeItem('current_user');
    },

    // --- MESSAGES (Chat) ---
    getMessages() {
        return JSON.parse(localStorage.getItem('messages') || '[]');
    },
    addMessage(user_id, username, message) {
        const msgs = this.getMessages();
        msgs.push({ user_id, username, message, created_at: new Date().toISOString() });
        localStorage.setItem('messages', JSON.stringify(msgs));
    }
};

// Auto-initialize on load
DB.init();
