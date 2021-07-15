exports.genarateOTP = () => {
  const now = new Date();
  const expired = new Date(now.getTime() + 900 * 1000);
  const code = Math.random().toString().slice(2, 6);
  return { expired, code };
};
