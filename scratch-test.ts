import fs from "fs";

function parseCsvFile(filePath: string): string[][] {
  const content = fs.readFileSync(filePath, "utf-8");
  const len = content.length;
  const rows: string[][] = [];
  let fields: string[] = [];
  let inQuotes = false;
  let fieldStart = 0;
  let fieldHasQuotes = false;

  for (let i = 0; i < len; i++) {
    const char = content[i];

    if (char === '"') {
      if (inQuotes && content[i + 1] === '"') {
        fieldHasQuotes = true;
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      let fieldVal = content.substring(fieldStart, i);
      if (fieldVal.startsWith('"') && fieldVal.endsWith('"')) {
        fieldVal = fieldVal.substring(1, fieldVal.length - 1);
      }
      if (fieldHasQuotes) {
        fieldVal = fieldVal.replace(/""/g, '"');
      }
      fields.push(fieldVal);
      fieldStart = i + 1;
      fieldHasQuotes = false;
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      let fieldVal = content.substring(fieldStart, i);
      if (fieldVal.startsWith('"') && fieldVal.endsWith('"')) {
        fieldVal = fieldVal.substring(1, fieldVal.length - 1);
      }
      if (fieldHasQuotes) {
        fieldVal = fieldVal.replace(/""/g, '"');
      }
      fields.push(fieldVal);
      
      rows.push(fields);
      fields = [];
      
      if (char === '\r' && content[i + 1] === '\n') {
        i++;
      }
      fieldStart = i + 1;
      fieldHasQuotes = false;
    }
  }

  if (fieldStart < len) {
    let fieldVal = content.substring(fieldStart);
    if (fieldVal.startsWith('"') && fieldVal.endsWith('"')) {
      fieldVal = fieldVal.substring(1, fieldVal.length - 1);
    }
    if (fieldHasQuotes) {
      fieldVal = fieldVal.replace(/""/g, '"');
    }
    fields.push(fieldVal);
    rows.push(fields);
  }

  return rows;
}

function parsePhpSerialized(str: string): Record<string, string> {
  const map: Record<string, string> = {};
  try {
    const regex = /s:\d+:"([\s\S]*?)";/g;
    const tokens: string[] = [];
    let match;
    while ((match = regex.exec(str)) !== null) {
      tokens.push(match[1]);
    }
    
    for (let i = 0; i < tokens.length; i += 2) {
      const key = tokens[i];
      const val = tokens[i + 1];
      if (key !== undefined && val !== undefined) {
        map[key.trim()] = val;
      }
    }
  } catch (err) {
    // ignored
  }
  return map;
}

const rows = parseCsvFile("c:\\Users\\mohit.kumar\\Downloads\\order_details (1).csv");
const headers = rows[0];
const reviewIndex = headers.indexOf("review_data");

const uniqueKeys = new Set<string>();

for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  if (r.length < headers.length) continue;
  const rawData = r[reviewIndex];
  if (rawData && rawData !== "NULL" && rawData.trim() !== "") {
    try {
      const decoded = Buffer.from(rawData, "base64").toString("utf-8");
      const parsed = parsePhpSerialized(decoded);
      Object.keys(parsed).forEach(k => uniqueKeys.add(k.trim()));
    } catch (e) {
      // ignore
    }
  }
}

console.log("All unique keys found in review_data:");
console.log(Array.from(uniqueKeys));
