import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string;
  bookTitle: string;
  customerName: string;
  phone: string;
  email?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'approved' | 'rejected';
  bookingDate: Date;
  paymentMethod: string;
  whatsappContacted: boolean;
  activationCode?: string;
  approvedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    bookTitle: {
      type: String,
      default: 'أسرار وتناغم الأزياء الراقية - الإصدار الحصري',
      trim: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
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
    status: {
      type: String,
      enum: ['pending', 'paid', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      default: 'tap_payment_link',
    },
    whatsappContacted: {
      type: Boolean,
      default: false,
    },
    activationCode: {
      type: String,
      default: null,
      index: true,
      sparse: true,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
