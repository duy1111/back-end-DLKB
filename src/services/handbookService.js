import db from '../models/index';

let createHandbook = (data) => {
    console;
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.contentHTML || !data.contentMarkdown || !data.doctorId || !data.specialtyId) {
                resolve({
                    errCode: 1,
                    message: 'Missing parameter!',
                });
            } else {
                await db.handbook.create({
                    name: data.name,
                    specialtyId: data.specialtyId,
                    doctorId: data.doctorId,
                    adminId: data.adminId,
                    contentHTML: data.contentHTML,
                    contentMarkdown: data.contentMarkdown,
                    image: data.imageBase64,
                });
                resolve({
                    errCode: 0,
                    message: 'created a new handbook succeed!',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getAllHandbook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.handbook.findAll();
            if (data && data.length > 0) {
                data.map((item) => {
                    if (item.image) {
                        item.image = Buffer.from(item.image, 'base64').toString('binary');
                    }

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

let getDetailHandbookById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    message: 'Missing parameter!',
                });
            } else {
                let data = {};
                data = await db.handbook.findOne({
                    where: {
                        id: id,
                    },
                    raw: true,
                });
                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary');
                }
                console.log('check data', data);
                if (data && data.doctorId && data.adminId) {
                    let doctorHandbook = [];
                    let adminHandbook = [];
                    doctorHandbook = await db.User.findOne({
                        where: {
                            id: data.doctorId,
                            roleId: 'R2',
                        },
                        attributes: ['firstName', 'lastName'],
                        include: [{ model: db.allCodes, as: 'positionData', attributes: ['valueEn', 'valueVi'] }],
                        nest: true,
                        raw: false,
                    });
                    console.log('check data ', data);
                    adminHandbook = await db.User.findOne({
                        where: {
                            id: data.adminId,
                            roleId: 'R1',
                        },
                        attributes: ['firstName', 'lastName'],
                        include: [{ model: db.allCodes, as: 'positionData', attributes: ['valueEn', 'valueVi'] }],
                        nest: true,
                        raw: false,
                    });
                    data.doctorHandbook = doctorHandbook;
                    data.adminHandbook = adminHandbook;
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

let handleUpdateHandbook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.name || !data.contentHTML || !data.contentMarkdown) {
                resolve({
                    errCode: 1,
                    message: 'Missing parameter!',
                });
            } else {
                let handbook = await db.handbook.findOne({
                    where: { id: data.id },
                    raw: false,
                });
                if (handbook) {
                    (handbook.name = data.name),
                        (handbook.contentHTML = data.descriptionHTML),
                        (handbook.contentMarkdown = data.descriptionMarkdown),
                        (handbook.image = data.imageBase64),
                        (handbook.specialtyId = data.specialtyId),
                        (handbook.doctorId = data.doctorId),
                        await handbook.save();
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
let handleDeleteHandbook = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('check id', id);
            let handbook = await db.handbook.findOne({ where: { id: id } });
            if (!handbook) {
                resolve({
                    errCode: 2,
                    message: 'the handbook not exist',
                });
            }
            await handbook.destroy();
            resolve({
                errCode: 0,
                message: 'delete clinic success',
            });
        } catch (e) {
            reject(e);
        }
    });
};
let handbookNotApprovedYet = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let handbook = await db.handbook.findAll({
                where: {
                    adminId: 0,
                },
                attributes: {
                    exclude: ['image'],
                },
            });
            if (!handbook) {
                resolve({
                    errCode: 2,
                    message: 'the handbook not exist',
                });
            }
            resolve({
                errCode: 0,
                message: 'ok',
                data: handbook,
            });
        } catch (e) {
            reject(e);
        }
    });
};
let handbookApprovedYet = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.adminId && !data.roleId && !data.handbookId) {
                resolve({
                    errCode: 1,
                    message: 'Missing parameter!',
                });
            } else {
                console.log('check data', data);
                let handbook = await db.handbook.findOne({
                    where: { id: data.handbookId },
                    attributes: {
                        exclude: ['image'],
                    },
                });
                if (data.roleId === 'R1') {
                    handbook.adminId = data.adminId;
                    handbook.save();
                    resolve({
                        errCode: 0,
                        message: 'ok',
                    });
                }
                resolve({
                    errCode: -1,
                    message: 'error position',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let DoneHandbook = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.handbook.findAll({
                attributes: {
                    exclude: ['contentHTML','contentMarkdown'],

                },
                raw:true
            });
            let newData =[]
            if (data) {
                data.map((item, index) => {
                    if (item.adminId !== 0) {
                        newData.push(item)
                        
                    }
                    return item
                });
            }
            
            
            if (data && data.length > 0) {
                data.map((item) => {
                    if (item.image) {
                        item.image = Buffer.from(item.image, 'base64').toString('binary');
                    }

                    return item;
                });
            }
            resolve({
                errCode: 0,
                message: 'ok',
                data: newData,
            });
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = {
    createHandbook,
    getAllHandbook,
    getDetailHandbookById,
    handleUpdateHandbook,
    handleDeleteHandbook,
    handbookNotApprovedYet,
    handbookApprovedYet,
    DoneHandbook,
};
