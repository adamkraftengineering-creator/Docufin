import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { sequelize } from './config/database';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

async function startServer() {
  try {
    
    await sequelize.authenticate();
    console.log('PostgreSQL connected via Sequelize successfully.');

    await sequelize.sync();

    app.listen(env.PORT, () => {
      console.log(`Backend service running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to database:', error);
  }
}

startServer();