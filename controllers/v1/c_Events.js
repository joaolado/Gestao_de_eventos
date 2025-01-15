
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Return all Events
exports.getAll = async (req, res) => 
{   
    // Valid Statuses
    const validStatuses = ['Active', 'Scheduled', 'Completed', 'Cancelled'];

    const 
    {
        name,         // Filter by Event Name (partial match)
        city,         // Filter by City
        country,      // Filter by Country
        categoryName, // Filter by Category Name
        status,       // Filter by Event Status
        startDate,    // Start of Date range filter
        endDate,      //   End of Date range filter

        sortBy,       // Sort By field
        sortOrder,    // Sort Order ('asc' or 'desc')

        showDeleted,  // Flag to Control Whether Deleted Events are Included

        page = 1,     // Pagination: Default to 1 if Not Provided
        pageSize = 8  // Pagination: Default to 8 if Not Provided
              
    } = req.query;

    try 
    {   
        // Filters
        const filters = { deleted: null }; // Exclude Deleted Events

        if (name) { filters.name = { contains: name, mode: 'insensitive' }; }          // Case-insensitive Partial Match

        if (city) { filters.city = { contains: city, mode: 'insensitive' }; }          // Case-insensitive Partial Match

        if (country) { filters.country = { contains: country, mode: 'insensitive' }; } // Case-insensitive Partial Match

        // Greater than or equal to startDate
        if (startDate) { filters.startDate = {...(startDate && { gte: new Date(startDate) }), }; }

        // Less than or equal to endDate
        if (endDate) { filters.endDate = {...(endDate && { lte: new Date(endDate) }) }; }

        // Status Filter and validate Status
        if (status) 
        {
            if (!validStatuses.includes(status)) 
            {
                return res.status(404).json({ error: `Invalid Status. Allowed Status are: ${validStatuses.join(', ')}` });
            }

            filters.status = { equals: status };
        }

        // Deleted Filter
        if (showDeleted === 'true') 
        {
            filters.deleted = { not: null }; // Include Events that Have a non-null 'deleted' Field
        } 
        
        else 
        {
            filters.deleted = null;          // Exclude soft-deleted Events
        }

        // Include EventsCategory Filter if categoryName is Provided
        let categoryFilter = {};
        
        if (categoryName && categoryName.length > 0) 
        {
            // Split it Into an Array of Category Names
            const categoriesArray = decodeURIComponent(categoryName).split(',');

            // Find Matching Category 
            const categories = await prisma.eventsCategory.findMany({
                
                where: 
                { 
                    name: { in: categoriesArray }
                },

            });
            
            // If Matching Categories are Found, Add Their IDs to the Category Filter
            if (categories.length > 0) 
            {
                categoryFilter.categoryId = { in: categories.map(c => c.id) };
            }
        }
        
        // Sort by
        const orderBy = {};

        if (sortBy) 
        {   
            // Valid Fields
            const validSortFields = 
            ['name', 'city', 'country', 'categoryName', 'status', 'startDate', 'endDate']; 

            if (validSortFields.includes(sortBy)) 
            {
                orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc'; // Default to 'asc' if sortOrder is Invalid
            } 

            else 
            {
                return res.status(400).json({ error: `Invalid Sort Field. Valid Fields are: ${validSortFields.join(', ')}` });
            }
        }

        // Read all from DB or Filters
        const response = await prisma.events.findMany({

            where: 
            {   
                ...filters,
                ...categoryFilter,
                deleted: filters.deleted,
            },

            select: 
            {
                id: true,
                name: true,
                description: true,
                cover: true,
                startDate: true,
                endDate: true,
                capacity: true,
                status: true,
                category: { select: { name: true, }, },
                addressLine1: true,
                addressLine2: true,
                postalCode: true,
                city: true,
                region: true,
                country: true,

                // Include ticketsInfo
                tickets: { 
                    select: {
                        price: true,
                        quantity: true,
                        status: true,
                        type: true,
                    },
                },
            },
            
            orderBy: orderBy,            // Dynamic Sorting if orderBy has any Value
            skip: (page - 1) * pageSize, // Skip Records Based on Page Number
            take: parseInt(pageSize),    // Limit the Number of Records per Page
        });

        // Total Count of Events to Calculate Total Pages
        const totalCount = await prisma.events.count({

            where: { ...filters, ...categoryFilter }
        });

        // Transform the Response to Replace Category with Category Name
        const formattedResponse = response.map(event => ({
            ...event,
            category: event.category?.name || null,
        }));

        // Return All Events
        res.status(200).json({

            data: formattedResponse,
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            totalPages: Math.ceil(totalCount / pageSize), 
            totalCount: totalCount,                      

        });
    }
    
    catch (error) 
    {
        res.status(500).json({ error: 'Failed to Retrieve Events.', details: error.message });
    }
};

// Return Events by ID
exports.getById = async (req, res) => 
{
    // Get Events ID Requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try
    {
        // Finds Events by ID
        const response = await prisma.events.findUnique({

            where: 
            { 
                id: id,
                // deleted: null, // Only if Events is Not-Deleted
            },

            select: 
            {
                id: true,
                name: true,
                description: true,
                cover: true,
                startDate: true,
                endDate: true,
                capacity: true,
                status: true,
                category: { select: { name: true, }, },
                addressLine1: true,
                addressLine2: true,
                postalCode: true,
                city: true,
                region: true,
                country: true,

                // Include ticketsInfo
                tickets: { 
                    select: {
                        price: true,
                        quantity: true,
                        status: true,
                        type: true,
                    },
                },
            }
        });

        if (!response) 
        {
            return res.status(404).json({ error: 'Event Not Found.' });
        }
        
        // Transform the Response to Replace Category with Category Name
        const formattedResponse = {
            ...response,
            category: response.category?.name || null,
        };
        
        // Return Event
        res.status(200).json(formattedResponse);
    }

    catch (error) 
    {
        res.status(404).json({ error: 'Events Not Found.', details: error.message });
    }
};

// Create/Edit Events by ID
exports.editEvent = async (req, res) => 
{
    const 
    {   
        id,
        name,
        description,
        startDate,
        endDate,
        capacity,
        categoryName,
        addressLine1, 
        addressLine2, 
        postalCode, 
        city, 
        region, 
        country,
        status,

        price,
        quantity,

    } = req.body;

    try 
    {   
        // Check if a File is Uploaded
        const cover = req.file ? req.file.filename : undefined;

        let categoryId;

        if (categoryName) 
        {
            // Check if the Category Exists
            const category = await prisma.eventsCategory.findUnique({

                where: { name: categoryName },
            });

            // If categoryName is Provided and Exists, use its ID
            if (category) 
            {
                categoryId = category.id;
            } 
            
            else 
            {
                console.warn(`Category "${categoryName}" Not Found. Proceeding Without Category.`);
            }
        }
        
        // If ID Exists, it's an Update
        if (id) 
        {
            // Update Event Logic (Existing event with ID)
            const parsedId = parseInt(id, 10);

            if (isNaN(parsedId)) 
            {
                return res.status(400).json({ error: 'Invalid Value for ID. Expected an integer.' });
            }

            // Finds Events to Update their Data
            const updatedEvents = await prisma.events.update({

                where: 
                { 
                    id: parsedId, 
                },

                data: 
                {
                    name: name,
                    description: description,
                    cover: cover,
                    startDate: startDate ? new Date(startDate) : undefined,
                    endDate: endDate ? new Date(endDate) : undefined,
                    capacity: capacity,
                    categoryId: categoryId || undefined,
                    addressLine1: addressLine1,
                    addressLine2: addressLine2,
                    postalCode: postalCode,
                    city: city,
                    region: region,
                    country: country,
                    status: status,
                },

                include: 
                { 
                    tickets: true 
                },
            });

            return res.status(200).json({ success: true, message: 'Event Updated.', updatedEvents });
        }
        
        // Create a New Event if no Event is Found
        const createdEvent = await prisma.events.create({

            data: 
            {
                name: name,
                description: description,
                cover: cover,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                capacity: capacity,
                categoryId: categoryId || undefined,
                addressLine1: addressLine1,
                addressLine2: addressLine2,
                postalCode: postalCode,
                city: city,
                region: region,
                country: country,
                status: status || 'Scheduled', // Default Value

                tickets: {
                    create: 
                    [
                        {
                            price: price,
                            quantity: quantity,
                        }
                    ]
                }
            },

            include: { tickets: true },
        });

        return res.status(201).json({ success: true, message: 'Event Created Successfully.', createdEvent });
    }

    catch (error) 
    {   
        console.error("Error:", error);
        res.status(400).json({ success: false, error: 'Failed to Update Events.', details: error.message });
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
                status: status,
            },
        });

        res.status(200).json({ message: 'Event Status Updated Successfully. ', updatedEvent });
    } 

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Update Event Status.', details: error.message });
    }
};

// Delete Events by ID
exports.delete = async (req, res) => 
{
    // Get Events ID Requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try
    {   
        // Delete Events ( Soft Delete by Setting the `deleted` field )
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

        res.status(200).json({ message: 'Event Deleted successfully. ', deletedEvents });
    }

    catch (error)
    {
        res.status(400).json({ error: 'Failed to Delete Event.', details: error.message });
    }
};

// Restore Events by ID
exports.restore = async (req, res) => 
{
     // Get Events ID Requested
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
                deleted: null,
            }, 
        });

        res.status(200).json({ message: 'Event Restored Successfully. ', restoredEvent });
    } 

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Restore Event.', details: error.message });
    }
};

// Get Users Linked to an Event by Event ID (NOT USING)
exports.getUsersByEvent = async (req, res) => 
{
    const { eventId } = req.params; // Extract Event ID from Request Parameters

    try 
    {
        // Fetch Users Linked to the Given Event ID
        const users = await prisma.usersEvents.findMany({

            where: 
            { 
                eventId: parseInt(eventId)
            },
            
            include: 
            {
                user: 
                {
                    select: 
                    {
                        id: true,
                        userName: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        // Format Response to Simplify
        const formattedUsers = users.map(userEvent => userEvent.user);

        res.status(200).json({ message: 'Users Linked to Event Retrieved Successfully.', users: formattedUsers });
    } 

    catch (error) 
    {
        res.status(500).json({ error: 'Failed to Retrieve Users Linked to Event.', details: error.message });
    }
};