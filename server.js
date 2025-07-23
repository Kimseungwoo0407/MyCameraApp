// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// JSON 바디 처리를 위해 크기 제한 늘려줍니다
app.use(express.json({ limit: '10mb' }));

// 저장할 절대 경로를 지정 (D 드라이브의 camera_uploads 폴더)
const UPLOAD_DIR = 'D:/camera_uploads';

// 업로드 디렉토리가 없으면 생성
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.post('/upload', (req, res) => {
  // dataURL에서 base64 부분만 분리
  const data = req.body.image.replace(/^data:image\/png;base64,/, '');
  // 파일 이름을 타임스탬프로
  const filename = `${Date.now()}.png`;
  const filePath = path.join(UPLOAD_DIR, filename);

  fs.writeFile(filePath, data, 'base64', err => {
    if (err) {
      console.error('파일 저장 오류:', err);
      return res.status(500).json({ message: '저장 실패' });
    }
    console.log('Saved:', filePath);
    res.json({ message: '저장 성공', path: filePath });
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));
