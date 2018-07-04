import faker from 'faker';
import middleware from '../../../middleware';
import { Recipe } from '../../../database/models';

const { hasRecipe } = middleware;

describe('The hasRecipe middleware', () => {
    
    test('should call the function next if the recipe is passed', async () => {
        
        const recipe = await Recipe.create({
            
            id: faker.random.uuid()

        });

        const req = {
            
            params: {
                id: recipe.id
            }

        };

        const res = {};

        const next = jest.fn();

        await hasRecipe(req, res, next);

        expect(next).toHaveBeenCalled();

    });

    test('should call sendFailureResponse if recipe is not found', async () => {
        
        const req = {

            params: {}

        }

        const res = {

            sendFailureResponse: jest.fn()

        }

        const next = jest.fn();

        await hasRecipe(req, res, next)

        expect(res.sendFailureResponse).toHaveBeenCalledWith({ message: 'Recipe not found.' }, 404);

        expect(next).toHaveBeenCalledTimes(0);

    });

    test('should throw error if recipe is not passed in the request', async () => {
        
        const req = {}

        const res = {

            sendFailureResponse: jest.fn()

        }

        const next = jest.fn();

        await hasRecipe(req, res, next)

        expect(res.sendFailureResponse).toHaveBeenCalledWith({ message: 'Recipe not present in request.' }, 405);

        expect(next).toHaveBeenCalledTimes(0);

    });

});