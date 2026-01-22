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

    // Set page title
    document.title = `${productData.name} - Pizzeria Il Sorriso`;

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
        { name: 'Margherita', price: '€6,00', description: 'Pomodoro, fiordilatte e basilico', image: 'Margherita.webp' },
        { name: 'Crudo di Parma 24 Mesi', price: '€8,00', description: 'Pomodoro, mozzarella, Prosciutto crudo di Parma 24 mesi', image: 'Crudo-24-Mesi.webp' },
        { name: 'Napoli', price: '€7,50', description: 'Pomodoro, fiordilatte, Acciughe e origano', image: 'Napoli.webp' },
        { name: 'Salsiccia', price: '€7,50', description: 'Pomodoro, fiordilatte e salsiccia', image: 'Salsiccia.webp' },
        { name: 'Cotto', price: '€7,50', description: 'Pomodoro, fiordilatte e prosciutto cotto', image: 'Cotto.webp' },
        { name: 'Patatine', price: '€7,50', description: 'Pomodoro, mozzarella, patatine fritte', image: 'Patatina.webp' },
        { name: 'Diavola', price: '€7,50', description: 'Pomodoro, fiordilatte e salame piccante', image: 'Diavola.webp' },
        { name: '4 Stagioni', price: '€9,00', description: 'Pomodoro, fiordilatte, olive nere, cotto, carciofi, funghi champignon', image: '4-Stagioni.webp' },
        { name: 'Capricciosa', price: '€9,50', description: 'Pomodoro, fiordilatte, cotto, olive, carciofi, funghi e wrustel', image: 'Capricciosa.webp' },
        { name: '4 Formaggi', price: '€9,00', description: 'Pomodoro, mozzarella, brie, scamorza e gorgonzola', image: '4-Formaggi.webp' },
        { name: 'Patatine e Salsiccia', price: '€8,50', description: 'Pomodoro, Fiordilatte, salsiccia o wrustel e patatine', image: 'Patatine-e-Salsiccia.webp' },
        { name: 'Margherita Sbagliata', price: '€8,50', description: 'Pomodoro, fiordilatte, bufala, pepe e parmigiano, basilico e olio evo', image: 'Margherita-Sbagliata.webp' },
        { name: 'Verdure Grigliate', price: '€9,00', description: 'Pomodoro, fiordilatte, zucchine, melanzane e peperoni, tutte grigliate', image: 'Verdure-Grigliate.webp' },
        { name: 'Mimosa', price: '€9,00', description: 'Fiordilatte, panna, prosciutto cotto e mais', image: 'Mimosa.webp' },
        { name: 'Tartufata', price: '€10,00', description: 'Pomodoro, fiordilatte, pancetta, crema di tartufo e scaglie di grana', image: 'Tartufata.webp' },
        { name: 'Carbonara', price: '€10,00', description: 'Base margherita, pancetta, uovo, pepe, grana', image: 'Carbonara.webp' },
        { name: 'Alta Marea', price: '€10,00', description: 'Pomodoro, fiordilatte, gamberetti, cipolla di tropea, pomodorini e brie', image: 'Alta-Marea.webp' },
        { name: 'Terribile', price: '€10,00', description: 'Pomodoro, fiordilatte, salame piccante, salsiccia, cotto, pancetta e olio piccante', image: 'Terribile.webp' },
        { name: 'Fiocco', price: '€9,50', description: 'Fiordilatte, panna, prosciutto cotto e crocchè di patate', image: 'Fiocco.webp' },
        { name: 'Parma', price: '€10,00', description: 'Pomodoro, fiordilatte, crudo di parma 24 mesi, rucola e scaglie di grana', image: 'Parma.webp' },
        { name: 'Salsiccia e Friarielli', price: '€9,00', description: 'Fiordilatte, Salsiccia e friarielli', image: 'Salsiccia-e-Friarielli.webp' },
        { name: 'Rustica', price: '€9,50', description: 'Base margherita, salsiccia, cipolla rossa di Tropea e peperoni', image: 'Rustica.webp' },
        { name: 'La Porchetta', price: '€11,00', description: 'Fiordilatte, porchetta affumicata, patate al forno e scamorza', image: 'La-Porchetta.webp' },
        { name: 'Bufala', price: '€8,50', description: 'Pomodoro, mozzarella di bufala dop, basilico e olio evo', image: 'Bufala.webp' },
        { name: 'Caprese', price: '€9,50', description: 'Pomodoro, bufala dop e pomodorini', image: 'Caprese.webp' },
        { name: 'Vesuvio', price: '€10,00', description: 'Pizza alta, pomodoro, bufala dop, parmigiano, basilico e olio', image: 'Vesuvio.webp' },
        { name: 'Sorriso', price: '€11,00', description: 'Pomodoro, bufala dop, scamorza, salsiccia, pomodorini, origano', image: 'Sorriso.webp' },
        { name: 'Fresca Pazza', price: '€11,00', description: 'Fiordilatte, in uscita: crudo di parma, bocconcini di bufala, rucola, pomodorini, scaglie di grana e olio evo', image: 'Fresca-Pazza.webp' },
        { name: 'Caprese 2.0', price: '€11,00', description: 'Pomodoro, in uscita: bocconcini di bufala dop, pomodorini gialli e rossi, scaglie di grana e basilico', image: 'Caprese-2.0.webp' },
        { name: 'LA TRICOLORE', price: '€12,50', description: 'Pomodoro, fiordilatte, crudo 24 mesi, fonduta di parmigiano e burrata al centro', image: 'Tricolore.webp' },
        { name: 'MORTAZZA', price: '€11,00', description: 'Fiordilatte, in uscita: mortella igp, stracciatella di bufala e pistacchio', image: 'Mortazza.webp' },
        { name: 'STRACCIATELLA', price: '€11,00', description: 'Pomodoro, fiordilatte, crudo di parma 24 mesi, stracciatella di bufala, pomodorini gialli', image: 'Stracciatella.webp' },
        { name: 'CRAVATTA', price: '€11,00', description: 'Primo lato farcito come la diavola, secondo lato salsiccia e friarielli, in mezzo un mini calzone con ricotta e pepe ricoperto da prosciutto crudo 24 mesi', image: 'Cravatta.webp' },
        { name: 'NELLO', price: '€11,00', description: 'Fiordilatte, salsiccia, friarielli, bufala, crocchè di patate', image: 'Nello.webp' },
        { name: 'VULCANO', price: '€11,00', description: 'Un calzone gigante farcito con fiordilatte, ricotta, salame piccante e patatine fritte, sul coperchio: pomodoro e parmigiano', image: 'Vulcano.webp' },
        { name: 'LA CRISPY', price: '€11,00', description: 'Fiordilatte, Cheddar, salsiccia, patatine fritte, salsa crispy e bacon sbriciolato', image: 'La-Crispy.webp' }
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
