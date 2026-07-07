"use client";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

const EMPTY = {
  name: "",
  company: "",
  type_opportunity: "",
  domain: "",
  url: "",
  country: "",
  city: "",
  email_company: "",
  description: "",
  begin_at: "",
  end_at: "",
  remote: false,
};

const inputClass =
  "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dark-purple/40";

function Field({ label, required, children }) {
  return (
    <label className="block text-sm">
      <span className="text-gray-700 font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

export default function AddOpportunityModal({ open, onClose, onCreated, options }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!open) return null;

  const set = (field) => (e) =>
    setForm((f) => ({
      ...f,
      [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/opportunity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || `API error (${res.status})`);
      setForm(EMPTY);
      onCreated(payload.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center overflow-y-auto py-10 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Add an opportunity</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600"
          >
            <IoClose className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={submit} className="px-6 py-4 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-3 py-2 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title" required>
              <input required className={inputClass} value={form.name} onChange={set("name")} placeholder="Frontend Developer Internship" />
            </Field>
            <Field label="Company" required>
              <input required className={inputClass} value={form.company} onChange={set("company")} placeholder="TechNova" />
            </Field>
            <Field label="Type" required>
              <input required className={inputClass} value={form.type_opportunity} onChange={set("type_opportunity")} list="type-options" placeholder="Internship, Full-time…" />
              <datalist id="type-options">
                {options.types.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </Field>
            <Field label="Domain">
              <input className={inputClass} value={form.domain} onChange={set("domain")} list="domain-options" placeholder="Software Development" />
              <datalist id="domain-options">
                {options.domains.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </Field>
            <Field label="Country" required>
              <input required className={inputClass} value={form.country} onChange={set("country")} list="country-options" placeholder="Tunisia" />
              <datalist id="country-options">
                {options.countries.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
            <Field label="City" required>
              <input required className={inputClass} value={form.city} onChange={set("city")} placeholder="Tunis" />
            </Field>
            <Field label="Link (URL)" required>
              <input required type="url" className={inputClass} value={form.url} onChange={set("url")} placeholder="https://…" />
            </Field>
            <Field label="Company email">
              <input type="email" className={inputClass} value={form.email_company} onChange={set("email_company")} placeholder="jobs@company.com" />
            </Field>
            <Field label="Start date">
              <input type="date" className={inputClass} value={form.begin_at} onChange={set("begin_at")} />
            </Field>
            <Field label="End date">
              <input type="date" className={inputClass} value={form.end_at} onChange={set("end_at")} />
            </Field>
          </div>

          <Field label="Description">
            <textarea rows={3} className={inputClass} value={form.description} onChange={set("description")} />
          </Field>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.remote} onChange={set("remote")} className="rounded" />
            Remote position
          </label>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 pb-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm rounded-md bg-dark-purple text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save opportunity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
