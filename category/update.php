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
include_once '../objects/category.php';

// Instanciar a base de dados
$database= new Database();
$db=$database->getConnection();

// Inicializar o objeto das categorias
$category= new Category($db);

// Receber valores de um formulario
$data=json_decode(file_get_contents("php://input"));
$category->name=$data->name;
$category->description=$data->description;
$category->modified=date('Y-m-d H:i:s');
$category->id=$data->id;

if($category->update())
{
    echo json_encode(array("message"=>"Category was Updated."));
}
else
{
    echo json_encode(array("message"=>"Unable to Update Category."));
};

?>