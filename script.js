// ===========================================
// Portfolio Script
// ===========================================

document.addEventListener('DOMContentLoaded', () => {

	// --- Dynamic Year ---
	const yearSpan = document.getElementById('current-year');
	if (yearSpan) {
		yearSpan.textContent = new Date().getFullYear();
	}

	// --- Mobile Menu Toggle ---
	const menuToggle = document.querySelector('.menu-toggle');
	const navLinks = document.querySelector('.nav-links');
	const navOverlay = document.querySelector('.nav-overlay');

	if (menuToggle && navLinks) {
		menuToggle.addEventListener('click', () => {
			menuToggle.classList.toggle('open');
			navLinks.classList.toggle('open');
			if (navOverlay) {
				navOverlay.classList.toggle('visible');
			}
			document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
		});

		// Close menu when clicking a link
		navLinks.querySelectorAll('a').forEach(link => {
			link.addEventListener('click', () => {
				menuToggle.classList.remove('open');
				navLinks.classList.remove('open');
				if (navOverlay) {
					navOverlay.classList.remove('visible');
				}
				document.body.style.overflow = '';
			});
		});

		// Close menu when clicking overlay
		if (navOverlay) {
			navOverlay.addEventListener('click', () => {
				menuToggle.classList.remove('open');
				navLinks.classList.remove('open');
				navOverlay.classList.remove('visible');
				document.body.style.overflow = '';
			});
		}
	}

	// --- Scroll Reveal (Intersection Observer) ---
	const revealElements = document.querySelectorAll('.fade-in-up');

	if (revealElements.length > 0 && 'IntersectionObserver' in window) {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible');
					observer.unobserve(entry.target);
				}
			});
		}, {
			threshold: 0.1,
			rootMargin: '0px 0px -40px 0px'
		});

		revealElements.forEach(el => observer.observe(el));
	}

	// --- Card Slideshow (Game Gallery hover cycling) ---
	const galleryCards = document.querySelectorAll('.card-gallery');

	galleryCards.forEach(card => {
		const slides = card.querySelectorAll('.card-slideshow .slide');
		if (slides.length <= 1) return;

		let currentIndex = 0;
		let intervalId = null;

		card.addEventListener('mouseenter', () => {
			intervalId = setInterval(() => {
				slides[currentIndex].classList.remove('active');
				currentIndex = (currentIndex + 1) % slides.length;
				slides[currentIndex].classList.add('active');
			}, 1800);
		});

		card.addEventListener('mouseleave', () => {
			clearInterval(intervalId);
			intervalId = null;
			// Reset to first slide
			slides[currentIndex].classList.remove('active');
			currentIndex = 0;
			slides[0].classList.add('active');
		});
	});
});
