import express from 'express';
import hbs from 'hbs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';


// Recreate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});
app.set('view engine', 'hbs');

app.use((req, res, next) => {
    const now = new Date();
    const log = `${now.toISOString()} ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    })
    next();
})
app.use((req, res, next) => {
    res.render('maintenance.hbs');
})
// Serve static files from ./public
app.use(express.static(__dirname + '/public'));

const port = 3000;

app.get('/', (req, res) => {
    // res.send({
    //     name: 'Vovo',
    //     likes: [
    //         'Biking',
    //         'Coding'
    //     ]
    // });
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my website',
        currentYear: new Date().getFullYear()
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
        currentYear: new Date().getFullYear()
    });
});

app.get('/bad', (req, res) => {
    res.send({
        error: 'Unable to handle request'
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
