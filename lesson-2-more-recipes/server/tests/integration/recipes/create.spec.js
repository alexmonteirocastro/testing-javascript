import faker from 'faker';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import app from '../../../index';
import config from '../../../config'
import { generateUser, generateRecipe } from '../../utils/generate'
import { User, Recipe } from '../../../database/models';


describe('The create recipe process', () => {
    
    test('should create recipe and return recipe details', async () => {
    
        /// Arrange

        // Create fake recipe
        const fakeRecipe = await generateRecipe();

        const { user, token } = await generateUser();

        /// Action

        // make an authenticated request to create a recipe
        const response = await supertest(app).post('/api/v1/recipes').send({
            
            ...fakeRecipe, 
            access_token: token

        });

        /// Assertion

        console.log(response.body)
        // make sure recipe is returned
        const { recipe } = response.body.data;
        expect(response.status).toBe(201);
        expect(recipe.title).toBe(fakeRecipe.title);
        expect(recipe.description).toBe(fakeRecipe.description);

        // make sure recipe is in database
        const recipeFromDatabase = await Recipe.findById(recipe.id)

        //console.log(recipeFromDatabase)

        // make sure recipe creator is fake user
        expect(recipeFromDatabase).toBeTruthy();

    });


});