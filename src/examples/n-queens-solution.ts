type Placeholder = 'Q' | '.'

export function NQueen(n = 8) {
  const results: Array<Placeholder[][]> = []
  const rows: number[] = []
  const deg$45: Set<number> = new Set()
  const deg$135: Set<number> = new Set()
  const columns: Set<number> = new Set()
  backtrack()
  return results

  function backtrack(row = 0) {
    if (row == n) {
      results.push(format(rows))
      return
    }
    for (let i = 0; i < n; i++) {
      if (columns.has(i) || deg$45.has(row + i) || deg$135.has(row - i)) {
        continue
      }
      rows[row] = i
      deg$45.add(row + i)
      deg$135.add(row - i)
      columns.add(i)
      backtrack(row + 1)
      rows[row] = -1
      deg$45.delete(row + i)
      deg$135.delete(row - i)
      columns.delete(i)
    }
  }

  function format(rows: number[]) {
    return rows.map(value => {
      let row: Placeholder[] = Array(n).fill('.')
      row[value] = 'Q'
      return row
    })
  }
}
