
const usersRouter = require('express').Router();
const controller = require( '../../controllers/v1/c_users' ) ;

// users CRUD
usersRouter.get('/', controller.getAll); //read all
usersRouter.get('/:number', controller.getById); //read one by his id (User number)
usersRouter.post('/create', controller.create); //create new User
usersRouter.put('/update', controller.update); //update User
usersRouter.delete('/delete/:number', controller.delete); //delete User

module.exports = usersRouter;