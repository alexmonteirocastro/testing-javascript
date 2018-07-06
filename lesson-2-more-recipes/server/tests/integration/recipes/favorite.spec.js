import faker from 'faker';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import app from '../../../index';
import config from '../../../config'
import { generateUser, generateRecipe } from '../../utils/generate'
import { User, Recipe } from '../../../database/models';

describe('The favorite recipe endpoint', () => {
    
    test('should favourite a recipe from database', async () => {
        
        /// Arrange

        // fake user and create recipe for this user
        const { token, user } = await generateUser();

        const fakeRecipe = await generateRecipe();

        const recipe = await Recipe.create({

            ...fakeRecipe,
            userId: user.id

        });

        const { token, user } = await generateUser();

    });

});