let currentMode = 'buy';
let currentProperty = null;
let currentImageIndex = 0;

const allProperties = [
    { id: 1, title: "Sandia Foothills Modern", location: "Albuquerque, NM", buyPrice: 1249000, rentPrice: 4500, type: "Villa", beds: 5, baths: 4.5, sqft: 4850,
      images: ["https://picsum.photos/id/1015/800/600","https://picsum.photos/id/1016/800/600","https://picsum.photos/id/1018/800/600"],
      desc: "Stunning modern villa with infinity pool and breathtaking Sandia Mountain views." },
    { id: 2, title: "Old Town Historic Loft", location: "Albuquerque, NM", buyPrice: 449000, rentPrice: 1850, type: "Loft", beds: 2, baths: 2, sqft: 1420,
      images: ["https://picsum.photos/id/160/800/600","https://picsum.photos/id/201/800/600"],
      desc: "Charming exposed brick loft in the heart of Old Town." },
    { id: 3, title: "Santa Fe Adobe Estate", location: "Santa Fe, NM", buyPrice: 975000, rentPrice: 3200, type: "House", beds: 4, baths: 3, sqft: 3350,
      images: ["https://picsum.photos/id/201/800/600","https://picsum.photos/id/316/800/600"],
      desc: "Classic Santa Fe adobe with kiva fireplace." },
    { id: 4, title: "Taos Mountain Sanctuary", location: "Taos, NM", buyPrice: 689000, rentPrice: 2400, type: "House", beds: 3, baths: 2.5, sqft: 2280,
      images: ["https://picsum.photos/id/251/800/600"], desc: "Peaceful 5-acre mountain retreat." },
    { id: 5, title: "Corrales Horse Property", location: "Corrales, NM", buyPrice: 799000, rentPrice: 2800, type: "House", beds: 4, baths: 3, sqft: 3100,
      images: ["https://picsum.photos/id/316/800/600"], desc: "Beautiful farmhouse on 2 acres." },
    { id: 6, title: "North Valley Family Home", location: "Albuquerque, NM", buyPrice: 429900, rentPrice: 1950, type: "House", beds: 3, baths: 3, sqft: 2214,
      images: ["https://picsum.photos/id/30/800/600"], desc: "Spacious family home with large backyard." },
    { id: 7, title: "Downtown Rio Rancho", location: "Rio Rancho, NM", buyPrice: 389000, rentPrice: 1750, type: "House", beds: 4, baths: 3, sqft: 2450,
      images: ["https://picsum.photos/id/411/800/600"], desc: "Perfect family home near excellent schools." },
    { id: 8, title: "Las Cruces Spanish Villa", location: "Las Cruces, NM", buyPrice: 549000, rentPrice: 2200, type: "Villa", beds: 4, baths: 3.5, sqft: 2950,
      images: ["https://picsum.photos/id/160/800/600"], desc: "Elegant Spanish-style villa near NMSU." }
];

let favorites = JSON.parse(localStorage.getItem('realEstateFavorites')) || [];

// ====================== BUY / RENT ======================
function setMode(mode) {
    currentMode = mode;
    document.getElementById('buy-btn').classList.toggle('bg-amber-400', mode === 'buy');
    document.getElementById('buy-btn').classList.toggle('text-zinc-950', mode === 'buy');
    document.getElementById('rent-btn').classList.toggle('bg-amber-400', mode === 'rent');
    document.getElementById('rent-btn').classList.toggle('text-zinc-950', mode === 'rent');

    document.getElementById('hero-title').textContent = mode === 'buy' ? "Find Your Dream Home in New Mexico" : "Find Your Perfect Rental in New Mexico";
    document.getElementById('section-title').textContent = mode === 'buy' ? "Homes For Sale" : "Homes For Rent";

    const slider = document.getElementById('price-range');
    if (mode === 'buy') {
        slider.min = 200000; slider.max = 2000000; slider.step = 25000; slider.value = 2000000;
    } else {
        slider.min = 800; slider.max = 6000; slider.step = 50; slider.value = 6000;
    }
    updatePriceLabel();
    renderProperties(allProperties);
}

function getPrice(p) {
    return currentMode === 'buy' ? p.buyPrice : p.rentPrice;
}

function updatePriceLabel() {
    const val = parseInt(document.getElementById('price-range').value);
    const display = document.getElementById('current-price-display');
    display.textContent = currentMode === 'buy' 
        ? (val >= 2000000 ? '$2M+' : '$' + Math.round(val/1000) + 'K') 
        : '$' + val + '/mo';
}

// ====================== RENDER LISTINGS ======================
function renderProperties(props) {
    const grid = document.getElementById('properties-grid');
    grid.innerHTML = '';

    props.forEach(p => {
        const isFav = favorites.includes(p.id);
        const card = document.createElement('div');
        card.className = "property-card bg-zinc-900 rounded-3xl overflow-hidden cursor-pointer";
        card.innerHTML = `
            <div class="relative">
                <img src="${p.images[0]}" class="w-full h-64 object-cover">
                <button onclick="event.stopImmediatePropagation(); toggleFavorite(${p.id});" 
                        class="absolute top-4 right-4 bg-black/70 hover:bg-black w-10 h-10 rounded-2xl flex items-center justify-center text-2xl transition">
                    ${isFav ? '❤️' : '♡'}
                </button>
            </div>
            <div class="p-6">
                <h3 class="font-semibold text-xl">${p.title}</h3>
                <p class="text-amber-400">${p.location}</p>
                <p class="text-3xl font-bold text-amber-400 mt-4">
                    ${currentMode === 'buy' ? '$' + (p.buyPrice/1000).toFixed(0) + 'K' : '$' + p.rentPrice + '/mo'}
                </p>
            </div>
        `;
        card.onclick = () => openPropertyModal(p);
        grid.appendChild(card);
    });
}

// ====================== MODAL ======================
function openPropertyModal(prop) {
    currentProperty = prop;
    currentImageIndex = 0;
    updateModalImage();

    const thumbs = document.getElementById('thumbnail-gallery');
    thumbs.innerHTML = '';
    prop.images.forEach((src, i) => {
        const img = document.createElement('img');
        img.src = src;
        img.className = `w-20 h-20 object-cover rounded-xl cursor-pointer border-2 ${i===0 ? 'border-amber-400' : 'border-transparent'}`;
        img.onclick = () => { currentImageIndex = i; updateModalImage(); };
        thumbs.appendChild(img);
    });

    document.getElementById('modal-title').textContent = prop.title;
    document.getElementById('modal-location').textContent = prop.location;
    document.getElementById('modal-price').textContent = currentMode === 'buy' ? '$' + prop.buyPrice.toLocaleString() : '$' + prop.rentPrice + '/mo';
    document.getElementById('modal-beds').textContent = prop.beds;
    document.getElementById('modal-baths').textContent = prop.baths;
    document.getElementById('modal-sqft').textContent = prop.sqft;
    document.getElementById('modal-description').textContent = prop.desc;

    document.getElementById('property-modal').classList.remove('hidden');
}

function updateModalImage() {
    if (!currentProperty) return;
    document.getElementById('modal-main-image').src = currentProperty.images[currentImageIndex];
}

function nextImage() {
    if (!currentProperty) return;
    currentImageIndex = (currentImageIndex + 1) % currentProperty.images.length;
    updateModalImage();
}

function prevImage() {
    if (!currentProperty) return;
    currentImageIndex = (currentImageIndex - 1 + currentProperty.images.length) % currentProperty.images.length;
    updateModalImage();
}

// ====================== FAVORITES (FULL PAGE) ======================
function toggleFavorite(id) {
    event.stopImmediatePropagation();
    if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('realEstateFavorites', JSON.stringify(favorites));
    updateFavCount();
    renderProperties(allProperties);
}

function updateFavCount() {
    document.getElementById('nav-fav-count').textContent = `(${favorites.length})`;
}

function showFavorites() {
    const grid = document.getElementById('properties-grid');
    grid.innerHTML = '';

    const favProps = allProperties.filter(p => favorites.includes(p.id));

    if (favProps.length === 0) {
        grid.innerHTML = `<p class="col-span-3 text-center text-zinc-400 py-20 text-xl">You haven't saved any favorites yet ❤️<br><br>Browse homes and click the heart icon to add them.</p>`;
        document.getElementById('section-title').textContent = "My Favorite Homes";
        return;
    }

    favProps.forEach(p => {
        const card = document.createElement('div');
        card.className = "property-card bg-zinc-900 rounded-3xl overflow-hidden cursor-pointer relative";
        card.innerHTML = `
            <div class="relative">
                <img src="${p.images[0]}" class="w-full h-64 object-cover">
                <button onclick="event.stopImmediatePropagation(); removeFromFavorites(${p.id});" 
                        class="absolute top-4 right-4 bg-black/70 hover:bg-red-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center text-2xl">✕</button>
            </div>
            <div class="p-6">
                <h3 class="font-semibold text-xl">${p.title}</h3>
                <p class="text-amber-400">${p.location}</p>
                <p class="text-3xl font-bold text-amber-400 mt-4">
                    ${currentMode === 'buy' ? '$' + (p.buyPrice/1000).toFixed(0) + 'K' : '$' + p.rentPrice + '/mo'}
                </p>
            </div>
        `;
        card.onclick = () => openPropertyModal(p);
        grid.appendChild(card);
    });

    document.getElementById('section-title').textContent = "My Favorite Homes";
}

function removeFromFavorites(id) {
    event.stopImmediatePropagation();
    favorites = favorites.filter(f => f !== id);
    localStorage.setItem('realEstateFavorites', JSON.stringify(favorites));
    updateFavCount();
    showFavorites();
}

// ====================== MODAL HELPERS ======================
function submitContactForm() {
    const name = document.getElementById('contact-name').value.trim();
    if (!name) {
        alert("Please enter your name.");
        return;
    }
    alert(`Thank you ${name}! Your message has been sent to the agent.\nThey will contact you within 24 hours.`);
    closeModal();
}

function calculateMortgage() {
    const result = document.getElementById('mortgage-result');
    result.classList.remove('hidden');
    result.textContent = currentMode === 'buy' ? "$3,250 / month (est.)" : "Included in rent";
}

function scheduleViewing() {
    alert("✅ Viewing request sent! An agent will contact you soon.");
    closeModal();
}

function closeModal() {
    document.getElementById('property-modal').classList.add('hidden');
}

function applyFilters() {
    renderProperties(allProperties);
}

function resetAllFilters() {
    document.getElementById('price-range').value = currentMode === 'buy' ? 2000000 : 6000;
    updatePriceLabel();
    renderProperties(allProperties);
}

// ====================== INIT ======================
document.addEventListener('DOMContentLoaded', () => {
    setMode('buy');
    updateFavCount();
});