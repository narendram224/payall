const fs = require('fs');
const data = JSON.parse(fs.readFileSync('/Users/narendrakumar/.gemini/antigravity/brain/a20d4342-ef0a-4f27-ae2e-cc2b8af92fc1/.system_generated/steps/222/output.txt', 'utf8'));

function findItem(items, name) {
  for (let item of items) {
    if (item.name === name) return item;
    if (item.item) {
      let found = findItem(item.item, name);
      if (found) return found;
    }
  }
  return null;
}

const dmtItems = ['verification', 'add_sender', 'add_sender_confirm', 'sender_kyc', 'add_beneficiary', 'add_beneficiary_confirm', 'transfer', 'status'];

dmtItems.forEach(name => {
  const item = findItem(data.collection.item, name);
  if (item) {
    console.log(`\n--- ${name} ---`);
    console.log(`URL: ${item.request.url.raw}`);
    console.log(`Method: ${item.request.method}`);
    if (item.request.body && item.request.body.formdata) {
        console.log(`Payload (formdata):`);
        item.request.body.formdata.forEach(f => {
            console.log(`  ${f.key}: ${f.value}`);
        });
    }
  }
});
