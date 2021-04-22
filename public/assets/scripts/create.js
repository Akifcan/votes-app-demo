const allowedTypes = ['image/png', 'image/jpg', 'image/gif', 'image/jpeg', 'audio/wav', 'audio/mp3', 'video/mp4', 'audio/mpeg']

window.addEventListener('DOMContentLoaded', _ => {
    const create = document.getElementById('create')
    const showVotes = document.getElementById('showVotes')
    const createdVotes = document.getElementById('createdVotes')
    const name = document.getElementById('name')
    const description = document.getElementById('description')
    const file = document.getElementById('file')

    class Votes {

        constructor(name, description, file) {
            this.name = name
            this.description = description
            this.file = file
            this.fileType = file.type
            console.log(this.file);
        }

        createElement() {
            if (allowedTypes.includes(this.fileType)) {
                const fileUrl = URL.createObjectURL(this.file)
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

                const nameTitle = document.createElement('h3')
                const descriptionTitle = document.createElement('h3')
                nameTitle.textContent = 'Başlık'
                descriptionTitle.textContent = 'Açıklama Metniniz'

                const nameInput = document.createElement('input')
                const descriptionInput = document.createElement('textarea')
                nameInput.value = this.name
                descriptionInput.value = this.description

                if (this.fileType == 'image/png' || this.fileType == 'image/jpg' || this.fileType == 'image/jpeg' || this.fileType == 'image/gif') {
                    file = document.createElement('img')
                }

                if (this.fileType == 'audio/wav' || this.fileType == 'audio/mp3' || this.fileType == 'audio/mpeg') {
                    file = document.createElement('audio')
                    file.setAttribute('controls', 'true')
                }

                if (this.fileType == 'video/mp4') {
                    file = document.createElement('video')
                    file.setAttribute('controls', 'true')
                }

                file.src = fileUrl
                div.appendChild(nameTitle)
                div.appendChild(nameInput)
                div.appendChild(descriptionTitle)
                div.appendChild(descriptionInput)
                div.appendChild(file)

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
})