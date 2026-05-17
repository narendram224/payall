const fs = require('fs');
const data = JSON.parse(fs.readFileSync('/Users/narendrakumar/.gemini/antigravity/brain/a20d4342-ef0a-4f27-ae2e-cc2b8af92fc1/.system_generated/steps/222/output.txt', 'utf8'));

function extractEndpoints(item, path = '') {
  let endpoints = [];
  if (item.request) {
    let url = typeof item.request.url === 'string' ? item.request.url : (item.request.url?.raw || '');
    let method = item.request.method || 'GET';
    endpoints.push(`${path} -> ${item.name}: ${method} ${url}`);
  }
  
  if (item.item) {
    item.item.forEach(subItem => {
      endpoints = endpoints.concat(extractEndpoints(subItem, `${path}/${item.name}`));
    });
  }
  return endpoints;
}

const endpoints = extractEndpoints(data.collection);
fs.writeFileSync('endpoints_summary.txt', endpoints.join('\n'));
console.log('Extracted ' + endpoints.length + ' endpoints.');
