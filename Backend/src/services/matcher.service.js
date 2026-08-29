function normalizeText(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}


/*
 * Common words jo product matching mein
 * zyada useful nahi hain.
 */
const STOP_WORDS = new Set([
    "shoe",
    "shoes",
    "footwear",
    "men",
    "mens",
    "women",
    "womens",
    "male",
    "female",
    "running",
    "sports",
    "sport",
    "casual",
    "shoes",
    "for",
    "the",
    "and",
    "with",
    "original",
    "new"
]);


/*
 * Product ke useful words nikalna
 */
function getUsefulWords(product) {

    const brand = normalizeText(product.brand);
    const name = normalizeText(product.name);

    const text = `${brand} ${name}`;

    return text
        .split(" ")
        .filter(word =>
            word.length >= 3 &&
            !STOP_WORDS.has(word)
        );
}


/*
 * Brand normalize
 */
function getBrand(product) {
    return normalizeText(product.brand);
}


/*
 * Product model/name matching
 */
function areSameProduct(product1, product2) {

    const brand1 = getBrand(product1);
    const brand2 = getBrand(product2);

    /*
     * Agar dono products mein brand available hai
     * aur different hai -> definitely different.
     */
    if (
        brand1 &&
        brand2 &&
        brand1 !== brand2
    ) {
        return false;
    }


    const words1 =
        new Set(getUsefulWords(product1));

    const words2 =
        new Set(getUsefulWords(product2));


    if (
        words1.size === 0 ||
        words2.size === 0
    ) {
        return false;
    }


    /*
     * Common useful words
     */
    let commonWords = 0;

    for (const word of words1) {

        if (words2.has(word)) {
            commonWords++;
        }

    }


    /*
     * Dono direction se similarity calculate karo
     */
    const similarity1 =
        commonWords / words1.size;

    const similarity2 =
        commonWords / words2.size;


    /*
     * Maximum similarity
     */
    const similarity =
        Math.max(
            similarity1,
            similarity2
        );


    /*
     * Strong match
     */
    if (similarity >= 0.65) {
        return true;
    }


    /*
     * Agar product ke naam mein koi
     * strong model token match karta hai.
     *
     * Example:
     *
     * Nike Revolution 7
     *
     * Nike Revolution 7 Running Shoes
     */
    const name1 =
        normalizeText(product1.name);

    const name2 =
        normalizeText(product2.name);


    const tokens1 =
        name1.split(" ")
            .filter(word => word.length >= 4);

    const tokens2 =
        name2.split(" ")
            .filter(word => word.length >= 4);


    let strongMatches = 0;

    for (const token of tokens1) {

        if (tokens2.includes(token)) {
            strongMatches++;
        }

    }


    /*
     * At least 2 meaningful matching tokens
     */
    if (strongMatches >= 2) {
        return true;
    }


    return false;
}


/*
 * Product key
 */
function getProductKey(product) {

    const brand =
        normalizeText(product.brand);

    const name =
        normalizeText(product.name);

    return `${brand} ${name}`.trim();
}


/*
 * Find common products
 */
function getCommonProducts(allProducts) {

    const amazon =
        allProducts.Amazon || [];

    const flipkart =
        allProducts.Flipkart || [];

    const myntra =
        allProducts.Myntra || [];


    console.log(
        "Starting product matching..."
    );

    console.log(
        `Amazon: ${amazon.length}`
    );

    console.log(
        `Flipkart: ${flipkart.length}`
    );

    console.log(
        `Myntra: ${myntra.length}`
    );


    const commonProducts = [];


    /*
     * Amazon ko base maan rahe hain
     */
    for (
        const amazonProduct of amazon
    ) {


        /*
         * Amazon -> Flipkart
         */
        const flipkartProduct =
            flipkart.find(
                product =>
                    areSameProduct(
                        amazonProduct,
                        product
                    )
            );


        if (!flipkartProduct) {
            continue;
        }


        /*
         * Amazon -> Myntra
         */
        const myntraProduct =
            myntra.find(
                product =>
                    areSameProduct(
                        amazonProduct,
                        product
                    )
            );


        if (!myntraProduct) {
            continue;
        }


        /*
         * Same product teeno platforms
         * par mil gaya.
         */
        commonProducts.push({

            productName:
                amazonProduct.name,

            products: [

                {
                    ...amazonProduct,
                    platform: "Amazon"
                },

                {
                    ...flipkartProduct,
                    platform: "Flipkart"
                },

                {
                    ...myntraProduct,
                    platform: "Myntra"
                }

            ]

        });

    }


    console.log(
        "Common products found:",
        commonProducts.length
    );


    return commonProducts;
}


module.exports = {

    normalizeText,

    getProductKey,

    areSameProduct,

    getCommonProducts

};