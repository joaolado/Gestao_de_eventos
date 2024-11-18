<?php

// Headers obrigatorios
// Cross-origin
header("Access-Control-Allow-Origin: *");

// Formato json dos dados
header("Content-Type: application/json; charset=UTF-8");

// Incluir os ficheiros do modelo e da ligação à BD
include_once '../config/database.php';
include_once '../objects/events.php';

// Instanciar a base de dados
$database= new Database();
$db=$database->getConnection();

// Inicializar o objeto das categorias
$events= new Events($db);
$st=$events->read();

// Numero de registos retornados pela BD
$num=$st->rowCount();

// Se existem registos o $num é maior do que 0
if ($num>0)
{
    // Categorias no array
    $events_arr=array();
    $events_arr["records"]=array();

    // Ler os registos na BD e colocar no array de json
    while($row=$st->fetch(PDO::FETCH_ASSOC))
    {
        // Extrair os valores das linhas
        extract($row);
        $events_items=array
        (
            "id"=>$id,
            "name"=>$name,
            "desc"=>$desc,
            "cover"=>$cover,
            "date"=>$date,
            "location"=>$location,
            "capacity"=>$capacity,
            "category_name"=>$category_name, // Ver Depois
            "created"=>$created,
            "modified"=>$modified,
        );

        // Adiciona o registo ao conjunto de elementos
        array_push($events_arr["records"], $events_items);
    }

    http_response_code(200);
    echo json_encode($events_arr);
}

// Não existem registos na BD
else
{
    echo json_encode(array("message"=>"No Events Found."));
}

?>