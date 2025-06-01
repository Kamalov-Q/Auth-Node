const express = require("express");
const router = require("./routes/auth.route");
const { config } = require("dotenv");
const cors = require("cors");
const bodyChecker = require("./middlewares/bodyChecker");
const swaggerUi = require("swagger-ui-express");
const { swaggerDocs } = require("./config/swagger.config");

config();

//Initialize express
const app = express();

//Configure body parser
app.use(express.json());

app.use(cors({ origin: "*" }));

// app.use(bodyChecker);

const PORT = process.env.PORT || 3000;

app.use("/api/auth", router);

app.get("/", async (_, res) => {
  res.send("Working fine!");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// app.get("/users", async (req, res) => {
//   try {
//     const user = await users.find({});
//     return res
//       .status(200)
//       .json({ message: "All users", allUsers: user, count: user.length });
//   } catch (error) {``
//     console.error(error);
//     return res
//       .status(500)
//       .json({ message: `Internal Server Error : ${error.message}` });
//   }
// });

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
});
