import bzBond from "@beezwax/bzbond-js";
import "../scss/app.scss";

// Create table element and structure
const table = document.createElement("table");
const thead = document.createElement("thead");
const tbody = document.createElement("tbody");

table.appendChild(thead);
table.appendChild(tbody);

(async () => {
  // Get config
  const config = await bzBond.SyncConfig();

  // Get data
  const [actionTimestamp, recordData, schema ] = await bzBond.PerformScript(config.scripts.getData);

  // Create header row
  const thFieldName = document.createElement("th");
  const thValue = document.createElement("th");

  thFieldName.textContent = "Field Name";
  thValue.textContent = `Value at ${actionTimestamp}`;

  thead.appendChild(thFieldName);
  thead.appendChild(thValue);

  // Create data rows
  Object.keys(recordData).forEach(field => {
    const row = document.createElement('tr');
    const fieldName = document.createElement('td');
    const data = document.createElement('td');

    fieldName.textContent = field;
    data.textContent = formatValue(recordData[field], schema[field].FieldType);
    
    row.appendChild(fieldName);
    row.appendChild(data);
    tbody.appendChild(row);
  });

  // Render table
  document.body.appendChild(table);

})();

function formatValue (value, type) {
  if (value === null) {
    return '';
  }
  let date;
  switch (type) {
    case 'varchar':
      return value;
    case 'decimal':
      return value;
    case 'date':
      date = new Date('0001-01-01');
      date.setTime(date.getTime() + value * 24 * 60 * 60 * 1000);
      return `${date.getFullYear().toString().padStart(4, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    case 'time':
      date = new Date(0);
      date.setSeconds(value);
      return date.toUTCString().split(' ')[4];
    case 'timestamp':
      date = new Date(value * 1000 - 62135726400000);
      return `${date.getFullYear().toString().padStart(4, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    case 'binary':
      return value[1];
    default:
      return '';
  }
}