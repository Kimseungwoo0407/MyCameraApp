import tensorflow as tf
import numpy as np
from PIL import Image
import sys
import json
import os

def load_label_map(path='label_map.json'):
    if not os.path.exists(path):
        return {}
    with open(path, 'r') as f:
        return json.load(f)

def main():
    try:
        image_path = sys.argv[1]

        # 모델 및 라벨맵 로딩
        model = tf.keras.models.load_model('food101_mobilenetv2_224.h5')
        label_map = load_label_map('label_map.json')

        # 이미지 전처리
        img = Image.open(image_path).convert('RGB').resize((224, 224))
        x = np.array(img) / 255.0
        x = x[np.newaxis, ...]

        # 예측
        pred = model.predict(x)
        predicted_class = int(np.argmax(pred))
        confidence = float(np.max(pred))
        label = label_map.get(str(predicted_class), "unknown")

        # JSON 형식으로 결과 출력
        print(json.dumps({
            "class": predicted_class,
            "label": label,
            "confidence": confidence
        }))
    except Exception as e:
        print(json.dumps({
            "error": str(e),
            "message": "예측 중 오류가 발생했습니다. 음식이 아닌 이미지일 수 있습니다."
        }))

if __name__ == "__main__":
    main()
