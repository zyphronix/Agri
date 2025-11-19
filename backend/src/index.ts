import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/env';
import { connectDB } from './config/db';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🌾 Crop Advisor API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      farms: '/api/farms',
      weather: '/api/weather',
      soil: '/api/soil',
      recommendations: '/api/recommendations',
      health: '/api/health',
    },
  });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT;

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════╗
║   🌾 Crop Advisor Backend Server          ║
║                                            ║
║   Environment: ${config.nodeEnv.padEnd(28)} ║
║   Port: ${PORT.padEnd(35)} ║
║   Database: Connected ✅                   ║
║                                            ║
║   API Docs: http://localhost:${PORT}/api    ║
╚════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
