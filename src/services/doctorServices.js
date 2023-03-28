import db from '../models/index';
import _ from 'lodash';
require('dotenv').config();
import emailServices from './emailServices';
import { v4 as uuidv4 } from 'uuid';
const { Sequelize } = require('sequelize');
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
let getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: { exclude: ['password'] },
                include: [
                    { model: db.allCodes, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.allCodes, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                    {
                        model: db.Doctor_Infor,
                        attributes: { exclude: ['id', 'doctorId'] },
                        include: [{ model: db.specialty, as: 'specialtyData', attributes: ['name'] }],
                    },
                ],
            });

            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
};
let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: { exclude: ['password', 'image'] },
            });
            if (doctor) {
                resolve({
                    errCode: 0,
                    data: doctor,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let saveDetailInfoDoctor = (data) => {
    //console.log('check data doc',data)
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.contentHTML ||
                !data.contentMarkdown ||
                !data.selectedPrice ||
                !data.selectedPayment ||
                !data.selectedProvince ||
                !data.nameClinic ||
                !data.addressClinic
            ) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter',
                });
            } else {
                if (data.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: data.contentHTML,
                        contentMarkdown: data.contentMarkdown,
                        description: data.description,
                        doctorId: data.doctorId,
                    });
                } else if (data.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: data.doctorId },
                        raw: false,
                    });
                    if (doctorMarkdown) {
                        (doctorMarkdown.contentHTML = data.contentHTML),
                            (doctorMarkdown.contentMarkdown = data.contentMarkdown),
                            (doctorMarkdown.description = data.description),
                            await doctorMarkdown.save();
                    }
                }

                let doctorInfo = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: data.doctorId,
                    },
                    raw: false,
                });
                if (doctorInfo) {
                    //update

                    (doctorInfo.priceId = data.selectedPrice),
                        (doctorInfo.paymentId = data.selectedPayment),
                        (doctorInfo.provinceId = data.selectedProvince),
                        (doctorInfo.note = data.note),
                        (doctorInfo.addressClinic = data.addressClinic),
                        (doctorInfo.nameClinic = data.nameClinic),
                        (doctorInfo.specialtyId = data.specialtyId);
                    doctorInfo.clinicId = data.clinicId;
                    await doctorInfo.save();
                } else {
                    await db.Doctor_Infor.create({
                        priceId: data.selectedPrice,
                        paymentId: data.selectedPayment,
                        provinceId: data.selectedProvince,
                        note: data.note,
                        doctorId: data.doctorId,
                        addressClinic: data.addressClinic,
                        nameClinic: data.nameClinic,
                        specialtyId: data.specialtyId,
                        clinicId: data.clinicId,
                    });
                }

                //
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

let getDetailDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter',
                });
            } else {
                let data = await db.User.findOne({
                    where: { id: id },
                    attributes: { exclude: ['password'] },
                    include: [
                        { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: { exclude: ['id', 'doctorId'] },
                            include: [
                                { model: db.allCodes, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.allCodes, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.allCodes, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                            ],
                        },
                        { model: db.allCodes, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true,
                });

                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary');
                }
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    message: 'ok',
                    data: data,
                });
            }
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};
let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter',
                });
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map((item) => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;

                        return item;
                    });
                }

                let arr = [];
                if (data.forWeek === true && schedule && schedule.length > 0) {
                    for (let i = 0; i < 7; i++) {
                        schedule.forEach((item) => {
                            let newItem = Object.assign({}, item); // Tạo ra một object mới để tránh tham chiếu
                            newItem.date = item.date + 86400000 * i; // Cập nhật giá trị date mới
                            arr.push(newItem); // Thêm item mới vào mảng
                        });
                    }
                }

                if (arr && arr.length > 0) {
                    schedule = arr;
                }
                console.log('check schedule', schedule);
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.date },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true,
                });
                // //convert date
                // if(existing && existing.length >0){
                //     existing = existing.map(item => {
                //         item.date = new Date(item.date).getTime();
                //         return item
                //     })
                // }
                // compare diff
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });

                //create data
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }

                resolve({
                    errCode: 0,
                    message: 'ok',
                    data: arr,
                });
            }
        } catch (e) {
            console.log('check e', e);
            reject(e);
        }
    });
};
let getScheduleByDate = (id, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !date) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter',
                });
            } else {
                let data = await db.Schedule.findAll({
                    where: { doctorId: id, date: date },
                    include: [
                        { model: db.allCodes, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
                    ],
                    raw: false,
                    nest: true,
                });

                if (!data) {
                    data = [];
                }
                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (e) {
            console.log('check e', e);
            reject(e);
        }
    });
};

let getExtraInfoDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter',
                });
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: id,
                    },
                    attributes: { exclude: ['id', 'doctorId'] },
                    include: [
                        { model: db.allCodes, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.allCodes, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.allCodes, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true,
                });
                if (!data) {
                    data = {};
                }
                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (e) {
            console.log('check e', e);
            reject(e);
        }
    });
};
let getProfileDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter',
                });
            } else {
                let data = await db.User.findOne({
                    where: { id: id },
                    attributes: { exclude: ['password'] },
                    include: [
                        { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: { exclude: ['id', 'doctorId'] },
                            include: [
                                { model: db.allCodes, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.allCodes, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.allCodes, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                            ],
                        },
                        { model: db.allCodes, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true,
                });

                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary');
                }
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    message: 'ok',
                    data: data,
                });
            }
        } catch (e) {
            console.log('check e', e);
            reject(e);
        }
    });
};
let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter',
                });
            } else {
                let data = await db.bookings.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        dayBooking: date,
                    },
                    include: [
                        {
                            model: db.User,
                            as: 'patientData',
                            attributes: ['email', 'firstName', 'lastName', 'address', 'gender'],
                            include: [{ model: db.allCodes, as: 'genderData', attributes: ['valueEn', 'valueVi'] }],
                        },
                        { model: db.allCodes, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true,
                });
                resolve({
                    errCode: 0,
                    message: 'ok',
                    data: data,
                });
            }
        } catch (e) {
            console.log('check e', e);
            reject(e);
        }
    });
};

let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            await emailServices.sendAttachment(data);
            console.log('check data', data);

            let appointment = await db.bookings.findOne({
                where: {
                    doctorId: data.doctorId,
                    dayBooking: data.dayBooking,
                    statusId: 'S2',
                    timeType: data.timeType,
                    patientId: data.patientId,
                },
                raw: false,
            });
            console.log('check app', appointment);
            if (appointment) {
                appointment.statusId = 'S3';
                await appointment.save();
                resolve({
                    errCode: 0,
                    message: 'update the appointment succeed!',
                });
            }
        } catch (e) {
            console.log('check e', e);
            reject(e);
        }
    });
};
let getDoctorSearch = (name) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!name) {
                let data = await db.User.findAll({
                    where: {
                        roleId: 'R2',
                    },
                    attributes: { exclude: ['password'] },
                    include: [
                        { model: db.allCodes, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        
                        {
                            model: db.Doctor_Infor,
                            attributes: { exclude: ['id', 'doctorId'] },
                            include: [{ model: db.specialty, as: 'specialtyData', attributes: ['name'] }],
                        },
                    ],
                    limit: 10,
                    offset: 0,
                });
                if (data && data.length > 0) {
                    data.map((item) => {
                        item.image = Buffer.from(item.image, 'base64').toString('binary');
                        return item;
                    });
                }
                resolve({
                    errCode: 0,
                    message: 'ok',
                    data: data,
                });
            } else {
                let data = await db.User.findAll({
                    where: {
                        roleId: 'R2',

                        [Sequelize.Op.or]: [
                            {
                                lastName: {
                                    [Sequelize.Op.iLike]: `%${name}%`,
                                },
                            },
                            {
                                firstName: {
                                    [Sequelize.Op.iLike]: `%${name}%`,
                                },
                            },
                        ],

                    },
                    attributes: { exclude: ['password'] },
                    include: [
                        { model: db.allCodes, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        
                        {
                            model: db.Doctor_Infor,
                            attributes: { exclude: ['id', 'doctorId'] },
                            include: [{ model: db.specialty, as: 'specialtyData', attributes: ['name'] }],
                        },
                    ],
                    limit: 10,
                    offset: 0,
                });
                if (data && data.length > 0) {
                    data.map((item) => {
                        item.image = Buffer.from(item.image, 'base64').toString('binary');
                        return item;
                    });
                }
                resolve({
                    errCode: 0,
                    message: 'ok',
                    data: data,
                });
            }
        } catch (e) {
            console.log('check e', e);
            reject(e);
        }
    });
};
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInfoDoctor: saveDetailInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInfoDoctorById: getExtraInfoDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    sendRemedy: sendRemedy,
    getDoctorSearch: getDoctorSearch,
};
