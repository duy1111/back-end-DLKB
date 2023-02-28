const jwt = require('jsonwebtoken');
const db = require('../models');
const RefreshToken = db.RefreshToken;

const generateRefreshToken = async (userId,roleId) => {

    
  const refreshToken = jwt.sign({ userId: userId ,roleId:roleId}, process.env.JWT_REFRESH_KEY);
  const tokenDoc = await RefreshToken.create({ userId, token: refreshToken });
  return refreshToken;
};
const userLogout = async(req,res) => {
    res.clearCookie("refreshToken");
    let refreshToken = await RefreshToken.findOne({
        where: { token: req.cookies.refreshToken }
    })
    console.log('check',refreshToken)
    
    if(refreshToken){
        await refreshToken.destroy();
        res.status(200).json('logout user success')
    }else if(!refreshToken){
        res.status(403).json('logout user not exist')
        
    }
}
module.exports = {
  generateRefreshToken,userLogout
};
