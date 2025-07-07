import forest from '@/models/rf_model.json';
import { MLModelFeature } from '@/types';

function predictSample(forest: any, sample: MLModelFeature) {
  function traverseTree(node: any) {
    if (node.leaf) {
      return node.value[1] > node.value[0] ? 1 : 0;
    } else {
      if (sample[node.feature_index] <= node.threshold) {
        return traverseTree(node.left);
      } else {
        return traverseTree(node.right);
      }
    }
  }

  let votes = [0, 0];
  for (const tree of forest) {
    const pred = traverseTree(tree);
    votes[pred]++;
  }
  // Majority vote
  return votes[1] > votes[0];
}

/**
 * Predicts availability for each day of the week based on provided features.
 * @param features Array of features for each day of the week.
 * @returns Array of boolean predictions for each day. 1 means available, 0 means not available.
 */
function predictForDayOfWeek(features: MLModelFeature[]): boolean[] {
  const predictions: boolean[] = [];

  for (const feature of features) {
    const prediction = predictSample(forest, feature);
    predictions.push(prediction);
  }

  return predictions;
}

export default predictForDayOfWeek;
