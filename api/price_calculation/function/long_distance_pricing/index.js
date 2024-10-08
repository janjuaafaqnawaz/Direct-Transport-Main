import determineLadderRackPipesPrice from "../determine_price_by_item/determineLadderRackPipesPrice";
import determinePriceByPallet from "../determine_price_by_item/determinePriceByPallet";
import determinePriceBySkid from "../determine_price_by_item/determinePriceBySkid";
import TruckPricing from "../truck_pricing";

export default async function LongDistancePricing(
  max_volume,
  long_distance,
  distance,
  items,
  total_weight,
  longest_length,
  rate,
  min_rate,
  Ladder,
  Rack,
  Pipes,
  Timber,
  Steel,
  Aluminum,
  Conduit,
  Tubes,
  Pallet,
  Skid
) {
  let price = 0;
  let returnType = "LD";

  if (
    Ladder.exist ||
    Rack.exist ||
    Pipes.exist ||
    Timber.exist ||
    Steel.exist ||
    Aluminum.exist ||
    Conduit.exist ||
    Tubes.exist
  ) {
    ({ price, returnType } = await determineLadderRackPipesPrice(
      distance,
      total_weight,
      max_volume,
      longest_length,
      rate,
      min_rate,
      items
    ));
    price = basedOnPrice(returnType, long_distance, distance);
    returnType = returnType;
  } else if (max_volume > 1000 || longest_length > 270) {
    const { cost, costType } = await TruckPricing(distance, items);
    price = basedOnPrice(costType, long_distance, distance);
    returnType = costType;
  } else if (Pallet.exist && max_volume <= 1000) {
    const { price: palletPrice, returnType: palletType } =
      await determinePriceByPallet(
        distance,
        Pallet.count,
        rate,
        min_rate,
        max_volume,
        items
      );
    price = basedOnPrice(palletType, long_distance, distance);
    returnType = palletType;
  } else if (Skid.exist) {
    const { price: skidPrice, returnType: skidType } =
      await determinePriceBySkid(distance, Skid.count, rate, min_rate);
    price = basedOnPrice(skidType, long_distance, distance);
    returnType = skidType;
  } else if (total_weight <= 25 && longest_length < 100 && max_volume <= 25) {
    returnType = "Courier";
    price = basedOnPrice(returnType, long_distance, distance);
  } else if (longest_length <= 400 && max_volume <= 500) {
    returnType = "HT";
    price = basedOnPrice(returnType, long_distance, distance);
  } else if (max_volume <= 1000) {
    returnType = "1T";
    price = basedOnPrice(returnType, long_distance, distance);
  } else {
    const { cost, costType } = await TruckPricing(distance, items);
    price = cost;
    returnType = costType;
  }

  return { price, returnType };
}

const basedOnPrice = (costType, long_distance, distance) => {
  return Math.max(
    distance * Number(long_distance.services[costType]),
    Number(long_distance.minServices[costType])
  );
};
