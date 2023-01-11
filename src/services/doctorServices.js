import db from '../models/index';

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
            if (!data.contentHTML || !data.contentMarkdown) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter',
                });
            } else {
                await db.Markdown.create({
                    contentHTML: data.contentHTML,
                    contentMarkdown: data.contentMarkdown,
                    description: data.description,
                    doctorId: data.doctorId,
                });
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
                        { model: db.allCodes, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true,
                });

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if(!data) data = {}
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

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInfoDoctor: saveDetailInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
};
