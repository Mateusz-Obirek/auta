const express = require('express')
const path = require('path')
const Datastore = require('nedb')
const hbs = require('express-handlebars')

const app = express()
const PORT = process.env.PORT || 3000

const coll1 = new Datastore({
    filename: 'kolekcja.db',
    autoload: true
})

app.set('views', path.join(__dirname, 'views'))
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }))
app.set('view engine', 'hbs');
app.use(express.static('static'))

let context = {}

app.listen(PORT, () => {
    console.log(`listening at port: ${PORT}`)
})

app.get("/", function (req, res) {
    coll1.find({}, (err, docs) => {
        console.log(docs)
        context = { docsy: docs}
        res.render('index.hbs', context)
    })
})

app.get('/handle', (req, res) => {

    let obj = {
        a: req.query.ch1 == 'on' ? 'TAK' : 'NIE',
        b: req.query.ch2 == 'on' ? 'TAK' : 'NIE',
        c: req.query.ch3 == 'on' ? 'TAK' : 'NIE',
        d: req.query.ch4 == 'on' ? 'TAK' : 'NIE',
        edit: false
    }

    coll1.insert(obj, (err, docs) => {
        coll1.find({}, (err, docs) => {
            context = { docsy: docs}
            res.redirect('/')
    })
})
})

app.get("/delete", function (req, res) {
    coll1.remove({ _id: req.query.s }, {}, function (err, numRemoved) {
        coll1.find({}, (err, docs) => {
            console.log(docs)
            context = { docsy: docs}
            res.redirect('/')
        })
    })
})

app.get("/edit", function (req, res) {
    coll1.find({}, (err, docs) => {
        for(let doc of docs){
            if(doc._id == req.query.s){
                doc.edit = true
                break
            }
        }
        context = { docsy: docs}
        res.redirect('/')
    })
})

app.get("/cancel", function (req, res) {
    coll1.find({}, (err, docs) => {
        for(let doc of docs){
            if(doc._id == req.query.s){
                doc.edit = false
                break
            }
        }
        context = { docsy: docs}
        res.redirect('/')
    })
})

app.get("/update", function (req, res) {
    console.log(req.query.s)
    coll1.update({ _id: req.query.s }, { $set: {a:req.query.a, b:req.query.b, c:req.query.c, d:req.query.d, edit:false} }, {}, function (err, numUpdated) {
        coll1.find({}, (err, docs) => {
            context = { docsy: docs}
            res.redirect('/')
        })
     })
})