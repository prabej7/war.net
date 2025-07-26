import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";
import { Asset } from "expo-asset";

// Define min and max values for each feature (in training order)
// Replace these values with your actual training min/max
const featureMin = [0, 0, 0, 0, 0, 26, 80];
const featureMax = [3, 10, 10, 2, 10, 30, 90];

/**
 * Scales an input array with given min and max arrays (element-wise).
 * Assumes input.length === min.length === max.length
 */
export function minMaxScale(
  input: number[],
  min: number[],
  max: number[]
): number[] {
  return input.map((value, i) => {
    const denominator = max[i] - min[i];
    if (denominator === 0) {
      // Avoid division by zero if max == min
      return 0;
    }
    return (value - min[i]) / denominator;
  });
}

// Reusable function
export async function predictSeverity(rawInput: number[]): Promise<number> {
  // 1. Ensure TensorFlow.js is ready
  await tf.ready();

  // 2. Load the model (from local assets)
  const modelJson = require("../assets/model/model.json");
  const modelWeightsAsset = Asset.fromModule(
    require("../assets/model/group1-shard1of1.bin")
  );
  await modelWeightsAsset.downloadAsync();

  const model = await tf.loadLayersModel(
    bundleResourceIO(
      modelJson,
      modelWeightsAsset.localUri
        ? modelWeightsAsset.localUri
        : modelWeightsAsset.uri
    )
  );

  // 3. Scale input using the minMaxScale function
  const scaledInput = minMaxScale(rawInput, featureMin, featureMax);

  // 4. Create input tensor and predict
  const inputTensor = tf.tensor2d([scaledInput], [1, 7]);
  const outputTensor = model.predict(inputTensor) as tf.Tensor;
  const outputData = await outputTensor.data();

  // 5. Return single prediction value
  return outputData[0];
}
