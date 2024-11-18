<?php

// Headers obrigatorios
// Cross-origin
header("Access-Control-Allow-Origin: *");

// Formato json dos dados
header("Content-Type: application/json; charset=UTF-8");

// Permite a passagem de valores atraves de um formulario
header("Access-Control-Allow-Methods: POST");

// Aumentar o tempo de timeout
header("Access-Control-Max-Age: 3600");

// Permite o acesso atraves de outros aplicativos
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers: Authorization, x-Requested-With");

// Incluir os ficheiros do modelo e da ligação à BD
include_once '../config/database.php';
include_once '../objects/events.php';

// Instanciar a base de dados
$database= new Database();
$db=$database->getConnection();

// Inicializar o objeto das categorias
$events= new Events($db);

// Receber valores de um formulario
$data=json_decode(file_get_contents("php://input"));
$events->name=$data->name;
$events->desc=$data->desc;
$events->cover=$data->cover;
$events->date=$data->date;                      // =date('Y-m-d H:i:s') ???
$events->location=$data->location;
$events->capacity=$data->capacity;
$events->category_name=$data->category_name;    // Ver Depois
$events->created=date('Y-m-d H:i:s');

// Messagem que aparece ao Utilizador / Admin
if($events->create())
{
    echo json_encode(array("message"=>"Events was Created."));
}
else
{
    echo json_encode(array("message"=>"Unable to Create Events."));
};

?>