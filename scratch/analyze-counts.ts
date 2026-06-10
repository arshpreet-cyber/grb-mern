import * as fs from 'fs';

function parseCSV(content: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];
    
    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          field += '"';
          i++; // skip next quote
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(field);
        field = '';
      } else if (char === '\n' || char === '\r') {
        row.push(field);
        field = '';
        if (row.length > 0 && !(row.length === 1 && row[0] === '')) {
          result.push(row);
        }
        row = [];
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
      } else {
        field += char;
      }
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    result.push(row);
  }
  return result;
}

const ordersCsvPath = 'c:/Users/mohit.kumar/Downloads/orders.csv';
const orderDetailsCsvPath = 'c:/Users/mohit.kumar/Downloads/order_details.csv';

const orders = parseCSV(fs.readFileSync(ordersCsvPath, 'utf8'));
const details = parseCSV(fs.readFileSync(orderDetailsCsvPath, 'utf8'));

const orderHeaders = orders[0];
const orderRows = orders.slice(1);
const detailsHeaders = details[0];
const detailsRows = details.slice(1);

const orderIdIdx = orderHeaders.indexOf('id');
const detailOrderIdIdx = detailsHeaders.indexOf('order_id');

const orderIds = new Set(orderRows.map(r => parseInt(r[orderIdIdx])).filter(id => !isNaN(id)));
console.log('Total orders in orders.csv:', orderRows.length);
console.log('Unique order IDs in orders.csv:', orderIds.size);

console.log('Total details in order_details.csv:', detailsRows.length);

let detailsWithNoMatchingOrder = 0;
const orphanOrderIds = new Set<number>();
for (const detail of detailsRows) {
  const orderId = parseInt(detail[detailOrderIdIdx]);
  if (!orderIds.has(orderId)) {
    detailsWithNoMatchingOrder++;
    orphanOrderIds.add(orderId);
  }
}

console.log('Details with no matching order in orders.csv:', detailsWithNoMatchingOrder);
console.log('Unique orphan order IDs in order_details.csv:', orphanOrderIds.size);
console.log('First 5 orphan order IDs:', Array.from(orphanOrderIds).slice(0, 5));
