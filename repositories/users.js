const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);     //promisyfying the function so no longer need callback inside scrypt because now it returns a promise

class UsersRepository extends Repository {
  async comparePasswords(saved, supplied) {
    // Saved -> password saved in our database. 'hashed.salt'
    // Supplied -> password given to us by a user trying sign in
    const [hashed, salt] = saved.split('.');
    const hashedSuppliedBuf = await scrypt(supplied, salt, 64);   //converting the user input password into hashed with salt

    return hashed === hashedSuppliedBuf.toString('hex');        
  }

  async create(attrs) {
    attrs.id = this.randomId();             //creating random id using randomId function

    const salt = crypto.randomBytes(8).toString('hex');      //creating the salt for our password for security
    const buf = await scrypt(attrs.password, salt, 64);         //taking password & salt & converting it into hashed value  

    const records = await this.getAll();           //getting the users in record
    const record = {
      ...attrs,
      password: `${buf.toString('hex')}.${salt}`           //updating the password we are passing & converting the hashed password value
    };
    records.push(record);                     //pushing the attribute or username-password in records

    await this.writeAll(records);

    return record;
  }
}


// const test= async () =>{                         //for calling method inside the class
// const repo=new UserRepository('users.jason');

// const user=await repo.getOneBy({email: 'test@gmail.com'});
// console.log(user);
// };

// test();

module.exports = new UsersRepository('users.json');

//creating the instance of the class to access it outside instead of exporting the entire class and then creating the instance there and 
//using methods & here argument to our construtor/ class is a jason file to save the data 