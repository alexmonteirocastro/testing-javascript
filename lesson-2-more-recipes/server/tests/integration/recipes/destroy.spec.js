import faker from 'faker';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import app from '../../../index';
import config from '../../../config'
import { generateUser, generateRecipe } from '../../utils/generate'
import { User, Recipe } from '../../../database/models';

describe('The delete recipe endpoint', () => {
    
    test('deletes recipe from database', async () => {
        
        /// Arrange

        // fake user and create recipe for this user
        const { token, user } = await generateUser();

        const fakeRecipe = await generateRecipe();

        const recipe = await Recipe.create({

            ...fakeRecipe,
            userId: user.id

        });

        /// Action

        // make DELETE request to delete recipe
        const response = await supertest(app).delete(`/api/v1/recipes/${recipe.id}`).send({
            access_token: token
        })

        /// Assertion
        console.log(response.body);
        // response from server is recipe deleted
        expect(response.status).toBe(200);
        expect(response.body.data.message).toBe('Recipe deleted.');

        // make sure the recipe is no longer in the database
        const recipeFromDatabase = await Recipe.findAll({where: {id: recipe.id}})

        expect(recipeFromDatabase.length).toBe(0);

    });

});