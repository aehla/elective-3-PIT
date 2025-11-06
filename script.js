const toggles = document.querySelectorAll('.toggle');
const logBody = document.getElementById('log-body');

toggles.forEach((toggle, index) => {
  toggle.addEventListener('change', () => {
    const rfid = document.querySelectorAll('.rfid-item span')[index].innerText;
    const status = toggle.checked ? 1 : 0;
    const date = new Date().toLocaleString();
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${logBody.children.length + 1}</td>
      <td>${rfid}</td>
      <td>${status}</td>
      <td>${date}</td>
    `;
    logBody.appendChild(row);
  });
});

// Simulated auto-refresh (e.g., when database updates)
setInterval(() => {
  console.log('Auto-refresh triggered (simulated)');
}, 5000);
