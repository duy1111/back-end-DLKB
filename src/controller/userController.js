import userServices from '../services/userServices';
let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    //check email nguoi dung
    //password nguoi dung khong hop le
    //return userInfor
    //access_token: twj json web token
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter!',
        });
    }
    let userData = await userServices.handleUserLogin(res,email, password);

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message,
        accessToken: userData.accessToken,
       
        user: userData.user ? userData.user : {},
    });
};
let handleRegister = async (req,res) => {
    let {email,password} = req.body 
    
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter  1!',
        });
    }
    let userData = await userServices.handleRegister(req,email,password)

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message,  
    });

}
let requestRefreshToken = async (req,res) => {
    let refreshToken = req.cookies.refreshToken
    console.log('check token refresh',refreshToken)
   
    if(!refreshToken) return res.status(401).json("You are not authenticated")
    let data = await userServices.requestRefreshToken(refreshToken,res)
    return res.status(200).json(data);


}
let handleGetAllUsers = async (req, res) => {
    let id = req.query.id; //All , id
    let users = await userServices.getAllUser(id);

    return res.status(200).json({
        errCode: 0,
        errMessage: 'ok',
        users,
    });
};
let handleCreateNewUser = async (req, res) => {
    let message = await userServices.createNewUser(req.body);

    return res.status(201).json({
        errCode: message.errCode,
        message: message.message,
    });
};
let handleUpdateUser = async (req, res) => {
    let message = await userServices.updateUser(req.body);

    return res.status(200).json(message);
};
let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            message: 'missing required parameters!',
        });
    }
    let message = await userServices.deleteUser(req.body.id);

    return res.status(200).json(message);
};

let getAllCode = async (req, res) => {
    try {
        let data = await userServices.getAllCodeServices(req.query.type);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};
let test = async (req, res) => {
    try {
        let data = await userServices.testTopDoctor(req.body);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server b',
        });
    }
};


let handleResetPassword = async (req, res) => {
    try {     
        let data = await userServices.confirmPassword(req.body);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            errCode: -1,
            message: 'Error from server...',
        });
    }
};

let handleVerifyResetPassword = async (req, res) => {
    console.log(req.body)

    try {
        let data = await userServices.verifyConfirmPassword(req.body);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            errCode: -1,
            message: 'Error from server...',
        });
    }
};

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleUpdateUser: handleUpdateUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode,
    test: test,
    requestRefreshToken:requestRefreshToken,
    handleRegister:handleRegister,
    handleResetPassword:handleResetPassword,
    handleVerifyResetPassword:handleVerifyResetPassword,
};
