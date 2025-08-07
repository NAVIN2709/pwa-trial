const express = require("express");
const bodyParser = require("body-parser");
const webPush = require("web-push");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const vapidKeys = {
  publicKey: "BGxxRah2U1A4QyhEGTX-ea3ywPcgIHf9fjO1Kl0LzmCEb0z9Ckj2ukpOSPujZJtqruff1nYt8Zj1Wkoyy7B6IWg",
  privateKey: "gA4gTl7UlZxd0tUtrCpoL_BMwN_Y45b0sJ8UjMJEwvk"
};

webPush.setVapidDetails(
  "mailto:you@example.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

let subscriptions = [];

app.post("/subscribe", (req, res) => {
  const newSub = JSON.stringify(req.body);

  const exists = subscriptions.find((sub) => JSON.stringify(sub) === newSub);
  if (!exists) subscriptions.push(req.body);

  res.status(201).json({});
});


app.post("/notify", (req, res) => {
  const { title, body } = req.body;
  const payload = JSON.stringify({ title, body });

  subscriptions.forEach((sub) => {
    webPush.sendNotification(sub, payload).catch(console.error);
  });

  res.status(200).json({ message: "Push sent" });
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
