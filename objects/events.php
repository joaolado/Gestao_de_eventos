<?php

class Events
{

    // Definir atributos
    private $conn;
    private $table_name="events";

    // Propriedades do objeto
    public $id;
    public $name;
    public $desc;
    public $cover;
    public $date;
    public $location;
    public $capacity;
    public $category_id;
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
        $querry="SELECT p.id, p.name, p.desc, p.cover, p.date, p.location, p.capacity, p.category_id, ec.name AS category_name, p.created, p.modified 
                    FROM ". $this->table_name. " p LEFT JOIN events_category ec ON p.category_id = ec.id  order by p.name";
        $st=$this->conn->prepare($querry);
        $st->execute();

        return $st;
    }

    public function create()
    {   
        // Consulta para buscar o category_id com base no category_name
        $events_category_query = "SELECT id FROM events_category WHERE name = ?";

        $events_category_stmt = $this->conn->prepare($events_category_query);
        $events_category_stmt->bindParam(1, $this->events_category_name);
        $events_category_stmt->execute();

        $events_category_row = $events_category_stmt->fetch(PDO::FETCH_ASSOC);

        // Verifica se encontrou a categoria
        if ($events_category_row){
        $this->category_id = $events_category_row['id'];
        } else 
        {

        // Se a categoria não existir, retorna falso para indicar falha
        return false;
        }

        $qry="INSERT INTO ".$this->table_name. " SET name=?, desc=?, cover=?, date=?, location=?, capacity=?, category_id=?, created=?, modified=?";
        $st=$this->conn->prepare($qry);

        // Inicializar as variaveis / Não Adicionar FK
        $this->name=htmlspecialchars(strip_tags($this->name));
        $this->description=htmlspecialchars(strip_tags($this->description));
        $this->price=htmlspecialchars(strip_tags($this->price));
        
        // Bind values
        $st->bindParam(1,$this->name);
        $st->bindParam(2,$this->desc);
        $st->bindParam(3,$this->cover);
        $st->bindParam(4,$this->date);
        $st->bindParam(5,$this->location);
        $st->bindParam(6,$this->capacity);
        $st->bindParam(7,$this->category_id);
        $st->bindParam(8,$this->created);
        $st->bindParam(9,$this->created);

        // Executar
        if ($st->execute()) {
            $this->category_name = $this->category_name;
            return true;
        }
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
        // Consulta para buscar o category_id com base no category_name
        $category_query = "SELECT id FROM categories WHERE name = ?";

        $category_stmt = $this->conn->prepare($category_query);
        $category_stmt->bindParam(1, $this->category_name);
        $category_stmt->execute();

        $category_row = $category_stmt->fetch(PDO::FETCH_ASSOC);

        // Verifica se encontrou a categoria
        if ($category_row) {
        $this->category_id = $category_row['id'];
        } else {

        // Se a categoria não existir, retorna falso para indicar falha
        return false;
        }

        $qry="UPDATE ".$this->table_name. " SET name=?, description=?, price=?, category_id=?, modified=? WHERE id=?";
        $st=$this->conn->prepare($qry);

        // Inicializar as variaveis
        $this->name=htmlspecialchars(strip_tags($this->name));
        $this->description=htmlspecialchars(strip_tags($this->description));
        $this->price=htmlspecialchars(strip_tags($this->price));

        // Bind values
        $st->bindParam(1,$this->name);
        $st->bindParam(2,$this->description);
        $st->bindParam(3,$this->price);
        $st->bindParam(4,$this->category_id);
        $st->bindParam(5,$this->modified);
        $st->bindParam(6,$this->id);

        // Executar
        if($st->execute()){return true;}
        return false;
    }

}

?>