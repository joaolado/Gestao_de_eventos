<?php

class OrderedTickets
{
    // Definir atributos
    private $conn;
    private $table_name = "ordered_tickets";

    // Propriedades do objeto
    public $id;
    public $tickets_info_id;
    public $quantity;
    public $created;
    public $modified;

    // Construtor
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Método para ler todos os tickets pedidos
    public function read()
    {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Método para criar um novo ticket pedido
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                  SET 
                    tickets_info_id = :tickets_info_id,
                    quantity = :quantity,
                    created = :created,
                    modified = :modified";

        $stmt = $this->conn->prepare($query);

        // Limpar dados
        $this->tickets_info_id = htmlspecialchars(strip_tags($this->tickets_info_id));
        $this->quantity = htmlspecialchars(strip_tags($this->quantity));
        $this->created = htmlspecialchars(strip_tags($this->created));
        $this->modified = htmlspecialchars(strip_tags($this->modified));

        // Bind values
        $stmt->bindParam(":tickets_info_id", $this->tickets_info_id);
        $stmt->bindParam(":quantity", $this->quantity);
        $stmt->bindParam(":created", $this->created);
        $stmt->bindParam(":modified", $this->modified);

        // Executar
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Método para deletar um ticket pedido
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

    // Método para atualizar um ticket pedido
    public function update()
    {
        $query = "UPDATE " . $this->table_name . "
                  SET 
                    tickets_info_id = :tickets_info_id,
                    quantity = :quantity,
                    modified = :modified
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Limpar dados
        $this->tickets_info_id = htmlspecialchars(strip_tags($this->tickets_info_id));
        $this->quantity = htmlspecialchars(strip_tags($this->quantity));
        $this->modified = htmlspecialchars(strip_tags($this->modified));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind values
        $stmt->bindParam(":tickets_info_id", $this->tickets_info_id);
        $stmt->bindParam(":quantity", $this->quantity);
        $stmt->bindParam(":modified", $this->modified);
        $stmt->bindParam(":id", $this->id);

        // Executar
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Método para obter os detalhes de um ticket pedido por ID
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
