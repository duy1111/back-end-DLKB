import db from '../models/index';
import CRUDservices from '../services/CRUDservices'
async function getHomePage(req, res) {
    try {
        let data = await db.User.findAll();
        console.log(data);
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
    console.log(message)
    return res.send('post crud')
}
export  {getCRUD, postCRUD};
export default getHomePage;
