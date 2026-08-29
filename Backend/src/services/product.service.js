const {
    searchPlatform
} = require("./quickcommerce.service");


const PLATFORMS = [
    "Amazon",
    "Flipkart",
    "Myntra"
];


async function searchAllPlatforms(
    query,
    lat,
    lon
) {

    const results = await Promise.all(

        PLATFORMS.map(
            async (platform) => {

                const data =
                    await searchPlatform(
                        query,
                        lat,
                        lon,
                        platform
                    );

                return {

                    platform,

                    data

                };

            }
        )

    );

    return results;
}


module.exports = {
    searchAllPlatforms
};