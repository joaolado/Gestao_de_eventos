
const fs = require('fs');

//return all users
exports.getAll = async (req, res) => {
    //read local data json file
    const datajson = fs.readFileSync("data/local/data.json", "utf-8");
    //parse to json
    const data = JSON.parse(datajson);
    //returns users array
    return res.send(data.users);
}

//return users by his id (users number)
exports.getById = async (req, res) => {
    //get users id requested
    const id = req.params.number;
    //read local data json file
    const datajson = fs.readFileSync("data/local/data.json", "utf-8");
    //parse to json
    const data = JSON.parse(datajson);
    //finds users by his id
    const users = data.users.filter(users => users.number == id);
    //return users
    res.send(users);
}

//creates users
exports.create = async (req, res) => {
    //get requested users properties
    const { userName, userPassword, firstName, lastName, phone, email, addressId, usersType } = req.body;
    //read local data json file
    const datajson = fs.readFileSync("data/local/data.json", "utf-8");
    //parse to json
    const data = JSON.parse(datajson);
    //add to users array
    data.users.push(req.body);
    //add to users array
    fs.writeFileSync('data/local/data.json', JSON.stringify(data));
    //return new users
    return res.status(201).send(req.body);
}

//updates users
exports.update = async (req, res) => {
    const { number, name, city, birthday } = req.body;
    //read local data json file
    const datajson = fs.readFileSync("data/local/data.json", "utf-8");
    //parse to json
    const data = JSON.parse(datajson);
    //find users to update
    const users = data.users.find(users => users.number == number);
    //update properties
    users.name = name;
    users.city = city;
    users.birthday = birthday;
    //update local database
    fs.writeFileSync('data/local/data.json', JSON.stringify(data));
    //return updated users
    return res.send({number, name, city, birthday });
}   

//delete users by his id (users number)
exports.delete = async (req, res) => {
    //get users id requested
    const id = req.params.number;
    //read local data json file
    const datajson = fs.readFileSync("data/local/data.json", "utf-8");
    //parse to json
    const data = JSON.parse(datajson);
    //find users to delete
    const users = data.users.filter(users => users.number == id);
    //delete users
    data.users.splice(users, 1);
    //update local database
    fs.writeFileSync('data/local/data.json', JSON.stringify(data));
    //return ok
    return res.status(200).send("ok");
}