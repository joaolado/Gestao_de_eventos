<?php

class UsersTypeUsers
{
    // Definir atributos
    private $conn;
    private $table_name = "users_type_users";

    // Propriedades do objeto
    public $users_id;
    public $users_type_id;

    // Construtor
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Método para ler todas as relações entre usuários e tipos
    public function read()
    {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY users_id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Método para criar uma nova relação entre usuário e tipo de usuário
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                  SET 
                    users_id = :users_id,
                    users_type_id = :users_type_id";

        $stmt = $this->conn->prepare($query);

        // Limpar dados
        $this->users_id = htmlspecialchars(strip_tags($this->users_id));
        $this->users_type_id = htmlspecialchars(strip_tags($this->users_type_id));

        // Bind values
        $stmt->bindParam(":users_id", $this->users_id);
        $stmt->bindParam(":users_type_id", $this->users_type_id);

        // Executar
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Método para deletar uma relação específica (soft delete não é aplicável aqui)
    public function delete()
    {
        $query = "DELETE FROM " . $this->table_name . "
                  WHERE users_id = :users_id AND users_type_id = :users_type_id";

        $stmt = $this->conn->prepare($query);

        // Limpar dados
        $this->users_id = htmlspecialchars(strip_tags($this->users_id));
        $this->users_type_id = htmlspecialchars(strip_tags($this->users_type_id));

        // Bind values
        $stmt->bindParam(":users_id", $this->users_id);
        $stmt->bindParam(":users_type_id", $this->users_type_id);

        // Executar
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Método para ler tipos de usuários associados a um usuário específico
    public function readByUserId()
    {
        $query = "SELECT ut.* 
                  FROM " . $this->table_name . " utu
                  INNER JOIN users_type ut ON utu.users_type_id = ut.id
                  WHERE utu.users_id = :users_id";

        $stmt = $this->conn->prepare($query);

        // Limpar e associar
        $this->users_id = htmlspecialchars(strip_tags($this->users_id));
        $stmt->bindParam(":users_id", $this->users_id);

        $stmt->execute();

        return $stmt;
    }

    // Método para ler usuários associados a um tipo específico
    public function readByTypeId()
    {
        $query = "SELECT u.* 
                  FROM " . $this->table_name . " utu
                  INNER JOIN users u ON utu.users_id = u.id
                  WHERE utu.users_type_id = :users_type_id";

        $stmt = $this->conn->prepare($query);

        // Limpar e associar
        $this->users_type_id = htmlspecialchars(strip_tags($this->users_type_id));
        $stmt->bindParam(":users_type_id", $this->users_type_id);

        $stmt->execute();

        return $stmt;
    }
}

?>
