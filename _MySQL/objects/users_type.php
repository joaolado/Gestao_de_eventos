<?php

class UsersType
{
    // Definir atributos
    private $conn;
    private $table_name = "users_type";

    // Propriedades do objeto
    public $id;
    public $users_type;
    public $created;
    public $modified;
    public $deleted;

    // Construtor
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Método para ler todos os tipos de usuários
    public function read()
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE deleted IS NULL ORDER BY created DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Método para criar um novo tipo de usuário
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                  SET 
                    users_type = :users_type,
                    created = :created,
                    modified = :modified";

        $stmt = $this->conn->prepare($query);

        // Limpar dados
        $this->users_type = htmlspecialchars(strip_tags($this->users_type));
        $this->created = htmlspecialchars(strip_tags($this->created));
        $this->modified = htmlspecialchars(strip_tags($this->modified));

        // Bind values
        $stmt->bindParam(":users_type", $this->users_type);
        $stmt->bindParam(":created", $this->created);
        $stmt->bindParam(":modified", $this->modified);

        // Executar
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Método para atualizar um tipo de usuário existente
    public function update()
    {
        $query = "UPDATE " . $this->table_name . "
                  SET 
                    users_type = :users_type,
                    modified = :modified
                  WHERE id = :id AND deleted IS NULL";

        $stmt = $this->conn->prepare($query);

        // Limpar dados
        $this->users_type = htmlspecialchars(strip_tags($this->users_type));
        $this->modified = htmlspecialchars(strip_tags($this->modified));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind values
        $stmt->bindParam(":users_type", $this->users_type);
        $stmt->bindParam(":modified", $this->modified);
        $stmt->bindParam(":id", $this->id);

        // Executar
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Método para deletar (marcar como excluído) um tipo de usuário
    public function delete()
    {
        $query = "UPDATE " . $this->table_name . "
                  SET deleted = :deleted
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Limpar dado
        $this->deleted = htmlspecialchars(strip_tags($this->deleted));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind values
        $stmt->bindParam(":deleted", $this->deleted);
        $stmt->bindParam(":id", $this->id);

        // Executar
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Método para ler um único tipo de usuário
    public function readOne()
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ? AND deleted IS NULL LIMIT 0,1";
        $stmt = $this->conn->prepare($query);

        // Bind id
        $stmt->bindParam(1, $this->id);

        $stmt->execute();

        // Obter dados
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->users_type = $row['users_type'];
            $this->created = $row['created'];
            $this->modified = $row['modified'];
            $this->deleted = $row['deleted'];
        }
    }
}

?>
