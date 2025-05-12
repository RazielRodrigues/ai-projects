<?php

namespace src;

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use NeuronAI\Providers\Ollama\Ollama;
use NeuronAI\Chat\Messages\UserMessage;
use NeuronAI\Exceptions\NeuronException;
use NeuronAI\Providers\AIProviderInterface;
use NeuronAI\RAG\Embeddings\EmbeddingsProviderInterface;
use NeuronAI\RAG\Embeddings\VoyageEmbeddingsProvider;
use NeuronAI\RAG\RAG;
use NeuronAI\RAG\VectorStore\PineconeVectorStore;
use NeuronAI\RAG\VectorStore\VectorStoreInterface;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

class AgenteRAG extends RAG
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
        return 'You help with historical facts';
    }

    protected function embeddings(): EmbeddingsProviderInterface
    {
        return new VoyageEmbeddingsProvider(
            key: $_ENV['VOYAGE_KEY'],
            model: 'voyage-3'
        );
    }

    protected function vectorStore(): VectorStoreInterface
    {
        return new PineconeVectorStore(
            key: $_ENV['PINECONE_KEY'],
            indexUrl: 'https://dense-index-dwnj8jl.svc.aped-4627-b74a.pinecone.io',
        );
    }
}

try {
    $response = AgenteRAG::make()->answer(
        new UserMessage(
            'Famous historical structures and monuments'
        )
    );
    var_dump($response->getContent());
} catch (NeuronException $e) {
    echo $e->getTraceAsString();
}
