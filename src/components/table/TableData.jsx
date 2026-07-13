"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IoLinkSharp } from "react-icons/io5";
import { BsSearch, BsDownload } from "react-icons/bs";
import { MdChevronLeft, MdChevronRight, MdArrowDropUp, MdArrowDropDown } from "react-icons/md";
import OpportunityDetailModal from "@/components/opportunity/OpportunityDetailModal";

const selectClass =
  "border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-dark-purple/40";

const FILTER_KEYS = ["search", "country", "type", "domain", "status", "remote", "year", "sort", "dir", "page"];

const COLUMNS = [
  { label: "Title", sort: "name", align: "text-left" },
  { label: "Company", sort: "company", align: "text-left" },
  { label: "Type", align: "text-center" },
  { label: "Domain", align: "text-center" },
  { label: "Country", sort: "country", align: "text-center" },
  { label: "City", align: "text-center" },
  { label: "Status", align: "text-center" },
  { label: "Year", sort: "year", align: "text-center" },
  { label: "Link", align: "text-center" },
];

export default function TableData() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // The URL is the single source of truth for filters, sort and page —
  // links are shareable and the map/navbar deep-links just work.
  const filters = useMemo(() => {
    const f = {};
    for (const key of FILTER_KEYS) f[key] = searchParams.get(key) ?? "";
    return f;
  }, [searchParams]);

  const setFilters = useCallback(
    (changes) => {
      const params = new URLSearchParams(searchParams);
      for (const [key, value] of Object.entries(changes)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      if (!("page" in changes)) params.delete("page");
      router.replace(`/explore?${params}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Search input: local state for typing, debounced into the URL.
  const [searchText, setSearchText] = useState(filters.search);
  const debounceRef = useRef();
  useEffect(() => setSearchText(filters.search), [filters.search]);

  const onSearchChange = (value) => {
    setSearchText(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setFilters({ search: value.trim() }), 350);
  };

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({ countries: [], types: [], domains: [], years: [] });
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((stats) => {
        if (!stats) return;
        setOptions({
          countries: stats.byCountry.map((c) => String(c.label)).sort(),
          types: stats.byType.map((t) => String(t.label)).sort(),
          domains: stats.byDomain.map((d) => String(d.label)).sort(),
          years: stats.years ?? [],
        });
      })
      .catch(() => {});
  }, []);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    for (const key of FILTER_KEYS) {
      if (filters[key]) params.set(key, filters[key]);
    }
    return params.toString();
  }, [filters]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/opportunity?${queryString}`)
      .then((res) => {
        if (!res.ok) throw new Error(`API error (${res.status})`);
        return res.json();
      })
      .then((payload) => {
        if (cancelled) return;
        setResult(payload);
        setError(null);
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [queryString]);

  // First click on a column sorts ascending; clicking again flips.
  const toggleSort = (field) => {
    if (!field) return;
    const dir = filters.sort === field && filters.dir === "asc" ? "desc" : "asc";
    setFilters({ sort: field, dir });
  };

  const hasFilters = FILTER_KEYS.some((k) => k !== "page" && filters[k]);
  const exportUrl = `/api/opportunity/export?${queryString}`;
  const data = result?.data ?? [];
  const totalPage = result?.totalPage ?? 1;
  const page = Number(result?.page ?? filters.page ?? 1) || 1;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-56">
          <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search title, company, domain…"
            className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dark-purple/40"
          />
        </div>
        <select value={filters.country} onChange={(e) => setFilters({ country: e.target.value })} className={selectClass} aria-label="Country">
          <option value="">All countries</option>
          {options.countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={filters.type} onChange={(e) => setFilters({ type: e.target.value })} className={selectClass} aria-label="Type">
          <option value="">All types</option>
          {options.types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select value={filters.domain} onChange={(e) => setFilters({ domain: e.target.value })} className={selectClass} aria-label="Domain">
          <option value="">All domains</option>
          {options.domains.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select value={filters.year} onChange={(e) => setFilters({ year: e.target.value })} className={selectClass} aria-label="Year">
          <option value="">All years</option>
          {options.years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select value={filters.status} onChange={(e) => setFilters({ status: e.target.value })} className={selectClass} aria-label="Status">
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        <select value={filters.remote} onChange={(e) => setFilters({ remote: e.target.value })} className={selectClass} aria-label="Work mode">
          <option value="">Remote & on-site</option>
          <option value="true">Remote</option>
          <option value="false">On-site</option>
        </select>
        {hasFilters && (
          <button
            onClick={() => router.replace("/explore", { scroll: false })}
            className="text-sm text-gray-500 hover:text-gray-800 underline"
          >
            Reset
          </button>
        )}
        <a
          href={exportUrl}
          download
          className="flex items-center gap-2 ml-auto border border-gray-300 bg-white text-gray-700 text-sm rounded-md px-3.5 py-2 hover:bg-gray-50"
          title="Download the current view as CSV"
        >
          <BsDownload className="w-4 h-4" /> Export CSV
        </a>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-4 mb-4">
          Unable to load data: {error}. Check the database connection.
        </div>
      )}

      <div className="bg-white shadow rounded-sm overflow-x-auto">
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className="bg-dark-purple text-white uppercase text-sm leading-normal">
              {COLUMNS.map((col) => (
                <th
                  key={col.label}
                  className={`py-3 px-6 ${col.align} ${col.sort ? "cursor-pointer select-none hover:bg-white/10" : ""}`}
                  onClick={() => toggleSort(col.sort)}
                  title={col.sort ? "Sort" : undefined}
                >
                  <span className="inline-flex items-center">
                    {col.label}
                    {col.sort && filters.sort === col.sort && (
                      filters.dir === "asc" ? (
                        <MdArrowDropUp className="w-5 h-5" />
                      ) : (
                        <MdArrowDropDown className="w-5 h-5" />
                      )
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-medium">
            {data.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                onClick={() => setSelected(item)}
                title="View details"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap max-w-xs truncate">{item.name}</td>
                <td className="py-3 px-6 text-left">{item.company}</td>
                <td className="py-3 px-6 text-center">{item.type_opportunity}</td>
                <td className="py-3 px-6 text-center">{item.domain ?? "—"}</td>
                <td className="py-3 px-6 text-center">{item.country}</td>
                <td className="py-3 px-6 text-center">
                  {item.remote ? (
                    <span className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-xs">Remote</span>
                  ) : (
                    item.city
                  )}
                </td>
                <td className="py-3 px-6 text-center">
                  {item.closed ? (
                    <span className="bg-red-200 text-red-700 py-1 px-3 rounded-full text-xs">Closed</span>
                  ) : (
                    <span className="bg-green-200 text-green-700 py-1 px-3 rounded-full text-xs">Open</span>
                  )}
                </td>
                <td className="py-3 px-6 text-center">{item.year ?? "—"}</td>
                <td className="py-3 px-6">
                  <div className="flex items-center justify-center">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${item.name}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IoLinkSharp className="w-5 h-5 transform hover:text-purple-500 hover:scale-110 cursor-pointer" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && data.length === 0 && !error && (
              <tr>
                <td colSpan={COLUMNS.length} className="py-10 text-center text-gray-400">
                  No opportunities match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {loading && <div className="py-4 text-center text-sm text-gray-400">Loading…</div>}
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <span>
          {result ? `${result.countData} opportunit${result.countData === 1 ? "y" : "ies"}` : ""}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilters({ page: String(Math.max(1, page - 1)) })}
            disabled={page <= 1}
            aria-label="Previous page"
            className="p-1.5 rounded-md border border-gray-300 disabled:opacity-40 hover:bg-gray-100"
          >
            <MdChevronLeft className="w-5 h-5" />
          </button>
          <span className="tabular-nums">Page {page} / {totalPage}</span>
          <button
            onClick={() => setFilters({ page: String(Math.min(totalPage, page + 1)) })}
            disabled={page >= totalPage}
            aria-label="Next page"
            className="p-1.5 rounded-md border border-gray-300 disabled:opacity-40 hover:bg-gray-100"
          >
            <MdChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <OpportunityDetailModal item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
