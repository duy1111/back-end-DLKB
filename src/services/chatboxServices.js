import { response } from 'express';
import db from '../models/index';

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
// let sendGetStartedTemplate = () => {
//     let response = {
//         attachment: {
//             type: 'template',
//             payload: {
//                 template_type: 'generic',
//                 elements: [
//                     {
//                         title: 'Chào mừng bạn đến với Doctor Booking',
//                         subtitle: 'Dưới đây là các lựa chọn của Doctor Booking',
//                         image_url: IMAGE_GET_STARTED,
//                         buttons: [
//                             {
//                                 type: 'postback',
//                                 title: 'XEM PHÒNG KHÁM',
//                                 payload: 'VIEW_CLINIC',
//                             },
//                             {
//                                 type: 'postback',
//                                 title: 'CHỌN BÁC SĨ',
//                                 payload: 'CHOSE_DOCTOR',
//                             },
//                             {
//                                 type: 'postback',
//                                 title: 'ĐẶT LỊCH KHÁM',
//                                 payload: 'BOOKING',
//                             },
//                             {
//                                 type: 'postback',
//                                 title: 'HƯỚNG DẪN SỬ DỤNG BOT',
//                                 payload: 'GUIDE_TO_USER',
//                             },
//                         ],
//                     },
//                 ],
//             },
//         },
//     };
//     return response;
// };
let handleBooking = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userName = await getUserName(sender_psid);
            let response = {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'generic',
                        elements: [
                            {
                                title: 'Chào mừng bạn đến với Doctor Booking',
                                subtitle: 'Dưới đây là các bác sĩ nổi bật theo khu vực',
                                image_url:
                                    'https://plus.unsplash.com/premium_photo-1664475521860-71798f722489?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2xpbmljfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
                                buttons: [
                                    {
                                        type: 'postback',
                                        title: 'HÀ NỘI',
                                        payload: 'DOCTOR_HANOI',
                                    },

                                    {
                                        type: 'postback',
                                        title: 'ĐÀ NẴNG',
                                        payload: 'DOCTOR_DANANG',
                                    },
                                    {
                                        type: 'postback',
                                        title: 'HỒ CHÍ MINH',
                                        payload: 'DOCTOR_HCM',
                                    },
                                ],
                            },
                            {
                                title: 'Chào mừng bạn đến với Doctor Booking',
                                subtitle: 'Dưới đây là các phòng khám nổi bật theo khu vực',
                                image_url:
                                    'https://media.istockphoto.com/id/954802966/photo/healthcare-photos.jpg?s=612x612&w=0&k=20&c=DlouWo1_kZGmDwylkTElgkQUMWhFAy62D8BoyGiZX_0=',
                                buttons: [
                                    {
                                        type: 'postback',
                                        title: 'HÀ NỘI',
                                        payload: 'CLINIC_HANOI',
                                    },

                                    {
                                        type: 'postback',
                                        title: 'ĐÀ NẴNG',
                                        payload: 'CLINIC_DANANG',
                                    },
                                    {
                                        type: 'postback',
                                        title: 'HỒ CHÍ MINH',
                                        payload: 'CLINIC_HCM',
                                    },
                                ],
                            },
                            {
                                title: 'Chào mừng bạn đến với Doctor Booking',
                                subtitle:
                                    'Doctor booking có rất nhiều chuyên khoa với sự phục vụ từ hơn 1000 bác sĩ trãi dài trên khắp Việt Nam. Hứa hẹn sẽ phục vụ bạn thật chu đáo',
                                image_url: IMAGE_GET_STARTED,
                                buttons: [
                                    {
                                        type: 'postback',
                                        title: 'Xem chi tiết',
                                        payload: 'VIEW_SPECIALTY',
                                    },
                                ],
                            },
                        ],
                    },
                },
            };
            callSendApi(sender_psid, response);
            resolve(response);
        } catch (e) {
            reject(e);
        }
    });
};
let dataTopDoctor = (provinceId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.Doctor_Infor.findAll({
                limit: 5,
                where: { provinceId: provinceId },

                attributes: ['doctorId', 'provinceId'],
                raw: true,
            });
            let topDoctor = [];
            let length = users.length;
            console.log('check lenghth', length);
            await users.map(async (item, index) => {
                let obj = {};
                let doctor = await db.User.findOne({
                    where: { id: item.doctorId },
                    raw: true,
                });

                obj = { ...item, ...doctor };
                topDoctor.push(obj);
                length--;
                
                if (length === 0) {
                  
                    resolve({
                        data: topDoctor,
                    });
                }
                return item;
            });
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};
let handleTopDoctor = (sender_psid, provinceId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await dataTopDoctor(provinceId);
            let province = '';
            if (provinceId === 'PRO1') {
                province = 'Hà Nội';
            } else if (province === 'PRO2') {
                province = 'Hồ Chí Minh';
            } else if (province === 'PRO3') {
                province = 'Đà Nẵng';
            }
            let response = {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'generic',
                        elements: [
                            data.map((item, index) => {
                                return({
                                    title: `Dưới đây là các bác sĩ nổi bật ở ${province}`,
                                    subtitle: `Bác sĩ ${item.name}`,
                                    image_url:
                                        'https://plus.unsplash.com/premium_photo-1664475521860-71798f722489?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2xpbmljfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
                                    buttons: [
                                        {
                                            type: 'postback',
                                            title: 'XEM CHI TIẾT',
                                            payload: 'VIEW_DETAIL_DOCTOR',
                                        },
                                    ],
                                });
                            }),
                        ],
                    },
                },
            };
            console.log('check ré doctor top',response)
            callSendApi(sender_psid,response)
            resolve('done')
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = {
    handleGetStarted: handleGetStarted,
    handleBooking: handleBooking,
    handleTopDoctor: handleTopDoctor,
};
