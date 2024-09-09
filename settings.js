let assets = [];

function loadSettings() {
    chrome.storage.sync.get('assets', (data) => {
        assets = data.assets || ['BTC', 'ETH', 'USDT'];
        renderAssetList();
    });
}

function renderAssetList() {
    const assetList = document.getElementById('asset-list');
    assetList.innerHTML = '';
    assets.forEach((asset, index) => {
        const assetInput = document.createElement('div');
        assetInput.innerHTML = `
            <input type="text" value="${asset}" data-index="${index}">
            <button class="remove-asset" data-index="${index}">Remove</button>
        `;
        assetList.appendChild(assetInput);
    });
}

function addAsset() {
    assets.push('');
    renderAssetList();
}

function removeAsset(index) {
    assets.splice(index, 1);
    renderAssetList();
}

function saveSettings() {
    const assetInputs = document.querySelectorAll('#asset-list input');
    assets = Array.from(assetInputs).map(input => input.value.toUpperCase());
    chrome.storage.sync.set({ assets }, () => {
        alert('Settings saved successfully!');
    });
}

document.addEventListener('DOMContentLoaded', loadSettings);
document.getElementById('add-asset').addEventListener('click', addAsset);
document.getElementById('save-settings').addEventListener('click', saveSettings);
document.getElementById('asset-list').addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-asset')) {
        removeAsset(parseInt(e.target.dataset.index));
    }
});
