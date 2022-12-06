import db from '../models/index';
var bcrypt = require('bcryptjs');
let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);

            if (isExist) {
                //user already exist

                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: ['email', 'roleId', 'password'],
                    raw: true,
                });
                if (user) {
                    //compare pass

                    let check = await bcrypt.compareSync(password, user.password); // false
                    if (check) {
                        delete user.password;
                        console.log(user);
                        userData.errCode = 0;
                        userData.message = 'ok';
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.message = 'wrong password';
                    }
                } else {
                    userData.errCode = 2;
                    userData.message = `Your user email isn't exist in your system. Plz try other email`;
                    //return error
                    resolve(userData);
                }

                resolve(userData);
            } else {
                userData.errCode = 1;
                userData.message = `Your user email isn't exist in your system. Plz try other email`;
                //return error
                resolve(userData);
            }
        } catch (e) {
            reject(e);
        }
    });
};

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail },
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getAllUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = {};
            if (id) {
                users = await db.User.findOne({ where: { id: id }, raw: true });
                delete users.password;
                resolve(users);
            }
            users = await db.User.findAll({ raw: true, attributes: { exclude: ['password'] } });

            console.log(users);
            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUser: getAllUser,
};
