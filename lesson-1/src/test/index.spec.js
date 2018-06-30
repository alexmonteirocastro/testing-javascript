const assert = require('assert');

const { add } = require('./../index');

describe('The ADD function tests', () => {
    it('Should return 11 for arguments 5 and 6', () => {
        
        const result = add(5,6);

        const expected = 11;

        assert.equal(result, expected); 
    });

    it('Should throw error if no arguments are passed', () => {
        assert.throws(() => {
            add();
        })
    });

    it('Should throw error if only one argument is passed', () => {
        assert.throws(() => {
            add(3);
        })
    })
})

/*
console.log('First test');

const result1 = add(5,6);

const expected1 = 11;

//assertion - checks to see if the result of the operation is equal to expectation

assert.equal(result1, expected1); //use this...


//instead of this
/*
if(actual !== expected) {
    console.log(`Add function expected to return 11 but returned ${result} instead`);
    throw new Error('Test failed')
}
else 
    console.log('test passed!')



console.log('Second test Test if add function throws an error if no arguments are passed');

assert.throws(() => {
    add();
})

console.log('Second test Test if add function throws an error if only one argument is passed');

assert.throws(() => {
    add(3);
})

console.log('all tests passed');
*/