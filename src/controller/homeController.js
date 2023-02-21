import db from '../models/index';
require('dotenv').config();
import CRUDservices from '../services/CRUDservices';
async function getHomePage(req, res) {
    try {
        let data = await db.User.findAll({
            attributes: { exclude: ['image'] },
        });

        return res.render('homePage.ejs', { data: JSON.stringify(data) });
    } catch (e) {
        console.log(e);
    }
}
async function getCRUD(req, res) {
    //return res.send('get CRUD');
    return res.render('crud.ejs');
}
async function postCRUD(req, res) {
    let message = await CRUDservices.createNewUser(req.body);

    return res.send('post crud');
}
let displayCRUD = async (req, res) => {
    let data = await CRUDservices.readUser(req.params);

    return res.render('displayCRUD.ejs', { dataUser: data });
};
let getEditUser = async (req, res) => {
    var Id = await req.params.id;
    if (Id) {
        let data = await CRUDservices.getEditUserId(Id);

        //check data not found
        return res.render('editCRUD.ejs', { dataUser: data });
    } else {
        return res.send('is not found');
    }
};
async function putUser(req, res) {
    let data = req.body;
    let allUser = await CRUDservices.updateUserData(data);
    //console.log(allUser)
    return res.render('editCRUD.ejs', { dataUser: allUser });
    //return res.send('success')
}
let getDeleteUser = async (req, res) => {
    let id = req.query.id;
    await CRUDservices.deleteUserById(id);
    console.log(id);
    return res.send('delete user');
};

let getWebhook = async (req, res) => {

    let VERYFY_TOKEN = process.env.VERYFY_TOKEN
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Check if a token and mode is in the query string of the request
    if (mode && token) {
        // Check the mode and token sent is correct
        if (mode === 'subscribe' && token === VERYFY_TOKEN) {
            // Respond with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            // Respond with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
};
let postWebhook = async (req, res) => {
    // Parse the request body from the POST
    let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {
        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {
            // Get the webhook event. entry.messaging is an array, but
            // will only ever contain one event, so we get index 0
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);
        });

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
};
export { getCRUD, postCRUD, displayCRUD, getEditUser, getDeleteUser, putUser, getWebhook, postWebhook };
export default getHomePage;
