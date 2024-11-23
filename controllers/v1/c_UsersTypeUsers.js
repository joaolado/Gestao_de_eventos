
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Return all UsersTypeUsers
exports.getAll = async (req, res) => 
{
    try 
    {
        // Read all from DB
        const response = await prisma.usersTypeUsers.findMany({

            include: 
            {
                users: true,      // Include related Users
                usersType: true,  // Include related UsersType
            },
        });

        res.status(200).json(response);
    }
    
    catch (error) 
    {
        res.status(500).json({ error: 'Failed to Retrieve UsersTypeUsers.', details: error.message });
    }
};

// Return UsersTypeUsers by Users ID
exports.getById = async (req, res) => 
{
    // Get UsersTypeUsers ID requested
    const usersId = parseInt(req.params.usersId); // Ensure ID is an integer

    try 
    {
        // Finds UsersTypeUsers by ID
        const response = await prisma.usersTypeUsers.findUnique({

            where: 
            { 
                usersId: usersId,
            },

            include: 
            {
                usersType: true, // Include related UsersType
            },
        });

        // Return UsersTypeUsers
        res.status(200).json(response);
    }

    catch (error) 
    {
        res.status(404).json({ error: 'UsersTypeUsers Not Found for the User.', details: error.message });
    }
};

// Return UsersTypeUsers by UsersType ID
exports.getById = async (req, res) => 
{
    // Get UsersTypeUsers ID requested
    const usersTypeId = parseInt(req.params.usersTypeId); // Ensure ID is an integer

    try 
    {
        // Finds UsersTypeUsers by ID
        const response = await prisma.usersTypeUsers.findUnique({

            where: 
            { 
                usersTypeId : usersTypeId ,
            },

            include: 
            {
                users: true, // Include related UsersType
            },
        });

        // Return UsersTypeUsers
        res.status(200).json(response);
    }

    catch (error) 
    {
        res.status(404).json({ error: 'UsersTypeUsers Not Found for the UsersType.', details: error.message });
    }
};

// Creates UsersTypeUsers (New Association)
exports.create = async (req, res) => 
{
    // Get requested UsersTypeUsers properties
    const 
    { 
        usersId,
        usersTypeId,

    } = req.body;

    try 
    {
        // Creates new UsersTypeUsers
        const newUsersTypeUsers = await prisma.usersTypeUsers.create({

            data: 
            {
                usersId: usersId,
                usersTypeId: usersTypeId,
            },
        });

        // Return UsersTypeUsers created
        res.status(201).json(newUsersTypeUsers);
    }

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Create UsersTypeUsers.', details: error.message });
    }
};

// Delete UsersTypeUsers by ID
exports.delete = async (req, res) => 
{
    // Get UsersTypeUsers ID requested
    const 
    { 
        usersId,
        usersTypeId,

    } = req.body;

    try
    {   
        // Delete UsersTypeUsers
        await prisma.usersTypeUsers.delete({
            
            where: 
            { 
                usersId_usersTypeId: { usersId, usersTypeId }, // Composite key
            },
        });

        // Returns UsersTypeUsers Deleted
        res.status(200).json({ message: 'UsersTypeUsers Deleted Successfully.' });
    }

    catch (error)
    {
        res.status(400).json({ error: 'Failed to Delete UsersTypeUsers.', details: error.message });
    }
};