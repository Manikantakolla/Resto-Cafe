const connectToMongoDB = require('./db');

const startServer = async () => {
  try {
    const { foodData, foodCategory } = await connectToMongoDB();
    global.foodData = foodData;
    global.foodCategory = foodCategory;

    const express = require('express');
    const app = express();
    const port = 3000;

    app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });

    app.use(express.json());

    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    app.use('/api/auth', require('./Routes/Auth'));

    app.listen(port, () => {
      console.log(`Example app listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    
  }
};

startServer();
