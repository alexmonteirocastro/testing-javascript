import middleware from '../../../middleware';

const { authorize } = middleware;

describe('the authorize middleware', () => {

    test('should calls next if userId is authorized', async () => {

        const req = {

            currentRecipe: {
                userId: 1
            },
            authUser: {
                id: 1
            }

        }

        const res = {};

        const next = jest.fn();

        await authorize(req, res, next);

        expect(req.currentRecipe.userId).toBeDefined();

        expect(req.authUser.id).toBeDefined();

        expect(next).toHaveBeenCalled();

    });

    test('should call sendFailureResponse if userId is not authorized', async () => {

        const req = {

            currentRecipe: {
                userId: 1
            },
            authUser: {
                id: 2
            }

        };

        const res = {

            sendFailureResponse: jest.fn()

        };

        const next = jest.fn();

        await authorize(req, res, next);

        // expect(req.currentRecipe.userId).toBeDefined();

        // expect(req.authUser.id).toBeDefined();

        expect(next).toHaveBeenCalledTimes(0);

        expect(res.sendFailureResponse).toHaveBeenCalledWith({ message: 'Unauthorized.' }, 401);

    });

});