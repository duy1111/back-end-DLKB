import specialtyServices from '../services/specialtyServices';
let createSpecialty = async(req,res) =>{
    try {
        let data = await specialtyServices.createSpecialty(req.body);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            errCode: -1,
            message: 'Error from server...',
        });
    }
}

let getAllSpecialty = async(req,res) =>{
    try {
        let data = await specialtyServices.getAllSpecialty();
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            errCode: -1,
            message: 'Error from server...',
        });
    }
}
let getDetailSpecialtyById = async(req,res) => {
    try {
        let data = await specialtyServices.getDetailSpecialtyById(req.query.specialtyId, req.query.location);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            errCode: -1,
            message: 'Error from server...',
        });
    }
}
module.exports = {
    createSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById
}