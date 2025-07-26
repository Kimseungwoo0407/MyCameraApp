import tensorflow as tf
import numpy as np
from PIL import Image
import sys
import json
import os

# 모델 및 라벨 로드
model = tf.keras.models.load_model("food101_mobilenetv2_224.h5")
with open("label_map.json", "r", encoding="utf-8") as f:
    label_map = json.load(f)

# 이미지 경로
img_path = sys.argv[1]

try:
    img = Image.open(img_path).convert("RGB").resize((224, 224))
    x = np.array(img) / 255.0
    x = x[np.newaxis, ...]

    # 예측 수행
    pred = model.predict(x)
    if pred.shape[0] == 0 or pred.shape[1] == 0:
        raise ValueError("Empty prediction array")

    predicted_class = int(np.argmax(pred))
    confidence = float(np.max(pred))

    label = label_map.get(str(predicted_class), "알 수 없음")

    print(json.dumps({
        "label": label,
        "confidence": confidence
    }, ensure_ascii=False))

except Exception as e:
    print(json.dumps({
        "error": str(e),
        "message": "예측 중 오류가 발생했습니다. 음식이 아닌 이미지일 수 있습니다."
    }, ensure_ascii=False))
