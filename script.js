const logBody = document.getElementById('log-body');
const rfidContainer = document.getElementById('rfid-container');

/* ---------------------------------------------
   FETCH WITH OFFLINE SUPPORT (IMPROVED VERSION)
   --------------------------------------------- */
async function fetchWithOffline(url, storageKey) {
  try {
    const response = await fetch(url + '?cacheBust=' + Date.now(), {
      cache: "no-store"
    });
    if (!response.ok) throw new Error('Network response not OK');

    const data = await response.json();

    // Save fresh copy to offline cache
    localStorage.setItem(storageKey, JSON.stringify(data)); 

    return data;
  } catch (error) {
    console.warn(`Offline mode: using cached data for ${storageKey}`);
    const cached = localStorage.getItem(storageKey);
    return cached ? JSON.parse(cached) : [];
  }
}

/* ---------------------------------------------
   LOAD REGISTERED RFID LIST (AUTO TOGGLE, NON-CLICKABLE)
   --------------------------------------------- */
async function loadRegisteredRFIDs() {
  const rfids = await fetchWithOffline('get_registered_rfids.php', 'rfid_data');

  rfidContainer.innerHTML = '';
  rfids.forEach(rfid => {

    const checked = (rfid.rfid_status == 1);

    let itemClass = checked ? "rfid-item active" : "rfid-item inactive";

    const div = document.createElement('div');
    div.className = itemClass;

    div.innerHTML = `
      <span>${rfid.rfid_data}</span>
      <input type="checkbox" 
             class="toggle" 
             data-rfid="${rfid.rfid_data}" 
             ${checked ? 'checked' : ''} 
             disabled />
    `;

    rfidContainer.appendChild(div);
  });

  // ❗ Toggle is disabled → NO CHANGE LISTENERS ADDED
}

/* ---------------------------------------------
   LOAD RFID LOGS (LATEST ON TOP)
   --------------------------------------------- */
async function loadRFIDLogs() {
  let logs;

  try {
    const response = await fetch('get_rfid_logs.php?cacheBust=' + Date.now(), {
      cache: "no-store"
    });

    logs = await response.json();
    localStorage.setItem('rfid_logs', JSON.stringify(logs));

  } catch (err) {
    logs = JSON.parse(localStorage.getItem('rfid_logs')) || [];
  }

  // NEWEST FIRST
  logs = logs.reverse();

  logBody.innerHTML = '';

  logs.forEach((log, index) => {
    const statusDisplay =
      log.rfid_status === 'RFID NOT FOUND'
        ? '<span style="color:red;font-weight:bold;">RFID NOT FOUND</span>'
        : log.rfid_status;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${log.rfid_data}</td>
      <td>${statusDisplay}</td>
      <td>${log.time_log}</td>
    `;
    logBody.appendChild(row);
  });
}

/* ---------------------------------------------
   AUTO UPDATE EVERY 2 SECONDS
   --------------------------------------------- */
async function autoUpdate() {
  await loadRFIDLogs();
  await loadRegisteredRFIDs();
  setTimeout(autoUpdate, 2000);
}

autoUpdate();
