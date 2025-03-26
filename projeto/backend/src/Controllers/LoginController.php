<?php
namespace Src\Controllers;

use mysqli;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;


class LoginController
{
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

    public function createUser(Request $request, Response $response)
    {
      $data = json_decode($request->getBody()->getContents(), true);
      $password = $data['password'] = md5($data['password']);
      $token = md5(uniqid(rand(), true));
      $query = $this->db_connection->prepare("INSERT INTO users (name, email, password, token, created_at, updated_at) VALUES (?, ?, ?, ?, now(), now())");
      $query->bind_param("ssss", $data['name'], $data['email'], $password, $token);
      if ($query->execute()) {
        $response = $response->withHeader('Content-Type', 'application/json');
        $response->getBody()->write(json_encode(['message' => 'Usuário criado com sucesso']));
        return $response->withStatus(201);
      } else {
          $response = $response->withHeader('Content-Type', 'application/json');
          $response->getBody()->write(json_encode(['error' => 'Falha ao criar o usuário']));
          return $response->withStatus(500);
      }

    }

    public function getUser(Response $response): Response
    {
      $query = "SELECT * FROM users";
      $result = $this->db_connection->query($query);

      $user = [];
      while ($row = $result->fetch_assoc()) {
          $user[] = $row;
      }

      $response = $response->withHeader('Content-Type', 'application/json');
      $response->getBody()->write(json_encode($user));
      return $response;
    }

    public function login(Request $request, Response $response): Response
    {
        $data = json_decode($request->getBody()->getContents(), true);
        $password = md5($data['password']);
        $query = $this->db_connection->prepare("SELECT * FROM users WHERE email = ? AND password = ?");
        $query->bind_param("ss", $data['email'], $password);
        $query->execute();
        $result = $query->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write(json_encode(['token' => $user['token']]));
            return $response;
        } else {
            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write(json_encode(['error' => 'Usuário ou senha inválidos']));
            return $response->withStatus(401);
        }
    }
}