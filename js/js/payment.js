const piRate=314159;

function convertToPi(usd){

return (usd/piRate).toFixed(6);

}

function payCourse(){

let pi=convertToPi(300);

Pi.createPayment({

amount:pi,
memo:"Godomcoworld course",

});

}
