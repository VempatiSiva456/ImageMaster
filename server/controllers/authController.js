const authService = require("../services/authService");

exports.register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).send(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).send({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.cookie("token_tool_user", result.token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ user: result.user });
  } catch (error) {
    const status = error.status || 400;
    res.status(status).send({ error: error.message });
  }
};

exports.verifySession = async (req, res) => {
  try {
    const token = req.cookies.token_tool_user;
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const user = await authService.verifySession(token);
    res.json({ isLoggedIn: true, user });
  } catch (error) {
    const status = error.status || 401;
    res.status(status).json({ isLoggedIn: false, error: error.message });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("token_tool_user", { httpOnly: true, sameSite: "strict" });
  res.json({ message: "Logged out successfully" });
};

exports.getUsers = async (req, res) => {
  try {
    const all_users = await authService.getUsers();
    if (!all_users.length)
    {
      throw new Error("No users found");
    }
    res.status(200).json({userResponse: all_users, current_user: req.user._id});
  }
  catch (error){
    res.status(error.status || 500).send({ error: error.message });
  }
}