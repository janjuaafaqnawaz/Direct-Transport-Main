"use server";

export async function sendCustomNotification(
  expoPushToken,
  title,
  description
) {
  try {
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      cache: "no-store",
      body: JSON.stringify({
        expoPushToken: expoPushToken,
        title: title,
        description: description,
        channelId: "default",
      }),
    };

    const url = `https://direct-transport-server.vercel.app/api/notifications/custom_notification`;
    console.log(`Sending notification request to: ${url}`);

    const response = await fetch(url, requestOptions, {
      next: { revalidate: 0 },
    });
    console.log(response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.text();
    console.log("Notification sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
}
