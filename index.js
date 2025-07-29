const express = require("express");
const { RtcTokenBuilder, RtcRole } = require("agora-token");

const app = express();
const APP_ID = "ed12d9744e874771ab5ed509c6a37b26"; // Your Agora APP_ID
const APP_CERTIFICATE = "5f49386f23fe4047a093e593b6cdf8d9"; // Your Agora APP_CERTIFICATE
const PORT = process.env.PORT || 3000;

const nocache = (req, res, next) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
};

app.get("/access_token", [nocache], (req, res) => {
  const { channelName, uid, role, expiry } = req.query;
  if (!channelName) {
    return res.status(400).json({ error: "channelName is required" });
  }

  const parsedUid = uid ? parseInt(uid) : 0;
  const parsedRole =
    role === "publisher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
  const parsedExpiry = expiry ? parseInt(expiry) : 3600;

  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTime + parsedExpiry;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    parsedUid,
    parsedRole,
    privilegeExpiredTs
  );
  res.json({ token });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
