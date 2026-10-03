import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { db } from './server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

const UPLOADS_DIR = path.resolve(__dirname, 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// Extend Request interface to hold authenticated userId
interface AuthenticatedRequest extends Request {
  userId?: string;
}

// Authentication Middleware to strictly enforce Data Isolation
function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'សូមចូលគណនីជាមុនសិន (Unauthorized - Token missing).' });
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const user = db.getUserBySession(token);
  if (!user) {
    return res.status(401).json({ error: 'Session មិនត្រឹមត្រូវ ឬបានផុតកំណត់។ សូម Login ម្តងទៀត។' });
  }

  req.userId = user.id;
  next();
}

// ==========================================
// 1. AUTHENTICATION & PROFILE APIS
// ==========================================

// Request 6-digit OTP
app.post('/api/auth/send-otp', (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
    return res.status(400).json({ error: 'សូមបញ្ចូលលេខទូរស័ព្ទឱ្យបានត្រឹមត្រូវ (យ៉ាងហោច ៨ ខ្ទង់)។' });
  }

  const result = db.sendOtp(phone.trim());
  res.json(result);
});

// Verify OTP & Login / Sign Up
app.post('/api/auth/verify-otp', (req: Request, res: Response) => {
  const { phone, code, fullName } = req.body;
  if (!phone || !code) {
    return res.status(400).json({ error: 'សូមបញ្ចូលលេខទូរស័ព្ទ និងលេខកូដ OTP។' });
  }

  const result = db.verifyOtp(phone, code, fullName);
  if ('error' in result) {
    return res.status(400).json({ error: result.error });
  }

  res.json({
    success: true,
    user: result.user,
    token: result.token,
    wedding: result.wedding,
  });
});

// Get Current User Profile & Wedding
app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = db.getUserBySession(req.headers.authorization!.replace('Bearer ', '').trim());
  if (!user) {
    return res.status(404).json({ error: 'រកមិនឃើញគណនីអ្នកប្រើប្រាស់ទេ។' });
  }

  const wedding = db.getWeddingByUserId(user.id);
  res.json({ user, wedding });
});

// Update Profile
app.put('/api/auth/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { fullName, avatar } = req.body;
  const updated = db.updateUserProfile(req.userId!, { fullName, avatar });
  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ success: true, user: updated });
});

// ==========================================
// 2. MULTI-TENANT WEDDING & TEMPLATE APIS
// ==========================================

// Get Wedding Event for authenticated user
app.get('/api/admin/wedding', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const wedding = db.getWeddingByUserId(req.userId!);
  res.json({ wedding });
});

// Update Wedding Information
app.put('/api/admin/wedding', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const wedding = db.updateWeddingForUser(req.userId!, req.body);
  res.json({ success: true, wedding });
});

// Switch / Select Active Template without losing wedding data
app.post('/api/admin/wedding/select-template', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { templateId } = req.body;
  if (!templateId || !['tmpl-01', 'tmpl-02', 'tmpl-03', 'tmpl-04', 'tmpl-05', 'tmpl-06'].includes(templateId)) {
    return res.status(400).json({ error: 'Invalid templateId. Must be tmpl-01 through tmpl-06.' });
  }

  const updatedWedding = db.selectTemplateForUser(req.userId!, templateId);
  res.json({ success: true, selectedTemplateId: updatedWedding.selectedTemplateId, wedding: updatedWedding });
});

// Get active Wedding Template for authenticated user
app.get('/api/admin/template', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const template = db.getTemplateByUserId(req.userId!);
  res.json(template);
});

// Update Wedding Template configuration
app.put('/api/admin/template', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateTemplateForUser(req.userId!, req.body);
  res.json(updated);
});

// User Dashboard Statistics
app.get('/api/admin/stats', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const stats = db.getStatsByUserId(req.userId!);
  res.json(stats);
});

// ==========================================
// 3. MULTI-TENANT GUEST LIST APIS
// ==========================================

app.get('/api/admin/guests', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { search, group, status } = req.query;
  const guests = db.getGuestsByUserId(req.userId!, {
    search: search as string,
    group: group as string,
    status: status as string,
  });
  res.json(guests);
});

app.post('/api/admin/guests', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { fullName, phone, email, group, allowedGuests } = req.body;
  if (!fullName || !fullName.trim()) {
    return res.status(400).json({ error: 'សូមបញ្ចូលឈ្មោះភ្ញៀវ។' });
  }

  const newGuest = db.createGuestForUser(req.userId!, {
    fullName,
    phone,
    email,
    group,
    allowedGuests: Number(allowedGuests) || 1,
  });

  res.status(201).json(newGuest);
});

app.put('/api/admin/guests/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateGuestForUser(req.userId!, req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'រកមិនឃើញភ្ញៀវនេះទេ។' });
  }
  res.json(updated);
});

app.delete('/api/admin/guests/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const ok = db.deleteGuestForUser(req.userId!, req.params.id);
  if (!ok) {
    return res.status(404).json({ error: 'រកមិនឃើញភ្ញៀវនេះទេ។' });
  }
  res.json({ success: true });
});

app.post('/api/admin/guests/:id/regenerate-token', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const token = db.regenerateGuestToken(req.userId!, req.params.id);
  if (!token) {
    return res.status(404).json({ error: 'រកមិនឃើញភ្ញៀវនេះទេ។' });
  }
  res.json({ token });
});

app.post('/api/admin/guests/import', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { guestList } = req.body;
  if (!Array.isArray(guestList)) {
    return res.status(400).json({ error: 'guestList array is required' });
  }
  const created = db.importGuestsForUser(req.userId!, guestList);
  res.json({ success: true, count: created.length, guests: created });
});

// ==========================================
// 4. MULTI-TENANT ATTENDANCE APIS
// ==========================================

app.get('/api/admin/attendance', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { search, response } = req.query;
  const records = db.getAttendanceByUserId(req.userId!, {
    search: search as string,
    response: response as string,
  });
  res.json(records);
});

app.put('/api/admin/attendance/:guestId', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const ok = db.updateAttendanceForUser(req.userId!, req.params.guestId, req.body);
  if (!ok) {
    return res.status(404).json({ error: 'រកមិនឃើញភ្ញៀវនេះទេ។' });
  }
  res.json({ success: true });
});

// ==========================================
// 5. MULTI-TENANT GIFTS & PAYMENT METHODS
// ==========================================

app.get('/api/admin/payment-methods', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const methods = db.getPaymentMethodsByUserId(req.userId!);
  res.json(methods);
});

app.post('/api/admin/payment-methods', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { providerName, accountName, accountNumber, currency, qrImage, enabled } = req.body;
  if (!providerName || !accountNumber) {
    return res.status(400).json({ error: 'សូមបញ្ចូលឈ្មោះធនាគារ និងលេខគណនី។' });
  }
  const created = db.createPaymentMethodForUser(req.userId!, {
    providerName,
    accountName: accountName || '',
    accountNumber,
    currency: currency || 'USD',
    qrImage: qrImage || '',
    enabled: enabled !== undefined ? enabled : true,
  });
  res.status(201).json(created);
});

app.put('/api/admin/payment-methods/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updatePaymentMethodForUser(req.userId!, req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'រកមិនឃើញគណនីនេះទេ។' });
  }
  res.json(updated);
});

app.delete('/api/admin/payment-methods/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const ok = db.deletePaymentMethodForUser(req.userId!, req.params.id);
  if (!ok) {
    return res.status(404).json({ error: 'រកមិនឃើញគណនីនេះទេ។' });
  }
  res.json({ success: true });
});

// ==========================================
// 6. IMAGE UPLOAD API
// ==========================================

app.post('/api/upload', (req: Request, res: Response) => {
  const { imageBase64, mimeType } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: 'No image data provided.' });
  }

  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/svg+xml'];
  if (mimeType && !allowed.includes(mimeType)) {
    return res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG, WEBP, and SVG are allowed.' });
  }

  try {
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    if (buffer.length > 8 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 8MB limit.' });
    }

    const ext = mimeType ? mimeType.split('/')[1].replace('+xml', '') : 'jpg';
    const safeName = `img_${Date.now()}_${Math.floor(Math.random() * 1000)}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, safeName);

    fs.writeFileSync(filePath, buffer);
    const publicUrl = `/uploads/${safeName}`;

    res.json({ success: true, url: publicUrl, filename: safeName });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to process image upload.' });
  }
});

// ==========================================
// 7. PUBLIC GUEST INVITATION & PREVIEW
// ==========================================

// Public wedding preview
app.get('/api/public/wedding', (_req: Request, res: Response) => {
  const wedding = db.getWeddingByUserId('user-vichet');
  const template = db.getTemplateByUserId('user-vichet');
  const paymentMethods = db.getPaymentMethodsByUserId('user-vichet');
  res.json({ wedding, template, paymentMethods });
});

// Public template preview
app.get('/api/public/template', (_req: Request, res: Response) => {
  const template = db.getTemplateByUserId('user-vichet');
  res.json(template);
});

// Publicly accessible by invited guest without logging in
app.get('/api/invitation/:token', (req: Request, res: Response) => {
  const { token } = req.params;
  const result = db.getInvitationByToken(token);

  if (!result) {
    return res.status(404).json({ error: 'រកមិនឃើញសំបុត្រអញ្ជើញ ឬតំណភ្ជាប់មិនត្រឹមត្រូវ។', notFound: true });
  }

  res.json({
    guest: {
      id: result.guest.id,
      fullName: result.guest.fullName,
      group: result.guest.group,
      allowedGuests: result.guest.allowedGuests,
      invitationToken: result.guest.invitationToken,
      attendanceStatus: result.guest.attendanceStatus,
    },
    wedding: result.wedding,
    template: result.template,
    paymentMethods: result.paymentMethods,
    rsvp: result.rsvp,
  });
});

app.post('/api/invitation/:token/rsvp', (req: Request, res: Response) => {
  const { token } = req.params;
  const { response: rsvpChoice, guestCount, additionalGuestNames, dietaryPreference, phoneOrTelegram, message } = req.body;

  if (!rsvpChoice || !['yes', 'no', 'maybe'].includes(rsvpChoice)) {
    return res.status(400).json({ error: 'Invalid attendance response.' });
  }

  const result = db.submitRsvpByToken(token, {
    response: rsvpChoice,
    guestCount: Number(guestCount) || 1,
    additionalGuestNames,
    dietaryPreference,
    phoneOrTelegram,
    message,
  });

  if ('error' in result) {
    return res.status(400).json({ error: result.error });
  }

  res.json({
    success: true,
    rsvp: result.rsvp,
    guest: {
      id: result.guest.id,
      fullName: result.guest.fullName,
      attendanceStatus: result.guest.attendanceStatus,
      allowedGuests: result.guest.allowedGuests,
    },
  });
});

// ==========================================
// SPA FALLBACK / STATIC SERVER
// ==========================================
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Multi-tenant Wedding Management Server running on http://localhost:${PORT}`);
  });
}

startServer();
