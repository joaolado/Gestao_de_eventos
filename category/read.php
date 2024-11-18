<?php

// Headers obrigatorios
// Cross-origin
header("Access-Control-Allow-Origin: *");

// Formato json dos dados
header("Content-Type: application/json; charset=UTF-8");

// Incluir os ficheiros do modelo e da ligação à BD
include_once '../config/database.php';
include_once '../objects/category.php';

// Instanciar a base de dados
$database= new Database();
$db=$database->getConnection();

// Inicializar o objeto das categorias
$category= new Category($db);
$st=$category->read();

// Numero de registos retornados pela BD
$num=$st->rowCount();

// Se existem registos o $num é maior do que 0
if ($num>0)
{
    // Categorias no array
    $categories_arr=array();
    $categories_arr["records"]=array();

    // Ler os registos na BD e colocar no array de json
    while($row=$st->fetch(PDO::FETCH_ASSOC))
    {
        // Extrair os valores das linhas
        extract($row);
        $category_items=array
        (
            "id"=>$id,
            "name"=>$name,
            "description"=>$description,
            "created"=>$created,
            "modified"=>$modified,
        );

        // Adiciona o registo ao conjunto de elementos
        array_push($categories_arr["records"], $category_items);
    }

    http_response_code(200);
    echo json_encode($categories_arr);
}

// Não existem registos na BD
else
{
    echo json_encode(array("message"=>"No Categories Found."));
}

?>