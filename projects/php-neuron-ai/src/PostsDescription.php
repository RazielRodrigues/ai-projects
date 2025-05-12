<?php

namespace src;

require_once __DIR__ . '/../vendor/autoload.php';

use NeuronAI\StructuredOutput\SchemaProperty;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Valid;

# Para usar como classe aninhada
class PostsTitles
{
    #[SchemaProperty(description: 'Posts title', required: true)]
    public string $titles;
}

class PostsDescription
{

    #[SchemaProperty(description: 'The username', required: true)]
    #[NotBlank()] # usa as validacoes do symfony
    public string $username;

    #[SchemaProperty(description: 'Summary of user posts', required: true)]
    public string $summary;

    #[SchemaProperty(description: 'All posts title', required: true)]
    #[Valid()] # obrigatorio quando quer usar uma classe aninhada
    public PostsTitles $postsTitles;
}