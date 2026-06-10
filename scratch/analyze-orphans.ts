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
const detailItemNameIdx = detailsHeaders.indexOf('item_name');
const detailBannerTitleIdx = detailsHeaders.indexOf('banner_title');

const orderIds = new Set(orderRows.map(r => parseInt(r[orderIdIdx])).filter(id => !isNaN(id)));

const itemCounts: Record<string, number> = {};
const platformCounts: Record<string, number> = {};

let orphanCount = 0;
for (const detail of detailsRows) {
  const orderId = parseInt(detail[detailOrderIdIdx]);
  if (!orderIds.has(orderId)) {
    orphanCount++;
    const rawItemName = detail[detailItemNameIdx] || 'Unknown';
    // Clean up item name (take first line or trim)
    const cleanItemName = rawItemName.split('\n')[0].trim();
    itemCounts[cleanItemName] = (itemCounts[cleanItemName] || 0) + 1;

    const platform = detail[detailBannerTitleIdx] || 'None';
    platformCounts[platform] = (platformCounts[platform] || 0) + 1;
  }
}

console.log('--- Orphan Order Details Analysis ---');
console.log('Total Orphans:', orphanCount);

console.log('\nTop 15 Orphan Item Names:');
const sortedItems = Object.entries(itemCounts).sort((a, b) => b[1] - a[1]);
for (const [name, count] of sortedItems.slice(0, 15)) {
  console.log(`- ${name}: ${count}`);
}

console.log('\nOrphan Platforms/Banners:');
const sortedPlatforms = Object.entries(platformCounts).sort((a, b) => b[1] - a[1]);
for (const [platform, count] of sortedPlatforms) {
  console.log(`- ${platform}: ${count}`);
}
