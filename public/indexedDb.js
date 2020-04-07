const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

const request = indexedDB.open("budget", 1);
let db,
    tx,
    store

request.onupgradeneeded = function(e) {
  const db = request.result;
  db.createObjectStore(storeName, { keyPath: "_id" });

};

request.onsuccess = function(e) {
  db = request.result;

};

request.onerror = function(e) {
  console.log("There was an error: " + e.target.errorCode);
  console.log(e.target.errorCode);
};

function saveRecord(record) {

}

function checkDatabase() {

}

window.addEventListener("online", checkDatabase);
