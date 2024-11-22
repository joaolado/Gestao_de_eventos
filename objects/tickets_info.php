<?php

class TicketsInfo
{
    // Definir atributos
    private $conn;
    private $table_name = "tickets_info";

    // Propriedades do objeto
    public $id;
    public $event_id;
    public $ticket_type;
    public $price;
    public $available_quantity;
    public $created_at;
    public $modified_at;

    // Construtor
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Método para ler todas as informações dos tickets
    public function read()
    {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Método para criar uma nova informação de ticket
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                  SET 
                    event_id = :event_id,
                    ticket_type = :ticket_type,
                    price = :price,
                    available_quantity = :available_quantity,
                    created_at = :created_at,
                    modified_at = :modified_at";

        $stmt = $this->conn->prepare($query);

        // Limpar dados
        $this->event_id = htmlspecialchars(strip_tags($this->event_id));
        $this->ticket_type = htmlspecialchars(strip_tags($this->ticket_type));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->available_quantity = htmlspecialchars(strip_tags($this->available_quantity));
        $this->created_at = htmlspecialchars(strip_tags($this->created_at));
        $this->modified_at = htmlspecialchars(strip_tags($this->modified_at));

        // Bind values
        $stmt->bindParam(":event_id", $this->event_id);
        $stmt->bindParam(":ticket_type", $this->ticket_type);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":available_quantity", $this->available_quantity);
        $stmt->bindParam(":created_at", $this->created_at);
        $stmt->bindParam(":modified_at", $this->modified_at);

        // Executar
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Método para deletar uma informação de ticket
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

    // Método para atualizar as informações de um ticket
    public function update()
    {
        $query = "UPDATE " . $this->table_name . "
                  SET 
                    event_id = :event_id,
                    ticket_type = :ticket_type,
                    price = :price,
                    available_quantity = :available_quantity,
                    modified_at = :modified_at
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Limpar dados
        $this->event_id = htmlspecialchars(strip_tags($this->event_id));
        $this->ticket_type = htmlspecialchars(strip_tags($this->ticket_type));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->available_quantity = htmlspecialchars(strip_tags($this->available_quantity));
        $this->modified_at = htmlspecialchars(strip_tags($this->modified_at));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind values
        $stmt->bindParam(":event_id", $this->event_id);
        $stmt->bindParam(":ticket_type", $this->ticket_type);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":available_quantity", $this->available_quantity);
        $stmt->bindParam(":modified_at", $this->modified_at);
        $stmt->bindParam(":id", $this->id);

        // Executar
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Método para obter detalhes de um ticket por ID
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
