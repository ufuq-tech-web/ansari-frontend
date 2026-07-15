"use client";

import { useEffect, useState } from "react";
import { Settings, Save, CheckCircle2, Shield, CreditCard, Truck, Globe } from "lucide-react";

interface GeneralSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  address: string;
}

interface ShippingSettings {
  flatRate: number;
  freeShippingThreshold: number;
  enableStorePickup: boolean;
}

interface PaymentSettings {
  enableStripe: boolean;
  enableCod: boolean;
  enableBankTransfer: boolean;
}

const DEFAULT_SETTINGS = {
  general: {
    storeName: "Ansari Boot House",
    supportEmail: "support@ansariboothouse.com",
    supportPhone: "+91 98765 43210",
    currency: "INR",
    address: "Ansari Boot House, Main Market, Mumbai, MH, India",
  },
  shipping: {
    flatRate: 99,
    freeShippingThreshold: 1999,
    enableStorePickup: true,
  },
  payments: {
    enableStripe: true,
    enableCod: true,
    enableBankTransfer: false,
  },
};

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "shipping" | "payments">("general");
  const [general, setGeneral] = useState<GeneralSettings>(DEFAULT_SETTINGS.general);
  const [shipping, setShipping] = useState<ShippingSettings>(DEFAULT_SETTINGS.shipping);
  const [payments, setPayments] = useState<PaymentSettings>(DEFAULT_SETTINGS.payments);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const savedGen = localStorage.getItem("ansari_settings_general");
    const savedShip = localStorage.getItem("ansari_settings_shipping");
    const savedPay = localStorage.getItem("ansari_settings_payments");
    if (savedGen) setGeneral(JSON.parse(savedGen));
    if (savedShip) setShipping(JSON.parse(savedShip));
    if (savedPay) setPayments(JSON.parse(savedPay));
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("ansari_settings_general", JSON.stringify(general));
    localStorage.setItem("ansari_settings_shipping", JSON.stringify(shipping));
    localStorage.setItem("ansari_settings_payments", JSON.stringify(payments));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange";
  const labelClass = "text-xs font-poppins font-semibold text-charcoal-500 block mb-1.5 uppercase tracking-wide";

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-poppins font-black text-charcoal-900 text-xl lg:text-2xl tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-brand-orange" strokeWidth={2.5} />
            Store Settings
          </h2>
          <p className="text-xs text-charcoal-400 font-poppins font-semibold uppercase tracking-wider mt-1">
            Configure global defaults, shipping rates, and payment methods
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        <div className="lg:w-64 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 flex-shrink-0">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-poppins font-bold text-xs uppercase tracking-wider text-left transition-all ${
              activeTab === "general"
                ? "bg-gradient-to-r from-brand-orange to-orange-600 text-white shadow-md shadow-brand-orange/10"
                : "bg-white border border-charcoal-200 text-charcoal-700 hover:bg-charcoal-50"
            }`}
          >
            <Globe className="w-4 h-4" /> General Store
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-poppins font-bold text-xs uppercase tracking-wider text-left transition-all ${
              activeTab === "shipping"
                ? "bg-gradient-to-r from-brand-orange to-orange-600 text-white shadow-md shadow-brand-orange/10"
                : "bg-white border border-charcoal-200 text-charcoal-700 hover:bg-charcoal-50"
            }`}
          >
            <Truck className="w-4 h-4" /> Shipping Defaults
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-poppins font-bold text-xs uppercase tracking-wider text-left transition-all ${
              activeTab === "payments"
                ? "bg-gradient-to-r from-brand-orange to-orange-600 text-white shadow-md shadow-brand-orange/10"
                : "bg-white border border-charcoal-200 text-charcoal-700 hover:bg-charcoal-50"
            }`}
          >
            <CreditCard className="w-4 h-4" /> Payment Gateways
          </button>
        </div>

        <form onSubmit={handleSave} className="flex-1 bg-white rounded-2xl border border-charcoal-200 p-6 shadow-card">
          {activeTab === "general" && (
            <div className="flex flex-col gap-4">
              <h3 className="font-poppins font-bold text-charcoal-900 text-sm mb-2 pb-2 border-b border-charcoal-100">
                General Options
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Store Name</label>
                  <input
                    required
                    value={general.storeName}
                    onChange={(e) => setGeneral({ ...general, storeName: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Base Currency</label>
                  <select
                    value={general.currency}
                    onChange={(e) => setGeneral({ ...general, currency: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange"
                  >
                    <option value="INR">INR (₹) - Indian Rupee</option>
                    <option value="USD">USD ($) - United States Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Support Email</label>
                  <input
                    type="email"
                    required
                    value={general.supportEmail}
                    onChange={(e) => setGeneral({ ...general, supportEmail: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Support Phone</label>
                  <input
                    required
                    value={general.supportPhone}
                    onChange={(e) => setGeneral({ ...general, supportPhone: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Store Physical Address</label>
                <textarea
                  rows={3}
                  required
                  value={general.address}
                  onChange={(e) => setGeneral({ ...general, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="flex flex-col gap-4">
              <h3 className="font-poppins font-bold text-charcoal-900 text-sm mb-2 pb-2 border-b border-charcoal-100">
                Shipping Configuration
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Flat Rate Fee (₹)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={shipping.flatRate}
                    onChange={(e) => setShipping({ ...shipping, flatRate: Number(e.target.value) })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Free Shipping Threshold (₹)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={shipping.freeShippingThreshold}
                    onChange={(e) => setShipping({ ...shipping, freeShippingThreshold: Number(e.target.value) })}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="enableStorePickup"
                  checked={shipping.enableStorePickup}
                  onChange={(e) => setShipping({ ...shipping, enableStorePickup: e.target.checked })}
                  className="w-4 h-4 text-brand-orange border-charcoal-300 rounded focus:ring-brand-orange"
                />
                <label htmlFor="enableStorePickup" className="text-xs font-poppins font-semibold text-charcoal-700 uppercase tracking-wide cursor-pointer">
                  Enable Local Store Pickup
                </label>
              </div>
            </div>
          )}

          {activeTab === "payments" && (
            <div className="flex flex-col gap-4">
              <h3 className="font-poppins font-bold text-charcoal-900 text-sm mb-2 pb-2 border-b border-charcoal-100">
                Active Payment Gateways
              </h3>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 bg-charcoal-50 p-4 rounded-xl border border-charcoal-200 cursor-pointer hover:bg-charcoal-100/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={payments.enableStripe}
                    onChange={(e) => setPayments({ ...payments, enableStripe: e.target.checked })}
                    className="w-4.5 h-4.5 text-brand-orange border-charcoal-300 rounded focus:ring-brand-orange"
                  />
                  <div>
                    <span className="text-xs font-poppins font-bold text-charcoal-900 uppercase tracking-wider block">Credit & Debit Cards (Stripe)</span>
                    <span className="text-[10px] font-inter text-charcoal-400">Accept global payments securely via credit cards and digital wallets.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 bg-charcoal-50 p-4 rounded-xl border border-charcoal-200 cursor-pointer hover:bg-charcoal-100/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={payments.enableCod}
                    onChange={(e) => setPayments({ ...payments, enableCod: e.target.checked })}
                    className="w-4.5 h-4.5 text-brand-orange border-charcoal-300 rounded focus:ring-brand-orange"
                  />
                  <div>
                    <span className="text-xs font-poppins font-bold text-charcoal-900 uppercase tracking-wider block">Cash on Delivery (COD)</span>
                    <span className="text-[10px] font-inter text-charcoal-400">Allow customers to pay physical cash upon package drop-off.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 bg-charcoal-50 p-4 rounded-xl border border-charcoal-200 cursor-pointer hover:bg-charcoal-100/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={payments.enableBankTransfer}
                    onChange={(e) => setPayments({ ...payments, enableBankTransfer: e.target.checked })}
                    className="w-4.5 h-4.5 text-brand-orange border-charcoal-300 rounded focus:ring-brand-orange"
                  />
                  <div>
                    <span className="text-xs font-poppins font-bold text-charcoal-900 uppercase tracking-wider block">Direct Bank Transfer</span>
                    <span className="text-[10px] font-inter text-charcoal-400">Accept wire transfers (requires manual verification of remittance receipt).</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          <div className="mt-6 border-t border-charcoal-150 pt-5 flex items-center justify-between">
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-brand-orange to-orange-600 text-white font-poppins font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl hover:shadow-lg hover:shadow-brand-orange/20 transition-all hover:scale-[1.02]"
            >
              <Save className="w-4.5 h-4.5" /> Save Configuration
            </button>
            {success && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-poppins font-bold uppercase tracking-wide animate-pulse">
                <CheckCircle2 className="w-4.5 h-4.5" /> Settings Saved!
              </span>
            )}
          </div>
        </form>

      </div>
    </div>
  );
}
