<?php
namespace Src\Controllers;
use mysqli;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ValidateToken{
  private $db_connection;

  public function __construct()
  {
      $this->db_connection = new mysqli(
          $_ENV['DB_HOST'],
          $_ENV['DB_USER'],
          $_ENV['DB_PASS'],
          $_ENV['DB_NAME']
      );

      if ($this->db_connection->connect_error) {
          die("Conexão com o banco de dados falhou: " . $this->db_connection->connect_error);
      }
  }

    public function ValidateKey(string $token) : array
    {
        $query = $this->db_connection->prepare("SELECT * FROM users WHERE token = ?");
        $query->bind_param("s", $token);
        $query->execute();
        $result = $query->get_result();
        if ($result->num_rows > 0) {
            return $result->fetch_assoc();
        } else {
            return [];
        }
    }
}
