import { addNewItemIntoDBStore, getAllByIndex, getByID } from './indexedDB-utils.js'
import { createItem } from './utils.js'

const addButton = document.querySelector('[data-input="add-button"]')
const randomButton = document.querySelector('[data-input="random-button"]')
const sortButton = document.querySelector('[data-input="sort-button"]')

const valueToAdd = document.querySelector('[data-input="value-to-add"]')
const itemsList = document.querySelector('[data-list="items"]')

window.addEventListener('load', () => {
    getAllByIndex('initialLetterIndex', (items) => {

        const itemsToLi = items.map(item => {
            const { id, initialLetter, value } = item
            const li = createItem(`${id} - ${value} - ${initialLetter}`, id)
            return li
        })
        itemsToLi.forEach(li => itemsList.append(li))
    })
})

randomButton.addEventListener('click', () => {
    let items = [...itemsList.children].map(item => item)
    for(let i = items.length - 1; i >= 0; i--) {
        const randomPosition = Math.floor(Math.random() * (items.length - 1))
        let savedItem = items[i]
        items[i] = items[randomPosition]
        items[randomPosition] = savedItem
    }
    
    items.forEach(item => itemsList.append(item))
})

function sortItem (items) {

    let newArray = [...items]

    for(let i = 0; i < newArray.length; i++) {
        for(let j = 0; j < newArray.length; j++) {
            if(newArray[i].textContent.split('-')[2] < newArray[j].textContent.split('-')[2]) {
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
            }
        }
    }
    return newArray
}

sortButton.addEventListener('click', () => {
    
    const itemsListToArray = Array.from(itemsList.children)
    const itemsSorted = sortItem(itemsListToArray)

    itemsSorted.forEach(item => itemsList.append(item))
    
})

async function addTerm(value) {

    const castValue = String(value)

    const result = await addNewItemIntoDBStore(castValue)
    getByID(result.id, (termAdded) => {

        const { id, initialLetter } = termAdded

        const itemFound = document.querySelector(`[data-item-id="${id}"]`)
        if(!itemFound) {
            
            const liCreated = createItem(`${id} - ${castValue} - ${initialLetter}`, id)
            itemsList.append(liCreated)

            sortTerms()
            
        }
    })
}

addButton.addEventListener('click', () => {

    const { value } = valueToAdd
    if(value === '') {
        return
    }

    addTerm(value)
    
})

document.addEventListener('keyup', (event) => {

    const key = event.key
    let { value } = valueToAdd
    
    if(value === '') {
        return
    }

    if(key === 'Enter') {
        addTerm(value)
        valueToAdd.value = ''
    }
})