function comparePrices(products) {

    // Teeno platforms available hone chahiye
    if (!Array.isArray(products) || products.length !== 3) {
        return null;
    }

    const offers = products.map(product => {

        // Final selling price
        const price = Number(
            product.price ??
            product.offer_price ??
            product.offerPrice ??
            0
        );

        // Original MRP
        const mrp = Number(
            product.mrp ??
            product.MRP ??
            0
        );

        // Discount calculate karo
        let discount = 0;

        if (mrp > 0 && price > 0 && mrp >= price) {
            discount = Math.round(
                ((mrp - price) / mrp) * 100
            );
        }

        return {

            platform:
                product.platform,

            name:
                product.name,

            price:
                price,

            mrp:
                mrp,

            discount:
                discount,

            image:
                product.image,

            url:
                product.url,

            rating:
                Number(product.rating || 0)

        };

    });


    // Kisi platform par valid price nahi hai
    if (
        offers.some(
            offer => !Number.isFinite(offer.price) ||
                     offer.price <= 0
        )
    ) {
        return null;
    }


    // Sabse cheap offer find karo
    const bestOffer = offers.reduce(
        (best, current) => {

            return current.price < best.price
                ? current
                : best;

        }
    );


    return {

        offers: offers,

        bestPrice:
            bestOffer.price,

        bestPlatform:
            bestOffer.platform

    };
}


function compareAllProducts(commonProducts) {

    if (!Array.isArray(commonProducts)) {
        return [];
    }

    const results = [];


    for (const product of commonProducts) {

        if (
            !product ||
            !Array.isArray(product.products)
        ) {
            continue;
        }


        const comparison =
            comparePrices(
                product.products
            );


        if (comparison) {

            results.push({

                productName:
                    product.productName,

                ...comparison

            });

        }

    }


    return results;
}


module.exports = {

    comparePrices,

    compareAllProducts

};