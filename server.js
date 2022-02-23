const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const multer = require('multer')
const { spawn } = require('child_process')

const jsonParser = bodyParser.json()

const app = express()
const PORT = process.env.PORT || 5000

var pdfName = '';

//Setup storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public")
    },
    filename: function (req, file, cb) {
        pdfName = file.fieldname + '-' + Date.now() + '.pdf';
        cb(null, pdfName)
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype !== "application/pdf") {
            cb(new Error('incorrect file type'))
        } else {
            cb(null, true)
        }
    }
})

console.log( process.env.PATH );
const dailyFX = spawn('python', ['dailyfx.py'])
dailyFX.stdout.on('data', (data) => {
    console.log('line 34 ' + data)
})

dailyFX.stderr.on('data', (data) => {
    console.log('line 38 ' + data)
})

//Set up Multer
const upload = multer({ storage: storage })

//Set view engine
app.set('view engine', 'ejs')

//Middleware & static files
app.use(express.static('public'))

//Redirects
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' })
})

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' })
})

app.get('/fxupdate', (req, res) => {
    res.render('fxupdate', { title: 'Update FX Rates' })
})

app.post('/pdf', jsonParser, upload.single("myPDF"), (req, res) => {
    //console.log(JSON.stringify(req.body))
    //res.send('works great')
    //var data = JSON.stringify(req.body)
    //var arr = JSON.parse(data);
    //for (var i = 0; i < arr.length; i++) {
    //    var code = arr[i].Code;
    //    var currency = arr[i].Currency;
    //    var bid = arr[i].Bid;
    //    var ask = arr[i].Ask;
    //    console.log(code, currency, bid, ask)
    //}

    if (req.file) {
        console.log(pdfName)
        const dailyFX = spawn('python', ['dailyfx.py'])
        dailyFX.stdout.on('data', (data) => {
            console.log('line 71 ' + data)
            var datafrompy = JSON.stringify(data)
            var arr = JSON.parse(datafrompy);
            for (var i = 0; i < arr.length; i++) {
                var code = arr[i].Code;
                var currency = arr[i].Currency;
                var bid = arr[i].Bid;
                var ask = arr[i].Ask;
                console.log(code, currency, bid, ask)
            }
        })

        dailyFX.stderr.on('data', (data) => {
            console.log('line 84 ' + data)
        })

        res.status(200).send({
            ok: true,
            status: 'file uploaded'
        })
    } else {
        res.status(400).send({
            ok: false,
            error: 'something went wrong'
        })
    }

})

//Make sure this is at the bottom
app.use((req, res) => {
    res.status(404).render('404', { title: '404' })
})

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
})