require('dotenv').config();
const OpenAI = require('openai');

console.log('🔑 API Key (primeiros 20 chars):', process.env.OPENAI_API_KEY ? 
    process.env.OPENAI_API_KEY.substring(0, 20) + '...' : 
    '❌ NÃO ENCONTRADA');

console.log('📝 Modelo configurado:', process.env.OPENAI_MODEL || 'Nenhum');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function testModels() {
    const modelsToTest = [
        'gpt-4o',
        'gpt-4o-2024-08-06',
        'gpt-4-turbo',
        'gpt-4',
        'gpt-3.5-turbo',
        'gpt-4.1',
        'gpt-5-mini'
    ];
    
    console.log('\n⏳ Testando modelos...\n');
    
    for (const model of modelsToTest) {
        try {
            const response = await openai.chat.completions.create({
                model: model,
                messages: [{ role: 'user', content: 'Hi' }],
                max_tokens: 5
            });
            
            console.log(`✅ ${model.padEnd(25)} → FUNCIONA!`);
            
        } catch (error) {
            const status = error.status || 'N/A';
            const msg = error.message.substring(0, 50);
            console.log(`❌ ${model.padEnd(25)} → Erro ${status}: ${msg}...`);
        }
    }
    
    console.log('\n✨ Teste concluído!\n');
}

testModels();