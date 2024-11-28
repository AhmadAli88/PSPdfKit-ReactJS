
import './App.css'
import ViewerComponent from './components/EditablePDFViewer'


function App() {


  return (
    <div className="App" style={{ width: '100vw' }}>
    <div className="PDF-viewer">
      <ViewerComponent document="../public/sample.pdf"  />
    </div>
  </div>
  )
}

export default App
