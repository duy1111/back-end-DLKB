import db from '../models/index';
var bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
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
                users = await db.User.findOne({ where: { id: id }, raw: true, attributes: { exclude: ['password'] } });
                //delete users.password;
                console.log('tesstt', users);
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
let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    message: 'Your email is already used, Plz try author email',
                });
            }

            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
                phoneNumber: data.phoneNumber,
            });
            resolve({
                errCode: 0,
                message: 'ok',
            });
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
let updateUser = (data) => {
    return new Promise(async (resolve, reject) => {

        try {
            if(!data.id){
                resolve({
                    errCode:2,
                    message:'Missing required parameters'
                })
            }
            let Users = await db.User.findOne({ where: { id: data.id } });
            console.log('check',Users);
            if (Users) {
                Users.firstName = data.firstName,
                
                Users.lastName = data.lastName,
                Users.email = data.email,
                Users.address = data.address,
                await Users.save();
                Users.errCode = 0;
                Users.message = 'ok';
                resolve(Users);
                //deo biet loi gi
                // await db.User.save({
                //     firstName: data.firstName,
                //     lastName: data.lastName,
                //     email: data.email,
                //     address: data.address,
                // });
                resolve({
                    errCode : 0,
                    message : 'ok'
                })
            } else {
                resolve({
                    errCode : 1,
                    message : 'user not found'
                })
            }
        } catch (e) {
            console.log('test');
            reject(e);
        }
    });
};
let deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({ where: { id: id } });
            if (!user) {
                resolve({
                    errCode: 2,
                    message: 'the user not exist',
                });
            }
            await user.destroy();
            resolve({
                errCode: 0,
                message: 'delete user success',
            });
        } catch (e) {
            reject(e)
        }
    });
};
module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUser: getAllUser,
    createNewUser: createNewUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
};
