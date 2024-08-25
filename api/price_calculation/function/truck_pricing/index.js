import determineOtherItemsPriceByWeight from "./determine_price_by_item/determineOtherItemsPriceByWeight";
import determineOtherItemsPriceByLength from "./determine_price_by_item/determineOtherItemsPriceByLength";
import determinePalletPrice from "./determine_price_by_item/determinePalletPrice";
import calculateItemsVolume from "../helper/item_volume";
import countItemsByType from "../helper/items_count";
import MinuteRate from "./helper/minute_rate";
import {
  rateTypesForLengthOfDefault,
  rateTypesForLengthOfLadderRackPipesItems,
  rateTypesForWeightOfDefault,
  rateTypesForWeightOfLadderRackPipesItems,
} from "./constant";
import userPriceSettings from "../helper/userPriceSettings";

export default async function TruckPricing(distance, items) {
  const { max_volume, total_weight, longest_length, palletSpaces } =
    await calculateItemsVolume(items);
  const itemCounts = await countItemsByType(items);
  const { Pipes, Ladder, Rack, Pallet } = itemCounts;
  const minute_rate = MinuteRate(distance);

  const priceSettings = await userPriceSettings();
  const resRate = priceSettings?.truckServices;
  const rate = Object.fromEntries(
    Object.entries(resRate).map(([key, value]) => [key, Number(value)])
  );

  const prices = [];

  if (Pallet.exist) {
    prices.push(await determinePalletPrice(items, Pallet, minute_rate, rate));
  }

  if (Pipes.exist || Ladder.exist || Rack.exist) {
    prices.push(
      await determineOtherItemsPriceByWeight(
        items,
        total_weight,
        minute_rate,
        rate,
        rateTypesForWeightOfLadderRackPipesItems
      )
    );
    prices.push(
      await determineOtherItemsPriceByLength(
        items,
        longest_length,
        minute_rate,
        rate,
        rateTypesForLengthOfLadderRackPipesItems
      )
    );
  } else {
    prices.push(
      await determineOtherItemsPriceByWeight(
        items,
        total_weight,
        minute_rate,
        rate,
        rateTypesForWeightOfDefault
      )
    );
    prices.push(
      await determineOtherItemsPriceByLength(
        items,
        longest_length,
        minute_rate,
        rate,
        rateTypesForLengthOfDefault
      )
    );
  }

  const maxPriceResult = prices.reduce(
    (max, current) => (current.price > max.price ? current : max),
    { price: 0 }
  );

  console.log("TruckPricing", {
    distance,
    items,
    rateTypesForWeightOfLadderRackPipesItems,
    rateTypesForLengthOfLadderRackPipesItems,
    maxPriceResult,
    prices,
    palletSpaces,
    max_volume,
    total_weight,
    longest_length,
    Pallet,
    minute_rate,
  });

  return { cost: maxPriceResult.price, costType: maxPriceResult.returnType };
}

// if (Pallet.exist) {
// }

// const { price: price1, returnType: returnType1 } = await determinePalletPrice(
//   items,
//   Pallet,
//   minute_rate,
//   rate
// );
// const { price: price2, returnType: returnType2 } =
//   await determineOtherItemsPriceByWeight(
//     items,
//     total_weight,
//     longest_length,
//     minute_rate,
//     rate
//   );
// const { price: price3, returnType: returnType3 } =
//   await determineOtherItemsPriceByLength(
//     items,
//     total_weight,
//     longest_length,
//     minute_rate,
//     rate
//   );
