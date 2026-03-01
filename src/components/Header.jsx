// Header.jsx — Warm Sand theme
import React from 'react';

export default function Header() {
    return (
        <header className="bg-white border-b-2 border-[#D4C4AF] sticky top-0 z-40">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2.5">
                        <span className="text-2xl leading-none select-none">🦥</span>
                        <span className="text-[22px] font-extrabold text-[#2C2416] tracking-tight">ResuSloth</span>
                    </div>
                    <span className="text-[12px] text-[#8C7B6B] leading-none mt-1 ml-9">
                        Your lazy but brilliant resume analyst.
                    </span>
                </div>
                <span className="text-[12px] text-[#8C7B6B] font-medium hidden sm:block">
                    Free to use · No sign-up needed
                </span>
            </div>
        </header>
    );
}
