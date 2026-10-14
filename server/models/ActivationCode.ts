import mongoose, { Schema, Document } from 'mongoose';

export interface IActivationCode extends Document {
  code: string;
  orderNumber: string;
  orderId?: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone: string;
  amount: number;
  currency: string;
  bookTitle: string;
  status: 'pending' | 'active' | 'used' | 'revoked';
  isUsed: boolean;
  activatedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ActivationCodeSchema = new Schema<IActivationCode>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    orderNumber: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 50,
    },
    currency: {
      type: String,
      default: 'KWD',
    },
    bookTitle: {
      type: String,
      default: 'أسرار وتناغم الأزياء الراقية - الإصدار الحصري',
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'used', 'revoked'],
      default: 'pending',
      index: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
      index: true,
    },
    activatedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const ActivationCode =
  mongoose.models.ActivationCode ||
  mongoose.model<IActivationCode>('ActivationCode', ActivationCodeSchema);
