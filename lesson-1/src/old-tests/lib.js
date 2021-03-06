/** Our own assertion library */
const assert = {
    
    equal(actual, expected){

        if(actual !== expected){
            throw new Error(`Expected ${actual} to be equal to ${expected}`);
        }

    }
};

const test = function(testTitle, callback){
  
    try {

      callback();

      console.log(`Passed: ${testTitle}`);

  } catch (error) {

      console.error(`Failed: ${testTitle}`);


      //throw error;

      console.error('Test Failed:', error);
  }  
};

module.exports = {
    test,
    assert
};
