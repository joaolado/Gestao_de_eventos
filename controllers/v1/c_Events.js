
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
              
    } = req.query;

    try 
    {   
        // Filters
        const filters = { deleted: null }; // Exclude Deleted Events

        if (name) { filters.name = { contains: name, mode: 'insensitive' }; }        // Case-insensitive Partial Match

        if (city) { filters.city = { equals: city, mode: 'insensitive' }; }          // Exact Match

        if (country) { filters.country = { equals: country, mode: 'insensitive' }; } // Exact Match

        // Greater than or equal to startDate
        if (startDate) { filters.startDate = {...(startDate && { gte: new Date(startDate) }), }; }

        // Less than or equal to endDate
        if (endDate) { filters.endDate = {...(endDate && { lte: new Date(endDate) }) }; }

        // Status Filter and validate status
        if (status) 
        {
            if (!validStatuses.includes(status)) 
            {
                return res.status(404).json({ error: `Invalid Status. Allowed Status are: ${validStatuses.join(', ')}` });
            }

            filters.status = { equals: status }; // Filter by valid status
        }

        // Include EventsCategory Filter if categoryName is provided
        let categoryFilter = {};
        if (categoryName) {
            const category = await prisma.eventsCategory.findUnique({
                where: { name: categoryName }
            });
            if (!category) {
                return res.status(404).json({ error: 'Category Not Found.' });
            }
            categoryFilter.categoryId = category.id;
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
                orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc'; // Default to 'asc' if sortOrder is invalid
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
                deleted: null, // Only includes Non-Deleted Events
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
                category: { select: { name: true, }, }, // Only select the EventsCategory name
                addressLine1: true,
                addressLine2: true,
                postalCode: true,
                city: true,
                region: true,
                country: true,

                // Include ticketsInfo with its Related fields
                tickets: { 
                    select: {
                        price: true,
                        quantity: true,
                        status: true,
                        type: { select: { name: true } }, // Include the related ticketsType name
                    },
                },
            },

            // Dynamic Sorting if orderBy has any Value
            orderBy: orderBy,
        });


        // Transform the response to replace category object with category name - Makes it Linear
        const formattedResponse = response.map(event => ({
            ...event,
            category: event.category?.name || null, // Simplify EventsCategory to its name

            tickets: event.tickets.map(ticket => ({
                ...ticket,
                type: ticket.type?.name || null,    // Simplify Tickets Type to its name
            })),
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
                startDate: true,
                endDate: true,
                capacity: true,
                status: true,
                category: { select: { name: true, }, }, // Only select the EventsCategory name
                addressLine1: true,
                addressLine2: true,
                postalCode: true,
                city: true,
                region: true,
                country: true,

                // Include ticketsInfo with its Related fields
                tickets: { 
                    select: {
                        price: true,
                        quantity: true,
                        status: true,
                        type: { select: { name: true } }, // Include the Related ticketsType name
                    },
                },
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

            tickets: response.tickets?.map(ticket => ({
                ...ticket,
                type: ticket.type?.name || null,       // Simplify ticketsType to its name
            })) 
            || [], // Empty Array if no Tickets are found
        };
        
        // Return Event
        res.status(200).json(formattedResponse);
    }

    catch (error) 
    {
        res.status(404).json({ error: 'Events Not Found.', details: error.message });
    }
};

exports.create = async (req, res) => {
    const {
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
    } = req.body;

    try {
      const cover = req.file ? req.file.path : null;

      // Check if category exists
      const category = await prisma.eventsCategory.findUnique({
        where: { name: categoryName },
      });

      if (!category) {
        return res.status(404).json({ error: 'Category Not Found.' });
      }

      // Create Event
      const newEvent = await prisma.events.create({
        data: {
          name,
          description,
          cover,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          capacity: capacity ? parseInt(capacity, 10) : null,
          categoryId: category.id,
          addressLine1,
          addressLine2: addressLine2 || '',
          postalCode,
          city,
          region: region || '',
          country,
        },
      });

      // Handle Tickets
      if (req.body.tickets) {
        try {
          const tickets = JSON.parse(req.body.tickets);

          if (!Array.isArray(tickets)) {
            throw new Error('Tickets must be an array.');
          }

          // Create Tickets
          for (const ticket of tickets) {
            await prisma.ticketsInfo.create({
              data: {
                eventsId: newEvent.id,
                typeId: ticket.typeId,  // Use typeId instead of type
                price: parseFloat(ticket.price),
                quantity: parseInt(ticket.quantity, 10),
                status: ticket.status || 'Available',
              },
            });
          }
        } catch (error) {
          console.error('Failed to parse or create tickets:', error);
          return res.status(400).json({ success: false, message: 'Invalid tickets format.' });
        }
      }

      res.status(201).json({
        success: true,
        event: newEvent,
      });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Failed to create event' });
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
        categoryName, // Return categoryName instead of categoryId
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

        // Initialize categoryId as undefined
        let categoryId;

        if (categoryName) {
            // Check if the category exists
            const category = await prisma.eventsCategory.findUnique({
                where: { name: categoryName },
            });

            if (category) {
                // If categoryName is provided and exists, use its ID
                categoryId = category.id;
            } else {
                console.warn(`Category "${categoryName}" not found. Proceeding without category.`);
            }
        }
        
        // If id exists, it's an update
        if (id) {
            // Update Event Logic (existing event with id)
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId)) {
                return res.status(400).json({ error: 'Invalid value for ID. Expected an integer.' });
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
                    startDate: startDate ? new Date(startDate) : undefined, // Only Update if Provided
                    endDate: endDate ? new Date(endDate) : undefined,       // Only Update if Provided
                    capacity: capacity,
                    categoryId: categoryId || null, // Allow null category
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

            return res.status(200).json({ success: true, message: 'Event Updated', updatedEvents });
        }
        
        // Create a new event if no event is found
        const createdEvent = await prisma.events.create({
            data: {
                name: name,
                description: description,
                cover: cover,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                capacity: capacity,
                categoryId: categoryId || null, // Allow null category
                addressLine1: addressLine1,
                addressLine2: addressLine2,
                postalCode: postalCode,
                city: city,
                region: region,
                country: country,
                status: status || 'Scheduled',
                tickets: {
                    create: [
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
        console.error("Error:", error);  // Log error for debugging
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

// Get Users Linked to an Event by Event ID
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
