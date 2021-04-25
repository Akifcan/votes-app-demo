window.addEventListener('DOMContentLoaded', _ => {

    const form = document.getElementById('form')

    function setUserId() {
        if (!localStorage.token) {
            localStorage.token = Math.floor(Math.random() * 99999)
        }
    }

    setUserId()
    form.onsubmit = function (e) {
        e.preventDefault()
        const title = document.getElementById('title').value
        const description = document.getElementById('description').value
        const date = document.getElementById('date').value

        const voteDetails = { title, description, date }
        localStorage.voteDetails = JSON.stringify(voteDetails)
        window.location.href = '/create.html'
    }

})