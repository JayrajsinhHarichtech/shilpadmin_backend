const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

app.post('/api/save', (req, res) => {
  const payload = req.body;
  try {
    const raw = fs.readFileSync(DATA_FILE);
    const arr = JSON.parse(raw || '[]');
    arr.push({ id: Date.now(), data: payload });
    fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2));
    return res.json({ success: true, saved: arr[arr.length - 1] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/data', (req, res) => {
  try {
    const raw = fs.readFileSync(DATA_FILE);
    const arr = JSON.parse(raw || '[]');
    return res.json({ success: true, data: arr });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
