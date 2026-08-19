'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function PaginationControl({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationControlProps) {
    if (totalPages <= 1) return null;

    const handlePageChange = (page: number) => {
        onPageChange(page);
        // Smooth scroll to top of grid
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Generate page numbers with ellipsis
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center gap-2">
                {/* Previous Button */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700 rounded-lg text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`ellipsis-${index}`} className="px-3 text-slate-500">
                                ...
                            </span>
                        );
                    }

                    const pageNum = page as number;
                    return (
                        <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === pageNum
                                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                                    : 'bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700 text-slate-400 hover:text-white'
                                }`}
                        >
                            {pageNum}
                        </button>
                    );
                })}

                {/* Next Button */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700 rounded-lg text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    aria-label="Next page"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Page Info */}
            <div className="text-center mt-4 text-sm text-slate-500">
                Page {currentPage} of {totalPages}
            </div>
        </div>
    );
}
