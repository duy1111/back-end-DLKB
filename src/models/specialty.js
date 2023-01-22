'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class specialty extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    specialty.init(
        {
            name: DataTypes.STRING,
            descriptionHTML: DataTypes.TEXT,
            descriptionMarkdown: DataTypes.TEXT,
            image: DataTypes.BLOB,
        },
        {
            sequelize,
            modelName: 'specialty',
        },
    );
    return specialty;
};
