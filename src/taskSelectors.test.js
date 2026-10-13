import assert from 'node:assert/strict'
import test from 'node:test'
import { getVisibleTasks } from './taskSelectors.js'

const tasks = [
  { id: 'undated', dueDate: '', completed: false },
  { id: 'later', dueDate: '2026-12-01', completed: false },
  { id: 'earlier', dueDate: '2026-01-01', completed: true },
  { id: 'same-date', dueDate: '2026-01-01', completed: false },
  { id: 'also-undated', dueDate: '', completed: true },
]

test('all tasks sort earliest first with undated tasks last and stable ties', () => {
  const original = structuredClone(tasks)
  assert.deepEqual(getVisibleTasks(tasks, 'all').map((task) => task.id), [
    'earlier', 'same-date', 'later', 'undated', 'also-undated',
  ])
  assert.deepEqual(tasks, original)
})

test('active and completed filters retain due-date sorting', () => {
  assert.deepEqual(getVisibleTasks(tasks, 'active').map((task) => task.id), [
    'same-date', 'later', 'undated',
  ])
  assert.deepEqual(getVisibleTasks(tasks, 'completed').map((task) => task.id), [
    'earlier', 'also-undated',
  ])
})

test('empty lists and filters without matches return an empty list', () => {
  assert.deepEqual(getVisibleTasks([], 'all'), [])
  assert.deepEqual(getVisibleTasks([tasks[0]], 'completed'), [])
  assert.deepEqual(getVisibleTasks([tasks[2]], 'active'), [])
})
