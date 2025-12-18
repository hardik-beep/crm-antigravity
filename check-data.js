
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
});
const RecordModel = mongoose.models.CRMRecord || mongoose.model('CRMRecord', CRMRecordSchema);

async function check() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const count = await RecordModel.countDocuments({});
        console.log(`Total Records in DB: ${count}`);

        if (count > 0) {
            const sample = await RecordModel.findOne({});
            console.log('Sample Record:', JSON.stringify(sample, null, 2));
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

check();
