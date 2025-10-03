import React, { useMemo, useState } from 'react'
import { Search, Plus, Edit2, Trash2, Home, ChevronLeft, ChevronRight } from 'lucide-react'
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'

// Small helpers
const uid = (() => {
  let id = 1000
  return () => ++id
})()

const sampleStudents = [
  { id: 1, name: 'Ana López', email: 'ana.lopez@example.com', career: 'Ingeniería', gpa: 4.5 },
  { id: 2, name: 'Juan Pérez', email: 'juan.perez@example.com', career: 'Medicina', gpa: 3.9 },
  { id: 3, name: 'María García', email: 'maria.garcia@example.com', career: 'Arquitectura', gpa: 4.2 },
  { id: 4, name: 'Carlos Rodríguez', email: 'carlos.rodriguez@example.com', career: 'Derecho', gpa: 3.4 },
  { id: 5, name: 'Luisa Martínez', email: 'luisa.martinez@example.com', career: 'Economía', gpa: 4.0 },
  { id: 6, name: 'Pedro Gómez', email: 'pedro.gomez@example.com', career: 'Psicología', gpa: 3.2 },
  { id: 7, name: 'Sofía Torres', email: 'sofia.torres@example.com', career: 'Biología', gpa: 4.7 },
  { id: 8, name: 'Diego Ramírez', email: 'diego.ramirez@example.com', career: 'Ingeniería', gpa: 2.9 },
]

export default function StudentPanel() {
  const [students, setStudents] = useState(sampleStudents)
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState({ key: 'name', dir: 'asc' })
  const [page, setPage] = useState(1)
  const [pageSize] = useState(5)
  const [editing, setEditing] = useState(null) // student object or null
  const [showModal, setShowModal] = useState(false)
  const [filterCareer, setFilterCareer] = useState('')

  const careers = useMemo(() => [...new Set(students.map(s => s.career))], [students])

  function openAdd() {
    setEditing({ name: '', email: '', career: '', gpa: 0.0 })
    setShowModal(true)
  }

  function openEdit(s) {
    setEditing({ ...s })
    setShowModal(true)
  }

  function saveStudent(student) {
    if (student.id) {
      setStudents(prev => prev.map(p => (p.id === student.id ? student : p)))
    } else {
      student.id = uid()
      setStudents(prev => [student, ...prev])
    }
    setShowModal(false)
    setEditing(null)
  }

  function deleteStudent(id) {
    if (!confirm('¿Eliminar estudiante? Esta acción no se puede deshacer.')) return
    setStudents(prev => prev.filter(s => s.id !== id))
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return students.filter(s => {
      if (filterCareer && s.career !== filterCareer) return false
      if (!q) return true
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.career.toLowerCase().includes(q)
      )
    })
  }, [students, query, filterCareer])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    arr.sort((a, b) => {
      const { key, dir } = sortBy
      let va = a[key]
      let vb = b[key]
      if (typeof va === 'string') va = va.toLowerCase()
      if (typeof vb === 'string') vb = vb.toLowerCase()
      if (va < vb) return dir === 'asc' ? -1 : 1
      if (va > vb) return dir === 'asc' ? 1 : -1
      return 0
    })
    return arr
  }, [filtered, sortBy])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const current = useMemo(() => {
    const start = (page - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [sorted, page, pageSize])

  function toggleSort(key) {
    setSortBy(prev => {
      if (prev.key === key) {
        return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      }
      return { key, dir: 'asc' }
    })
  }

  const gradeBuckets = useMemo(() => {
    const buckets = { '>=4.5': 0, '4.0-4.49': 0, '3.0-3.99': 0, '<3.0': 0 }
    for (const s of students) {
      if (s.gpa >= 4.5) buckets['>=4.5']++
      else if (s.gpa >= 4.0) buckets['4.0-4.49']++
      else if (s.gpa >= 3.0) buckets['3.0-3.99']++
      else buckets['<3.0']++
    }
    return Object.entries(buckets).map(([name, value]) => ({ name, value }))
  }, [students])

  const COLORS = ['#4f46e5', '#06b6d4', '#f59e0b', '#ef4444']

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Panel de Estudiantes</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-lg shadow-sm hover:bg-indigo-700"
            >
              <Plus size={16} /> Añadir
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <input
                  value={query}
                  onChange={e => { setQuery(e.target.value); setPage(1) }}
                  placeholder="Buscar por nombre, email o carrera..."
                  className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <div className="absolute right-3 top-2.5 text-gray-400"><Search size={16} /></div>
              </div>

              <select
                value={filterCareer}
                onChange={e => { setFilterCareer(e.target.value); setPage(1) }}
                className="border rounded-lg px-3 py-2"
              >
                <option value="">Todas las carreras</option>
                {careers.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={sortBy.key}
                onChange={e => toggleSort(e.target.value)}
                className="border rounded-lg px-3 py-2"
              >
                <option value="name">Orden: Nombre</option>
                <option value="gpa">Orden: GPA</option>
                <option value="career">Orden: Carrera</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="text-left text-sm text-gray-600">
                    <th className="py-3">Nombre</th>
                    <th className="py-3">Email</th>
                    <th className="py-3">Carrera</th>
                    <th className="py-3">GPA</th>
                    <th className="py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {current.length === 0 ? (
                    <tr><td colSpan={5} className="py-8 text-center text-gray-500">No hay estudiantes.</td></tr>
                  ) : (
                    current.map(s => (
                      <tr key={s.id} className="border-t">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                              {getInitials(s.name)}
                            </div>
                            <div>
                              <div className="font-medium">{s.name}</div>
                              <div className="text-xs text-gray-500">ID: {s.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-sm text-gray-600">{s.email}</td>
                        <td className="py-3 text-sm text-gray-600">{s.career}</td>
                        <td className="py-3 text-sm font-semibold">{s.gpa.toFixed(2)}</td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <button onClick={() => openEdit(s)} className="inline-flex items-center gap-2 px-2 py-1 rounded-md border hover:bg-gray-50">
                              <Edit2 size={14} /> Editar
                            </button>
                            <button onClick={() => deleteStudent(s.id)} className="inline-flex items-center gap-2 px-2 py-1 rounded-md border hover:bg-red-50">
                              <Trash2 size={14} /> Borrar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">Mostrando {sorted.length} resultado(s)</div>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} className="p-2 rounded-md border disabled:opacity-50" disabled={page === 1}><ChevronLeft size={16} /></button>
                <div className="px-3">Página {page} / {totalPages}</div>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="p-2 rounded-md border disabled:opacity-50" disabled={page === totalPages}><ChevronRight size={16} /></button>
              </div>
            </div>
          </section>

          <aside className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold mb-3">Distribución de calificaciones</h2>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie dataKey="value" data={gradeBuckets} outerRadius={70} label>
                    {gradeBuckets.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4">
              <h3 className="font-medium">Acciones rápidas</h3>
              <div className="mt-2 flex flex-col gap-2">
                <button onClick={() => { navigator.clipboard?.writeText(JSON.stringify(students)); alert('JSON copiado al portapapeles') }} className="px-3 py-2 rounded-lg border">Copiar JSON</button>
                <button onClick={() => exportCSV(students)} className="px-3 py-2 rounded-lg border">Exportar CSV</button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Modal */}
      {showModal && editing && (
        <Modal onClose={() => { setShowModal(false); setEditing(null) }}>
          <StudentForm student={editing} onCancel={() => { setShowModal(false); setEditing(null) }} onSave={saveStudent} />
        </Modal>
      )}
    </div>
  )
}

function getInitials(name) {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
}

function exportCSV(arr) {
  const header = ['id', 'name', 'email', 'career', 'gpa']
  const rows = arr.map(s => [s.id, s.name, s.email, s.career, s.gpa])
  const csv = [header, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'students.csv'
  a.click()
  URL.revokeObjectURL(url)
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 z-10">
        {children}
      </div>
    </div>
  )
}

function StudentForm({ student: initial, onCancel, onSave }) {
  const [form, setForm] = useState({ ...initial })

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: name === 'gpa' ? parseFloat(value) : value }))
  }

  function submit(e) {
    e.preventDefault()
    // Basic validation
    if (!form.name || !form.email || !form.career) {
      alert('Completa nombre, email y carrera')
      return
    }
    onSave({ ...form })
  }

  return (
    <form onSubmit={submit}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{form.id ? 'Editar Estudiante' : 'Añadir Estudiante'}</h3>
        <button type="button" onClick={onCancel} className="text-gray-500">Cerrar</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm">Nombre</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg" />
        </div>
        <div>
          <label className="text-sm">Email</label>
          <input name="email" value={form.email} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg" />
        </div>
        <div>
          <label className="text-sm">Carrera</label>
          <input name="career" value={form.career} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg" />
        </div>
        <div>
          <label className="text-sm">GPA</label>
          <input name="gpa" type="number" step="0.01" value={form.gpa} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg" />
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-3 py-2 rounded-lg border">Cancelar</button>
        <button type="submit" className="px-3 py-2 rounded-lg bg-indigo-600 text-white">Guardar</button>
      </div>
    </form>
  )
}
