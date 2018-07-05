import middleware from '../../../middleware/';
//import validators from '../validators';

const { signinUserValidator } = middleware;

describe('The signInUserValidator middleware', () => {
    
    test('if user is valid, the function next should be called', async () => {
        
        const req = {

            body: {
                email: 'bahdcoder@gmail.com',
                password: 'password'
            }

        }

        const res = {}

        const next = jest.fn();

        await signinUserValidator(req, res, next);

        expect(next).toHaveBeenCalled();

    });

    test('if password is not provided, function sendFailureResponse should be called with missing password error', async () => {
        
        const req = {

            body: {
                email: 'bahdcoder@gmail.com',
                password: ''
            }

        }

        const res = {

            sendFailureResponse: jest.fn()

        }

        const next = jest.fn();

        await signinUserValidator(req, res, next);

        expect(res.sendFailureResponse).toHaveBeenCalledWith({ 
            errors: ['The password is required.'] 
        }, 422);

    });

    test('if email is not provided, function sendFailureResponse should be called with missing email error', async () => {
        
        const req = {

            body: {
                email: '',
                password: 'password'
            }

        }

        const res = {

            sendFailureResponse: jest.fn()

        }

        const next = jest.fn();

        await signinUserValidator(req, res, next);

        expect(res.sendFailureResponse).toHaveBeenCalledWith({ 
            errors: ['The email is required.'] 
        }, 422);

    });

    test('if email provided is not valid, function sendFailureResponse should be called invalid email error', async () => {
        
        const req = {

            body: {
                email: 'bahdcoder@gmailcom',
                password: 'password'
            }

        }

        const res = {

            sendFailureResponse: jest.fn()

        }

        const next = jest.fn();

        await signinUserValidator(req, res, next);

        expect(res.sendFailureResponse).toHaveBeenCalledWith({ 
            errors: ['The email must be a valid email address.'] 
        }, 422);

    });

});
