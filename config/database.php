<?php

class Database{

    // Credenciais para acesso à BD
    private $host="localhost";
    private $db_name="api_db";
    private $username="root";
    private $password="";
    public $conn;

    // Método para estabelecer ligação à BD
    public function getConnection()
    {
        $this->conn=null;

        // Tenta fazer a ligação
        try
        {
            $this->conn=new PDO("mysql:host=".$this->host.";dbname=".$this->db_name,$this->username,$this->password);
            $this->conn->exec("set names utf8");
        }

        // Se não conseguir ligação reporta o erro
        catch(PDOException $ex)
        {
            echo "Connection error: ".$ex->getMessage();
        }

        // Devolve a ligação à BD
        return $this->conn;
    }
}

?>