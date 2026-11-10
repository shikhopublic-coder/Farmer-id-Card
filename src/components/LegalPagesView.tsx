import React, { useState } from 'react';
import {
  Shield,
  FileText,
  RotateCcw,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Send,
} from 'lucide-react';

export type LegalPageType = 'privacy' | 'terms' | 'refund' | 'disclaimer' | 'contact';

interface LegalPagesViewProps {
  activePage: LegalPageType;
  onSelectPage: (page: LegalPageType) => void;
  onBackHome: () => void;
}

export const LegalPagesView: React.FC<LegalPagesViewProps> = ({
  activePage,
  onSelectPage,
  onBackHome,
}) => {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    utr: '',
    subject: 'Payment / UTR Verification Issue',
    message: '',
  });

  const contactInfo = (() => {
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
  })();

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const existingRaw = localStorage.getItem('agristack_support_tickets');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const newTicket = {
        id: `SUP-${Math.floor(100000 + Math.random() * 900000)}`,
        name: contactForm.name,
        email: contactForm.email,
        utr: contactForm.utr,
        subject: contactForm.subject,
        message: contactForm.message,
        timestamp: new Date().toLocaleString('en-IN'),
        status: 'Open',
      };
      localStorage.setItem('agristack_support_tickets', JSON.stringify([newTicket, ...existing]));
    } catch (err) {
      console.warn('Could not save support ticket:', err);
    }
    setContactSubmitted(true);
    setTimeout(() => {
      setContactForm({
        name: '',
        email: '',
        utr: '',
        subject: 'Payment / UTR Verification Issue',
        message: '',
      });
    }, 400);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-slate-800">
      {/* Top Bar: Back to Home */}
      <div className="flex items-center justify-between pb-2">
        <button
          type="button"
          onClick={onBackHome}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer w-fit shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-6">
        {/* ================= 1. PRIVACY POLICY ================= */}
        {activePage === 'privacy' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-5 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Data Protection & Privacy</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                Privacy Policy
              </h1>
              <p className="text-xs text-slate-500">
                Last Updated: November 2026 · Effective Immediately
              </p>
            </div>

            <div className="space-y-5 text-sm text-slate-600 leading-relaxed">
              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">
                  1. Overview & Commitment to Privacy
                </h2>
                <p>
                  We value the privacy and security of our users, farmers, and Common Service Center (CSC) operators. This Privacy Policy explains how information is handled when you upload registration PDFs, format Kisan ID Cards, and process print sheets on our platform.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">
                  2. Information Processed During Card Generation
                </h2>
                <p>
                  When you upload an AgriStack / Farmer Registration PDF document to generate a printable PVC card, our automated optical character recognition (OCR) system processes the following fields strictly to populate your card preview:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li>Farmer Full Name, Regional Script Name, Gender, and Date of Birth</li>
                  <li>Passport-style photograph cropped from Page 1 of the uploaded PDF</li>
                  <li>Farmer ID, Aadhaar Reference, Mobile Number, and Residential Address</li>
                  <li>Land Survey / Khata / Khasra numbers and plot area in Hectares</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">
                  3. Zero Permanent Storage of Uploaded PDFs
                </h2>
                <p>
                  Uploaded PDF files and extracted personal details are processed ephemerally in active memory solely for the duration of your card generation session. We do not permanently store, archive, sell, or share uploaded farmer registration PDFs, Aadhaar numbers, or photographs in any public or third-party database. Once you download your card or close the browser tab, your session data is cleared.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">
                  4. Payment & Transaction Data
                </h2>
                <p>
                  For card unlocking and printing fees, payments are completed directly via standard UPI apps (PhonePe, Google Pay, Paytm, BHIM). We only record the 12-digit UPI UTR / Reference Number for transaction verification and customer support reconciliation. We never collect or store bank account passwords, UPI PINs, or debit/credit card numbers.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">
                  5. Data Security Measures
                </h2>
                <p>
                  All communication between your browser and our document processing service is encrypted over HTTPS/TLS. Temporary image buffers created during passport photo auto-cropping are immediately deleted from the server disk as soon as the cropped image is returned to your browser.
                </p>
              </section>
            </div>
          </div>
        )}

        {/* ================= 2. TERMS & CONDITIONS ================= */}
        {activePage === 'terms' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-5 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>User Agreement</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                Terms & Conditions
              </h1>
              <p className="text-xs text-slate-500">
                Last Updated: November 2026 · Please read carefully before using the portal
              </p>
            </div>

            <div className="space-y-5 text-sm text-slate-600 leading-relaxed">
              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing and using this Digital Farmer ID Card Studio & Printing Utility, you agree to comply with and be bound by these Terms & Conditions. If you do not agree with any part of these terms, please discontinue use of the website immediately.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">
                  2. Nature of Service
                </h2>
                <p>
                  This platform provides an automated document formatting and CR80 PVC card layout service that converts user-uploaded Farmer Registration PDFs into print-ready front and back ID card layouts. The fee charged on the platform is strictly a software utility and formatting service charge.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">
                  3. User & Operator Responsibilities
                </h2>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li>You must only upload authentic registration PDFs belonging to yourself or a customer who has explicitly authorized you to print their card.</li>
                  <li>Before downloading or printing the PVC card, you are responsible for verifying that the auto-extracted fields (Name, DOB, Aadhaar, Mobile No., Farmer ID, and Land Records) match the original PDF document.</li>
                  <li>You must not use this tool to fabricate, alter, or forge false identity credentials.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">
                  4. Single-Session Card Download Policy
                </h2>
                <p>
                  Each verified UPI payment unlocks the generated card for the uploaded PDF document. Once you download the card (Front PNG, Back PNG, or A4 Print PDF), the session completes and automatically returns to the Home page for the next document.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">
                  5. Limitation of Liability
                </h2>
                <p>
                  The service is provided on an "as-is" and "as-available" basis. While our AI OCR engine strives for 100% accuracy and provides an interactive editor for manual corrections prior to download, we are not liable for typographical errors overlooked by the user prior to printing.
                </p>
              </section>
            </div>
          </div>
        )}

        {/* ================= 3. REFUND & CANCELLATION POLICY ================= */}
        {activePage === 'refund' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-5 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                <span>Payments & Refunds</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                Refund & Cancellation Policy
              </h1>
              <p className="text-xs text-slate-500">
                Transparent policy for UPI QR payments and UTR verifications
              </p>
            </div>

            <div className="space-y-5 text-sm text-slate-600 leading-relaxed">
              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">
                  1. Digital Service Delivery
                </h2>
                <p>
                  Because our platform delivers instant digital card generation and downloadable high-resolution PNG/PDF files immediately upon 12-digit UTR verification, completed downloads are generally non-refundable once the card has been unlocked and downloaded.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">
                  2. Eligible Cases for 100% Refund
                </h2>
                <p>
                  You are eligible for a full refund or free card credit under the following circumstances:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li><strong>Duplicate Payment:</strong> You accidentally scanned and paid twice for the same PDF upload.</li>
                  <li><strong>Technical Failure:</strong> Your UPI payment was deducted and a valid 12-digit UTR was generated, but the card failed to unlock or download due to a server error.</li>
                  <li><strong>Corrupted Output:</strong> The PDF parser failed to load your document and you were unable to edit or export your card.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">
                  3. How to Request a Refund
                </h2>
                <p>
                  To request a refund, please visit the <strong>Contact Us</strong> page and submit your:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li>12-Digit UPI UTR / Reference Number</li>
                  <li>Date and approximate time of transaction</li>
                  <li>UPI ID or mobile number used for payment</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">
                  4. Refund Processing Timeline
                </h2>
                <p>
                  All verified refund requests are processed within <strong>24 to 48 business hours</strong> and credited directly back to the original source UPI account.
                </p>
              </section>
            </div>
          </div>
        )}

        {/* ================= 4. DISCLAIMER ================= */}
        {activePage === 'disclaimer' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-5 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Important Legal Notice</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                Disclaimer
              </h1>
              <p className="text-xs text-slate-500">
                Public Notice Regarding Independent Formatting Utility
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 text-xs sm:text-sm font-medium leading-relaxed">
              <strong>Important Notice:</strong> This website is an independent document formatting and PVC card layout studio designed to help farmers and CSC / Jan Seva Kendra operators convert bulky A4 registration PDFs into pocket-sized CR80 PVC cards. It is <strong>not</strong> affiliated with, endorsed by, or operated by the Ministry of Agriculture & Farmers Welfare or any State Government department.
            </div>

            <div className="space-y-5 text-sm text-slate-600 leading-relaxed">
              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">
                  1. No Government Affiliation
                </h2>
                <p>
                  All official government emblems, AgriStack references, and state registry titles appearing on the generated card templates are reproduced strictly as part of the user's uploaded registration record for layout fidelity. We do not issue new Farmer IDs or modify official government records.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">
                  2. Accuracy of Information
                </h2>
                <p>
                  The card generated by this tool reflects the data extracted from the PDF uploaded by the user. Users are provided with a full interactive editor to review and correct any field before downloading or printing. The platform assumes no responsibility for errors in the underlying PDF document provided by the user.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">
                  3. Official Portal Reference
                </h2>
                <p>
                  For official farmer registration, e-KYC, or government land record updates, users should always visit their respective state's official AgriStack portal (`agristack.gov.in`).
                </p>
              </section>
            </div>
          </div>
        )}

        {/* ================= 5. CONTACT US ================= */}
        {activePage === 'contact' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-5 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                <span>24×7 Helpdesk & Support</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                Contact Us
              </h1>
              <p className="text-xs text-slate-500">
                Have a question about PDF upload, UTR verification, or bulk CSC printing? Reach out to our team.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Contact Information Cards */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Support Email
                    </h3>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {contactInfo.email}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {contactInfo.emailNote}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      CSC Operator Helpline
                    </h3>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {contactInfo.phone}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {contactInfo.phoneNote}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Operating Hours
                    </h3>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {contactInfo.hours}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {contactInfo.hoursNote}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Office Address
                    </h3>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {contactInfo.addressTitle}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {contactInfo.addressLine}
                    </p>
                  </div>
                </div>
              </div>

              {/* Support Ticket Form */}
              <div className="lg:col-span-7">
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90">
                  <h2 className="text-base font-bold text-slate-900 mb-1">
                    Submit a Support or Refund Ticket
                  </h2>
                  <p className="text-xs text-slate-500 mb-4">
                    Fill out the form below with your 12-digit UTR number if your query relates to a payment.
                  </p>

                  {contactSubmitted ? (
                    <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-emerald-950">
                        Support Request Received!
                      </h3>
                      <p className="text-xs text-emerald-800 max-w-md mx-auto">
                        Thank you for reaching out. Your ticket reference ID is <strong>#SUP-{Math.floor(100000 + Math.random() * 900000)}</strong>. Our support team will respond to your email shortly.
                      </p>
                      <button
                        type="button"
                        onClick={() => setContactSubmitted(false)}
                        className="px-4 py-2 text-xs font-bold text-emerald-800 bg-white border border-emerald-300 rounded-xl hover:bg-emerald-100 transition-colors cursor-pointer"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-3.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Your Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={contactForm.name}
                            onChange={(e) =>
                              setContactForm({ ...contactForm, name: e.target.value })
                            }
                            placeholder="e.g. Rajesh Sharma"
                            className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Email or Mobile Number *
                          </label>
                          <input
                            type="text"
                            required
                            value={contactForm.email}
                            onChange={(e) =>
                              setContactForm({ ...contactForm, email: e.target.value })
                            }
                            placeholder="e.g. yourname@gmail.com / 9876543210"
                            className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Issue Category
                          </label>
                          <select
                            value={contactForm.subject}
                            onChange={(e) =>
                              setContactForm({ ...contactForm, subject: e.target.value })
                            }
                            className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          >
                            <option value="Payment / UTR Verification Issue">
                              Payment / UTR Verification Issue
                            </option>
                            <option value="Refund Request">Refund Request</option>
                            <option value="PDF Auto-Fill / Photo Crop Issue">
                              PDF Auto-Fill / Photo Crop Issue
                            </option>
                            <option value="General Inquiry">General Inquiry</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            12-Digit UPI UTR No. (Optional)
                          </label>
                          <input
                            type="text"
                            value={contactForm.utr}
                            onChange={(e) =>
                              setContactForm({ ...contactForm, utr: e.target.value })
                            }
                            placeholder="e.g. 432109876543"
                            className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Message / Details *
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={contactForm.message}
                          onChange={(e) =>
                            setContactForm({ ...contactForm, message: e.target.value })
                          }
                          placeholder="Describe your issue or inquiry..."
                          className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 px-4 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Support Message</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
