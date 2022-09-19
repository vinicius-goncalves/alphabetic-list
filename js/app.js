import { addNewItemIntoDBStore } from './indexedDB-utils.js'

const addButton = document.querySelector('[data-input="add-button"]')
const valueToAdd = document.querySelector('[data-input="value-to-add"]')
const itemsList = document.querySelector('[data-list="items"]')

function addTerm(value) {

    addNewItemIntoDBStore(value).then((resolveResult) => {
        console.log(resolveResult)

    }, (rejectResult) => console.log(rejectResult))

    const castValue = String(value)

    const li = document.createElement('li')
    li.textContent = `${castValue}`
    itemsList.append(li)

}

addButton.addEventListener('click', () => {

    const { value } = valueToAdd
    if(value === '') {
        return
    }

    addTerm(value)
    
})