import patientServices from '../services/patientServices';
let postBookAppointment = async(req,res) =>{
    try{
        
        let data = await patientServices.postBookAppointment(req.body);
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

module.exports ={
    postBookAppointment:postBookAppointment
}