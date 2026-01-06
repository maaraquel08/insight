import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { filterData } from "@/lib/filter-utils";
import type { Filter } from "@/components/ui/filters";

// Helper function to format cell value (same as in ReportTable)
function formatCellValue(value: unknown): string {
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "number") {
        // Format currency values
        if (value > 1000) {
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(value);
        }
        return value.toString();
    }
    if (typeof value === "object") {
        // Handle arrays or objects
        if (Array.isArray(value)) {
            return value.length > 0 ? `${value.length} items` : "-";
        }
        return JSON.stringify(value);
    }
    return String(value);
}

export interface TableData {
    headers: string[];
    rows: string[][];
    footer?: string[]; // Footer row with computed values
}

/**
 * Get table data from employees data, visible columns, filters, and sorts
 */
export function getTableData(
    employees: Record<string, unknown>[],
    visibleColumns: { id: string; label: string }[],
    filters: Filter[],
    sorts: { columnId: string; direction: "asc" | "desc" }[]
): TableData {

    // Filter employees
    const filteredEmployees = filterData(employees, filters);

    // Sort employees
    const sortedEmployees =
        sorts.length === 0
            ? filteredEmployees
            : [...filteredEmployees].sort((a, b) => {
                  for (const sort of sorts) {
                      const aValue = (a as Record<string, unknown>)[
                          sort.columnId
                      ];
                      const bValue = (b as Record<string, unknown>)[
                          sort.columnId
                      ];
                      const comparison = compareValues(
                          aValue,
                          bValue,
                          sort.direction
                      );
                      if (comparison !== 0) {
                          return comparison;
                      }
                  }
                  return 0;
              });

    // Get headers
    const headers = visibleColumns.map((col) => col.label);

    // Get rows
    const rows = sortedEmployees.map((employee) => {
        return visibleColumns.map((col) => {
            const value = (employee as Record<string, unknown>)[col.id];
            return formatCellValue(value);
        });
    });

    return { headers, rows };
}

// Helper function to compare values for sorting
function compareValues(
    a: unknown,
    b: unknown,
    direction: "asc" | "desc"
): number {
    // Handle null/undefined
    if (a === null || a === undefined) {
        return b === null || b === undefined ? 0 : 1;
    }
    if (b === null || b === undefined) {
        return -1;
    }

    // Handle numbers
    if (typeof a === "number" && typeof b === "number") {
        return direction === "asc" ? a - b : b - a;
    }

    // Handle dates (strings that look like dates)
    const dateA = typeof a === "string" ? new Date(a).getTime() : null;
    const dateB = typeof b === "string" ? new Date(b).getTime() : null;
    if (dateA !== null && !isNaN(dateA) && dateB !== null && !isNaN(dateB)) {
        return direction === "asc" ? dateA - dateB : dateB - dateA;
    }

    // Handle strings
    const strA = String(a).toLowerCase();
    const strB = String(b).toLowerCase();
    if (strA < strB) return direction === "asc" ? -1 : 1;
    if (strA > strB) return direction === "asc" ? 1 : -1;
    return 0;
}

/**
 * Download table data as CSV
 */
export function downloadAsCSV(data: TableData, filename = "report") {
    const { headers, rows, footer } = data;

    // Create CSV content
    const csvRows = [
        headers.join(","),
        ...rows.map((row) =>
            row
                .map((cell) => {
                    // Escape commas and quotes in cell values
                    const escaped = String(cell).replace(/"/g, '""');
                    return `"${escaped}"`;
                })
                .join(",")
        ),
    ];
    
    // Add footer row if it exists and has values
    if (footer && footer.some((cell) => cell !== "")) {
        csvRows.push(
            footer
                .map((cell) => {
                    const escaped = String(cell).replace(/"/g, '""');
                    return `"${escaped}"`;
                })
                .join(",")
        );
    }
    
    const csvContent = csvRows.join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Download table data as XLSX
 */
export function downloadAsXLSX(data: TableData, filename = "report") {
    const { headers, rows, footer } = data;

    // Create workbook and worksheet
    const worksheetData = [headers, ...rows];
    
    // Add footer row if it exists and has values
    if (footer && footer.some((cell) => cell !== "")) {
        worksheetData.push(footer);
    }
    
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    const colWidths = headers.map(() => ({ wch: 20 }));
    ws["!cols"] = colWidths;

    // Style footer row if it exists
    if (footer && footer.some((cell) => cell !== "")) {
        const footerRowIndex = rows.length + 1; // +1 for header row
        headers.forEach((_, colIndex) => {
            const cellAddress = XLSX.utils.encode_cell({
                r: footerRowIndex,
                c: colIndex,
            });
            if (!ws[cellAddress]) return;
            ws[cellAddress].s = {
                font: { bold: true },
                fill: { fgColor: { rgb: "F1F2F3" } },
            };
        });
    }

    // Create workbook and add worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");

    // Download
    XLSX.writeFile(wb, `${filename}.xlsx`);
}

/**
 * Download table data as PDF
 */
export function downloadAsPDF(data: TableData, filename = "report") {
    const { headers, rows, footer } = data;

    // Create PDF document
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
    });

    // Prepare body rows
    const bodyRows = [...rows];
    
    // Add footer row if it exists and has values
    if (footer && footer.some((cell) => cell !== "")) {
        bodyRows.push(footer);
    }

    // Add table using autoTable
    autoTable(doc, {
        head: [headers],
        body: bodyRows,
        styles: {
            fontSize: 8,
            cellPadding: 2,
        },
        headStyles: {
            fillColor: [241, 242, 243], // #f1f2f3
            textColor: [38, 43, 43], // #262b2b
            fontStyle: "bold",
        },
        alternateRowStyles: {
            fillColor: [255, 255, 255],
        },
        didParseCell: (data) => {
            // Style footer row
            if (footer && footer.some((cell) => cell !== "") && data.row.index === rows.length) {
                data.cell.styles.fontStyle = "bold";
                data.cell.styles.fillColor = [241, 242, 243]; // #f1f2f3
            }
        },
        margin: { top: 10, right: 10, bottom: 10, left: 10 },
        startY: 10,
    });

    // Download
    doc.save(`${filename}.pdf`);
}

