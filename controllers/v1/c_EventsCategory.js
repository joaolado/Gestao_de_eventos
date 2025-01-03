
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Return all EventsCategory
exports.getAll = async (req, res) => 
{
    try 
    {
        // Read all from DB
        const response = await prisma.eventsCategory.findMany();

        // Return All EventsCategory
        res.status(200).json(response);
    }
    
    catch (error) 
    {
        res.status(500).json({ error: 'Failed to Retrieve EventsCategory.', details: error.message });
    }
};

// Return EventsCategory by ID
exports.getById = async (req, res) => 
{
    // Get EventsCategory ID requested
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

        // Return EventsCategory
        res.status(200).json(response);
    }

    catch (error) 
    {
        res.status(404).json({ error: 'EventsCategory Not Found.', details: error.message });
    }
};

// Creates EventsCategory
exports.create = async (req, res) => {
    const { name, description } = req.body;
  
    try {
      // Check if the category already exists
      let category = await prisma.eventsCategory.findUnique({
        where: { name: name },
      });
  
      // If category doesn't exist, create a new one
      if (!category) {
        category = await prisma.eventsCategory.create({
          data: {
            name: name,
            description: description,
          },
        });
  
        return res.status(201).json({
          success: true,
          message: 'Event Category Created',
          categoryId: category.id,
          categoryName: category.name,
        });
      }
  
      // If category exists, return a message
      res.status(400).json({
        success: false,
        message: 'Event Category already exists',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to Create EventsCategory.',
        details: error.message,
      });
    }
  };
  

// Updates EventsCategory by ID
exports.update = async (req, res) => 
{
    const 
    { 
        id, 
        name, 
        description, 
    
    } = req.body;

    try 
    {   
        // Finds EventsCategory to Update their Data
        const updatedEventsCategory = await prisma.eventsCategory.update({

            where: 
            { 
                id: id, 
            },

            data: 
            {
                name: name,
                description: description,
            },
        });

        // Return EventsCategory Updated
        res.status(200).json(updatedEventsCategory);
    }

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Update EventsCategory.', details: error.message });
    }
};

// Delete EventsCategory by ID
exports.delete = async (req, res) => 
{
    // Get EventsCategory ID requested
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

        // Returns EventsCategory Deleted
        res.status(200).json({ message: 'EventsCategory Deleted Successfully.' });
    }

    catch (error)
    {
        res.status(400).json({ error: 'Failed to Delete EventsCategory.', details: error.message });
    }
};