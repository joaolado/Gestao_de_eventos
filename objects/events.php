<?php

class Product
{

    // Definir atributos
    private $conn;
    private $table_name="products";

    // Propriedades do objeto
    public $id;
    public $name;
    public $description;
    public $price;
    public $category_id;
    public $created;
    public $modified;

    public function __construct($db)
    {
        $this->conn=$db;
    }

    public function read()
    {
        // Selecionar todos os registos
        // SLOW QUERRY - $querry="SELECT * FROM ". $this->table_name;
        $querry="SELECT p.id, p.name, p.description, p.price, p.category_id, c.name AS category_name, p.created, p.modified 
                    FROM ". $this->table_name. " p LEFT JOIN categories c ON p.category_id = c.id  order by p.name";
        $st=$this->conn->prepare($querry);
        $st->execute();

        return $st;
    }

    public function create()
    {   
        // Consulta para buscar o category_id com base no category_name
        $category_query = "SELECT id FROM categories WHERE name = ?";

        $category_stmt = $this->conn->prepare($category_query);
        $category_stmt->bindParam(1, $this->category_name);
        $category_stmt->execute();

        $category_row = $category_stmt->fetch(PDO::FETCH_ASSOC);

        // Verifica se encontrou a categoria
        if ($category_row){
        $this->category_id = $category_row['id'];
        } else 
        {

        // Se a categoria não existir, retorna falso para indicar falha
        return false;
        }

        $qry="INSERT INTO ".$this->table_name. " SET name=?, description=?, price=?, category_id=?, created=?, modified=?";
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
        $st->bindParam(5,$this->created);
        $st->bindParam(6,$this->created);

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