# Neuron AI: O Framework PHP de Inteligência Artificial

Neuron AI é um framework para lidar com IA usando PHP puro ou seus diversos frameworks como o Laravel ou Symfony, Neuron AI foi criado por Valerio Barbera (https://www.linkedin.com/in/valeriobarbera/) da equipe do software inspector.dev uma ferramenta de observabilidade PHP. Com este framework é possivel trabalhar com AI de uma maneira muito flexível e prática usando PHP. Neste repositório, estou abordando os aspecto mais importantes do framework e do mundo da IA, onde é possível fazer tudo o que fazemos em outras linguagens de programação, como Node, Python ou Go, mas tudo usando o glorioso PHP em sua melhor forma.

Para isso eu irei usar o PHP puro pois assim acredito que conseguimos realizar os testes de forma mais simples e sem acoplamento de muitas coisas, então será necessario que você tenha o PHP rodando na sua versão 8+ e o composer para assim começarmos a trabalhar com o projeto, outros requerimentos serão o ollama para rodarmos o nosso LLM de forma local sem gastar dinheiro com serviços de nuvem (Mas isso não te impede de usar uma outra API como o ChatGPT ou Claude).

# Introdução

Cara, eu estou realmente muito empolgado escrevendo esse artigo porque eu sei como isso é importante para a comunidade do PHP e sabendo que agora temos um framework que é tão fleixivel e desacoplado eu consigo ver um futuro enorme para a nossa linguagem preferida e a forma como usamos ela para trabalhar com AI, é importante ressaltar que o PHP já possui alguns frameworks para trabalhar com AI como: LLPhant, PHP-ML, TensorFlow PHP e Rubix ML.

Mas eu realmente acho que o Neuron AI dentro do que eu vi dos outros frameworks, sai na frente em questão de flexibilidade e pouca dependencia, portanto é um novo projeto open source e eu convido vocês a irem ao github dessa maravilha e já deixar uma estrela ou mesmo ajudar a contribuir, o que mais faz acreditar nesse projeto é que foi algo criado por pessoas que já tem um historico solido e profissional com PHP e na comunidade open source. Segue o link do Repositorio Neuron AI: https://github.com/inspector-apm/neuron-ai

Então aqui nesse artigo eu vou criar com vocês uma mini aplicação de AI que vai contar piadas e vai retornar também o tipo da piada, massa demais né?

Posteriormente irei escrever mais artigos explicando como funciona os Agentes MCP, RAG, Vector Store, Chat e muito mais! Será um conteudo denso então eu pretendo escrever uma série de artigos sobre o tema.

Sem mais delongas vamos começar a parte DIVERTIDA!

# Sumário

- Conceitos chaves e instalação dos pacotes
- Agentes de AI com PHP
- Ferramentas e Chamadas de funções
- Saida de dados estruturadas

# Conceitos chave e instalação

Basicamente o Neuron AI funciona com Agentes essa é uma das classes principais que utilizamos para criar um Agente de inteligencia artifical então após criar a sua classe e implmentar o seu agente é possiveo configurar ele e dar a ele uma "personalidade" e "funções" assim como damos um contexto quando criamos uma janela no chat GPT mas nesse caso é você que define e deixa isso chumbado no código, abrindo a possibilidade de podermos criar diversos agente para regras de negocio especificas.

Nesse caso será necessário ter o Ollama rodando no seu computador então para isso eu te convido a ler esse primeiro artigo de minha autoria, nesse artigo eu ensino como instalar e usar o ollama que é praticamente o mesmo processo para usarmos com o NeuronAI

Tutorial | Usando Deepseek no Visual Studio Code de graça 💸 (https://dev.to/razielrodrigues/usando-deepseek-no-visual-studio-code-de-graca-2764)

Após ter o ollama instalado será necessario rodar esse comando

``composer require inspector-apm/neuron-ai``

# Agente de AI

Vamos criar um Agente de AI que vai ajudar a gente a fazer umas piada sabe no estilo tiosao de churrasco, crie agora um arquivo chamado AgenteComediante.php dentro de uma pasta src e copie e cole o seguinte código:

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
                'Você usa a linguagem Português Brasileiro',
            ],
            output: [
                'A sua piada tem um texto bem divertido para dar contexto'
            ]
        );
    }

}

// Essa é a forma como chamamos o agente no codigo e depois exibimos a sua resposta
$response = AgenteComediante::make()->chat(
    new UserMessage("Olá, me conte uma piada!")
);

var_dump($response->getContent());

# Ferrametas ou Chamada de funções

Após o rodar o codigo será possivel ver o seu Agente de AI agindo como um tiosão e fazendo uma paida que pode ser boa ou ruim hahaha isso vai depender de muitas coisas mas principalmente do tanto de parametro que a sua AI tem, caso ela tenha mais parametros é possivel que a piada saia mais engraçada.

Mas para resolver essa limitação o Neuron Framework conta com uma feature muito boa que são as chamadas "Tools" ou também "Function Call" o que é basicamente uma forma de pegar dados de outro lugar ou respostas e adicionar a sua AI dando assim a ela mais "poderes" e possibilitando uma resposta mais inteligente e com um contexto maior então vamos adicionar um novo metodo na nossa classe, copie e cole essas linhas de codigo

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

e adicione isso no steps que é para garantir que vai usar a tool

            steps: [
                'Você usa a ferramenta disponivel',
                'Você usa a linguagem Português Brasileiro'
            ],

Crie um novo arquivo chamado BuscarPiada.php copie e cole e nao se esqueca de importar a nova classe dentro do Agente!

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



# Respostas estruturadas

Após adicionar as tools é possivel ver que realmente o nosso codigo já retorna algo bem interessante  pois pega o que vem da API em ingles traduz para portugues e depois gera a nossa piada, mas ainda podemos reparar que as respostas nao tem padrão, gerando assim uma string muito confusa e sem sentido, alem disso a gente ainda fica vendo os pensamentos da AI e isso nao é nada user friendly, para resolver isso o Neuron tem um conceito chamado resposta etruturadas que sao schemas e sao mapeadaos via classe então vamos implementar isso e deixar a resposta formatada e sempre legivel

crie um arquivo chamado Piada.php e copie e cole, não esqueça de importar a classe dentro do agente!

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


Adicione esse metodo dentro do agente


    protected function getOutputClass() : string
    {
        return Piada::class;
    }

e altere a resposta para

$piada = AgenteComediante::make()->structured(
    new UserMessage("Olá, me conte uma piada!")
);

echo 'Aqui esta a sua Piada :D' . PHP_EOL;
echo 'Tipo: '. $piada->tipo . PHP_EOL;
echo 'Introdução: '. $piada->setup . PHP_EOL;
echo 'Punchline: '. $piada->punchline . PHP_EOL;

# Conclusão

Esse é um exemplo do que pode ser feito com a AI nos proximos artigos vamos explorar o RAG e MCP server e para fechar com chave de ouro Chat e embeddings, com o Neuron AI vai ser possivel criamos aplicações totalmente funcionais com AI e tudo isso usando PHP seja com frameworks ou de forma pura fique ligado para os proximos artigos onde vamos nos aprofundar mais e mais e vamos criar uma AI cada vez mais funcional e com diversas funcionalidades incriveis.

Aqui esta o codigo do projeto e outros codigos que fiz sobre AI

https://github.com/RazielRodrigues/ai-projects

# Referencia

https://docs.neuron-ai.dev/
