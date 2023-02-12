import express from 'express';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
var bodyParser = require('body-parser');
import configViewEngine from './config/viewEngine';
import initWebRoutes from './router/web';
import connectDB from './config/connectDB';
dotenv.config();
//var cors = require('cors');
let app = express();

// parse application/json
app.use(bodyParser.json({ limit: '50mb' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));

//app.use(cors());
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Verify that the callback came from Facebook.
// function verifyRequestSignature(req, res, buf) {
//     var signature = req.headers["x-hub-signature-256"];

//     if (!signature) {
//       console.warn(`Couldn't find "x-hub-signature-256" in headers.`);
//     } else {
//       var elements = signature.split("=");
//       var signatureHash = elements[1];
//       var expectedHash = crypto
//         .createHmac("sha256", config.appSecret)
//         .update(buf)
//         .digest("hex");
//       if (signatureHash != expectedHash) {
//         throw new Error("Couldn't validate the request signature.");
//       }
//     }
//   }
//config app
configViewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 6969;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
