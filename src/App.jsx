import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import TaskForm from './components/TaskForm.jsx'
import TaskList from './components/TaskList.jsx'
import TaskFilters from './components/TaskFilters.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import UndoToast from './components/UndoToast.jsx'
import { getVisibleTasks } from './taskSelectors.js'
import './styles.css'

const STORAGE_KEY = 'my-tasks'
const THEME_KEY = 'my-tasks-theme'

function loadTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // Fall back to the system preference when storage is unavailable.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!Array.isArray(saved)) return []

    return saved.filter(
      (task) =>
        task &&
        typeof task.id === 'string' &&
        typeof task.title === 'string' &&
        typeof task.dueDate === 'string' &&
        typeof task.completed === 'boolean',
    )
  } catch {
    return []
  }
}

function App() {
  const [tasks, setTasks] = useState(loadTasks)
  const [filter, setFilter] = useState('all')
  const [theme, setTheme] = useState(loadTheme)
  const [today, setToday] = useState(() => new Date())
  const [deleted, setDeleted] = useState(null)
  const undoButtonRef = useRef(null)
  const restoreTaskRef = useRef(null)
  const visibleTasks = getVisibleTasks(tasks, filter)
  const activeCount = tasks.filter((task) => !task.completed).length

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      // The app can still be used if browser storage is unavailable.
    }
  }, [tasks])

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content', theme === 'dark' ? '#171b19' : '#f5f7f4',
    )
  }, [theme])

  useEffect(() => {
    let timeout
    function scheduleNextDay() {
      const now = new Date()
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      timeout = window.setTimeout(() => {
        setToday(new Date())
        scheduleNextDay()
      }, midnight - now)
    }
    scheduleNextDay()
    function refreshOnReturn() {
      if (document.visibilityState === 'visible') {
        window.clearTimeout(timeout)
        setToday(new Date())
        scheduleNextDay()
      }
    }
    document.addEventListener('visibilitychange', refreshOnReturn)
    return () => {
      window.clearTimeout(timeout)
      document.removeEventListener('visibilitychange', refreshOnReturn)
    }
  }, [])

  useEffect(() => {
    if (!deleted) return
    undoButtonRef.current?.focus()
    const timeout = window.setTimeout(() => {
      if (document.activeElement === undoButtonRef.current) {
        document.getElementById('task-title')?.focus()
      }
      setDeleted(null)
    }, 5000)
    return () => window.clearTimeout(timeout)
  }, [deleted])

  useEffect(() => {
    if (!restoreTaskRef.current) return
    const checkbox = document.getElementById(`complete-${restoreTaskRef.current}`)
    if (checkbox) checkbox.focus()
    else document.getElementById('task-title')?.focus()
    restoreTaskRef.current = null
  }, [tasks])

  function toggleTheme() {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    try {
      localStorage.setItem(THEME_KEY, nextTheme)
    } catch {
      // The toggle remains usable even if browser storage is unavailable.
    }
  }

  function addTask(title, dueDate) {
    setTasks((current) => [
      ...current,
      { id: crypto.randomUUID(), title, dueDate, completed: false },
    ])
  }

  function toggleTask(id) {
    setTasks((current) => current.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    ))
  }

  function editTask(id, title, dueDate) {
    setTasks((current) => current.map((task) =>
      task.id === id ? { ...task, title, dueDate } : task,
    ))
  }

  function deleteTask(id) {
    const index = tasks.findIndex((task) => task.id === id)
    if (index < 0) return
    setDeleted({ task: tasks[index], index })
    setTasks((current) => current.filter((task) => task.id !== id))
  }

  function undoDelete() {
    if (!deleted) return
    const { task, index } = deleted
    restoreTaskRef.current = task.id
    setTasks((current) => {
      if (current.some((item) => item.id === task.id)) return current
      const restored = [...current]
      restored.splice(index, 0, task)
      return restored
    })
    setDeleted(null)
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="header-top">
          <p className="eyebrow">오늘도 한 걸음씩</p>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
        <h1>내 할 일</h1>
        <p className="intro">할 일을 가볍게 정리해 보세요.</p>
      </header>

      <section className="task-panel" aria-labelledby="tasks-heading">
        <h2 id="tasks-heading">할 일 목록</h2>
        <TaskForm onAddTask={addTask} />
        <TaskFilters
          filter={filter}
          onFilterChange={setFilter}
          activeCount={activeCount}
        />
        <TaskList
          tasks={visibleTasks}
          filter={filter}
          hasTasks={tasks.length > 0}
          today={today}
          onToggleTask={toggleTask}
          onEditTask={editTask}
          onDeleteTask={deleteTask}
        />
      </section>
      <UndoToast deleted={deleted} onUndo={undoDelete} buttonRef={undoButtonRef} />
    </main>
  )
}

export default App
