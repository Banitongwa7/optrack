"use client";
import { IoClose, IoOpenOutline } from "react-icons/io5";
import { MdOutlineMailOutline, MdOutlineLocationOn, MdOutlineCalendarToday } from "react-icons/md";

function formatDate(value) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Row({ label, children }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase font-semibold">{label}</p>
      <div className="text-sm text-gray-800 mt-0.5">{children}</div>
    </div>
  );
}

export default function OpportunityDetailModal({ item, onClose }) {
  if (!item) return null;

  const period =
    [formatDate(item.begin_at), formatDate(item.end_at)].filter(Boolean).join(" → ") || "—";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center overflow-y-auto py-10 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-4 gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{item.name}</h2>
            <p className="text-sm text-gray-500">{item.company}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600 shrink-0">
            <IoClose className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="bg-gray-100 text-gray-700 py-1 px-3 rounded-full text-xs font-medium">
              {item.type_opportunity}
            </span>
            {item.domain && (
              <span className="bg-gray-100 text-gray-700 py-1 px-3 rounded-full text-xs font-medium">
                {item.domain}
              </span>
            )}
            {item.closed ? (
              <span className="bg-red-200 text-red-700 py-1 px-3 rounded-full text-xs font-medium">Closed</span>
            ) : (
              <span className="bg-green-200 text-green-700 py-1 px-3 rounded-full text-xs font-medium">Open</span>
            )}
            {item.remote && (
              <span className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-xs font-medium">Remote</span>
            )}
          </div>

          {item.description && (
            <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
            <Row label="Location">
              <span className="flex items-center gap-1.5">
                <MdOutlineLocationOn className="text-gray-400 w-4 h-4" />
                {item.city}, {item.country}
              </span>
            </Row>
            <Row label="Period">
              <span className="flex items-center gap-1.5">
                <MdOutlineCalendarToday className="text-gray-400 w-4 h-4" />
                {period}
              </span>
            </Row>
            <Row label="Year">{item.year ?? "—"}</Row>
            <Row label="Contact">
              {item.email_company ? (
                <a
                  href={`mailto:${item.email_company}`}
                  className="flex items-center gap-1.5 text-blue-700 hover:underline"
                >
                  <MdOutlineMailOutline className="w-4 h-4" />
                  {item.email_company}
                </a>
              ) : (
                "—"
              )}
            </Row>
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-100 px-6 py-4">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-dark-purple text-white text-sm rounded-md px-4 py-2 hover:opacity-90"
          >
            <IoOpenOutline className="w-4 h-4" /> Open the offer
          </a>
        </div>
      </div>
    </div>
  );
}
