import express from 'express';
import getHomePage, {
    getCRUD,
    postCRUD,
    displayCRUD,
    getEditUser,
    getDeleteUser,
    putUser,
} from '../controller/homeController';
import userController from '../controller/userController';
import doctorController from '../controller/doctorController';
let router = express.Router();

function initWebRoutes(app) {
    router.get('/', getHomePage);
    router.get('/crud', getCRUD);
    router.post('/post-crud', postCRUD);
    router.get('/get-crud', displayCRUD);
    router.get('/edit-user/:id', getEditUser);
    router.post('/update-user', putUser);
    router.post('/delete-user/', getDeleteUser);
    //api
    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-user', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/update-user', userController.handleUpdateUser);
    router.delete('/api/delete-user',userController.handleDeleteUser);
    router.get('/api/top-doctor-home',doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctor',doctorController.getAllDoctors);
    router.post('/api/save-info-doctor',doctorController.postInfoDoctor)

    router.get('/api/allCode', userController.getAllCode);
    return app.use('/', router);
}

export default initWebRoutes;
