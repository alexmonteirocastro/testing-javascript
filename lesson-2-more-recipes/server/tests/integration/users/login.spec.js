import supertest from 'supertest';
import bcrypt from 'bcrypt';
import app from '../../../index';
import { User } from '../../../database/models'

describe('The user login', () => {

    beforeEach( async () => {
        // Clear the database
        await User.destroy({ where: {} })
    });
    
    test('the user can log in and get a jwt ', async () => {
        
        /// arrange

        //setup fake user data
        const fakeUser = {
            name: 'bahdcoder',
            email: 'bahdcoder@gmail.com',
            password: 'password'
        }

        // create new user
        await User.create({
            name: fakeUser.name,
            email: fakeUser.email,
            password: bcrypt.hashSync(fakeUser.password, 1)
        }); //come back later
        
        /// action

        // make POST request to login
        const response = await supertest(app).post('/api/v1/users/signin').send({
            email: fakeUser.email,
            password: fakeUser.password
        })

        //console.log(response.body)


        /// assertion
        expect(response.status).toBe(200);

        //assert response from server contains jwt and user data
        expect(response.body.data.access_token).toBeTruthy();
        expect(response.body.data.user.email).toBe(fakeUser.email);


    });

    test('if user tries to login without password, return error password required', async () => {
        
        /// Arrange

        //setup fake user data
        const fakeUser = {
            name: 'bahdcoder',
            email: 'bahdcoder@gmail.com',
            password: ''
        }

        // create new user
        await User.create({
            name: fakeUser.name,
            email: fakeUser.email,
            password: fakeUser.password
        }); //come back later
        
        /// action

        // make POST request to login
        const response = await supertest(app).post('/api/v1/users/signin').send({
            email: fakeUser.email,
            password: fakeUser.password
        })

        // console.log(response.body)

        /// Assertion
        expect(response.body.status).toBe('fail');
        expect(response.body.data).toEqual({errors: ['The password is required.']});

    });

    test('if user tries to login without email, return error email required', async () => {
        /// Arrange

        //setup fake user data
        const fakeUser = {
            name: 'bahdcoder',
            email: '',
            password: 'password'
        }

        // create new user
        await User.create({
            name: fakeUser.name,
            email: fakeUser.email,
            password: fakeUser.password
        }); //come back later
        
        /// action

        // make POST request to login
        const response = await supertest(app).post('/api/v1/users/signin').send({
            email: fakeUser.email,
            password: fakeUser.password
        })

        //console.log(response.body)

        /// Assertion
        expect(response.body.status).toBe('fail');
        expect(response.body.data).toEqual({errors: ['The email is required.']});
    });

    test('if user tries to login with invalid email, return error email must be valid', async () => {
        
        /// Arrange

        //setup fake user data
        const fakeUser = {
            name: 'bahdcoder',
            email: 'bahdcoder@gmailcom',
            password: 'password'
        }

        // create new user
        await User.create({
            name: fakeUser.name,
            email: fakeUser.email,
            password: fakeUser.password
        }); //come back later
        
        /// action

        // make POST request to login
        const response = await supertest(app).post('/api/v1/users/signin').send({
            email: fakeUser.email,
            password: fakeUser.password
        })

        // console.log(response)

        /// Assertion
        expect(response.body.status).toBe('fail');
        expect(response.body.data).toEqual({errors: ['The email must be a valid email address.']});
    });

});
