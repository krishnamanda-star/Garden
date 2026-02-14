// JSONBin.io storage utility
// Free tier: 10,000 requests/month, plenty for a family garden app

const CONFIG = {
  // ============================================================
  // SETUP INSTRUCTIONS:
  // 1. Go to https://jsonbin.io and create a free account
  // 2. Go to API Keys and copy your X-Master-Key
  // 3. Paste it below as your API_KEY
  // 4. Run the app once — it will auto-create a bin
  //    OR create a bin manually and paste the ID below
  // ============================================================
  API_KEY: '$2a$10$ea9xP1ml5wGDDWCf1Bl/ZugyBmmd9kmf0a4HmulSQ1/7no5wALgsu',
  BIN_ID: '', // Leave empty on first run, it will auto-create
};

const BASE_URL = 'https://api.jsonbin.io/v3';

const headers = () => ({
  'Content-Type': 'application/json',
  'X-Master-Key': CONFIG.API_KEY,
});

// Store the bin ID in localStorage so we don't lose it
function getBinId() {
  return CONFIG.BIN_ID || localStorage.getItem('garden-bin-id') || '';
}

function saveBinId(id) {
  localStorage.setItem('garden-bin-id', id);
}

// Create a new bin
async function createBin(data = { plants: [] }) {
  const res = await fetch(`${BASE_URL}/b`, {
    method: 'POST',
    headers: {
      ...headers(),
      'X-Bin-Name': 'garden-tracker',
      'X-Bin-Private': 'true',
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.metadata?.id) {
    saveBinId(json.metadata.id);
    console.log('Created new bin:', json.metadata.id);
    console.log('Save this BIN_ID in your config:', json.metadata.id);
    return json.metadata.id;
  }
  throw new Error('Failed to create bin');
}

// Read data from bin
export async function loadPlants() {
  let binId = getBinId();
  
  if (!binId) {
    // No bin exists yet — create one
    binId = await createBin({ plants: [] });
  }

  try {
    const res = await fetch(`${BASE_URL}/b/${binId}/latest`, {
      headers: headers(),
    });
    const json = await res.json();
    return json.record?.plants || [];
  } catch (err) {
    console.error('Failed to load plants:', err);
    // Fallback to localStorage
    const local = localStorage.getItem('garden-plants-backup');
    return local ? JSON.parse(local) : [];
  }
}

// Save data to bin
export async function savePlants(plants) {
  // Always keep a local backup
  localStorage.setItem('garden-plants-backup', JSON.stringify(plants));

  let binId = getBinId();
  
  if (!binId) {
    binId = await createBin({ plants });
    return true;
  }

  try {
    const res = await fetch(`${BASE_URL}/b/${binId}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ plants }),
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to save plants:', err);
    return false;
  }
}

// Check if JSONBin is configured
export function isConfigured() {
  return CONFIG.API_KEY !== '$2a$10$REPLACE_WITH_YOUR_API_KEY';
}
