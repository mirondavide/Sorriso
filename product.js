// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

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

// Load product data from localStorage
document.addEventListener('DOMContentLoaded', () => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);

    const productData = JSON.parse(localStorage.getItem('currentProduct'));

    if (!productData) {
        // If no product data, redirect to home
        window.location.href = 'index.html';
        return;
    }

    // Set product information
    document.getElementById('product-name').textContent = productData.name;
    document.getElementById('product-price').textContent = productData.price;
    document.getElementById('product-description').textContent = productData.description || 'Deliziosa pizza preparata con ingredienti freschi e di qualità.';

    // Handle image(s)
    const productImageContainer = document.getElementById('product-image-container');
    const heroSection = document.querySelector('.product-hero-section');
    const images = productData.images || (productData.image ? [productData.image] : []);

    if (images.length > 1) {
        // Multiple images - create swap container
        productImageContainer.innerHTML = `
            <div class="product-image-swap-container">
                <img src="${images[0]}" alt="${productData.name}" class="product-detail-image primary">
                <img src="${images[1]}" alt="${productData.name} - Variante" class="product-detail-image secondary">
            </div>
        `;
    } else if (images.length === 1) {
        // Single image
        productImageContainer.innerHTML = `
            <img src="${images[0]}" alt="${productData.name}" class="product-detail-image">
        `;
    } else {
        // No image - hide the hero section
        heroSection.style.display = 'none';
    }

    // Update page title and meta tags for SEO/sharing
    document.title = `${productData.name} - Pizzeria Il Sorriso`;
    updateMetaTags(productData);

    // Add touch support for image swap on product page
    const imageSwapContainer = document.querySelector('.product-image-swap-container');
    if (imageSwapContainer) {
        imageSwapContainer.addEventListener('click', () => {
            // Only toggle on touch devices (no hover support)
            if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                imageSwapContainer.classList.toggle('tapped');
            }
        });
    }

    // Load recommendations
    loadRecommendations(productData.name);
});

// Function to load similar product recommendations
async function loadRecommendations(currentProductName) {
    const recommendationsContainer = document.getElementById('recommendations-container');

    // Sample products data (you can fetch this from index.html or a separate data file)
    const allProducts = [
        { name: 'Margherita', price: '€6,50', description: 'Pomodoro, mozzarella e basilico', image: 'Margherita.webp' },
        { name: 'Crudo di Parma 24 Mesi', price: '€8,50', description: 'Pomodoro, mozzarella, Prosciutto crudo di Parma 24 mesi', image: 'Crudo-24-Mesi.webp' },
        { name: 'Napoli', price: '€7,50', description: 'Pomodoro, mozzarella, acciughe, origano', image: 'Napoli.webp' },
        { name: 'Salsiccia', price: '€8,00', description: 'Pomodoro, mozzarella, salsiccia', image: 'Salsiccia.webp' },
        { name: 'Cotto', price: '€8,00', description: 'Pomodoro, mozzarella, cotto o würstel', image: 'Cotto.webp' },
        { name: 'Patatine', price: '€7,50', description: 'Pomodoro, mozzarella, patatine fritte', image: 'Patatina.webp' },
        { name: 'Diavola', price: '€8,00', description: 'Pomodoro, mozzarella, salame piccante', image: 'Diavola.webp' },
        { name: '4 Stagioni', price: '€9,00', description: 'Base margherita, cotto, funghi, olive, carciofi', image: '4-Stagioni.webp' },
        { name: 'Capricciosa', price: '€9,50', description: 'Base margherita, cotto, funghi, olive, carciofi, würstel', image: 'Capricciosa.webp' },
        { name: '4 Formaggi', price: '€9,50', description: 'Pomodoro, mozzarella, brie, scamorza e gorgonzola', image: '4-Formaggi.webp' },
        { name: 'Salsiccia o Würstel e Patatine', price: '€9,00', description: 'Pomodoro, mozzarella, salsiccia o würstel e patatine', image: 'Patatine-e-Salsiccia.webp' },
        { name: 'Margherita Sbagliata', price: '€8,50', description: 'Pomodoro, mozzarella, bufala, grana, pepe, basilico', image: 'Margherita-Sbagliata.webp' },
        { name: 'Verdure Grigliate', price: '€9,00', description: 'Pomodoro, mozzarella, zucchine, melanzane, peperoni (nostra produzione)', image: 'Verdure-Grigliate.webp' },
        { name: 'Mimosa', price: '€9,00', description: 'Base di panna, mozzarella, cotto e mais', image: 'Mimosa.webp' },
        { name: 'Tartufata', price: '€10,00', description: 'Base margherita, crema di tartufo, pancetta, grana', image: 'Tartufata.webp' },
        { name: 'Carbonara', price: '€10,00', description: 'Base margherita, pancetta, uovo, pepe, grana', image: 'Carbonara.webp' },
        { name: 'Alta Marea', price: '€10,00', description: 'Base margherita, cipolla rossa di Tropea, gamberetti, pomodorini, brie', image: 'Alta-Marea.webp' },
        { name: 'Terribile', price: '€10,00', description: 'Salame piccante, cotto, pancetta, salsiccia, olio piccante', image: 'Terribile.webp' },
        { name: 'Fiocco', price: '€10,00', description: 'Base di panna, mozzarella, cotto, crocchetta di patate a fette', image: 'Fiocco.webp' },
        { name: 'Parma', price: '€11,00', description: 'Base margherita, Prosciutto crudo 24 mesi, rucola, grana', image: 'Parma.webp' },
        { name: 'Salsiccia e Friarielli', price: '€9,50', description: 'Mozzarella, salsiccia e friarielli', image: 'Salsiccia-e-Friarielli.webp' },
        { name: 'Rustica', price: '€10,00', description: 'Base margherita, salsiccia, cipolla rossa di Tropea e peperoni', image: 'Rustica.webp' },
        { name: 'La Porchetta', price: '€11,00', description: 'Mozzarella, porchetta affumicata, patate al forno, scamorza', image: 'La-Porchetta.webp' },
        { name: 'Bufala', price: '€8,50', description: 'Pomodoro, bufala Dop, basilico', image: 'Bufala.webp' },
        { name: 'Caprese', price: '€9,50', description: 'Bufala, datterino rosso', image: 'Caprese.webp' },
        { name: 'Vesuvio', price: '€10,00', description: 'Impasto alto, pomodoro, bufala Dop, basilico, grana', image: 'Vesuvio.webp' },
        { name: 'Sorriso', price: '€12,00', description: 'Bufala, salsiccia, pomodorini, provola, origano', image: 'Sorriso.webp' },
        { name: 'Fresca Pazza', price: '€12,00', description: 'Base bianca, dopo cottura prosciutto crudo di Parma 24 mesi, bufala, rucola, pomodorini e grana', image: 'Fresca-Pazza.webp' },
        { name: 'Caprese 2.0', price: '€12,00', description: 'Base pomodoro, in uscita: bocconcini di bufala, pomodorini gialli e rossi, parmigiano a scaglie, olio e basilico', image: 'Caprese-2.0.webp' },
        { name: 'LA TRICOLORE', price: '€13,00', description: 'Base margherita, crudo di Parma, burrata e fonduta di parmigiano', image: 'Tricolore.webp' },
        { name: 'MORTAZZA', price: '€11,00', description: 'Mozzarella, mortadella, stracciatella di bufala, pistacchio', image: 'Mortazza.webp' },
        { name: 'STRACCIATELLA', price: '€12,00', description: 'Base margherita, prosciutto crudo di Parma 24 mesi, stracciatella di bufala e pomodorini gialli', image: 'Stracciatella.webp' },
        { name: 'CRAVATTA', price: '€11,00', description: 'Un lato salsiccia e friarielli, un lato salame piccante, al centro un mini calzone ripieno di ricotta, decorazione con prosciutto crudo di Parma 24 mesi, rucola e grana', image: 'Cravatta.webp' },
        { name: 'NELLO', price: '€12,00', description: 'Salsiccia, friarielli, bufala e crocchè di patate', image: 'Nello.webp' },
        { name: 'VULCANO', price: '€12,00', description: 'Un calzone a forma di pizza ripieno di patatine, ricotta, salame piccante, all\'esterno bufala in un lago di pomodoro', image: 'Vulcano.webp' },
        { name: 'LA CRISPY', price: '€12,00', description: 'Mozzarella, salsiccia, bacon, cheddar, patatine, salsa crispy', image: 'La-Crispy.webp' }
    ];

    // Filter out current product and shuffle
    const otherProducts = allProducts.filter(p => p.name !== currentProductName);
    const shuffled = otherProducts.sort(() => 0.5 - Math.random());
    const recommendations = shuffled.slice(0, 8); // Get 8 random products

    // Create cards
    recommendations.forEach(product => {
        const card = createRecommendationCard(product);
        recommendationsContainer.appendChild(card);
    });
}

// Update meta tags dynamically for SEO and social sharing
function updateMetaTags(productData) {
    const title = `${productData.name} - Pizzeria Il Sorriso`;
    const description = productData.description
        ? `${productData.name}: ${productData.description} - Pizzeria Il Sorriso, Medesano (PR). Chiama 0525 421782.`
        : `${productData.name} - Pizzeria Il Sorriso, Medesano (PR). Chiama 0525 421782.`;
    const images = productData.images || (productData.image ? [productData.image] : []);
    const imageUrl = images.length > 0
        ? `https://www.ilsorrisopizzeria.it/${images[0]}`
        : 'https://www.ilsorrisopizzeria.it/logoSorriso.webp';

    // Meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    // Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', imageUrl);

    // Twitter Card
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', title);
    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', description);
    const twImage = document.querySelector('meta[name="twitter:image"]');
    if (twImage) twImage.setAttribute('content', imageUrl);
}

// Function to create a recommendation card
function createRecommendationCard(product) {
    const card = document.createElement('div');
    card.className = 'recommendation-card';
    card.onclick = () => {
        localStorage.setItem('currentProduct', JSON.stringify(product));
        window.scrollTo(0, 0);
        window.location.href = 'product.html';
    };

    const hasImage = product.image && product.image !== 'null';

    card.innerHTML = `
        ${hasImage ? `<img src="${product.image}" alt="${product.name}" class="recommendation-card-image">` : ''}
        <div class="recommendation-card-content">
            <h3 class="recommendation-card-title">${product.name}</h3>
            <p class="recommendation-card-description">${product.description}</p>
            <p class="recommendation-card-price">${product.price}</p>
        </div>
    `;

    return card;
}

// Cookie Consent Banner
(function() {
    var consent = localStorage.getItem('cookie-consent');
    if (consent) return;

    var banner = document.getElementById('cookie-banner');
    if (!banner) return;
    banner.style.display = 'block';

    document.getElementById('cookie-accept').addEventListener('click', function() {
        localStorage.setItem('cookie-consent', 'accepted');
        banner.style.display = 'none';
        if (typeof loadGoogleAnalytics === 'function') {
            loadGoogleAnalytics();
        }
    });

    document.getElementById('cookie-reject').addEventListener('click', function() {
        localStorage.setItem('cookie-consent', 'rejected');
        banner.style.display = 'none';
    });
})();
