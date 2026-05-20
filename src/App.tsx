import { useState } from 'react'

// Definisi tipe data untuk 1 task
type Task = {
  id: number
  title: string
  status: 'start'| 'race' | 'finish'  // hanya 3 nilai yang valid
}

// Tipe untuk column
type ColumnType = 'start' | 'race' | 'finish'

function App() {
  // State: daftar semua task
  const [tasks, setTasks] = useState<Task[]>([])
  // State: isi input field
  const [inputValue, setInputValue] = useState('')
  const addTask = ()=> {
    if (inputValue.trim() === '') return

    const newTask: Task = {
      id : Date.now(),
      title : inputValue.trim(),
      status : 'start',
    }

    setTasks([...tasks, newTask])
    setInputValue('')
  }

//Config untuk setiap kolom
const columnConfig: Record<ColumnType, { title: string; emoji: string; color: string}> = {
  start: {title: 'START',     emoji: '🏎️', color: 'border-red-500'},
  race : {title : 'RACE', emoji: '🚀', color: 'border-black-500'},
  finish: {title: 'FINISH', emoji:'🥇', color: 'border-green-500'},
}

//Fungsi pindahkan task ke status berikutnya
const moveTask = (taskId: number, newStatus: ColumnType) => {
  setTasks(tasks.map(task =>
    task.id === taskId ? {...task, status: newStatus } : task
  ))
}

// Fungsi Hapus Task
const deleteTask = (taskId : number) => {
  setTasks(tasks.filter(task => task.id !== taskId))
}

//Filter tasks per column
const getTasksByStatus = (status: ColumnType) => {
  return tasks.filter(task => task.status === status)
}

const columns: ColumnType[] = ['start', 'race', 'finish']


  return (
    <div className="min-h-screen bg-Barlow Consended-900 text-black p-8">
      <h1 className="text-3xl font-Orbitron text-center mb-8">
        🏎️ RACE BOARD 
      </h1>
      <p className="text-center text-gray-400">
        Tasks: {tasks.length} | Input: "{inputValue}"
      </p>
{/* Form Input */}
<div className="max-w-md mx-auto flex gap-2 mb-8">
  <input
    type="text"
    value={inputValue}
    onChange={(e) => setInputValue(e.target.value)}
    onKeyDown={(e) => e.key === 'Enter' && addTask()}
    placeholder="Tambah task baru..."
    className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700
               focus:outline-none focus:border-cyan-500 transition-colors"
  />
  <button
    onClick={addTask}
    className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg
               font-Orbitron transition-colors"
  >
    + Add
  </button>
</div>


 <div className="flex justify-center gap-4 mb-6">
  <div className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg text-sm">
    📑 Todo: {getTasksByStatus('start').length}
  </div>

   <div className="bg-yellow-500/20 text-blue-400 px-4 py-2 rounded-lg text-sm">
    🏃‍♂️ Doing: {getTasksByStatus ('race').length}
  </div>

   <div className="bg-green-500/20 text-blue-400 px-4 py-2 rounded-lg text-sm">
     ✅ Done: {getTasksByStatus('finish').length}
  </div>
</div>
{/* Board: 3 Columns */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
  {columns.map(status => {
    const config = columnConfig[status]
    const columnTasks = getTasksByStatus(status)

    return (
      <div
        key={status}
        className={`bg-gray-800/50 rounded-xl p-4 border-t-4 ${config.color}
                    backdrop-blur-sm animate-slide-in`}
      >
        {/* Column Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">
            {config.emoji} {config.title}
          </h2>
          <span className="bg-gray-700 text-xs px-2 py-1 rounded-full">
            {columnTasks.length}
          </span>
        </div>

        {/* Task Cards */}
        <div className="space-y-2 min-h-[100px]">
          {columnTasks.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-8">
              No tasks yet
            </p>
          ) : (
            columnTasks.map(task => (
              <div
                key={task.id}
                className="bg-gray-700/50 rounded-lg p-3 hover:bg-gray-700
                           transition-all group animate-fade-in"
              >
                <p className="text-sm mb-2">{task.title}</p>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {status !== 'start' && (
                    <button
                      onClick={() => moveTask(task.id,
                        status == 'race' ? 'start' : 'race'
                      )}
                      className="text-xs px-2 py-1 bg-gray-600 hover:bg-gray-500
                                 rounded transition-colors cursor-pointer"
                    >
                      ← Back
                    </button>
                  )}
                  {status !== 'finish' && (
                    <button
                      onClick={() => moveTask(task.id,
                        status === 'start' ? 'race' : 'finish'
                      )}
                      className="text-xs px-2 py-1 bg-cyan-600 hover:bg-cyan-500
                                 rounded transition-colors cursor-pointer"
                    >
                      Next →
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-xs px-2 py-1 bg-red-600/50 hover:bg-red-600
                               rounded transition-colors ml-auto cursor-pointer"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  })}
</div>

    </div>
  )
}


export default App