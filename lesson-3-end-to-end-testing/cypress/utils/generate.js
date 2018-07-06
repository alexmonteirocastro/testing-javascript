const faker = require('faker');

module.exports = {

    generateUser: () => ({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password()
    }),

    generateRecipe: () => ({
        imageUrl: 'fried-chicken.jpg',
        title: faker.lorem.sentence(),
        description: faker.lorem.sentences(3),
        timeToCook: faker.random.number(),
        ingredients: [faker.lorem.sentence(), faker.lorem.sentence(), faker.lorem.sentence()],
        procedure: [faker.lorem.sentence(), faker.lorem.sentence(), faker.lorem.sentence()]
    })

}