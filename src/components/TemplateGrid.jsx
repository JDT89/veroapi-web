import useSWR from 'swr'
import TemplateCard from './TemplateCard'
import axios from 'axios'

const fetcher = url => axios.get(url).then(res => res.data)

export default function TemplateGrid(){
  const { data, error } = useSWR('/api/templates', fetcher)
  if (!data) return <div>Loading...</div>
  return (
    <div className="grid grid-cols-3 gap-4">
      {data.map(t => <TemplateCard key={t.id} template={t} />)}
    </div>
  )
}
