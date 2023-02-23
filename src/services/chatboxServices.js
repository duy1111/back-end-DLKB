import { response } from 'express';
import request from 'request';
require('dotenv').config();
const IMAGE_GET_STARTED =
    'https://images.unsplash.com/photo-1629909615184-74f495363b67?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGNsaW5pY3xlbnwwfHwwfHw%3D&w=1000&q=80';
let callSendApi = (sender_psid, response) => {
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
            uri: 'https://graph.facebook.com/v9.0/me/messages',
            qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
            method: 'POST',
            json: request_body,
        },
        (err, res, body) => {
            if (!err) {
                console.log(body);
            } else {
                console.error('Unable to send message:' + err);
            }
        },
    );
};

let getUserName = (sender_psid) => {
    // Construct the message body

    return new Promise((resolve, reject) => {
        request(
            {
                uri: `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${process.env.PAGE_ACCESS_TOKEN}`,
                qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
                method: 'GET',
            },
            (err, res, body) => {
                if (!err) {
                    let response = JSON.parse(body);
                    let userName = `${response.last_name} ${response.first_name}`;
                    resolve(userName);
                } else {
                    console.error('Unable to send message:' + err);
                    reject(err);
                }
            },
        );
    });
    // Send the HTTP request to the Messenger Platform
};
let handleGetStarted = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userName = await getUserName(sender_psid);
            let response1 = { text: `Xin chào mừng bạn ${userName} đến với DoctorBooking` };
            let response2 = {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'generic',
                        elements: [
                            {
                                title: 'Chào mừng bạn đến với Doctor Booking',
                                subtitle: 'Dưới đây là các lựa chọn của Doctor Booking',
                                image_url: IMAGE_GET_STARTED,
                                buttons: [
                                    {
                                        type: 'postback',
                                        title: 'XEM PHÒNG KHÁM',
                                        payload: 'VIEW_CLINIC',
                                    },

                                    {
                                        type: 'postback',
                                        title: 'ĐẶT LỊCH KHÁM',
                                        payload: 'BOOKING',
                                    },
                                    {
                                        type: 'postback',
                                        title: 'HƯỚNG DẪN SỬ DỤNG BOT',
                                        payload: 'GUIDE_TO_USER',
                                    },
                                ],
                            },
                        ],
                    },
                },
            };
            //send text messenger
            console.log('check res2', response2);
            callSendApi(sender_psid, response1);
            callSendApi(sender_psid, response2);
            //send text generic template

            resolve('done');
        } catch (e) {
            reject(e);
        }
    });
};
let sendGetStartedTemplate = () => {
    let response = {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'generic',
                elements: [
                    {
                        title: 'Chào mừng bạn đến với Doctor Booking',
                        subtitle: 'Dưới đây là các lựa chọn của Doctor Booking',
                        image_url: IMAGE_GET_STARTED,
                        buttons: [
                            {
                                type: 'postback',
                                title: 'XEM PHÒNG KHÁM',
                                payload: 'VIEW_CLINIC',
                            },
                            {
                                type: 'postback',
                                title: 'CHỌN BÁC SĨ',
                                payload: 'CHOSE_DOCTOR',
                            },
                            {
                                type: 'postback',
                                title: 'ĐẶT LỊCH KHÁM',
                                payload: 'BOOKING',
                            },
                            {
                                type: 'postback',
                                title: 'HƯỚNG DẪN SỬ DỤNG BOT',
                                payload: 'GUIDE_TO_USER',
                            },
                        ],
                    },
                ],
            },
        },
    };
    return response;
};
module.exports = {
    handleGetStarted: handleGetStarted,
};
