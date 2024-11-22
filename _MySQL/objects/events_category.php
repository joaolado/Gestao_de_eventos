<?php

class EventsCategory
{
    // Definir atributos
    private $conn;
    private $table_name = "events_category";

    // Propriedades do objeto
    public $id;
    public $name;
    public $description;
    public $created_at;
    public $modified_at;

    // Construtor
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Método para ler todas as categorias de eventos
    public function read()
    {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY name ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Método para criar uma nova categoria de evento
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                  SET 
                    name = :name,
                    description = :description,
                    created_at = :created_at,
                    modified_at = :modified_at";

        $stmt = $this->conn->prepare($query);

        // Limpar dados
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->created_at = htmlspecialchars(strip_tags($this->created_at));
        $this->modified_at = htmlspecialchars(strip_tags($this->modified_at));

        // Bind values
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":created_at", $this->created_at);
        $stmt->bindParam(":modified_at", $this->modified_at);

        // Executar
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Método para deletar uma categoria de evento
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

    // Método para atualizar uma categoria de evento
    public function update()
    {
        $query = "UPDATE " . $this->table_name . "
                  SET 
                    name = :name,
                    description = :description,
                    modified_at = :modified_at
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Limpar dados
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->modified_at = htmlspecialchars(strip_tags($this->modified_at));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind values
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":modified_at", $this->modified_at);
        $stmt->bindParam(":id", $this->id);

        // Executar
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Método para obter uma categoria de evento por ID
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
