const fs = require('fs');
const crypto = require('crypto');

module.exports = class Repository {
  constructor(filename) {
    if (!filename) {
      throw new Error('Creating a repository requires a filename');
    }

    this.filename = filename;
    try {
      fs.accessSync(this.filename);            //check for if the file exists
    } catch (err) {
      fs.writeFileSync(this.filename, '[]');       //write/create a file
    }
  }

  async create(attrs) {
    attrs.id = this.randomId();                 //creating random id using randomId function

    const records = await this.getAll();         //getting the users in record
    records.push(attrs);                         //pushing the attribute or username-password in records
    await this.writeAll(records);

    return attrs;
  }

  async getAll() {                    //opening the file called filenname
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: 'utf8'
          // read its contents
            
    
            //parse the contents
    
            //return the parsed data
      })
    );
  }

  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)         //write the updated records back to filename & JSON used because our hardrive/filname is users.json
    );
  }

  randomId() {
    return crypto.randomBytes(4).toString('hex');       //using crypto library to generate random number & converting it to the hex value
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find(record => record.id === id);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter(record => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find(record => record.id === id);

    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }

    Object.assign(record, attrs);               //copy the attributes to record
    await this.writeAll(records);
  }

  async getOneBy(filters) {
    const records = await this.getAll();

    for (let record of records) {
      let found = true;

      for (let key in filters) {                    // for  IN loop used in iterating throungh object key
        if (record[key] !== filters[key]) {
          found = false;
        }
      }

      if (found) {
        return record;
      }
    }
  }
};
