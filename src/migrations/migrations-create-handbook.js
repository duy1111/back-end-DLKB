'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('handbooks', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING,
            },
            specialtyId: {
                type: Sequelize.INTEGER,
            },
            
            doctorId: {
                type: Sequelize.INTEGER,
            },
            adminId: {
                type: Sequelize.INTEGER,
            },
            contentHTML: {
                type: Sequelize.TEXT,
            },    
            contentMarkdown: {
                type: Sequelize.TEXT,
            },      
            image: {
                type: Sequelize.BLOB('long')                ,
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
        await queryInterface.dropTable('handbooks');
    },
};
