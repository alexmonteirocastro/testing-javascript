
import { User } from '../../../database/models';

import validators from '../../../validators';


const { RegisterUserValidator } = validators;

describe('The RegisterUserValidator class', () => {
    
    describe('The validateName function', () => {
       
        test('The  validateName function adds a required error to the errors array if name is not provided', () => {
        
            /** 3 STEPS: ARRANGE, ACTION, ASSERT */

            //ARRANGE
            
            const validator = new RegisterUserValidator({

                email: 'bahdcoder@gmail.com'

            })

            //ACTION

            validator.validateName();

            //ASSERTION

            const errors = validator.errors;

            //console.log(errors);

            expect(errors).toEqual(['The name is required.']);

        });

        test('Adds an error if name is less than 5 characters long', () => {
            
            //Arrange 
            const validator = new RegisterUserValidator({

                name: 'bahd'

            })

            //Action
            validator.validateName();

            //Assertion
            expect(validator.errors).toEqual(['The name must be longer than 5 characters.']);

        });

    });

    describe('The validatePassword function', () => {
        
        test('if password is not proided, adds error that the password is required', () => {
           
            //Arrange
            const validator = new RegisterUserValidator({
                email: 'bahdcoder@gmail.com'
            });

            //Action
            validator.validatePassword();

            //Assertion
            const { errors } = validator;

            expect(errors).toEqual(['The password is required.']);
        });

        test('if password is smaller than 6 chars long, adds error that the password must be longer than 5 characters', () => {
            
            //Arrange
            const validator = new RegisterUserValidator({ 
                password: '12345'
            });

            //Action
            validator.validatePassword();

            //Assertion
            const { errors } = validator;

            expect(errors).toEqual(['The password must be longer than 5 characters.']);

        });

    });

    describe('The validateEmail function', () => {
        
        test('if email input is not provided, adds error that the email is required', async () => {
           
            //Arrange
            const validator = new RegisterUserValidator({
                name: 'bahdcoder'
            });

            //Action
            await validator.validateEmail();

            //Assertion
            expect(validator.errors).toEqual(['The email is required.']);
        });

        test('if email is in invalid format, adds error that the email must be a valid address', async () => {
            
            //Arrange
            const validator = new RegisterUserValidator({
                email: 'bahdcodergmail.com'
            });

            //Action
            await validator.validateEmail();

            //Assertion
            expect(validator.errors).toEqual(['The email must be a valid email address.']);

        });

        test('if email already exists, adds error that the email already exists', async () => {
            
            //clears the database - deletes all users
            await User.destroy({ where: {} })
            
            //Create a new user to the database
            await User.create({
                name: 'bahdcoder',
                email: 'bahdcoder@gmail.com', 
                password: 'password'
            })

            
            //Arrange
            const validator = new RegisterUserValidator({
                email: 'bahdcoder@gmail.com'
            });

            //Action
            await validator.validateEmail();

            //Assertion
            expect(validator.errors).toEqual(['A user with this email already exists.']);
        });

    });

    describe('The isValid function', () => {
        
        test('returns true if validation passes', async () => {
            
            //delete all users from database
            await User.destroy({ where: {} });

            //arrange
            const validator = new RegisterUserValidator({
                name: 'bahdcoder',
                email: 'bahdcoder@gmail.com',
                password: 'password'
            });

            //action
            const result = await validator.isValid();

            //assertion
            expect(result).toBe(true);

        });

        test('returns fails if validation fails - invalid data', async () => {

            //arrange
            const validator = new RegisterUserValidator({
                name: 'bahd'
            });

            //action
            const result = await validator.isValid();

            //assertion
            expect(result).toBe(false);

        });

        test('the validateName, validateEmail and validatePassword functions are being called in the isvalid function ', async () => {
            
            //arrange
            const validator = new RegisterUserValidator({
                name: 'bahd', 
                password: 'pass',
                email: 'bahdcodergmail.com'
            });

            //using a spy
            jest.spyOn(validator, 'validateName'); //watches the function doing our test
            jest.spyOn(validator, 'validateEmail');
            jest.spyOn(validator, 'validatePassword');

            //action
            await validator.isValid();

            //assertions
            expect(validator.validateName).toHaveBeenCalled();
            expect(validator.validateEmail).toHaveBeenCalled();
            expect(validator.validatePassword).toHaveBeenCalled();

        });

    });

});
