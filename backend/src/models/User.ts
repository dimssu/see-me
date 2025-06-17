import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  mudraId: string;
  email: string;
  subscription: {
    status: 'trial' | 'active' | 'expired';
    trialEndsAt?: Date;
    plan?: string;
  };
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  mudraId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  subscription: {
    status: { type: String, enum: ['trial', 'active', 'expired'], default: 'trial' },
    trialEndsAt: { type: Date },
    plan: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', UserSchema); 