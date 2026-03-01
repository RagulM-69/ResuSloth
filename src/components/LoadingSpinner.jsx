// LoadingSpinner.jsx — Warm Sand theme
import React, { useState, useEffect } from 'react';

const MESSAGES = [
    'Reading your resume…',
    'Matching skills to the role…',
    'Calculating your ATS score…',
    'Generating improvement tips…',
    'Almost there…',
];

export default function LoadingSpinner() {
    const [msgIdx, setMsgIdx] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setMsgIdx(i => (i + 1) % MESSAGES.length), 2200);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C2416]/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl px-10 py-9 flex flex-col items-center gap-5 max-w-xs w-full mx-4">
                <div className="relative w-14 h-14">
                    <div className="absolute inset-0 rounded-full border-[3px] border-[#E8DDD0]" />
                    <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#C17B3F] spinner" />
                </div>
                <div className="text-center">
                    <p className="text-[14px] font-semibold text-[#2C2416]">Analyzing your resume</p>
                    <p className="text-[12px] text-[#8C7B6B] mt-1 fade-in" key={msgIdx}>{MESSAGES[msgIdx]}</p>
                </div>
                <p className="text-[11px] text-[#C4B8A8] flex items-center gap-1">
                    <span>🦥</span> ResuSloth is thinking…
                </p>
            </div>
        </div>
    );
}
