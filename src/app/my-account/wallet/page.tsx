"use client";

import { useEffect, useState } from "react";
import AccountLayout from "../../../components/account/AccountLayout";
import { useAuthStore } from "../../../lib/auth-store";
import { customerApi } from "../../../lib/customer-api";
import { Wallet, TrendingUp, TrendingDown, Clock, CheckCircle } from "lucide-react";

interface WalletTransaction {
  id: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  reason: string;
  createdAt: string;
  order: { orderNumber: string } | null;
}

export default function WalletPage() {
  const user = useAuthStore(state => state.user);
  const [balance, setBalance] = useState(user?.walletBalance || 0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    customerApi.get<{ balance: number; transactions: WalletTransaction[] }>("/users/me/wallet")
      .then((data) => {
        setBalance(data.balance);
        setTransactions(data.transactions);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AccountLayout>
      <div className="max-w-4xl animate-fade-in-up">
        {/* Header */}
        <div className="mb-8">
          <h2 className="font-poppins font-black text-charcoal-900 text-3xl tracking-tight mb-2">My Digital Wallet</h2>
          <p className="font-inter text-charcoal-500 text-sm max-w-xl leading-relaxed">
            View your current balance and recent transactions. Your wallet balance is automatically credited from order cancellations and can be used on future purchases.
          </p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-charcoal-900 to-charcoal-800 rounded-3xl p-8 lg:p-10 text-white mb-10 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6 opacity-80">
              <Wallet className="w-5 h-5 text-brand-orange" />
              <span className="font-poppins font-bold uppercase tracking-widest text-xs">Available Balance</span>
            </div>
            {loading ? (
              <div className="h-14 bg-white/10 rounded-xl w-48 animate-pulse"></div>
            ) : (
              <div className="font-poppins font-black text-5xl lg:text-6xl tracking-tighter">
                ₹{balance.toLocaleString("en-IN")}
              </div>
            )}
            <p className="mt-4 text-xs font-inter text-charcoal-300">
              Balance will be automatically applied at checkout if selected.
            </p>
          </div>
        </div>

        {/* Transaction History */}
        <h3 className="font-poppins font-black text-charcoal-900 text-xl tracking-tight mb-6">Transaction History</h3>
        
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-charcoal-50 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-charcoal-50/50 border border-charcoal-100 rounded-2xl p-10 text-center">
            <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm mb-4">
              <Clock className="w-6 h-6 text-charcoal-300" />
            </div>
            <h3 className="font-poppins font-bold text-charcoal-900 mb-2">No Transactions Yet</h3>
            <p className="font-inter text-charcoal-500 text-sm">Your wallet history will appear here once you have credits or debits.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-white border border-charcoal-100 rounded-2xl p-5 hover:border-charcoal-200 hover:shadow-card-hover transition-all flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${tx.type === 'CREDIT' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {tx.type === 'CREDIT' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-poppins font-bold text-charcoal-900 text-sm">{tx.reason}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-inter text-xs text-charcoal-500">
                        {new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute:"2-digit" })}
                      </span>
                      {tx.order?.orderNumber && (
                        <>
                          <span className="text-charcoal-300">•</span>
                          <span className="font-mono text-[10px] text-charcoal-400 bg-charcoal-50 px-1.5 py-0.5 rounded">{tx.order.orderNumber}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`font-poppins font-black text-lg ${tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-charcoal-900'}`}>
                  {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount.toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
