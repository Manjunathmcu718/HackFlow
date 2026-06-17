import React from "react";

const statusStyles = {
  upcoming:    "bg-blue-500/10 text-blue-600 border border-blue-500/20",
  active:      "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
  closed:      "bg-gray-100 text-gray-500 border border-gray-200",
  submitted:   "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
  in_progress: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
  not_started: "bg-gray-100 text-gray-500 border border-gray-200",
  draft:       "bg-amber-500/10 text-amber-600 border border-amber-500/20",
  confirmed:   "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
  pending:     "bg-amber-500/10 text-amber-600 border border-amber-500/20",
  scored:      "bg-orange-500/10 text-orange-600 border border-orange-500/20",
  unscored:    "bg-gray-100 text-gray-500 border border-gray-200",
  urgent:      "bg-red-500/10 text-red-600 border border-red-500/20",
  warning:     "bg-amber-500/10 text-amber-600 border border-amber-500/20",
  info:        "bg-blue-500/10 text-blue-600 border border-blue-500/20",
};

const labels = {
  upcoming:"Upcoming", active:"Active", closed:"Closed", submitted:"Submitted",
  in_progress:"In Progress", not_started:"Not Started", draft:"Draft",
  confirmed:"Confirmed", pending:"Pending", scored:"Scored", unscored:"Unscored",
  urgent:"Urgent", warning:"Warning", info:"Info",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full ${statusStyles[status] || statusStyles.pending}`}>
      {labels[status] || status}
    </span>
  );
}

