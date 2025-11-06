const toggles = document.querySelectorAll('.toggle');
const logBody = document.getElementById('log-body');

// Load saved state from localStorage
const savedLogs = JSON.parse(localStorage.getItem('rfidLogs')) || [];
const savedStates = JSON.parse(localStorage.getItem('rfidStates')) || {};

// restore previous toggle states
toggles.forEach((toggle, index) => {
  const rfid = document.querySelectorAll('.rfid-item span')[index].innerText;
  toggle.checked = savedStates[rfid] ?? toggle.checked;
});

// render previous logs
savedLogs.forEach((log, i) => {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${i + 1}</td>
    <td>${log.rfid}</td>
    <td>${log.status}</td>
    <td>${log.date}</td>
  `;
  logBody.appendChild(row);
});

// add new logs on toggle change
toggles.forEach((toggle, index) => {
  toggle.addEventListener('change', () => {
    const rfid = document.querySelectorAll('.rfid-item span')[index].innerText;
    const status = toggle.checked ? 1 : 0;
    const date = new Date().toLocaleString();

    // log new entry
    const log = { rfid, status, date };
    savedLogs.push(log);
    localStorage.setItem('rfidLogs', JSON.stringify(savedLogs));

    // save toggle state
    savedStates[rfid] = toggle.checked;
    localStorage.setItem('rfidStates', JSON.stringify(savedStates));

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${savedLogs.length}</td>
      <td>${rfid}</td>
      <td>${status}</td>
      <td>${date}</td>
    `;
    logBody.appendChild(row);
  });
});
