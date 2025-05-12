<?php

namespace src;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/GetPosts.php';
require_once __DIR__ . '/PostsDescription.php';

use NeuronAI\Agent;
use NeuronAI\Tools\Tool;
use NeuronAI\SystemPrompt;
use NeuronAI\Tools\ToolProperty;
use NeuronAI\Providers\Ollama\Ollama;
use NeuronAI\Chat\Messages\UserMessage;
use NeuronAI\Providers\AIProviderInterface;
use Inspector\Configuration;
use NeuronAI\Chat\History\AbstractChatHistory;
use NeuronAI\Chat\History\FileChatHistory;
use NeuronAI\Observability\AgentMonitoring;
use src\GetPosts;
use src\PostsDescription;
use Dotenv\Dotenv;
use NeuronAI\Exceptions\NeuronException;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

class AgenteSmith extends Agent
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
        return new SystemPrompt(
            background: [
                'O seu nome é Agente Smith',
                'Você deve agir como um leitor de artigos técnicos'
            ],
            steps: [
                'Use as ferramentas disponiveis',
                'Use a linguagem Português Brasileiro',
                'Você analisa os titulos de posts',
                'Você faz uma analise técnica baseado nos titulos dos post '
            ],
            output: [
                'Uma resposta consciente de acordo com os titulos de posts vindos da API',
                'A resposta deve ser um texto resumida corrido e bem explicado',
            ]
        );
    }

    protected function tools(): array
    {
        return [
            # Posso invocar assim: ToolPosts::make('get_posts', 'Retrive posts titles') ou igual da forma abaixo
            Tool::make(
                'get_posts',
                'Retrive posts titles',
            )->addProperty(
                new ToolProperty(
                    name: 'username',
                    type: 'string',
                    description: 'Summary posts titles',
                    required: true
                )
            )->setCallable(new GetPosts())
        ];
    }

    # Posso usar assim ou direto no metodo
    # protected function getOutputClass() : string
    # {
    #     return PostsDescription::class;
    # }

    # Para salvar e fazer o LLM relembrar o que foi dito
    protected function chatHistory(): AbstractChatHistory
    {
        return new FileChatHistory(
            directory: './storage',
            key: '[username]',
            contextWindow: 50000
        );
    }
}

try {
    # Para adicionar o monitoramento do inspector.dev
    $inspector = new \Inspector\Inspector(new Configuration($_ENV['INSPECTOR_KEY']));

    # Imperative way sem structured response 
    # $response = AgenteSmith::make()->chat(new UserMessage("Resumo dos titulos de post para o username: razielrodrigues"));
    # var_dump($response->getContent());

    # Imperative way com structured response 
    $response = AgenteSmith::make()
        ->observe(
            new AgentMonitoring($inspector)
        )
        ->structured(
            new UserMessage("Hello world!"),
            PostsDescription::class, # passa a classe aqui ou usa o metodo dentro da classe
            maxRetries: 2 # se colocar zero ele so tenta uma vez aqui voce pode por pra tentar denovo e pegar uma resposta mais concisa
        );

    var_dump(
        'Username: ' . $response->username,
        'Summary: ' . $response->summary,
        'Titles: ' . $response->postsTitles->titles
    );
} catch (NeuronException $e) {
    echo $e->getTraceAsString();
}
