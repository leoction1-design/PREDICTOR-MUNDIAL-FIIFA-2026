import express from 'express';
import { GoogleGenerativeAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

app.post('/api/analyze', async (req, res) => {
  try {
    const { teamA, teamB, match } = req.body;
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
      return res.json({ analysis: "Configura tu API Key en .env.local para ver el análisis real." });
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Actúa como un experto analista táctico de la FIFA. Analiza el partido del Mundial 2026: ${teamA.name} vs ${teamB.name} (Rank FIFA #${teamA.rank} vs #${teamB.rank}) en el estadio ${match.stadium}. Proporciona un análisis táctico breve, profesional y emocionante en español.`;
    const result = await model.generateContent(prompt);
    res.json({ analysis: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

app.listen(port, () => console.log(`Servidor de IA activo en puerto ${port}`));
