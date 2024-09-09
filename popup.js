document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.sendMessage({action: "getAssets"}, function(response) {
        if (response && response.assets) {
            displayAssets(response.assets);
        } else {
            displayError();
        }
    });

    document.getElementById('open-settings').addEventListener('click', function() {
        chrome.runtime.openOptionsPage();
    });
});

function displayAssets(assets) {
    const container = document.getElementById('assets-container');
    container.innerHTML = '';

    assets.forEach(asset => {
        const assetElement = document.createElement('div');
        assetElement.className = 'asset';
        assetElement.innerHTML = `
            <div class="asset-header">
                <span class="asset-name">${asset.name}</span>
                <span class="asset-price">$${asset.price.toFixed(2)}</span>
            </div>
            <div class="asset-details">
                <span class="asset-change24h ${asset.change24h >= 0 ? 'positive' : 'negative'}">
                    ${asset.change24h.toFixed(2)}% (24h)
                </span>
                <span class="asset-market-cap">
                    Market Cap: $${formatMarketCap(asset.marketCap)}
                </span>
            </div>
        `;
        container.appendChild(assetElement);
    });

    const lastUpdated = document.getElementById('last-updated');
    lastUpdated.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
}

function formatMarketCap(marketCap) {
    if (marketCap >= 1e12) {
        return (marketCap / 1e12).toFixed(2) + 'T';
    } else if (marketCap >= 1e9) {
        return (marketCap / 1e9).toFixed(2) + 'B';
    } else if (marketCap >= 1e6) {
        return (marketCap / 1e6).toFixed(2) + 'M';
    } else {
        return marketCap.toFixed(2);
    }
}

function displayError() {
    const container = document.getElementById('assets-container');
    container.innerHTML = '<p>Error fetching asset data. Please try again later.</p>';
}
