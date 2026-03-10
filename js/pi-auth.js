Pi.init({ version: "2.0" });

async function loginPi(){

try{

const scopes = ['username','payments'];

const auth = await Pi.authenticate(scopes);

localStorage.setItem("user",auth.user.username);

alert("Welcome "+auth.user.username);

}catch(err){

console.error(err);

}

}
