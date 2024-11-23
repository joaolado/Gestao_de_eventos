
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Return all Users
exports.getAll = async (req, res) => 
{
    try 
    {
        // Read all from DB
        const response = await prisma.users.findMany({

            where: 
            {
                deleted: null, // Only includes Non-Deleted Users
            },

            include: 
            {
                address: true,   // Include related UsersAddress
                usersType: true, // Include related UsersType
            } 
        });

        res.status(200).json(response);
    }
    
    catch (error) 
    {
        res.status(500).json({ error: 'Failed to Retrieve Users.', details: error.message });
    }
};

// Return Users by ID
exports.getById = async (req, res) => 
{
    // Get Users ID requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try 
    {
        // Finds Users by ID
        const response = await prisma.users.findUnique({

            where: 
            { 
                id: id,
                deleted: null, // Only if Users is Not-Deleted 
            },

            include: 
            {   
                address: true,   // Include related UsersAddress
                usersType: true, // Include related UsersType
            },
        });

        // Return Users
        res.status(200).json(response);
    }

    catch (error) 
    {
        res.status(404).json({ error: 'Users Not Found.', details: error.message });
    }
};

// Creates Users
exports.create = async (req, res) => 
{
    // Get requested Users properties
    const 
    { 
        userName,
        userPassword,
        firstName,
        lastName,
        phone,
        email,
        addressId, 

    } = req.body;

    try 
    {
        // Creates new Users
        const newUsers = await prisma.users.create({

            data: 
            {
                userName: userName,
                userPassword: userPassword,
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                email: email,
                addressId: addressId, // Nullable Field
            },
        });

        // Return Users created
        res.status(201).json(newUsers);
    }

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Create Users.', details: error.message });
    }
};

// Updates Users by ID
exports.update = async (req, res) => 
{
    const 
    { 
        id,
        userName,
        userPassword,
        firstName,
        lastName,
        phone,
        email,
        addressId, 

    } = req.body;

    try 
    {   
        // Finds Users to Update their Data
        const updatedUsers = await prisma.users.update({

            where: 
            { 
                id: id, 
            },

            data: 
            {
                userName: userName,
                userPassword: userPassword,
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                email: email,
                addressId: addressId, // Nullable Field
            },
        });

        // Return Users Updated
        res.status(200).json(updatedUsers);
    }

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Update Users.', details: error.message });
    }
};

// Delete Users by ID
exports.delete = async (req, res) => 
{
    // Get Users ID requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try
    {   
        // Delete Users ( Soft delete by setting the `deleted` field )
        const deletedUsers = await prisma.users.update({

            where: 
            { 
                id: id,
            },

            data: 
            { 
                deleted: new Date(),
            },
        });

        // Returns Users Deleted
        res.status(200).json({ message: 'User Deleted successfully: ', deletedUsers });
    }

    catch (error)
    {
        res.status(400).json({ error: 'Failed to Delete User.', details: error.message });
    }
};

// Restore Users by ID
exports.restore = async (req, res) => 
{
     // Get Users ID requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try 
    {   
        // Restore Users
        const restoredUser = await prisma.users.update({

            where: 
            { 
                id: id,
            },

            data: 
            {   
                deleted: null, // Clear the Deleted Field
            }, 
        });

        // Returns Users Restored
        res.status(200).json({ message: 'User Restored Successfully: ', restoredUser });
    } 

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Restore User.', details: error.message });
    }
};