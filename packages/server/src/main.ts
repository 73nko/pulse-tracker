import { chains } from './chains';
import express from 'express';
import cors from 'cors';
import * as path from 'path';

const app = express();

app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/save-metric', async (req, res) => {
  const { name, ...metric } = req.body;

  try {
    console.log('save-metric', name, metric);

    const result = await chains[name]?.({ metric });
    if (!result) throw new Error('Metric not allowed');

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/save-metric', (req, res) => {
  res.send({ message: 'Metric saved' });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
