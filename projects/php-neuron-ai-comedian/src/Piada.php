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