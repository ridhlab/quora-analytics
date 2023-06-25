import express from "express";
import bodyParser from "body-parser";
import profileRouter from "./modules/profile/controller";

const port = 3333;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/profile", profileRouter);

app.listen(port, () => {
  console.log("Server is running in port " + port);
});
