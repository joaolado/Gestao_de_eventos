
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Return all Events
exports.getAll = async (req, res) => 
{
    try 
    {
        // Read all from DB
        const response = await prisma.events.findMany({

            where: 
            {
                deleted: null, // Only includes Non-Deleted Events
            },

            select: 
            {
                id: true,
                name: true,
                description: true,
                cover: true,
                dDay: true,
                capacity: true,
                category: { select: { name: true, }, }, // Only select the EventsCategory name
                addressLine1: true,
                addressLine2: true,
                postalCode: true,
                city: true,
                region: true,
                country: true,
            }
        });


        // Transform the response to replace category object with category name - Makes it Linear
        const formattedResponse = response.map(event => ({
            ...event,
            category: event.category?.name || null, // Simplify EventsCategory to its name
        }));

        // Return All Events
        res.status(200).json(formattedResponse);
    }
    
    catch (error) 
    {
        res.status(500).json({ error: 'Failed to Retrieve Events.', details: error.message });
    }
};

// Return Events by ID
exports.getById = async (req, res) => 
{
    // Get Events ID requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try 
    {
        // Finds Events by ID
        const response = await prisma.events.findUnique({

            where: 
            { 
                id: id,
                deleted: null, // Only if Events is Not-Deleted 
            },

            select: 
            {
                id: true,
                name: true,
                description: true,
                cover: true,
                dDay: true,
                capacity: true,
                category: { select: { name: true, }, }, // Only select the EventsCategory name
                addressLine1: true,
                addressLine2: true,
                postalCode: true,
                city: true,
                region: true,
                country: true,
            }
        });

        if (!response) 
        {
            return res.status(404).json({ error: 'Event Not Found.' });
        }
        
        // Transform the response to replace category object with category name - Makes it Linear
        const formattedResponse = {
            ...response,
            category: response.category?.name || null, // Simplify EventsCategory to its name
        };
        
        // Return Event
        res.status(200).json(formattedResponse);
    }

    catch (error) 
    {
        res.status(404).json({ error: 'Events Not Found.', details: error.message });
    }
};

// Creates Events
exports.create = async (req, res) => 
{
    // Get requested Events properties
    const 
    { 
        name,
        description,
        cover,
        dDay,
        capacity,
        categoryName, // Return categoryName instead of categoryId 
        addressLine1,
        addressLine2,
        postalCode,
        city,
        region,
        country, 

    } = req.body;

    try 
    {   
        // Find the category ID based on the categoryName
        const category = await prisma.eventsCategory.findUnique({

            where: 
            { 
                name: categoryName 
            }
        });

        if (!category)
        {
            return res.status(404).json({ error: 'Category Not Found.' });
        }

        // Creates new Events
        const newEvents = await prisma.events.create({

            data: 
            {
                name: name,
                description: description,
                cover: cover,
                dDay: new Date(dDay),
                capacity: capacity,
                categoryId: category.id,
                addressLine1: addressLine1,
                addressLine2: addressLine2,
                postalCode: postalCode,
                city: city,
                region: region,
                country: country,
            },
        });

        // Return Events created
        res.status(201).json(newEvents);
    }

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Create Events.', details: error.message });
    }
};

// Updates Events by ID
exports.update = async (req, res) => 
{
    const 
    { 
        id,
        name,
        description,
        cover,
        dDay,
        capacity,
        categoryName, // Return categoryName instead of categoryId 
        addressLine1,
        addressLine2,
        postalCode,
        city,
        region,
        country,

    } = req.body;

    try 
    {   
        // If categoryName is provided, find the categoryId
        let categoryId = undefined;

        if (categoryName) 
        {
            const category = await prisma.eventsCategory.findUnique({
                where: 
                { 
                    name: categoryName 
                }
            });

            if (!category) 
            {
                return res.status(404).json({ error: 'Category Not Found.' });
            }

            // If EventsCategory is found, get the categoryId
            categoryId = category.id;
        }

        // Finds Events to Update their Data
        const updatedEvents = await prisma.events.update({

            where: 
            { 
                id: id, 
            },

            data: 
            {
                name: name,
                description: description,
                cover: cover,
                dDay: dDay ? new Date(dDay) : undefined, // Only Update if Provided
                capacity: capacity,
                categoryId: categoryId !== undefined ? categoryId : undefined,
                addressLine1: addressLine1,
                addressLine2: addressLine2,
                postalCode: postalCode,
                city: city,
                region: region,
                country: country,
            },
        });

        // Return Events Updated
        res.status(200).json(updatedEvents);
    }

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Update Events.', details: error.message });
    }
};

// Update Event Status by ID
// Valid Status
const validStatuses = ['Active', 'Scheduled', 'Completed', 'Cancelled'];

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
        const updatedEvent = await prisma.events.update({

            where: 
            {
                id: id,
            },

            data: 
            {
                status: status, // Update the Status Field
            },
        });

        res.status(200).json({ message: 'Event Status Updated Successfully: ', updatedEvent });
    } 

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Update Event Status.', details: error.message });
    }
};

// Delete Events by ID
exports.delete = async (req, res) => 
{
    // Get Events ID requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try
    {   
        // Delete Events ( Soft delete by setting the `deleted` field )
        const deletedEvents = await prisma.events.update({

            where: 
            { 
                id: id,
            },

            data: 
            { 
                deleted: new Date(),
            },
        });

        // Returns Events Deleted
        res.status(200).json({ message: 'Event Deleted successfully: ', deletedEvents });
    }

    catch (error)
    {
        res.status(400).json({ error: 'Failed to Delete Event.', details: error.message });
    }
};

// Restore Events by ID
exports.restore = async (req, res) => 
{
     // Get Events ID requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try 
    {   
        // Restore Events
        const restoredEvent = await prisma.events.update({

            where: 
            { 
                id: id,
            },

            data: 
            {   
                deleted: null, // Clear the Deleted Field
            }, 
        });

        // Returns Events Restored
        res.status(200).json({ message: 'Event Restored Successfully: ', restoredEvent });
    } 

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Restore Event.', details: error.message });
    }
};