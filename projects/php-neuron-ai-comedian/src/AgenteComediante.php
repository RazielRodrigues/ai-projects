<?php

namespace src;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/BuscarPiada.php';
require_once __DIR__ . '/Piada.php';

use NeuronAI\Agent;
use NeuronAI\SystemPrompt;
use NeuronAI\Providers\Ollama\Ollama;
use NeuronAI\Chat\Messages\UserMessage;
use NeuronAI\Providers\AIProviderInterface;
use NeuronAI\Tools\Tool;
use src\BuscarPiada;
use src\Piada;

class AgenteComediante extends Agent
{

    // Esse metodo é o responsavel por fazer a conexão com o LLM
    // aqui voce pode usar diferentes providers mas nesse caso
    // vamos usar o ollama se você seguiu o meu tutorial passado
    // basta copiar e colar o código e somente alterar o modelo que baixou
    // ou baixe esse modelo que eu to usando ele é muito bom e leve
    public function provider(): AIProviderInterface
    {
        return new Ollama(
            url: 'http://localhost:11434/api/',
            model: 'qwen3:1.7b',
        );
    }

    // Esse é o "cerebro" do seu agente, a onde voce define o background dele
    // e o que ele deve fazer nesse caso a gente ta definindo ele como 
    // o nosso asistente de analise do dev.to mas ele pode ser qualquer coisa
    public function instructions(): string
    {
        return new SystemPrompt(
            background: [
                'Você deve agir como um comediante Brasileiro',
            ],
            steps: [
                'Você usa a ferramenta disponivel',
                'Você usa a linguagem Português Brasileiro'
            ],
            output: [
                'A sua piada tem um texto bem divertido para dar contexto',
                'A sua resposta segue a estrutura fornecida'
            ]
        );
    }

    // Aqui é onde definimos as ferramentas que a nossa AI vai ter acesso
    // Com isso fornecemos mais informações e funções ao nosso LLM
    protected function tools(): array
    {
        return [
            Tool::make(
                'pegar_piadas',
                'Recuperar as piadas',
            )->setCallable(
                new BuscarPiada()
            )
        ];
    }

    // Metodo para definir a classe de estrutura de output
    protected function getOutputClass() : string
    {
        return Piada::class;
    }

}

$piada = AgenteComediante::make()->structured(
    new UserMessage("Olá, me conte uma piada!")
);

echo 'Aqui esta a sua Piada :D' . PHP_EOL;
echo 'Tipo: '. $piada->tipo . PHP_EOL;
echo 'Introdução: '. $piada->setup . PHP_EOL;
echo 'Punchline: '. $piada->punchline . PHP_EOL;