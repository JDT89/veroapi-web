import Link from 'next/link'
export default function TemplateCard({ template }){
  return (
    <div className="card p-4">
      <img src={template.images?.[0] || '/favicon.ico'} alt="thumb" className="h-40 w-full object-cover rounded" />
      <h3 className="mt-2 font-semibold">{template.name}</h3>
      <p className="text-sm text-gray-500">{template.description}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs">{template.codes?.length || 0} pieces</span>
        <Link href={`/templates/${template.id}`}><a className="btn-small">Open</a></Link>
      </div>
    </div>
  )
}
