import { useState, useEffect } from 'react';
import { X, Check, ShieldCheck, Sparkles, CreditCard, Lock, Key, RefreshCw, Loader } from 'lucide-react';
import {
  isNativeBillingAvailable,
  fetchStoreProducts,
  purchaseSubscription,
  restoreStorePurchases,
  hasActiveProPurchase,
  buildLicenseFromTransaction,
  PRODUCT_IDS,
} from '../services/billingService';
import './SubscriptionModal.css';

function GooglePlayLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.6 1.8A1.8 1.8 0 0 0 3 3.3v17.4a1.8 1.8 0 0 0 .6 1.5l.1.1 9.8-9.8v-.2L3.7 1.7l-.1.1z" fill="#4285F4" />
      <path d="M17.1 15.6l-3.6-3.6v-.2l3.6-3.6.1.1 4.3 2.4c1.2.7 1.2 1.9 0 2.6l-4.4 2.3z" fill="#FBBC04" />
      <path d="M13.5 12l-9.9 9.9c.4.4 1 .4 1.6.1l11.9-6.8-3.6-3.2z" fill="#EA4335" />
      <path d="M13.5 12L17.1 8.7 5.2 1.9c-.6-.3-1.2-.3-1.6.1L13.5 12z" fill="#34A853" />
    </svg>
  );
}

const BETA_PROMO_CODES = ['QURANLY2026', 'PRO2026', 'ISLAMIC2026'];

const SubscriptionModal = ({ isOpen, onClose, isPro, onSubscribeSuccess, onCancelPro }) => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [emailNotify, setEmailNotify] = useState('');
  const [webNotifySubmitted, setWebNotifySubmitted] = useState(false);
  const [storeMessage, setStoreMessage] = useState('');
  const [restoreMessage, setRestoreMessage] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [nativeBilling, setNativeBilling] = useState(false);
  const [storeProducts, setStoreProducts] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [licenseInfo, setLicenseInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('quranly_pro_license_data');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    (async () => {
      setLoadingProducts(true);
      const available = await isNativeBillingAvailable();
      if (cancelled) return;
      setNativeBilling(available);
      if (available) {
        const products = await fetchStoreProducts();
        if (!cancelled) setStoreProducts(products);
      }
      if (!cancelled) setLoadingProducts(false);
    })();
    return () => { cancelled = true; };
  }, [isOpen]);

  if (!isOpen) return null;

  const getProductPrice = (plan) => {
    const id = plan === 'yearly' ? PRODUCT_IDS.yearly : PRODUCT_IDS.monthly;
    const product = storeProducts.find(p =>
      p.identifier === id || p.planIdentifier === id
    );
    return product?.priceString || (plan === 'yearly' ? '$19.99/yr' : '$2.00/mo');
  };

  const activateLicense = (license) => {
    localStorage.setItem('quranly_pro_license_data', JSON.stringify(license));
    setLicenseInfo(license);
    setShowSuccessToast(true);
    if (onSubscribeSuccess) onSubscribeSuccess(license);
    setTimeout(() => {
      setShowSuccessToast(false);
      onClose();
    }, 1500);
  };

  const activatePromoLicense = (code) => {
    activateLicense({
      token: `QRN-PROMO-${code}`,
      plan: 'Pro Beta Pass (Promo)',
      store: 'Beta Promo Code',
      subscribedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      expiresAt: 'Beta access',
    });
  };

  const handleNativePurchase = async () => {
    setStoreMessage('');
    setIsProcessing(true);
    try {
      const transaction = await purchaseSubscription(selectedPlan);
      const planLabel = selectedPlan === 'yearly' ? 'Pro Annual' : 'Pro Monthly';
      activateLicense(buildLicenseFromTransaction(transaction, planLabel));
    } catch (err) {
      const msg = err?.message || String(err);
      if (!msg.toLowerCase().includes('cancel')) {
        setStoreMessage(`Purchase failed: ${msg}. Use a beta promo code on web, or try again from the store build.`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestore = async () => {
    setStoreMessage('');
    setRestoreMessage('');
    setIsProcessing(true);
    try {
      if (nativeBilling) {
        const purchases = await restoreStorePurchases();
        if (hasActiveProPurchase(purchases)) {
          const active = purchases.find(p =>
            [PRODUCT_IDS.monthly, PRODUCT_IDS.yearly].includes(p.productIdentifier)
          );
          const license = buildLicenseFromTransaction(active, 'Pro (Restored)');
          activateLicense(license);
          setRestoreMessage('Store subscription restored.');
          return;
        }
        setRestoreMessage('No active store subscription found.');
        return;
      }
      const saved = localStorage.getItem('quranly_pro_license_data');
      const active = localStorage.getItem('quranly_pro_active') === 'true';
      if (saved && active) {
        const license = JSON.parse(saved);
        setLicenseInfo(license);
        if (onSubscribeSuccess) onSubscribeSuccess(license);
        setRestoreMessage('Previous Pro license restored on this device.');
      } else {
        setRestoreMessage('No previous Pro license found on this device.');
      }
    } catch (err) {
      setRestoreMessage(err?.message || 'Could not restore purchases.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRedeemPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    const cleanCode = promoCode.trim().toUpperCase();
    if (!cleanCode) return;
    if (BETA_PROMO_CODES.includes(cleanCode)) {
      setPromoSuccess('Beta promo redeemed successfully!');
      activatePromoLicense(cleanCode);
    } else {
      setPromoError('Invalid code. Ask the Quranly team for a beta promo.');
    }
  };

  const handleWebNotify = (e) => {
    e.preventDefault();
    const email = emailNotify.trim().toLowerCase();
    if (!email) return;
    try {
      const key = 'quranly_web_payment_notify';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const list = Array.isArray(existing) ? existing : [];
      if (!list.includes(email)) {
        list.push(email);
        localStorage.setItem(key, JSON.stringify(list));
      }
    } catch { /* ignore */ }
    setWebNotifySubmitted(true);
    setTimeout(() => setWebNotifySubmitted(false), 4000);
  };

  return (
    <div className="modal-overlay pro-overlay" onClick={onClose}>
      <div className="pro-modal glass-panel-card" onClick={(e) => e.stopPropagation()}>
        <button className="pro-close-btn" onClick={onClose} title="Close" type="button">
          <X size={20} />
        </button>

        {showSuccessToast && (
          <div className="pro-success-toast">
            <Sparkles size={24} color="#10b981" />
            <div>
              <h4>Pro License Activated!</h4>
              <p>Unlimited offline downloads are now active.</p>
            </div>
          </div>
        )}

        {isPro ? (
          <div className="pro-active-view">
            <div className="pro-badge-active">
              <ShieldCheck size={36} color="#10b981" />
              <h2>Quranly Pro Active</h2>
              <span className="pro-status-pill">VERIFIED LICENSE</span>
            </div>
            <div className="license-card-box">
              <div className="license-row">
                <span className="l-label">License Key:</span>
                <span className="l-val code-font">{licenseInfo?.token || 'Active'}</span>
              </div>
              <div className="license-row">
                <span className="l-label">Plan:</span>
                <span className="l-val">{licenseInfo?.plan || 'Pro Member'}</span>
              </div>
              <div className="license-row">
                <span className="l-label">Provider:</span>
                <span className="l-val">{licenseInfo?.store || 'Store / Promo'}</span>
              </div>
              <div className="license-row">
                <span className="l-label">Expires:</span>
                <span className="l-val">{licenseInfo?.expiresAt || 'Active'}</span>
              </div>
            </div>
            <div className="pro-features-list">
              <div className="feature-item"><Check size={16} color="#10b981" /> Unlimited Offline Downloads</div>
              <div className="feature-item"><Check size={16} color="#10b981" /> Ask AI (Gemini)</div>
              <div className="feature-item"><Check size={16} color="#10b981" /> Premium accent themes</div>
              <div className="feature-item"><Check size={16} color="#10b981" /> Cloud sync across devices</div>
            </div>
            <div className="pro-active-actions">
              <button className="cancel-sub-btn" onClick={onCancelPro} type="button">Cancel Subscription</button>
              <button className="continue-btn-pro" onClick={onClose} type="button">Done</button>
            </div>
          </div>
        ) : (
          <div className="pro-subscribe-view">
            <div className="pro-header">
              <div className="pro-icon-glow">
                <img src="/logo.png" alt="Quranly Logo" className="pro-real-logo" />
              </div>
              <h2>Upgrade to Quranly Pro</h2>
              <p className="pro-tagline">Unlock offline downloads, AI, and cloud sync</p>
            </div>

            <div className="plan-selector">
              <button
                type="button"
                className={`plan-tab ${selectedPlan === 'monthly' ? 'active' : ''}`}
                onClick={() => setSelectedPlan('monthly')}
              >
                <div className="plan-tab-title">Monthly</div>
                <div className="plan-tab-price">{getProductPrice('monthly')} <span className="period">/ mo</span></div>
              </button>
              <button
                type="button"
                className={`plan-tab ${selectedPlan === 'yearly' ? 'active' : ''}`}
                onClick={() => setSelectedPlan('yearly')}
              >
                <div className="save-badge">SAVE 17%</div>
                <div className="plan-tab-title">Yearly</div>
                <div className="plan-tab-price">{getProductPrice('yearly')} <span className="period">/ yr</span></div>
              </button>
            </div>

            <div className="store-checkout-section">
              <h4 className="store-heading">
                {nativeBilling ? 'Subscribe via App Store / Google Play' : 'Store Billing (Web Preview)'}
              </h4>
              {!nativeBilling && (
                <p className="store-hint">Install the Android/iOS app from the store to use native billing. On web, use a beta promo code.</p>
              )}

              <div className="store-buttons-grid">
                <button
                  type="button"
                  className="store-btn google-play-btn"
                  onClick={nativeBilling ? handleNativePurchase : () => setStoreMessage('Native billing requires the store app build. Use a beta promo below.')}
                  disabled={isProcessing || loadingProducts}
                >
                  <div className="store-logo-icon">
                    {isProcessing ? <Loader size={20} className="spin" /> : <GooglePlayLogo size={22} />}
                  </div>
                  <div className="store-btn-text">
                    <span className="small-text">{nativeBilling ? 'Subscribe via' : 'Requires app'}</span>
                    <span className="bold-text">{nativeBilling ? 'Google Play / App Store' : 'Store Build'}</span>
                  </div>
                  <span className="price-tag">{getProductPrice(selectedPlan)}</span>
                </button>
              </div>
              {storeMessage && <p className="promo-err-msg store-msg">{storeMessage}</p>}
            </div>

            <div className="promo-code-box">
              <div className="promo-title"><Key size={14} /><span>Beta Promo Code</span></div>
              <form className="promo-form" onSubmit={handleRedeemPromo}>
                <input type="text" placeholder="Enter beta promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                <button type="submit">Redeem</button>
              </form>
              {promoError && <p className="promo-err-msg">{promoError}</p>}
              {promoSuccess && <p className="promo-ok-msg">{promoSuccess}</p>}
            </div>

            <div className="web-payment-banner">
              <div className="web-banner-header">
                <span className="banner-badge"><CreditCard size={14} /><span>Web card payments coming soon</span></span>
                <Lock size={12} />
              </div>
              <p className="web-banner-desc">Leave your email for web checkout updates:</p>
              {webNotifySubmitted ? (
                <p className="notify-success-msg">✓ Saved on this device.</p>
              ) : (
                <form className="notify-form" onSubmit={handleWebNotify}>
                  <input type="email" placeholder="Email" value={emailNotify} onChange={(e) => setEmailNotify(e.target.value)} required />
                  <button type="submit">Notify Me</button>
                </form>
              )}
            </div>

            <div className="restore-footer">
              <button className="restore-link-btn" onClick={handleRestore} disabled={isProcessing} type="button">
                <RefreshCw size={14} /> Restore Purchases
              </button>
              {restoreMessage && <p className="promo-ok-msg restore-msg">{restoreMessage}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionModal;
