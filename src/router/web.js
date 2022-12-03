import express from 'express';
import getHomePage, { getCRUD ,postCRUD,displayCRUD,getEditUser,getDeleteUser,putUser} from '../controller/homeController'
let router = express.Router();

function initWebRoutes(app) {
    router.get('/', getHomePage)
    router.get('/crud',getCRUD)
    router.post('/post-crud',postCRUD)
    router.get('/get-crud',displayCRUD)
    router.get('/edit-user/:id', getEditUser);
    router.post('/update-user', putUser);
    router.post('/delete-user/', getDeleteUser);
    
    return app.use("/", router);
}

export default initWebRoutes;