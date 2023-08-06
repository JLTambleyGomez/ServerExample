const { DataTypes, ValidationError } = require('sequelize');

module.exports = (sequelize) => {
  const Review = sequelize.define('Review', {
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
    projectName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    opinion: {
      type: DataTypes.STRING,
      validate: {
        maxChars(value) {
          if (value.length > 2000) {
            throw new ValidationError('Opinion cannot exceed 2000 characters.');
          }
        },
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 1,
          msg: 'Rating must be at least 1.',
        },
        max: {
          args: 10,
          msg: 'Rating must be at most 10.',
        },
      },
    },
  }, { timestamps: false });

  Review.belongsTo(sequelize.models.Project, {
    foreignKey: "projectId",
    onDelete: "CASCADE",
  });

  return Review; // Asegúrate de devolver el modelo desde la función.
};
