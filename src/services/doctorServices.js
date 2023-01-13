import db from '../models/index';
import _ from 'lodash'
require('dotenv').config();
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
            
            if (!data.arrSchedule || !data.doctorId ||!data.date) {
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
                let existing = await db.Schedule.findAll(
                    {
                        where:{doctorId:data.doctorId, date:data.date},
                        attributes:['timeType','date','doctorId','maxNumber'],
                        raw:true
                    }
                )
                //convert date
                if(existing && existing.length >0){
                    existing = existing.map(item => {
                        item.date = new Date(item.date).getTime();
                        return item
                    })
                }
                // compare diff
                let toCreate = _.differenceWith(schedule,existing,(a,b) =>{
                    return a.timeType === b.timeType && a.date === b.date;
                })
                console.log(toCreate)
                //create data
                if(toCreate && toCreate.length > 0){
                    await db.Schedule.bulkCreate(toCreate);
                }
                

                resolve({
                    errCode: 0,
                    message: 'ok',
                });
            }
        } catch (e) {
            console.log('check e', e);
            reject(e);
        }
    });
};
let getScheduleByDate = (id, date) => {
    return new Promise(async(resolve,reject) =>{
        try{
            if(!id || !date){
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter',
                });
            }
            else{
                let data = await db.Schedule.findAll({
                    where:{doctorId:id, date:date}
                })
                console.log('check ne' ,data)
                if(!data){
                    data =[];
                }
                resolve({
                    errCode:0,
                    data:data
                })
            }
        }
        catch(e){
            console.log('check e', e);
            reject(e);
        }
    })
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInfoDoctor: saveDetailInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate:getScheduleByDate,
};
