const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27017/calculator_db';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create Calculation model
const CalculationSchema = new mongoose.Schema({
  operation: String,
  operands: [Number],
  result: Number,
  createdAt: { type: Date, default: Date.now },
});
const Calculation = mongoose.model('Calculation', CalculationSchema);

app.use(bodyParser.json());

// Add calculation to the database
app.post('/add', async (req, res) => {
  try {
    const { operands } = req.body;
    if (!Array.isArray(operands) || operands.length < 2) {
      return res.status(400).json({ error: 'Invalid operands' });
    }

    const result = operands.reduce((acc, val) => acc + val, 0);
    const calculation = await Calculation.create({
      operation: 'add',
      operands,
      result,
    });

    return res.status(201).json(calculation);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Subtract calculation from the database
app.post('/subtract', async (req, res) => {
  try {
    const { operands } = req.body;
    if (!Array.isArray(operands) || operands.length < 2) {
      return res.status(400).json({ error: 'Invalid operands' });
    }

    const result = operands.reduce((acc, val) => acc - val);
    const calculation = await Calculation.create({
      operation: 'subtract',
      operands,
      result,
    });

    return res.status(201).json(calculation);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Multiply calculation and store in the database
app.post('/multiply', async (req, res) => {
  try {
    const { operands } = req.body;
    if (!Array.isArray(operands) || operands.length < 2) {
      return res.status(400).json({ error: 'Invalid operands' });
    }

    const result = operands.reduce((acc, val) => acc * val, 1);
    const calculation = await Calculation.create({
      operation: 'multiply',
      operands,
      result,
    });

    return res.status(201).json(calculation);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Divide calculation and store in the database
app.post('/divide', async (req, res) => {
  try {
    const { operands } = req.body;
    if (!Array.isArray(operands) || operands.length !== 2) {
      return res.status(400).json({ error: 'Invalid operands' });
    }

    const [a, b] = operands;
    if (b === 0) {
      return res.status(400).json({ error: 'Division by zero is not allowed' });
    }

    const result = a / b;
    const calculation = await Calculation.create({
      operation: 'divide',
      operands,
      result,
    });

    return res.status(201).json(calculation);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Exponent calculation and store in the database
app.post('/exponent', async (req, res) => {
  try {
    const { operands } = req.body;
    if (!Array.isArray(operands) || operands.length !== 2) {
      return res.status(400).json({ error: 'Invalid operands' });
    }

    const [base, exponent] = operands;
    const result = Math.pow(base, exponent);
    const calculation = await Calculation.create({
      operation: 'exponent',
      operands,
      result,
    });

    return res.status(201).json(calculation);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all previous calculations from the database
app.get('/calculations', async (req, res) => {
  try {
    const calculations = await Calculation.find().sort({ createdAt: -1 });
    return res.status(200).json(calculations);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
