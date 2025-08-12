import Wines from './components/wines/Wines'
import { wines } from './data/wines'
import 'bootstrap/dist/css/bootstrap.min.css';
import GenericSidebarFilter from './components/common/generic-sideBar-filter'

 const wineFilters = [
    {
      id: 'price',
      type: 'range',
      title: 'Precio',
      isCollapsed: false,
      content: null, 
      options: {
        min: 0,
        max: 500000,
        step: 100,
        unit: '$'
      }
    },
    {
      id: 'brand',
      type: 'checkbox',
      title: 'Bodega',
      isCollapsed: false,
      content: null,
      options: [
        { value: 'catena', label: 'Catena Zapata', count: 15 },
        { value: 'trapiche', label: 'Trapiche', count: 23 },
        { value: 'norton', label: 'Norton', count: 18 },
        { value: 'alamos', label: 'Alamos', count: 12 },
        { value: 'rutini', label: 'Rutini', count: 9 }
      ]
    },
    {
      id: 'type',
      type: 'checkbox',
      title: 'Tipo de Vino',
      isCollapsed: true,
      content: null,
      options: [
        { value: 'tinto', label: 'Tinto', count: 45 },
        { value: 'blanco', label: 'Blanco', count: 28 },
        { value: 'rosado', label: 'Rosado', count: 15 },
        { value: 'espumante', label: 'Espumante', count: 8 }
      ]
    },
    {
      id: 'rating',
      type: 'rating',
      title: 'Calificación',
      isCollapsed: false,
      content: null,
      options: [
        { value: 5, label: '5 estrellas ', count: 12 },
        { value: 4, label: '4 estrellas ', count: 34 },
        { value: 3, label: '3 estrellas ', count: 28 },
        { value: 2, label: '2 estrellas ', count: 15 }
      ]
    },
    {
      id: 'region',
      type: 'checkbox',
      title: 'Región',
      isCollapsed: true,
      content: null,
      options: [
        { value: 'mendoza', label: 'Mendoza', count: 42 },
        { value: 'sanjuan', label: 'San Juan', count: 18 },
        { value: 'salta', label: 'Salta', count: 15 },
        { value: 'rionegro', label: 'Río Negro', count: 8 },
        { value: 'neuquen', label: 'Neuquén', count: 5 }
      ]
    }
  ];

function App() {
  return (
    <div className='container-fluid'>
      <div className='row'>
        <aside className='col-md-3 col-lg-2 bg-light border-end p-5 mt-5 ml-1'>
          <GenericSidebarFilter filters={wineFilters} title='Filtros de vinos' />
        </aside>
        <main className='col-md-9 col-lg-10 p-4 mt-5'>
          <Wines wines={wines}/>
        </main>
      </div>
    </div>
  )
}

export default App
