import axios from 'axios';

export default function NotifyUser(subID, title, message) {
  const res = axios.post(
    `https://app.nativenotify.com/api/indie/notification`,
    {
      subID: subID,
      appId: 23360,
      appToken: "EDyy2v4fu4kYBij5jdIdYd",
      title: title,
      message: message,
    }
  );

  console.log(res);

  return res;
}
