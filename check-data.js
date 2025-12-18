
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI missing');
    process.exit(1);
}

const CRMRecordSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed },
}, { strict: false });
const RecordModel = mongoose.models.CRMRecord || mongoose.model('CRMRecord', CRMRecordSchema);

async function check() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const count = await RecordModel.countDocuments({});
        console.log(`Total Records in DB: ${count}`);

        if (count > 0) {
            console.log('\n--- Recent 5 Records ---');
            const recent = await RecordModel.find({}).sort({ updatedAt: -1 }).limit(5);
            recent.forEach(r => {
                console.log(`[${r.type}] ${r.name || 'Unnamed'} (ID: ${r.id}) - Status: ${r.status}`);
            });
            console.log('------------------------\n');
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

check();
