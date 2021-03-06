import faker from 'faker';
import middleware from '../../../middleware';
import config from '../../../config'
import jwt from 'jsonwebtoken';

import { generateUser } from '../../utils/generate'


const { auth } = middleware;

describe('The auth middleware', () => {
    
    test('should call next if user is authenticated', async () => {

        const { user, token, fakeUser } = await generateUser();

        const req = {

            body: {
                access_token: token
            }

        }

        const res = {};

        const next = jest.fn();

        await auth(req, res, next);

        expect(next).toHaveBeenCalled();

        expect(req.authUser).toBeDefined();

        expect(req.authUserObj).toBeDefined();

    });

    test('should call sendFailureResponse if user is not authenticated', async () => {
        
        const req = {

            body: {},

            query: {},

            headers: {}

        }

        const res = {
            
            sendFailureResponse: jest.fn()

        }

        const next = jest.fn();

        await auth(req, res, next);

        expect(res.sendFailureResponse).toHaveBeenCalledWith({

            message: "Unauthenticated."

        }, 401);

        expect(next).toHaveBeenCalledTimes(0);
        
    });

    test('should throw an eror if user is not found', async () => {
        
        const req = {

            body: {
                access_token: jwt.sign({email: 'emailnotfound@404.com'}, config.JWT_SECRET)
            }

        }

        const res = {
            
            sendFailureResponse: jest.fn()

        }

        const next = jest.fn();

        await auth(req, res, next);

        expect(res.sendFailureResponse).toHaveBeenCalledWith({

            message: "Unauthenticated."

        }, 401);

    });

});