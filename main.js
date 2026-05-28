// Load Layout dynamically (header & footer) with local storage cache to prevent layout shifts/flickering
async function loadLayout() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    try {
        const [headerRes, footerRes] = await Promise.all([
            fetch('/header.html'),
            fetch('/footer.html')
        ]);
        
        const headerHtml = await headerRes.text();
        const footerHtml = await footerRes.text();
        
        // Update placeholders
        document.getElementById('header-placeholder').innerHTML = headerHtml;
        document.getElementById('footer-placeholder').innerHTML = footerHtml;
        
        // Save to cache for instant load next time
        localStorage.setItem('header-html', headerHtml);
        localStorage.setItem('footer-html', footerHtml);
    } catch (err) {
        console.error('Error loading layout:', err);
    }
    
    // Set active link class
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        // Strip relative paths if present
        const href = link.getAttribute('href').split('/').pop();
        if (href === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Re-initialize dynamic header event listeners
    initializeLayoutEvents();
}

function initializeLayoutEvents() {
    // Language Toggle
    const langToggleSpans = document.querySelectorAll('.lang-toggle span');
    langToggleSpans.forEach(span => {
        span.addEventListener('click', (e) => {
            if(e.target.textContent.trim() === '/') return;
            langToggleSpans.forEach(s => s.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if(mobileBtn && navLinksContainer) {
        mobileBtn.addEventListener('click', () => {
            const isVisible = navLinksContainer.style.display === 'flex';
            if (isVisible) {
                navLinksContainer.style.display = 'none';
            } else {
                navLinksContainer.style.display = 'flex';
                navLinksContainer.style.flexDirection = 'column';
                navLinksContainer.style.position = 'absolute';
                navLinksContainer.style.top = '100%';
                navLinksContainer.style.left = '0';
                navLinksContainer.style.right = '0';
                navLinksContainer.style.backgroundColor = 'var(--primary-blue-hover)';
                navLinksContainer.style.padding = '1rem';
                navLinksContainer.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
            }
        });
    }

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                });
            }
            
            // Close mobile menu
            if(window.innerWidth <= 768 && navLinksContainer) {
                navLinksContainer.style.display = 'none';
            }
        });
    });
}

// Initial script execution on load
document.addEventListener('DOMContentLoaded', () => {
    // Load layouts
    loadLayout();

    // Accordion Functionality
    const accordions = document.querySelectorAll('.accordion-header');
    if(accordions.length > 0) {
        const firstItem = accordions[0].parentElement;
        const firstContent = firstItem.querySelector('.accordion-content');
        firstItem.classList.add('active');
        firstContent.style.maxHeight = firstContent.scrollHeight + "px";
    }

    accordions.forEach(acc => {
        acc.addEventListener('click', function() {
            const item = this.parentElement;
            const content = item.querySelector('.accordion-content');
            
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-content').style.maxHeight = null;
                }
            });
            
            if (item.classList.contains('active')) {
                item.classList.remove('active');
                content.style.maxHeight = null;
            } else {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // Intersection Observer for scroll-triggered animations
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(element => {
            element.classList.add('visible');
        });
    }
});
