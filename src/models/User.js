const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "User",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },

            checkedemail: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: true,
            },

            verificationToken:{
                type:DataTypes.STRING,
                defaultValue: false,
                allowNull: true
            },
            tokenCreationTime: {
                type: DataTypes.DATE, 
                allowNull: true
            },

            picture: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            admin: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: true,
            },
   
            password: { 
                type: DataTypes.STRING,
                allowNull: false
            },
       
        },
        { timestamps: false, freezeTableName: true }
    );
};