import express from 'express';
import getHomePage from '../controller/homeController'
let router = express.Router();

function initWebRoutes(app) {
    router.get('/', getHomePage)
    return app.use("/", router);
}

export default initWebRoutes;