import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  isPending?: boolean;
  onPageChange: (pageNumber: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
};

export function Pagination({
  pageNumber,
  pageSize,
  totalCount,
  totalPages,
  isPending = false,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  if (totalCount === 0) {
    return null;
  }

  const start = (pageNumber - 1) * pageSize + 1;
  const end = Math.min(pageNumber * pageSize, totalCount);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let page = 1; page <= totalPages; page++) {
        pages.push(page);
      }

      return pages;
    }

    pages.push(1);

    if (pageNumber > 3) {
      pages.push("...");
    }

    const startPage = Math.max(2, pageNumber - 1);
    const endPage = Math.min(totalPages - 1, pageNumber + 1);

    for (let page = startPage; page <= endPage; page++) {
      pages.push(page);
    }

    if (pageNumber < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex flex-col gap-4 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Results information */}{" "}
      <div className="flex items-center gap-4">
        {" "}
        <p className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-700">{start}</span>
          {" - "} <span className="font-medium text-slate-700">{end}</span>
          {" of "}{" "}
          <span className="font-medium text-slate-700">{totalCount}</span>{" "}
        </p>
        {/* Page size */}
        {onPageSizeChange && (
          <select
            value={pageSize}
            disabled={isPending}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="
          rounded-lg border border-slate-300
          bg-white px-2.5 py-2
          text-sm text-slate-700
          outline-none
          focus:border-rose-500
          focus:ring-2 focus:ring-rose-500/20
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>
        )}
      </div>
      {/* Page navigation */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          type="button"
          disabled={pageNumber <= 1 || isPending}
          onClick={() => onPageChange(pageNumber - 1)}
          className="
        inline-flex h-9 items-center justify-center
        rounded-lg border border-slate-300
        px-2.5
        text-sm font-medium text-slate-700
        transition-colors
        hover:bg-slate-50
        disabled:cursor-not-allowed
        disabled:opacity-40
      "
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-9 w-9 items-center justify-center text-sm text-slate-400"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              disabled={isPending}
              onClick={() => onPageChange(page)}
              className={`
            h-9 min-w-9 rounded-lg px-2
            text-sm font-medium
            transition-colors
            disabled:cursor-not-allowed
            ${
              page === pageNumber
                ? "bg-rose-950 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }
          `}
            >
              {page}
            </button>
          ),
        )}

        {/* Next */}
        <button
          type="button"
          disabled={pageNumber >= totalPages || isPending}
          onClick={() => onPageChange(pageNumber + 1)}
          className="
        inline-flex h-9 items-center justify-center
        rounded-lg border border-slate-300
        px-2.5
        text-sm font-medium text-slate-700
        transition-colors
        hover:bg-slate-50
        disabled:cursor-not-allowed
        disabled:opacity-40
      "
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
