import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios from 'axios'
import InstallWizard from '../../components/InstallWizard'

const fetcher = url => axios.get(url).then(r => r.data)

export default function TemplateDetail(){
  const router = useRouter()
  const { id } = router.query
  const { data } = useSWR(() => id ? `/api/templates/${id}` : null, fetcher)
  if (!data) return <div>Loading...</div>
  return (
    <div>
      <h1 className="text-3xl">{data.name}</h1>
      <p className="text-gray-600">{data.description}</p>

      <section className="mt-6">
        <h3 className="font-semibold">Share Codes</h3>
        <div className="space-y-2 mt-2">
          {data.codes.map(code => (
            <div key={code.id} className="p-3 border rounded flex justify-between items-start">
              <div>
                <strong>{code.title || code.type}</strong>
                <p className="text-xs text-gray-500">Type: {code.type}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button className="btn" onClick={() => navigator.clipboard.writeText(code.shareCode)}>Copy Code</button>
                <small className="text-xs text-gray-400">{code.shareCode.slice(0,40)}...</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <InstallWizard template={data} />
    </div>
  )
}
