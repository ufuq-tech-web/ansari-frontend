"use client";

import { useEffect, useState } from "react";
import { Search, Users, Mail, Phone, Calendar, ShoppingBag, Wallet, X, MapPin } from "lucide-react";
import { adminApi } from "../../../lib/admin-api";
import DataTable, { ColumnDef } from "../../../components/shared/DataTable";

interface UserOrder {
  total: number;
}

interface UserAddress {
  id: string;
  name: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface CustomerRow {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  createdAt: string;
  orders: UserOrder[];
  addresses: UserAddress[];
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRow | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get<CustomerRow[]>("/users/admin/all");
      // Filter only users with CUSTOMER role
      const onlyCustomers = res.filter((u) => u.role === "CUSTOMER");
      setCustomers(onlyCustomers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const columns: ColumnDef<CustomerRow>[] = [
    {
      key: "customer",
      label: "Customer",
      render: (c) => {
        const initials = c.name ? c.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-charcoal-100 to-charcoal-200 flex items-center justify-center text-xs font-poppins font-extrabold text-charcoal-600 border border-charcoal-200/40 shadow-sm flex-shrink-0">
              {initials}
            </div>
            <div>
              <div className="font-poppins font-bold text-charcoal-900 text-xs">{c.name}</div>
              <div className="text-[10px] text-charcoal-900 font-inter mt-0.5">ID: {c.id.slice(-8)}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: "contact",
      label: "Contact",
      render: (c) => (
        <div className="flex flex-col gap-0.5 text-xs text-charcoal-900 font-inter">
          <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-charcoal-900" /> {c.email}</span>
          {c.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-charcoal-900" /> {c.phone}</span>}
        </div>
      )
    },
    {
      key: "registered",
      label: "Registered",
      hideOnMobile: true,
      render: (c) => (
        <div className="text-xs font-inter text-charcoal-900">
          {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </div>
      )
    },
    {
      key: "orders",
      label: "Orders",
      align: "center",
      hideOnMobile: true,
      render: (c) => (
        <div className="font-inter text-xs font-semibold text-charcoal-900">
          {c.orders.length}
        </div>
      )
    },
    {
      key: "totalSpent",
      label: "Total Spent",
      align: "right",
      render: (c) => {
        const spend = c.orders.reduce((sum, o) => sum + o.total, 0);
        return (
          <div className="font-manrope font-extrabold text-charcoal-950 text-sm">
            ₹{spend.toLocaleString("en-IN")}
          </div>
        );
      }
    },
    {
      key: "profile",
      label: "Profile",
      align: "right",
      render: (c) => (
        <button
          onClick={() => setSelectedCustomer(c)}
          className="font-poppins font-bold text-xs uppercase tracking-wider text-brand-orange hover:text-brand-orange-dark bg-brand-orange/5 hover:bg-brand-orange/10 px-3.5 py-2 rounded-xl transition-all"
        >
          View Details
        </button>
      )
    }
  ];

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search))
  );

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-poppins font-black text-charcoal-900 text-xl lg:text-2xl tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-orange" strokeWidth={2.5} />
            Customers
          </h2>
          <p className="text-xs text-charcoal-900 font-poppins font-semibold uppercase tracking-wider mt-1">
            View customer details, billing information, and shopping history
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" strokeWidth={2.5} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 transition-all"
          />
        </div>
      </div>

      <DataTable 
        data={filtered}
        columns={columns}
        keyExtractor={(c) => c.id}
        isLoading={loading}
        emptyMessage={search ? "No customers match your search." : "No customers found."}
      />

      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm" onClick={() => setSelectedCustomer(null)} />
          <div className="relative bg-brand-ivory rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-200 bg-white flex-shrink-0">
              <div>
                <h3 className="font-poppins font-bold text-charcoal-900 text-lg">Customer Profile</h3>
                <p className="text-xs text-charcoal-900 font-inter mt-0.5">{selectedCustomer.name}</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-9 h-9 rounded-full bg-charcoal-100 hover:bg-charcoal-200 flex items-center justify-center text-charcoal-600 transition-colors"
                aria-label="Close"
              >
                <X className="w-4.5 h-4.5" strokeWidth={2} />
              </button>
            </div>

            <div className="overflow-y-auto p-6 flex flex-col gap-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-charcoal-200 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-brand-orange">
                    <ShoppingBag className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-[10px] font-poppins font-semibold uppercase tracking-wider text-charcoal-900">Total Orders</div>
                    <div className="text-lg font-poppins font-black text-charcoal-900">{selectedCustomer.orders.length}</div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-charcoal-200 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <Wallet className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-[10px] font-poppins font-semibold uppercase tracking-wider text-charcoal-900">Total Spend</div>
                    <div className="text-lg font-manrope font-extrabold text-charcoal-900">
                      ₹{selectedCustomer.orders.reduce((sum, o) => sum + o.total, 0).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-poppins font-bold text-xs uppercase tracking-wider text-charcoal-900 mb-3">Account Information</h4>
                <div className="bg-white rounded-2xl border border-charcoal-200 p-5 space-y-3.5 text-sm font-inter text-charcoal-900">
                  <div className="flex justify-between border-b border-charcoal-100 pb-2">
                    <span className="text-charcoal-900">Email Address</span>
                    <span className="font-semibold text-charcoal-950">{selectedCustomer.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-charcoal-100 pb-2">
                    <span className="text-charcoal-900">Phone Number</span>
                    <span className="font-semibold text-charcoal-950">{selectedCustomer.phone || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-charcoal-900">Registration Date</span>
                    <span className="font-semibold text-charcoal-950">
                      {new Date(selectedCustomer.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-poppins font-bold text-xs uppercase tracking-wider text-charcoal-900 mb-3">Saved Addresses</h4>
                {selectedCustomer.addresses.length === 0 ? (
                  <p className="text-xs text-charcoal-900 font-inter italic">No saved addresses</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {selectedCustomer.addresses.map((a) => (
                      <div key={a.id} className="bg-white rounded-2xl border border-charcoal-200 p-4 relative flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" strokeWidth={2} />
                        <div className="text-xs font-inter text-charcoal-900 leading-relaxed">
                          <div className="font-poppins font-bold text-charcoal-900 text-sm flex items-center gap-2">
                            {a.name}
                            {a.isDefault && (
                              <span className="text-[9px] uppercase tracking-wider bg-charcoal-100 text-charcoal-500 px-1.5 py-0.5 rounded-md font-semibold">
                                Default
                              </span>
                            )}
                          </div>
                          <div>Phone: {a.phone}</div>
                          <div>{a.line1}</div>
                          <div>{a.city}, {a.state} - {a.pincode}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
