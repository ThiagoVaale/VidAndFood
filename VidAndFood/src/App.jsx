import { BrowserRouter, Routes, Route } from 'react-router'
import MainLayout from './components/MainLayout'

function App() {

  return (
    <BrowserRouter>
      <MainLayout />
      {/* <Routes>
        <Route path="/" element={<Wines />} />
        <Route path="/wines" element={<Wines />} />
        <Route path="/grapes" element={<Grapes />} />
        <Route path="/regions" element={<Regions />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/my-cellar" element={<MyCellar />} />
      </Routes> */}
    </BrowserRouter>
  
  )
}

export default App
