import express from 'express';

import getHomePage, {
    getCRUD,
    postCRUD,
    displayCRUD,
    getEditUser,
    getDeleteUser,
    putUser,
    postWebhook,
    getWebhook,
    setupProfile,
    setupPersistentMenu,
} from '../controller/homeController';
import userController from '../controller/userController';
import doctorController from '../controller/doctorController';
import patientController from '../controller/patientController';
import specialtyController from '../controller/specialtyController';
import clinicController from '../controller/clinicController';
import authController from '../controller/authController';
import handleController from '../controller/handbookController';
import middlewareController from '../controller/middlewareController';

let router = express.Router();

function initWebRoutes(app) {
    //test search

    

    router.get('/', getHomePage);
    router.post('/setup-profile', setupProfile);
    router.post('/setup-persistent-menu', setupPersistentMenu);
    router.get('/crud', getCRUD);
    router.post('/post-crud', postCRUD);
    router.get('/get-crud', displayCRUD);
    router.get('/edit-user/:id', getEditUser);
    router.post('/update-user', putUser);
    router.post('/delete-user/', getDeleteUser);
    router.post('/webhook', postWebhook);
    router.get('/webhook', getWebhook);

    //api
    router.get('/test/top-doctor', userController.test);
    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-user', middlewareController.checkTokenAdmin, userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/update-user', userController.handleUpdateUser);
    router.delete('/api/delete-user', middlewareController.verifyTokenAndAdminAuth, userController.handleDeleteUser);
    router.get('/api/allCode', userController.getAllCode);
    router.post('/api/refresh', userController.requestRefreshToken);
    router.post('/api/logout', middlewareController.verifyToken, authController.userLogout);
    router.post('/api/register', userController.handleRegister)

    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctor', doctorController.getAllDoctors);
    router.get('/api/get-doctor-search',doctorController.getDoctorSearch)
    router.post('/api/save-info-doctor', doctorController.postInfoDoctor);
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);
    router.get('/api/get-extra-info-doctor-by-id', doctorController.getExtraInfoDoctorById);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);

    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor);
    router.post('/api/send-remedy', doctorController.sendRemedy);

    router.post('/api/patient-book-appointment', patientController.postBookAppointment);
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment);

    router.post('/api/create-new-specialty', specialtyController.createSpecialty);
    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty);
    router.get('/apt/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);
    router.delete('/api/delete-specialty', specialtyController.handleDeleteSpecialty);
    router.put('/api/update-specialty', specialtyController.handleUpdateSpecialty);

    router.post('/api/create-new-clinic', clinicController.createClinic);
    router.get('/api/get-all-clinic', clinicController.getAllClinic);
    router.get('/apt/get-detail-clinic-by-id', clinicController.getDetailClinicById);
    router.delete('/api/delete-clinic', clinicController.handleDeleteClinic);
    router.put('/api/update-clinic', clinicController.handleUpdateClinic);

    router.post('/api/create-new-handbook', handleController.createHandbook);
    router.get('/api/get-all-handbook', handleController.getAllHandbook);
    router.get('/apt/get-detail-handbook-by-id', handleController.getDetailHandbookById);
    router.put('/api/update-handbook', handleController.handleUpdateHandbook);
    router.delete('/api/delete-handbook', handleController.handleDeleteHandbook);

    router.get('/api/get-handbook-not-approved-yet', handleController.handbookNotApprovedYet);
    router.post('/api/post-handbook-approved-yet', handleController.handbookApprovedYet);
    router.get('/api/get-handbook-done-handbook', handleController.DoneHandbook);

    return app.use('/', router);
}

export default initWebRoutes;
