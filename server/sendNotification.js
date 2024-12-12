"use server";

export default async function sendNotification(expoPushToken) {
  const NewAssignedBooking = {
    to: "ExponentPushToken[lstvNiLgkwVjRjdrRvOvAc]",
    title: "Direct Transport Solution",
    body: "New booking assigned to you.",
    channelId: "new-assigned-booking",
  };

  console.log({ NewAssignedBooking });

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(NewAssignedBooking),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Error sending push notification:", data);
    } else {
      console.log("Push notification sent successfully:", data);
    }
  } catch (error) {
    console.error("Error occurred during push notification send:", error);
  }
}
