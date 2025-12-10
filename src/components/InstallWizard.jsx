export default function InstallWizard({ template }){
  return (
    <div className="mt-6 p-4 border rounded">
      <h4 className="font-semibold">Installation Helper</h4>
      <ol className="list-decimal ml-6 mt-2 space-y-2 text-sm text-gray-700">
        <li>Open your BotGhost dashboard ➜ Commands ➜ Import</li>
        <li>Click "Copy" for the first code and paste into BotGhost import</li>
        <li>Repeat for each share code listed under "Share Codes"</li>
        <li>Create the variables listed below (if any)</li>
        <li>Follow setup steps in the "Setup" tab on this page</li>
      </ol>
    </div>
  )
}
