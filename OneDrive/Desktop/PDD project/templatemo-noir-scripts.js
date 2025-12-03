// Fake News Detector - JavaScript Core
// Handles carousel, navigation, filtering, scroll spy, animations, and form behavior

/* ================================
        HERO CAROUSEL LOGIC
================================= */

const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
let currentSlide = 0;
let slideInterval;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    slides[index].classList.add('active');
    indicators[index].classList.add('active');

    currentSlide = index;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function startSlideShow() {
    slideInterval = setInterval(nextSlide, 4000);
}

function stopSlideShow() {
    clearInterval(slideInterval);
}

// Initialize carousel if slides exist
if (slides.length > 0) {
    startSlideShow();

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopSlideShow();
            showSlide(index);
            startSlideShow();
        });
    });

    const carousel = document.querySelector('.hero-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopSlideShow);
        carousel.addEventListener('mouseleave', startSlideShow);
    }
}

/* ================================
        MOBILE MENU
================================= */

const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
});

mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
    });
});

/* ================================
       NAVBAR SCROLL + ACTIVE LINK
================================= */

const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    const scrollY = window.pageYOffset;
    const navHeight = navbar.offsetHeight;

    // Navbar appearance on scroll
    if (scrollY > 100) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    // Scroll spy active linking
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - navHeight - 10;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });

    // Highlight HOME when at top
    if (scrollY < 100) {
        navLinks.forEach(link => link.classList.remove('active'));
        document.querySelector('.nav-link[href="#home"]').classList.add('active');
    }
}

window.addEventListener('scroll', updateActiveNav);
window.addEventListener('resize', updateActiveNav);
updateActiveNav();

/* ================================
        CATEGORY FILTER (Case Studies)
================================= */

const tabButtons = document.querySelectorAll('.tab-btn');
const collectionCards = document.querySelectorAll('.collection-card');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.dataset.category;

        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        collectionCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.animation = 'fadeInUp 0.6s ease forwards';
                }, 100);
            } else {
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

/* ================================
            SMOOTH SCROLL
================================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        const navHeight = navbar.offsetHeight;

        if (target) {
            const offsetTop = targetId === '#home' ? 0 : target.offsetTop - navHeight;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    });
});

/* ================================
        PARALLAX HERO TEXT
================================= */

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-content');
    if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

/* ================================
       CONTACT FORM — Fake News Report
================================= */

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simulated API send
        const submitBtn = contactForm.querySelector('.form-submit');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Analyzing...';
        submitBtn.style.opacity = '0.7';
        submitBtn.disabled = true;

        // Fake delay — replace with backend request
        setTimeout(() => {
            submitBtn.textContent = 'Report Submitted ✓';
            submitBtn.style.background = '#28a745';

            contactForm.reset();

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.style.opacity = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    });
}

/* ================================
        FORM INPUT EFFECT
================================= */

const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'translateY(-2px)';
    });
    input.addEventListener('blur', () => {
        input.parentElement.style.transform = '';
    });
});

/* ================================
       SCROLL ANIMATION OBSERVER
================================= */

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.featured-container, .contact-content')
    .forEach(el => observer.observe(el));
