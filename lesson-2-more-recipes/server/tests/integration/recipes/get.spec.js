import faker from 'faker';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import app from '../../../index';
import config from '../../../config'
import { generateUser, generateRecipe } from '../../utils/generate'
import { User, Recipe } from '../../../database/models';

describe('The getRecipe endpoint', () => {
    
    test('can get a single recipe by Id', async () => {
        
        /// Arrange

        // Create a recipe

        const fakeRecipe = generateRecipe();

        const recipe = await Recipe.create(fakeRecipe);

        /// Action

        // get the recipe
        const response = await supertest(app).get(`/api/v1/recipes/${recipe.id}`)

        /// Assertion

        // expect status to be 200
        expect(response.status).toBe(200);


        // expect response to contain recipe data
        expect(response.body.data.recipe.title).toBe(fakeRecipe.title);

    });

    test('returns 404 if recipe is not found', async () => {
        
        /// Arrange

        // Create a fake id

        const FAKE_ID = 'fake_id';

        /// Action

        // get request with fake id
        const response = await supertest(app).get(`/api/v1/recipes/${FAKE_ID}`)

        /// Assertion

        // expect 404 to be returned from server
        expect(response.status).toBe(405);

    });

});