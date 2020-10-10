const express = require("express");
const app = express();
const db = require("./db/mongoose");
const port = process.env.PORT;
const cors = require("cors");

db();

app.use("/avatars", express.static("src/assets/avatars"));
app.use("/causes", express.static("src/assets/causes"));
app.use(express.json());
const userRouter = require("./routes/users");
const causeRouter = require("./routes/causes");
const donationRouter = require("./routes/donation");
const paymentsRouter = require("./routes/payment");
app.use(cors());

app.use("/users", userRouter);
app.use("/causes", causeRouter);
app.use("/donations", donationRouter);
app.use("/payment", paymentsRouter);

app.listen(port, () => {
  console.log("Server started on PORT", port);
});
