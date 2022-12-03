import express from 'express';
import getHomePage, { getCRUD ,postCRUD} from '../controller/homeController'
let router = express.Router();

function initWebRoutes(app) {
    router.get('/', getHomePage)
    router.get('/crud',getCRUD)
    router.post('/post-crud',postCRUD)
    return app.use("/", router);
}

export default initWebRoutes;