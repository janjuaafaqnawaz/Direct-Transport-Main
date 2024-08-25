import { fetchUserData } from "../../../firebase/functions/auth";
import { fetchDocById } from "../../../firebase/functions/fetch";

export default async function userPriceSettings() {
  const universal_price = await fetchDocById("price_settings", "data");
  const user = await fetchUserData();
  const private_price = user?.priceSettings;

  const userPriceSettings = user?.usePrice ? private_price : universal_price;

  console.log(
    "Using",
    user?.usePrice ? "private_price_settings" : "universal_price_settings",
    "usePrice",
    user?.usePrice
  );

  return userPriceSettings;
}
