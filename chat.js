// const { OpenAI } = require("openai");
// const path = require("path");
// require("dotenv").config({ path: path.join(__dirname, '.env') });

// const openai = new OpenAI({
//   apiKey: "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", // coloque sua chave de API aqui ou via variável de ambiente
// });

// async function askLLM() {
//       const response = await openai.chat.completions.create({
//           model: "gpt-3.5-turbo", // ou "gpt-4o" se sua conta permitir
//           messages: [
//             { role: "user", content: "Qual a capital da França?" }
//           ],
//     });

//   console.log(response.choices[0].message.content);
// }

// askLLM();


const axios = require('axios');

async function askLlama() {
  const response = await axios.post('http://localhost:11434/api/generate', {
    model: 'llama3',
    prompt: 'Qual é a capital da França?',
    stream: false
  });

  console.log(response.data.response);
}

askLlama();

