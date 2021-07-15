const axios = require("axios");

const EXPO_SERVER_URL = "https://exp.host/--/api/v2/push/send";

exports.sendPushNotification = async (token, body, data = {}) => {
  const message = {
    to: token,
    sound: "default",
    title: "MT Hospital Booking",
    body,
    data,
  };
  return await axios.post(EXPO_SERVER_URL, message);
};
