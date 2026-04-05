"use client";
import { PaginationMeta } from "../../types";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export default function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, totalPages, hasPrevPage, hasNextPage, total, limit } = meta;

  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  // Generate page number buttons
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 gap-3">
      <p className="text-muted small mb-0">
        Showing{" "}
        <strong>
          {start}–{end}
        </strong>{" "}
        of <strong>{total}</strong> tasks
      </p>

      <nav>
        <ul className="pagination pagination-sm mb-0 gap-1">
          <li className={`page-item ${!hasPrevPage ? "disabled" : ""}`}>
            <button
              className="page-link rounded"
              onClick={() => onPageChange(page - 1)}
            >
              ‹
            </button>
          </li>

          {pages.map((p, i) =>
            p === "..." ? (
              <li key={`ellipsis-${i}`} className="page-item disabled">
                <span className="page-link">…</span>
              </li>
            ) : (
              <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                <button
                  className="page-link rounded"
                  onClick={() => onPageChange(p as number)}
                  style={
                    p === page
                      ? { background: "#0f3460", borderColor: "#0f3460" }
                      : {}
                  }
                >
                  {p}
                </button>
              </li>
            ),
          )}

          <li className={`page-item ${!hasNextPage ? "disabled" : ""}`}>
            <button
              className="page-link rounded"
              onClick={() => onPageChange(page + 1)}
            >
              ›
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
