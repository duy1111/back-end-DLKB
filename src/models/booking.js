'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class bookings extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    bookings.init(
        {
            statusId: DataTypes.STRING,
            doctorId: DataTypes.INTEGER,
            patientId: DataTypes.INTEGER,
            date: DataTypes.STRING,
            timeType: DataTypes.STRING,
            token: DataTypes.STRING,
            dayBooking: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'bookings',
        },
    );
    return bookings;
};
