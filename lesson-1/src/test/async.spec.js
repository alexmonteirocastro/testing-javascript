const { findUserById, findUserByEmail} = require('../async');

describe('The async tests', () => {
    
    describe('The findUserById function', () => {
        
        it('should return found user data by id', (done) => {
        
            const result = findUserById(1).then( result => {
                                
                expect(result.user.name).toBe('bahdcoder');

                done();

            });

        });

        it('return found user data by id', () => {
        
            return findUserById(3).then( result => {
                                
                expect(result.user.name).toBe('maldini3');

            });

        });

        //recommended way - using async function
        it('returns found user data by id', async () => {
        
            const result = await findUserById(2);

                expect(result.user.name).toBe('alexcastro');

        });

        it('should throw an error if user is not found by Id', () => {
            
            return findUserById(4).catch(error => {

                expect(error.message).toBe('User with id: 4 was not found');

            })

        });

    });

    describe('test findUserByEmail function', () => {
        
        it('should return found user data by email', (done) => {
        
            const result = findUserByEmail('bahdcoder@gmail.com').then( result => {
                                
                expect(result.user.id).toBe(1);

                done();

            });

        });

        it('return found user data by email', () => {
        
            return findUserByEmail('paolo_maldini@gmail.com').then( result => {
                                
                expect(result.user.id).toBe(3);

            });

        });

        it('returns found user data by Email', async () => {
        
            const result = await findUserByEmail('alex.monteiro@seznam.cz');

                expect(result.user.id).toBe(2);

        });

        it('should throw an error if user is not found by Email', async () => {
            
            try {
                
                await findUserByEmail('alex.monteiro@outlook.pt')

                assert.fail("EXPECTED_ERROR")//induce error

            } catch (error) {
                
                if (error.message === 'EXPECTED_ERROR') {
                    
                    throw error

                }

                expect(error.message).toBe('User with email: alex.monteiro@outlook.pt was not found');

            }

        });

    });

});