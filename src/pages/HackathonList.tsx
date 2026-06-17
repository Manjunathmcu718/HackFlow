import React, { useState, useMemo, useEffect } from "react";
import { api } from "@/lib/mockData";
import { useQuery } from "@tanstack/react-query";
import PageShell from "@/components/shared/PageShell";
import { Search, ArrowRight, Zap } from "lucide-react";
import HackCard from "@/components/hackathons/HackCard";
import HackathonListHero from "@/components/hackathons/HackathonListHero";
import type { Hackathon } from "@/mocks/types";

export default function HackathonList() {
  const [search,   setSearch]   = useState("");
  const [status,   setStatus]   = useState("all");
  const [track,    setTrack]    = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo,   setDateTo]   = useState("");
  const [page,     setPage]     = useState(1);
  const PER_PAGE = 6;
  const [preferredTrack, setPreferredTrack] = useState(() => window.localStorage.getItem("beetlex-preferred-track") || "");

  const { data: hackathons = [], isLoading } = useQuery<Hackathon[]>({
    queryKey: ["hackathons"],
    queryFn: () => api.hackathons.list() as Promise<Hackathon[]>,
  });

  const allTracks = useMemo(() => {
    const s = new Set<string>();
    hackathons.forEach((h: Hackathon) => (h.tracks || []).forEach(tr => tr.name && s.add(tr.name)));
    return [...s];
  }, [hackathons]);

  useEffect(() => {
    if (track !== "all") {
      setPreferredTrack(track);
      window.localStorage.setItem("beetlex-preferred-track", track);
    }
  }, [track]);

  const filtered = useMemo(() => hackathons.filter(h => {
    const q = search.toLowerCase();
    return (
      (h.title?.toLowerCase().includes(q) || h.tagline?.toLowerCase().includes(q)) &&
      (status === "all" || h.status === status) &&
      (track  === "all" || (h.tracks || []).some(tr => tr.name === track)) &&
      (!dateFrom || (h.start_date && h.start_date >= dateFrom)) &&
      (!dateTo   || (h.end_date   && h.end_date   <= dateTo))
    );
  }), [hackathons, search, status, track, dateFrom, dateTo]);

  const shown = filtered.slice(0, page * PER_PAGE);

  const recommended = useMemo(() => {
    const sorted = [...hackathons].sort((a, b) => {
      const aMatch = preferredTrack && (a.tracks || []).some(tr => tr.name === preferredTrack) ? 2 : 0;
      const bMatch = preferredTrack && (b.tracks || []).some(tr => tr.name === preferredTrack) ? 2 : 0;
      const aActive = a.status === "active" ? 1 : 0;
      const bActive = b.status === "active" ? 1 : 0;
      const aUpcoming = a.status === "upcoming" ? 1 : 0;
      const bUpcoming = b.status === "upcoming" ? 1 : 0;
      const aPopularity = a.participant_count || 0;
      const bPopularity = b.participant_count || 0;

      return (bMatch - aMatch) || (bActive - aActive) || (bUpcoming - aUpcoming) || (bPopularity - aPopularity);
    });

    return sorted.slice(0, 2);
  }, [hackathons, preferredTrack]);

  return (
    <PageShell>
      <HackathonListHero hackathons={hackathons} />`r`n`r`n      {recommended.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
          <div className="rounded-3xl p-5 sm:p-6 card-light" style={{ background:"rgba(255,255,255,.92)" }}>
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.2em] pill-coral px-3 py-1 inline-flex items-center gap-2">
                  <Zap className="w-3 h-3" aria-hidden="true" /> Recommended for you
                </p>
                <p className="text-sm mt-3" style={{ color:"rgba(26,31,60,.55)" }}>
                  Ranked by your recent track filter, then event status, then participant interest.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommended.map((h, i) => <HackCard key={`rec-${h.id}`} h={h} i={i} />)}
            </div>
          </div>
        </div>
      )}

      {/* Filters + Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
        {/* Filter bar */}
        <div className="flex flex-wrap gap-3 mb-10" role="search" aria-label="Filter hackathons">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:"rgba(244,98,42,.5)" }} aria-hidden="true" />
            <input placeholder="Search hackathons..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 h-12 rounded-2xl text-sm outline-none"
              style={{ background:"#fff",border:"1px solid rgba(0,0,0,.08)",color:"#1A1F3C" }}
              aria-label="Search hackathons" />
          </div>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="h-12 rounded-2xl px-4 text-sm font-semibold outline-none"
            style={{ background:"#fff",border:"1px solid rgba(0,0,0,.08)",color:"#1A1F3C" }}
            aria-label="Filter by status">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
            <option value="closed">Closed</option>
          </select>
          <select value={track} onChange={e => { setTrack(e.target.value); setPage(1); }}
            className="h-12 rounded-2xl px-4 text-sm font-semibold outline-none"
            style={{ background:"#fff",border:"1px solid rgba(0,0,0,.08)",color:"#1A1F3C" }}
            aria-label="Filter by track">
            <option value="all">All Tracks</option>
            {allTracks.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }}
            className="h-12 rounded-2xl px-4 text-sm outline-none"
            style={{ background:"#fff",border:"1px solid rgba(0,0,0,.08)",color:dateFrom?"#1A1F3C":"rgba(26,31,60,.4)" }}
            aria-label="Start date from" />
          <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }}
            className="h-12 rounded-2xl px-4 text-sm outline-none"
            style={{ background:"#fff",border:"1px solid rgba(0,0,0,.08)",color:dateTo?"#1A1F3C":"rgba(26,31,60,.4)" }}
            aria-label="Start date to" />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-10 h-10 rounded-full animate-spin" style={{ border:"3px solid rgba(244,98,42,.15)",borderTopColor:"#F4622A" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-heading font-bold text-xl mb-2" style={{ color:"#1A1F3C" }}>No hackathons found</p>
            <p className="text-sm" style={{ color:"rgba(26,31,60,.45)" }}>Try a different search or filter</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shown.map((h: Hackathon, i: number) => <HackCard key={h.id} h={h} i={i} />)}
            </div>
            {shown.length < filtered.length && (
              <div className="flex justify-center mt-12">
                <button onClick={() => setPage(p => p+1)}
                  className="btn-outline flex items-center gap-2 px-8 py-3.5 text-sm">
                  Load More <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </PageShell>
  );
}

 
