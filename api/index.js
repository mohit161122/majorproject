const { app, connectDB } = require("../app");

module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Vercel handler error:", error);
    return res.status(500).send("Internal Server Error");
  }
};
