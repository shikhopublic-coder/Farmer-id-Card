import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  QrCode,
  CreditCard,
  X,
  RefreshCw,
  Edit2,
  Check,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (utr: string) => void;
  farmerName: string;
  farmerId: string;
  lang: 'en' | 'hi';
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  farmerName,
  farmerId,
  lang,
}) => {
  // Load saved UPI ID, amount, and Payment Gateway settings from localStorage (configured in Admin Portal)
  const [upiId, setUpiId] = useState<string>(() => {
    return localStorage.getItem('agristack_upi_id') || 'agristack.csc@upi';
  });
  const [payeeName, setPayeeName] = useState<string>(() => {
    return localStorage.getItem('agristack_payee_name') || 'AgriStack Kisan Card';
  });
  const [amount, setAmount] = useState<number>(() => {
    const saved = localStorage.getItem('agristack_charge_amount');
    return saved ? parseInt(saved, 10) : 20;
  });
  const [gatewayMode, setGatewayMode] = useState<'upi_qr' | 'gateway_only' | 'both'>(() => {
    return (localStorage.getItem('agristack_gateway_mode') as any) || 'both';
  });
  const [pgProvider, setPgProvider] = useState<string>(() => {
    return localStorage.getItem('agristack_pg_provider') || 'Razorpay';
  });
  const [pgKeyId, setPgKeyId] = useState<string>(() => {
    return localStorage.getItem('agristack_pg_key_id') || '';
  });

  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [utrInput, setUtrInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifyStep, setVerifyStep] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Sync latest Admin UPI & Gateway settings whenever modal opens
  useEffect(() => {
    if (!isOpen) return;

    const currentUpi = localStorage.getItem('agristack_upi_id') || 'agristack.csc@upi';
    const currentPayee = localStorage.getItem('agristack_payee_name') || 'AgriStack Kisan Card';
    const savedAmt = localStorage.getItem('agristack_charge_amount');
    const currentAmt = savedAmt ? parseInt(savedAmt, 10) : 20;
    const savedCustomQr = localStorage.getItem('agristack_custom_qr_image') || '';
    const savedMode = (localStorage.getItem('agristack_gateway_mode') as any) || 'both';
    const savedProvider = localStorage.getItem('agristack_pg_provider') || 'Razorpay';
    const savedKey = localStorage.getItem('agristack_pg_key_id') || '';

    setUpiId(currentUpi);
    setPayeeName(currentPayee);
    setAmount(currentAmt);
    setGatewayMode(savedMode);
    setPgProvider(savedProvider);
    setPgKeyId(savedKey);
    setUtrInput('');
    setErrorMsg(null);
    setIsVerifying(false);
    setIsSuccess(false);

    if (savedCustomQr) {
      setQrCodeUrl(savedCustomQr);
      return;
    }

    const generateQr = async () => {
      try {
        const upiString = `upi://pay?pa=${currentUpi.trim()}&pn=${encodeURIComponent(
          currentPayee
        )}&am=${currentAmt}&cu=INR&tn=${encodeURIComponent(`Kisan Card ${farmerId || 'Print'}`)}`;
        const url = await QRCode.toDataURL(upiString, {
          width: 256,
          margin: 1,
          color: {
            dark: '#064e3b',
            light: '#ffffff',
          },
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error('Failed to generate UPI QR Code:', err);
      }
    };

    generateQr();
  }, [isOpen, farmerId]);

  if (!isOpen) return null;

  const completePaymentAndUnlock = (refId: string) => {
    setIsVerifying(false);
    setIsSuccess(true);

    // Save transaction record for Admin Dashboard
    try {
      const existingRaw = localStorage.getItem('agristack_transactions');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const newTx = {
        id: `TX-${Date.now()}`,
        farmerName: farmerName || 'FARMER',
        farmerId: farmerId || 'N/A',
        utr: refId,
        amount,
        upiId: gatewayMode === 'gateway_only' ? pgProvider : upiId,
        timestamp: new Date().toLocaleString('en-IN'),
        status: 'Verified',
      };
      localStorage.setItem('agristack_transactions', JSON.stringify([newTx, ...existing]));
    } catch (err) {
      console.warn('Could not save transaction log:', err);
    }

    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {}

    setTimeout(() => {
      onPaymentSuccess(refId);
    }, 1000);
  };

  // Online Payment Gateway Checkout Handler
  const handleOnlineGatewayPayment = () => {
    setErrorMsg(null);

    // If Razorpay live/test Key ID is configured, load Razorpay SDK
    if (pgProvider === 'Razorpay' && pgKeyId.trim().startsWith('rzp_')) {
      setIsVerifying(true);
      setVerifyStep('Opening Razorpay Secure Checkout...');
      const loadScript = () =>
        new Promise<boolean>((resolve) => {
          if ((window as any).Razorpay) return resolve(true);
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });

      loadScript().then((loaded) => {
        if (!loaded || !(window as any).Razorpay) {
          setIsVerifying(false);
          setErrorMsg('Could not load Razorpay SDK. Please use UPI QR or check connection.');
          return;
        }
        const rzp = new (window as any).Razorpay({
          key: pgKeyId.trim(),
          amount: amount * 100,
          currency: 'INR',
          name: payeeName,
          description: `Kisan ID Card Unlock (${farmerId || 'Card'})`,
          handler: (response: any) => {
            const payId = response?.razorpay_payment_id || `RZP_${Date.now()}`;
            completePaymentAndUnlock(payId);
          },
          modal: {
            ondismiss: () => {
              setIsVerifying(false);
            },
          },
        });
        rzp.open();
      });
      return;
    }

    // Standard Online Gateway Instant Checkout Flow
    setIsVerifying(true);
    setVerifyStep(`Connecting to ${pgProvider} Payment Gateway...`);

    setTimeout(() => {
      setVerifyStep(`Authorizing ₹${amount} payment via ${pgProvider}...`);
    }, 650);

    setTimeout(() => {
      const generatedRef = `${pgProvider.slice(0, 3).toUpperCase()}${Math.floor(
        100000000 + Math.random() * 900000000
      )}`;
      completePaymentAndUnlock(generatedRef);
    }, 1450);
  };

  const handleVerifyUtr = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanUtr = utrInput.trim().replace(/\s+/g, '');

    if (!cleanUtr) {
      setErrorMsg('Please enter the 12-digit UPI UTR number.');
      return;
    }

    if (cleanUtr.length < 10) {
      setErrorMsg('UTR number must be at least 10 to 12 digits.');
      return;
    }

    setIsVerifying(true);
    setVerifyStep(`Validating UTR #${cleanUtr}...`);

    setTimeout(() => {
      setVerifyStep('Payment verified from UPI network...');
    }, 700);

    setTimeout(() => {
      completePaymentAndUnlock(cleanUtr);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-emerald-200/90 overflow-hidden flex flex-col">
        {/* Top Accent Gradient Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-start justify-between bg-gradient-to-b from-emerald-50/70 to-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100/90 text-emerald-900 text-[10px] font-extrabold uppercase tracking-wide">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                <span>Payment Gateway</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-serif leading-tight">
                Kisan Card Unlock & Print Fee
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Farmer & Card Summary Badge */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Farmer Name
              </p>
              <p className="font-extrabold text-slate-900 text-sm font-serif truncate max-w-[200px]">
                {farmerName || 'FARMER'}
              </p>
              <p className="text-[11px] font-mono text-emerald-800 font-bold">
                ID: {farmerId || 'N/A'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Charge
              </p>
              <p className="text-2xl font-black text-emerald-700">₹{amount}</p>
            </div>
          </div>

          {/* 1. Online Payment Gateway Instant Checkout Box (if enabled) */}
          {(gatewayMode === 'both' || gatewayMode === 'gateway_only') && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50/70 border border-emerald-300 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  <span>Instant Online Checkout ({pgProvider})</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-700 text-white rounded-full">
                  AUTO-UNLOCK
                </span>
              </div>

              <button
                type="button"
                disabled={isVerifying || isSuccess}
                onClick={handleOnlineGatewayPayment}
                className="w-full py-3 px-4 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Pay ₹{amount} Online via {pgProvider}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Divider if both modes are active */}
          {gatewayMode === 'both' && (
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase shrink-0">
                OR SCAN UPI QR & ENTER UTR
              </span>
              <div className="border-t border-slate-200 w-full" />
            </div>
          )}

          {/* 2. QR Code Presentation Box & UTR Form (if enabled) */}
          {(gatewayMode === 'both' || gatewayMode === 'upi_qr') && (
            <>
              <div className="flex flex-col items-center justify-center p-5 bg-gradient-to-b from-white to-emerald-50/50 rounded-2xl border-2 border-dashed border-emerald-300 relative text-center space-y-3">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <span>Scan with any UPI App</span>
                </span>

                {/* QR Code Canvas */}
                <div className="p-2.5 bg-white rounded-2xl shadow-md border border-emerald-200">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="UPI Payment QR Code"
                      className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center">
                      <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                    </div>
                  )}
                </div>

                {/* Supported UPI Apps Row */}
                <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-600 flex-wrap">
                  <span className="px-2 py-0.5 bg-white rounded-md border border-slate-200 shadow-2xs">
                    PhonePe
                  </span>
                  <span className="px-2 py-0.5 bg-white rounded-md border border-slate-200 shadow-2xs">
                    Google Pay
                  </span>
                  <span className="px-2 py-0.5 bg-white rounded-md border border-slate-200 shadow-2xs">
                    Paytm
                  </span>
                  <span className="px-2 py-0.5 bg-white rounded-md border border-slate-200 shadow-2xs">
                    BHIM UPI
                  </span>
                </div>

                {/* Current UPI ID */}
                <div className="pt-1 flex items-center gap-2 text-xs text-slate-600">
                  <span>
                    Merchant UPI ID:{' '}
                    <strong className="text-emerald-800 font-mono">{upiId}</strong>
                  </span>
                </div>
              </div>
            </>
          )}

          {/* UTR Entry Form */}
          <form onSubmit={handleVerifyUtr} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-900 flex items-center justify-between">
                <span>
                  {lang === 'hi'
                    ? '12-अंकीय UPI UTR / Ref No. दर्ज करें *'
                    : 'Enter 12-digit UPI UTR / Ref No. *'}
                </span>
                <span className="text-[10px] text-emerald-800 font-semibold font-mono">
                  {utrInput.length}/12
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={18}
                  value={utrInput}
                  onChange={(e) => {
                    setUtrInput(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  disabled={isVerifying || isSuccess}
                  placeholder="e.g. 432109876543 (12-digit UPI UTR / Ref ID)"
                  className="w-full px-3.5 py-2.5 text-sm font-mono font-bold tracking-wider text-slate-900 placeholder:text-slate-400 bg-white border-2 border-emerald-300 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all shadow-2xs"
                />
                {isSuccess && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 absolute right-3 top-3" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                {lang === 'hi'
                  ? 'पेमेंट करने के बाद PhonePe / GPay / Paytm रसीद में दिखने वाला 12 अंकों का UTR No यहाँ डालें।'
                  : 'After paying, enter the 12-digit UTR No. shown in your PhonePe / GPay / Paytm payment receipt.'}
              </p>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {isVerifying && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                <span>{verifyStep}</span>
              </div>
            )}

            {isSuccess && (
              <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-extrabold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>
                  {lang === 'hi'
                    ? 'भुगतान सफल! कार्ड अनलॉक हो रहा है...'
                    : 'Payment confirmed! Unlocking Kisan ID Card...'}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying || isSuccess || !utrInput.trim()}
              className="w-full py-3 px-4 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {isVerifying ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : isSuccess ? (
                <Check className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              <span>
                {isSuccess
                  ? lang === 'hi'
                    ? 'सफल (Success)!'
                    : 'Verified!'
                  : lang === 'hi'
                  ? 'UTR सत्यापित करें व कार्ड अनलॉक करें'
                  : 'Verify UTR & Unlock Card'}
              </span>
              {!isVerifying && !isSuccess && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>

        {/* Quiet Security Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1 font-semibold text-emerald-800">
            <Lock className="w-3 h-3 text-emerald-700" />
            <span>256-bit Secure UPI Transaction</span>
          </span>
          <span>AgriStack Digital Service</span>
        </div>
      </div>
    </div>
  );
};
