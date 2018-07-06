import faker from 'faker';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import app from '../../../index';
import config from '../../../config'
import { generateUser, generateRecipe } from '../../utils/generate'
import { User, Recipe } from '../../../database/models';

describe('The update recipe endpoint', () => {
    
    test('should update recipe from the database', async () => {
        
        /// Arrange

        // fake user and create recipe for this user
        const { token, user } = await generateUser();

        const fakeRecipe = await generateRecipe();

        const recipe = await Recipe.create({

            ...fakeRecipe,
            userId: user.id

        });

        const updatedRecipe = {
            title: 'Pierogi',
            description: 'Polish Pierogi',
            timeToCook: 47,
            imageUrl: faker.internet.url(),
            ingredients: JSON.stringify([faker.lorem.sentence(), faker.lorem.sentence()]),
            procedure: JSON.stringify([faker.lorem.sentence(), faker.lorem.sentence()])
        }

        /// Action

        // make an authenticated PUT request to update a recipe
        const response = await supertest(app).put(`/api/v1/recipes/${recipe.id}`).send({
            
            ...updatedRecipe, 
            access_token: token

        });

        const recipeN = response.body.data.recipe;



        /// Assertion
        // response from server is recipe updated
        expect(response.status).toBe(200);
        expect(recipeN.title).toBe(updatedRecipe.title);
        expect(recipeN.description).toBe(updatedRecipe.description);

        // make sure the recipe is no longer in the database
        //const recipeFromDatabase = await Recipe.findAll({where: {id: recipe.id}})

        //expect(recipeFromDatabase.length).toBe(0);


    });

});