/*!
 * Bowery Creative Agency
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== Header Scroll Effect =====
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // ===== Mobile Menu Toggle =====
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // ===== Animated Statistics =====
    const stats = document.querySelectorAll('.stat-number');
    
    function animateStats() {
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const step = target / duration * 10; // Update every 10ms
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                stat.textContent = Math.floor(current);
                
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(timer);
                }
            }, 10);
        });
    }
    
    // Start animation when stats section is in view
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
    
    // ===== Work Filters =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to current button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            workItems.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = 'block';
                } else {
                    const categories = item.getAttribute('data-category').split(' ');
                    if (categories.includes(filterValue)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        });
    });
    
    // ===== Sphere oS Tabs =====
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to current button
            this.classList.add('active');
            
            // Show the corresponding tab pane
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // ===== Testimonial Slider =====
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    let currentSlide = 0;
    
    // Hide all slides except the first one
    if (testimonialSlides.length > 1) {
        for (let i = 1; i < testimonialSlides.length; i++) {
            testimonialSlides[i].style.display = 'none';
        }
    }
    
    function showSlide(n) {
        // Hide current slide
        testimonialSlides[currentSlide].style.display = 'none';
        
        // Update current slide index
        currentSlide = (n + testimonialSlides.length) % testimonialSlides.length;
        
        // Show new current slide
        testimonialSlides[currentSlide].style.display = 'grid';
    }
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
        nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
    }
    
    // Auto advance testimonials every 8 seconds
    if (testimonialSlides.length > 1) {
        setInterval(() => {
            showSlide(currentSlide + 1);
        }, 8000);
    }
    
    // ===== Smooth Scrolling =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: targetPosition - headerOffset,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== Chatbot Functionality =====
    const chatbotButton = document.getElementById('chatbotButton');
    const chatbotContainer = document.getElementById('chatbotContainer');
    const closeChatbot = document.getElementById('closeChatbot');
    const chatbotInput = document.getElementById('chatbotInput');
    const sendChatMessage = document.getElementById('sendChatMessage');
    const chatbotMessages = document.getElementById('chatbotMessages');
    
    // Toggle chatbot visibility
    if (chatbotButton && chatbotContainer) {
        chatbotButton.addEventListener('click', function() {
            chatbotContainer.classList.toggle('active');
        });
    }
    
    // Close chatbot
    if (closeChatbot) {
        closeChatbot.addEventListener('click', function() {
            chatbotContainer.classList.remove('active');
        });
    }
    
    // Send message function
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message !== '') {
            // Add user message
            const userMessageElement = document.createElement('div');
            userMessageElement.className = 'message user-message';
            userMessageElement.innerHTML = `<p>${message}</p>`;
            chatbotMessages.appendChild(userMessageElement);
            
            // Clear input
            chatbotInput.value = '';
            
            // Scroll to bottom
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            
            // Simulate bot response (would be replaced with actual AI response)
            setTimeout(() => {
                const botResponses = [
                    "Thanks for your message! One of our team members will get back to you shortly.",
                    "I'd be happy to help with that. Would you like to schedule a consultation?",
                    "Great question! Our Sphere oS offers AI-driven solutions for the aesthetics industry.",
                    "Would you like to learn more about our services or see some case studies?"
                ];
                
                const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
                
                const botMessageElement = document.createElement('div');
                botMessageElement.className = 'message bot-message';
                botMessageElement.innerHTML = `<p>${randomResponse}</p>`;
                chatbotMessages.appendChild(botMessageElement);
                
                // Scroll to bottom
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }, 1000);
        }
    }
    
    // Send message when button is clicked
    if (sendChatMessage) {
        sendChatMessage.addEventListener('click', sendMessage);
    }
    
    // Send message when Enter key is pressed
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // ===== Form Validation =====
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            let valid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    valid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Email validation
            const emailField = document.getElementById('email');
            if (emailField && emailField.value.trim()) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value.trim())) {
                    valid = false;
                    emailField.classList.add('error');
                }
            }
            
            if (valid) {
                // Normally would submit the form, for demo purposes we'll show a success message
                const formGroups = contactForm.querySelectorAll('.form-group');
                formGroups.forEach(group => {
                    group.style.display = 'none';
                });
                
                const submitButton = contactForm.querySelector('button[type="submit"]');
                submitButton.style.display = 'none';
                
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <h3>Message Sent!</h3>
                    <p>Thank you for reaching out. One of our team members will contact you shortly.</p>
                `;
                
                contactForm.appendChild(successMessage);
            }
        });
    }
    
    // ===== Newsletter Signup =====
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                // Hide form elements
                const formElements = newsletterForm.querySelectorAll('input, button');
                formElements.forEach(el => {
                    el.style.display = 'none';
                });
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <p>Thank you for subscribing to our newsletter!</p>
                `;
                
                newsletterForm.appendChild(successMessage);
            } else {
                emailInput.classList.add('error');
            }
        });
    }
    
    // ===== Intersection Observer for Animations =====
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements.length > 0) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        fadeElements.forEach(el => {
            fadeObserver.observe(el);
        });
    }
    
    // ===== Video Background Management =====
    const heroVideo = document.getElementById('heroVideo');
    
    // Handle video loading and playback
    if (heroVideo) {
        // Fallback for browsers that don't support autoplay
        heroVideo.addEventListener('canplay', function() {
            if (heroVideo.paused) {
                heroVideo.play().catch(e => {
                    console.log('Autoplay was prevented. This is normal on some browsers.');
                    // Add a fallback poster image
                    heroVideo.parentNode.style.backgroundImage = 'url("img/hero-fallback.jpg")';
                    heroVideo.parentNode.style.backgroundSize = 'cover';
                    heroVideo.parentNode.style.backgroundPosition = 'center';
                });
            }
        });
        
        // Pause video when not in viewport to improve performance
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heroVideo.play().catch(e => {
                        console.log('Autoplay was prevented.');
                    });
                } else {
                    heroVideo.pause();
                }
            });
        }, { threshold: 0.1 });
        
        videoObserver.observe(heroVideo);
    }
    
    // ===== Lazy Loading Images =====
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if (lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        }, { threshold: 0.1, rootMargin: '200px' });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ===== Dynamic Copyright Year =====
    const copyrightYear = document.querySelector('.copyright p');
    
    if (copyrightYear) {
        const currentYear = new Date().getFullYear();
        copyrightYear.innerHTML = copyrightYear.innerHTML.replace('2025', currentYear);
    }
    
    // ===== Parallax Effect =====
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        
        // Apply parallax effect to elements with 'parallax' class
        document.querySelectorAll('.parallax').forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            element.style.transform = `translateY(${scrollPosition * speed}px)`;
        });
    });
    
    // ===== Scroll to Top Button =====
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when button is clicked
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ===== Page Loading Animation =====
    window.addEventListener('load', function() {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            loader.classList.add('fade-out');
            
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
        
        // Reveal page elements with animations
        document.querySelectorAll('.reveal').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('revealed');
            }, 200 * index);
        });
    });
    
    // ===== Responsive Video Embeds =====
    document.querySelectorAll('iframe').forEach(iframe => {
        if (iframe.getAttribute('src') && 
            (iframe.getAttribute('src').includes('youtube') || 
             iframe.getAttribute('src').includes('vimeo'))) {
            
            const wrapper = document.createElement('div');
            wrapper.className = 'video-wrapper';
            
            iframe.parentNode.insertBefore(wrapper, iframe);
            wrapper.appendChild(iframe);
        }
    });
    
    // ===== Custom Cursor Effect =====
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    document.querySelectorAll('a, button, .interactive').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('expanded');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('expanded');
        });
    });
