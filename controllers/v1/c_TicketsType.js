
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Return all TicketsType
exports.getAll = async (req, res) => 
{
    try 
    {
        // Read all from DB
        const response = await prisma.ticketsType.findMany();

        // Return All TicketsType
        res.status(200).json(response);
    }
    
    catch (error) 
    {
        res.status(500).json({ error: 'Failed to Retrieve TicketsType.', details: error.message });
    }
};

// Return TicketsType by ID
exports.getById = async (req, res) => 
{
    // Get TicketsType ID requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try 
    {
        // Finds TicketsType by ID
        const response = await prisma.ticketsType.findUnique({

            where: 
            { 
                id: id,
            },
        });

        // Return TicketsType
        res.status(200).json(response);
    }

    catch (error) 
    {
        res.status(404).json({ error: 'TicketsType Not Found.', details: error.message });
    }
};

// Creates TicketsType
exports.create = async (req, res) => 
{
    // Get requested TicketsType properties
    const 
    { 
        ticketsType, 
        description, 

    } = req.body;

    try 
    {
        // Creates new TicketsType
        const newTicketsType = await prisma.ticketsType.create({

            data: 
            {
                ticketsType: ticketsType,
                description: description,
            },
        });

        // Return TicketsType created
        res.status(201).json(newTicketsType);
    }

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Create TicketsType.', details: error.message });
    }
};

// Updates TicketsType by ID
exports.update = async (req, res) => 
{
    const 
    { 
        id, 
        ticketsType, 
        description,
    
    } = req.body;

    try 
    {   
        // Finds TicketsType to Update their Data
        const updatedTicketsType = await prisma.ticketsType.update({

            where: 
            { 
                id: id, 
            },

            data: 
            {
                ticketsType: ticketsType,
                description: description,
            },
        });

        // Return TicketsType Updated
        res.status(200).json(updatedTicketsType);
    }

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Update TicketsType.', details: error.message });
    }
};

// Update TicketsType by ID
// Valid Status
const validStatuses = ['Active', 'Disabled'];

exports.updateStatus = async (req, res) => 
{
    const 
    { 
        id, 
        status,

    } = req.body;

    // Validate Status
    if (!validStatuses.includes(status)) 
    {
        return res.status(400).json({ error: `Invalid Status. Allowed Status are: ${validStatuses.join(', ')}` });
    }

    try 
    {
        const updatedTicketsType = await prisma.ticketsType.update({

            where: 
            {
                id: id,
            },

            data: 
            {
                status: status, // Update the Status Field
            },
        });

        res.status(200).json({ message: 'Ticket Type Status Updated Successfully: ', updatedTicketsType });
    } 

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Update Ticket Type Status.', details: error.message });
    }
};

// Delete TicketsType by ID
exports.delete = async (req, res) => 
{
    // Get TicketsType ID requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try
    {   
        // Delete TicketsType
        await prisma.ticketsType.delete({
            
            where: 
            { 
                id: id,
            },
        });

        // Returns TicketsType Deleted
        res.status(200).json({ message: 'TicketsType Deleted Successfully.' });
    }

    catch (error)
    {
        res.status(400).json({ error: 'Failed to Delete TicketsType.', details: error.message });
    }
};