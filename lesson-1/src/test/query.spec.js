const assert = require('assert');

const { parse, stringify } = require('../query-string');

describe('The query-string package', () => {

    describe('Le parse function', () => {
    
        it('should return an object of all query parameters when a query string is passed', () => {
        
            const queryString = '?by=kati-frantz&popular=true&category=nodejs';

            const actual = parse(queryString);

            const expected = {
                by: 'kati-frantz',
                popular: 'true',
                category: 'nodejs'
            }

            assert.deepEqual(actual, expected);

        });

        it('should return an object { number: 3 } when "?number=3" is passed into it', () => {
            
            const expectedObject = (string) => {
    
                const parameters = string.substring(1).split('&');
            
                let expectedObj = {};
            
                parameters.forEach(parameter => {
                    
                    queryParameter = parameter.split('=');
            
                    expectedObj[queryParameter[0]] = queryParameter[1];
                    
                });
            
                return expectedObj;
            }
            

            const actual = parse('?number=3');

            const expected = expectedObject('?number=3');

            assert.deepEqual(actual, expected);

        });

        it('should return an object { number: 3 } when "number=3" is passed into it', () => {
            
            const expectedObject = (string) => {
    
                const parameters = string.split('&');
            
                let expectedObj = {};
            
                parameters.forEach(parameter => {
                    
                    queryParameter = parameter.split('=');
            
                    expectedObj[queryParameter[0]] = queryParameter[1];
                    
                });
            
                return expectedObj;
            }
            

            const actual = parse('number=3');

            const expected = expectedObject('number=3');

            assert.deepEqual(actual, expected);

        });

    });

    describe('The stringify function', () => {
        
        it('should return a query string when an object is passed into it', () => {
            
            const actualObj = {
                by: 'alex-castro',
                popular: 'false',
                category: 'testing',
                framework: 'mocha',
                hobby: 'fishing'
            }

            const expectedQueryString = (properties) => {
    
                let queryString = '?';
    
                properties.forEach(key => {
                    
                    queryString += `${key}=${actualObj[key]}&`
    
                });
    
                queryString = queryString.slice(0,-1);

                return queryString;
            }

            const actual = stringify(actualObj);

            const expected = expectedQueryString(Object.keys(actualObj));

            assert.deepEqual(actual, expected);

        });

        it('eliminates undefined and null values', () => {
            
            const actualObj = {
                by: 'alex-castro',
                popular: null,
                category: 'testing',
                framework: undefined,
                hobby: 'fishing'
            }

            const expectedQueryString = '?by=alex-castro&category=testing&hobby=fishing';

            const actual = stringify(actualObj);

            const expected = expectedQueryString;

            assert.deepEqual(actual, expected);

        });

    });

});