export {
    randomID,
    randomUUID,
    createItem
}

function randomID() {

    const currentTime = Date.now() % 16
    const firstRandom = Math.round(Math.random() * Number.MAX_SAFE_INTEGER)
    const secondRandom = Math.round(firstRandom * currentTime)

    return ''.concat(firstRandom.toString().slice(0, 5), '-', secondRandom.toString(36)).trim()
    
}

function randomUUID() {
    let dateTime = Date.now() * Number.MAX_SAFE_INTEGER
    const uuid = 'xxxxxxxx-xxxxx-4xxxx-yxxx'.replace(/[xy]/g, (char) => {
        dateTime = dateTime / 16
        const random = Math.floor(Math.random() * 16) % 16 | 0
        return (char !== 'x' ? random & 0x3 | 0x8 : random).toString(16)
    })
    return uuid
}

function createItem(textContent, itemId) {
    const li = document.createElement('li')
    li.textContent = textContent
    li.dataset.itemId = itemId
    return li
}