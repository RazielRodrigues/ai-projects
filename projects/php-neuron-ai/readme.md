# Neuron AI

My studies about the framework

# How to output (different ways)

Streaming way (Não funciona com Ollama)
$stream = AgenteSmith::make()->stream(
    new UserMessage(
        'Resumo dos titulos de post para o username: razielrodrigues'
    )
);
foreach ($stream as $txt) {
    var_dump($txt);
}

Streaming way com RAG (Não funciona com Ollama)
$stream = AgenteSmith::make()->streamAnswer(
    new UserMessage(
        'Resumo dos titulos de post para o username: razielrodrigues'
    )
);
foreach ($stream as $txt) {
    var_dump($txt);
}

Streaming with Tools (Não funciona com Ollama)
$stream = AgenteSmith::make()->addTool(
    Tool::make(
        'calc_numbers',
        'Calc the numbers :P'
    )->addProperty(
        new ToolProperty(
            name: 'username',
            type: 'string',
            description: 'Summary posts titles',
            required: true
        )
    )->setCallable(
        fn () => 1 + 1
    )
    ->streamAnswer( new UserMessage('Hello') )
);