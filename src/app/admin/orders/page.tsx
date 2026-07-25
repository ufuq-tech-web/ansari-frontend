"use client";

import React, { useEffect, useState } from "react";
import { useQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Loader2, ExternalLink, ChevronDown } from "lucide-react";
import { adminApi } from "../../../lib/admin-api";
import Select from "../../../components/admin/Select";
import DataTable, { ColumnDef } from "../../../components/shared/DataTable";
import Pagination from "../../../components/shared/Pagination";
import SearchInput from "../../../components/shared/SearchInput";
import StatusDropdown from "../../../components/admin/StatusDropdown";

interface OrderRow {
  orderNumber: string;
  status: string;
  total: number;
  placedAt: string;
  paymentMethod: string;
  user: { name: string; email: string };
  items: unknown[];
}

const STATUS_OPTIONS = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
const PAGE_SIZE = 15;

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading: loading, refetch } = useQuery({
    queryKey: ["adminOrders", debouncedSearch, status, page],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (status) params.set("status", status);
      return adminApi.get<{ items: OrderRow[]; total: number }>(`/orders/admin/all?${params.toString()}`);
    },
    placeholderData: keepPreviousData,
  });

  const orders = data?.items || [];
  const total = data?.total || 0;

  const handleStatusChange = async (orderNumber: string, newStatus: string) => {
    setUpdatingId(orderNumber);
    try {
      await adminApi.patch(`/orders/${orderNumber}/status`, { status: newStatus });
      // Optimistic cache update
      queryClient.setQueryData(
        ["adminOrders", debouncedSearch, status, page],
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            items: oldData.items.map((o: OrderRow) =>
              o.orderNumber === orderNumber ? { ...o, status: newStatus } : o
            ),
          };
        }
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const columns: ColumnDef<OrderRow>[] = [
    {
      key: "orderNumber",
      label: "Order",
      render: (o) => (
        <Link href={`/admin/orders/${o.orderNumber}`} className="font-poppins font-bold text-brand-orange hover:text-brand-orange-dark hover:underline tracking-tight">
          #{o.orderNumber}
        </Link>
      )
    },
    {
      key: "user",
      label: "Customer",
      render: (o) => {
        const customerInitials = o.user.name
          ? o.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
          : "?";
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-charcoal-100 to-charcoal-200 flex flex-shrink-0 items-center justify-center text-[10px] font-poppins font-bold text-charcoal-600 border border-charcoal-200/40 shadow-sm">
              {customerInitials}
            </div>
            <div className="leading-snug max-w-[150px] sm:max-w-xs truncate">
              <div className="font-poppins font-semibold text-charcoal-900 text-xs truncate">{o.user.name}</div>
              <div className="text-[11px] text-charcoal-900 font-inter truncate">{o.user.email}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: "items",
      label: "Items",
      render: (o) => <span className="font-inter text-charcoal-500 text-xs">{o.items.length === 1 ? "1 item" : `${o.items.length} items`}</span>
    },
    {
      key: "total",
      label: "Total",
      render: (o) => <span className="font-manrope font-extrabold text-charcoal-900 text-sm">₹{o.total.toLocaleString("en-IN")}</span>
    },
    {
      key: "placedAt",
      label: "Order Date",
      render: (o) => {
        const date = new Date(o.placedAt);
        return (
          <div className="flex flex-col">
            <span className="font-inter text-charcoal-800 text-xs font-semibold">
              {date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <span className="font-inter text-charcoal-400 text-[10px] mt-0.5">
              {date.toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        );
      }
    },
    {
      key: "paymentMethod",
      label: "Payment",
      render: (o) => (
        <span className="font-poppins font-semibold text-[10px] tracking-wider uppercase text-charcoal-600 bg-charcoal-100 px-2.5 py-1 rounded-md border border-charcoal-200">
           {o.paymentMethod || 'COD'}
        </span>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (o) => (
        <StatusDropdown
          status={o.status}
          orderNumber={o.orderNumber}
          updatingId={updatingId}
          onChange={handleStatusChange}
        />
      )
    },
    {
      key: "actions",
      label: "",
      align: "right",
      width: "60px",
      render: (o) => (
        <Link
          href={`/admin/orders/${o.orderNumber}`}
          className="flex items-center justify-center p-2 rounded-xl text-charcoal-400 hover:text-brand-orange hover:bg-brand-orange/5 transition-colors"
          title="View Details"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      )
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-poppins font-black text-charcoal-900 text-xl lg:text-2xl tracking-tight">Orders</h2>
        <p className="text-xs text-charcoal-400 font-poppins font-semibold uppercase tracking-wider mt-1">Monitor payments, shipments, and customer purchases</p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 bg-white p-4 rounded-t-2xl border-x border-t border-charcoal-200">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search order #, customer, email..."
          className="w-full sm:max-w-sm"
        />
        <Select
          value={status}
          onChange={(v) => { setStatus(v); setPage(1); }}
          options={[{ value: "", label: "All Statuses" }, ...STATUS_OPTIONS.map((s) => ({ value: s, label: s }))]}
          className="w-full sm:w-44"
        />
      </div>

      <DataTable
        data={orders}
        columns={columns}
        keyExtractor={(o) => o.orderNumber}
        isLoading={loading}
        emptyMessage={search || status ? "No orders match your filters." : "No orders found."}
      />

      {!loading && orders.length > 0 && (
        <Pagination
          currentPage={page}
          totalItems={total}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
