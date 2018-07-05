'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _models = require('../database/models');

var _models2 = _interopRequireDefault(_models);

var _mostUpvoted = require('./../filters/mostUpvoted');

var _mostUpvoted2 = _interopRequireDefault(_mostUpvoted);

var _mostFavorited = require('./../filters/mostFavorited');

var _mostFavorited2 = _interopRequireDefault(_mostFavorited);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Controller to handle all recipe endpoint routes
 */
var RecipesController = function () {
  function RecipesController() {
    _classCallCheck(this, RecipesController);
  }

  _createClass(RecipesController, [{
    key: 'index',

    /**
     * Return a list of all recipes
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {json} json
     * @memberof RecipesController
     */
    value: async function index(req, res) {
      var _req$query = req.query,
          query = _req$query.query,
          page = _req$query.page,
          perPage = _req$query.perPage,
          sort = _req$query.sort;


      var getMetaData = function getMetaData(recipesMeta) {
        return {
          paginationMeta: {
            currentPage: Number(page) || 1,
            recipesCount: recipesMeta.count,
            pageCount: Math.ceil(recipesMeta.count / (perPage || 2))
          },
          recipes: recipesMeta.rows
        };
      };

      if (sort === 'mostFavorited' && !query) {
        var _recipesMeta = await (0, _mostFavorited2.default)(page || 1, perPage || 3);

        return res.sendSuccessResponse({ recipes: getMetaData(_recipesMeta) }, 200);
      }

      if (sort === 'mostUpvoted' && !query) {
        var _recipesMeta2 = await (0, _mostUpvoted2.default)(page || 1, perPage || 3);

        return res.sendSuccessResponse({ recipes: getMetaData(_recipesMeta2) }, 200);
      }

      var dbQuery = {
        include: {
          model: _models2.default.User,
          attributes: { exclude: ['password'] }
        },
        limit: perPage || 2,
        offset: (perPage || 2) * ((page || 1) - 1)
      };

      if (query) {
        dbQuery.where = {
          title: {
            $iLike: '%' + query + '%'
          }
        };
      }

      if (sort === 'date') {
        dbQuery.order = [['createdAt', 'DESC']];
      }

      var recipesMeta = await _models2.default.Recipe.findAndCountAll(dbQuery);

      return res.sendSuccessResponse({ recipes: getMetaData(recipesMeta) }, 200);
    }

    /**
     * Find a specific recipe
     *
     * @param {obj} req express request object
     * @param {any} res express response object
     * @returns {json} recipe
     * @memberof RecipesController
     */

  }, {
    key: 'find',
    value: async function find(req, res) {
      var recipe = req.currentRecipe;

      return res.sendSuccessResponse({ recipe: recipe });
    }

    /**
     * Store a new recipe into the database
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {json} json of newly created recipe
     * @memberof RecipesController
     */

  }, {
    key: 'create',
    value: async function create(req, res) {
      var reqBody = req.body;
      var createdRecipe = await _models2.default.Recipe.create({
        title: reqBody.title,
        description: reqBody.description,
        imageUrl: reqBody.imageUrl,
        timeToCook: reqBody.timeToCook,
        ingredients: reqBody.ingredients,
        procedure: reqBody.procedure,
        userId: req.authUser.id
      });

      var recipe = await _models2.default.Recipe.findById(createdRecipe.id, {
        include: {
          model: _models2.default.User,
          attributes: { exclude: ['password'] }
        }
      });

      return res.sendSuccessResponse({ recipe: recipe }, 201);
    }

    /**
     * Update a recipe in storage
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {json} json with updated recipe
     * @memberof RecipesController
     */

  }, {
    key: 'update',
    value: async function update(req, res) {
      var recipe = req.currentRecipe;
      var reqBody = req.body;

      await recipe.update({
        title: reqBody.title || recipe.title,
        description: reqBody.description || recipe.description,
        imageUrl: reqBody.imageUrl || recipe.imageUrl,
        timeToCook: reqBody.timeToCook || recipe.timeToCook,
        ingredients: reqBody.ingredients || recipe.ingredients,
        procedure: reqBody.procedure || recipe.procedure
      });

      var updatedRecipe = await _models2.default.Recipe.findById(recipe.id, {
        include: {
          model: _models2.default.User,
          attributes: { exclude: ['password'] }
        }
      });

      return res.sendSuccessResponse(updatedRecipe, 200);
    }

    /**
     * Delete a recipe from the database
     * @param {any} req express request object
     * @param {any} res express response object
     * @returns {json} confirmation message
     * @memberof RecipesController
     */

  }, {
    key: 'destroy',
    value: async function destroy(req, res) {
      await req.currentRecipe.destroy();
      return res.sendSuccessResponse({ message: 'Recipe deleted.' });
    }
  }]);

  return RecipesController;
}();

exports.default = RecipesController;