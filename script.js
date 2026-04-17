// Scroll Reveal Animation
const revealElements = document.querySelectorAll('[data-reveal]');

const reveal = () => {
    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 50) {
            el.classList.add('active');
        }
    });
};

window.addEventListener('scroll', reveal);
// Initial check
reveal();

// Mouse Move Background Effect (Subtle)
document.addEventListener('mousemove', (e) => {
    const blobs = document.querySelectorAll('.blob');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    blobs.forEach((blob, index) => {
        const speed = (index + 1) * 20;
        blob.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
});

// Modal Logic
const modal = document.getElementById('demoModal');
const openBtn = document.getElementById('openDemo');
const closeBtn = document.querySelector('.close-modal');

openBtn.onclick = () => modal.style.display = 'flex';
closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (e) => {
    if (e.target == modal) modal.style.display = 'none';
}

// Form Submission
const form = document.querySelector('.contact-form');
form.onsubmit = (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const originalText = btn.innerText;
    
    btn.innerText = 'Yuborilmoqda...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerText = 'Xabar yuborildi! ✅';
        form.reset();
        setTimeout(() => {
            btn.innerText = originalText;
            btn.disabled = false;
        }, 3000);
    }, 1500);
};
