import fetch from 'node-fetch';

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function testExtension(assets = ['BTC', 'ETH', 'USDT']) {
    try {
        const assetString = assets.join(',');
        const url = `https://data.messari.io/api/v1/assets?fields=id,slug,symbol,metrics/market_data/price_usd&assets=${assetString}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.data || data.data.length === 0) {
            console.error('Error: Invalid data received from Messari API');
            console.error('Response:', JSON.stringify(data, null, 2));
            process.exit(1);
        }

        const fetchedAssets = data.data.map(asset => ({
            name: asset.symbol,
            price: asset.metrics.market_data.price_usd
        }));

        console.log('Fetched assets from Messari.io:');
        fetchedAssets.forEach(asset => {
            console.log(`${asset.name}: $${asset.price.toFixed(2)}`);
        });

        console.log('Test passed successfully!');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

async function runTests() {
    try {
        // Test with default assets
        console.log("Testing with default assets (BTC, ETH, USDT):");
        await testExtension();

        // Add a delay to avoid rate limiting
        await delay(2000);

        // Test with custom assets
        console.log("\nTesting with custom assets (BTC, XRP, ADA):");
        await testExtension(['BTC', 'XRP', 'ADA']);

        console.log("\nAll tests completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Test suite failed:", error.message);
        process.exit(1);
    }
}

runTests();
