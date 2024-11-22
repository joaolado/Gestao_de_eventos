<?php

class Users
{
    // Definir atributos
    private $conn;
    private $table_name = "users";

    // Propriedades do objeto
    public $id;
    public $user_name;
    public $user_password;
    public $first_name;
    public $last_name;
    public $phone;
    public $email;
    public $address_id;
    public $created;
    public $modified;

    // Construtor
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Método para ler todos os usuários
    public function read()
    {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY created DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Método para criar um novo usuário
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                  SET 
                    user_name = :user_name,
                    user_password = :user_password,
                    first_name = :first_name,
                    last_name = :last_name,
                    phone = :phone,
                    email = :email,
                    address_id = :address_id,
                    created = :created,
                    modified = :modified";

        $stmt = $this->conn->prepare($query);

        // Limpar dados
        $this->user_name = htmlspecialchars(strip_tags($this->user_name));
        $this->user_password = htmlspecialchars(strip_tags($this->user_password));
        $this->first_name = htmlspecialchars(strip_tags($this->first_name));
        $this->last_name = htmlspecialchars(strip_tags($this->last_name));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->address_id = htmlspecialchars(strip_tags($this->address_id));
        $this->created = htmlspecialchars(strip_tags($this->created));
        $this->modified = htmlspecialchars(strip_tags($this->modified));

        // Bind values
        $stmt->bindParam(":user_name", $this->user_name);
        $stmt->bindParam(":user_password", $this->user_password);
        $stmt->bindParam(":first_name", $this->first_name);
        $stmt->bindParam(":last_name", $this->last_name);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":address_id", $this->address_id);
        $stmt->bindParam(":created", $this->created);
        $stmt->bindParam(":modified", $this->modified);

        // Executar
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Método para atualizar um usuário existente
    public function update()
    {
        $query = "UPDATE " . $this->table_name . "
                  SET 
                    user_name = :user_name,
                    user_password = :user_password,
                    first_name = :first_name,
                    last_name = :last_name,
                    phone = :phone,
                    email = :email,
                    address_id = :address_id,
                    modified = :modified
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Limpar dados
        $this->user_name = htmlspecialchars(strip_tags($this->user_name));
        $this->user_password = htmlspecialchars(strip_tags($this->user_password));
        $this->first_name = htmlspecialchars(strip_tags($this->first_name));
        $this->last_name = htmlspecialchars(strip_tags($this->last_name));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->address_id = htmlspecialchars(strip_tags($this->address_id));
        $this->modified = htmlspecialchars(strip_tags($this->modified));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind values
        $stmt->bindParam(":user_name", $this->user_name);
        $stmt->bindParam(":user_password", $this->user_password);
        $stmt->bindParam(":first_name", $this->first_name);
        $stmt->bindParam(":last_name", $this->last_name);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":address_id", $this->address_id);
        $stmt->bindParam(":modified", $this->modified);
        $stmt->bindParam(":id", $this->id);

        // Executar
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Método para deletar um usuário
    public function delete()
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);

        // Limpar dado
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind id
        $stmt->bindParam(1, $this->id);

        // Executar
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Método para ler um único usuário
    public function readOne()
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);

        // Bind id
        $stmt->bindParam(1, $this->id);

        $stmt->execute();

        // Obter dados
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->user_name = $row['user_name'];
            $this->user_password = $row['user_password'];
            $this->first_name = $row['first_name'];
            $this->last_name = $row['last_name'];
            $this->phone = $row['phone'];
            $this->email = $row['email'];
            $this->address_id = $row['address_id'];
            $this->created = $row['created'];
            $this->modified = $row['modified'];
        }
    }
}

?>
