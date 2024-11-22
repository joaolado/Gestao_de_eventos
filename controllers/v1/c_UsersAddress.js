
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Return all UsersAddress
exports.getAll = async (req, res) => 
{
    try 
    {
        // Read all from DB
        const response = await prisma.usersAddress.findMany();
        res.status(200).json(response);
    }
    
    catch (error) 
    {
        res.status(500).json({ error: 'Failed to Retrieve UsersAddress.' });
    }
};

// Return UsersAddress by ID
exports.getById = async (req, res) => 
{
    // Get UsersAddress ID requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try 
    {
        // Finds UsersAddress by ID
        const response = await prisma.usersAddress.findUnique({

            where: 
            { 
                id: id,
            },
        });

        // Return UsersAddress
        res.status(200).json(response);
    }

    catch (error) 
    {
        res.status(404).json({ error: 'UsersAddress Not Found.' });
    }
};

// Creates UsersAddress
exports.create = async (req, res) => 
{
    // Get requested UsersAddress properties
    const { usersAddress } = req.body;

    try 
    {
        // Creates new UsersAddress
        const newUsersAddress = await prisma.usersAddress.create({

            data: 
            {
                usersAddress: usersAddress,
            },
        });

        // Return UsersAddress created
        res.status(201).json(newUsersAddress);
    }

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Create UsersAddress.' });
    }
};

// Updates UsersAddress by ID
exports.update = async (req, res) => 
{

    const { id, usersAddress } = req.body;

    try 
    {   
        // Finds UsersAddress to Update their Data
        const updatedUsersAddress = await prisma.usersAddress.update({

            where: 
            { 
                id: id, 
            },

            data: 
            {
                usersAddress,
            },
        });

        // Return UsersAddress Updated
        res.status(200).json(updatedUsersAddress);
    }

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Update UsersAddress.' });
    }
};

// Delete UsersAddress by ID
exports.delete = async (req, res) => 
{

    // Get UsersAddress ID requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try
    {   
        // Delete UsersAddress
        await prisma.usersAddress.delete({
            where: 
            { 
                id: id,
            },
        });

        // Returns UsersAddress Deleted
        res.status(200).json({ message: 'UsersAddress deleted successfully.' });
    }

    catch (error)
    {
        res.status(400).json({ error: 'Failed to Delete UsersAddress.' });
    }
};
