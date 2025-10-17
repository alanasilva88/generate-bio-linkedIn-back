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
            model: process.env.OPENAI_MODEL,
            temperature: 0.5, // Menos criatividade, mais foco
            max_tokens: 150, // Limite a resposta a 150 tokens (ideal para 3 frases)
            messages: [{
                role: 'system',
                content: "Você é um especialista em escrita para LinkedIn. Sua tarefa é criar uma biografia profissional e impactante de no máximo 3 frases, usando o tom de voz do usuário."
            },
            {
                role: 'user',
                content: prompt
            },],
        });

        const bioGerada = chatCompletion.choices[0].message.content;
        res.json({ bio: bioGerada });
    } catch (error) {
        let statusCode = 500;
        let errorMessage = 'Falha ao gerar a bio. Tente novamente.';

        statusCode = error.status || error.response?.status || 500;

        // Tenta usar a mensagem específica da OpenAI
        if (error.message) {
            // Se houver uma mensagem da API (que é o caso do erro 403/429), use-a como fallback
            errorMessage = error.message;
        }

        // Verifica se é um erro da OpenAI com resposta HTTP
        if (statusCode === 401) {
            errorMessage = 'Erro de autenticação (API Key inválida).';
        } else if (statusCode === 403 || statusCode === 429) {
            errorMessage = 'Acesso negado ou Limite de Uso Atingido. Verifique seus créditos e faturamento na plataforma OpenAI.';
        }

        console.error(`Erro na API da OpenAI: ${statusCode} - ${error.message}`);
        res.status(statusCode).json({ error: errorMessage });

    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});