'use strict';

module.exports = {
  up: function up(queryInterface) {
    return queryInterface.bulkInsert('Recipe', [{
      title: 'Vegetable Soup',
      description: 'This soup is a very popular Yoruba dish.'
    }], {});
  },

  down: function down(queryInterface) {
    return queryInterface.bulkDelete('Recipe', null, {});
  }
};