import db from '../models/index';
import _ from 'lodash';
require('dotenv').config();
var bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
import emailServices from './emailServices';
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorId, token) => {
    // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&&doctorId=${doctorId}`;
    return result;
};
let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            
            if (!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullName || !data.dateBooking) {
                resolve({
                    errCode: 1,
                    message: 'Missing parameter!',
                });
            } else {
                let token = uuidv4();

                await emailServices.sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token),
                });
                let hashPasswordFromBcrypt = await hashUserPassword('123456');
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    attributes: { exclude: ['password', 'image'] },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        password: hashPasswordFromBcrypt,
                        address: data.address,
                        gender: data.gender,
                        firstName: data.fullName,
                    },
                });
                if (user && user[0]) {
                    await db.bookings.findOrCreate({
                        where: {
                            patientId: user[0].id,
                            dayBooking: data.dateBooking,
                            timeType: data.timeType,
                            doctorId: data.doctorId,
                        },
                       
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token,
                            dayBooking: data.dateBooking,
                        },
                    });
                }
                resolve({
                    errCode: 0,
                    message: 'ok',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    });
};
let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    message: 'Missing parameter!',
                });
            } else {
                let appointment = await db.bookings.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1',
                    },
                    raw: false,
                });
                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        message: 'update the appointment succeed!',
                    });
                } else {
                    resolve({
                        errCode: 2,
                        message: 'Appointment has been activated or does not exist!',
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
};
