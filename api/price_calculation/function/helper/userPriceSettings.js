import { fetchUserData } from "../../../firebase/functions/auth";
import { fetchDocById } from "../../../firebase/functions/fetch";

export default async function userPriceSettings(type) {
  const universal_price = await fetchDocById("price_settings", "data");
  const user = await fetchUserData();
  const private_price = user?.CustomPrice;

  const universal_price_fix = type ? universal_price[type] : universal_price;

  const userPriceSettings = user?.usePrice
    ? private_price
    : universal_price_fix;

  console.log({
    type,
    user,
    universal_price,
    private_price,
    using: userPriceSettings,
  });

  return userPriceSettings;
}
