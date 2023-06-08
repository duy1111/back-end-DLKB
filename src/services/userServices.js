import db from '../models/index';
var bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const RefreshToken = db.RefreshToken;
import AuthController from '../controller/authController';



require('dotenv').config();
import emailServices from './emailServices';
import { v4 as uuidv4 } from 'uuid';

require('dotenv').config();
//GENERATE ACCESS TOKEN
let generateAccessToken = (user) => {
    return jwt.sign(
        {
            userId: user.id,
            roleId: user.roleId,
        },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: '2h' },
    );
};
let generateRefreshToken = (user) => {
    return jwt.sign(
        {
            userId: user.id,
            roleId: user.roleId,
        },
        process.env.JWT_REFRESH_KEY,
        { expiresIn: '360d' },
    );
};
let handleUserLogin = (res, email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);

            if (isExist) {
                //user already exist

                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: ['id', 'email', 'roleId', 'password', 'firstName', 'lastName'],
                    raw: true,
                });
                if (user) {
                    //compare pass

                    let check = await bcrypt.compareSync(password, user.password); // false
                    if (check) {
                        let accessToken = generateAccessToken(user);
                        let refreshToken = generateRefreshToken(user);
                        const tokenDoc = await db.RefreshToken.create({ userId: user.id, token: refreshToken });
                        res.cookie('refreshToken', refreshToken, {
                            httpOnly: true,
                            secure: false,
                            path: '/',
                            sameSite: 'strict',
                        });

                        delete user.password;

                        userData.errCode = 0;
                        userData.message = 'ok';
                        userData.accessToken = accessToken;

                        userData.user = user;
                        // Attach access token to the header
                        res.setHeader('authorization', `Bearer ${accessToken}`);

                    } else {
                        userData.errCode = 3;
                        userData.message = 'wrong password';
                        userData.accessToken = '';
                    }
                } else {
                    userData.errCode = 2;
                    userData.message = `Your user email isn't exist in your system. Plz try other email`;
                    userData.accessToken = '';

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
let handleRegister = (req,email,password) => {
    return new Promise(async (resolve, reject) => {
        try{
            let userData = {};
            let isExist = await checkUserEmail(email);
            let data= req.body
            if (!isExist) {
                //user already exist

                let hashPasswordFromBcrypt = await hashUserPassword(password);
                await db.User.create({
                    email: email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    gender: data.gender,
                    roleId: 'R2',
                    positionId: 'P2',
                    phoneNumber: data.phoneNumber,
                    image: '',
                });
                
                 
                userData.errCode = 0;
                userData.message = `Register succeed`;
                 

                    //return error
                resolve(userData);
                

               
            } else {
                userData.errCode = 1;
                userData.message = `Tour email is exist. Plz try other email`;
                //return error
                resolve(userData);
            }
            
        }catch(e){
            reject(e)
        }
    })
}
let requestRefreshToken = (refreshToken,res) => {
    return new Promise(async (resolve, reject) => {
        try {
            let decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
            const token = await RefreshToken.findOne({ where: { userId: decoded.userId, token: refreshToken } });
            console.log('check token refresh', decoded.userId,decoded.roleId);
            console.log('check token refresh', token);
            
            
            if (!token) {
                resolve({
                    errCode: -1,
                });
            } else {
                let accessToken = jwt.sign(
                    { userId: decoded.userId, roleId: decoded.roleId },
                    process.env.JWT_ACCESS_KEY,
                    {
                        expiresIn: '2h',
                    },
                );
                console.log('check access token', token);

                let newRefreshToken = await AuthController.generateRefreshToken(decoded.userId, decoded.roleId);
                res.cookie('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                });
                resolve({
                    accessToken: accessToken,
                   
                });
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
                users = await db.User.findOne({ where: { id: id }, raw: true, attributes: { exclude: ['password','image'] } });
                //delete users.password;

                resolve(users);
            }
            users = await db.User.findAll({ raw: true, attributes: { exclude: ['password','image'] } });

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
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    phoneNumber: data.phoneNumber,
                    image: data.avatar,
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
            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    message: 'Missing required parameters',
                });
            } else {
            }
            let Users = await db.User.findOne({ where: { id: data.id } });

            if (Users) {
                (Users.firstName = data.firstName),
                    (Users.lastName = data.lastName),
                    (Users.address = data.address),
                    (Users.roleId = data.roleId),
                    (Users.positionId = data.positionId),
                    (Users.phoneNumber = data.phoneNumber),
                    (Users.gender = data.gender);
                if (data.avatar) {
                    Users.image = data.avatar;
                }

                await Users.save();
                Users.errCode = 0;
                Users.message = 'ok';
                resolve({
                    Users,
                    errCode: 0,
                    message: 'ok',
                });
                //deo biet loi gi
                // await db.User.save({
                //     firstName: data.firstName,
                //     lastName: data.lastName,
                //     email: data.email,
                //     address: data.address,
                // });
            } else {
                resolve({
                    errCode: 1,
                    message: 'user not found',
                });
            }
        } catch (e) {
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
            reject(e);
        }
    });
};
let getAllCodeServices = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameters !',
                });
            } else {
                let res = {};
                let allCode = await db.allCodes.findAll({
                    where: {
                        type: typeInput,
                    },
                });
                res.errCode = 0;
                res.data = allCode;
                resolve(res);
            }
        } catch (e) {
            reject(e);
        }
    });
};

let testTopDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.Doctor_Infor.findAll({
                limit: 5,
                where: { provinceId: data.provinceId },

                attributes: ['doctorId', 'provinceId'],
                raw: true,
            });
            let topDoctor = [];
            let length = users.length;
            console.log('check lenghth', length);
            await users.map(async (item, index) => {
                let obj = {};
                let doctor = await db.User.findOne({
                    where: { id: item.doctorId },
                    raw: true,
                });

                obj = { ...item, ...doctor };
                topDoctor.push(obj);
                length--;
                console.log('----check length', length);
                if (length === 0) {
                    console.log('check top doctor', topDoctor);
                    resolve({
                        data: topDoctor,
                    });
                }
                return item;
            });
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};

let buildUrlEmail = (password, email) => {
    // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

    let result = `${process.env.URL_REACT}/verify-password?email=${email}&&password=${password}`;
    return result;
};
let confirmPassword = (data) => {
    
    return new Promise(async(resolve,reject) => {
        try{
            if(!data.email || !data.password){
                resolve({
                    errCode: 1,
                    message: 'Missing parameter!',
                });
            }
            else{
                let Users = await db.User.findOne({
                    where: { email: data.email },      
                });
                if(Users){
                    
                    await emailServices.confirmPassword({
                        receiverEmail: data.email,
                        redirectLink: buildUrlEmail(data.password, data.email),
                    });
                    resolve({
                        errCode: 0,
                        message: 'ok',
                    });           
                   
                } 
                
                resolve({
                    errCode: 2,
                    message: 'Please, Check user ',
                });
            }
        }
        catch(e){
            reject(e)
        }
    })
}
let verifyConfirmPassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.password ) {
                resolve({
                    errCode: 1,
                    message: 'Missing parameter!',
                });
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                let Users = await db.User.findOne({
                    where: { email: data.email },
                    
                    
                });
                if (Users) {
                    Users.password = hashPasswordFromBcrypt
    
                    await Users.save();
                    
                    resolve({
                        errCode: 0,
                        message: 'ok',
                    });
                }
               
                else {
                    resolve({
                        errCode: 2,
                        message: 'Please enter the correct email ',
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
}
module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUser: getAllUser,
    createNewUser: createNewUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getAllCodeServices: getAllCodeServices,
    testTopDoctor: testTopDoctor,
    requestRefreshToken: requestRefreshToken,
    handleRegister: handleRegister,
    confirmPassword:confirmPassword,
    verifyConfirmPassword:verifyConfirmPassword
};
