const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const multer = require('multer')
const { spawn } = require('child_process')
const path = './pdfs/'

const jsonParser = bodyParser.json()

const app = express()
const PORT = process.env.PORT || 5000

var pdfName = '';

//Setup storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "pdfs")
    },
    filename: function (req, file, cb) {
        pdfName = Date.now() + '.pdf';
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

    if (req.file) {
        console.log('line 68: ' + pdfName)
        const dailyFX = spawn('python', ['dailyfx.py', pdfName])
        dailyFX.stdout.on('data', (data) => {

            var arr = JSON.parse(data);
            res.status(200).send({
                data: arr
            })
        })

        dailyFX.stderr.on('data', (data) => {
            console.log('line 68: ' + data)

            try {
                fs.unlinkSync(path + pdfName)
                res.status(400).send({
                    ok: false,
                    error: 'something went wrong'
                })
            } catch (err) {
                console.error(err)
                //Admin needs to be notified to remove the file manually
                res.status(400).send({
                    ok: false,
                    error: 'something went wrong'
                })
            }
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