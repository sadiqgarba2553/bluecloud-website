import { Capacitor } from '@capacitor/core';
import { NativePurchases, PURCHASE_TYPE } from '@capgo/native-purchases';

/** Configure these in Google Play Console / App Store Connect */
export const PRODUCT_IDS = {
  monthly: import.meta.env.VITE_PRO_PRODUCT_MONTHLY || 'quranly_pro_monthly',
  yearly: import.meta.env.VITE_PRO_PRODUCT_YEARLY || 'quranly_pro_yearly',
};

export async function isNativeBillingAvailable() {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const { isBillingSupported } = await NativePurchases.isBillingSupported();
    return Boolean(isBillingSupported);
  } catch {
    return false;
  }
}

export async function fetchStoreProducts() {
  if (!(await isNativeBillingAvailable())) return [];
  try {
    const ids = [PRODUCT_IDS.monthly, PRODUCT_IDS.yearly];
    const { products } = await NativePurchases.getProducts({
      productIdentifiers: ids,
      productType: PURCHASE_TYPE.SUBS,
    });
    return products || [];
  } catch (err) {
    console.warn('Store products unavailable:', err);
    return [];
  }
}

export async function purchaseSubscription(plan = 'monthly') {
  const productIdentifier = plan === 'yearly' ? PRODUCT_IDS.yearly : PRODUCT_IDS.monthly;
  const transaction = await NativePurchases.purchaseProduct({
    productIdentifier,
    productType: PURCHASE_TYPE.SUBS,
    planIdentifier: productIdentifier,
  });
  return transaction;
}

export async function restoreStorePurchases() {
  if (!(await isNativeBillingAvailable())) return [];
  await NativePurchases.restorePurchases();
  const { purchases } = await NativePurchases.getPurchases({
    productType: PURCHASE_TYPE.SUBS,
    onlyCurrentEntitlements: true,
  });
  return purchases || [];
}

export function hasActiveProPurchase(purchases = []) {
  const proIds = new Set([PRODUCT_IDS.monthly, PRODUCT_IDS.yearly]);
  return purchases.some((p) => {
    if (!proIds.has(p.productIdentifier)) return false;
    if (Capacitor.getPlatform() === 'android') {
      return p.purchaseState === '1' || p.purchaseState === 1;
    }
    if (p.isActive === true) return true;
    if (p.expirationDate) return new Date(p.expirationDate) > new Date();
    return Boolean(p.productIdentifier);
  });
}

export function buildLicenseFromTransaction(transaction, planLabel) {
  return {
    token: transaction.transactionId || transaction.orderId || 'STORE-ACTIVE',
    plan: planLabel,
    store: Capacitor.getPlatform() === 'ios' ? 'Apple App Store' : 'Google Play Billing',
    subscribedAt: transaction.purchaseDate
      ? new Date(transaction.purchaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    expiresAt: transaction.expirationDate
      ? new Date(transaction.expirationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : 'Active',
    purchaseToken: transaction.purchaseToken || null,
    productId: transaction.productIdentifier,
  };
}
