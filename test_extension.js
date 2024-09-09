// Simulating Chrome storage API
const chromeStorage = {
  sync: {
    get: (key, callback) => {
      if (key === 'assets') {
        callback({ assets: ['BTC', 'ETH', 'USDT'] });
      }
    },
    set: (data, callback) => {
      console.log('Saving assets:', data.assets);
      callback();
    }
  },
  local: {
    get: (key, callback) => {
      if (key === 'assets') {
        callback({ assets: [
          { name: 'BTC', price: 50000, change24h: 2.5, marketCap: 1e12 },
          { name: 'ETH', price: 3000, change24h: -1.2, marketCap: 5e11 },
          { name: 'USDT', price: 1, change24h: 0.1, marketCap: 7e10 }
        ]});
      }
    },
    set: (data, callback) => {
      console.log('Saving fetched assets:', data.assets);
      callback();
    }
  }
};

// Simulating chrome.runtime API
const chromeRuntime = {
  sendMessage: (message, callback) => {
    if (message.action === 'getAssets') {
      chromeStorage.local.get('assets', (data) => callback(data));
    }
  },
  openOptionsPage: () => {
    console.log('Opening options page');
  }
};

// Mocking the global chrome object
global.chrome = {
  storage: chromeStorage,
  runtime: chromeRuntime
};

// Mock DOM elements
const mockElements = {
  'assets-container': { innerHTML: '' },
  'last-updated': { textContent: '' },
  'open-settings': { addEventListener: () => {} }
};

// Mock document object
const document = {
  addEventListener: (event, callback) => {
    if (event === 'DOMContentLoaded') {
      callback();
    }
  },
  getElementById: (id) => mockElements[id] || { addEventListener: () => {} },
  createElement: (tag) => {
    return {
      className: '',
      innerHTML: '',
      appendChild: () => {}
    };
  }
};

// Load the actual extension code
const fs = require('fs');
const vm = require('vm');

const popupJs = fs.readFileSync('popup.js', 'utf8');

// Create a context for the scripts
const context = vm.createContext({
  document,
  chrome: global.chrome,
  console,
  alert: console.log,
  Date: Date
});

// Run the popup script in the context
vm.runInContext(popupJs, context);

// Test the popup display
console.log('\nTesting popup display:');
context.displayAssets([
  { name: 'BTC', price: 50000, change24h: 2.5, marketCap: 1e12 },
  { name: 'ETH', price: 3000, change24h: -1.2, marketCap: 5e11 },
  { name: 'XRP', price: 0.5, change24h: 0.8, marketCap: 2e10 }
]);

// Helper function to check if a string contains a substring
function containsSubstring(str, substr) {
  return str.indexOf(substr) !== -1;
}

// Check if the displayed assets contain the new information
const displayedContent = mockElements['assets-container'].innerHTML;
console.log('\nChecking displayed content:');
console.log('Contains 24h change:', containsSubstring(displayedContent, '24h'));
console.log('Contains market cap:', containsSubstring(displayedContent, 'Market Cap'));

console.log('\nTest completed successfully!');
