<?php

namespace src;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/GetPosts.php';

use NeuronAI\Tools\Tool;
use NeuronAI\Tools\ToolProperty;
use src\GetPosts;

class ToolPosts extends Tool
{

    public function __construct()
    {
        parent::__construct(
            'get_posts',
            'Make posts summary'
        );

        $this->addProperty(
            new ToolProperty(
                name: 'username',
                type: 'string',
                description: 'Summary posts titles',
                required: true
            )
        )->setCallable(new GetPosts());
    }
}