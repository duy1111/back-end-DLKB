var bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
import { raw } from 'express';
import db from '../models/index';
let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
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
            resolve('ok create a new user succeed !');
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
            resolve('ok create a new user succeed !');
        }
    });
};
let readUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let readUser = await db.User.findAll({ raw: true });
            resolve(readUser);
        } catch (e) {
            reject(e);
        }
    });
};
let getEditUserId = (id) => {
    console.log(id);
    return new Promise(async (resolve, reject) => {
        try {
            let User = await db.User.findOne({ where: { id: id }, raw: true });
            if (User) {
                resolve(User);
            } else {
                resolve([]);
            }
        } catch (e) {
            reject(e);
        }
    });
};

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let User = await db.User.findOne({ where: { id: parseInt(data.id) } });
            if (User) {
                (User.firstName = data.firstName),
                    (User.lastName = data.lastName),
                    (User.email = data.email),
                    (User.address = data.address),
                    await User.save();
                resolve(User);
            }
            resolve(User);
        } catch (e) {
            reject(e);
        }
    });
};
let deletUserById = (id) =>{
    return new Promise(async(resolve,reject) => {
        try{
            let User = await db.User.findOne({ where: { id: id } });
            if(User){
                await User.destroy();
            }
            resolve();
        }catch(e){
            reject(e)
        }
    })
}
module.exports = {
    createNewUser: createNewUser,
    readUser: readUser,
    getEditUserId: getEditUserId,
    updateUserData: updateUserData,
    deletUserById:deletUserById,
};
