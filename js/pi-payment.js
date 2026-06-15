function payCourse(){

let usd=300;
let pi=(usd/314159).toFixed(6);

Pi.createPayment({

amount:pi,
memo:"Godomcoworld Course Payment",
metadata:{type:"course"}

},

{

onReadyForServerApproval:function(paymentId){
console.log(paymentId);
},

onReadyForServerCompletion:function(paymentId,txid){
console.log(txid);
},

onCancel:function(paymentId){
console.log("Payment cancelled");
},

onError:function(error){
console.error(error);
}

});

}