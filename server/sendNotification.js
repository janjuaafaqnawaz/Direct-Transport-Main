"use server";

export default async function sendNotification(expoPushToken) {
  const NewAssignedBooking = {
    to: expoPushToken,
    sound: "notification.wav",
    title: "Direct Transport Solution",
    body: "New booking assigned to you.",
    sound: "notification.wav",
    channelId: "new-assigned-booking",
  };

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
