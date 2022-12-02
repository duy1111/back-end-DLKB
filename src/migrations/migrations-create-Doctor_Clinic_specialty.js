'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Doctor_Clinic_specialty', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            
            doctorId: {
                type: Sequelize.INTEGER,
            },
            clinic: {
                type: Sequelize.INTEGER,
            },
            specialty: {
                type: Sequelize.INTEGER,
            },           
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Doctor_Clinic_specialty');
    },
};
