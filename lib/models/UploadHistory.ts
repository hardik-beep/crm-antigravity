import mongoose from 'mongoose';

const UploadHistorySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    fileName: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    recordType: { type: String, required: true },
    partner: { type: String, required: true },
    totalRows: { type: Number, required: true },
    validRows: { type: Number, required: true },
    invalidRows: { type: Number, required: true },
});

export default mongoose.models.UploadHistory || mongoose.model('UploadHistory', UploadHistorySchema);
