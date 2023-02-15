import db from '../models/index';
let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    message: 'Missing parameter!',
                });
            } else {
                await db.specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                });
                resolve({
                    errCode: 0,
                    message: 'created a new specialty succeed!',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.specialty.findAll();
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
let getDetailSpecialtyById = async (id, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !location) {
                resolve({
                    errCode: 1,
                    message: 'Missing parameter!',
                });
            } else {
                let data = {};

                data = await db.specialty.findOne({
                    where: {
                        id: id,
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown'],
                    raw: true,
                });

                if (data) {
                    //
                    let doctorSpecialty = [];
                    if (location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: id,
                            },
                            attributes: ['doctorId', 'provinceId'],
                            raw: true,
                        });
                    } else {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: id,
                                provinceId: location,
                            },
                            attributes: ['doctorId', 'provinceId'],
                            raw: true,
                        });
                    }

                    data.doctorSpecialty = doctorSpecialty;
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

let handleDeleteSpecialty = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialty = await db.specialty.findOne({ where: { id: id } });
            if (!specialty) {
                resolve({
                    errCode: 2,
                    message: 'the clinic not exist',
                });
            }
            await specialty.destroy();
            resolve({
                errCode: 0,
                message: 'delete specialty success',
            });
        } catch (e) {
            reject(e);
        }
    });
};
let handleUpdateSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    message: 'Missing parameter!',
                });
            } else {
                let specialty = await db.specialty.findOne({
                    where: { id: data.specialtyId },
                    raw: false,
                });
                if (specialty) {
                    (specialty.name = data.name),
                        (specialty.descriptionHTML = data.descriptionHTML),
                        (specialty.descriptionMarkdown = data.descriptionMarkdown),
                        (specialty.image = data.imageBase64),
                        await specialty.save();
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
module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById,
    handleDeleteSpecialty: handleDeleteSpecialty,
    handleUpdateSpecialty: handleUpdateSpecialty,
};
