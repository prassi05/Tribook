// ==========================================
// TRIBOOK - COMPLETE JAVASCRIPT FILE
// Multi-Service Booking System
// ==========================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ==========================================
// INITIALIZE APPLICATION
// ==========================================
function initializeApp() {
    checkLoginStatus();
    setupNavigation();
    setupBackToTop();
    setupAnimations();
    
    // Initialize page-specific features
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'login.html' || currentPage === '') {
        setupLoginPage();
    } else if (currentPage === 'booking.html') {
        setupBookingPage();
    } else if (currentPage === 'confirm.html') {
        setupConfirmPage();
    } else if (currentPage === 'contact.html') {
        setupContactPage();
    }
}

// ==========================================
// LOGIN PAGE FUNCTIONALITY
// ==========================================
function setupLoginPage() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (username.trim() === '' || email.trim() === '' || password.trim() === '') {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    
    // Show loading
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.add('active');
    
    // Simulate login process
    setTimeout(() => {
        // Store user data
        const userData = {
            username: username,
            email: email,
            isLoggedIn: true,
            loginTime: new Date().toISOString()
        };
        
        try {
            localStorage.setItem('tribookUser', JSON.stringify(userData));
            
            // Redirect to home page
            window.location.href = 'index.html';
        } catch (error) {
            loadingOverlay.classList.remove('active');
            showAlert('Login failed. Please try again.', 'error');
        }
    }, 2000);
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

function showRegisterMessage() {
    showAlert('Registration feature coming soon! Please use demo login.', 'info');
}

// ==========================================
// AUTHENTICATION CHECK
// ==========================================
function checkLoginStatus() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Skip check for login page
    if (currentPage === 'login.html' || currentPage === '') {
        return;
    }
    
    try {
        const userData = JSON.parse(localStorage.getItem('tribookUser'));
        
        if (!userData || !userData.isLoggedIn) {
            // Redirect to login if not logged in
            window.location.href = 'login.html';
        }
    } catch (error) {
        window.location.href = 'login.html';
    }
}

function logout() {
    try {
        localStorage.removeItem('tribookUser');
        localStorage.removeItem('tribookBooking');
        window.location.href = 'login.html';
    } catch (error) {
        showAlert('Logout failed. Please try again.', 'error');
    }
}

// ==========================================
// NAVIGATION FUNCTIONALITY
// ==========================================
function setupNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
}

// ==========================================
// BACK TO TOP BUTTON
// ==========================================
function setupBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ==========================================
// BOOKING PAGE FUNCTIONALITY
// ==========================================
function setupBookingPage() {
    setupCategoryTabs();
    setupSearch();
    setupBookingModal();
}

function setupCategoryTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            btn.classList.add('active');
            document.getElementById(`${category}Content`).classList.add('active');
        });
    });
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const filterSelect = document.getElementById('filterSelect');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterBookings);
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', filterBookings);
    }
}

function filterBookings() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const activeTab = document.querySelector('.tab-content.active');
    const cards = activeTab.querySelectorAll('.booking-card');
    
    cards.forEach(card => {
        const title = card.getAttribute('data-item').toLowerCase();
        
        if (title.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ==========================================
// BOOKING MODAL
// ==========================================
let currentBookingData = {};

function openBookingModal(category, item, price) {
    const modal = document.getElementById('bookingModal');
    
    // Store booking data
    currentBookingData = {
        category: category,
        item: item,
        price: parseInt(price)
    };
    
    // Fill form with data
    document.getElementById('bookingCategory').value = category.charAt(0).toUpperCase() + category.slice(1);
    document.getElementById('bookingItem').value = item;
    document.getElementById('pricePerTicket').textContent = `₹${price}`;
    document.getElementById('totalPrice').textContent = `₹${price}`;
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').setAttribute('min', today);
    
    modal.classList.add('active');
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.remove('active');
    document.getElementById('bookingForm').reset();
}

function setupBookingModal() {
    const bookingForm = document.getElementById('bookingForm');
    const ticketQuantity = document.getElementById('ticketQuantity');
    
    if (ticketQuantity) {
        ticketQuantity.addEventListener('input', updateTotal);
    }
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeBookingModal();
            }
        });
    }
}

function updateTotal() {
    const quantity = parseInt(document.getElementById('ticketQuantity').value) || 1;
    const pricePerTicket = currentBookingData.price;
    const total = quantity * pricePerTicket;
    
    document.getElementById('totalQuantity').textContent = quantity;
    document.getElementById('totalPrice').textContent = `₹${total}`;
}

function handleBookingSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('emailAddress').value,
        phone: document.getElementById('phoneNumber').value,
        category: document.getElementById('bookingCategory').value,
        item: document.getElementById('bookingItem').value,
        date: document.getElementById('bookingDate').value,
        time: document.getElementById('bookingTime').value,
        quantity: document.getElementById('ticketQuantity').value,
        paymentMethod: document.getElementById('paymentMethod').value,
        totalAmount: document.getElementById('totalPrice').textContent,
        bookingId: 'TB-' + Date.now()
    };
    
    // Validate all fields
    if (!formData.fullName || !formData.email || !formData.phone || !formData.date || 
        !formData.time || !formData.paymentMethod) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }
    
    // Store booking data
    try {
        localStorage.setItem('tribookBooking', JSON.stringify(formData));
        
        // Show success message and redirect
        showBookingSuccess(formData);
    } catch (error) {
        showAlert('Booking failed. Please try again.', 'error');
    }
}

function showBookingSuccess(bookingData) {
    // Close modal
    closeBookingModal();
    
    // Show success popup with confetti
    const popup = document.createElement('div');
    popup.className = 'success-popup';
    popup.innerHTML = `
        <div class="success-popup-content">
            <div class="success-animation">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Booking Successful!</h2>
            <p>Your booking has been confirmed</p>
            <p class="booking-id">Booking ID: ${bookingData.bookingId}</p>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Trigger confetti
    createConfetti();
    
    // Redirect to confirmation page after 3 seconds
    setTimeout(() => {
        window.location.href = 'confirm.html';
    }, 3000);
}

// ==========================================
// CONFIRMATION PAGE
// ==========================================
function setupConfirmPage() {
    try {
        const bookingData = JSON.parse(localStorage.getItem('tribookBooking'));
        
        if (!bookingData) {
            window.location.href = 'booking.html';
            return;
        }
        
        // Display booking details
        document.getElementById('bookingId').textContent = bookingData.bookingId;
        document.getElementById('customerName').textContent = bookingData.fullName;
        document.getElementById('bookingCategory').textContent = bookingData.category;
        document.getElementById('bookingItem').textContent = bookingData.item;
        document.getElementById('bookingDate').textContent = formatDate(bookingData.date);
        document.getElementById('bookingTime').textContent = bookingData.time;
        document.getElementById('ticketCount').textContent = bookingData.quantity;
        document.getElementById('paymentMethod').textContent = bookingData.paymentMethod;
        document.getElementById('totalAmount').textContent = bookingData.totalAmount;
        
        // Start confetti animation
        startConfettiAnimation();
        
    } catch (error) {
        showAlert('Error loading booking details', 'error');
        setTimeout(() => {
            window.location.href = 'booking.html';
        }, 2000);
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function downloadTicket() {
    showAlert('Ticket download feature coming soon!', 'info');
}

function shareOnWhatsApp() {
    const bookingData = JSON.parse(localStorage.getItem('tribookBooking'));
    const message = `I just booked ${bookingData.item} on TriBook! Booking ID: ${bookingData.bookingId}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
}

function shareOnFacebook() {
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + window.location.href, '_blank');
}

function shareOnTwitter() {
    const bookingData = JSON.parse(localStorage.getItem('tribookBooking'));
    const message = `Just booked ${bookingData.item} on TriBook!`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, '_blank');
}

// ==========================================
// CONFETTI ANIMATION
// ==========================================
function startConfettiAnimation() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confetti = [];
    const confettiCount = 100;
    const colors = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    
    for (let i = 0; i < confettiCount; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * confettiCount,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.floor(Math.random() * 10) - 10,
            tiltAngleIncremental: Math.random() * 0.07 + 0.05,
            tiltAngle: 0
        });
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confetti.forEach((c, i) => {
            ctx.beginPath();
            ctx.lineWidth = c.r / 2;
            ctx.strokeStyle = c.color;
            ctx.moveTo(c.x + c.tilt + c.r, c.y);
            ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r);
            ctx.stroke();
            
            c.tiltAngle += c.tiltAngleIncremental;
            c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
            c.x += Math.sin(c.d);
            c.tilt = Math.sin(c.tiltAngle - i / 3) * 15;
            
            if (c.y > canvas.height) {
                confetti[i] = {
                    x: Math.random() * canvas.width,
                    y: -10,
                    r: c.r,
                    d: c.d,
                    color: c.color,
                    tilt: c.tilt,
                    tiltAngleIncremental: c.tiltAngleIncremental,
                    tiltAngle: c.tiltAngle
                };
            }
        });
        
        requestAnimationFrame(draw);
    }
    
    draw();
}

function createConfetti() {
    const colors = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}%;
            opacity: 1;
            transform: rotate(${Math.random() * 360}deg);
            animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
            z-index: 99999;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
}

// Add confetti animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            top: 100vh;
            transform: translateX(${Math.random() * 200 - 100}px) rotate(${Math.random() * 720}deg);
            opacity: 0;
        }
    }
    
    .success-popup {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        animation: fadeIn 0.3s ease;
    }
    
    .success-popup-content {
        background: white;
        padding: 3rem;
        border-radius: 12px;
        text-align: center;
        animation: zoomIn 0.5s ease;
    }
    
    .success-animation {
        width: 100px;
        height: 100px;
        margin: 0 auto 1.5rem;
        background: linear-gradient(135deg, #10B981, #059669);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: scaleUp 0.6s ease;
    }
    
    .success-animation i {
        font-size: 4rem;
        color: white;
    }
    
    .success-popup h2 {
        font-size: 2rem;
        color: #1F2937;
        margin-bottom: 0.5rem;
    }
    
    .booking-id {
        color: #2563EB;
        font-weight: 600;
        margin-top: 1rem;
    }
`;
document.head.appendChild(style);

// ==========================================
// CONTACT PAGE
// ==========================================
function setupContactPage() {
    const contactForm = document.getElementById('contactForm');
    const messageInput = document.getElementById('contactMessage');
    const charCount = document.getElementById('charCount');
    
    if (messageInput && charCount) {
        messageInput.addEventListener('input', () => {
            const count = messageInput.value.length;
            charCount.textContent = count;
            
            if (count > 500) {
                charCount.style.color = '#EF4444';
            } else {
                charCount.style.color = '#6B7280';
            }
        });
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value,
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value
    };
    
    // Show success message
    showAlert('Thank you for contacting us! We\'ll get back to you soon.', 'success');
    
    // Reset form
    document.getElementById('contactForm').reset();
    document.getElementById('charCount').textContent = '0';
}

// ==========================================
// FAQ FUNCTIONALITY
// ==========================================
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked FAQ if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements with animation
    document.querySelectorAll('[data-aos]').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// ==========================================
// ALERT SYSTEM
// ==========================================
function showAlert(message, type = 'info') {
    const alertBox = document.createElement('div');
    alertBox.className = `alert alert-${type}`;
    alertBox.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(alertBox);
    
    setTimeout(() => {
        alertBox.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => alertBox.remove(), 500);
    }, 3000);
}

// Add alert styles dynamically
const alertStyle = document.createElement('style');
alertStyle.textContent = `
    .alert {
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 99999;
        animation: slideInRight 0.5s ease;
        min-width: 300px;
    }
    
    .alert-success {
        background: #10B981;
        color: white;
    }
    
    .alert-error {
        background: #EF4444;
        color: white;
    }
    
    .alert-info {
        background: #2563EB;
        color: white;
    }
    
    .alert-content {
        display: flex;
        align-items: center;
        gap: 0.8rem;
    }
    
    .alert-content i {
        font-size: 1.5rem;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(alertStyle);

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}