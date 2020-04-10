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
  db.createObjectStore("pending", { autoIncrement: true });

};

request.onsuccess = function(e) {
  db = request.result;
  if (navigator.onLine) { 
    checkDatabase();
  }
};

request.onerror = function(e) {
  console.log("There was an error: " + e.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    console.log("store.add(record) ", record);
    store.add(record);
}

function checkDatabase() {
  console.log("checkDatabase() called");    
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");
  const getAll = store.getAll();

  getAll.onsuccess = function () {
      if (getAll.result.length > 0) {
          waitingIcon.setAttribute("class", "spinner-border text-primary");
          fetch("/api/transaction/bulk", {
            method: "POST",
            body: JSON.stringify(getAll.result),
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json"
            }
          })
          .then(response => response.json())
          .then(() => {
            const transaction = db.transaction(["pending"], "readwrite");
            const store = transaction.objectStore("pending");
    
            store.clear();
          })
          .finally(()=>{
            waitingIcon.removeAttribute("class")
          });
        }
  };
}

window.addEventListener("online", checkDatabase);
