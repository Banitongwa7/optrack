"use client";

import { useEffect, useMemo, useState } from "react";

const EMPTY_FORM = {
  id: "",
  name: "",
  description: "",
  company: "",
  email_company: "",
  type_opportunity: "Internship",
  remote: false,
  domain: "",
  url: "",
  country: "",
  city: "",
  year: "",
  begin_at: "",
  end_at: "",
  closed: "",
};

export default function AdminClient({ email }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const selectedId = useMemo(() => Number(form.id), [form.id]);

  const loadRows = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/opportunity", { cache: "no-store" });
      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Impossible de charger les données");
        return;
      }
      setRows(result.data || []);
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRows();
  }, []);

  const resetForm = () => setForm(EMPTY_FORM);

  const fillFromRow = (row) => {
    setForm({
      id: String(row.id),
      name: row.name || "",
      description: row.description || "",
      company: row.company || "",
      email_company: row.email_company || "",
      type_opportunity: row.type_opportunity || "Internship",
      remote: Boolean(row.remote),
      domain: row.domain || "",
      url: row.url || "",
      country: row.country || "",
      city: row.city || "",
      year: row.year ?? "",
      begin_at: row.begin_at ? row.begin_at.slice(0, 10) : "",
      end_at: row.end_at ? row.end_at.slice(0, 10) : "",
      closed: row.closed === null || row.closed === undefined ? "" : String(Boolean(row.closed)),
    });
  };

  const payload = () => ({
    ...form,
    remote: Boolean(form.remote),
    year: form.year === "" ? null : Number(form.year),
    closed: form.closed === "" ? null : form.closed === "true",
    begin_at: form.begin_at || null,
    end_at: form.end_at || null,
  });

  const save = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    const isUpdate = Number.isInteger(selectedId) && selectedId > 0;

    try {
      const response = await fetch("/api/admin/opportunity", {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isUpdate ? { ...payload(), id: selectedId } : payload()),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Enregistrement impossible");
        return;
      }
      setMessage(isUpdate ? "Opportunité mise à jour." : "Opportunité créée.");
      resetForm();
      await loadRows();
    } catch {
      setError("Erreur réseau");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    setError("");
    setMessage("");

    const response = await fetch(`/api/admin/opportunity?id=${id}`, {
      method: "DELETE",
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Suppression impossible");
      return;
    }

    if (String(form.id) === String(id)) resetForm();
    setMessage("Opportunité supprimée.");
    await loadRows();
    setDeletingId(null);
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-10 py-6">
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-gray-300 pb-4">
        <div>
          <h1 className="text-2xl font-semibold">Administration</h1>
          <p className="text-sm text-gray-500">Connecté en tant que {email}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="px-3 py-2 rounded-md border border-gray-300 text-sm bg-white hover:bg-gray-100"
        >
          Se déconnecter
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-medium mb-4">
            {selectedId ? `Modifier #${selectedId}` : "Nouvelle opportunité"}
          </h2>

          <form onSubmit={save} className="space-y-3">
            <input type="hidden" value={form.id} />

            <Input label="Nom" value={form.name} onChange={(value) => setForm((prev) => ({ ...prev, name: value }))} required />
            <Input label="Entreprise" value={form.company} onChange={(value) => setForm((prev) => ({ ...prev, company: value }))} required />
            <Input label="Type" value={form.type_opportunity} onChange={(value) => setForm((prev) => ({ ...prev, type_opportunity: value }))} required />
            <Input label="URL" value={form.url} onChange={(value) => setForm((prev) => ({ ...prev, url: value }))} required />
            <Input label="Pays" value={form.country} onChange={(value) => setForm((prev) => ({ ...prev, country: value }))} required />
            <Input label="Ville" value={form.city} onChange={(value) => setForm((prev) => ({ ...prev, city: value }))} required />
            <Input label="Email entreprise" value={form.email_company} onChange={(value) => setForm((prev) => ({ ...prev, email_company: value }))} />
            <Input label="Domaine" value={form.domain} onChange={(value) => setForm((prev) => ({ ...prev, domain: value }))} />
            <Input label="Année" type="number" value={form.year} onChange={(value) => setForm((prev) => ({ ...prev, year: value }))} />
            <Input label="Début" type="date" value={form.begin_at} onChange={(value) => setForm((prev) => ({ ...prev, begin_at: value }))} />
            <Input label="Fin" type="date" value={form.end_at} onChange={(value) => setForm((prev) => ({ ...prev, end_at: value }))} />

            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={form.remote}
                onChange={(e) => setForm((prev) => ({ ...prev, remote: e.target.checked }))}
              />
              Télétravail
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Statut
              <select
                value={form.closed}
                onChange={(e) => setForm((prev) => ({ ...prev, closed: e.target.value }))}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Inconnu</option>
                <option value="false">Ouvert</option>
                <option value="true">Fermé</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Description
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {message && <p className="text-sm text-green-700">{message}</p>}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-dark-purple text-white rounded-md hover:opacity-95 disabled:opacity-60"
              >
                {submitting ? "En cours..." : selectedId ? "Mettre à jour" : "Créer"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100"
              >
                Réinitialiser
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Opportunités</h2>
            <button
              type="button"
              onClick={loadRows}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Recharger
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500">Chargement...</p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-gray-500">Aucune donnée.</p>
          ) : (
            <div className="max-h-[65vh] overflow-auto divide-y divide-gray-200">
              {rows.map((row) => (
                <div key={row.id} className="py-3 flex gap-3 items-start justify-between">
                  <button
                    type="button"
                    onClick={() => fillFromRow(row)}
                    className="text-left flex-1 min-w-0"
                  >
                    <p className="font-medium text-gray-900 truncate">#{row.id} · {row.name}</p>
                    <p className="text-sm text-gray-500 truncate">{row.company} · {row.country}</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingId(row.id)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {deletingId !== null && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
        >
          <div className="w-full max-w-md bg-white rounded-lg p-5 border border-gray-200">
            <h3 id="delete-title" className="text-lg font-medium text-gray-900">
              Confirmer la suppression
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Voulez-vous vraiment supprimer l&apos;opportunité #{deletingId} ?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => remove(deletingId)}
                className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Input({ label, value, onChange, type = "text", required = false }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
      />
    </label>
  );
}
