import * as XLSX from "xlsx"
import type { CRMRecord } from "./types"

export function exportToExcel(data: CRMRecord[], filename: string) {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
    XLSX.writeFile(workbook, `${filename}.xlsx`)
}
