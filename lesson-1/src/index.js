function add(num1, num2){
    
    if(!num1 || !num2){
        throw new Error('2 numbers are required for adding')
    }
    
    return num1 + num2;
}

module.exports = {
    add
}

//console.log(add(2,3))