import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  LogOut,
  IndianRupee,
  QrCode,
  FileSpreadsheet,
  CheckCircle2,
  Trash2,
  Search,
  Settings,
  KeyRound,
  Mail,
  ArrowLeft,
  Save,
  Download,
  TrendingUp,
  Users,
  CreditCard,
  Upload,
  RotateCcw,
  Phone,
  Clock,
  MapPin,
} from 'lucide-react';

export interface PaymentTransaction {
  id: string;
  farmerName: string;
  farmerId: string;
  utr: string;
  amount: number;
  upiId: string;
  timestamp: string;
  status: 'Verified' | 'Refunded';
}

export interface SupportTicket {
  id: string;
  name: string;
  email: string;
  utr: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'Open' | 'Resolved';
}

interface AdminPortalProps {
  onBackHome: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackHome }) => {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('agristack_admin_auth') === 'true';
  });
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Admin active tab
  const [adminTab, setAdminTab] = useState<'overview' | 'upi' | 'contact_info' | 'tickets' | 'security'>('overview');

  // UPI & Payment Settings
  const [upiId, setUpiId] = useState<string>(
    () => localStorage.getItem('agristack_upi_id') || 'agristack.csc@upi'
  );
  const [payeeName, setPayeeName] = useState<string>(
    () => localStorage.getItem('agristack_payee_name') || 'AgriStack Kisan Card'
  );
  const [amount, setAmount] = useState<string>(
    () => localStorage.getItem('agristack_charge_amount') || '20'
  );
  const [paymentEnabled, setPaymentEnabled] = useState<boolean>(
    () => localStorage.getItem('agristack_payment_enabled') !== 'false'
  );
  const [gatewayMode, setGatewayMode] = useState<'upi_qr' | 'gateway_only' | 'both'>(
    () => (localStorage.getItem('agristack_gateway_mode') as any) || 'both'
  );
  const [pgProvider, setPgProvider] = useState<string>(
    () => localStorage.getItem('agristack_pg_provider') || 'Razorpay'
  );
  const [pgKeyId, setPgKeyId] = useState<string>(
    () => localStorage.getItem('agristack_pg_key_id') || ''
  );
  const [pgSecretKey, setPgSecretKey] = useState<string>(
    () => localStorage.getItem('agristack_pg_secret') || ''
  );
  const [pgLink, setPgLink] = useState<string>(
    () => localStorage.getItem('agristack_pg_link') || ''
  );
  const [customQrImage, setCustomQrImage] = useState<string>(
    () => localStorage.getItem('agristack_custom_qr_image') || ''
  );
  const [qrPreview, setQrPreview] = useState<string>('');
  const [saveBanner, setSaveBanner] = useState<string | null>(null);
  const qrInputRef = React.useRef<HTMLInputElement>(null);
  const upiInputRef = React.useRef<HTMLInputElement>(null);

  // Transactions & Support Tickets
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => {
    try {
      const raw = localStorage.getItem('agristack_transactions');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [searchQuery, setSearchQuery] = useState('');

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    try {
      const raw = localStorage.getItem('agristack_support_tickets');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Admin Credentials update state
  const [newAdminUser, setNewAdminUser] = useState<string>(
    () => localStorage.getItem('agristack_admin_user') || 'admin'
  );
  const [newAdminPass, setNewAdminPass] = useState<string>('');
  const [confirmAdminPass, setConfirmAdminPass] = useState<string>('');

  // Contact Us Page Information (Editable by Admin)
  const [contactInfo, setContactInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('agristack_contact_info');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      email: 'support@kisancardstudio.in',
      emailNote: 'Average response time: Under 2 hours',
      phone: '+91 1800-115-526 (Toll-Free)',
      phoneNote: 'Available on WhatsApp & Voice Support',
      hours: 'Monday – Sunday (8:00 AM to 10:00 PM IST)',
      hoursNote: 'Automated PDF Card Studio runs 24×7',
      addressTitle: 'Digital CSC Utility Center',
      addressLine: 'Dispur, Guwahati, Assam – 781006, India',
    };
  });

  const handleSaveContactInfo = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('agristack_contact_info', JSON.stringify(contactInfo));
    setSaveBanner('Contact Us page details updated successfully!');
    setTimeout(() => setSaveBanner(null), 3000);
  };

  // Generate QR preview in UPI Settings tab
  useEffect(() => {
    const generatePreview = async () => {
      try {
        const upiUrl = `upi://pay?pa=${upiId.trim()}&pn=${encodeURIComponent(
          payeeName.trim() || 'AgriStack Kisan Card'
        )}&am=${ parseInt(amount, 10) || 20 }&cu=INR`;
        const dataUrl = await QRCode.toDataURL(upiUrl, {
          width: 220,
          margin: 1,
          color: { dark: '#064e3b', light: '#ffffff' },
        });
        setQrPreview(dataUrl);
      } catch (err) {
        console.error('QR preview error:', err);
      }
    };
    if (isLoggedIn) {
      generatePreview();
    }
  }, [isLoggedIn, upiId, payeeName, amount]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const savedUser = localStorage.getItem('agristack_admin_user') || 'admin';
    const savedPass = localStorage.getItem('agristack_admin_pass') || 'admin123';

    if (
      usernameInput.trim().toLowerCase() === savedUser.toLowerCase() &&
      passwordInput === savedPass
    ) {
      setIsLoggedIn(true);
      sessionStorage.setItem('agristack_admin_auth', 'true');
    } else {
      setLoginError('Invalid Admin Username or Password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('agristack_admin_auth');
    setUsernameInput('');
    setPasswordInput('');
  };

  const handleSavePaymentSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUpi = upiId.trim() || 'agristack.csc@upi';
    const cleanName = payeeName.trim() || 'AgriStack Kisan Card';
    const parsedAmt = Math.max(1, parseInt(amount, 10) || 20);

    localStorage.setItem('agristack_upi_id', cleanUpi);
    localStorage.setItem('agristack_payee_name', cleanName);
    localStorage.setItem('agristack_charge_amount', parsedAmt.toString());
    localStorage.setItem('agristack_payment_enabled', paymentEnabled ? 'true' : 'false');
    localStorage.setItem('agristack_gateway_mode', gatewayMode);
    localStorage.setItem('agristack_pg_provider', pgProvider);
    localStorage.setItem('agristack_pg_key_id', pgKeyId.trim());
    localStorage.setItem('agristack_pg_secret', pgSecretKey.trim());
    localStorage.setItem('agristack_pg_link', pgLink.trim());

    setUpiId(cleanUpi);
    setPayeeName(cleanName);
    setAmount(parsedAmt.toString());
    setSaveBanner('Payment Gateway & UPI QR Settings saved successfully!');
    setTimeout(() => setSaveBanner(null), 3000);
  };

  const handleCustomQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setCustomQrImage(dataUrl);
      localStorage.setItem('agristack_custom_qr_image', dataUrl);
      setSaveBanner('Custom QR Code image uploaded and activated!');
      setTimeout(() => setSaveBanner(null), 3000);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleResetCustomQr = () => {
    setCustomQrImage('');
    localStorage.removeItem('agristack_custom_qr_image');
    setSaveBanner('Reverted to auto-generated Dynamic UPI QR Code!');
    setTimeout(() => setSaveBanner(null), 3000);
  };

  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUser.trim()) return;
    if (newAdminPass && newAdminPass !== confirmAdminPass) {
      setSaveBanner('Error: Passwords do not match!');
      setTimeout(() => setSaveBanner(null), 3000);
      return;
    }

    localStorage.setItem('agristack_admin_user', newAdminUser.trim());
    if (newAdminPass.trim()) {
      localStorage.setItem('agristack_admin_pass', newAdminPass.trim());
    }
    setNewAdminPass('');
    setConfirmAdminPass('');
    setSaveBanner('Admin login credentials updated successfully!');
    setTimeout(() => setSaveBanner(null), 3000);
  };

  const handleToggleTransactionStatus = (id: string) => {
    const updated: PaymentTransaction[] = transactions.map((t) =>
      t.id === id
        ? { ...t, status: t.status === 'Verified' ? 'Refunded' : 'Verified' }
        : t
    );
    setTransactions(updated);
    localStorage.setItem('agristack_transactions', JSON.stringify(updated));
  };

  const handleClearTransactions = () => {
    setTransactions([]);
    localStorage.removeItem('agristack_transactions');
  };

  const handleExportCsv = () => {
    if (transactions.length === 0) return;
    const headers = ['Transaction ID,Date & Time,Farmer Name,Farmer ID,UTR Number,Amount (INR),UPI ID,Status'];
    const rows = transactions.map(
      (t) =>
        `"${t.id}","${t.timestamp}","${t.farmerName}","${t.farmerId}","${t.utr}",${t.amount},"${t.upiId}","${t.status}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KisanCard_UTR_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleTicketStatus = (id: string) => {
    const updated: SupportTicket[] = tickets.map((tk) =>
      tk.id === id
        ? { ...tk, status: tk.status === 'Open' ? 'Resolved' : 'Open' }
        : tk
    );
    setTickets(updated);
    localStorage.setItem('agristack_support_tickets', JSON.stringify(updated));
  };

  // ================= 1. ADMIN LOGIN VIEW =================
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <button
          type="button"
          onClick={onBackHome}
          className="mb-6 inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700" />

          <div className="p-7 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-md">
                <Lock className="w-7 h-7" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Authorized Access Only</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 font-serif">
                Login
              </h1>
              <p className="text-xs text-slate-500">
                Sign in to manage Payment Gateway, UPI QR settings, card charges, and UTR payment logs.
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Admin Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Enter username (e.g. admin)"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-10 py-2.5 text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Login</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ================= 2. ADMIN DASHBOARD VIEW =================
  const totalRevenue = transactions
    .filter((t) => t.status === 'Verified')
    .reduce((acc, item) => acc + (Number(item.amount) || 0), 0);

  const filteredTransactions = transactions.filter(
    (t) =>
      t.utr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.farmerId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Admin Header Bar */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-sm shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 font-serif">
                Admin Control Dashboard
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded-full uppercase">
                Active Session
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Manage UPI QR Gateway, Card Unlock Fees, 12-Digit UTR Payments, and Customer Support
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onBackHome}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View Website</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Save Confirmation Toast */}
      {saveBanner && (
        <div className="p-4 rounded-2xl bg-emerald-900 text-white text-xs font-bold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{saveBanner}</span>
          </div>
        </div>
      )}

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Revenue
            </p>
            <p className="text-2xl font-black text-emerald-700 mt-1">₹{totalRevenue}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Verified UTR Payments</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Cards Unlocked
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">{transactions.length}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Total UTR Verifications</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Per Card Charge
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {paymentEnabled ? `₹${amount}` : 'FREE'}
            </p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-0.5 truncate max-w-[160px]">
              {upiId}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Support Tickets
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {tickets.filter((t) => t.status === 'Open').length} Open
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">{tickets.length} Total Inquiries</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
        <button
          type="button"
          onClick={() => setAdminTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'overview'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>UTR Payment Logs ({transactions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('upi')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'upi'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment Gateway & QR Setup</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('contact_info')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'contact_info'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Contact Us Page Setup</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('tickets')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'tickets'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Support & Refund Tickets ({tickets.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'security'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Admin Password & Security</span>
        </button>
      </div>

      {/* TAB 1: UTR PAYMENT LOGS */}
      {adminTab === 'overview' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                12-Digit UTR Payment & Card Unlock History
              </h2>
              <p className="text-xs text-slate-500">
                Real-time log of every farmer PDF unlocked through the UPI payment gateway
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search UTR, Farmer Name or ID..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {transactions.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClearTransactions}
                    className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Logs</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="py-12 text-center space-y-2 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <QrCode className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No UTR Transactions Recorded Yet</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Whenever a user uploads a farmer registration PDF and verifies their 12-digit UTR number, the payment record will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase">
                  <tr>
                    <th className="py-3 px-4 font-bold">Date & Time</th>
                    <th className="py-3 px-4 font-bold">Farmer Name</th>
                    <th className="py-3 px-4 font-bold">Farmer ID</th>
                    <th className="py-3 px-4 font-bold">12-Digit UTR No.</th>
                    <th className="py-3 px-4 font-bold">Amount</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 text-slate-500 font-mono">{tx.timestamp}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{tx.farmerName}</td>
                      <td className="py-3 px-4 font-mono text-slate-700">{tx.farmerId}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-800">{tx.utr}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">₹{tx.amount}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            tx.status === 'Verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleTransactionStatus(tx.id)}
                          className="text-[11px] font-bold text-slate-600 hover:text-emerald-700 underline cursor-pointer"
                        >
                          {tx.status === 'Verified' ? 'Mark Refunded' : 'Mark Verified'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PAYMENT GATEWAY & UPI QR SETTINGS */}
      {adminTab === 'upi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Payment Gateway & UPI QR Configuration
              </h2>
              <p className="text-xs text-slate-500">
                Attach your Online Payment Gateway (Razorpay, PhonePe, Paytm, Cashfree) or UPI QR code.
              </p>
            </div>

            <form onSubmit={handleSavePaymentSettings} className="space-y-4">
              {/* Enable / Disable Payment Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Require Payment Before Showing Card
                  </p>
                  <p className="text-[11px] text-slate-500">
                    When enabled, users must complete payment via Payment Gateway or UPI QR after PDF upload.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={paymentEnabled}
                  onChange={(e) => setPaymentEnabled(e.target.checked)}
                  className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              {/* Payment Collection Mode */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Active Payment Collection Mode *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'both', label: 'Gateway + UPI QR (Both)' },
                    { id: 'gateway_only', label: 'Payment Gateway Only' },
                    { id: 'upi_qr', label: 'UPI QR + UTR Only' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setGatewayMode(mode.id as any)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                        gatewayMode === mode.id
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Online Payment Gateway Setup Box */}
              {(gatewayMode === 'both' || gatewayMode === 'gateway_only') && (
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-emerald-700" />
                      <span>Online Payment Gateway Integration</span>
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-white text-emerald-800 rounded-full border border-emerald-200">
                      Instant Auto-Unlock
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Select Payment Gateway Provider
                      </label>
                      <select
                        value={pgProvider}
                        onChange={(e) => setPgProvider(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="Razorpay">Razorpay Payment Gateway</option>
                        <option value="PhonePe PG">PhonePe Business Gateway</option>
                        <option value="Paytm PG">Paytm Payment Gateway</option>
                        <option value="Cashfree">Cashfree Payments</option>
                        <option value="Custom Gateway">Custom Payment Link</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        API Key ID / Merchant ID
                      </label>
                      <input
                        type="text"
                        value={pgKeyId}
                        onChange={(e) => setPgKeyId(e.target.value)}
                        placeholder="e.g. rzp_live_xxxxxxxxxxxx"
                        className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        API Secret / Salt Key (Optional)
                      </label>
                      <input
                        type="password"
                        value={pgSecretKey}
                        onChange={(e) => setPgSecretKey(e.target.value)}
                        placeholder="Enter Gateway Secret Key"
                        className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Payment Link URL (Optional)
                      </label>
                      <input
                        type="text"
                        value={pgLink}
                        onChange={(e) => setPgLink(e.target.value)}
                        placeholder="e.g. https://razorpay.me/@merchant"
                        className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI ID & Amount Fields */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Receiving Merchant UPI ID *
                </label>
                <input
                  ref={upiInputRef}
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. yourname@oksbi or 9876543210@ybl"
                  className="w-full px-3.5 py-2.5 text-sm font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Merchant / Payee Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={payeeName}
                    onChange={(e) => setPayeeName(e.target.value)}
                    placeholder="AgriStack Kisan Card"
                    className="w-full px-3.5 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Per Card Fee Amount (₹ INR) *
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="number"
                      min="1"
                      max="2000"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm font-bold bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Payment Gateway & QR Settings</span>
              </button>
            </form>
          </div>

          {/* Live QR Preview Card with Direct Change / Upload QR Option */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col items-center justify-center text-center space-y-3.5">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              {customQrImage ? 'Custom Uploaded QR Code Active' : 'Live Payment QR Code Preview'}
            </span>

            {/* Selected QR Code Box with Change Overlay & Action */}
            <div className="p-3 bg-white rounded-2xl border-2 border-emerald-200 shadow-sm relative group">
              <input
                ref={qrInputRef}
                type="file"
                accept="image/*"
                onChange={handleCustomQrUpload}
                className="hidden"
              />
              {customQrImage || qrPreview ? (
                <img
                  src={customQrImage || qrPreview}
                  alt="Admin UPI QR Preview"
                  onClick={() => qrInputRef.current?.click()}
                  title="Click to upload or change QR Code image"
                  className="w-48 h-48 object-contain cursor-pointer rounded-lg"
                />
              ) : null}

              <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => qrInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{customQrImage ? 'Change QR Image' : 'Upload Custom QR'}</span>
                </button>

                {customQrImage && (
                  <button
                    type="button"
                    onClick={handleResetCustomQr}
                    className="px-2.5 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                    title="Reset to Auto UPI QR"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Auto QR</span>
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-0.5">
              <p className="text-sm font-extrabold text-slate-900">{payeeName}</p>
              <p className="text-xs font-mono text-emerald-700 font-bold">{upiId}</p>
              <p className="text-lg font-black text-slate-900 pt-1">₹{amount} / Card</p>
              <button
                type="button"
                onClick={() => upiInputRef.current?.focus()}
                className="mt-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
              >
                Edit UPI ID & Fee Amount
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONTACT US PAGE SETUP */}
      {adminTab === 'contact_info' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Update Contact Us Page Information
            </h2>
            <p className="text-xs text-slate-500">
              Customize the Support Email, Helpline Phone Number, Operating Hours, and Office Address displayed on the public Contact Us page.
            </p>
          </div>

          <form onSubmit={handleSaveContactInfo} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Card 1: Support Email */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-900 uppercase tracking-wider">
                  <Mail className="w-4 h-4 text-emerald-700" />
                  <span>1. Support Email Box</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Support Email Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    placeholder="support@kisancardstudio.in"
                    className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Response Time / Subtitle
                  </label>
                  <input
                    type="text"
                    value={contactInfo.emailNote}
                    onChange={(e) => setContactInfo({ ...contactInfo, emailNote: e.target.value })}
                    placeholder="Average response time: Under 2 hours"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Card 2: CSC Operator Helpline */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-900 uppercase tracking-wider">
                  <Phone className="w-4 h-4 text-emerald-700" />
                  <span>2. CSC Operator Helpline Box</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Helpline / Mobile / WhatsApp Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    placeholder="+91 1800-115-526 (Toll-Free)"
                    className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Helpline Subtitle / Note
                  </label>
                  <input
                    type="text"
                    value={contactInfo.phoneNote}
                    onChange={(e) => setContactInfo({ ...contactInfo, phoneNote: e.target.value })}
                    placeholder="Available on WhatsApp & Voice Support"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Card 3: Operating Hours */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-900 uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span>3. Operating Hours Box</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Working Days & Timings *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactInfo.hours}
                    onChange={(e) => setContactInfo({ ...contactInfo, hours: e.target.value })}
                    placeholder="Monday – Sunday (8:00 AM to 10:00 PM IST)"
                    className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Operating Hours Subtitle / Note
                  </label>
                  <input
                    type="text"
                    value={contactInfo.hoursNote}
                    onChange={(e) => setContactInfo({ ...contactInfo, hoursNote: e.target.value })}
                    placeholder="Automated PDF Card Studio runs 24×7"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Card 4: Office Address */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-900 uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>4. Office Address Box</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Office / Center Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactInfo.addressTitle}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, addressTitle: e.target.value })
                    }
                    placeholder="Digital CSC Utility Center"
                    className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Street / City / State / PIN Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactInfo.addressLine}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, addressLine: e.target.value })
                    }
                    placeholder="Dispur, Guwahati, Assam – 781006, India"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Contact Us Details</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: SUPPORT & REFUND TICKETS */}
      {adminTab === 'tickets' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Customer Support & Refund Inquiries
            </h2>
            <p className="text-xs text-slate-500">
              Messages submitted via the Contact Us page appear here for admin review
            </p>
          </div>

          {tickets.length === 0 ? (
            <div className="py-12 text-center space-y-2 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Mail className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No Support Tickets Yet</p>
              <p className="text-xs text-slate-500">
                Any inquiries submitted on the Contact Us page will be listed here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((tk) => (
                <div
                  key={tk.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          tk.status === 'Open'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {tk.status}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{tk.subject}</span>
                      <span className="text-[11px] text-slate-400 font-mono">· {tk.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-700">{tk.message}</p>
                    <p className="text-[11px] text-slate-500 font-semibold">
                      From: {tk.name} ({tk.email}){' '}
                      {tk.utr ? `· UTR: ${tk.utr}` : ''}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleTicketStatus(tk.id)}
                    className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-white border border-emerald-300 rounded-xl hover:bg-emerald-50 shrink-0 cursor-pointer"
                  >
                    {tk.status === 'Open' ? 'Mark Resolved' : 'Reopen Ticket'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ADMIN PASSWORD & SECURITY */}
      {adminTab === 'security' && (
        <div className="max-w-xl bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Update Admin Login Credentials
            </h2>
            <p className="text-xs text-slate-500">
              Change your administrator username and password for accessing this dashboard.
            </p>
          </div>

          <form onSubmit={handleUpdateCredentials} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Username *
              </label>
              <input
                type="text"
                required
                value={newAdminUser}
                onChange={(e) => setNewAdminUser(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newAdminPass}
                onChange={(e) => setNewAdminPass(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-3.5 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmAdminPass}
                onChange={(e) => setConfirmAdminPass(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Update Admin Credentials</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
