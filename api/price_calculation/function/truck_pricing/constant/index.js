const rateTypesForWeightOfLadderRackPipesItems = [
  { minWeight: 450, maxWeight: 1800, type: "2T" },
  { minWeight: 1800, maxWeight: 3800, type: "4T" },
  { minWeight: 3800, maxWeight: 6000, type: "6T" },
  { minWeight: 6000, maxWeight: 8000, type: "8T" },
  { minWeight: 8000, maxWeight: 9000, type: "10T" },
  { minWeight: 9000, maxWeight: Infinity, type: "12T" },
];
const rateTypesForLengthOfLadderRackPipesItems = [
  { length: 360, type: "2T" },
  { length: 420, type: "4T" },
  { length: 600, type: "6T" },
  { length: 720, type: "8T" },
  { length: 800, type: "10T" },
  { length: 890, type: "12T" },
];

const rateTypesForWeightOfDefault = [
  { minWeight: 1000, maxWeight: 1800, type: "2T" },
  { minWeight: 1800, maxWeight: 3800, type: "4T" },
  { minWeight: 3800, maxWeight: 6000, type: "6T" },
  { minWeight: 6000, maxWeight: 8000, type: "8T" },
  { minWeight: 8000, maxWeight: 9000, type: "10T" },
  { minWeight: 9000, maxWeight: Infinity, type: "12T" },
];
const rateTypesForLengthOfDefault = [
  { length: 360, type: "2T" },
  { length: 420, type: "4T" },
  { length: 600, type: "6T" },
  { length: 720, type: "8T" },
  { length: 800, type: "10T" },
  { length: 890, type: "12T" },
];

export {
  rateTypesForWeightOfLadderRackPipesItems,
  rateTypesForLengthOfLadderRackPipesItems,
  rateTypesForWeightOfDefault,
  rateTypesForLengthOfDefault,
};
