import assert from 'node:assert/strict'
import test from 'node:test'
import { formatDueDate } from './dueDates.js'

test('relative labels use local calendar days near midnight', () => {
  const now = new Date(2026, 9, 14, 23, 55)
  assert.deepEqual(formatDueDate('2026-10-14', now), { label: '오늘', overdue: false })
  assert.deepEqual(formatDueDate('2026-10-15', now), { label: '내일', overdue: false })
  assert.deepEqual(formatDueDate('2026-10-21', now), { label: '7일 남음', overdue: false })
  assert.deepEqual(formatDueDate('2026-10-22', now), { label: '10월 22일', overdue: false })
})

test('only incomplete past tasks are overdue', () => {
  const now = new Date(2026, 9, 14)
  assert.deepEqual(formatDueDate('2026-10-12', now), { label: '2일 지남', overdue: true })
  assert.deepEqual(formatDueDate('2026-10-12', now, true), { label: '10월 12일', overdue: false })
})

test('invalid stored dates do not show as overdue', () => {
  assert.deepEqual(formatDueDate('2026-02-30'), { label: '2026-02-30', overdue: false })
})
