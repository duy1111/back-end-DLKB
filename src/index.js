import  express  from "express";
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
var bodyParser = require('body-parser')
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./router/web";
import connectDB from "./config/connectDB"
dotenv.config();

let app = express();



// parse application/json
app.use(bodyParser.json())


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))


//config app
configViewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 6969;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});