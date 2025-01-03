
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

                type: { select: { name: true, }, }, // Only select the TicketsType name

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
            type: ticketsInfo.type?.name || null, // Simplify ticketsType to its name
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

                type: { select: { name: true, }, }, // Only select the TicketsType name

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
            type: response.type?.name || null, // Simplify ticketsType to its name
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
exports.create = async (req, res) => {
    const { 
        SKU,
        price,
        quantity, 
        ticketType, // Ticket type name or id
        eventsId,   // Event id
        name,       // Event name (optional, if a new event needs to be created)
        description, // Event description (optional)
        startDate,   // Event start date (optional)
        endDate,     // Event end date (optional)
        capacity,    // Event capacity (optional)
        categoryName, // Event category (optional)
        addressLine1, // Event address line 1 (optional)
        addressLine2, // Event address line 2 (optional)
        postalCode,   // Event postal code (optional)
        city,         // Event city (optional)
        region,       // Event region (optional)
        country,      // Event country (optional)
    } = req.body;

    try {
        // Ensure ticketType is a valid string
        if (!ticketType) {
            return res.status(400).json({ error: 'Ticket type is required' });
        }

        // Check if the ticket type exists, if not create it
        let type = await prisma.ticketsType.findUnique({
            where: { name: ticketType }
        });

        if (!type) {
            // Create a new ticket type if not found
            type = await prisma.ticketsType.create({
                data: { name: ticketType, description: `Ticket type for ${ticketType}` },
            });
        }

        // If eventsId is provided, try to find the existing event
        let event = null;
        if (eventsId) {
            event = await prisma.events.findUnique({
                where: { id: eventsId },
            });
        }

        // If the event doesn't exist, create a new one (optional, based on your use case)
        if (!event && name && description) {
            event = await prisma.events.create({
                data: {
                    name,
                    description,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    capacity: capacity ? parseInt(capacity, 10) : null,
                    category: { connect: { name: categoryName } },  // Ensure category is linked properly
                    addressLine1,
                    addressLine2: addressLine2 || '',
                    postalCode,
                    city,
                    region: region || '',
                    country,
                },
            });
        }

        // If the event is not found and no name or description is provided, return an error
        if (!event) {
            return res.status(400).json({ error: 'Event not found or event details missing for creation.' });
        }

        // Now create TicketsInfo and associate it with the existing or newly created event
        const newTicketsInfo = await prisma.ticketsInfo.create({
            data: {
                SKU,
                price,
                quantity,
                type: { connect: { id: type.id } }, // Ensure connection to ticket type by ID
                event: { connect: { id: event.id } },  // Use the event's id here
            },
            include: { event: true },
        });

        // Return TicketsInfo created
        res.status(201).json(newTicketsInfo);
    } catch (error) {
        console.error('Failed to Create TicketsInfo:', error);
        res.status(400).json({ error: 'Failed to Create TicketsInfo.', details: error.message });
    }
};







// Updates TicketsInfo by ID
exports.update = async (req, res) => 
{
    const 
    { 
        id,
        SKU,
        price,
        quantity, 

        ticketType, // Return ticketsType instead of ticket Type ID

        eventsId,   // Return associated Event info

    } = req.body;

    try 
    {  
        // If ticketType is provided, find the ticketsTypeId
        let typeConnect = null;

        if (ticketType) 
        {
            const type = await prisma.ticketsType.findUnique({
                where: 
                { 
                    name: ticketType 
                }
            });

            if (!type) 
            {
                return res.status(404).json({ error: 'Ticket Type Not Found.' });
            }

            // If ticketType is found, get the ticketsTypeId
            typeConnect = { id: type.id };
        }

        // Finds TicketsInfo to Update their Data
        const updatedTicketsInfo = await prisma.ticketsInfo.update({

            where: 
            { 
                id: id, 
            },

            data: 
            {
                SKU: SKU,
                price: price,
                quantity: quantity,

                type: typeConnect ? { connect: typeConnect } : undefined,

                event: eventsId ? { connect: { id: eventsId } } : undefined,
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