const axios = require("axios");

const EXPO_SERVER_URL = "https://fcm.googleapis.com/fcm/send";
const config = {
  headers: {
    Authorization: `key=AAAAn27G_ZA:APA91bHsajjHn2JzqYxdXaV2fdamt1SQs-EiXMshnDHmuD1O5TocT8Ty-MzMP8tunHhybuZJD-agvoUf8WVb93diDfBfjAieCQYYSVYTWxK373gtkAPknyenJ97nieouNQJHJ-tDAyc-`,
  },
};
exports.sendPushNotification = async (token, message, data) => {
  const notiData = {
    to: token,
    priority: "normal",
    sound: "default",
    title: "MT Hospital Booking",
    data: {
      experienceId: "@kingcooker/mt-hospital",
      title: "MT Hospital Booking",
      message: message,
      body: data,
    },
  };
  return await axios.post(EXPO_SERVER_URL, notiData, config);
};
