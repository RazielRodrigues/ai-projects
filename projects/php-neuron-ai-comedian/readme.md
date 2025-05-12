# Neuron AI: O Framework PHP de Inteligência Artificial

Neuron AI é um framework para lidar com IA usando PHP puro ou seus diversos frameworks como o Laravel ou Symfony. Neuron AI foi criado por Valerio Barbera ([https://www.linkedin.com/in/valeriobarbera/](https://www.linkedin.com/in/valeriobarbera/)) da equipe do software inspector.dev, uma ferramenta de observabilidade PHP. Com este framework é possível trabalhar com AI de uma maneira muito flexível e prática usando PHP. Neste repositório, estou abordando os aspectos mais importantes do framework e do mundo da IA, onde é possível fazer tudo o que fazemos em outras linguagens de programação, como Node, Python ou Go, mas tudo usando o glorioso PHP em sua melhor forma.

Para isso, eu irei usar o PHP puro, pois assim acredito que conseguimos realizar os testes de forma mais simples e sem acoplamento de muitas coisas. Então será necessário que você tenha o PHP rodando na sua versão 8+ e o Composer para assim começarmos a trabalhar com o projeto. Outros requerimentos serão o Ollama para rodarmos o nosso LLM de forma local sem gastar dinheiro com serviços de nuvem (mas isso não te impede de usar uma outra API como o ChatGPT ou Claude).

# Introdução

Cara, eu estou realmente muito empolgado escrevendo esse artigo porque eu sei como isso é importante para a comunidade do PHP. Sabendo que agora temos um framework que é tão flexível e desacoplado, eu consigo ver um futuro enorme para a nossa linguagem preferida e a forma como usamos ela para trabalhar com AI. É importante ressaltar que o PHP já possui alguns frameworks para trabalhar com AI como: LLPhant, PHP-ML, TensorFlow PHP e Rubix ML.

Mas eu realmente acho que o Neuron AI, dentro do que eu vi dos outros frameworks, sai na frente em questão de flexibilidade e pouca dependência. Portanto, é um novo projeto open source e eu convido vocês a irem ao GitHub dessa maravilha e já deixar uma estrela ou mesmo ajudar a contribuir. O que mais me faz acreditar nesse projeto é que foi algo criado por pessoas que já têm um histórico sólido e profissional com PHP e na comunidade open source. Segue o link do repositório Neuron AI: [https://github.com/inspector-apm/neuron-ai](https://github.com/inspector-apm/neuron-ai)

Então aqui nesse artigo eu vou criar com vocês uma mini aplicação de AI que vai contar piadas e vai retornar também o tipo da piada. Massa demais, né?

Posteriormente, irei escrever mais artigos explicando como funcionam os Agentes MCP, RAG, Vector Store, Chat e muito mais! Será um conteúdo denso, então eu pretendo escrever uma série de artigos sobre o tema.

Sem mais delongas, vamos começar a parte DIVERTIDA!

# Sumário

* Conceitos chave e instalação dos pacotes
* Agentes de AI com PHP
* Ferramentas e chamadas de funções
* Saída de dados estruturadas

# Conceitos chave e instalação

Basicamente, o Neuron AI funciona com Agentes. Essa é uma das classes principais que utilizamos para criar um agente de inteligência artificial. Então, após criar a sua classe e implementar o seu agente, é possível configurar ele e dar a ele uma "personalidade" e "funções", assim como damos um contexto quando criamos uma janela no ChatGPT. Mas, nesse caso, é você que define e deixa isso chumbado no código, abrindo a possibilidade de podermos criar diversos agentes para regras de negócio específicas.

Nesse caso, será necessário ter o Ollama rodando no seu computador. Para isso, eu te convido a ler esse primeiro artigo de minha autoria. Nesse artigo, eu ensino como instalar e usar o Ollama, que é praticamente o mesmo processo para usarmos com o NeuronAI:

Tutorial | Usando Deepseek no Visual Studio Code de graça 💸 ([https://dev.to/razielrodrigues/usando-deepseek-no-visual-studio-code-de-graca-2764](https://dev.to/razielrodrigues/usando-deepseek-no-visual-studio-code-de-graca-2764))

Após ter o Ollama instalado, será necessário rodar esse comando:

`composer require inspector-apm/neuron-ai`

# Agente de AI

Vamos criar um agente de AI que vai ajudar a gente a fazer umas piadas, sabe? No estilo tiosão de churrasco. Crie agora um arquivo chamado `AgenteComediante.php` dentro de uma pasta `src` e copie e cole o seguinte código:

```php
<?php

namespace src;

require_once __DIR__ . '/../vendor/autoload.php';

use NeuronAI\Agent;
use NeuronAI\SystemPrompt;
use NeuronAI\Providers\Ollama\Ollama;
use NeuronAI\Chat\Messages\UserMessage;
use NeuronAI\Providers\AIProviderInterface;

class AgenteComediante extends Agent
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
                'Você deve agir como um comediante Brasileiro',
            ],
            steps: [
                'Você usa a linguagem Português Brasileiro',
            ],
            output: [
                'A sua piada tem um texto bem divertido para dar contexto'
            ]
        );
    }
}

$response = AgenteComediante::make()->chat(
    new UserMessage("Olá, me conte uma piada!")
);

var_dump($response->getContent());
```

# Ferramentas ou chamada de funções

Após rodar o código, será possível ver o seu agente de AI agindo como um tiosão e fazendo uma piada que pode ser boa ou ruim hahaha. Isso vai depender de muitas coisas, mas principalmente do tanto de parâmetro que a sua AI tem. Caso ela tenha mais parâmetros, é possível que a piada saia mais engraçada.

Mas para resolver essa limitação, o Neuron Framework conta com uma feature muito boa que são as chamadas "Tools" ou também "Function Call". Isso é basicamente uma forma de pegar dados de outro lugar ou respostas e adicionar à sua AI, dando assim a ela mais "poderes" e possibilitando uma resposta mais inteligente e com um contexto maior. Então vamos adicionar um novo método na nossa classe. Copie e cole essas linhas de código:

```php
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
```

E adicione isso no `steps` para garantir que vai usar a tool:

```php
steps: [
    'Você usa a ferramenta disponível',
    'Você usa a linguagem Português Brasileiro'
],
```

Crie um novo arquivo chamado `BuscarPiada.php`, copie e cole, e não se esqueça de importar a nova classe dentro do agente:

```php
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
```

# Respostas estruturadas

Após adicionar as tools, é possível ver que realmente o nosso código já retorna algo bem interessante, pois pega o que vem da API em inglês, traduz para português e depois gera a nossa piada. Mas ainda podemos reparar que as respostas não têm padrão, gerando assim uma string muito confusa e sem sentido. Além disso, a gente ainda fica vendo os pensamentos da AI e isso não é nada user-friendly. Para resolver isso, o Neuron tem um conceito chamado resposta estruturada, que são schemas e são mapeados via classe. Então vamos implementar isso e deixar a resposta formatada e sempre legível.

Crie um arquivo chamado `Piada.php` e copie e cole. Não se esqueça de importar a classe dentro do agente:

```php
<?php

namespace src;

use NeuronAI\StructuredOutput\SchemaProperty;

require_once __DIR__ . '/../vendor/autoload.php';

class Piada
{
    #[SchemaProperty(description: 'Contexto da piada', required: true)]
    public string $tipo;

    #[SchemaProperty(description: 'Questionamento da piada', required: true)]
    public string $setup;

    #[SchemaProperty(description: 'Porque de ser engraçado', required: true)]
    public string $punchline;
}
```

Adicione este método dentro do agente:

```php
protected function getOutputClass() : string
{
    return Piada::class;
}
```

E altere a resposta para:

```php
$piada = AgenteComediante::make()->structured(
    new UserMessage("Olá, me conte uma piada!")
);

echo 'Aqui está a sua Piada :D' . PHP_EOL;
echo 'Tipo: ' . $piada->tipo . PHP_EOL;
echo 'Introdução: ' . $piada->setup . PHP_EOL;
echo 'Punchline: ' . $piada->punchline . PHP_EOL;
```

# Conclusão

Esse é um exemplo do que pode ser feito com a AI. Nos próximos artigos vamos explorar o RAG, MCP Server e, para fechar com chave de ouro, Chat e Embeddings. Com o Neuron AI vai ser possível criarmos aplicações totalmente funcionais com AI, e tudo isso usando PHP, seja com frameworks ou de forma pura. Fique ligado para os próximos artigos onde vamos nos aprofundar mais e mais e vamos criar uma AI cada vez mais funcional e com diversas funcionalidades incríveis.

Aqui está o código do projeto e outros códigos que fiz sobre AI:

[https://github.com/RazielRodrigues/ai-projects](https://github.com/RazielRodrigues/ai-projects)

# Referência

[https://docs.neuron-ai.dev/](https://docs.neuron-ai.dev/) [https://github.com/RazielRodrigues/ai-projects/tree/main/projects/php-neuron-ai-comedian](https://github.com/RazielRodrigues/ai-projects/tree/main/projects/php-neuron-ai-comedian)