'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class allCodes extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            allCodes.hasMany(models.User, {foreignKey:'positionId',as:'positionData'})
            allCodes.hasMany(models.User, {foreignKey:'gender', as:'genderData'})
            allCodes.hasMany(models.Schedule, {foreignKey:'timeType', as:'timeTypeData'})

        }
    }
    allCodes.init(
        {
            keyMap: DataTypes.STRING,
            type: DataTypes.STRING,
            valueEn: DataTypes.STRING,
            valueVi: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'allCodes',
        },
    );
    return allCodes;
};
