"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  MoreVertical,
  Loader2,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────
   Types
   ────────────────────────────────────────────────────────── */

/** Column definition */
export interface Column<T> {
  /** Unique key matching a property in T (or arbitrary string for custom render) */
  key: string;
  /** Header label */
  header: string;
  /** Whether this column is sortable (client-side) */
  sortable?: boolean;
  /** Custom render for the cell */
  render?: (row: T, index: number) => React.ReactNode;
  /** Tailwind classes for the <td> */
  className?: string;
  /** Tailwind classes for the <th> */
  headerClassName?: string;
  /** Min width hint */
  minWidth?: string;
}

/** Tab definition for filter tabs */
export interface Tab {
  label: string;
  value: string;
  count?: number;
}

/** Action item for the row action dropdown */
export interface RowAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  /** Optional condition — if returns false the action is hidden */
  visible?: (row: T) => boolean;
  /** Optional custom class for the action button */
  className?: string;
}

/** Status pill color map */
export interface StatusColorMap {
  [key: string]: string;
}

/** DataTable props */
export interface DataTableProps<T> {
  /** Data rows */
  data: T[];
  /** Column definitions */
  columns: Column<T>[];
  /** Unique key extractor — defaults to (row as any).id */
  rowKey?: (row: T) => string | number;

  /* ── Loading / Empty ── */
  loading?: boolean;
  loadingText?: string;
  emptyText?: string;

  /* ── Search ── */
  searchable?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  /** Client-side search fields (if not using external search) */
  searchFields?: (keyof T)[];

  /* ── Tabs ── */
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (value: string) => void;

  /* ── Pagination ── */
  pageSize?: number;
  /** Set to true when pagination is handled server-side */
  serverSidePagination?: boolean;
  totalRows?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;

  /* ── Row Actions ── */
  actions?: RowAction<T>[];

  /* ── Title ── */
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;

  /* ── Styling ── */
  className?: string;
  compact?: boolean;
  rowClassName?: (row: T) => string;
}

/* ──────────────────────────────────────────────────────────
   Status Pill Helper (exported for external use)
   ────────────────────────────────────────────────────────── */

export function StatusPill({
  value,
  colorMap,
}: {
  value: string | null | undefined;
  colorMap?: StatusColorMap;
}) {
  const label = value ?? "—";
  const defaultMap: StatusColorMap = {
    Pending: "border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400",
    Complete: "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400",
    Completed: "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400",
    Active: "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400",
    Processing: "border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
    Cancelled: "border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    Hold: "border-indigo-200 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400",
    "On Hold": "border-indigo-200 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400",
    Refund: "border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400",
    Failed: "border-red-300 dark:border-red-900/50 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
    Fraud: "border-red-300 dark:border-red-900/50 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
    Unconfirmed: "border-yellow-200 dark:border-yellow-900/50 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400",
    Open: "border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
  };
  const map = colorMap ?? defaultMap;
  const colors = map[label] ?? "border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-white";

  // Dot color
  const dotMap: Record<string, string> = {
    Pending: "bg-amber-500",
    Complete: "bg-emerald-500",
    Completed: "bg-emerald-500",
    Active: "bg-emerald-500",
    Processing: "bg-blue-500",
    Cancelled: "bg-red-500",
    Hold: "bg-indigo-500",
    "On Hold": "bg-indigo-500",
    Refund: "bg-orange-500",
    Failed: "bg-red-700",
    Fraud: "bg-red-700",
    Unconfirmed: "bg-yellow-500",
  };
  const dot = dotMap[label] ?? "bg-gray-400";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[13px] font-medium whitespace-nowrap ${colors}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────
   DataTable Component
   ────────────────────────────────────────────────────────── */

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  rowKey,
  loading = false,
  loadingText = "Loading…",
  emptyText = "No data found.",
  searchable = false,
  searchPlaceholder = "Search…",
  searchValue: externalSearch,
  onSearchChange,
  searchFields,
  tabs,
  activeTab: externalActiveTab,
  onTabChange,
  pageSize = 10,
  serverSidePagination = false,
  totalRows,
  currentPage: externalCurrentPage,
  onPageChange,
  actions,
  title,
  subtitle,
  headerRight,
  className = "",
  compact = false,
  rowClassName,
}: DataTableProps<T>) {
  /* ── Internal state ── */
  const [internalSearch, setInternalSearch] = useState("");
  const [internalTab, setInternalTab] = useState(tabs?.[0]?.value ?? "all");
  const [internalPage, setInternalPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [openActionId, setOpenActionId] = useState<string | number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Decide controlled vs internal
  const search = externalSearch ?? internalSearch;
  const setSearch = onSearchChange ?? setInternalSearch;
  const activeTab = externalActiveTab ?? internalTab;
  const setActiveTab = onTabChange ?? setInternalTab;
  const currentPage = externalCurrentPage ?? internalPage;
  const setCurrentPage = onPageChange ?? setInternalPage;

  // Reset page on search / tab change
  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, activeTab]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenActionId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Client-side search filtering ── */
  const filteredData = useMemo(() => {
    if (!searchFields || !search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      searchFields.some((field) => {
        const val = row[field as string];
        return val != null && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, search, searchFields]);

  /* ── Client-side sorting ── */
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey] ?? "";
      const bVal = b[sortKey] ?? "";
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortDir]);

  /* ── Pagination ── */
  const total = serverSidePagination ? (totalRows ?? data.length) : sortedData.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paginatedData = serverSidePagination
    ? sortedData
    : sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const showingFrom = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showingTo = Math.min(currentPage * pageSize, total);

  /* ── Sort handler ── */
  const handleSort = useCallback(
    (key: string) => {
      if (sortKey === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
    },
    [sortKey]
  );

  /* ── Key extractor ── */
  const getKey = (row: T, idx: number) =>
    rowKey ? rowKey(row) : (row as any).id ?? idx;

  /* ── Cell / row sizes ── */
  const cellPx = compact ? "px-4 py-2.5" : "px-5 py-4";
  const headerPx = compact ? "px-4 py-3" : "px-5 py-3.5";

  /* ── Pagination range ── */
  const getPageRange = () => {
    const delta = 2;
    const range: number[] = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    range.push(1);
    if (left > 2) range.push(-1); // ellipsis
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages - 1) range.push(-1); // ellipsis
    if (totalPages > 1) range.push(totalPages);
    return range;
  };

  const colCount = columns.length + (actions ? 1 : 0);

  return (
    <div className={`bg-white dark:bg-[#1a1f2c] rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors ${className}`}>
      {/* ── Header area ── */}
      {(title || subtitle || tabs || searchable || headerRight) && (
        <div className="border-b border-gray-100 dark:border-slate-800">
          {/* Title row */}
          {(title || headerRight) && (
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 pt-5 pb-2">
              <div>
                {title && (
                  <h2 className="text-[18px] font-bold text-gray-900 dark:text-white tracking-tight">{title}</h2>
                )}
                {subtitle && (
                  <p className="text-sm text-gray-500 dark:text-white mt-0.5">{subtitle}</p>
                )}
              </div>
              {headerRight && <div>{headerRight}</div>}
            </div>
          )}

          {/* Tabs + Search row */}
          {(tabs || searchable) && (
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3">
              {/* Tabs */}
              {tabs && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {tabs.map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setActiveTab(tab.value)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] font-medium rounded-lg transition-all ${activeTab === tab.value
                          ? "bg-gray-900 dark:bg-white text-white dark:text-black shadow-sm"
                          : "text-gray-500 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-800 dark:text-white dark:hover:text-slate-200"
                        }`}
                    >
                      {tab.label}
                      {tab.count != null && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${activeTab === tab.value
                              ? "bg-white/20 text-white"
                              : "bg-gray-100 text-gray-500 dark:text-white"
                            }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Search */}
              {searchable && (
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-200 dark:border-slate-700 bg-transparent text-gray-900 dark:text-white rounded-lg text-[13px] outline-none focus:border-gray-400 dark:focus:border-slate-500 focus:ring-1 focus:ring-gray-200 dark:focus:ring-slate-700 transition w-56"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Table ── */}
      <div className="overflow-x-auto min-h-[240px]">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-800/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`${headerPx} text-[15px] font-semibold text-gray-700 dark:text-white whitespace-nowrap select-none ${col.sortable ? "cursor-pointer hover:text-gray-900 dark:text-white dark:hover:text-white transition-colors" : ""
                    } ${col.headerClassName ?? ""}`}
                  style={col.minWidth ? { minWidth: col.minWidth } : undefined}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortKey === col.key && (
                      sortDir === "asc" ? (
                        <ChevronUp size={12} className="text-gray-600 dark:text-white" />
                      ) : (
                        <ChevronDown size={12} className="text-gray-600 dark:text-white" />
                      )
                    )}
                  </span>
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className={`${headerPx} text-[15px] font-semibold text-gray-700 dark:text-white text-center`}>
                  Action
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50 dark:divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={colCount} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 size={24} className="animate-spin text-gray-400 dark:text-white" />
                    <span className="text-sm text-gray-400 dark:text-white">{loadingText}</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="text-center py-16">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <Search size={20} className="text-gray-300 dark:text-white" />
                    </div>
                    <span className="text-sm text-gray-400 dark:text-white">{emptyText}</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => {
                const key = getKey(row, idx);
                const globalIdx = (currentPage - 1) * pageSize + idx;
                const openUpward = paginatedData.length > 2 && idx >= 2 && idx >= paginatedData.length - 2;

                return (
                  <tr
                    key={key}
                    className={`hover:bg-gray-50/70 dark:hover:bg-slate-800/40 transition-colors ${rowClassName ? rowClassName(row) : ""}`}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`${cellPx} text-[15px] text-gray-700 dark:text-white ${col.className ?? ""}`}
                      >
                        {col.render
                          ? col.render(row, globalIdx)
                          : (row[col.key] ?? "—")}
                      </td>
                    ))}

                    {/* Row actions */}
                    {actions && actions.length > 0 && (
                      <td className={`${cellPx} text-center relative`}>
                        <button
                          onClick={() =>
                            setOpenActionId(openActionId === key ? null : key)
                          }
                          className="p-1 rounded-md text-gray-400 dark:text-white hover:text-gray-600 dark:text-white dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {openActionId === key && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenActionId(null)}
                            />
                            <div
                              ref={dropdownRef}
                              className={`absolute right-4 z-[9999999999999999] w-40 rounded-xl bg-white dark:bg-[#1a1f2c] shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-gray-100 dark:border-slate-800 overflow-hidden animate-in fade-in ${
                                openUpward
                                  ? `${compact ? "bottom-10" : "bottom-12"} origin-bottom slide-in-from-bottom-1`
                                  : "top-12 origin-top slide-in-from-top-1"
                              }`}
                            >
                              {actions
                                .filter((a) => !a.visible || a.visible(row))
                                .map((action, aIdx) => (
                                  <button
                                    key={aIdx}
                                    onClick={() => {
                                      action.onClick(row);
                                      setOpenActionId(null);
                                    }}
                                    className={`group w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${action.className || "text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800"
                                      }`}
                                  >
                                    {action.icon && (
                                      <span className={action.className ? "" : "text-gray-400 dark:text-white"}>
                                        {action.icon}
                                      </span>
                                    )}
                                    {action.label}
                                  </button>
                                ))}
                            </div>
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {total > pageSize && (
        <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/30">
          <p className="text-[15px] text-gray-500 dark:text-white">
            Showing <span className="font-medium text-gray-700 dark:text-white">{showingFrom}</span> to{" "}
            <span className="font-medium text-gray-700 dark:text-white">{showingTo}</span> of{" "}
            <span className="font-medium text-gray-700 dark:text-white">{total}</span> entries
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-600 dark:text-white"
            >
              <ChevronLeft size={16} />
            </button>

            {getPageRange().map((page, i) =>
              page === -1 ? (
                <span key={`e${i}`} className="px-1 text-gray-400 dark:text-white text-sm">
                  …
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-[15px] font-medium transition-colors ${currentPage === page
                      ? "bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
                    }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() =>
                setCurrentPage(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-600 dark:text-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
