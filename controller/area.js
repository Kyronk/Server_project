const Area = require("../model/Area");

exports.createArea = async (req, res) => {
  try {
    const { name, description } = req.body;
    const area = new Area({
      name,
      description,
    });
    await area.save();
    return res.status(200).send({ success: true, message: "Tạo thành công" });
  } catch (error) {
    return res.status(400).send({ success: false, message: "Lỗi , vui lòng thử lại sau", error });
  }
};
