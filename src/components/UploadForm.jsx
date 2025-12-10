import { useState } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'

export default function UploadForm(){
  const { data: session } = useSession()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [codes, setCodes] = useState([{type:'command', title:'', shareCode:''}])

  const addCode = () => setCodes(prev => [...prev, {type:'command', title:'', shareCode:''}])
  const updateCode = (i, field, value) => setCodes(prev => prev.map((c,idx) => idx===i ? {...c, [field]: value} : c))
  const removeCode = (i) => setCodes(prev => prev.filter((_,idx)=>idx!==i))

  const submit = async (e) => {
    e.preventDefault()
    if (!session) return alert('Please sign in')
    const payload = { name, description, codes }
    await axios.post('/api/templates', payload)
    alert('Template uploaded')
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label>Template Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} className="input" />
      </div>
      <div>
        <label>Description</label>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} className="input" />
      </div>

      <div>
        <h4>Codes</h4>
        {codes.map((c,i)=> (
          <div key={i} className="p-2 border rounded mb-2">
            <select value={c.type} onChange={e=>updateCode(i,'type',e.target.value)}>
              <option value="command">Command</option>
              <option value="event">Event</option>
            </select>
            <input placeholder="Title" value={c.title} onChange={e=>updateCode(i,'title',e.target.value)} className="input" />
            <textarea placeholder="Share Code" value={c.shareCode} onChange={e=>updateCode(i,'shareCode',e.target.value)} className="input" />
            <button type="button" onClick={()=>removeCode(i)} className="text-red-500">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addCode} className="btn">Add Code</button>
      </div>

      <div>
        <button className="btn">Publish Template</button>
      </div>
    </form>
  )
}
