
// const { db } = require('./lib/db');

async function checkStages() {
    try {
        // Mocking db read since we can't easily import TS lib/db in JS script without compilation
        // But wait, the environment is node, I can't import TS files directly.
        // I should stick to fetching from API or reading the json file directly.
        const fs = require('fs');
        const path = require('path');

        let dbPath = path.join(process.cwd(), 'data', 'db.json');
        if (!fs.existsSync(dbPath)) {
            // Try /tmp for vercel mimic
            dbPath = '/tmp/db.json';
        }

        if (!fs.existsSync(dbPath)) {
            console.log("DB file not found");
            return;
        }

        const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        const records = data.records || [];

        const settlementRecords = records.filter(r => r.type === 'settlement');

        console.log(`Total Settlement Records: ${settlementRecords.length}`);

        const stageCounts = {};
        settlementRecords.forEach(r => {
            const s = r.stage || "Undefined/Null";
            stageCounts[s] = (stageCounts[s] || 0) + 1;
        });

        console.log("Stage Counts:", stageCounts);

        // Show details of records with 'Details Shared'
        const detailsShared = settlementRecords.filter(r => r.stage === 'Details Shared');
        console.log(`Records with 'Details Shared': ${detailsShared.length}`);
        detailsShared.forEach(r => {
            console.log(`- ID: ${r.id}, Name: ${r.name}, Status: ${r.status}`);
        });

    } catch (e) {
        console.error("Error:", e);
    }
}

checkStages();
