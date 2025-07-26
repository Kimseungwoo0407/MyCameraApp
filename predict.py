# predict.py
import tensorflow as tf
import numpy as np
from PIL import Image
import sys
import json

# 모델 로딩
model = tf.keras.models.load_model('food101_mobilenetv2_224.h5')

# 이미지 경로 인자로 받기
image_path = sys.argv[1]

# 이미지 전처리
img = Image.open(image_path).resize((224, 224))
x = np.array(img) / 255.0
x = x[np.newaxis, ...]

# 예측
pred = model.predict(x)
predicted_class = int(np.argmax(pred))
confidence = float(np.max(pred))

# 결과 출력 (JSON 형식)
print(json.dumps({
    "class": predicted_class,
    "confidence": confidence
}))
