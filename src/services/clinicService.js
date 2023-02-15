import db from '../models/index';
let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    message: 'Missing parameter!',
                });
            } else {
                await db.clinics.create({
                    name: data.name,
                    address: data.address,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                    image: data.imageBase64,
                });
                resolve({
                    errCode: 0,
                    message: 'created a new clinic succeed!',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let handleUpdateClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    message: 'Missing parameter!',
                });
            } else {
                let clinics = await db.clinics.findOne({
                    where: { id: data.clinicId },
                    raw: false,
                });
                if (clinics) {
                    (clinics.name = data.name),
                        (clinics.descriptionHTML = data.descriptionHTML),
                        (clinics.descriptionMarkdown = data.descriptionMarkdown),
                        (clinics.image = data.imageBase64),
                        (clinics.address = data.address),
                        await clinics.save();
                }

                resolve({
                    errCode: 0,
                    message: 'update a new clinic succeed!',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.clinics.findAll();
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
        } catch (e) {
            reject(e);
        }
    });
};

let getDetailClinicById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    message: 'Missing parameter!',
                });
            } else {
                let data = {};

                data = await db.clinics.findOne({
                    where: {
                        id: id,
                    },
                    attributes: ['name', 'address', 'image', 'descriptionHTML', 'descriptionMarkdown'],
                    raw: true,
                });
                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary');
                }

                if (data) {
                    //
                    let doctorClinic = [];

                    doctorClinic = await db.Doctor_Infor.findAll({
                        where: {
                            clinicId: id,
                        },
                        attributes: ['doctorId', 'provinceId'],
                        raw: true,
                    });

                    data.doctorClinic = doctorClinic;
                } else {
                    data = {};
                }
                resolve({
                    errCode: 0,
                    message: 'ok',
                    data: data,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let handleDeleteClinic = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let clinic = await db.clinics.findOne({ where: { id: id } });
            if (!clinic) {
                resolve({
                    errCode: 2,
                    message: 'the clinic not exist',
                });
            }
            await clinic.destroy();
            resolve({
                errCode: 0,
                message: 'delete clinic success',
            });
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById,
    handleDeleteClinic: handleDeleteClinic,
    handleUpdateClinic: handleUpdateClinic,
};
