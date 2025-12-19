import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true },
    userId: { type: String, required: true },
    punchInTime: { type: Date },
    lastActiveTime: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
});

export default mongoose.models.Session || mongoose.model('Session', SessionSchema);
