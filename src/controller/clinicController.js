import clinicService from '../services/clinicService';

let createClinic = async(req,res) =>{
    try {
        let data = await clinicService.createClinic(req.body);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            errCode: -1,
            message: 'Error from server...',
        });
    }
}

let getAllClinic = async(req,res) =>{
    try {
        let data = await clinicService.getAllClinic();
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            errCode: -1,
            message: 'Error from server...',
        });
    }
}
let getDetailClinicById = async(req,res) =>{
    try {
        console.log('check clinicId',req.query.clinicId)
        let data = await clinicService.getDetailClinicById(req.query.clinicId);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            errCode: -1,
            message: 'Error from server...',
        });
    }
}

let handleDeleteClinic = async(req,res) => {
    try{
        let data = await clinicService.handleDeleteClinic(req.body.id);
        return res.status(200).json(data);
    }catch(e){
        console.log(e);
        return res.status(400).json({
            errCode: -1,
            message: 'Error from server...',
        });
    }
}

let handleUpdateClinic = async(req,res) => {
    try{
        let data = await clinicService.handleUpdateClinic(req.body);
        return res.status(200).json(data);
    }catch(e){
        console.log(e);
        return res.status(400).json({
            errCode: -1,
            message: 'Error from server...',
        });
    }
}
module.exports = {
    createClinic:createClinic,
    getAllClinic:getAllClinic,
    getDetailClinicById:getDetailClinicById,
    handleDeleteClinic:handleDeleteClinic,
    handleUpdateClinic:handleUpdateClinic,
}