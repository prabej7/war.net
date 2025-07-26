from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras

app = Flask(__name__)

# Load model once at startup
MODEL_PATH = "model/severtiy_model.keras"  # Make sure the path is correct
model = keras.models.load_model(MODEL_PATH)

# Severity category labels (based on model output order)
severity_labels = ["High", "Highest", "Low", "Lowest", "Medium-High", "Medium-Low"]

# Load and cache the CSV file (to avoid reading on every request)
DATA_PATH = "cleaned.csv"
df = pd.read_csv(DATA_PATH)

# Define the input features used by the model
features_name = ['Hazard (Intensity)', 'Exposure', 'Housing', 'Poverty', 'Vulnerability', 'lat', 'lon']


@app.route("/predict", methods=["POST"])
def predict():
    try:
        # JSON input: { "district": "Kathmandu" }
        data = request.get_json()
        district = data.get("district")

        if not district:
            return jsonify({"error": "Missing 'district' in request body"}), 400

        row = df[df['DISTRICT'].str.lower() == district.lower()]

        if row.empty:
            return jsonify({"error": f"No data found for district '{district}'"}), 404

        features = row[features_name].values.astype(np.float32)

        prediction = model.predict(features)
        predicted_index = int(np.argmax(prediction, axis=1)[0])
        predicted_label = severity_labels[predicted_index]
        confidence = float(np.max(prediction))

        return jsonify({
            "district": district,
            "prediction": predicted_label,
            "confidence": confidence
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/", methods=["GET"])
def health():
    return "🔥 Severity Prediction API is running."


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)


