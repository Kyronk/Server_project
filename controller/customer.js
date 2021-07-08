const Customer = require("../model/Customer");
const jwt = require("jsonwebtoken");

// Register Customer
exports.register = async function (req, res) {
  const { username, password, firstName, lastName, email } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing username or password" });
  
  try {
    const user = await Customer.findOne({ username });
    if (user)
      return res
        .status(400)
        .json({ success: false, message: "Username already taken" });

    const newUser = new Customer({
      username,
      password,
      firstName,
      lastName,
      email,
    });
    await newUser.save();


    res.json({
      success: true,
      message: "user created successfully",
    });
  } catch (error) {
    return res.status(400).send({ message: "Create Customer fail", error });
  }
};


// Get Customer
// exports.getAllCustomer = async (req, res) => {
//   try {
//     const list = await Customer.find();
//     res.status(200).send({ data: list });
//   } catch (error) {
//     res.status(400).send({ message: "customer not found", error });
//   }
// };



