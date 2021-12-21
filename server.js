const PORT = 9001;
const express = require("express");
const history = require("connect-history-api-fallback");
const cors = require("cors");
const compression = require("compression");
const staticFileMiddleware = express.static("dist");
const app = express();

function shouldCompress (req, res) {
  if (req.headers["x-no-compression"]) {
    // Don't compress responses with this request header
    return false;
  }

  // Fallback to standard filter function
  return compression.filter(req, res);
}

app.use(compression({filter: shouldCompress}));
app.use(cors({
  origin: [
    "https://tundra.ngrok.io"
  ],
  methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
  allowedHeaders: [
    "Access-Control-Allow-Origin",
    "X-Requested-With",
    "Authorization",
    "Content-Type",
    "Accept",
    "Origin"
  ]
}));

app.use(staticFileMiddleware);            // Unredirected requests
app.use(history({disableDotRule: true})); // Use the history api
app.use(staticFileMiddleware);            // Redirected requests

app.get("/", (req, res) => {
  res.render("dist/index.html");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
