const { DataTypes} = require('sequelize');

module.exports = (sequelize) => {
  const Job = sequelize.define('Job', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url:{
      type: DataTypes.STRING,
      allowNull: false,
    },

    jobTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 1,
          msg: 'stage must be at least 1.',
        },
        max: {
          args: 5,
          msg: 'stage must be at most 5.',
        },
      },
    },
  }, { timestamps: false });

};
