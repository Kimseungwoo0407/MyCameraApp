// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 여기를 D 드라이브 경로로 변경
const UPLOAD_DIR = 'D:/camera_uploads';

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.post('/upload', (req, res) => {
  try {
    const base64Data = req.body.image.replace(/^data:image\/png;base64,/, '');
    const filename = `${Date.now()}.png`;
    const filePath = path.join(UPLOAD_DIR, filename);

    fs.writeFileSync(filePath, base64Data, 'base64');
    console.log('Saved to D drive:', filePath);
    res.json({ message: '저장 성공', path: filePath });
  } catch (err) {
    console.error('파일 저장 오류:', err);
    res.status(500).json({ message: '저장 실패' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
