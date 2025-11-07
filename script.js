const logBody = document.getElementById('log-body');
const rfidContainer = document.getElementById('rfid-container');


async function loadRegisteredRFIDs() {
  try {
    const response = await fetch('get_registered_rfids.php');
    const rfids = await response.json();

    rfidContainer.innerHTML = '';
    rfids.forEach(rfid => {
      const div = document.createElement('div');
      div.className = 'rfid-item';
      div.innerHTML = `
        <span>${rfid.rfid_data}</span>
        <input type="checkbox" class="toggle" data-rfid="${rfid.rfid_data}" ${rfid.rfid_status == 1 ? 'checked' : ''} />
      `;
      rfidContainer.appendChild(div);
    });

    document.querySelectorAll('.toggle').forEach(toggle => {
      toggle.addEventListener('change', async () => {
        const rfid = toggle.dataset.rfid;
        const status = toggle.checked ? 1 : 0;

        const formData = new FormData();
        formData.append('rfid_data', rfid);
        formData.append('rfid_status', status);

        await fetch('update_rfid_status.php', { method: 'POST', body: formData });
        localStorage.setItem(rfid, status);
      });

      const savedState = localStorage.getItem(toggle.dataset.rfid);
      if (savedState !== null) toggle.checked = savedState == 1;
    });

  } catch (error) {
    console.error('Error loading registered RFIDs:', error);
  }
}

async function loadRFIDLogs() {
  try {
    const response = await fetch('get_rfid_logs.php');
    const data = await response.json();

    logBody.innerHTML = '';

    // display oldest first, latest last
    data.forEach((log, index) => {
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

  } catch (error) {
    console.error('Error loading RFID logs:', error);
  }
}


async function autoUpdate() {
  await loadRFIDLogs();
  await loadRegisteredRFIDs();
  setTimeout(autoUpdate, 5000);
}

autoUpdate();
