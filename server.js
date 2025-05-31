const express = require("express");

//Initialize express
const app = express();

//Configure body parser
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", async (_, res) => {
  res.send("Working fine!");
});

app.listen(3000, () => console.log(`Server started on port ${PORT}`));
