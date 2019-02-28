const userRoutes = require("./users");
const projectRoutes = require("./project");

const constructorMethod = app => {
  app.use("/", userRoutes);
  // app.use("/", projectRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;