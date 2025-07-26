const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');  // ⬅️ Python 호출 추가

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 저장 폴더 경로 설정 (D드라이브)
const UPLOAD_DIR = 'D:/camera_uploads';

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.post('/upload', (req, res) => {
  try {
    const base64Data = req.body.image.replace(/^data:image\/png;base64,/, '');
    const filename = `${Date.now()}.png`;
    const filePath = path.join(UPLOAD_DIR, filename);

    // 파일 저장
    fs.writeFileSync(filePath, base64Data, 'base64');
    console.log('Saved to D drive:', filePath);

    // Python 모델 실행
    exec(`python predict.py "${filePath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Python 오류:', stderr);
        return res.status(500).json({ message: '모델 실행 오류', error: stderr });
      }

      try {
        const result = JSON.parse(stdout);
        console.log('✅ 예측 결과:', result);

        res.json({
          message: '저장 및 예측 성공',
          prediction: result
        });
      } catch (parseError) {
        console.error('❌ JSON 파싱 오류:', parseError);
        console.error('Python 출력:', stdout);
        return res.status(500).json({ message: '예측 결과 파싱 실패', rawOutput: stdout });
      }
    });
  } catch (err) {
    console.error('파일 저장 오류:', err);
    res.status(500).json({ message: '저장 실패' });
  }
});

app.listen(5000, () => console.log('🚀 Server running on port 5000'));
