<?php

class PaymentDetails
{
    // Definir atributos
    private $conn;
    private $table_name = "payment_details";

    // Propriedades do objeto
    public $id;
    public $payments_id;
    public $payment_amount;
    public $payment_date;

    // Construtor
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Método para ler todos os detalhes de pagamento
    public function read()
    {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Método para criar um novo detalhe de pagamento
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                  SET 
                    payments_id = :payments_id,
                    payment_amount = :payment_amount,
                    payment_date = :payment_date";

        $stmt = $this->conn->prepare($query);

        // Limpar dados
        $this->payments_id = htmlspecialchars(strip_tags($this->payments_id));
        $this->payment_amount = htmlspecialchars(strip_tags($this->payment_amount));
        $this->payment_date = htmlspecialchars(strip_tags($this->payment_date));

        // Bind values
        $stmt->bindParam(":payments_id", $this->payments_id);
        $stmt->bindParam(":payment_amount", $this->payment_amount);
        $stmt->bindParam(":payment_date", $this->payment_date);

        // Executar
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Método para deletar um detalhe de pagamento
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

    // Método para atualizar um detalhe de pagamento
    public function update()
    {
        $query = "UPDATE " . $this->table_name . "
                  SET 
                    payments_id = :payments_id,
                    payment_amount = :payment_amount,
                    payment_date = :payment_date
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Limpar dados
        $this->payments_id = htmlspecialchars(strip_tags($this->payments_id));
        $this->payment_amount = htmlspecialchars(strip_tags($this->payment_amount));
        $this->payment_date = htmlspecialchars(strip_tags($this->payment_date));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind values
        $stmt->bindParam(":payments_id", $this->payments_id);
        $stmt->bindParam(":payment_amount", $this->payment_amount);
        $stmt->bindParam(":payment_date", $this->payment_date);
        $stmt->bindParam(":id", $this->id);

        // Executar
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Método para obter detalhes de pagamento por ID
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
