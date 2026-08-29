const {
    searchAllPlatforms
} = require("../services/quickcommerce.service");

const {
    normalizePlatformResponse
} = require("../services/normalizer.service");

const {
    getCommonProducts
} = require("../services/matcher.service");

const {
    compareAllProducts
} = require("../services/price.service");


async function searchProducts(req, res) {

    try {

        const {
            q,
            lat = 28.6692,
            lon = 77.4538
        } = req.query;


        if (!q || q.trim() === "") {

            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });

        }


        console.log(`Searching for: ${q}`);


        // 1. Get products
        const platformResults =
            await searchAllPlatforms(
                q,
                lat,
                lon
            );


        // 2. Normalize products
        const allProducts = {
            Amazon: [],
            Flipkart: [],
            Myntra: []
        };


        for (const result of platformResults) {

            if (!result || !result.platform) {
                continue;
            }


            if (
                Object.prototype.hasOwnProperty.call(
                    allProducts,
                    result.platform
                )
            ) {

                allProducts[result.platform] =
                    normalizePlatformResponse(
                        result.data,
                        result.platform
                    );

            }

        }


        console.log(
            "Amazon:",
            allProducts.Amazon.length
        );

        console.log(
            "Flipkart:",
            allProducts.Flipkart.length
        );

        console.log(
            "Myntra:",
            allProducts.Myntra.length
        );


        // 3. Match products WITHOUT Gemini
        const commonProducts =
            getCommonProducts(
                allProducts
            );


        // 4. Compare prices
        const comparisons =
            compareAllProducts(
                commonProducts
            );


        // 5. Response
        return res.status(200).json({

            success: true,

            query: q,

            location: {
                lat: Number(lat),
                lon: Number(lon)
            },

            totalComparisons:
                comparisons.length,

            comparisons

        });

    } catch (error) {

        console.error(
            "Search Controller Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Something went wrong",

            error: error.message

        });

    }

}


module.exports = {
    searchProducts
};