import validators from '../../../validators/';

const { SignInUserValidator } = validators;

describe('The SignInUserValidator class', () => {
    
    describe('the validatePassword method', () => {
        
        test('if no password is provided it should add an error asking for password', () => {
            
            const validator = new SignInUserValidator({
                email: 'bahdcoder@gmail.com'
            });

            validator.validatePassword();

            expect(validator.errors).toEqual(
                ['The password is required.']
            );

        });

    });

    describe('the validateEmail method', () => {
        
        test('if no email is provided, it adds an error that email is required', () => {
            
            const validator = new SignInUserValidator({});

            validator.validateEmail();

            expect(validator.errors).toEqual(
                ['The email is required.']
            );

        });

        test('if email provided has an invalid format, adds an error for invalid email', () => {
            
            const validator = new SignInUserValidator({
                email: 'bahdcoder.gmail.com'
            });

            validator.validateEmail();

            expect(validator.errors).toEqual(
                ['The email must be a valid email address.']
            );

        });

    });

    describe('the isValid method', () => {
        
        test('return true if validation passes', () => {
            
            const validator = new SignInUserValidator({
                email: 'bahdcoder@gmail.com',
                password: 'password'
            });

            const validation = validator.isValid();
            
            expect(validation).toBe(true);

        });

        test('return false if validation fails', () => {
            
            const validator = new SignInUserValidator({
                password: 'password'
            });

            const validation = validator.isValid();
            
            expect(validation).toBe(false);
        });

        test('checks if both functions validateEmail and validatePassword are called when the isValid function is executed', () => {
            
            const validator = new SignInUserValidator({
                password: 'password'
            });

            jest.spyOn(validator, 'validatePassword');
            jest.spyOn(validator, 'validateEmail');

            validator.isValid();

            expect(validator.validatePassword).toHaveBeenCalled();
            expect(validator.validateEmail).toHaveBeenCalled();
        });

    });

});