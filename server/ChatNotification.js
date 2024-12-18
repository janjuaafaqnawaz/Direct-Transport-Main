"use server";

export async function ChatNotification(expoPushToken, message) {
  try {
    const payload = {
      to: expoPushToken,
      title: "DTS Chat Notification",
      body: message,
    };

    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to send alert. Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
}
