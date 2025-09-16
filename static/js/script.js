// Dark mode functionality
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    
    const toggle = document.getElementById('darkModeToggle');
    toggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    
    // Save preference
    localStorage.setItem('darkMode', isDark);
}

// Initialize dark mode
function initializeDarkMode() {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
        const toggle = document.getElementById('darkModeToggle');
        if (toggle) {
            toggle.textContent = '☀️ Light Mode';
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dark mode
    initializeDarkMode();
    
    // Add event listener to dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // Add smooth scrolling for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation to cards on home page
    const cards = document.querySelectorAll('.qr-type-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
    });
    
    // Force remove any default list styling
    const navbarUl = document.querySelector('.page-navbar ul');
    if (navbarUl) {
        navbarUl.style.listStyleType = 'none';
        navbarUl.style.listStyle = 'none';
        
        const listItems = navbarUl.querySelectorAll('li');
        listItems.forEach(li => {
            li.style.listStyleType = 'none';
            li.style.listStyle = 'none';
            li.style.margin = '0';
            li.style.padding = '0';
        });
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    .fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
        transform: translateY(30px);
    }
    
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .page-navbar ul {
        list-style: none !important;
        list-style-type: none !important;
    }
    
    .page-navbar li {
        list-style: none !important;
        list-style-type: none !important;
    }
    
    .page-navbar li::before {
        display: none !important;
        content: none !important;
    }
`;
document.head.appendChild(style);