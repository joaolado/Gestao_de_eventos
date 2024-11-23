
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Return all PaymentDetails
exports.getAll = async (req, res) => 
{
    try 
    {
        // Read all from DB
        const response = await prisma.paymentDetails.findMany({

            include: 
            {
                order: true,         // Include related OrderDetails
                usersPayments: true, // Include related UsersPayments
            } 
        });

        // Return All PaymentDetails
        res.status(200).json(response);
    }
    
    catch (error) 
    {
        res.status(500).json({ error: 'Failed to Retrieve PaymentDetails.', details: error.message });
    }
};

// Return PaymentDetails by ID
exports.getById = async (req, res) => 
{
    // Get PaymentDetails ID requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try 
    {
        // Finds PaymentDetails by ID
        const response = await prisma.paymentDetails.findUnique({

            where: 
            { 
                id: id,
            },

            include: 
            {
                order: true,         // Include related OrderDetails
                usersPayments: true, // Include related UsersPayments
            } 
        });

        // Return PaymentDetails
        res.status(200).json(response);
    }

    catch (error) 
    {
        res.status(404).json({ error: 'PaymentDetails Not Found.', details: error.message });
    }
};

// Creates PaymentDetails
exports.create = async (req, res) => 
{
    // Get requested PaymentDetails properties
    const 
    { 
        orderId, 
        usersPaymentsId, 
        paymentAmount, 
        paymentDate, 

    } = req.body;

    try 
    {
        // Creates new PaymentDetails
        const newPaymentDetails = await prisma.paymentDetails.create({

            data: 
            {
                orderId: orderId,                 // Nullable Field
                usersPaymentsId: usersPaymentsId, // Nullable Field
                paymentAmount: paymentAmount,
                paymentDate: new Date(paymentDate),
            },
        });

        // Return PaymentDetails created
        res.status(201).json(newPaymentDetails);
    }

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Create PaymentDetails.', details: error.message });
    }
};

// Updates PaymentDetails by ID
exports.update = async (req, res) => 
{
    const 
    { 
        id, 
        orderId, 
        usersPaymentsId, 
        paymentAmount, 
        paymentDate, 
    
    } = req.body;

    try 
    {   
        // Finds PaymentDetails to Update their Data
        const updatedPaymentDetails = await prisma.paymentDetails.update({

            where: 
            { 
                id: id, 
            },

            data: 
            {
                orderId: orderId,                                             // Nullable Field
                usersPaymentsId: usersPaymentsId,                             // Nullable Field
                paymentAmount: paymentAmount,
                paymentDate: paymentDate ? new Date(paymentDate) : undefined, // Only Update if Provided
            },
        });

        // Return PaymentDetails Updated
        res.status(200).json(updatedPaymentDetails);
    }

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Update PaymentDetails.', details: error.message });
    }
};

// Update PaymentDetails Status by ID
// Valid Status
const validStatuses = ['Paid', 'Failed', 'Refunded'];

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
        const updatedPaymentDetails = await prisma.paymentDetails.update({

            where: 
            {
                id: id,
            },

            data: 
            {
                status: status, // Update the Status Field
            },
        });

        res.status(200).json({ message: 'Payment Details Status Updated Successfully: ', updatedPaymentDetails });
    } 

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Update Payment Details Status.', details: error.message });
    }
};

// Delete PaymentDetails by ID
exports.delete = async (req, res) => 
{
    // Get PaymentDetails ID requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try
    {   
        // Delete PaymentDetails
        await prisma.paymentDetails.delete({
            
            where: 
            { 
                id: id,
            },
        });

        // Returns PaymentDetails Deleted
        res.status(200).json({ message: 'PaymentDetails Deleted Successfully.' });
    }

    catch (error)
    {
        res.status(400).json({ error: 'Failed to Delete PaymentDetails.', details: error.message });
    }
};