
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Return all EventsCategory
exports.getAll = async (req, res) => 
{
    try 
    {
        // Read all from DB
        const response = await prisma.eventsCategory.findMany({

            orderBy: 
            {
                name: 'asc',
            },

        });

        res.status(200).json(response);
    }
    
    catch (error) 
    {
        res.status(500).json({ error: 'Failed to Retrieve Events Category.', details: error.message });
    }
};

// Return EventsCategory by ID
exports.getById = async (req, res) => 
{
    // Get EventsCategory ID Requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try 
    {
        // Finds EventsCategory by ID
        const response = await prisma.eventsCategory.findUnique({

            where: 
            { 
                id: id,
            },
        });

        res.status(200).json(response);
    }

    catch (error) 
    {
        res.status(404).json({ error: 'Events Category Not Found.', details: error.message });
    }
};

// Creates EventsCategory
exports.create = async (req, res) => 
{
    const 
    { 
        name, 
        description,

    } = req.body;
  
    try 
    {
        // Check if the Category Already Exists
        let category = await prisma.eventsCategory.findUnique({

            where: 
            { 
                name: name,
            },
        });
  
        // If Category doesn't Exist, Create a New One
        if (!category) 
        {
            category = await prisma.eventsCategory.create({
                
                data: 
                {
                    name: name,
                    description: description,
                },
            });
    
            return res.status(201).json({
                success: true,
                message: 'Event Category Created.',
                categoryId: category.id,
                categoryName: category.name,
            });
        }
  
        res.status(400).json({
            success: false,
            message: 'Event Category Already Exists.',
        });
    } 
    
    catch (error) 
    {
        res.status(500).json({
            success: false,
            error: 'Failed to Create Events Category.',
            details: error.message,
        });
    }
};
  

// Updates EventsCategory by ID
exports.update = async (req, res) => 
{
    const 
    { 
        name,     

    } = req.body;

    try 
    {   
        // Get EventsCategory ID Requested
        const id = parseInt(req.params.id); // Ensure ID is an integer

        // Finds EventsCategory to Update their Data
        const updatedEventsCategory = await prisma.eventsCategory.update({

            where: 
            { 
                id: id, 
            },

            data: 
            {
                name: name,
            },
        });

        res.status(200).json({ success: true, message: 'Events Category Updated Successfully.', updatedEventsCategory });
    }

    catch (error) 
    {
        res.status(400).json({ success: false, error: 'Failed to Update Events Category.', details: error.message });
    }
};

// Delete EventsCategory by ID
exports.delete = async (req, res) => 
{
    // Get EventsCategory ID Requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try
    {   
        // Delete EventsCategory
        await prisma.eventsCategory.delete({
            
            where: 
            { 
                id: id,
            },
        });

        res.status(200).json({ success: true, message: 'Events Category Deleted Successfully.' });
    }

    catch (error)
    {
        res.status(400).json({ success: false, error: 'Failed to Delete Events Category.', details: error.message });
    }
};