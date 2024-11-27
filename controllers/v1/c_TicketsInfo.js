
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Return all TicketsInfo
exports.getAll = async (req, res) => 
{
    try 
    {
        // Read all from DB
        const response = await prisma.ticketsInfo.findMany({

            where: 
            {
                deleted: null, // Only includes Non-Deleted TicketsInfo
            },

            select: 
            {
                id: true,
                SKU: true,
                price: true,
                quantity: true,
                status: true,

                ticketsType: { select: { name: true, }, }, // Only select the TicketsType name

                // Include Important Event Info
                event: 
                {
                     select: 
                     { 
                        id: true,
                        name: true, 
                        startDate: true, 
                        endDate: true,
                        addressLine1: true,
                    }, 
                },
            } 
        });

        // Transform the response to replace ticketsType object with ticketsType name - Makes it Linear
        const formattedResponse = response.map(ticketsInfo => ({
            ...ticketsInfo,
            ticketsType: ticketsInfo.ticketsType?.name || null, // Simplify ticketsType to its name
        }));

        // Return All TicketsInfo
        res.status(200).json(formattedResponse);
    }
    
    catch (error) 
    {
        res.status(500).json({ error: 'Failed to Retrieve TicketsInfo.', details: error.message });
    }
};

// Return TicketsInfo by ID
exports.getById = async (req, res) => 
{
    // Get TicketsInfo ID requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try 
    {
        // Finds TicketsInfo by ID
        const response = await prisma.ticketsInfo.findUnique({

            where: 
            { 
                id: id,
                deleted: null, // Only if TicketsInfo is Not-Deleted 
            },

            select: 
            {
                id: true,
                SKU: true,
                price: true,
                quantity: true,
                status: true,

                ticketsType: { select: { name: true, }, }, // Only select the TicketsType name

                // Include Important Event Info
                event: 
                {
                     select: 
                     { 
                        id: true,
                        name: true, 
                        startDate: true, 
                        endDate: true,
                        addressLine1: true,
                    }, 
                },
            } 
        });

        if (!response) 
        {
            return res.status(404).json({ error: 'Event Not Found.' });
        }
        
        // Transform the response to replace ticketsType object with ticketsType name - Makes it Linear
        const formattedResponse = {
            ...response,
            ticketsType: response.ticketsType?.name || null, // Simplify ticketsType to its name
        };

        // Return TicketsInfo
        res.status(200).json(formattedResponse);
    }

    catch (error) 
    {
        res.status(404).json({ error: 'TicketsInfo Not Found.', details: error.message });
    }
};

// Creates TicketsInfo
exports.create = async (req, res) => 
{
    // Get requested TicketsInfo properties
    const 
    { 
        SKU,
        price,
        quantity, 

        ticketName, // Return ticketsType instead of ticket Type ID

        name, 
        startDate, 
        endDate,
        addressLine1,

    } = req.body;

    try 
    {
        // Find the ticketsType ID based on the ticketsType
        const type = await prisma.ticketsType.findUnique({

            where: 
            { 
                name: ticketName,
            }
        });

        if (!type)
        {
            return res.status(404).json({ error: 'Ticket Type Not Found.' });
        }

        // Creates new TicketsInfo
        const newTicketsInfo = await prisma.ticketsInfo.create({

            data: 
            {
                SKU: SKU,
                price: price,
                quantity: quantity,

                ticketsTypeId: type.id,

                event: 
                {
                    create: 
                    { 
                        name: name, 
                        startDate: startDate, 
                        endDate: endDate,
                        addressLine1: addressLine1,
                    }, 
                },
            },

            include: 
            {
                event: true,
            },
        });

        // Return TicketsInfo created
        res.status(201).json(newTicketsInfo);
    }

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Create TicketsInfo.', details: error.message });
    }
};

// Updates TicketsInfo by ID
exports.update = async (req, res) => 
{
    const 
    { 
        id,
        eventsId,
        ticketsTypeId,
        SKU,
        price,
        quantity, 

    } = req.body;

    try 
    {   
        // Finds TicketsInfo to Update their Data
        const updatedTicketsInfo = await prisma.ticketsInfo.update({

            where: 
            { 
                id: id, 
            },

            data: 
            {
                eventsId: eventsId,           // Nullable Field
                ticketsTypeId: ticketsTypeId, // Nullable Field
                SKU: SKU,
                price: price,
                quantity: quantity,
            },
        });

        // Return TicketsInfo Updated
        res.status(200).json(updatedTicketsInfo);
    }

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Update TicketsInfo.', details: error.message });
    }
};

// Update TicketsInfo Status by ID
// Valid Status
const validStatuses = ['Available', 'Sold_Out', 'Coming_Soon'];

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
        const updatedTicketsInfo = await prisma.ticketsInfo.update({

            where: 
            {
                id: id,
            },

            data: 
            {
                status: status, // Update the Status Field
            },
        });

        res.status(200).json({ message: 'Ticket Info Status Updated Successfully: ', updatedTicketsInfo });
    } 

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Update Ticket Info Status.', details: error.message });
    }
};

// Delete TicketsInfo by ID
exports.delete = async (req, res) => 
{
    // Get TicketsInfo ID requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try
    {   
        // Delete TicketsInfo ( Soft delete by setting the `deleted` field )
        const deletedTicketsInfo = await prisma.ticketsInfo.update({

            where: 
            { 
                id: id,
            },

            data: 
            { 
                deleted: new Date(),
            },
        });

        // Returns TicketsInfo Deleted
        res.status(200).json({ message: 'User Deleted successfully: ', deletedTicketsInfo });
    }

    catch (error)
    {
        res.status(400).json({ error: 'Failed to Delete User.', details: error.message });
    }
};

// Restore TicketsInfo by ID
exports.restore = async (req, res) => 
{
     // Get TicketsInfo ID requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try 
    {   
        // Restore TicketsInfo
        const restoredTicketInfo  = await prisma.ticketsInfo.update({

            where: 
            { 
                id: id,
            },

            data: 
            {   
                deleted: null, // Clear the Deleted Field
            }, 
        });

        // Returns TicketsInfo Restored
        res.status(200).json({ message: 'Ticket Info Restored Successfully: ', restoredTicketInfo });
    } 

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Restore Ticket Info.', details: error.message });
    }
};