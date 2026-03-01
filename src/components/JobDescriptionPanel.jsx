// JobDescriptionPanel.jsx — Warm Sand theme — supports typed text + PDF/TXT upload
import React, { useRef } from 'react';

async function extractJDText(file) {
    // Plain text file
    if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
        return await file.text();
    }
    // PDF
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
            'pdfjs-dist/build/pdf.worker.min.mjs',
            import.meta.url
        ).href;
        const buffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(' ') + '\n';
        }
        return text;
    }
    throw new Error('Unsupported format. Please upload a PDF or TXT file.');
}

export default function JobDescriptionPanel({ value, onChange }) {
    const maxLen = 5000;
    const minLen = 200;
    const len = value.length;
    const isReady = value.trim().length >= minLen;
    const fileRef = useRef(null);
    const [uploading, setUploading] = React.useState(false);
    const [uploadError, setUploadError] = React.useState('');

    const handleChange = (e) => {
        if (e.target.value.length <= maxLen) onChange(e.target.value);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setUploadError('');
        try {
            const text = await extractJDText(file);
            onChange(text.slice(0, maxLen));
        } catch (err) {
            setUploadError(err.message);
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    return (
        <div className="card flex flex-col p-6 sm:p-8 min-h-[400px]">
            {/* Header row */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-[11px] font-semibold tracking-widest uppercase text-[#8C7B6B]">Step 1</p>
                    <h2 className="text-[14px] font-semibold text-[#2C2416] mt-0.5">Job Description</h2>
                </div>
                <div className="flex items-center gap-2">
                    {/* Upload PDF/TXT button */}
                    <button
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading}
                        className="text-[11px] font-semibold text-[#C17B3F] border border-[#E8C9A0] bg-[#FDF5EC] px-2.5 py-1 rounded-md hover:bg-[#F5E6CC] transition-colors duration-150 flex items-center gap-1.5 disabled:opacity-50"
                    >
                        {uploading ? (
                            <div className="w-3 h-3 border border-[#C17B3F]/30 border-t-[#C17B3F] rounded-full spinner" />
                        ) : (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                        )}
                        Upload PDF / TXT
                    </button>
                    <input ref={fileRef} type="file" accept=".pdf,.txt,text/plain" className="hidden" onChange={handleFileUpload} />

                    {/* Clear button */}
                    {value.length > 0 && (
                        <button
                            onClick={() => { onChange(''); setUploadError(''); }}
                            className="text-[11px] font-medium text-[#8C7B6B] hover:text-[#C0392B] transition-colors duration-150 px-2 py-1 rounded border border-[#E8DDD0] hover:border-[#F5B7B1] hover:bg-[#FDF0EE]"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            <p className="text-[12px] text-[#8C7B6B] mb-4">
                Type or paste below — or upload a <span className="font-medium text-[#C17B3F]">PDF / TXT</span> file.
            </p>

            {uploadError && (
                <div className="mb-3 text-[11px] text-[#C0392B] bg-[#FDF0EE] border border-[#F5B7B1] rounded-lg px-3 py-2">
                    {uploadError}
                </div>
            )}

            <textarea
                value={value}
                onChange={handleChange}
                placeholder={`Paste or type the job description here...\n\nExample:\n• 3+ years of React experience\n• Strong knowledge of TypeScript\n• Experience with REST APIs...`}
                className="flex-1 w-full min-h-[240px] text-[13px] text-[#2C2416] bg-[#FDFAF6] border border-[#E8DDD0] rounded-lg p-3.5 placeholder:text-[#C4B8A8] leading-relaxed"
            />

            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isReady ? 'bg-[#6B9E6B]' : 'bg-[#C4B8A8]'}`} />
                    <span className={`text-[11px] font-medium ${isReady ? 'text-[#6B9E6B]' : 'text-[#8C7B6B]'}`}>
                        {isReady ? 'Ready' : `${minLen} chars minimum`}
                    </span>
                </div>
                <span className="text-[11px] text-[#C4B8A8]">
                    {len.toLocaleString()} / {maxLen.toLocaleString()}
                </span>
            </div>
        </div>
    );
}
