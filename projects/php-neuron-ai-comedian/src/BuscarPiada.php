<?php

namespace src;

use GuzzleHttp\Client;

require_once __DIR__ . '/../vendor/autoload.php';

class BuscarPiada
{

    protected Client $client;

    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => 'https://official-joke-api.appspot.com',
            'headers' => [
                'accept' => 'application/json',
            ]
        ]);
    }

    public function __invoke()
    {
        $resposta = $this->client->get('/random_joke');

        if ($resposta->getStatusCode() !== 200) {
            return 'Error :(';
        }

        $resposta = json_decode($resposta->getBody()->getContents(), true);

        $piada = '';
        $piada .= 'tipo: ' . $resposta['type'] . PHP_EOL;
        $piada .= 'setup: ' . $resposta['setup'] . PHP_EOL;
        $piada .= 'punchline:' . $resposta['punchline'] . PHP_EOL;

        return $piada;
    }
}
