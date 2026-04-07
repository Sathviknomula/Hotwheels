// DOM Elements
const pages = document.querySelectorAll('.page');
const navBtns = document.querySelectorAll('.nav-btn');
const brandsContainer = document.getElementById('brandsContainer');
const brandCarsViewDiv = document.getElementById('brandCarsView');
const carsListContainer = document.getElementById('carsListContainer');
const selectedBrandTitleSpan = document.getElementById('selectedBrandTitle');
const backToBrandsBtn = document.getElementById('backToBrandsBtn');
const carDetailContent = document.getElementById('carDetailContent');
const backHomeFromDetails = document.getElementById('backHomeFromDetails');
const billingForm = document.getElementById('billingForm');
const qrContainer = document.getElementById('qrCanvas');
const qrCarInfoSpan = document.getElementById('qrCarInfo');
const mockPaymentBtn = document.getElementById('mockPaymentBtn');
const paymentStatusSpan = document.getElementById('paymentStatus');

let selectedCar = null;
let billingData = null;

function goToHome() {
    // Reset to home page
    backToBrandsOverview();
    showPage('home');
    
    // Update active nav button
    navBtns.forEach(btn => {
        if(btn.dataset.page === 'home') btn.classList.add('active');
        else btn.classList.remove('active');
    });
}

function showPage(pageId) {
    pages.forEach(p => p.classList.remove('active-page'));
    document.getElementById(pageId + 'Page').classList.add('active-page');
    navBtns.forEach(btn => {
        if(btn.dataset.page === pageId) btn.classList.add('active');
        else btn.classList.remove('active');
    });
    if(pageId === 'payment' && selectedCar) generateQR();
}

function renderBrands() {
    brandsContainer.innerHTML = '';
    brandList.forEach(brand => {
        const card = document.createElement('div');
        card.className = 'brand-card';
        const logoUrl = brandLogoMap[brand];
        card.innerHTML = `<img class="brand-logo-img" src="${logoUrl}" alt="${brand}"><div class="brand-name">${brand}</div><small>${fullDB[brand].length} models</small>`;
        card.addEventListener('click', () => showBrandCars(brand));
        brandsContainer.appendChild(card);
    });
}

function showBrandCars(brand) {
    const cars = fullDB[brand];
    selectedBrandTitleSpan.innerHTML = `${brand} • Ultimate Collection (${cars.length} supercars)`;
    carsListContainer.innerHTML = '';
    cars.forEach(car => {
        const carDiv = document.createElement('div');
        carDiv.className = 'car-card';
        carDiv.innerHTML = `
            <img class="car-img" src="${car.primaryImage}" alt="${car.model}" onerror="this.src='https://placehold.co/600x400/111/ff5e00?text=${car.model}'">
            <div class="car-info">
                <h3>${car.name} ${car.model}</h3>
                <div class="price-badge"><span>Rent $${car.rentPerDay}/day</span><span>Buy $${car.buyPrice.toLocaleString()}</span></div>
                <button>View & Select</button>
            </div>
        `;
        carDiv.querySelector('button').addEventListener('click', (e) => {
            e.stopPropagation();
            selectedCar = car;
            showDetailedCar(car);
        });
        carsListContainer.appendChild(carDiv);
    });
    brandsContainer.style.display = 'none';
    brandCarsViewDiv.style.display = 'block';
}

function backToBrandsOverview() {
    brandsContainer.style.display = 'grid';
    brandCarsViewDiv.style.display = 'none';
}

function showDetailedCar(car) {
    selectedCar = car;
    let gallerySlides = '';
    const allImages = [car.primaryImage, ...car.gallery];
    allImages.forEach(img => {
        gallerySlides += `<div class="swiper-slide"><img src="${img}" alt="${car.model}" onerror="this.src='https://placehold.co/800x500/222/ff5e00?text=${car.model}'"></div>`;
    });
    const detailHtml = `
        <div class="detail-wrapper">
            <div class="swiper gallerySwiper" style="width:100%;">
                <div class="swiper-wrapper">${gallerySlides}</div>
                <div class="swiper-pagination"></div>
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
            </div>
            <div class="car-specs">
                <h1>${car.name} ${car.model}</h1>
                <p>${car.fullDesc}</p>
                <p style="margin:1rem 0"><strong>Daily Rent:</strong> $${car.rentPerDay} &nbsp;|&nbsp; <strong>Purchase:</strong> $${car.buyPrice.toLocaleString()}</p>
                <div class="action-group">
                    <button id="detailRentBtn">Rent Now</button>
                    <button id="detailBuyBtn">Buy Now</button>
                </div>
            </div>
        </div>
    `;
    carDetailContent.innerHTML = detailHtml;
    
    // Destroy existing Swiper instance if it exists
    if (window.gallerySwiper && window.gallerySwiper.destroy) {
        window.gallerySwiper.destroy(true, true);
    }
    
    // Initialize new Swiper with AUTOPLAY enabled
    window.gallerySwiper = new Swiper('.gallerySwiper', {
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        spaceBetween: 10,
        slidesPerView: 1,
        speed: 800,
    });
    
    document.getElementById('detailRentBtn')?.addEventListener('click', () => proceedToBilling('rent'));
    document.getElementById('detailBuyBtn')?.addEventListener('click', () => proceedToBilling('buy'));
    showPage('details');
}

function proceedToBilling(type) {
    if(!selectedCar) return;
    sessionStorage.setItem('transType', type);
    showPage('billing');
}

billingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('custName').value.trim();
    const addr = document.getElementById('custAddress').value.trim();
    const bookingDate = document.getElementById('bookingDate').value;
    const delivery = document.getElementById('deliveryDate').value;
    const phone = document.getElementById('phoneNum').value.trim();
    if(!name || !addr || !bookingDate || !delivery || !phone) return alert('Fill all fields');
    billingData = { name, addr, bookingDate, delivery, phone, transType: sessionStorage.getItem('transType') };
    alert('Billing saved! Proceed to payment.');
    showPage('payment');
    generateQR();
});

function generateQR() {
    if(!selectedCar) { qrCarInfoSpan.innerText = "No car selected"; return; }
    const payload = `HOTWHEELS:${selectedCar.name} ${selectedCar.model} | Rent:$${selectedCar.rentPerDay}/day | Buy:$${selectedCar.buyPrice}`;
    qrCarInfoSpan.innerHTML = `<strong>${selectedCar.name} ${selectedCar.model}</strong><br>QR contains full car details`;
    qrContainer.innerHTML = '';
    new QRCode(qrContainer, { text: payload, width: 230, height: 230, colorDark: "#00aaff", colorLight: "#0b0c15", correctLevel: QRCode.CorrectLevel.H });
}

mockPaymentBtn.addEventListener('click', () => {
    if(!selectedCar || !billingData) { paymentStatusSpan.innerText = "Complete billing first."; return; }
    paymentStatusSpan.innerHTML = "✅ Payment Successful! Booking confirmed. Redirecting...";
    setTimeout(() => { showPage('home'); paymentStatusSpan.innerHTML = ""; }, 2000);
});

backHomeFromDetails.addEventListener('click', () => showPage('home'));
backToBrandsBtn.addEventListener('click', backToBrandsOverview);

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const pg = btn.dataset.page;
        if(pg === 'home') { backToBrandsOverview(); showPage('home'); }
        else if(pg === 'details') { if(selectedCar) showPage('details'); else alert('Select a car from home'); }
        else if(pg === 'billing') { if(selectedCar) showPage('billing'); else alert('Select a car first'); }
        else if(pg === 'payment') { if(selectedCar && billingData) showPage('payment'); else alert('Select car & fill billing'); }
        else showPage(pg);
    });
});

new Swiper('.heroSlider', {
    loop: true,
    autoplay: { delay: 4000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    speed: 700
});

renderBrands();
brandsContainer.style.display = 'grid';
brandCarsViewDiv.style.display = 'none';