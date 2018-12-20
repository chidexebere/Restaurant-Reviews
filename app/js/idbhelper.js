/* eslint-disable indent */
import idb from 'idb';

const dbPromise = idb.open('restaurant-db', 3, upgradeDB => {
    switch (upgradeDB.oldVersion) {
        case 0:
            upgradeDB.createObjectStore('restaurants', { keyPath: 'id', unique: true });
        case 1:
            const reviewStore = upgradeDB.createObjectStore('reviews', { autoIncrement: true });
            reviewStore.createIndex('restaurant_id', 'restaurant_id');
        case 2:
            upgradeDB.createObjectStore('offline', { autoIncrement: true });
    }
});
self.dbPromise = dbPromise;


// IndexedDB object with get, set, getAll, & getAllIdx methods
// https://github.com/jakearchibald/idb

const idbKeyVal = {
    get(store, key) {
        return dbPromise.then(db => {
            return db
                .transaction(store)
                .objectStore(store)
                .get(key);
        });
    },
    getAll(store) {
        return dbPromise.then(db => {
            return db
                .transaction(store)
                .objectStore(store)
                .getAll();
        });
    },
    getAllIdx(store, idx, key) {
        return dbPromise.then(db => {
            return db
                .transaction(store)
                .objectStore(store)
                .index(idx)
                .getAll(key);
        });
    },
    set(store, val) {
        return dbPromise.then(db => {
            const tx = db.transaction(store, 'readwrite');
            tx.objectStore(store).put(val);
            return tx.complete;
        });
    },
    setReturnId(store, val) {
        return dbPromise.then(db => {
            const tx = db.transaction(store, 'readwrite');
            const pk = tx
                .objectStore(store)
                .put(val);
            tx.complete;
            return pk;
        });
    },
    delete(store, key) {
        return dbPromise.then(db => {
            const tx = db.transaction(store, 'readwrite');
            tx.objectStore(store).delete(key);
            return tx.complete;
        });
    },
    openCursor(store) {
        return dbPromise.then(db => {
            return db.transaction(store, 'readwrite')
                .objectStore(store)
                .openCursor();
        });
    }
};
self.idbKeyVal = idbKeyVal;


// Get the Offline modal
const offModal = document.getElementById('myModal');
const span = document.getElementsByClassName('close')[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    offModal.style.display = 'none';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == offModal) {
        offModal.style.display = 'none';
    }
};

const showOffline = () => {
    offModal.style.display = 'block';
};

self.showOffline = showOffline;


