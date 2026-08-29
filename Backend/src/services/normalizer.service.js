function normalizeProduct(product, platform) {

    return {

        id:
            product?.id || "",

        name:
            product?.name || "",

        brand:
            product?.brand || "",

        platform:
            platform,

        // Selling price
        price:
            Number(
                product?.offer_price ??
                product?.price ??
                product?.mrp ??
                0
            ),

        // Original MRP
        mrp:
            Number(
                product?.mrp ??
                0
            ),

        // First product image
        image:
            product?.images?.[0] || "",

        // Product page
        url:
            product?.deeplink || "",

        // Availability
        available:
            product?.available === true,

        // Rating
        rating:
            Number(
                product?.rating ?? 0
            ),

        // Number of ratings
        ratingCount:
            Number(
                product?.rating_count ?? 0
            ),

        quantity:
            product?.quantity || "",

        inventory:
            product?.inventory ?? null
    };
}


function normalizePlatformResponse(response, platform) {

    /*
     * QuickCommerce response:
     *
     * response
     *   ↓
     * data
     *   ↓
     * products
     */

    const products =
        response?.data?.products || [];


    console.log(
        `${platform} raw products:`,
        products.length
    );


    const normalizedProducts =
        products.map(product =>
            normalizeProduct(
                product,
                platform
            )
        );


    console.log(
        `${platform} normalized products:`,
        normalizedProducts.length
    );


    return normalizedProducts;
}


module.exports = {

    normalizeProduct,

    normalizePlatformResponse

};