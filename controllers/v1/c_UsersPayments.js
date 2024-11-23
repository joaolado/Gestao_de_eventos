
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Return all UsersPayments
exports.getAll = async (req, res) => 
{
    try 
    {
        // Read all from DB
        const response = await prisma.usersPayments.findMany({

            include: 
            {
                user: true, // Include related Users
            } 
        });

        // Return All UsersPayments
        res.status(200).json(response);
    }
    
    catch (error) 
    {
        res.status(500).json({ error: 'Failed to Retrieve UsersPayments.', details: error.message });
    }
};

// Return UsersPayments by ID
exports.getById = async (req, res) => 
{
    // Get UsersPayments ID requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try 
    {
        // Finds UsersPayments by ID
        const response = await prisma.usersPayments.findUnique({

            where: 
            { 
                id: id,
            },

            include: 
            {
                user: true, // Include related Users
            },
        });

        // Return UsersPayments
        res.status(200).json(response);
    }

    catch (error) 
    {
        res.status(404).json({ error: 'UsersPayments Not Found.', details: error.message });
    }
};

// Creates UsersPayments
exports.create = async (req, res) => 
{
    // Get requested UsersPayments properties
    const 
    { 
        usersId, 
        paymentType, 
        paymentProvider, 

    } = req.body;

    try 
    {
        // Creates new UsersPayments
        const newUsersPayments = await prisma.usersPayments.create({

            data: 
            {
                usersId: usersId,  // Nullable Field
                paymentType: paymentType,
                paymentProvider: paymentProvider,
            },
        });

        // Return UsersPayments created
        res.status(201).json(newUsersPayments);
    }

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Create UsersPayments.', details: error.message });
    }
};

// Updates UsersPayments by ID
exports.update = async (req, res) => 
{
    const 
    { 
        id, 
        usersId, 
        paymentType, 
        paymentProvider, 
    
    } = req.body;

    try 
    {   
        // Finds UsersPayments to Update their Data
        const updatedUsersPayments = await prisma.usersPayments.update({

            where: 
            { 
                id: id, 
            },

            data: 
            {
                usersId: usersId,  // Nullable Field
                paymentType: paymentType,
                paymentProvider: paymentProvider,
            },
        });

        // Return UsersPayments Updated
        res.status(200).json(updatedUsersPayments);
    }

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Update UsersPayments.', details: error.message });
    }
};

// Delete UsersPayments by ID
exports.delete = async (req, res) => 
{
    // Get UsersPayments ID requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try
    {   
        // Delete UsersPayments
        await prisma.usersPayments.delete({
            
            where: 
            { 
                id: id,
            },
        });

        // Returns UsersPayments Deleted
        res.status(200).json({ message: 'UsersPayments Deleted Successfully.' });
    }

    catch (error)
    {
        res.status(400).json({ error: 'Failed to Delete UsersPayments.', details: error.message });
    }
};