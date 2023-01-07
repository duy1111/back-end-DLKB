import db from '../models/index';
import CRUDservices from '../services/CRUDservices'
async function getHomePage(req, res) {
    try {
        let data = await db.User.findAll();
       
        return res.render('homePage.ejs', { data: JSON.stringify(data) });
    } catch (e) {
        console.log(e);
    }
}
async function getCRUD(req,res) {
    //return res.send('get CRUD');
    return res.render('crud.ejs')
}
async function postCRUD(req,res){
    let message = await CRUDservices.createNewUser(req.body)

    return res.send('post crud')
}
let displayCRUD = async (req,res) =>{
    console.log(req.params)
    let data = await CRUDservices.readUser(req.params)
    
    return res.render('displayCRUD.ejs',{dataUser:data})
}
let getEditUser = async (req,res) =>{
    
    
    
    var Id = await req.params.id
    if(Id){

        let data = await CRUDservices.getEditUserId(Id)
       
        //check data not found
        return res.render('editCRUD.ejs',{dataUser:data})
    }
    else{
        return res.send('is not found')
    }
    
    
}
async function putUser(req, res) {
    let data = req.body;
    let allUser = await CRUDservices.updateUserData(data);
    //console.log(allUser)
    return res.render('editCRUD.ejs',{dataUser:allUser})
    //return res.send('success')
   
}
let getDeleteUser  = async (req,res) =>{
    let id = req.query.id
    await CRUDservices.deleteUserById(id);
    console.log(id)
    return res.send("delete user")
}
export  {getCRUD, postCRUD,displayCRUD,getEditUser,getDeleteUser,putUser};
export default getHomePage;
