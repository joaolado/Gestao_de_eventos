Postman

---------------------------------------------------CRIAR---------------------------------------------------

        Colocamos em POST
        http://localhost:4000/auth/register                 
        dentro disto temos de fazer na seguinte forma

        {
    "email": "jane.doe@example.com",
    "userPassword": "securepassword"
        }

---------------------------------------------------LOGIN---------------------------------------------------

         Colocamos em POST
        http://localhost:4000/auth/login                 
        dentro disto temos de fazer na seguinte forma

        {
            "email": "jane.doe@example.com",
            "userPassword": "securepassword"
        }   

        Ao dar login irá dar um token que tem de ser guardado e colocado
        em Authorization no "Auth Type" dentro da janela do Token
        **ATENÇÃO QUE ESTE TOKEN SÓ É LEGIVEL DURANTE 1 HORA**

---------------------------------------------------VER TODOS OS UTILIZADORES-------------------------------------

        Colocamos em GET
        http://localhost:4000/api/v1/users/
        Ao clicar em SEND vamos ter todas as infromações dos utilizadores cadastrados

---------------------------------------------------UPDATE USER---------------------------------------------------


---------------------------------------------------CRIAÇÃO DE CATEGORIA DE EVENTOS-------------------------------

        Colocamoss em POST
        http://localhost:4000/api/v1/eventsCategory/create
        dentro disto temo de fazer da seguinte forma

        {
            "name": "colocar o que quiser aqui",
            "description": "colocar o que quiser aqui"
        }

---------------------------------------------------CRIAÇÃO DE EVENTOS--------------------------------------------

        Colocamos em POST
        http://localhost:4000/api/v1/events/create
        Para isto funcionar temos de ter categoria feita!!
        Dentro disto temos de fazer da seguinte forma

        {
            "name": "colocar o que quiser aqui",
            "description": "colocar o que quiser aqui",
            "cover": "colocar o que quiser aqui",
            "startDate": "2024-12-31T23:30:00+00:00",
            "endDate": "2025-01-01T04:00:00+00:00",
            "capacity": 10000,
            "categoryName": "Música",                                           --> ter atenção em ter o mesmo nome que a categoria criada em cima!!
            "addressLine1": "colocar o que quiser aqui",
            "addressLine2": "colocar o que quiser aqui",
            "postalCode": "colocar o que quiser aqui",
            "city": "colocar o que quiser aqui",
            "region": "colocar o que quiser aqui",
            "country": "colocar o que quiser aqui"
        }