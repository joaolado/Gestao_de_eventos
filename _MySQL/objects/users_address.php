<?php

class UsersAddress
{
    // Definir atributos
    private $conn;
    private $table_name = "users_address";

    // Propriedades do objeto
    public $id;
    public $address_line1;
    public $address_line2;
    public $postal_code;
    public $city;
    public $region;
    public $country;

    // Construtor
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Método para ler todos os endereços
    public function read()
    {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Método para criar um novo endereço
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                  SET 
                    address_line1 = :address_line1,
                    address_line2 = :address_line2,
                    postal_code = :postal_code,
                    city = :city,
                    region = :region,
                    country = :country";

        $stmt = $this->conn->prepare($query);

        // Limpar dados
        $this->address_line1 = htmlspecialchars(strip_tags($this->address_line1));
        $this->address_line2 = htmlspecialchars(strip_tags($this->address_line2));
        $this->postal_code = htmlspecialchars(strip_tags($this->postal_code));
        $this->city = htmlspecialchars(strip_tags($this->city));
        $this->region = htmlspecialchars(strip_tags($this->region));
        $this->country = htmlspecialchars(strip_tags($this->country));

        // Bind values
        $stmt->bindParam(":address_line1", $this->address_line1);
        $stmt->bindParam(":address_line2", $this->address_line2);
        $stmt->bindParam(":postal_code", $this->postal_code);
        $stmt->bindParam(":city", $this->city);
        $stmt->bindParam(":region", $this->region);
        $stmt->bindParam(":country", $this->country);

        // Executar
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Método para deletar um endereço
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

    // Método para atualizar um endereço
    public function update()
    {
        $query = "UPDATE " . $this->table_name . "
                  SET 
                    address_line1 = :address_line1,
                    address_line2 = :address_line2,
                    postal_code = :postal_code,
                    city = :city,
                    region = :region,
                    country = :country
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Limpar dados
        $this->address_line1 = htmlspecialchars(strip_tags($this->address_line1));
        $this->address_line2 = htmlspecialchars(strip_tags($this->address_line2));
        $this->postal_code = htmlspecialchars(strip_tags($this->postal_code));
        $this->city = htmlspecialchars(strip_tags($this->city));
        $this->region = htmlspecialchars(strip_tags($this->region));
        $this->country = htmlspecialchars(strip_tags($this->country));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind values
        $stmt->bindParam(":address_line1", $this->address_line1);
        $stmt->bindParam(":address_line2", $this->address_line2);
        $stmt->bindParam(":postal_code", $this->postal_code);
        $stmt->bindParam(":city", $this->city);
        $stmt->bindParam(":region", $this->region);
        $stmt->bindParam(":country", $this->country);
        $stmt->bindParam(":id", $this->id);

        // Executar
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Método para obter um endereço por ID
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
