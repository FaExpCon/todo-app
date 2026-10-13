import './styles.css'

function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">A little space to focus</p>
        <h1>My tasks</h1>
        <p className="intro">Keep the important things in one place.</p>
      </header>

      <section className="task-panel" aria-labelledby="tasks-heading">
        <h2 id="tasks-heading">Your to-do list</h2>
        <p className="empty-state">Your tasks will appear here.</p>
      </section>
    </main>
  )
}

export default App
