import React, { useState, useEffect } from 'react';
import {
  Gift,
  Plus,
  QrCode,
  Upload,
  Trash2,
  Edit2,
  Check,
  X,
  RefreshCw,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { PaymentMethod } from '../../types/fullstack';
import { api } from '../../services/api';

export const GiftManagementTab: React.FC = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);

  // Form states
  const [providerName, setProviderName] = useState('ABA Bank');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'KHR' | 'BOTH'>('USD');
  const [qrImage, setQrImage] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [previewModalImg, setPreviewModalImg] = useState<string | null>(null);

  const loadMethods = async () => {
    try {
      setLoading(true);
      const data = await api.getPaymentMethods();
      setMethods(data);
    } catch (err) {
      console.error('Failed to load payment methods:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMethods();
  }, []);

  const handleOpenAdd = () => {
    setEditingMethod(null);
    setProviderName('ABA Bank');
    setAccountName('');
    setAccountNumber('');
    setCurrency('USD');
    setQrImage('');
    setEnabled(true);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: PaymentMethod) => {
    setEditingMethod(m);
    setProviderName(m.providerName);
    setAccountName(m.accountName);
    setAccountNumber(m.accountNumber);
    setCurrency(m.currency);
    setQrImage(m.qrImage || '');
    setEnabled(m.enabled);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`តើអ្នកពិតជាចង់លុបមធ្យោបាយទូទាត់ "${name}" នេះមែនទេ?`)) return;
    try {
      await api.deletePaymentMethod(id);
      setMethods((prev) => prev.filter((m) => m.id !== id));
    } catch {
      alert('Failed to delete payment method');
    }
  };

  const handleToggleEnabled = async (m: PaymentMethod) => {
    try {
      const updated = await api.updatePaymentMethod(m.id, { enabled: !m.enabled });
      setMethods((prev) => prev.map((item) => (item.id === m.id ? updated : item)));
    } catch {
      alert('Failed to update status');
    }
  };

  // Image Upload handler with client-side validation
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg('ប្រភេទឯកសារមិនត្រឹមត្រូវ។ សូមជ្រើសរើសរូបភាព JPEG, PNG, WEBP ឬ SVG។');
      return;
    }

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('ទំហំរូបភាពធំពេក (អតិបរមា 8MB)។');
      return;
    }

    setErrorMsg('');
    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const res = await api.uploadImage(base64, file.name, file.type);
          setQrImage(res.url);
          setUploading(false);
        } catch {
          // If server upload had an issue, fallback directly to the base64 data URL
          setQrImage(base64);
          setUploading(false);
        }
      };
      reader.onerror = () => {
        setErrorMsg('មានបញ្ហាក្នុងការអានឯកសាររូបភាព។');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setErrorMsg('បរាជ័យក្នុងការ Upload រូបភាព។');
      setUploading(false);
    }
  };

  const handleSaveMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerName.trim() || !accountNumber.trim()) {
      setErrorMsg('សូមបញ្ចូលឈ្មោះធនាគារ និងលេខគណនី');
      return;
    }

    try {
      if (editingMethod) {
        const updated = await api.updatePaymentMethod(editingMethod.id, {
          providerName: providerName.trim(),
          accountName: accountName.trim(),
          accountNumber: accountNumber.trim(),
          currency,
          qrImage,
          enabled,
        });
        setMethods((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      } else {
        const created = await api.createPaymentMethod({
          providerName: providerName.trim(),
          accountName: accountName.trim(),
          accountNumber: accountNumber.trim(),
          currency,
          qrImage,
          enabled,
        });
        setMethods([...methods, created]);
      }
      setIsModalOpen(false);
    } catch {
      setErrorMsg('Failed to save payment method.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h2 className="font-moul text-xl text-gold-gradient mb-1">
            កាដូ & ចំណងដៃមង្គលការ (Gifts & Payment Methods)
          </h2>
          <p className="text-xs text-stone-400">
            បន្ថែម និងកែប្រែមធ្យោបាយចំណងដៃឌីជីថល (ABA, ACLEDA, Wing...) ព្រមទាំង Upload រូប QR Code
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>បន្ថែមគណនីទូទាត់</span>
        </button>
      </div>

      {/* Methods Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-stone-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-400 mb-2" />
            <p className="text-xs">កំពុងផ្ទុកទិន្នន័យ...</p>
          </div>
        ) : methods.length === 0 ? (
          <div className="col-span-full py-12 text-center text-stone-400 p-8 rounded-2xl bg-[#141210] border border-stone-800">
            <Gift className="w-8 h-8 text-stone-600 mx-auto mb-2" />
            <p className="text-xs">មិនទាន់មានគណនីទូទាត់ណាមួយនៅឡើយទេ។ ចុច «បន្ថែមគណនីទូទាត់» ដើម្បីចាប់ផ្តើម។</p>
          </div>
        ) : (
          methods.map((method) => (
            <div
              key={method.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                method.enabled
                  ? 'bg-[#141210] border-amber-500/30 shadow-lg'
                  : 'bg-[#100e0d] border-stone-800 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-100 text-sm">
                        {method.providerName}
                      </h4>
                      <span className="text-[10px] text-amber-400/90 font-mono">
                        {method.currency}
                      </span>
                    </div>
                  </div>

                  {/* Toggle button */}
                  <button
                    onClick={() => handleToggleEnabled(method)}
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium cursor-pointer transition-colors ${
                      method.enabled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    {method.enabled ? 'ដំណើរការ (Active)' : 'បានបិទ'}
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-stone-300 mb-4 bg-black/40 p-3 rounded-xl border border-stone-800">
                  <div className="flex justify-between">
                    <span className="text-stone-400">ឈ្មោះគណនី៖</span>
                    <span className="font-medium text-stone-200">{method.accountName || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">លេខគណនី៖</span>
                    <span className="font-mono font-bold text-amber-200">{method.accountNumber}</span>
                  </div>
                </div>

                {/* QR Image Preview */}
                <div className="mb-4 text-center">
                  {method.qrImage ? (
                    <div className="relative inline-block group">
                      <img
                        src={method.qrImage}
                        alt={`QR Code ${method.providerName}`}
                        className="w-24 h-24 object-contain rounded-lg border border-amber-500/30 bg-white p-1 mx-auto"
                      />
                      <button
                        onClick={() => setPreviewModalImg(method.qrImage)}
                        className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-lg border border-dashed border-stone-700 bg-stone-900/60 flex flex-col items-center justify-center text-stone-500 text-[10px] mx-auto">
                      <QrCode className="w-6 h-6 mb-1 opacity-50" />
                      <span>គ្មាន QR រូប</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800/80">
                <button
                  onClick={() => handleOpenEdit(method)}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer border border-stone-700"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>កែប្រែ</span>
                </button>
                <button
                  onClick={() => handleDelete(method.id, method.providerName)}
                  className="p-1.5 rounded-lg hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 transition-colors cursor-pointer"
                  title="លុប"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#141210] rounded-2xl border border-amber-500/30 p-6 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-moul text-base text-gold-gradient mb-1">
              {editingMethod ? 'កែប្រែគណនីទូទាត់' : 'បន្ថែមគណនីទូទាត់ថ្មី'}
            </h3>
            <p className="text-xs text-stone-400 mb-4">
              បញ្ចូលព័ត៌មានធនាគារ និង Upload រូបភាព QR Code សម្រាប់ទទួលចំណងដៃ
            </p>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveMethod} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  ឈ្មោះធនាគារ / ប្រព័ន្ធទូទាត់ <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  placeholder="ឧ. ABA Bank, ACLEDA, Wing, TrueMoney..."
                  required
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  ឈ្មោះម្ចាស់គណនី (Account Name)
                </label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="ឧ. SOK VICHET"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    លេខគណនី <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="001 888 999"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    រូបិយប័ណ្ណ
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as 'USD' | 'KHR' | 'BOTH')}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="KHR">KHR (៛)</option>
                    <option value="BOTH">USD & KHR</option>
                  </select>
                </div>
              </div>

              {/* QR Image Upload Box */}
              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  រូបភាព QR Code (Upload Image)
                </label>

                {qrImage ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-stone-800">
                    <img
                      src={qrImage}
                      alt="QR Preview"
                      className="w-14 h-14 object-contain rounded bg-white p-0.5"
                    />
                    <div className="flex-1 text-[11px] text-stone-300">
                      <span className="text-emerald-400 font-medium block">បានភ្ជាប់រូបភាព QR</span>
                      <span className="text-stone-500 text-[10px]">JPEG/PNG/WEBP</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setQrImage('')}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-stone-800"
                      title="លុបរូប"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-stone-700 hover:border-amber-400/60 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-black/30">
                    <Upload className="w-6 h-6 text-stone-400 mb-1" />
                    <span className="text-xs text-stone-300 font-medium">
                      {uploading ? 'កំពុង Upload...' : 'ចុចដើម្បីជ្រើសរើសរូបភាព QR'}
                    </span>
                    <span className="text-[10px] text-stone-500 mt-0.5">
                      គាំទ្រ PNG, JPG, WEBP (ទំហំអតិបរមា 8MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="enabledCheck"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="rounded border-stone-700 bg-black/50 text-amber-500 focus:ring-amber-400"
                />
                <label htmlFor="enabledCheck" className="text-stone-300 cursor-pointer">
                  បង្ហាញមធ្យោបាយនេះនៅលើសំបុត្រអញ្ជើញ (Active)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 font-semibold hover:bg-amber-400 transition-colors shadow-md disabled:opacity-50"
                >
                  {editingMethod ? 'កែប្រែ' : 'រក្សាទុក'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Lightbox Preview */}
      {previewModalImg && (
        <div
          onClick={() => setPreviewModalImg(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm cursor-zoom-out"
        >
          <div className="relative max-w-sm bg-white p-4 rounded-2xl shadow-2xl">
            <button
              onClick={() => setPreviewModalImg(null)}
              className="absolute -top-10 right-0 text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={previewModalImg} alt="QR Code Large" className="w-full h-auto rounded-lg" />
          </div>
        </div>
      )}

    </div>
  );
};
