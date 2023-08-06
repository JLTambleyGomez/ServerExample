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
            picture: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: "https://icon-library.com/images/no-profile-pic-icon/no-profile-pic-icon-24.jpg"
            },
            admin: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
   
            country:{
                type: DataTypes.STRING,
                defaultValue:false,
                allowNull: false,
            },
            password: { 
                type: DataTypes.STRING,
                allowNull: false
            },
       
        },
        { timestamps: false, freezeTableName: true }
    );
};