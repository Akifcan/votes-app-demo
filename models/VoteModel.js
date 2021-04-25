const mongoose = require('mongoose')

const VoteModel = mongoose.Schema({
    title: String,
    slug: {
        type: String,
        unique: true
    },
    endDate: String,
    description: String,
    votes: []
})

module.exports = mongoose.model('votes', VoteModel)