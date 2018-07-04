import faker from 'faker';
import middleware from '../../../middleware';
import { User } from '../../../database/models';

const { registerUserValidator } = middleware;


test('the registerUserValidator calls the next function if the validation is successful', async () => {  
    
    /**Here we are going to mock the request */
    
    //creating the request
    const req = {
        
        body: {
            name: 'bahdcoder',
            email: faker.internet.email(),
            password: '123456'
        }

    }

    //creating a response
    const res = {

        sendFailureResponse(){}

    }

    const next = jest.fn(); //this is the actual mock

    //calling the registerUserValidator function
    await registerUserValidator(req, res, next);

    expect(next).toHaveBeenCalled(); //works same way as spies

});

test('the registerUserValidator calls the sendFailureResponse function if the validation fails', async () => {
    
    const req = {
        
        body: {
            name: 'bahd',
            password: '1234'
        }

    }

    const res = {

        sendFailureResponse: jest.fn()

    }

    const next = jest.fn();

    await registerUserValidator(req, res, next);

    expect(res.sendFailureResponse).toHaveBeenCalled();

    //expect(next).not.toHaveBeenCalled();

    expect(next).toHaveBeenCalledTimes(0);

    expect(res.sendFailureResponse).toHaveBeenCalledWith({
        errors: [
            'The name must be longer than 5 characters.',
            'The password must be longer than 5 characters.',
            'The email is required.'
        ]
    }, 422);


});