<?php

namespace src;

require_once __DIR__ . '/../vendor/autoload.php';
use GuzzleHttp\Client;

class GetPosts
{

    protected Client $client;

    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => 'https://dev.to/api/articles/',
            'headers' => [
                'accept' => 'application/vnd.forem.api-v1+json',
            ]
        ]);
    }

    public function __invoke(string $username)
    {
        $response = $this->client->get('?username=' . $username);

        if ($response->getStatusCode() !== 200) {
            return 'Error getting posts';
        }

        $response = json_decode($response->getBody()->getContents(), true);

        $descriptions = '';

        foreach ($response as $value) {
            $descriptions .= $value['description'] . PHP_EOL;
        }

        return $descriptions;
    }
}