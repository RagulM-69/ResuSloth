// ResultsCard.jsx — Warm Sand theme
import React, { useEffect, useRef, useState } from 'react';

function getScoreCfg(score) {
    if (score >= 71) return { stroke: '#6B9E6B', text: '#3D6B3D', bg: '#F0F7F0', border: '#B8D8B8', label: 'Strong Match' };
    if (score >= 41) return { stroke: '#C17B3F', text: '#8B4E1A', bg: '#FDF5EC', border: '#E8C9A0', label: 'Partial Match' };
    return { stroke: '#C0392B', text: '#8B1A1A', bg: '#FDF0EE', border: '#F5B7B1', label: 'Needs Work' };
}

function useCountUp(target, dur = 1100) {
    const [n, setN] = useState(0);
    useEffect(() => {
        if (!target) return;
        let cur = 0;
        const step = target / 55;
        const t = setInterval(() => {
            cur += step;
            if (cur >= target) { setN(target); clearInterval(t); }
            else setN(Math.round(cur));
        }, dur / 55);
        return () => clearInterval(t);
    }, [target]);
    return n;
}

function ScoreGauge({ score }) {
    const cfg = getScoreCfg(score);
    const r = 54;
    const circ = 2 * Math.PI * r;
    const [offset, setOffset] = useState(circ);
    const animated = useCountUp(score);

    useEffect(() => {
        const t = setTimeout(() => setOffset(circ - (score / 100) * circ), 100);
        return () => clearTimeout(t);
    }, [score, circ]);

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative w-36 h-36">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                    <circle cx="64" cy="64" r={r} fill="none" stroke="#F5EDE3" strokeWidth="10" />
                    <circle cx="64" cy="64" r={r} fill="none"
                        stroke={cfg.stroke} strokeWidth="10" strokeLinecap="round"
                        strokeDasharray={circ} strokeDashoffset={offset}
                        className="score-ring" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pop-in">
                    <span className="text-[38px] font-black leading-none" style={{ color: cfg.stroke }}>{animated}</span>
                    <span className="text-[10px] text-[#8C7B6B] font-medium uppercase tracking-wide mt-0.5">/ 100</span>
                </div>
            </div>
            <span className="text-[11px] font-semibold px-3 py-1 rounded-full border"
                style={{ color: cfg.text, background: cfg.bg, borderColor: cfg.border }}>
                {cfg.label}
            </span>
        </div>
    );
}

function Pill({ text, variant = 'brown' }) {
    const map = {
        green: { bg: '#6B9E6B', color: '#FFFFFF' },
        red: { bg: '#C0392B', color: '#FFFFFF' },
        brown: { bg: '#C17B3F', color: '#FFFFFF' },
    };
    const s = map[variant];
    return (
        <span className="pill text-[11.5px]" style={{ background: s.bg, color: s.color }}>
            {text}
        </span>
    );
}

function SkillSection({ icon, title, items, variant }) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-2.5">
                <span className="text-base">{icon}</span>
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#8C7B6B]">{title}</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
                {items.length > 0
                    ? items.map((s, i) => <Pill key={i} text={s} variant={variant} />)
                    : <span className="text-[12px] text-[#C4B8A8] italic">None identified</span>}
            </div>
        </div>
    );
}

export default function ResultsCard({ results, onReset }) {
    const ref = useRef(null);
    useEffect(() => {
        setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }, []);

    return (
        <div ref={ref} className="slide-up mt-10">
            {/* Divider */}
            <div className="flex items-center gap-4 mb-7">
                <div className="flex-1 h-px bg-[#E8DDD0]" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8C7B6B]">Analysis Results</span>
                <div className="flex-1 h-px bg-[#E8DDD0]" />
            </div>

            <div className="card p-6 sm:p-8 max-w-[1200px] mx-auto">
                {/* Top bar */}
                <div className="flex items-start justify-between flex-wrap gap-4 mb-8 pb-6 border-b border-[#E8DDD0]">
                    <div>
                        <h2 className="text-[17px] font-bold text-[#2C2416]">Resume Analysis Report</h2>
                        <p className="text-[12px] text-[#8C7B6B] mt-0.5">ATS compatibility score powered by Gemini AI</p>
                    </div>
                    <button onClick={onReset}
                        className="flex items-center gap-1.5 text-[12px] font-semibold text-[#8C7B6B] border border-[#E8DDD0] bg-white px-3 py-1.5 rounded-lg hover:border-[#C17B3F] hover:text-[#C17B3F] transition-colors duration-150">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        New Analysis
                    </button>
                </div>

                {/* Score + Summary */}
                <div className="flex flex-col sm:flex-row gap-8 mb-8">
                    <div className="flex flex-col items-center gap-1 sm:flex-shrink-0">
                        <ScoreGauge score={results.score} />
                        <p className="text-[10px] text-[#8C7B6B] uppercase tracking-widest font-semibold mt-1">ATS Score</p>
                    </div>
                    {results.summary && (
                        <div className="flex-1 bg-[#FDF5EC] border border-[#E8DDD0] rounded-xl p-5 flex flex-col justify-center">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#C17B3F] mb-2">Summary</p>
                            <p className="text-[13px] text-[#2C2416] leading-relaxed">{results.summary}</p>
                        </div>
                    )}
                </div>

                {/* Skills grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 mb-8 border-b border-[#E8DDD0]">
                    <SkillSection icon="✅" title="Matched Skills" items={results.matched_skills} variant="green" />
                    <SkillSection icon="⚠️" title="Missing Skills" items={results.missing_skills} variant="red" />
                    <SkillSection icon="⭐" title="Your Strengths" items={results.strengths} variant="brown" />
                </div>

                {/* Experience + Education */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8 mb-8 border-b border-[#E8DDD0]">
                    {[
                        { label: 'Experience Match', icon: '💼', val: results.experience_match },
                        { label: 'Education Match', icon: '🎓', val: results.education_match },
                    ].map(({ label, icon, val }) => (
                        <div key={label} className="bg-[#FDFAF6] border border-[#E8DDD0] rounded-xl p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#8C7B6B] mb-2">
                                {icon} {label}
                            </p>
                            <p className="text-[13px] text-[#5C4E3E] leading-relaxed">{val}</p>
                        </div>
                    ))}
                </div>

                {/* Suggestions */}
                <div className="mb-8">
                    <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#8C7B6B] mb-4">
                        💡 Improvement Suggestions
                    </h3>
                    <div className="flex flex-col gap-3">
                        {results.suggestions.map((tip, i) => (
                            <div key={i} className="flex gap-4 border-l-[3px] border-[#C17B3F] pl-4 py-1">
                                <span className="text-[12px] font-bold text-[#C17B3F] flex-shrink-0 mt-0.5">{i + 1}.</span>
                                <p className="text-[13px] text-[#5C4E3E] leading-relaxed">{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="flex justify-center pt-6 border-t border-[#E8DDD0]">
                    <button onClick={onReset} className="btn-outline">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Analyze Another Resume
                    </button>
                </div>
            </div>
        </div>
    );
}
