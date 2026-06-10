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

const usersCsvPath = 'c:/Users/mohit.kumar/Downloads/users.csv';
const ordersCsvPath = 'c:/Users/mohit.kumar/Downloads/orders.csv';

const users = parseCSV(fs.readFileSync(usersCsvPath, 'utf8'));
const orders = parseCSV(fs.readFileSync(ordersCsvPath, 'utf8'));

const userHeaders = users[0];
const userRows = users.slice(1);
const orderHeaders = orders[0];
const orderRows = orders.slice(1);

const userIdIdx = userHeaders.indexOf('id');
const orderUserIdIdx = orderHeaders.indexOf('user_id');
const orderIdIdx = orderHeaders.indexOf('id');

const userIds = new Set(userRows.map(r => parseInt(r[userIdIdx])).filter(id => !isNaN(id)));

let ordersWithNoUser = 0;
let ordersWithNullUser = 0;

for (const order of orderRows) {
  const rawUserId = order[orderUserIdIdx];
  if (!rawUserId || rawUserId.toUpperCase() === 'NULL' || rawUserId.trim() === '') {
    ordersWithNullUser++;
  } else {
    const uId = parseInt(rawUserId);
    if (!userIds.has(uId)) {
      ordersWithNoUser++;
    }
  }
}

console.log('--- Orders and Users Relationship in CSVs ---');
console.log('Total orders in orders.csv:', orderRows.length);
console.log('Orders with NULL/empty user_id:', ordersWithNullUser);
console.log('Orders with user_id that is NOT in users.csv:', ordersWithNoUser);
