<?php

class OrderDetails
{
    // Definir atributos
    private $conn;
    private $table_name = "order_details";

    // Propriedades do objeto
    public $id;
    public $users_id;
    public $ordered_tickets_id;
    public $order_total;
    public $order_date;
    public $on_cart;
    public $status;
    public $created;
    public $modified;

    // Construtor
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Método para ler todas as ordens
    public function read()
    {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Método para criar uma nova ordem
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                  SET 
                    users_id = :users_id,
                    ordered_tickets_id = :ordered_tickets_id,
                    order_total = :order_total,
                    order_date = :order_date,
                    on_cart = :on_cart,
                    status = :status,
                    created = :created,
                    modified = :modified";

        $stmt = $this->conn->prepare($query);

        // Limpar dados
        $this->users_id = htmlspecialchars(strip_tags($this->users_id));
        $this->ordered_tickets_id = htmlspecialchars(strip_tags($this->ordered_tickets_id));
        $this->order_total = htmlspecialchars(strip_tags($this->order_total));
        $this->order_date = htmlspecialchars(strip_tags($this->order_date));
        $this->on_cart = htmlspecialchars(strip_tags($this->on_cart));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->created = htmlspecialchars(strip_tags($this->created));
        $this->modified = htmlspecialchars(strip_tags($this->modified));

        // Bind values
        $stmt->bindParam(":users_id", $this->users_id);
        $stmt->bindParam(":ordered_tickets_id", $this->ordered_tickets_id);
        $stmt->bindParam(":order_total", $this->order_total);
        $stmt->bindParam(":order_date", $this->order_date);
        $stmt->bindParam(":on_cart", $this->on_cart);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":created", $this->created);
        $stmt->bindParam(":modified", $this->modified);

        // Executar
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Método para deletar uma ordem
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

    // Método para atualizar uma ordem
    public function update()
    {
        $query = "UPDATE " . $this->table_name . "
                  SET 
                    users_id = :users_id,
                    ordered_tickets_id = :ordered_tickets_id,
                    order_total = :order_total,
                    order_date = :order_date,
                    on_cart = :on_cart,
                    status = :status,
                    modified = :modified
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Limpar dados
        $this->users_id = htmlspecialchars(strip_tags($this->users_id));
        $this->ordered_tickets_id = htmlspecialchars(strip_tags($this->ordered_tickets_id));
        $this->order_total = htmlspecialchars(strip_tags($this->order_total));
        $this->order_date = htmlspecialchars(strip_tags($this->order_date));
        $this->on_cart = htmlspecialchars(strip_tags($this->on_cart));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->modified = htmlspecialchars(strip_tags($this->modified));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind values
        $stmt->bindParam(":users_id", $this->users_id);
        $stmt->bindParam(":ordered_tickets_id", $this->ordered_tickets_id);
        $stmt->bindParam(":order_total", $this->order_total);
        $stmt->bindParam(":order_date", $this->order_date);
        $stmt->bindParam(":on_cart", $this->on_cart);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":modified", $this->modified);
        $stmt->bindParam(":id", $this->id);

        // Executar
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Método para obter detalhes de uma ordem por ID
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
