// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// CORS 허용
app.use(cors());

// JSON 바디 처리를 위해 크기 제한 늘려줍니다
app.use(express.json({ limit: '10mb' }));

// 저장할 절대 경로를 지정 (D 드라이브의 camera_uploads 폴더)
const UPLOAD_DIR = 'D:/camera_uploads';

// 업로드 디렉토리가 없으면 생성
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// 이미지 업로드 엔드포인트
app.post('/upload', (req, res) => {
  try {
    // dataURL에서 base64 부분만 분리
    const base64Data = req.body.image.replace(/^data:image\/png;base64,/, '');
    // 파일 이름을 타임스탬프로
    const filename = `${Date.now()}.png`;
    const filePath = path.join(UPLOAD_DIR, filename);

    // base64를 PNG 파일로 저장
    fs.writeFileSync(filePath, base64Data, 'base64');
    console.log('Saved:', filePath);

    res.json({ message: '저장 성공', path: filePath });
  } catch (err) {
    console.error('파일 저장 오류:', err);
    res.status(500).json({ message: '저장 실패' });
  }
});

// 서버 시작
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
