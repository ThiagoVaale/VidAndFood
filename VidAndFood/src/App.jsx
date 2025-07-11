import Wines from './components/wines/Wines'
import { wines } from './data/wines'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <Wines wines={wines}/>
    </>
  )
}

export default App
