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
    let userData = await userServices.handleUserLogin(email, password);

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message,
        user : userData.user ? userData.user : {}
    });
};
let handleGetAllUsers = async(req,res) => {
    let id = req.body.id;//All , id
    let users = await userServices.getAllUser(id);

    return res.status(200).json({
        errCode:0,
        errMessage:'ok',
        users
    })
}
module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers:handleGetAllUsers,
};
