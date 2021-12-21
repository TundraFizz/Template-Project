import { app, config, db } from "./server";
import axios from "axios";

axios.defaults.validateStatus = ():boolean => {return true;};

app.post("/testing", async (req, res) => {
  const response = await axios.get("https://api.ipify.org/?format=json");
  const sample2  = await db.SampleSelect();
  const data     = {
    sample1: response.data,
    sample2: sample2,
    sample3: config.ENVIRONMENT
  };

  res.status(200).send(data);
});
