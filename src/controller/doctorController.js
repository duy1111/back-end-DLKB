import doctorServices from '../services/doctorServices'

let getTopDoctorHome = async(req,res) => {
    let limit = req.query.limit;
    if(!limit) limit =10;
    try{
        let data = await doctorServices.getTopDoctorHome(parseInt(limit));
        return res.status(200).json({
            errCode:0,
            errMessage:'ok',
            data
        })
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode : -1,
            message:'Error from server...'
        })
    }
}
let getAllDoctors = async(req,res) => {
    try{
        let doctors = await doctorServices.getAllDoctors()
        return res.status(200).json(doctors)
    }
    catch(e){
        console.log(e);
        return res.status(200).json({
            errCode : -1,
            message:'Error from server...'
        })
    }
}
let postInfoDoctor = async(req,res) => {
    //console.log('check req.body',req.body)
    try{
        let data = await doctorServices.saveDetailInfoDoctor(req.body);
        return res.status(200).json(data)
    }
    catch(e){
        console.log(e)
        return res.status(400).json({
            errCode : -1,
            message:'Error from server...'
        })
    }
}
let getDetailDoctorById = async(req,res) => {
    try{
        let info = await doctorServices.getDetailDoctorById(req.query.id);
        return res.status(200).json(info)
    }
    catch(e){
        console.log(e)
        return res.status(400).json({
            errCode : -1,
            message:'Error from server...'
        })
    }
}
module.exports = {
    getTopDoctorHome:getTopDoctorHome,
    getAllDoctors:getAllDoctors,
    postInfoDoctor:postInfoDoctor,
    getDetailDoctorById:getDetailDoctorById,
}