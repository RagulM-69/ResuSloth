// ResumeUploadPanel.jsx — Warm Sand theme
import React, { useState, useRef, useCallback } from 'react';

const MAX_MB = 10;
const IMAGE_TYPES = /\.(jpe?g|png|webp|bmp|tiff?)$/i;
const isImage = (file) =>
    file.type.startsWith('image/') || IMAGE_TYPES.test(file.name);

async function extractText(file) {
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
            text += content.items.map((item) => item.str).join(' ') + '\n';
        }
        return text;
    }
    // DOCX
    if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name.toLowerCase().endsWith('.docx')
    ) {
        const mammoth = await import('mammoth');
        const buffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: buffer });
        return result.value;
    }
    // Image — OCR via tesseract.js
    if (isImage(file)) {
        const { createWorker } = await import('tesseract.js');
        const worker = await createWorker('eng');
        const { data: { text } } = await worker.recognize(file);
        await worker.terminate();
        return text;
    }
    throw new Error('Unsupported file type. Please upload a PDF, DOCX, or image.');
}

function wordCount(text) {
    return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function ResumeUploadPanel({ onTextExtracted, extractedText, fileName, onFileRemove }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    const processFile = useCallback(async (file) => {
        setError('');
        if (!file) return;
        if (file.size > MAX_MB * 1024 * 1024) {
            setError(`File too large. Maximum size is ${MAX_MB}MB.`);
            return;
        }
        setIsExtracting(true);
        try {
            const text = await extractText(file);
            if (!text.trim()) throw new Error('No readable text found. Try a different file.');
            onTextExtracted(text, file.name);
        } catch (err) {
            setError(err.message || 'Failed to read file.');
        } finally {
            setIsExtracting(false);
        }
    }, [onTextExtracted]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    }, [processFile]);

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);
    const handleInputChange = (e) => { const f = e.target.files?.[0]; if (f) processFile(f); };

    const hasFile = !!extractedText;
    const words = hasFile ? wordCount(extractedText) : 0;
    const previewText = hasFile ? extractedText.slice(0, 350) : '';

    return (
        <div className="card flex flex-col p-6 sm:p-8 min-h-[400px]">
            <div className="mb-4">
                <p className="text-[11px] font-semibold tracking-widest uppercase text-[#8C7B6B]">Step 2</p>
                <h2 className="text-[14px] font-semibold text-[#2C2416] mt-0.5">Your Resume</h2>
            </div>
            <p className="text-[12px] text-[#8C7B6B] mb-5">
                PDF or DOCX — text is extracted locally in your browser.
            </p>

            {!hasFile ? (
                <div
                    className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-colors duration-150 cursor-pointer px-6 py-10
            ${isDragging ? 'drag-over' : 'border-[#E8DDD0] hover:border-[#C17B3F] hover:bg-[#FDF5EC]'}
            ${isExtracting ? 'pointer-events-none opacity-60' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => inputRef.current?.click()}
                >
                    {isExtracting ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-[#E8DDD0] border-t-[#C17B3F] rounded-full spinner" />
                            <p className="text-[13px] text-[#8C7B6B]">Extracting text… (images may take a moment)</p>
                        </div>
                    ) : (
                        <>
                            <div className="w-12 h-12 rounded-xl bg-[#F5EDE3] flex items-center justify-center mb-4">
                                <svg className="w-5 h-5 text-[#8C7B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                            </div>
                            <p className="text-[13px] font-medium text-[#2C2416] mb-1">Drop your resume here</p>
                            <p className="text-[12px] text-[#8C7B6B] mb-4">or click to browse files</p>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                                className="text-[12px] font-semibold text-[#C17B3F] border border-[#E8C9A0] bg-[#FDF5EC] px-4 py-1.5 rounded-md hover:bg-[#F5E6CC] transition-colors duration-150"
                            >
                                Browse Files
                            </button>
                            <div className="flex items-center gap-2 mt-4">
                                {['PDF', 'DOCX', 'JPG', 'PNG'].map(t => (
                                    <span key={t} className="text-[10px] font-semibold text-[#8C7B6B] border border-[#E8DDD0] px-2 py-0.5 rounded bg-[#FDFAF6]">{t}</span>
                                ))}
                                <span className="text-[10px] text-[#C4B8A8]">≤ {MAX_MB} MB</span>
                            </div>
                        </>
                    )}
                    <input ref={inputRef} type="file" accept=".pdf,.docx,.jpg,.jpeg,.png,.webp,.bmp" className="hidden" onChange={handleInputChange} />
                </div>
            ) : (
                <div className="flex-1 flex flex-col gap-3">
                    {/* Success card */}
                    <div className="flex items-start gap-3 p-3.5 bg-[#F0F7F0] border border-[#B8D8B8] rounded-xl">
                        <div className="w-7 h-7 rounded-full bg-[#6B9E6B] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-[#2C2416] truncate">{fileName}</p>
                            <p className="text-[11px] text-[#6B9E6B] mt-0.5">{words.toLocaleString()} words extracted</p>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="flex-1 bg-[#FDFAF6] border border-[#E8DDD0] rounded-xl p-3.5 overflow-hidden">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8C7B6B] mb-2">Extracted Preview</p>
                        <p className="text-[11.5px] text-[#5C4E3E] leading-relaxed line-clamp-6">
                            {previewText}{extractedText.length > 350 ? '…' : ''}
                        </p>
                    </div>

                    {/* Replace link */}
                    <div className="flex items-center justify-between mt-auto">
                        <span className="flex items-center gap-1 text-[11px] text-[#8C7B6B]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6B9E6B]" />
                            Ready
                        </span>
                        <button
                            onClick={() => { onFileRemove(); if (inputRef.current) inputRef.current.value = ''; }}
                            className="text-[11px] font-medium text-[#8C7B6B] hover:text-[#C17B3F] transition-colors duration-150 flex items-center gap-1"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Replace file
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-3 flex items-center gap-2 p-3 bg-[#FDF0EE] border border-[#F5B7B1] rounded-lg text-[12px] text-[#C0392B]">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {error}
                </div>
            )}
        </div>
    );
}
