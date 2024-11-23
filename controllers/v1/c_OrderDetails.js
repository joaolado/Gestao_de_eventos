
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Return all OrderDetails
exports.getAll = async (req, res) => 
{
    try 
    {
        // Read all from DB
        const response = await prisma.orderDetails.findMany({

            include: 
            {      
                user: true,           // Include related Users
                orderedTickets: true, // Include related OrderedTickets
            },
        });

        // Return All OrderDetails
        res.status(200).json(response);
    }
    
    catch (error) 
    {
        res.status(500).json({ error: 'Failed to Retrieve OrderDetails.', details: error.message });
    }
};

// Return OrderDetails by ID
exports.getById = async (req, res) => 
{
    // Get OrderDetails ID requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try 
    {
        // Finds OrderDetails by ID
        const response = await prisma.orderDetails.findUnique({

            where: 
            { 
                id: id,
            },

            include: 
            {      
                user: true,           // Include related Users
                orderedTickets: true, // Include related OrderedTickets
            },
        });

        // Return OrderDetails
        res.status(200).json(response);
    }

    catch (error) 
    {
        res.status(404).json({ error: 'OrderDetails Not Found.', details: error.message });
    }
};

// Creates OrderDetails
exports.create = async (req, res) => 
{
    // Get requested OrderDetails properties
    const 
    { 
        usersId, 
        orderedTicketsId, 
        orderTotal, 
        orderDate, 

    } = req.body;

    try 
    {
        // Creates new OrderDetails
        const newOrderDetails = await prisma.orderDetails.create({

            data: 
            {
                usersId: usersId,                   // Nullable Field
                orderedTicketsId: orderedTicketsId, // Nullable Field
                orderTotal: orderTotal,
                orderDate: new Date(orderDate),
            },
        });

        // Return OrderDetails created
        res.status(201).json(newOrderDetails);
    }

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Create OrderDetails.', details: error.message });
    }
};

// Updates OrderDetails by ID
exports.update = async (req, res) => 
{
    const 
    { 
        id, 
        usersId, 
        orderedTicketsId, 
        orderTotal, 
        orderDate, 
    
    } = req.body;

    try 
    {   
        // Finds OrderDetails to Update their Data
        const updatedOrderDetails = await prisma.orderDetails.update({

            where: 
            { 
                id: id, 
            },

            data: 
            {
                usersId: usersId,                                       // Nullable Field
                orderedTicketsId: orderedTicketsId,                     // Nullable Field
                orderTotal: orderTotal,
                orderDate: orderDate ? new Date(orderDate) : undefined, // Only Update if Provided
            },
        });

        // Return OrderDetails Updated
        res.status(200).json(updatedOrderDetails);
    }

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Update OrderDetails.', details: error.message });
    }
};

// Update Cart Status by ID
// Valid Status
const validCartStatuses = ['Active', 'Scheduled', 'Cancelled'];

exports.updateCart = async (req, res) => 
{
    const 
    { 
        id, 
        statusCart,

    } = req.body;

    // Validate Status
    if (!validCartStatuses.includes(statusCart)) 
    {
        return res.status(400).json({ error: `Invalid Cart Status. Allowed Status are: ${validCartStatuses.join(', ')}` });
    }

    try 
    {
        const updatedCart = await prisma.orderDetails.update({

            where: 
            {
                id: id,
            },

            data: 
            {
                statusCart: statusCart, // Update the statusCart Field
            },
        });

        res.status(200).json({ message: 'Cart Status Updated Successfully: ', updatedCart });
    } 

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Update Cart Status.', details: error.message });
    }
};

// Update OrderDetails Status by ID
// Valid Status
const validStatuses = ['Pending', 'Completed', 'Cancelled'];

exports.updateStatus = async (req, res) => 
{
    const 
    { 
        id, 
        statusOrder,

    } = req.body;

    // Validate Status
    if (!validStatuses.includes(statusOrder)) 
    {
        return res.status(400).json({ error: `Invalid Order Status. Allowed Status are: ${validStatuses.join(', ')}` });
    }

    try 
    {
        const updatedOrderDetails = await prisma.orderDetails.update({

            where: 
            {
                id: id,
            },

            data: 
            {
                statusOrder: statusOrder, // Update the statusOrder Field
            },
        });

        res.status(200).json({ message: 'Order Details Status Updated Successfully: ', updatedOrderDetails });
    } 

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Update Order Details Status.', details: error.message });
    }
};

// Delete OrderDetails by ID
exports.delete = async (req, res) => 
{
    // Get OrderDetails ID requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try
    {   
        // Delete OrderDetails
        await prisma.orderDetails.delete({
            
            where: 
            { 
                id: id,
            },
        });

        // Returns OrderDetails Deleted
        res.status(200).json({ message: 'OrderDetails Deleted Successfully.' });
    }

    catch (error)
    {
        res.status(400).json({ error: 'Failed to Delete OrderDetails.', details: error.message });
    }
};