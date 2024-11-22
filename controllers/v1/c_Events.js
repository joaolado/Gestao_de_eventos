
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Return all UsersType
exports.getAll = async (req, res) => 
{
    try 
    {
        // Read all from DB
        const response = await prisma.usersType.findMany();
        res.status(200).json(response);
    }
    
    catch (error) 
    {
        res.status(500).json({ error: 'Failed to Retrieve UsersType.' });
    }
};

// Return UsersType by ID
exports.getById = async (req, res) => 
{
    // Get UsersType ID requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try 
    {
        // Finds UsersType by ID
        const response = await prisma.usersType.findUnique({

            where: 
            { 
                id: id,
            },
        });

        // Return UsersType
        res.status(200).json(response);
    }

    catch (error) 
    {
        res.status(404).json({ error: 'UsersType Not Found.' });
    }
};

// Creates UsersType
exports.create = async (req, res) => 
{
    // Get requested UsersType properties
    const { usersType } = req.body;

    try 
    {
        // Creates new UsersType
        const newUsersType = await prisma.usersType.create({

            data: 
            {
                usersType: usersType,
            },
        });

        // Return UsersType created
        res.status(201).json(newUsersType);
    }

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Create UsersType.' });
    }
};

// Updates UsersType by ID
exports.update = async (req, res) => 
{

    const { id, usersType } = req.body;

    try 
    {   
        // Finds UsersType to Update their Data
        const updatedUsersType = await prisma.usersType.update({

            where: 
            { 
                id: id, 
            },

            data: 
            {
                usersType,
            },
        });

        // Return UsersType Updated
        res.status(200).json(updatedUsersType);
    }

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Update UsersType.' });
    }
};

// Delete UsersType by ID
exports.delete = async (req, res) => 
{

    // Get UsersType ID requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try
    {   
        // Delete UsersType
        await prisma.usersType.delete({
            where: 
            { 
                id: id,
            },
        });

        // Returns UsersType Deleted
        res.status(200).json({ message: 'UsersType deleted successfully.' });
    }

    catch (error)
    {
        res.status(400).json({ error: 'Failed to Delete UsersType.' });
    }
};
