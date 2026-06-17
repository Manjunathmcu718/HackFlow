import React from "react";

const MAP = {
  upcoming:    ["bg-blue-500/10 text-blue-600 border-blue-500/20",     "Upcoming"],
  active:      ["bg-emerald-500/10 text-emerald-600 border-emerald-500/20", "Active"],
  closed:      ["bg-gray-100 text-gray-500 border-gray-200",           "Closed"],
  submitted:   ["bg-emerald-500/10 text-emerald-600 border-emerald-500/20", "Submitted"],
  in_progress: ["bg-amber-500/10 text-amber-600 border-amber-500/20",  "In Progress"],
  not_started: ["bg-gray-100 text-gray-500 border-gray-200",           "Not Started"],
  draft:       ["bg-amber-500/10 text-amber-600 border-amber-500/20",  "Draft"],
  confirmed:   ["bg-emerald-500/10 text-emerald-600 border-emerald-500/20", "Confirmed"],
  pending:     ["bg-amber-500/10 text-amber-600 border-amber-500/20",  "Pending"],
  scored:      ["bg-orange-500/10 text-orange-600 border-orange-500/20", "Scored"],
  unscored:    ["bg-gray-100 text-gray-500 border-gray-200",           "Unscored"],
  urgent:      ["bg-red-500/10 text-red-600 border-red-500/20",        "Urgent"],
  warning:     ["bg-amber-500/10 text-amber-600 border-amber-500/20",  "Warning"],
  info:        ["bg-blue-500/10 text-blue-600 border-blue-500/20",     "Info"],
};

export default function StatusBadge({ status }) {
  const [cls, label] = MAP[status] || MAP.pending;
  return (
    <span className={`inline-flex items-center text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full border ${cls}`}>
      {label}
    </span>
  );
}

