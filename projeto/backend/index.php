<?php

require __DIR__ . '/../vendor/autoload.php';

use Slim\Factory\AppFactory;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/');
$dotenv->load();

$app = AppFactory::create();

$app->setBasePath('/backend'); 

(require __DIR__ . '/src/Routes/routes.php')($app);

$app->run();
