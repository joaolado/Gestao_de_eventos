<?php

class Events_category
{

    // Definir atributos
    private $conn;
    private $table_name="events_category";

    // Propriedades do objeto
    public $id;
    public $name;
    public $desc;
    public $created;
    public $modified;
    public $deleted;


    public function __construct($db)
    {
        $this->conn=$db;
    }

    public function read()
    {
        // Selecionar todos os registos
        // SLOW QUERRY - $querry="SELECT * FROM ". $this->table_name;
        
        $querry="SELECT id,name,description,created,modified FROM ". $this->table_name. " order by name";
        $st=$this->conn->prepare($querry);
        $st->execute();

        return $st;
    }

    public function create()
    {
        $qry="INSERT INTO ".$this->table_name. " SET name=?, description=?, created=?, modified=?";
        $st=$this->conn->prepare($qry);

        // Inicializar as variaveis
        $this->name=htmlspecialchars(strip_tags($this->name));
        $this->description=htmlspecialchars(strip_tags($this->description));

        // Bind values
        $st->bindParam(1,$this->name);
        $st->bindParam(2,$this->description);
        $st->bindParam(3,$this->created);
        $st->bindParam(4,$this->created);

        // Executar
        if($st->execute()){return true;}
        return false;
    }

    public function delete()
    {
        $qry="DELETE FROM ".$this->table_name." WHERE id=?";
        $st=$this->conn->prepare($qry);
        $st->bindParam(1,$this->id);

        // Executar
        if($st->execute()){return true;}
        return false;
    }

    public function update()
    {
        $qry="UPDATE ".$this->table_name. " SET name=?, description=?, modified=? WHERE id=?";
        $st=$this->conn->prepare($qry);

        // Inicializar as variaveis
        $this->name=htmlspecialchars(strip_tags($this->name));
        $this->description=htmlspecialchars(strip_tags($this->description));

        // Bind values
        $st->bindParam(1,$this->name);
        $st->bindParam(2,$this->description);
        $st->bindParam(3,$this->modified);
        $st->bindParam(4,$this->id);

        // Executar
        if($st->execute()){return true;}
        return false;
    }

}

?>