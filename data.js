// ======================= DATA: 10 BRANDS, 15+ MODELS =======================
const brandList = ["Ferrari", "Lamborghini", "Porsche", "McLaren", "Aston Martin", "Bugatti", "Mercedes-AMG", "Bentley", "Audi Sport", "Ford GT"];

const brandLogoMap = {
        "Ferrari": "images/logos/ferrari.png",
        "Lamborghini": "images/logos/lambo.png",
        "Porsche": "images/logos/porsche.png",
        "McLaren": "images/logos/mclaren.png",
        "Aston Martin": "images/logos/astin.png",
        "Bugatti": "images/logos/bugatti.png",
        "Mercedes-AMG": "images/logos/mercedes-amg.png",
        "Bentley": "images/logos/bentley.png",
        "Audi Sport": "images/logos/audi-sport.png",
        "Ford GT": "images/logos/ford-gt.png"
};

const modelMap = {
    "Ferrari": ["SF90 Stradale","296 GTB","F8 Tributo","SF90 Spider"],
    "Lamborghini": ["Revuelto", "Huracán STO", "Aventador SVJ", "Veneno"],
    "Porsche": ["911 Turbo S", "918 Spyder", "GT2 RS", "Carrera GT"],
    "McLaren": ["Senna", "P1","Speedtail", "Elva"],
    "Aston Martin": ["Valhalla", "Valkyrie", "DBS Superleggera", "Vulcan"],
    "Bugatti": ["Chiron Super Sport", "Veyron", "Divo", "Bolide"],
    "Mercedes-AMG": ["GT Black Series", "Project ONE", "SLS AMG", "G63 4x4²"],
    "Bentley": [ "Bacalar", "Batur", "Flying Spur", "Mulsanne Speed"],
    "Audi Sport": ["R8 V10 Performance", "RS e-tron GT","R8 Spyder", "TT RS"],
    "Ford GT": ["Ford GT Mk II", "Ford GT40", "Ford Mustang", "Ford GT Competition"]
};

let fullDB = {};

brandList.forEach(brand => {
    let models = modelMap[brand];
    let cars = [];
    for(let i = 0; i < models.length; i++) {
        let model = models[i];
        let rent = Math.floor(490 + Math.random() * 1600);
        let buy = Math.floor(189000 + Math.random() * 440000);
        let primaryImg = `images/cars/${brand}/${model}/main.jpg`;
        let angleImages = [
            `images/cars/${brand}/${model}/angle1.jpg`,
            `images/cars/${brand}/${model}/angle2.jpg`,
            `images/cars/${brand}/${model}/angle3.jpg`,
            `images/cars/${brand}/${model}/angle4.jpg`,
            `images/cars/${brand}/${model}/angle5.jpg`
        ];
        cars.push({
            id: `${brand}-${i}`,
            name: brand,
            model: model,
            rentPerDay: rent,
            buyPrice: buy,
            primaryImage: primaryImg,
            gallery: angleImages,
            fullDesc: `${brand} ${model} — V8/V12 hybrid, 0-60 in 2.5s, carbon-fiber chassis. Aerodynamic masterpiece with active aero. Experience the pinnacle.`
        });
    }
    fullDB[brand] = cars;
});