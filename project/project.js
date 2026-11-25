async function enableResults() {
  const response = await fetch('project/results.csv');
  if (!response.ok) throw new Error('Results unavailable');
  // The bundled numeric table uses simple, comma-free labels.
  const rows = (await response.text()).trim().split('\n').slice(1).map(line => line.split(','));
  const policy = document.querySelector('#policy');
  const metric = document.querySelector('#metric');
  for (const name of new Set(rows.map(row => row[0]))) policy.add(new Option(name, name));
  policy.value = 'DM0.5';
  const tbody = document.querySelector('#rates tbody');
  function render() {
    const body = document.createDocumentFragment();
    let tr;
    for (const [name, category, measure, condition, successes, valid, percent] of rows) {
      if (name !== policy.value || measure !== metric.value) continue;
      if (condition === 'Original') {
        tr = document.createElement('tr');
        const heading = document.createElement('th');
        heading.scope = 'row';
        heading.textContent = category;
        tr.append(heading);
        body.append(tr);
      }
      const counts = document.createElement('small');
      counts.textContent = successes + ' / ' + valid;
      tr.insertCell().append(percent + '%', counts);
    }
    tbody.replaceChildren(body);
    document.querySelector('#status').textContent = policy.value + ' · ' + metric.value;
  }
  document.querySelector('#filters').addEventListener('change', render);
  document.querySelector('#filters').hidden = false;
  render();
}
enableResults().catch(() => {
  document.querySelector('#status').textContent = 'DM0.5 · Final. All configurations are available in the CSV.';
});
