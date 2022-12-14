import { randomID } from './utils.js'

const DB_STORE_NAME = 'alphabetic-list'
const DB_VERSION = 1

const db = indexedDB.open(DB_STORE_NAME, DB_VERSION)

const dbPromise = new Promise(resolve => {
  
    db.addEventListener('success', (event) => {
        resolve(event.target.result)
    })

    db.addEventListener('upgradeneeded', (event) => {
        
        const dbUpgradeNeeded = event.target.result
        const { objectStoreNames } = dbUpgradeNeeded
        if(!objectStoreNames.contains('items')) {
            const store = dbUpgradeNeeded.createObjectStore('items', { keyPath: 'id' })
            store.createIndex('initialLetterIndex', 'initialLetter', { unique: false })
            store.createIndex('valueIndex', 'value', { unique: false })
        }
    })
})

async function makeTransaction(objectStore, transactionType = 'readonly') {
    const db = await dbPromise
    const transaction = db.transaction(objectStore, transactionType)
    const store = transaction.objectStore(objectStore)
    return store

}

export function getAllByIndex(idx, callback) {

    makeTransaction('items').then(store => {
        const index = store.index(idx)
        const query = index.getAll()
        query.addEventListener('success', (event) => {
            const result = event.target.result
            callback(result)
        })
    })
}

export function getByID(id, callback) {
    makeTransaction('items').then(store => {
        const query = store.get(id)
        query.addEventListener('success', (event) => {
            callback(event.target.result)
        })
    })
}

export function addNewItemIntoDBStore(itemToAdd) {
    
    try {

        const promise = new Promise((resolve, reject) => {
            makeTransaction('items', 'readwrite').then(store => {

                const query = store.add({
                    id: randomID(),
                    initialLetter: String(itemToAdd.charAt(0).toUpperCase()),
                    value: itemToAdd
                })
    
                query.addEventListener('success', (event) => {
                    const { result } = event.target
                    resolve({ type: 'success', message: 'Added', added: true, id: result })
                })
                query.addEventListener('error', () => {
                    reject({ type: 'error', message: 'Not added', added: false })
                })
            })
        })

        return promise

    } catch (error) {
        console.warn(error)
    }
}