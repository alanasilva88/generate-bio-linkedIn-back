const express = require('express');
const OpenAI = require('openai');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post('/generate-bio', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'O prompt é obrigatório' });
    }

    try {
        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
        });

        const bioGerada = chatCompletion.choices[0].message.content;
        res.json({ bio: bioGerada });
    } catch (error) {
        console.error('Erro ao chamar a API da OpenAI: ', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Falha ao gerar a bio. Tente novamente' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});