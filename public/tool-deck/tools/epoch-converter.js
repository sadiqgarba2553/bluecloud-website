document.addEventListener('DOMContentLoaded', () => {
  const epochNow = document.getElementById('epoch-now');
  
  const tsInput = document.getElementById('ts-input');
  const btnTs2Date = document.getElementById('btn-ts2date');
  const tsResult = document.getElementById('ts-result');

  const dYr = document.getElementById('d-yr');
  const dMo = document.getElementById('d-mo');
  const dDy = document.getElementById('d-dy');
  const dHr = document.getElementById('d-hr');
  const dMn = document.getElementById('d-mn');
  const dSc = document.getElementById('d-sc');
  const btnDate2Ts = document.getElementById('btn-date2ts');
  const dateResult = document.getElementById('date-result');

  // Clock
  setInterval(() => {
    epochNow.textContent = Math.floor(Date.now() / 1000);
  }, 1000);
  epochNow.textContent = Math.floor(Date.now() / 1000);

  // Init Date Fields
  const now = new Date();
  dYr.value = now.getFullYear();
  dMo.value = now.getMonth() + 1;
  dDy.value = now.getDate();
  dHr.value = now.getHours();
  dMn.value = now.getMinutes();
  dSc.value = now.getSeconds();

  function formatOutput(date) {
    if (isNaN(date.getTime())) return "Invalid Date";
    return `<strong>GMT:</strong> ${date.toUTCString()}<br><strong>Local:</strong> ${date.toString()}`;
  }

  btnTs2Date.addEventListener('click', () => {
    let ts = parseInt(tsInput.value);
    if (isNaN(ts)) {
      tsResult.innerHTML = 'Please enter a valid number.';
      return;
    }
    // assume seconds if < 1e11 (up to year 5138)
    if (ts < 1e11) ts *= 1000;
    
    const date = new Date(ts);
    tsResult.innerHTML = formatOutput(date);
  });

  btnDate2Ts.addEventListener('click', () => {
    const yr = parseInt(dYr.value) || 0;
    const mo = parseInt(dMo.value) || 1;
    const dy = parseInt(dDy.value) || 1;
    const hr = parseInt(dHr.value) || 0;
    const mn = parseInt(dMn.value) || 0;
    const sc = parseInt(dSc.value) || 0;

    const date = new Date(yr, mo - 1, dy, hr, mn, sc);
    if (isNaN(date.getTime())) {
      dateResult.innerHTML = 'Invalid Date parameters.';
      return;
    }

    const tsSeconds = Math.floor(date.getTime() / 1000);
    const tsMillis = date.getTime();
    
    dateResult.innerHTML = `<strong>Seconds:</strong> ${tsSeconds}<br><strong>Milliseconds:</strong> ${tsMillis}<br><br><small>(${date.toString()})</small>`;
  });
});
