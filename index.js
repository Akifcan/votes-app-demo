const express = require('express')
const fs = require('fs')
const mongoose = require('mongoose')
const VoteModel = require('./models/VoteModel')
const slug = require('slug')
require('dotenv').config()

const app = express()

const PORT = process.env.PORT || 3000
app.use(express.static('public'))
app.use(express.json({ limit: '50mb' }))
app.get('/', (req, res) => res.sendFile(__dirname + '/public/create-details.html'))

app.get('/vote/:slug', (req, res) => {
    const { slug } = req.params
    res.cookie('slug', slug)
    res.sendFile(__dirname + '/public/vote.html')
})

app.post('/create', async (req, res) => {
    const votes = []
    const { title, description, date } = req.body
    req.body.votes.forEach((item) => {
        console.log(item.name + ' ' + item.file.substring(0, 100));
        const reg = new RegExp(';base64,')
        console.log(item.file.split(reg).pop().substring(0, 100));
        const fileName = `files/${Date.now()}.${item.fileType}`
        fs.writeFileSync(`public/${fileName}`, item.file.split(reg).pop(), 'base64', function (err) {
            console.log(err);
        })
        votes.push({ fileType: item.fileType, totalVote: 0, file: fileName, name: item.name, description: item.description })
    })
    const create = await VoteModel.create({
        title, description, endDate: Date.parse(date).toString(), givenBy: [],
        slug: slug(title + Math.floor(Math.random() * 9999).toString() + ' oylamasi'),
        votes
    })
    console.log(create);
    res.status(200).json({ message: 'Oylamanız oluşturulmuştur', link: create.slug })
})

app.get('/give-vote/:slug', async (req, res) => {
    try {
        const { slug } = req.params
        const { name: voteName } = req.headers
        console.log(req.socket.remoteAddress);
        const vote = await VoteModel.findOne({ slug, givenBy: { $nin: [req.socket.remoteAddress] } })
        if (vote) {
            const currentVote = vote.votes.find(vote => vote.name == voteName)
            currentVote.totalVote++
            vote.markModified('votes')
            vote.givenBy.push(req.socket.remoteAddress)
            await vote.save()
            res.status(200).json({ message: 'Oyununuz kayıt edilmiştir. Teşekkürler 🗳🗳', totalVote: currentVote.totalVote })
        } else {
            res.status(200).json({ message: 'Zaten oy kullandınız' })
        }
    } catch (e) {
        res.status(500).json({ message: 'Beklenmedik bir hata oluştu lütfen tekrar dener misiniz?' })
    }
})

app.post('/vote/:slug', async (req, res) => {
    const vote = await VoteModel.findOne({ slug: req.params.slug })
    if (vote) {
        res.status(200).json(vote)
    } else {
        res.status(404).json({ message: 'Bu oylamayı bulamadık' })
    }
})





mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(connected => {
        app.listen(PORT, _ => console.log(`Working on ${PORT}`))
    })