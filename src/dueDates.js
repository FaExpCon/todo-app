const DAY_MS = 24 * 60 * 60 * 1000

function dayNumber(year, month, day) {
  return Date.UTC(year, month - 1, day) / DAY_MS
}

export function formatDueDate(value, now = new Date(), completed = false) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return { label: value, overdue: false }

  const [, year, month, day] = match.map(Number)
  const due = new Date(Date.UTC(year, month - 1, day))
  if (due.getUTCFullYear() !== year || due.getUTCMonth() + 1 !== month || due.getUTCDate() !== day) {
    return { label: value, overdue: false }
  }

  const days = dayNumber(year, month, day) - dayNumber(
    now.getFullYear(), now.getMonth() + 1, now.getDate(),
  )

  if (days < 0 && !completed) return { label: `${-days}일 지남`, overdue: true }
  if (days === 0) return { label: '오늘', overdue: false }
  if (days === 1) return { label: '내일', overdue: false }
  if (days > 1 && days <= 7) return { label: `${days}일 남음`, overdue: false }
  return { label: `${month}월 ${day}일`, overdue: false }
}
