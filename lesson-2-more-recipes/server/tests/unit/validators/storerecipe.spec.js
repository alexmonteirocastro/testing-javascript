import validators from '../../../validators/';

const { StoreRecipeValidator } = validators;

describe('the StoreRecipeValidator class', () => {
    
    describe('The validateTitle method', () => {
        
        test('no title provided -> add error title required ', () => {
            
            const recipe = new StoreRecipeValidator({});

            recipe.validateTitle();

            expect(recipe.errors).toEqual(
                ['The title is required.']
            );

        });

        test('title provided shorter than 6 char-> add error title must be longer than 5 chars', () => {
            
            const recipe = new StoreRecipeValidator({
                title: 'titl'
            });

            recipe.validateTitle();

            expect(recipe.errors).toEqual(
                ['The title must be longer than 5 characters.']
            );

        });

    });

    describe('The validateDescription method', () => {
        
        test('no description provided -> add error description required ', () => {
            
            const recipe = new StoreRecipeValidator({});

            recipe.validateDescription();

            expect(recipe.errors).toEqual(
                ['The description is required.']
            );

        });

        test('description provided shorter than 6 char-> add error description must be longer than 5 chars', () => {
            
            const recipe = new StoreRecipeValidator({
                description: 'this'
            });

            recipe.validateDescription();

            expect(recipe.errors).toEqual(
                ['The description must be longer than 5 characters.']
            );

        });

    });

    describe('The validateTimeToCook method', () => {
        
        test('no timeToCook provided -> add error timeToCook required ', () => {

            const recipe = new StoreRecipeValidator({});

            recipe.validateTimeToCook();

            expect(recipe.errors).toEqual(
                ['The time to cook is required.']
            );

        });

        test('timeToCook provided not a number base 10 -> add error timeToCook must be a number in minutes', () => {
            
            const recipe = new StoreRecipeValidator({
                timeToCook: "as"
            });

            recipe.validateTimeToCook();

            expect(recipe.errors).toEqual(
                ['The time to cook must be a number in minutes.']
            );

        });

    });

    describe('The validateIngredients method', () => {
        
        test('no ingredients provided -> add error ingredients required ', () => {
            
            const recipe = new StoreRecipeValidator({});

            recipe.validateIngredients();

            expect(recipe.errors).toEqual(
                ['The ingredients are required.']
            );

        });

        test('ingredients provided in a non-JSON format -> add error that ingredients must be in a JSON format', () => {
            
            const recipe = new StoreRecipeValidator(
                { ingredients: 'Chicken'}
            );

            recipe.validateIngredients();

            expect(recipe.errors).toEqual(
                ['The ingredients must be a json list of ingredients.']
            );

        });

        test('json provided does not have ingredients array -> add error that there must be a list of ingredients', () => {
            
            const recipe = new StoreRecipeValidator({
                ingredients: '{ "ingredients": "Chicken"}'
            });

            recipe.validateIngredients();

            expect(recipe.errors).toEqual(
                ['There must be a list of ingredients.']
            );

        });

        test('json provided has empty ingredients array -> add error that there must be at least 1 ingredient', () => {
            
            const recipe = new StoreRecipeValidator({
                ingredients: '[]'
            });

            recipe.validateIngredients();

            expect(recipe.errors).toEqual(
                ['There must be at least one ingredient.']
            );

        });

    });

    describe('The validateImageUrl method', () => {
        
        test('no imageUrl provided -> add error imageUrl required ', () => {
            
            const recipe = new StoreRecipeValidator({});

            recipe.validateImageUrl();

            expect(recipe.errors).toEqual(
                ['The image url is required.']
            );

        });

        test('imageUrl provided is not a valid URL <> add error that imageUrl must be a valid web URL', () => {
            
            const recipe = new StoreRecipeValidator({
                imageUrl: 'google.com'
            });

            recipe.validateImageUrl();

            expect(recipe.errors).toEqual(
                ['The image url must be a valid web url.']
            );

        });

    });

    describe('The validateProcedure method', () => {
        
        test('no procedure provided -> add error procedure required ', () => {
            
            const recipe = new StoreRecipeValidator({});

            recipe.validateProcedure();

            expect(recipe.errors).toEqual(
                ['The procedure is required.']
            );

        });

        test('procedure provided in a non-JSON format -> add error that procedure must be in a JSON format', () => {
            
            const recipe = new StoreRecipeValidator(
                { procedure: 'Put the chicken in the oven'}
            );

            recipe.validateProcedure();

            expect(recipe.errors).toEqual(
                ['The procedure must be a json of procedural steps.']
            );

        });

        test('json provided does not have procedure array -> add error that there must be a list of procedure steps', () => {
            
            const recipe = new StoreRecipeValidator({
                procedure: '{ "step1": "Put the chicken in the oven"}'
            });

            recipe.validateProcedure();

            expect(recipe.errors).toEqual(
                ['There must be a list of procedure steps.']
            );

        });

        test('json provided has empty procedure array -> add error that there must be at least 1 procedure step', () => {
            
            const recipe = new StoreRecipeValidator({
                procedure: '[]'
            });

            recipe.validateProcedure();

            expect(recipe.errors).toEqual(
                ['There must be at least one procedure step.']
            );

        });

    });

    describe('The validation (isValid method)', () => {
        
        test('validation is successful -> return true', () => {
            
            const recipe = new StoreRecipeValidator({
                title: 'roasted chicken',
                description: 'roasted chicken in the oven',
                timeToCook: '30',
                ingredients: '["chicken"]',
                imageUrl: 'http://www.roasted.com/chicken.png',
                procedure: '["Put the chicken in the oven"]'
            });

            const validation = recipe.isValid();

            expect(validation).toBe(true);

        });

        test('attempts validation without prividing a recipe -> adds error that no recipe was provided and returns false', () => {
            
            const recipe = new StoreRecipeValidator();

            const validation = recipe.isValid();

            expect(recipe.errors).toEqual(['No recipe was provided.']);

            expect(validation).toBe(false);

        });
        
        test('validation fails -> return false', () => {
            
            const recipe = new StoreRecipeValidator({
                title: 'roasted chicken',
                description: 'roasted chicken in the oven',
                timeToCook: 'fr',
                ingredients: '["chicken"]',
                imageUrl: 'http://www.roasted.com/chicken.png',
                procedure: '["Put the chicken in the oven"]'
            });

            const validation = recipe.isValid();

            expect(validation).toBe(false);

        });

        test('checks if all the required functions are called in the validation', () => {
            
            const recipe = new StoreRecipeValidator({
                title: 'roasted chicken',
                description: 'roasted chicken in the oven',
                timeToCook: '30',
                ingredients: '["chicken"]',
                imageUrl: 'http://www.roasted.com/chicken.png',
                procedure: '["Put the chicken in the oven"]'
            });

            jest.spyOn(recipe, 'validateTitle');
            jest.spyOn(recipe, 'validateDescription');
            jest.spyOn(recipe, 'validateTimeToCook');
            jest.spyOn(recipe, 'validateImageUrl');
            jest.spyOn(recipe, 'validateIngredients');
            jest.spyOn(recipe, 'validateProcedure');

            const validation = recipe.isValid();

            expect(recipe.validateTitle).toHaveBeenCalled();
            expect(recipe.validateDescription).toHaveBeenCalled();
            expect(recipe.validateTimeToCook).toHaveBeenCalled();
            expect(recipe.validateImageUrl).toHaveBeenCalled();
            expect(recipe.validateIngredients).toHaveBeenCalled();
            expect(recipe.validateProcedure).toHaveBeenCalled();

        });

    });

});