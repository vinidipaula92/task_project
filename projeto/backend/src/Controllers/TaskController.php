<?php
namespace Src\Controllers;

use mysqli;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;


class TaskController
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

    public function createTask(Request $request, Response $response)
    {
      $data = json_decode($request->getBody()->getContents(), true);
      $query = $this->db_connection->prepare("INSERT INTO tasks (title, description, status, created_at, updated_at) VALUES (?, ?, ?, now(), now())");
      $query->bind_param("sss", $data['title'], $data['description'], $data['status']);
      if ($query->execute()) {
          $response = $response->withHeader('Content-Type', 'application/json');
          $response->getBody()->write(json_encode(['message' => 'Tarefa criada com sucesso']));
          return $response->withStatus(201);
      } else {
          $response = $response->withHeader('Content-Type', 'application/json');
          $response->getBody()->write(json_encode(['error' => 'Falha ao criar a tarefa']));
          return $response->withStatus(500);
      }
    }

    public function getTasks(Response $response): Response
    {
      $query = "SELECT * FROM tasks";
      $result = $this->db_connection->query($query);

      $tasks = [];
      while ($row = $result->fetch_assoc()) {
          $tasks[] = $row;
      }

      $response = $response->withHeader('Content-Type', 'application/json');
      $response->getBody()->write(json_encode($tasks));
      return $response;
    }


    public function updateTask(Request $request, Response $response, $id): Response
    {
      $data = json_decode($request->getBody()->getContents(), true);
      $query = $this->db_connection->prepare("UPDATE tasks SET title = ?, description = ?, status = ?, updated_at = now() WHERE id = ?");
      $query->bind_param("sssi", $data['title'], $data['description'], $data['status'], $id);
      if ($query->execute()) {
          $response = $response->withHeader('Content-Type', 'application/json');
          $response->getBody()->write(json_encode(['message' => 'Tarefa atualizada com sucesso']));
          return $response;
      } else {
          $response = $response->withHeader('Content-Type', 'application/json');
          $response->getBody()->write(json_encode(['error' => 'Falha ao atualizar a tarefa']));
          return $response->withStatus(500);
      }
    }

    public function deleteTask(Response $response, $id): Response
    {
      $query = $this->db_connection->prepare("DELETE FROM tasks WHERE id = ?");
      $query->bind_param("i", $id);
      if ($query->execute()) {
        $response = $response->withHeader("Content-Type", "application/json");
        $response->getBody()->write(json_encode(["message" => "Tarefa deletada com sucesso"]));
        return $response;
      } else {
        $response = $response->withHeader("Content-Type", "application/json");
        $response->getBody()->write(json_encode(["error"=> "Falha ao deletar a tarefa"]));
        return $response->withStatus(500);
      }
    }

    public function getTasksByStatus(Response $response, $status): Response
    {
      if ($status === "All") {
        return $this->getTasks($response);
      } else {
      $query = $this->db_connection->prepare("SELECT * FROM tasks WHERE status = ?");
      $query->bind_param("s", $status);
      $query->execute();
      $result = $query->get_result();
      }

      $tasks = [];
      while ($row = $result->fetch_assoc()) {
          $tasks[] = $row;
      }

      $response = $response->withHeader('Content-Type', 'application/json');
      $response->getBody()->write(json_encode($tasks));
      return $response;
    }

    public function completeTask(Request $request, Response $response, $id): Response
    {
      $query = $this->db_connection->prepare("UPDATE tasks SET status = 'concluida' WHERE id = ?");
      $query->bind_param("i", $id);
      if ($query->execute()) {
          $response = $response->withHeader('Content-Type', 'application/json');
          $response->getBody()->write(json_encode(['message' => 'Tarefa concluída com sucesso']));
          return $response;
      } else {
          $response = $response->withHeader('Content-Type', 'application/json');
          $response->getBody()->write(json_encode(['error' => 'Falha ao concluir a tarefa']));
          return $response->withStatus(500);
      }
    }
}