const MESSARI_API_BASE_URL = 'https://data.messari.io/api/v1/assets';
const UPDATE_INTERVAL = 5; // minutes

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get('assets', (data) => {
        if (!data.assets) {
            chrome.storage.sync.set({ assets: ['BTC', 'ETH', 'USDT'] });
        }
    });
    fetchAssets();
    chrome.alarms.create('updateAssets', { periodInMinutes: UPDATE_INTERVAL });
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'updateAssets') {
        fetchAssets();
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getAssets') {
        chrome.storage.local.get('assets', (data) => {
            sendResponse({ assets: data.assets || [] });
        });
        return true;
    }
});

function fetchAssets() {
    chrome.storage.sync.get('assets', (data) => {
        const assetSymbols = data.assets || ['BTC', 'ETH', 'USDT'];
        const url = `${MESSARI_API_BASE_URL}?fields=id,slug,symbol,metrics/market_data/price_usd,metrics/market_data/percent_change_usd_last_24_hours,metrics/marketcap/current_marketcap_usd&assets=${assetSymbols.join(',')}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const assets = data.data.map(asset => ({
                    name: asset.symbol,
                    price: asset.metrics.market_data.price_usd,
                    change24h: asset.metrics.market_data.percent_change_usd_last_24_hours,
                    marketCap: asset.metrics.marketcap.current_marketcap_usd
                }));
                chrome.storage.local.set({ assets: assets });
            })
            .catch(error => console.error('Error fetching assets:', error));
    });
}
