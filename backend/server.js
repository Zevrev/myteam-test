import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { processTransactions } from './transactionProcessor.js'

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());

app.post('/process', (req, res) => {
    const inputData = req.body.data;
    const outputData = processTransactions(inputData);
    res.json(outputData);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
