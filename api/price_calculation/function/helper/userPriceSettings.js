import {
  fetchUserData,
  fetchUserDataByEmail,
} from "../../../firebase/functions/auth";
import { fetchDocById } from "../../../firebase/functions/fetch";
export default async function userPriceSettings(selectedEmail) {
  console.log("selectedEmail", selectedEmail);
  let user = {};

  try {
    user = await fetchUserData();

    // Check if we should fetch by email
    if (selectedEmail?.email) {
      user = await fetchUserDataByEmail(selectedEmail.email);
      console.log("Fetched user by email:", user);
    }

    const universal_price = await fetchDocById("price_settings", "data");
    const long_distance = universal_price?.long_distance;
    const private_price =
      {
        ...(user?.CustomPrice || {}),
        long_distance,
      } || universal_price;
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

    return userPriceSettings;
  } catch (error) {
    console.error("Error fetching user price settings:", error);
    throw error;
  }
}
