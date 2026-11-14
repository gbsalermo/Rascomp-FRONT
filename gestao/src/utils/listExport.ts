export type ListColumn = { label: string; value: (row: any) => unknown }

function cell(value: unknown): string {
  return value == null ? '' : Array.isArray(value) ? value.join(', ') : String(value)
}
function safeName(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-|-$/g, '').toLowerCase()
}
function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}
export function exportListExcel(title: string, columns: ListColumn[], rows: unknown[]): void {
  // CSV UTF-8 com BOM, delimitador de Excel pt-BR e proteção contra fórmulas.
  const quote = (value: unknown) => {
    let text = cell(value)
    if (/^[\s]*[=+@-]/.test(text)) text = "'" + text
    return '"' + text.replace(/"/g, '""') + '"'
  }
  const lines = [columns.map(c => quote(c.label)).join(';'), ...rows.map(row => columns.map(c => quote(c.value(row))).join(';'))]
  const blob = new Blob(['\uFEFF', lines.join('\r\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = safeName(title) + '.csv'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
export function exportListPdf(title: string, competition: string, columns: ListColumn[], rows: unknown[]): boolean {
  const popup = window.open('', '_blank')
  if (!popup) return false
  const th = columns.map(c => '<th>' + escapeHtml(c.label) + '</th>').join('')
  const body = rows.map(row => '<tr>' + columns.map(c => '<td>' + escapeHtml(cell(c.value(row))) + '</td>').join('') + '</tr>').join('')
  const html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>' + escapeHtml(title) + '</title>' +
    '<style>@page{size:A4 landscape;margin:12mm}body{font:11px Arial,sans-serif;color:#222}h1{font-size:18px;margin:0 0 5px}p{color:#555;margin:0 0 16px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:6px;text-align:left;overflow-wrap:anywhere}th{background:#eee}thead{display:table-header-group}tr{break-inside:avoid}</style></head><body>' +
    '<h1>' + escapeHtml(title) + '</h1><p>' + escapeHtml(competition) + ' · ' + rows.length + ' registro(s) · ' + new Date().toLocaleString('pt-BR') +
    '</p><table><thead><tr>' + th + '</tr></thead><tbody>' + body + '</tbody></table></body></html>'
  popup.document.open()
  popup.document.write(html)
  popup.document.close()
  popup.focus()
  popup.print()
  return true
}
