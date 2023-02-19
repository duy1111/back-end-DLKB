'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class handbook extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    handbook.init(
        {
            name: DataTypes.STRING,
            contentHTML: DataTypes.TEXT('long'),
            contentMarkdown: DataTypes.TEXT('long'),
            specialtyId : DataTypes.INTEGER,
            doctorId : DataTypes.INTEGER,
            adminId :DataTypes.INTEGER,
            image: DataTypes.BLOB,
        },
        {
            sequelize,
            modelName: 'handbook',
        },
    );
    return handbook;
};
