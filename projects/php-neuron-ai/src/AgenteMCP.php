<?php

namespace src;

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use NeuronAI\Agent;
use NeuronAI\Chat\Messages\UserMessage;
use NeuronAI\Exceptions\NeuronException;
use NeuronAI\MCP\McpConnector;
use NeuronAI\Providers\AIProviderInterface;
use NeuronAI\Providers\Ollama\Ollama;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

class AgenteMCP extends Agent
{
    public function provider(): AIProviderInterface
    {
        return new Ollama(
            url: 'http://localhost:11434/api/',
            model: 'qwen3:1.7b',
        );
    }

    public function instructions(): string
    {
        return 'Você deve agir como um assistente que pesquisa coisas no brave usando MCP server';
    }

    protected function tools(): array
    {
        return [
            ...McpConnector::make([
                'command' => 'npx',
                'args' => ['-y', '@modelcontextprotocol/server-brave-search'],
                'env' => [
                    "BRAVE_API_KEY" => $_ENV['BRAVE_KEY']
                ]
            ])->tools(),
        ];
    }
}

try {
    $response = AgenteMCP::make()->chat(new UserMessage("Previsão do tempo em Porto, Portugal."));
    var_dump($response->getContent());
} catch (NeuronException $e) {
    echo $e->getTraceAsString();
}