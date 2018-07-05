'use strict';

module.exports = function (sequelize, DataTypes) {
  var Review = sequelize.define('Review', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    review: DataTypes.TEXT,
    userId: {
      type: DataTypes.UUID,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    recipeId: {
      type: DataTypes.UUID,
      onDelete: 'CASCADE',
      references: {
        model: 'Recipes',
        key: 'id'
      }
    }
  });

  Review.associate = function (models) {
    Review.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Review.belongsTo(models.Recipe, {
      foreignKey: 'recipeId'
    });
  };

  return Review;
};