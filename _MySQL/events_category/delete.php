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
include_once '../objects/events_category.php';

// Instanciar a base de dados
$database= new Database();
$db=$database->getConnection();

// Inicializar o objeto das categorias
$events_category= new Events_category($db);

// Receber valores de um formulario
$data=json_decode(file_get_contents("php://input"));
$events_category->id=$data->id;

if($events_category->delete())
{
    echo json_encode(array("message"=>"Events Category was Deleted."));
}
else
{
    echo json_encode(array("message"=>"Unable to Delete Events Category."));
};

?>