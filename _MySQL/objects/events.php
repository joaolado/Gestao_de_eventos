<?php

class Events
{
    // Definir atributos
    private $conn;
    private $table_name = "events";

    // Propriedades do objeto
    public $id;
    public $title;
    public $description;
    public $category_id;
    public $start_datetime;
    public $end_datetime;
    public $location;
    public $created_at;
    public $modified_at;

    // Construtor
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Método para ler todos os eventos
    public function read()
    {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY start_datetime ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Método para criar um novo evento
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                  SET 
                    title = :title,
                    description = :description,
                    category_id = :category_id,
                    start_datetime = :start_datetime,
                    end_datetime = :end_datetime,
                    location = :location,
                    created_at = :created_at,
                    modified_at = :modified_at";

        $stmt = $this->conn->prepare($query);

        // Limpar dados
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->category_id = htmlspecialchars(strip_tags($this->category_id));
        $this->start_datetime = htmlspecialchars(strip_tags($this->start_datetime));
        $this->end_datetime = htmlspecialchars(strip_tags($this->end_datetime));
        $this->location = htmlspecialchars(strip_tags($this->location));
        $this->created_at = htmlspecialchars(strip_tags($this->created_at));
        $this->modified_at = htmlspecialchars(strip_tags($this->modified_at));

        // Bind values
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":category_id", $this->category_id);
        $stmt->bindParam(":start_datetime", $this->start_datetime);
        $stmt->bindParam(":end_datetime", $this->end_datetime);
        $stmt->bindParam(":location", $this->location);
        $stmt->bindParam(":created_at", $this->created_at);
        $stmt->bindParam(":modified_at", $this->modified_at);

        // Executar
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Método para deletar um evento
    public function delete()
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Limpar dados
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind value
        $stmt->bindParam(":id", $this->id);

        // Executar
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Método para atualizar um evento
    public function update()
    {
        $query = "UPDATE " . $this->table_name . "
                  SET 
                    title = :title,
                    description = :description,
                    category_id = :category_id,
                    start_datetime = :start_datetime,
                    end_datetime = :end_datetime,
                    location = :location,
                    modified_at = :modified_at
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Limpar dados
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->category_id = htmlspecialchars(strip_tags($this->category_id));
        $this->start_datetime = htmlspecialchars(strip_tags($this->start_datetime));
        $this->end_datetime = htmlspecialchars(strip_tags($this->end_datetime));
        $this->location = htmlspecialchars(strip_tags($this->location));
        $this->modified_at = htmlspecialchars(strip_tags($this->modified_at));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind values
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":category_id", $this->category_id);
        $stmt->bindParam(":start_datetime", $this->start_datetime);
        $stmt->bindParam(":end_datetime", $this->end_datetime);
        $stmt->bindParam(":location", $this->location);
        $stmt->bindParam(":modified_at", $this->modified_at);
        $stmt->bindParam(":id", $this->id);

        // Executar
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Método para obter um evento por ID
    public function readById()
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Limpar dados
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind value
        $stmt->bindParam(":id", $this->id);

        $stmt->execute();

        return $stmt;
    }
}

?>
