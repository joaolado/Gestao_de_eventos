
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
        res.status(500).json({ error: 'Failed to Retrieve UsersAddress.', details: error.message });
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
        res.status(404).json({ error: 'UsersAddress Not Found.', details: error.message });
    }
};

// Creates UsersAddress
exports.create = async (req, res) => 
{
    // Get requested UsersAddress properties
    const 
    { 
        addressLine1, 
        addressLine2, 
        postalCode, 
        city, 
        region, 
        country,

    } = req.body;

    try 
    {
        // Creates new UsersAddress
        const newUsersAddress = await prisma.usersAddress.create({

            data: 
            {
                addressLine1: addressLine1,
                addressLine2: addressLine2,
                postalCode: postalCode,
                city: city,
                region: region,
                country: country,
            },
        });

        // Return UsersAddress created
        res.status(201).json(newUsersAddress);
    }

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Create UsersAddress.', details: error.message });
    }
};

// Updates UsersAddress by ID
exports.update = async (req, res) => 
{
    const 
    { 
        id, 
        addressLine1, 
        addressLine2, 
        postalCode, 
        city, 
        region, 
        country,
    
    } = req.body;

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
                addressLine1: addressLine1,
                addressLine2: addressLine2,
                postalCode: postalCode,
                city: city,
                region: region,
                country: country,
            },
        });

        // Return UsersAddress Updated
        res.status(200).json(updatedUsersAddress);
    }

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Update UsersAddress.', details: error.message });
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
        res.status(200).json({ message: 'UsersAddress Deleted Successfully.' });
    }

    catch (error)
    {
        res.status(400).json({ error: 'Failed to Delete UsersAddress.', details: error.message });
    }
};