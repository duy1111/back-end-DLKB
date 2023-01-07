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

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
};
