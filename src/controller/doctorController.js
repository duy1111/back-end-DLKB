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

module.exports = {
    getTopDoctorHome:getTopDoctorHome
}