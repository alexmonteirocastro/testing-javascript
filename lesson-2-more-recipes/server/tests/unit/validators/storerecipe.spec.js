import validators from '../../../validators/';

const { StoreRecipeValidator } = validators;

describe('the StoreRecipeValidator class', () => {
    
    describe('The validateTitle method', () => {
        
        test('no title provided -> add error title required ', () => {
            
        });

        test('title provided shorter than 6 char-> add error title must be longer than 5 chars', () => {
            
        });

    });

    describe('The validateDescription method', () => {
        
        test('no description provided -> add error description required ', () => {
            
        });

        test('description provided shorter than 6 char-> add error description must be longer than 5 chars', () => {
            
        });

    });

    describe('The validateTimeToCook method', () => {
        
        test('no timeToCook provided -> add error timeToCook required ', () => {
            
        });

        test('timeToCook provided not a number base 10 -> add error timeToCook must be a number in minustes', () => {
            
        });

    });

    describe('The validateIngredients method', () => {
        
        test('no ingredients provided -> add error ingredients required ', () => {
            
        });

        test('ingredients provided in a non-JSON format -> add error that ingredients must be in a JSON format', () => {
            
        });

        test('json provided does not have ingredients array -> add error that there must be a list of ingredients', () => {
            
        });

        test('json provided has empty ingredients array -> add error that there must be at least 1 ingredient', () => {
            
        });

    });

    describe('The validateImageUrl method', () => {
        
        test('no imageUrl provided -> add error imageUrl required ', () => {
            
        });

        test('imageUrl provided is not a valid URL <> add error that imageUrl must be a valid web URL', () => {
            
        });

    });

    describe('The validateProcedure method', () => {
        
        test('no procedure provided -> add error procedure required ', () => {
            
        });

        test('procedure provided in a non-JSON format -> add error that procedure must be in a JSON format', () => {
            
        });

        test('json provided does not have procedure array -> add error that there must be a list of procedure steps', () => {
            
        });

        test('json provided has empty procedure array -> add error that there must be at least 1 procedure step', () => {
            
        });

    });

    describe('The validation (isValid method)', () => {
        
        test('validation is successful -> return true', () => {
            
        });

        test('attempts validation without prividing a recipe -> adds error that no recipe was provided and returns false', () => {
            
        });
        
        test('validation fails -> return false', () => {
            
        });

        test('checks if all the required functions are called in the validation', () => {
            
        });

    });

});