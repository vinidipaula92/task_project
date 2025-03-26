<?php
use Slim\App;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Src\Controllers\LoginController;
use Src\Controllers\TaskController;
use Src\Controllers\ValidateToken;

return function (App $app) {
  $taskController = new TaskController();
  $loginController = new LoginController();

  $app->get('/tasks', function (Request $request, Response $response) use ($taskController) {
    // $token = $request->getHeaderLine('Authorization');
    // if (empty($token)) {
    //   $response->getBody()->write('{"error": "Token não informado"}');
    //   return $response->withStatus(401);
    // }
    // $validateToken = new ValidateToken();
    // $user = $validateToken->ValidateKey($token);
    // if (empty($user)) {
    //   $response->getBody()->write('{"error": "Token inválido"}');
    //   return $response->withStatus(401);
    // }
    return $taskController->getTasks($response);
  });
  $app->post('/tasks', function (Request $request, Response $response) use ($taskController) {
      return $taskController->createTask($request, $response);
  });
  $app->put('/tasks/{id}', function (Request $request, Response $response, $args) use ($taskController) {
      return $taskController->updateTask($request, $response, $args['id']);
  });
  $app->delete('/tasks/{id}', function (Request $request, Response $response, $args) use ($taskController) {
      return $taskController->deleteTask( $response, $args['id']);
  });

  $app->get('/users', function (Request $request, Response $response) use ($loginController) {
    // $token = $request->getHeaderLine('Authorization');
    // if (empty($token)) {
    //   $response->getBody()->write('{"error": "Token não informado"}');
    //   return $response->withStatus(401);
    // }
    // $validateToken = new ValidateToken();
    // $user = $validateToken->ValidateKey($token);
    // if (empty($user)) {
    //   $response->getBody()->write('{"error": "Token inválido"}');
    //   return $response->withStatus(401);
    // }
    return $loginController->getUser($response);
  });
  $app->post('/users', function (Request $request, Response $response) use ($loginController) {
      return $loginController->createUser($request, $response);
  });

  $app->post('/login', function (Request $request, Response $response) use ($loginController) {
    return $loginController->login($request, $response);
  });
};
