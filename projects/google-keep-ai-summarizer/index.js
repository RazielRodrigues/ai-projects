const express = require('express');
const cors = require('cors');
const path = require('path');
const { pipeline } = require('@xenova/transformers');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend (assumindo que estão na pasta 'public')
app.use(express.static(path.join(__dirname, 'public')));

// Mock Google Keep Notes
const mockNotes = [
    {
        id: '1',
        title: 'Projeto de Desenvolvimento',
        content: 'Iniciar desenvolvimento do novo sistema. Precisamos definir os requisitos principais e criar um cronograma de implementação.'
    },
    {
        id: '2',
        title: 'Reunião de Equipe',
        content: 'Preparar apresentação para reunião semanal. Discutir progresso dos projetos atuais e definir metas para próxima semana.'
    },
    {
        id: '3',
        title: 'Estudo de Novas Tecnologias',
        content: 'Pesquisar sobre inteligência artificial generativa, machine learning e seus impactos no desenvolvimento de software.'
    }
];

// Rota para servir o index.html como página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para notas mockadas
app.get('/mock-google-notes', (req, res) => {
    res.json(mockNotes);
});

// Rota de sumarização usando facebook/bart-large-cnn
app.post('/summarize', async (req, res) => {
    try {
        const { notes } = req.body;
        const allNoteContents = notes.map(note => `${note.title}: ${note.content}`).join('\n\n');

        const summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-12-6');
        const summary = await summarizer(allNoteContents, {
            max_length: 150,
            min_length: 50,
            do_sample: false
        });

        res.json({
            summary: summary[0].summary_text
        });
    } catch (error) {
        console.error('Erro na sumarização:', error);
        res.status(500).json({
            error: 'Falha ao gerar resumo'
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});

// Exportar para possível uso em testes
module.exports = app;