// Create variable to hold db connection
let db;
// Establish a connection to the IndexedDB database we called pizza_hunt and set to version 1
const request = indexedDB.open('pizza_hunt', 1);

// This will emit if the database version changes (null to version 1, v1 to v2, etc.)
request.onupgradeneeded = function(event) {
    // create reference to db
    const db = event.target.result;
    // create object store called 'new_pizza', set to have auto incrementing primary key
    db.createObjectStore('new_pizza', { autoIncrement: true });
};

// upon a successful connection
request.onsuccess = function(event) {
    // when db is created with object store (see onupgradeneeded)
    db = event.target.result;

    // see if app is online
    if(navigator.onLine) {
        uploadPizza();
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
};

// function to save pizza if no internet connection exists
function saveRecord(record) {
    // open transaction with db with read/write permission
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access object store for 'new_pizza'
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // add record to store with add method
    pizzaObjectStore.add(record);
};

function uploadPizza() {
    // open a transaction to DB
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access your object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // get all records from store and set to a variable
    const getAll = pizzaObjectStore.getAll();

    // after successful get all run following:
    getAll.onsuccess = function() {
        // if there was data in indexedDB store, send to api server
        if (getAll.result.length >0 ) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverRes);
                }
                // open one more transaction
                const transaction = db.transaction(['new_pizza'], 'readwrite');
                // access new_pizza object store
                const pizzaObjectStore = transaction.objectStore('new_pizza');
                // clear all items in store
                pizzaObjectStore.clear();

                alert('All saved pizza has been submitted!');
            })
            .catch(err => {
                console.log(err);
            });
        }
    }

};

window.addEventListener('online', uploadPizza);