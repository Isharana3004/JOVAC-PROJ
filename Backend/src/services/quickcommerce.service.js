const axios = require("axios");

const API_URL = "https://api.quickcommerceapi.com/v1/search";

async function searchPlatform(query, lat, lon, platform) {
    try {
        console.log(`Calling ${platform}...`);

        const response = await axios.get(API_URL, {
            params: {
                q: query,
                lat: lat,
                lon: lon,
                platform: platform
            },

            headers: {
                "X-API-Key": process.env.QUICKCOMMERCE_API_KEY
            },

            timeout: 15000
        });

        console.log(`${platform} API status:`, response.status);

        return response.data;

    } catch (error) {
        console.error(
            `${platform} API ERROR:`,
            error.response?.data || error.message
        );

        return null;
    }
}


async function searchAllPlatforms(query, lat, lon) {

    const platforms = [
        "Amazon",
        "Flipkart",
        "Myntra"
    ];

    const results = await Promise.all(
        platforms.map(async (platform) => {

            const data = await searchPlatform(
                query,
                lat,
                lon,
                platform
            );

            return {
                platform,
                data
            };
        })
    );

    return results;
}


module.exports = {
    searchPlatform,
    searchAllPlatforms
};