"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IoLinkSharp, IoAdd } from "react-icons/io5";
import { BsSearch } from "react-icons/bs";
import { MdChevronLeft, MdChevronRight, MdDeleteOutline, MdOutlineLock, MdOutlineLockOpen } from "react-icons/md";
import AddOpportunityModal from "@/components/opportunity/AddOpportunityModal";

const selectClass =
  "border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-dark-purple/40";

export default function TableData() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [country, setCountry] = useState(searchParams.get("country") ?? "");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({ countries: [], types: [], domains: [] });
  const [modalOpen, setModalOpen] = useState(false);

  // Sync when arriving from the map or the navbar search.
  useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
    setCountry(searchParams.get("country") ?? "");
    setPage(1);
  }, [searchParams]);

  const loadOptions = useCallback(() => {
    fetch("/api/stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((stats) => {
        if (!stats) return;
        setOptions({
          countries: stats.byCountry.map((c) => String(c.label)).sort(),
          types: stats.byType.map((t) => String(t.label)).sort(),
          domains: stats.byDomain.map((d) => String(d.label)).sort(),
        });
      })
      .catch(() => {});
  }, []);

  useEffect(loadOptions, [loadOptions]);

  // Debounced data fetching.
  const debounceRef = useRef();
  const fetchData = useCallback(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (country) params.set("country", country);
    if (type) params.set("type", type);
    if (status) params.set("status", status);
    params.set("page", String(page));

    setLoading(true);
    fetch(`/api/opportunity?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error(`API error (${res.status})`);
        return res.json();
      })
      .then((payload) => {
        setResult(payload);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, country, type, status, page]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchData, 350);
    return () => clearTimeout(debounceRef.current);
  }, [fetchData]);

  const toggleClosed = async (item) => {
    await fetch(`/api/opportunity/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ closed: !item.closed }),
    });
    fetchData();
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete "${item.name}" at ${item.company}?`)) return;
    await fetch(`/api/opportunity/${item.id}`, { method: "DELETE" });
    fetchData();
    loadOptions();
  };

  const data = result?.data ?? [];
  const totalPage = result?.totalPage ?? 1;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-56">
          <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search title, company, domain…"
            className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dark-purple/40"
          />
        </div>
        <select value={country} onChange={(e) => { setCountry(e.target.value); setPage(1); }} className={selectClass}>
          <option value="">All countries</option>
          {options.countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className={selectClass}>
          <option value="">All types</option>
          {options.types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className={selectClass}>
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 bg-dark-purple text-white text-sm rounded-md px-4 py-2 hover:opacity-90"
        >
          <IoAdd className="w-5 h-5" /> Add
        </button>
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
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Company</th>
              <th className="py-3 px-6 text-center">Type</th>
              <th className="py-3 px-6 text-center">Domain</th>
              <th className="py-3 px-6 text-center">Country</th>
              <th className="py-3 px-6 text-center">City</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Year</th>
              <th className="py-3 px-6 text-center">Link</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-medium">
            {data.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap max-w-xs truncate" title={item.description ?? item.name}>
                  {item.name}
                </td>
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
                    <a href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${item.name}`}>
                      <IoLinkSharp className="w-5 h-5 transform hover:text-purple-500 hover:scale-110 cursor-pointer" />
                    </a>
                  </div>
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => toggleClosed(item)}
                      title={item.closed ? "Reopen" : "Mark as closed"}
                      className="text-gray-400 hover:text-gray-700"
                    >
                      {item.closed ? <MdOutlineLockOpen className="w-5 h-5" /> : <MdOutlineLock className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => remove(item)}
                      title="Delete"
                      className="text-gray-400 hover:text-red-600"
                    >
                      <MdDeleteOutline className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && data.length === 0 && !error && (
              <tr>
                <td colSpan={10} className="py-10 text-center text-gray-400">
                  No opportunities match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {loading && (
          <div className="py-4 text-center text-sm text-gray-400">Loading…</div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <span>
          {result ? `${result.countData} opportunit${result.countData === 1 ? "y" : "ies"}` : ""}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            aria-label="Previous page"
            className="p-1.5 rounded-md border border-gray-300 disabled:opacity-40 hover:bg-gray-100"
          >
            <MdChevronLeft className="w-5 h-5" />
          </button>
          <span className="tabular-nums">
            Page {result?.page ?? page} / {totalPage}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
            disabled={page >= totalPage}
            aria-label="Next page"
            className="p-1.5 rounded-md border border-gray-300 disabled:opacity-40 hover:bg-gray-100"
          >
            <MdChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <AddOpportunityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => {
          setModalOpen(false);
          setPage(1);
          fetchData();
          loadOptions();
        }}
        options={options}
      />
    </div>
  );
}
