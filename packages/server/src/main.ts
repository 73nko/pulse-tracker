import { utils } from '@pulse-tracker/utils';
import express from 'express'
import cors from 'cors';
import * as path from 'path';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: utils() });
});

app.post('/save-metric', (req, res) => {
  res.send({ message: 'Metric saved' });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
