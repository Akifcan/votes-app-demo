export const getElement = (fileType) => {
    let file
    let elementName
    if (fileType.startsWith('image/') || fileType.startsWith('img')) {
        file = document.createElement('img')
        elementName = 'img'
    }

    if (fileType.startsWith('audio/') || fileType.startsWith('audio')) {
        file = document.createElement('audio')
        elementName = 'audio'
        file.setAttribute('controls', 'true')
    }

    if (fileType.startsWith('video/') || fileType.startsWith('video')) {
        file = document.createElement('video')
        elementName = 'video'
        file.setAttribute('controls', 'true')
    }
    return [file, elementName]
}

export const showNotification = (text) => {
    const div = document.createElement('div')
    div.innerHTML = `<div class="notification">${text}</div>`
    document.querySelector('.notification-container').appendChild(div)

    setTimeout(() => {
        document.querySelector('.notification-container').removeChild(div)
    }, 3000)

}