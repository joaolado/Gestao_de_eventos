<?php

class UsersPayments
{
    // Definir atributos
    private $conn;
    private $table_name = "users_payments";

    // Propriedades do objeto
    public $id;
    public $users_id;
    public $payment_type;
    public $payment_provider;
    public $created;
    public $modified;

    // Construtor
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Método para ler todos os pagamentos
    public function read()
    {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Método para criar um novo pagamento
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                  SET 
                    users_id = :users_id,
                    payment_type = :payment_type,
                    payment_provider = :payment_provider,
                    created = :created";

        $stmt = $this->conn->prepare($query);

        // Limpar dados
        $this->users_id = htmlspecialchars(strip_tags($this->users_id));
        $this->payment_type = htmlspecialchars(strip_tags($this->payment_type));
        $this->payment_provider = htmlspecialchars(strip_tags($this->payment_provider));
        $this->created = htmlspecialchars(strip_tags($this->created));

        // Bind values
        $stmt->bindParam(":users_id", $this->users_id);
        $stmt->bindParam(":payment_type", $this->payment_type);
        $stmt->bindParam(":payment_provider", $this->payment_provider);
        $stmt->bindParam(":created", $this->created);

        // Executar
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Método para deletar um pagamento
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

    // Método para atualizar um pagamento
    public function update()
    {
        $query = "UPDATE " . $this->table_name . "
                  SET 
                    users_id = :users_id,
                    payment_type = :payment_type,
                    payment_provider = :payment_provider,
                    modified = :modified
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Limpar dados
        $this->users_id = htmlspecialchars(strip_tags($this->users_id));
        $this->payment_type = htmlspecialchars(strip_tags($this->payment_type));
        $this->payment_provider = htmlspecialchars(strip_tags($this->payment_provider));
        $this->modified = htmlspecialchars(strip_tags($this->modified));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind values
        $stmt->bindParam(":users_id", $this->users_id);
        $stmt->bindParam(":payment_type", $this->payment_type);
        $stmt->bindParam(":payment_provider", $this->payment_provider);
        $stmt->bindParam(":modified", $this->modified);
        $stmt->bindParam(":id", $this->id);

        // Executar
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Método para obter detalhes de um pagamento por ID
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
