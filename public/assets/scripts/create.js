import { getElement, showNotification } from './utils.js'
const allowedTypes = ['image/png', 'image/jpg', 'image/gif', 'image/jpeg', 'audio/wav', 'audio/mp3', 'video/mp4', 'audio/mpeg', 'image/webp']

const getBase64 = (file) => new Promise(function (resolve, reject) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject('Error: ', error);
})

window.addEventListener('DOMContentLoaded', _ => {
    const create = document.getElementById('create')
    const showVotes = document.getElementById('showVotes')
    const createdVotes = document.getElementById('createdVotes')
    const name = document.getElementById('name')
    const description = document.getElementById('description')
    const file = document.getElementById('file')
    const share = document.getElementById('share')
    const voteList = document.getElementById('vote-list')
    const voteCreated = document.querySelector('.vote-created')
    const loader = document.querySelector('.loader')

    const files = []

    checkDetails()

    class Votes {

        constructor(name, description, file) {
            this.name = name
            this.description = description
            this.file = file
            this.fileType = file.type
        }

        createElement() {
            if (allowedTypes.includes(this.fileType)) {
                const fileUrl = URL.createObjectURL(this.file)

                const type = getElement(this.fileType)

                files.push({ file: this.file, type: type[1] })
                let file
                const div = document.createElement('div')
                div.classList.add('vote')

                const editButton = document.createElement('button')
                const deleteButton = document.createElement('button')
                editButton.classList.add('vote-action')
                deleteButton.classList.add('vote-action')
                editButton.title = 'Düzenle'
                deleteButton.title = 'Sil'
                editButton.innerHTML = `<i class="fa fa-pen"></i>`
                deleteButton.innerHTML = `<i class="fa fa-trash"></i>`

                div.appendChild(editButton)
                div.appendChild(deleteButton)

                deleteButton.addEventListener('click', _ => {
                    document.getElementById('vote-list').removeChild(div)
                    showNotification('Oylama listesinden kaldırıldı')
                })

                const nameTitle = document.createElement('h3')
                const descriptionTitle = document.createElement('h3')
                nameTitle.textContent = 'Başlık'
                descriptionTitle.textContent = 'Açıklama Metniniz'

                const nameInput = document.createElement('input')
                const descriptionInput = document.createElement('textarea')
                nameInput.className = 'name'
                descriptionInput.className = 'description'

                nameInput.value = this.name
                descriptionInput.value = this.description

                type[0].src = fileUrl
                div.appendChild(nameTitle)
                div.appendChild(nameInput)
                div.appendChild(descriptionTitle)
                div.appendChild(descriptionInput)
                div.appendChild(type[0])

                document.getElementById('vote-list').appendChild(div)
            } else {
                console.log('no');
            }

        }

    }

    showVotes.addEventListener('click', showVotesElement)

    create.addEventListener('submit', e => {
        e.preventDefault()
        const votes = new Votes(
            name.value,
            description.value,
            file.files[0]
        )
        votes.createElement()
    })

    voteList.addEventListener('submit', getVoteValues)

    function showVotesElement() {
        if (document.body.classList.contains('overflow-hidden')) {
            document.body.classList.remove('overflow-hidden')
            document.body.classList.add('overflow-scroll')
        } else {
            document.body.classList.add('overflow-hidden')
            document.body.classList.remove('overflow-scroll')
        }
        createdVotes.classList.toggle('active')
        showVotes.classList.toggle('active')
    }


    async function getVoteValues(e) {
        e.preventDefault()
        const votes = []
        const total = document.querySelectorAll('.vote-list .vote').length
        for (var i = 0; i < total; i++) {
            const name = document.querySelectorAll('.vote input')[i].value
            const description = document.querySelectorAll('.vote textarea')[i].value
            votes.push({ name, description, file: await getBase64(files[i].file), fileType: files[i].type })
        }
        const { title, description, date } = JSON.parse(localStorage.voteDetails)
        loader.classList.add('active')
        const result = await fetch('/create', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                title, description, date,
                votes: votes
            })
        })
        loader.classList.remove('active')
        const data = await result.json()
        if (result.status == 200) {
            copyLink(data.link)
        }
    }

    function checkDetails() {
        if (!localStorage.voteDetails || !localStorage.token) {
            window.location.href = '/create-details.html'
        }
    }

    function copyLink(slug) {
        voteCreated.classList.add('active')
        const link = document.querySelector('.link')
        link.textContent = 'http://localhost:3000/vote/' + slug
        link.addEventListener('click', _ => {
            navigator.clipboard.writeText(link.textContent)
                .then(copied => {
                    showNotification('Link kopyalanmıştır')
                })
        })
    }
})