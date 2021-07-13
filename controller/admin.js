const Admin = require("../model/Admin");
const Customer = require("../model/Customer");

exports.register = async function (req, res) {
  const { username, password, name } = req.body;
  try {
    const admin = new Admin({
      username,
      password,
      name,
    });
    await admin.save();
    return res.status(200).send({ message: "Admin Create success" });
  } catch (error) {
    return res.status(400).send({ message: "Admin Create Customer fail", error });
  }
};

// GET api/admin/list
// GET List customer
exports.getAllCustomer = async (req, res) => {
  try {
    const list = await Customer.find();
    res.status(200).send({ data: list });
  } catch (error) {
    res.status(400).send({ message: "customer not found", error });
  }
};

// POST api/admin/create
// Create Customer in admin dashboard
exports.createCustomer = async (req, res) => {
  const { username, password, firstName, lastName, email } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: "Missing username or password" });

  try {
    const user = await Customer.findOne({ username });
    if (user) return res.status(400).json({ success: false, message: "Username already taken" });

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

// Put api/admin/:id customer
// Update Customer in admin dashboard

exports.updateCustomer = async (req, res) => {
  const { firstName, lastName, email } = req.body;

  try {
    let updatedUser = {
      firstName: firstName || "",
      lastName: lastName || "",
      email: email || "",
    };

    const userUpdateCustomer = { _id: req.params.id, user: req.userId };

    updatedUser = await Customer.findOneAndUpdate(userUpdateCustomer, updatedUser, {
      new: true,
    });

    //User not authorized not update post or post not found
    if (!updatedUser) return res.status(500).json({ success: false, message: "User not found or user not authorized" });

    res.json({ success: true, message: "Excellent Progress", post: updatedUser });
  } catch (error) {
    res.status(400).json({ success: false, message: "Internal server error" });
  }
};

// DELETE api/delete/id
// Delete post

exports.deleteCustomer = async (req, res) => {
  try {
    // const postDeleteCondition = { _id: req.params.id};
    const postDeleteCondition = { _id: req.params.id };
    const deletedPost = await Customer.findOneAndDelete(postDeleteCondition);
    // User not authorized or post not found
    if (!deletedPost)
      //
      //400 đưa dữ liệu vào (request body) sai
      //404 api sai tên
      //401 ko có quyền truy cap api
      //500 server
      return res.status(500).json({
        success: false,
        message: "Customer not found or user not authorized",
      });

    res.json({ success: true, postId: deletedPost._id });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Internal server error" });
  }
};
