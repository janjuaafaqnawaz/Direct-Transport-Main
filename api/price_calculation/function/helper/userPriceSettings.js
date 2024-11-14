import {
  fetchUserData,
  fetchUserDataByEmail,
} from "../../../firebase/functions/auth";
import { fetchDocById } from "../../../firebase/functions/fetch";

export default async function userPriceSettings(selectedEmail, global) {
  console.log("selectedEmail", selectedEmail);
  let user = {};
  let universal_price;

  try {
    user = await fetchUserData();

    // Check if we should fetch by email
    if (selectedEmail?.email) {
      user = await fetchUserDataByEmail(selectedEmail.email);
      console.log("Fetched user by email:", user);
    }

    universal_price = await fetchDocById("price_settings", "data");
    const long_distance = universal_price?.long_distance;
    const userCustomPrice = user?.CustomPrice;
    const private_price = { same_day: { ...userCustomPrice, long_distance } };
    const usingCustomPrice = user?.usePrice || false;

    const userPriceSettings = usingCustomPrice
      ? private_price
      : universal_price;

    if (usingCustomPrice) {
      console.log("Using custom price for the user:", private_price);
    } else {
      console.log("Using default universal price:", universal_price);
    }

    console.log({
      user,
      universal_price,
      private_price,
      using: userPriceSettings,
    });

    return global === true ? universal_price : userPriceSettings;
  } catch (error) {
    console.error("Error fetching user price settings:", error);
    return universal_price || {};
  }
}
