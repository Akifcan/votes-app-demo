import { getElement, showNotification } from './utils.js'
document.addEventListener('DOMContentLoaded', _ => {

    const voteList = document.querySelector('.give-vote-list')
    const loader = document.querySelector('.loader')
    const table = document.querySelector('table tbody')
    console.log(loader);
    getVotes()

    document.getElementById('showVotes').onclick = function () {
        voteList.classList.add('active')
        document.querySelector('.container').style.display = 'none'
    }


    function cookieToJson() {
        const cookieData = {}
        const parse = document.cookie.split(';')
        parse.forEach(item => {
            const splittedItem = item.trim().split('=')
            cookieData[splittedItem[0]] = splittedItem[1]
        })
        return cookieData
    }

    function getParameter() {
        return cookieToJson().slug
    }

    function sortByVote(data) {
        const votes = data.votes.map(item => item).sort((a, b) => {
            if (a.totalVote > b.totalVote) {
                return false
            } else {
                return true
            }
        })
        table.innerHTML = votes.map(vote => {
            return `
                    <tr>
                        <td>${vote.name}</td>
                        <td>${vote.totalVote}</td>
                    </tr>
            `
        }).join('')
    }

    async function giveVote(slug, name, element) {
        const response = await fetch(`/give-vote/${slug}`, {
            method: 'GET',
            headers: { 'name': name }
        })
        const data = await response.json()
        console.log(data);
        if (response.status == 200) {
            showNotification(data.message)
            if (data?.totalVote) {
                element.textContent = `Toplam Oy: ${data.totalVote} 🗳 📌`
            }
        }
    }

    async function getVotes() {
        loader.classList.add('active')
        const response = await fetch(`/vote/${getParameter()}`, {
            method: 'POST'
        })
        const data = await response.json()
        sortByVote(data)
        if (new Date().getTime() > parseInt(data.endDate)) {
            document.getElementById('showVotes').innerText = 'Sonuçları Görüntüle'
        } else {
            document.getElementById('title').textContent = data.title
            document.getElementById('description').textContent = data.description
            data.votes.forEach(vote => {
                const div = document.createElement('div')
                const type = getElement(vote.fileType)
                div.classList.add('vote')

                const nameTitle = document.createElement('h3')
                const totalVote = document.createElement('h4')
                const descriptionTitle = document.createElement('p')
                nameTitle.textContent = vote.name
                descriptionTitle.textContent = vote.description
                totalVote.textContent = `Toplam oy: ${vote.totalVote} 🗳`

                const nameInput = document.createElement('p')
                const descriptionInput = document.createElement('p')
                const voteButton = document.createElement('button')
                voteButton.onclick = function () {
                    const newVote = vote.totalVote++
                    giveVote(data.slug, vote.name, totalVote)
                }
                voteButton.textContent = 'Oy Ver'
                nameInput.className = 'name'
                descriptionInput.className = 'description'

                console.log(window.origin + '/' + vote.file);
                type[0].src = window.origin + '/' + vote.file
                type[0].style.width = '250px'
                div.appendChild(nameTitle)
                div.appendChild(nameInput)
                div.appendChild(descriptionTitle)
                div.appendChild(descriptionInput)
                div.appendChild(totalVote)
                div.appendChild(type[0])
                div.appendChild(voteButton)

                voteList.appendChild(div)
            })
            loader.classList.remove('active')
        }
    }
})