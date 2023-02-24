'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.belongsTo(models.allCodes, { foreignKey: 'positionId', targetKey: 'keyMap', as: 'positionData' });
            User.belongsTo(models.allCodes, { foreignKey: 'gender', targetKey: 'keyMap', as: 'genderData' });
            User.hasOne(models.Markdown, { foreignKey: 'doctorId' });
            User.hasOne(models.Doctor_Infor, { foreignKey: 'doctorId' });
            User.hasMany(models.Schedule, { foreignKey: 'doctorId', as: 'doctorData' });
            User.hasMany(models.bookings, { foreignKey: 'patientId', as: 'patientData' });
        

        }
    }
    User.init(
        {
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            address: DataTypes.STRING,
            gender: DataTypes.STRING,
            roleId: DataTypes.STRING,
            phoneNumber: DataTypes.STRING,
            positionId: DataTypes.STRING,
            image: DataTypes.BLOB,
        },
        {
            sequelize,
            modelName: 'User',
            
        },
    );
    return User;
};
