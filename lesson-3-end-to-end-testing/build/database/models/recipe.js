'use strict';

var _helpers = require('../../helpers');

module.exports = function (sequelize, DataTypes) {
  var Recipe = sequelize.define('Recipe', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    timeToCook: DataTypes.INTEGER,
    ingredients: DataTypes.TEXT,
    procedure: DataTypes.TEXT
  });

  Recipe.associate = function (models) {
    Recipe.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Recipe.hasMany(models.Review, {
      foreignKey: 'recipeId'
    });
  };

  Recipe.addHook('afterFind', async function (results) {
    if (Array.isArray(results)) {
      await Promise.all(results.map(async function (sequelizeRecipe) {
        return (0, _helpers.updateRecipeAttributes)(sequelizeRecipe);
      }));
    } else {
      return (0, _helpers.updateRecipeAttributes)(results);
    }
  });

  return Recipe;
};