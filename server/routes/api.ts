import express from 'express';
import mongoose from 'mongoose';
import { Order } from '../models/Order.js';
import { ActivationCode } from '../models/ActivationCode.js';

export const apiRouter = express.Router();

/**
 * Generate a clean, unique activation code
 * e.g., ACT-984210 or ACT-7B8K2F
 */
function generateUniqueCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ACT-${result}`;
}

// 1. Health check & DB connection status
apiRouter.get('/health', async (req, res) => {
  const readyStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const stateNumber = mongoose.connection.readyState;
  const stateString = readyStates[stateNumber] || 'unknown';

  let totalOrders = 0;
  let totalCodes = 0;
  let pendingOrders = 0;

  if (stateNumber === 1) {
    try {
      totalOrders = await Order.countDocuments();
      totalCodes = await ActivationCode.countDocuments();
      pendingOrders = await Order.countDocuments({ status: 'pending' });
    } catch {
      // ignore count error
    }
  }

  res.json({
    messagge : "all is good",
    status: 'ok',
    database: {
      status: stateString,
      connected: stateNumber === 1,
      host: mongoose.connection.host || null,
      name: mongoose.connection.name || null,
      stats: {
        totalOrders,
        totalCodes,
        pendingOrders,
      },
    },
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// 2. Create Order & Automatically Generate Linked Activation Code
apiRouter.post('/orders', async (req, res) => {
  try {
    const {
      customerName,
      phone,
      email = '',
      orderNumber,
      bookTitle = 'أسرار وتناغم الأزياء الراقية - الإصدار الحصري',
      amount = 50,
      currency = 'KWD',
      notes = '',
      paymentMethod = 'tap_payment_link',
    } = req.body;

    if (!customerName || !phone) {
      return res.status(400).json({
        success: false,
        message: 'customerName and phone are required fields',
      });
    }

    const trimmedName = String(customerName).trim();
    const trimmedPhone = String(phone).trim();
    const trimmedEmail = email ? String(email).trim().toLowerCase() : '';
    const numAmount = Number(amount) > 0 ? Number(amount) : 50;

    // Generate readable unique Order Number if not provided
    const generatedOrderNumber =
      orderNumber ||
      `BK-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    // Generate unique activation code
    let code = generateUniqueCode();
    let codeExists = await ActivationCode.findOne({ code });
    let attempts = 0;
    while (codeExists && attempts < 5) {
      code = generateUniqueCode();
      codeExists = await ActivationCode.findOne({ code });
      attempts++;
    }

    // 1. Create the Order with pending status
    const order = await Order.create({
      orderNumber: generatedOrderNumber,
      bookTitle,
      customerName: trimmedName,
      phone: trimmedPhone,
      email: trimmedEmail,
      amount: numAmount,
      currency,
      status: 'pending',
      bookingDate: new Date(),
      paymentMethod,
      activationCode: code,
      notes: notes || '',
      whatsappContacted: false,
    });

    // 2. Create the linked ActivationCode record with order details, phone, and required amount
    const activationRecord = await ActivationCode.create({
      code,
      orderNumber: generatedOrderNumber,
      orderId: order._id,
      customerName: trimmedName,
      customerPhone: trimmedPhone,
      amount: numAmount,
      currency,
      bookTitle,
      status: 'pending', // Starts pending until admin/payment verification
      isUsed: false,
    });

    res.status(201).json({
      success: true,
      message: 'تم حجز الكتاب وإنشاء الطلب وكود التفعيل المربوط بنجاح',
      order,
      activationCode: activationRecord,
    });
  } catch (error: any) {
    console.error('Error creating order and linked code:', error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to create order and linked activation code',
    });
  }
});

// 3. List All Orders
apiRouter.get('/orders', async (req, res) => {
  try {
    const { phone, status, search, limit = 50 } = req.query;
    const filter: any = {};

    if (phone) {
      filter.phone = new RegExp(String(phone), 'i');
    }
    if (status) {
      filter.status = status;
    }
    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      filter.$or = [
        { customerName: searchRegex },
        { phone: searchRegex },
        { orderNumber: searchRegex },
        { activationCode: searchRegex },
      ];
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to fetch orders',
    });
  }
});

// 4. Get Order by Order Number (including activation code data)
apiRouter.get('/orders/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Also fetch the linked activation code record
    const activationRecord = await ActivationCode.findOne({ orderNumber });

    res.json({
      success: true,
      order,
      activationCode: activationRecord,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to fetch order',
    });
  }
});

// 5. Update Order Status (Approve / Reject / Mark Paid) and Sync Linked Activation Code
apiRouter.patch('/orders/:orderNumber/status', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { status, whatsappContacted, notes } = req.body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (typeof whatsappContacted === 'boolean') updateData.whatsappContacted = whatsappContacted;
    if (notes !== undefined) updateData.notes = notes;
    if (status === 'approved' || status === 'paid') {
      updateData.approvedAt = new Date();
    }

    const order = await Order.findOneAndUpdate(
      { orderNumber },
      { $set: updateData },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Synchronize linked activation code status
    let linkedCodeStatus: 'pending' | 'active' | 'revoked' = 'pending';
    if (status === 'approved' || status === 'paid') {
      linkedCodeStatus = 'active';
    } else if (status === 'rejected') {
      linkedCodeStatus = 'revoked';
    }

    const activationRecord = await ActivationCode.findOneAndUpdate(
      { orderNumber },
      {
        $set: {
          status: linkedCodeStatus,
          ...(linkedCodeStatus === 'active' ? { activatedAt: new Date() } : {}),
        },
      },
      { new: true }
    );

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
      activationCode: activationRecord,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to update order status',
    });
  }
});

// 6. List All Linked Activation Codes
apiRouter.get('/codes', async (req, res) => {
  try {
    const { status, phone, orderNumber, limit = 50 } = req.query;
    const filter: any = {};

    if (status) filter.status = status;
    if (phone) filter.customerPhone = new RegExp(String(phone), 'i');
    if (orderNumber) filter.orderNumber = String(orderNumber);

    const codes = await ActivationCode.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      count: codes.length,
      codes,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to fetch activation codes',
    });
  }
});

// 7. Verify Activation Code (Customer Access Verification)
apiRouter.post('/activation/verify', async (req, res) => {
  try {
    const { code, phone } = req.body;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Activation code is required',
      });
    }

    const cleanCode = String(code).trim().toUpperCase();

    // Find the code record
    const activationRecord = await ActivationCode.findOne({ code: cleanCode });

    // Also check corresponding Order record
    const orderRecord = await Order.findOne({
      $or: [{ activationCode: cleanCode }, { orderNumber: cleanCode }],
    });

    if (!activationRecord && !orderRecord) {
      return res.status(404).json({
        success: false,
        valid: false,
        accessGranted: false,
        message: 'كود التفعيل غير موجود بالسيستم',
      });
    }

    // Check if code is active or order is approved
    const isApproved =
      activationRecord?.status === 'active' ||
      orderRecord?.status === 'approved' ||
      orderRecord?.status === 'paid';

    if (!isApproved) {
      return res.status(403).json({
        success: false,
        valid: true,
        accessGranted: false,
        status: 'pending',
        message:
          'طلبك مسجل والكود قيد التفعيل. يرجى إتمام التحويل والتواصل عبر واتساب لاعتماد فتح الكتاب.',
        orderNumber: orderRecord?.orderNumber || activationRecord?.orderNumber,
        amount: orderRecord?.amount || activationRecord?.amount,
        currency: orderRecord?.currency || activationRecord?.currency,
      });
    }

    // Code is approved/active!
    res.json({
      success: true,
      valid: true,
      accessGranted: true,
      status: 'active',
      message: 'تم التحقق من كود التفعيل بنجاح! نرحب بك في قراءة الكتاب.',
      details: {
        code: cleanCode,
        orderNumber: orderRecord?.orderNumber || activationRecord?.orderNumber,
        customerName: orderRecord?.customerName || activationRecord?.customerName,
        customerPhone: orderRecord?.phone || activationRecord?.customerPhone,
        bookTitle: orderRecord?.bookTitle || activationRecord?.bookTitle,
        approvedAt: orderRecord?.approvedAt || activationRecord?.activatedAt || new Date(),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to verify activation code',
    });
  }
});
