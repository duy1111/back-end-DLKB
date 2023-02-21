import db from '../models/index';
require('dotenv').config();
import CRUDservices from '../services/CRUDservices';
import request from 'request';
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
    let VERYFY_TOKEN = process.env.VERYFY_TOKEN;
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
            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
};

// Handles messages events
function handleMessage(sender_psid, received_message) {
    let response;

    // Check if the message contains text
    if (received_message.text) {
        // Create the payload for a basic text message
        response = {
            text: `You sent the message: "${received_message.text}". Now send me an image!`,
        };
    }

    // Sends the response message
    callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        recipient: {
            id: sender_psid,
        },
        message: response,
    };

    // Send the HTTP request to the Messenger Platform
    request(
        {
            uri: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
            method: 'POST',
            json: request_body,
        },
        (err, res, body) => {
            if (!err) {
                console.log('message sent!');
            } else {
                console.error('Unable to send message:' + err);
            }
        },
    );
}
export { getCRUD, postCRUD, displayCRUD, getEditUser, getDeleteUser, putUser, getWebhook, postWebhook };
export default getHomePage;
