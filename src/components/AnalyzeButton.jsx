// AnalyzeButton.jsx — Warm Sand theme
import React from 'react';

export default function AnalyzeButton({ onAnalyze, isLoading, hasResume, hasJobDescription }) {
    const canAnalyze = hasResume && hasJobDescription && !isLoading;

    return (
        <div className="flex flex-col items-center gap-3 mt-14">
            <button
                onClick={canAnalyze ? onAnalyze : undefined}
                disabled={!canAnalyze}
                className="btn-primary w-full max-w-[480px] justify-center text-[15px]"
            >
                {isLoading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner" />
                        Analyzing…
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Analyze My Resume
                    </>
                )}
            </button>

            {/* Status pills */}
            <div className="flex items-center gap-2">
                {[
                    { label: 'Job Description', done: hasJobDescription },
                    { label: 'Resume', done: hasResume },
                ].map(({ label, done }) => (
                    <span
                        key={label}
                        className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border transition-colors duration-150
              ${done
                                ? 'bg-[#F0F7F0] border-[#B8D8B8] text-[#6B9E6B]'
                                : 'bg-[#FDFAF6] border-[#E8DDD0] text-[#8C7B6B]'
                            }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${done ? 'bg-[#6B9E6B]' : 'bg-[#C4B8A8]'}`} />
                        {label}
                    </span>
                ))}
            </div>
        </div>
    );
}
