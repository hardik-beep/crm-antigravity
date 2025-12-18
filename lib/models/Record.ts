import mongoose from 'mongoose';

const RecordSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    type: { type: String, enum: ['protect', 'settlement', 'nexus'], required: true },
    partner: { type: String, required: true },
    name: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    status: { type: String, required: true },
    stage: { type: String, required: true },
    uploadedFrom: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    remarks: [{
        id: String,
        text: String,
        createdAt: Date,
        updatedAt: Date,
        createdBy: String,
    }],
    activityLog: [{
        id: String,
        action: String,
        details: String,
        timestamp: Date,
        user: String,
    }],
    // Flexible data for specific record types
    data: { type: mongoose.Schema.Types.Mixed },
}, { strict: false });

export default mongoose.models.CRMRecord || mongoose.model('CRMRecord', RecordSchema);
