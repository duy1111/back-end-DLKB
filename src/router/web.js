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
import patientController from '../controller/patientController'
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
    router.get('/api/allCode', userController.getAllCode);


    router.get('/api/top-doctor-home',doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctor',doctorController.getAllDoctors);
    router.post('/api/save-info-doctor',doctorController.postInfoDoctor)
    router.get('/api/get-detail-doctor-by-id',doctorController.getDetailDoctorById)
    router.post('/api/bulk-create-schedule',doctorController.bulkCreateSchedule)
    router.get('/api/get-schedule-doctor-by-date',doctorController.getScheduleByDate)
    router.get('/api/get-extra-info-doctor-by-id',doctorController.getExtraInfoDoctorById)
    router.get('/api/get-profile-doctor-by-id',doctorController.getProfileDoctorById)


    router.post('/api/patient-book-appointment',patientController.postBookAppointment)
    return app.use('/', router);
}

export default initWebRoutes;
