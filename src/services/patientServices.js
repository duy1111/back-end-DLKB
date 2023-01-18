import db from '../models/index';
import _ from 'lodash';
require('dotenv').config();
let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date) {
                resolve({
                    errCode: 1,
                    message: 'Missing parameter!',
                });
            } else {
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    attributes: { exclude: ['password', 'image'] },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        password: '123456',
                    },
                });
                if (user && user[0]) {
                    await db.bookings.findOrCreate({
                        where: {
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            doctorId: data.doctorId,
                        },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
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

module.exports = {
    postBookAppointment: postBookAppointment,
};
