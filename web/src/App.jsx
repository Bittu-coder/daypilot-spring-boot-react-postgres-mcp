import { useEffect, useMemo, useState } from 'react'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:8080'
async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  })
  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try { message = (await response.json()).error || message } catch {}
    throw new Error(message)
  }
  return response.json()
}

export default function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [goal, setGoal] = useState('Prepare for tomorrow’s project meeting')
  const [plan, setPlan] = useState(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [filter, setFilter] = useState('all')

  async function refresh() {
    try { setTasks(await request('/api/tasks')); setMessage('') }
    catch (e) { setMessage(`${e.message}. Is the Spring Boot backend running?`) }
  }
  useEffect(() => { refresh() }, [])

  const visibleTasks = useMemo(() => tasks.filter(t =>
    filter === 'all' || (filter === 'open' && !t.completed) || (filter === 'done' && t.completed)
  ), [tasks, filter])
  const completed = tasks.filter(t => t.completed).length
  const progress = tasks.length ? Math.round(completed / tasks.length * 100) : 0

  async function addTask(e) {
    e.preventDefault()
    if (!title.trim()) return
    setBusy(true)
    try {
      await request('/api/tasks', { method: 'POST', body: JSON.stringify({ title, description, priority }) })
      setTitle(''); setDescription(''); setPriority('MEDIUM')
      await refresh()
    } catch (e) { setMessage(e.message) } finally { setBusy(false) }
  }
  async function completeTask(id) {
    try { await request(`/api/tasks/${id}/complete`, { method: 'POST' }); await refresh() }
    catch (e) { setMessage(e.message) }
  }
  async function createPlan(e) {
    e.preventDefault()
    setBusy(true)
    try { setPlan(await request('/api/plans', { method: 'POST', body: JSON.stringify({ goal }) })) }
    catch (e) { setMessage(e.message) } finally { setBusy(false) }
  }

  return <main className="shell">
    <header className="topbar">
      <a className="brand" href="#"><span className="brand-mark">D</span><span>daypilot<span className="brand-dot">.</span></span></a>
      <div className="top-right"><span className="status-dot" /> Personal workspace <span className="avatar">DP</span></div>
    </header>

    <section className="hero">
      <div className="eyebrow"><span className="spark">✳</span> YOUR PERSONAL OPERATIONS ASSISTANT</div>
      <h1>Your day, <em>in focus.</em></h1>
      <p className="hero-copy">A little more clarity. A little less chaos. Make a plan, take the next step, and keep moving.</p>
      <div className="hero-meta"><span>✦ &nbsp;One step at a time</span><span>↗ &nbsp;Built for real progress</span></div>
    </section>

    {message && <div className="notice" role="alert">{message}<button onClick={() => setMessage('')}>Dismiss</button></div>}

    <section className="stats">
      <div className="stat-card"><span className="stat-label">TOTAL TASKS</span><strong>{tasks.length.toString().padStart(2, '0')}</strong><span className="stat-foot">Things on your plate</span></div>
      <div className="stat-card"><span className="stat-label">COMPLETED</span><strong>{completed.toString().padStart(2, '0')}</strong><span className="stat-foot">Small wins count</span></div>
      <div className="stat-card progress-card"><span className="stat-label">DAILY PROGRESS</span><strong>{progress}<small>%</small></strong><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div>
    </section>

    <section className="content-grid">
      <div className="panel tasks-panel">
        <div className="panel-heading"><div><span className="section-kicker">MAKE IT HAPPEN</span><h2>Your tasks</h2></div><span className="count-pill">{tasks.filter(t => !t.completed).length} open</span></div>
        <form className="task-form" onSubmit={addTask}>
          <label>WHAT NEEDS DOING?</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Review the project demo" maxLength={180} required />
          <div className="form-row"><input value={description} onChange={e => setDescription(e.target.value)} placeholder="Add a note (optional)" maxLength={1000} /><select value={priority} onChange={e => setPriority(e.target.value)}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select></div>
          <button className="primary-button" disabled={busy}>{busy ? 'Working…' : '+ Add task'}</button>
        </form>
        <div className="list-toolbar"><span className="section-kicker">YOUR LIST</span><div className="filters">{[['all','All'],['open','To do'],['done','Done']].map(([v,l]) => <button key={v} className={filter===v?'filter active':'filter'} onClick={() => setFilter(v)}>{l}</button>)}</div></div>
        <div className="task-list">
          {visibleTasks.length === 0 && <div className="empty"><span>✳</span><p>Nothing here just yet.</p><small>Add a task above and start building momentum.</small></div>}
          {visibleTasks.map(task => <article className={`task-item ${task.completed?'is-done':''}`} key={task.id}>
            <button className={`check ${task.completed?'checked':''}`} onClick={() => !task.completed && completeTask(task.id)} aria-label={task.completed?'Completed':'Mark task complete'}>{task.completed?'✓':''}</button>
            <div className="task-copy"><div className="task-title">{task.title}</div>{task.description && <p>{task.description}</p>}<div className="task-meta"><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority.toLowerCase()} priority</span>{task.completed && <span className="done-label">Completed</span>}</div></div>
          </article>)}
        </div>
      </div>

      <aside className="side-column">
        <div className="panel plan-panel">
          <div className="plan-icon">✳</div><span className="section-kicker">FIND YOUR NEXT STEP</span><h2>Make a plan.</h2><p className="muted">Big goal? Let's break it into smaller, doable steps.</p>
          <form onSubmit={createPlan}><label>WHAT ARE YOU WORKING TOWARD?</label><textarea value={goal} onChange={e => setGoal(e.target.value)} rows="3" placeholder="Tell DayPilot what you need to prepare for…" /><button className="primary-button full" disabled={busy}>{busy?'Creating…':'Create my plan ↗'}</button></form>
          {plan && <div className="plan-result"><div className="result-title">YOUR GAME PLAN</div><h3>{plan.goal}</h3><ol>{plan.steps.map((step,i)=><li key={i}><span>{String(i+1).padStart(2,'0')}</span>{step}</li>)}</ol><small>{plan.note}</small></div>}
        </div>
        <div className="quote-card"><span className="quote-mark">“</span><p>You don't have to do everything today. Just the next right thing.</p><span className="quote-caption">A DAYPILOT REMINDER</span><div className="quote-sun">✳</div></div>
      </aside>
    </section>
    <footer><span className="footer-brand">daypilot<span className="brand-dot">.</span></span><span>Made for more meaningful progress.</span><span className="footer-right">REACT · SPRING BOOT · MCP</span></footer>
  </main>
}
