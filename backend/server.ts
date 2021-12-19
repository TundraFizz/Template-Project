import express, { Express } from "express";       // Express type
import bodyParser           from "body-parser";   // Allows you to read POST data
import cookieParser         from "cookie-parser"; // Cookies
import cors                 from "cors";          // CORS
import fs                   from "fs";            // File system
import * as yaml            from "js-yaml";       // Parse .yaml files
import { Database }         from "./db";
import { Config, DatabaseInfo } from "./interfaces";

// Load configuration and set the single guild that the bot will run for
const config = yaml.load(fs.readFileSync(`config-${process.env.mode}.yml`, "utf-8")) as Config; // eslint-disable-line

// Setup the database
const dbInfo: DatabaseInfo = {
  host    : config.mysql.host,
  user    : config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database
};
const db: Database = new Database(dbInfo);

// Setup the express server and listen on a port
const app: Express = express();                   // Create the server
app.use(bodyParser.json({limit: "10mb"}));        // Setting for bodyParser
app.use(bodyParser.urlencoded({extended: true})); // Setting for bodyParser
app.use(cookieParser());                          // Enable cookie parsing

// Default headers
app.use((req, res, next) => {
  // res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// CORS Configuration
app.use(cors({
  origin: [
    "https://tundra.ngrok.io"
    // "https://championmains.club",
    // "https://api.championmains.club"
  ],
  methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
  allowedHeaders: [
    "Access-Control-Allow-Origin",
    "Authorization",
    "Content-Type"
  ]
}));

app.listen(80);

export { app, config, db };

import "./website-backend"; // eslint-disable-line
