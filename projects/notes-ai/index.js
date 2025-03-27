// src/index.ts
import express from 'express';
import cors from 'cors';
import { pipeline } from '@xenova/transformers';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


// Summarization route
app.post('/summarize', async (req, res) => {
    try {
        const { notes } = req.body;

        // Combine all note contents
        const allNoteContents = notes.map(note =>
            `${note.title}: ${note.content}`
        ).join('\n\n');

        // Load summarization pipeline
        const summarizer = await pipeline(
            'summarization',
            'Xenova/distilbart-cnn-12-6'
        );

        // Generate summary
        const summary = await summarizer(allNoteContents, {
            max_length: 300,
            min_length: 100,
            do_sample: false
        });

        res.json({
            summary: summary[0].summary_text
        });
    } catch (error) {
        console.error('Summarization error:', error);
        res.status(500).json({
            error: 'Failed to generate summary'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});