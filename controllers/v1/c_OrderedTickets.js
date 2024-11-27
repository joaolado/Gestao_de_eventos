
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Return all OrderedTickets
exports.getAll = async (req, res) => 
{
    try 
    {
        // Read all from DB
        const response = await prisma.orderedTickets.findMany({

            include: 
            {
                ticketsInfo: true, // Include related TicketsInfo
            } 
        });

        // Return All OrderedTickets
        res.status(200).json(response);
    }
    
    catch (error) 
    {
        res.status(500).json({ error: 'Failed to Retrieve OrderedTickets.', details: error.message });
    }
};

// Return OrderedTickets by ID
exports.getById = async (req, res) => 
{
    // Get OrderedTickets ID requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try 
    {
        // Finds OrderedTickets by ID
        const response = await prisma.orderedTickets.findUnique({

            where: 
            { 
                id: id,
            },

            include: 
            {
                ticketsInfo: true, // Include related TicketsInfo
            } 
        });

        // Return OrderedTickets
        res.status(200).json(response);
    }

    catch (error) 
    {
        res.status(404).json({ error: 'OrderedTickets Not Found.', details: error.message });
    }
};

// Creates OrderedTickets
exports.create = async (req, res) => 
{
    // Get requested OrderedTickets properties
    const 
    { 
        ticketsInfoId, 
        quantity, 

    } = req.body;

    try 
    {
        // Creates new OrderedTickets
        const newOrderedTickets = await prisma.orderedTickets.create({

            data: 
            {
                ticketsInfoId: ticketsInfoId, // Nullable Field
                quantity: quantity,
            },
        });

        // Return OrderedTickets created
        res.status(201).json(newOrderedTickets);
    }

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Create OrderedTickets.', details: error.message });
    }
};

// Updates OrderedTickets by ID
exports.update = async (req, res) => 
{
    const 
    { 
        id, 
        ticketsInfoId, 
        quantity, 
    
    } = req.body;

    try 
    {   
        // Finds OrderedTickets to Update their Data
        const updatedOrderedTickets = await prisma.orderedTickets.update({

            where: 
            { 
                id: id, 
            },

            data: 
            {
                ticketsInfoId: ticketsInfoId, // Nullable Field
                quantity: quantity,
            },
        });

        // Return OrderedTickets Updated
        res.status(200).json(updatedOrderedTickets);
    }

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Update OrderedTickets.', details: error.message });
    }
};

// Delete OrderedTickets by ID
exports.delete = async (req, res) => 
{
    // Get OrderedTickets ID requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try
    {   
        // Delete OrderedTickets
        await prisma.orderedTickets.delete({
            
            where: 
            { 
                id: id,
            },
        });

        // Returns OrderedTickets Deleted
        res.status(200).json({ message: 'OrderedTickets Deleted Successfully.' });
    }

    catch (error)
    {
        res.status(400).json({ error: 'Failed to Delete OrderedTickets.', details: error.message });
    }
};