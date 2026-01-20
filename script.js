// Restore scroll position or jump to section
const savedScrollPosition = localStorage.getItem('menuScrollPosition');

// Check if returning from product page with saved scroll position
if (savedScrollPosition && !window.location.hash) {
    // Prevent default scroll restoration
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    document.documentElement.style.scrollBehavior = 'auto';

    const restoreScroll = () => {
        window.scrollTo(0, parseInt(savedScrollPosition, 10));

        // Clear the saved position
        localStorage.removeItem('menuScrollPosition');

        // Show page and re-enable smooth scroll
        document.documentElement.style.visibility = 'visible';
        document.documentElement.style.scrollBehavior = 'smooth';
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', restoreScroll);
    } else {
        restoreScroll();
    }
}
// Immediate scroll to section if hash present (from product page navigation)
else if (window.location.hash) {
    // Prevent default scroll restoration
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    document.documentElement.style.scrollBehavior = 'auto';

    // Execute scroll as soon as possible
    const scrollToSection = () => {
        const targetId = window.location.hash;
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const navHeight = 80;
            const targetPosition = targetElement.offsetTop - navHeight;
            window.scrollTo(0, targetPosition);
        }

        // Show page and re-enable smooth scroll
        document.documentElement.style.visibility = 'visible';
        document.documentElement.style.scrollBehavior = 'smooth';
    };

    // Try to scroll immediately when DOM is interactive
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scrollToSection);
    } else {
        scrollToSection();
    }
} else {
    // Ensure page is visible on normal load
    document.documentElement.style.visibility = 'visible';
}

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const floatingNav = document.querySelector('.floating-nav');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Navigation scroll effect
if (floatingNav) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class for backdrop blur effect
        if (currentScroll > 100) {
            floatingNav.classList.add('scrolled');
        } else {
            floatingNav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// Smooth scroll with offset for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }

        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const navHeight = 100; // Approximate nav height with margin
            const targetPosition = targetSection.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation highlighting on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a:not(.nav-cta)');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Products are now visible immediately without scroll animations

// FAQ Accordion functionality
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;
        const isActive = faqItem.classList.contains('active');

        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });

        // Open clicked item if it wasn't already active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});


// Add parallax effect to hero
window.addEventListener('scroll', () => {
    const heroBackground = document.querySelector('.hero-background');
    const scrolled = window.pageYOffset;

    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Hide scroll indicator after scrolling
window.addEventListener('scroll', () => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        if (window.pageYOffset > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'all';
        }
    }
});

// Add transition to scroll indicator
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.style.transition = 'opacity 0.3s ease';
}

// Product Page Navigation - Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductNavigation);
} else {
    initProductNavigation();
}

function initProductNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    console.log(`🔍 Found ${menuItems.length} menu items`);

    if (menuItems.length === 0) {
        console.error('❌ No menu items found! Check if .menu-item class exists in HTML');
        return;
    }

    menuItems.forEach((item, index) => {
        // Make sure the item is clickable
        item.style.cursor = 'pointer';

        // Add both click and touchstart for mobile compatibility
        const handleClick = (e) => {
            console.log(`✅ Menu item ${index} clicked!`, e.target);

            // Don't navigate if clicking directly on a link or button, or if inside one
            if (e.target.closest('a') || e.target.closest('button')) {
                console.log('⚠️ Click was on/inside a link or button, ignoring');
                return;
            }

            // Prevent default and stop propagation to ensure we handle this
            e.preventDefault();
            e.stopPropagation();

            // Get elements
            const h3 = item.querySelector('h3');
            const priceEl = item.querySelector('.price');
            const ingredientsEl = item.querySelector('.ingredients');
            const imageEl = item.querySelector('.item-image');

            console.log('📝 Elements found:', { h3: h3?.textContent, price: priceEl?.textContent, ingredients: ingredientsEl?.textContent });

            // Validate required elements exist
            if (!h3 || !priceEl || !ingredientsEl) {
                console.error('❌ Missing required elements in menu item', { h3, priceEl, ingredientsEl });
                return;
            }

            // Extract product data from the menu item
            const productData = {
                name: h3.textContent.trim(),
                price: priceEl.textContent.trim(),
                description: ingredientsEl.textContent.trim(),
                image: imageEl?.src || null
            };

            console.log('🚀 Navigating to product page with data:', productData);

            // Store product data and scroll position in localStorage
            try {
                localStorage.setItem('currentProduct', JSON.stringify(productData));
                localStorage.setItem('menuScrollPosition', window.pageYOffset.toString());

                // Navigate to product page
                console.log('🔄 Redirecting to product.html...');
                window.location.href = 'product.html';
            } catch (error) {
                console.error('❌ Error storing product data:', error);
            }
        };

        item.addEventListener('click', handleClick, true); // Use capture phase

        console.log(`✅ Attached click handlers to menu item ${index}`);
    });
}


console.log('🍕 Pizzeria Il Sorriso - Modern website loaded successfully!');