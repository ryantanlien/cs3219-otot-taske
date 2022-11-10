import express from 'express';
import cors from 'cors';
import { createServer } from "http";
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { readCreditCardsQuery, insertCreditCardsQuery, deleteCreditCardsQuery } from './creditcards/database.js'; 
import { cacheCreditCards, clearCreditCardsCache, getCreditCardsFromCache } from './creditcards/redis.js';
import { readdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename);

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) //config cors so that front-end can use
app.options('*', cors())

const httpServer = createServer(app);

//Configure public folder
var clientDir = path.join(__dirname, 'public');
app.use('/', express.static(clientDir));

//Send static HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

var isCached = false;

app.post('/creditcards', async function (req, res) {
    try {
      await insertCreditCardsQuery(req.body);
      res.status(200);
      res.send(req.body);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

app.get('/creditcards', async function (req, res) {
    if (!isCached) {
        const creditCards = await readCreditCardsQuery();
        if (creditCards == null) {
            res.status(404);
            res.send("Resource not found");
        } else {
            isCached = await cacheCreditCards(JSON.stringify(creditCards));
            res.status(200);
            res.send(creditCards);
        }
    } else {
        const creditCards = await getCreditCardsFromCache();
        if (creditCards == null) {
            res.status(404);
            res.send("Resource not found");
        } else {
            res.status(200);
            res.send(creditCards);
        }
    }
});

app.get('/creditcards/clearcache', async function (req, res) {
    var success = await clearCreditCardsCache();
    if (success) {
        res.send(200);
    } else {
        res.send(400);
    }
});

app.delete('/creditcards', async function (req, res) {
    try {
        await deleteCreditCardsQuery();
        res.send(200);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

//Start listening on port 3000
httpServer.listen(3000, () => {
    console.log('listening on *:3000');
});