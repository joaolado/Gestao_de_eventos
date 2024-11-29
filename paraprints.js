// Verificar se um ficheiro foi enviado
const profilePic = req.file ? req.file.path : null;

// Atualizar o perfil do utilizador
const updatedUsers = await prisma.users.update({
    where: { 
        id: userId // Utilizar o userId do token 
    },
    data: {   
        profilePic: profilePic, // Atualizar a fotografia de perfil
        userName: userName,
        userPassword: hashedPassword || undefined, // Atualizar apenas se a palavra-passe for fornecida
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        address: {
            upsert: { 
                create: {
                    addressLine1: addressLine1,
                    addressLine2: addressLine2,
                    postalCode: postalCode,
                    city: city,
                    region: region,
                    country: country,
                },
                update: {
                    addressLine1: addressLine1,
                    addressLine2: addressLine2,
                    postalCode: postalCode,
                    city: city,
                    region: region,
                    country: country,
                },
            },
        },
    },
    include: { 
        address: true 
    },
});

// Retornar o perfil atualizado
res.status(200).json({ message: 'Perfil atualizado com sucesso!', updatedUsers });
