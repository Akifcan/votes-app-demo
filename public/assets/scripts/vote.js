document.addEventListener('DOMContentLoaded', _ => {

    const voteList = document.querySelector('.give-vote-list')

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

    async function getVotes() {
        const response = await fetch(`/vote/${getParameter()}`, {
            method: 'POST'
        })
        const data = await response.json()
        if (new Date().getTime() > parseInt(data.endDate)) {
            console.log('vote end')
        } else {
            document.getElementById('title').textContent = data.title
            document.getElementById('description').textContent = data.description
            data.votes.forEach(vote => {
                console.log(vote.fileType);
                const div = document.createElement('div')
                let file
                div.classList.add('vote')

                const nameTitle = document.createElement('h3')
                const descriptionTitle = document.createElement('p')
                nameTitle.textContent = vote.name
                descriptionTitle.textContent = vote.description

                const nameInput = document.createElement('p')
                const descriptionInput = document.createElement('p')
                const voteButton = document.createElement('button')
                voteButton.onclick = function () {

                }
                voteButton.textContent = 'Oy Ver'
                nameInput.className = 'name'
                descriptionInput.className = 'description'


                if (vote.fileType == 'png' || vote.fileType == 'jpg' || vote.fileType == 'jpeg' || vote.fileType == 'gif') {
                    file = document.createElement('img')
                }

                if (vote.fileType == 'wav' || vote.fileType == 'mp3' || vote.fileType == 'mpeg') {
                    file = document.createElement('audio')
                    file.setAttribute('controls', 'true')
                }

                if (vote.fileType == 'mp4') {
                    file = document.createElement('video')
                    file.setAttribute('controls', 'true')
                }
                console.log(window.origin + '/' + vote.file);
                file.src = window.origin + '/' + vote.file
                file.style.width = '250px'
                div.appendChild(nameTitle)
                div.appendChild(nameInput)
                div.appendChild(descriptionTitle)
                div.appendChild(descriptionInput)
                div.appendChild(file)
                div.appendChild(voteButton)

                voteList.appendChild(div)
            })
        }
    }
})