require('dotenv').config();
const nodemailer = require('nodemailer');
let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <maixuanduy0605@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: 'Thông tin đặt lịch khám bệnh', // Subject line

        html: getBodyHTMLEmail(dataSend), // html body
    });
};
let confirmPassword = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <maixuanduy0605@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: 'Xác nhận reset mật khâu', // Subject line

        html: getBodyHTMLEmail(dataSend), // html body
    });
};

let getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được Email này vì đã đặt lịch khám bệnh online trên Booking</p>
        <p>Thông tin đặt lịch khám bệnh: </p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

        <p>Nếu các thông tin trên là đúng sự thật, xin vui lòng nhấn vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.</p>

        <div><a href="${dataSend.redirectLink}" target="_blank" >
            Click here
        </a></div>

        <div>Xin chân thành cảm ơn!</div>
    `;
    } else if(dataSend.language === 'en') {
        result = `
        <h3>Dear ${dataSend.patientName}!</h3>
        <p>You received this email because you booked an online medical appointment on Booking</p>
        <p>Information to schedule an appointment:</p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>

        <p>If the above information is true, please click on the link below to confirm and complete the medical appointment booking procedure.</p>

        <div><a href="${dataSend.redirectLink}" target="_blank" >
            Click here
        </a></div>

        <div>Sincerely thank!</div>
    `;
    }
    else{
        result = `
       
        <p>Bạn cần click vào đây để reset password</p>
        <div><a href="${dataSend.redirectLink}" target="_blank" >
            Click here
        </a></div>

        <div>Sincerely thank!</div>
    `;
    }

    return result;
};

let sendAttachment = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <maixuanduy0605@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: 'Kết quả đặt lịch khám bệnh', // Subject line

        html: getBodyHTMLEmailRemedy(dataSend), // html body
        attachments: [
            {
                fileName: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                content: dataSend.imgBase64.split('base64,')[1],
                encoding: 'base64',
            },
        ],
    });
};
let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được Email này vì đã đặt lịch khám bệnh online trên Booking thành công</p>
        <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm</p>
        

        <div>Xin chân thành cảm ơn!</div>
    `;
    } else {
        result = `
        <h3>Dear ${dataSend.patientName}!</h3>
        <p>You received this email because you booked an online medical appointment on Booking succeed!</p>
        

        <div>Sincerely thank!</div>
    `;
    }

    return result;
};

// async..await is not allowed in global scope, must use a wrapper

module.exports = {
    sendSimpleEmail,
    sendAttachment,
    confirmPassword,
};
