import UploadFilePage from './components/index'

function App() {
  return (
    <UploadFilePage
      onUpload={(files) => console.log('uploaded:', files)}
      onAction={(file) => console.log('action:', file)}
    />
  )
}

export default App