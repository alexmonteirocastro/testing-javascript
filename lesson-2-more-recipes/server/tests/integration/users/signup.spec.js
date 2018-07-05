import supertest from 'supertest';
import app from '../../../index';
import  { User } from '../../../database/models'

describe('The user sign up tests', () => {


    test('should register a new user',  async () => {
        
        //const response = await supertest(app).get('/api/v1/recipes');

        //console.log(response.body)

        // Arrange
        await User.destroy({ where: {} })

        // Get fake user data 
        const fakeUser = {
            name: 'bahdcoder',
            email: 'bahdcoder@gmail.com',
            password: 'password'
        }

        // Action

        // make post request to signup
        const response = await supertest(app).post('/api/v1/users/signup').send(fakeUser)


        // Assertion 

        // 1. response has the user data
        //console.log(response.body.data)
        expect(response.status).toBe(200);
        expect(response.body.data.user.name).toBe(fakeUser.name);
        expect(response.body.data.user.email).toBe(fakeUser.email);
        expect(response.body.data.access_token).toBeTruthy();

        // 2. The database has a user with the credentials we signed up with
        const userFromDatabase = await User.find({ where:{ email: fakeUser.email } });
        //console.log(userFromDatabase)
        expect(userFromDatabase).toBeTruthy();

    });

    test('should return validation error for duplicate email', async () => {
        
        /// arrange

        // prepare fake data
        const fakeUser = {
            name: 'bahdcoder',
            email: 'bahdcoder@gmail.com',
            password: 'password'
        }

        // clean the databse
        await User.destroy({ where: {} })


        // put user to the database. (resgister a user before hand)
        await User.create(fakeUser);

        /// action

        // POST request to register user with duplicate email
        const response = await supertest(app).post('/api/v1/users/signup').send(fakeUser)
        
        /// assertion

        // 1. make sure the response from the server has a 422 status
        expect(response.status).toBe(422);

        // 2. Make sure that errors from server match the scenario
        console.log(response.body);
        expect(response.body.status).toBe('fail');
        expect(response.body.data).toEqual({ errors: [ 'A user with this email already exists.' ] });
        expect(response.body).toMatchSnapshot();

    });

});