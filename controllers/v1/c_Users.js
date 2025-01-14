
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Return all Users
exports.getAll = async (req, res) => 
{
    try 
    {
        // Read all from DB
        const response = await prisma.users.findMany({

            where: 
            {
                deleted: null,   // Only includes Non-Deleted Users
            },

            select: 
            {
                id: true,
                userName: true,
                userPassword: true,
                firstName: true,
                lastName: true,
                phone: true,
                email: true,

                // Include related UsersAddress
                address: 
                { 
                    select:
                    {   
                        addressLine1: true, 
                        addressLine2: true,
                        postalCode: true,
                        city: true,
                        region: true,
                        country: true,
                    }, 
                },

                wishlist: 
                { 
                    select:
                    { 
                        event: 
                        { 
                            select: 
                            { 
                                id: true,
                                name: true,
                            }       
                        },
                    },          
                },

                sender: 
                { 
                    select:
                    { event: 
                        { 
                            select: 
                            { 
                                id: true,
                                name: true 
                            } 
                        }, 
                    }, 
                },

                receiver: 
                { 
                    select:
                    { 
                        event: 
                        { select: 
                            { 
                                id: true,
                                name: true 
                            } 
                        }, 
                    }, 
                },
            } 
        });


        // Return All Users that are Not-Deleted
        res.status(200).json(response);
    }
    
    catch (error) 
    {
        res.status(500).json({ error: 'Failed to Retrieve Users.', details: error.message });
    }
};

// Return Users by ID
exports.getById = async (req, res) => 
{
    // Get Users ID requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try 
    {
        // Finds Users by ID
        const response = await prisma.users.findUnique({

            where: 
            { 
                id: id,
                deleted: null, // Only if Users is Not-Deleted 
            },

            select: 
            {
                id: true,
                userName: true,
                userPassword: true,
                firstName: true,
                lastName: true,
                phone: true,
                email: true,

                // Include related UsersAddress
                address: 
                { 
                    select:
                    {   
                        addressLine1: true, 
                        addressLine2: true,
                        postalCode: true,
                        city: true,
                        region: true,
                        country: true,
                    }, 
                },
                
                wishlist: 
                { 
                    select:
                    { 
                        event: 
                        { 
                            select: 
                            { 
                                id: true,
                                name: true,
                            }       
                        },
                    },          
                },

                sender: 
                { 
                    select:
                    { event: 
                        { 
                            select: 
                            { 
                                id: true,
                                name: true 
                            } 
                        }, 
                    }, 
                },

                receiver: 
                { 
                    select:
                    { 
                        event: 
                        { select: 
                            { 
                                id: true,
                                name: true 
                            } 
                        }, 
                    }, 
                },
            } 
        });

        // Return Users
        res.status(200).json(response);
    }

    catch (error) 
    {
        res.status(404).json({ error: 'Users Not Found.', details: error.message });
    }
};

// Creates Users
exports.create = async (req, res) => 
{
    // Get requested Users properties
    const 
    { 
        userName,
        userPassword,
        firstName,
        lastName,
        phone,
        email,
        
        addressLine1, 
        addressLine2, 
        postalCode, 
        city, 
        region, 
        country,

    } = req.body;

    try 
    {
        // Creates new Users
        const newUsers = await prisma.users.create({

            data: 
            {
                userName: userName,
                userPassword: userPassword,
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                email: email,
                
                address: 
                {
                    create: 
                    {
                        addressLine1: addressLine1,
                        addressLine2: addressLine2,
                        postalCode: postalCode,
                        city: city,
                        region: region,
                        country: country,
                    },
                },
            },

            include: 
            {
                address: true,
            },
        });

        // Return Users created
        res.status(201).json(newUsers);
    }

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Create Users.', details: error.message });
    }
};

// Updates Users by ID
exports.update = async (req, res) => 
{
    const 
    { 
        id,
        userName,
        userPassword,
        firstName,
        lastName,
        phone,
        email,
        
        addressLine1, 
        addressLine2, 
        postalCode, 
        city, 
        region, 
        country,

    } = req.body;

    try 
    {   
        // Finds Users to Update their Data
        const updatedUsers = await prisma.users.update({

            where: 
            { 
                id: id, 
            },

            data: 
            {
                userName: userName,
                userPassword: userPassword,
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                email: email,

                address: 
                {
                    create: 
                    {
                        addressLine1: addressLine1,
                        addressLine2: addressLine2,
                        postalCode: postalCode,
                        city: city,
                        region: region,
                        country: country,
                    },
                },
            },

            include: 
            {
                address: true,
            },
        });

        // Return Users Updated
        res.status(200).json(updatedUsers);
    }

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Update Users.', details: error.message });
    }
};

// Update User Type by ID
// Valid Types
const validTypes = ['UserClient', 'UserAdmin', 'UserSuperAdmin'];

exports.updateType = async (req, res) => 
{
    const 
    { 
        id, 
        usersType,

    } = req.body;

    // Validate Type
    if (!validTypes.includes(usersType)) 
    {
        return res.status(400).json({ error: `Invalid Type. Allowed Types are: ${validTypes.join(', ')}` });
    }

    try 
    {
        const updatedUsers = await prisma.users.update({

            where: 
            {
                id: id,
            },

            data: 
            {
                usersType: usersType, // Update the User Type Field
            },
        });

        res.status(200).json({ message: 'User Type Updated Successfully: ', updatedUsers });
    } 

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Update User Type.', details: error.message });
    }
};

// Delete Users by ID
exports.delete = async (req, res) => 
{
    // Get Users ID requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try
    {   
        // Delete Users ( Soft delete by setting the `deleted` field )
        const deletedUsers = await prisma.users.update({

            where: 
            { 
                id: id,
            },

            data: 
            { 
                deleted: new Date(),
            },
        });

        // Returns Users Deleted
        res.status(200).json({ message: 'User Deleted successfully: ', deletedUsers });
    }

    catch (error)
    {
        res.status(400).json({ error: 'Failed to Delete User.', details: error.message });
    }
};

// Restore Users by ID
exports.restore = async (req, res) => 
{
     // Get Users ID requested
    const id = parseInt(req.params.id); // Ensure ID is an integer

    try 
    {   
        // Restore Users
        const restoredUser = await prisma.users.update({

            where: 
            { 
                id: id,
            },

            data: 
            {   
                deleted: null, // Clear the Deleted Field
            }, 
        });

        // Returns Users Restored
        res.status(200).json({ message: 'User Restored Successfully: ', restoredUser });
    } 

    catch (error) 
    {
        res.status(400).json({ error: 'Failed to Restore User.', details: error.message });
    }
};