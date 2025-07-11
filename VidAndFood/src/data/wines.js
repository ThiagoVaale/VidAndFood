import DonNicanorMalbec from '../images/DonNicanorMalbec.png'
import SalenteinReserveChardonnay from '../images/SalenteinReserveChardonnay.png'
import LuigiBoscaCabernetSauvignon from '../images/LuigiBoscaCaberneSauvignon.png'
import ElEnemigoBonarda from '../images/ElEnemigoBonarda.png'
import TrapicheIscaySyrah from '../images/TrapichIscaySyrahViognier.png'
import ZuccardiQTempranillo from '../images/ZuccardiQTempranillo.png'
import Andeluma1300Torrontés from '../images/Andeluna1300Torrontés.png'
import ColoméAlturaMáximaMalbec from '../images/ColoméAlturaMáximaMalbec.png'
import CadusSignatureBlend from '../images/CadusSignaturBlend.png'

export const wines = [
    {
        "id": 1,
        "img": DonNicanorMalbec,
        "nombre": "Don Nicanor Malbec",
        "anio_cosecha": 2020,
        "temperatura_servicio": [
            {
                'min': 16,
                'max': 18
            }
        ],
        "maridaje": ["Carnes rojas", "Pastas con salsas fuertes"],
        "aroma": "Frutos negros maduros, violetas y especias",
        "notas_cata": "Estructurado, taninos suaves, final persistente",
        "variedad_uva": ["Malbec"],
        "precio_promedio": 5500,
        "tiempo_decantacion_min": 30,
        "bodega": "Bodega Nieto Senetiner",
        "descripcion_bodega": "Fundada en 1888 en Luján de Cuyo, Mendoza, especializada en vinos de guarda",
        "tipo": "Tinto",
        "rating": 5
    },
    {
        "id": 2,
        "img": SalenteinReserveChardonnay,
        "nombre": "Salentein Reserve Chardonnay",
        "anio_cosecha": 2022,
        "temperatura_servicio": [
            {
                'min': 10,
                'max': 12
            }
        ],
        "maridaje": ["Pescados grasos", "Quesos suaves", "Aves"],
        "aroma": "Frutas tropicales, vainilla y manteca",
        "notas_cata": "Untuoso, equilibrado, con acidez vibrante",
        "variedad_uva": ["Chardonnay"],
        "precio_promedio": 4700,
        "tiempo_decantacion_min": 10,
        "bodega": "Bodegas Salentein",
        "descripcion_bodega": "Ubicada en Valle de Uco, con tecnología europea y cuidado artesanal",
        "tipo": "Blanco",
        "rating": 4
    },
    {
        "id": 3,
        "img": LuigiBoscaCabernetSauvignon,
        "nombre": "Luigi Bosca Cabernet Sauvignon",
        "anio_cosecha": 2019,
        "temperatura_servicio": [
            {
                'min': 17,
                'max': 19
            }
        ],
        "maridaje": ["Cordero", "Risottos", "Carnes grilladas"],
        "aroma": "Pimiento verde, tabaco y frutas negras",
        "notas_cata": "Concentrado, taninos marcados y final largo",
        "variedad_uva": ["Cabernet Sauvignon"],
        "precio_promedio": 6500,
        "tiempo_decantacion_min": 45,
        "bodega": "Luigi Bosca",
        "descripcion_bodega": "Tradición familiar desde 1901, vinos de alta gama con exportación mundial",
        "tipo": "Tinto",
        "rating": 5
    },
    {
        "id": 4,
        "img": ElEnemigoBonarda,
        "nombre": "El Enemigo Bonarda",
        "anio_cosecha": 2021,
        "temperatura_servicio": [
            {
                'min': 15,
                'max': 17
            }
        ],
        "maridaje": ["Embutidos", "Empanadas", "Cerdo agridulce"],
        "aroma": "Frambuesa, cereza y toques de cacao",
        "notas_cata": "Jugoso, de buena acidez y taninos sedosos",
        "variedad_uva": ["Bonarda"],
        "precio_promedio": 4000,
        "tiempo_decantacion_min": 20,
        "bodega": "Bodega Aleanna",
        "descripcion_bodega": "Proyecto de Alejandro Vigil, enólogo de Catena Zapata",
        "tipo": "Tinto",
        "rating": 2
    },
    {
        "id": 5,
        "img": TrapicheIscaySyrah,
        "nombre": "Trapiche Iscay Syrah-Viognier",
        "anio_cosecha": 2018,
        "temperatura_servicio": [
            {
                'min': 16,
                'max': 18
            }
        ],
        "maridaje": ["Carnes especiadas", "Platos exóticos"],
        "aroma": "Cassis, lavanda y pimienta negra",
        "notas_cata": "Complejo, de cuerpo medio, taninos elegantes",
        "variedad_uva": [ 'Syrah', "Viognier"],
        "precio_promedio": 7200,
        "tiempo_decantacion_min": 50,
        "bodega": "Trapiche",
        "descripcion_bodega": "Una de las bodegas más grandes de Argentina, con gran innovación en blends",
        "tipo": "Tinto",
        "rating": 4
    },
    {
        "id": 6,
        "img": ZuccardiQTempranillo,
        "nombre": "Zuccardi Q Tempranillo",
        "anio_cosecha": 2020,
        "temperatura_servicio": [
            {
                'min': 16,
                'max': 18
            }
        ],
        "maridaje": ["Pizzas gourmet", "Carnes ahumadas"],
        "aroma": "Humo, frutas negras y cuero",
        "notas_cata": "Redondo, con buena estructura y acidez media",
        "variedad_uva": ["Tempranillo"],
        "precio_promedio": 5200,
        "tiempo_decantacion_min": 30,
        "bodega": "Familia Zuccardi",
        "descripcion_bodega": "Bodega innovadora, reconocida internacionalmente por sus vinos de terroir",
        "tipo": "Tinto",
        "rating": 3
    },
    {
        "id": 7,
        "img": Andeluma1300Torrontés,
        "nombre": "Andeluna 1300 Torrontés",
        "anio_cosecha": 2023,
        "temperatura_servicio": [
            {
                'min': 8,
                'max': 10
            }
        ],
        "maridaje": ["Comida asiática", "Ensaladas cítricas"],
        "aroma": "Jazmín, durazno blanco y cáscara de naranja",
        "notas_cata": "Fresco, aromático y de final floral",
        "variedad_uva": ["Torrontés"],
        "precio_promedio": 3100,
        "tiempo_decantacion_min": 0,
        "bodega": "Andeluna",
        "descripcion_bodega": "Bodega boutique en Gualtallary, enfocada en expresar el terroir andino",
        "tipo": "Blanco",
        "rating": 5
    },
    {
        "id": 8,
        "img": ColoméAlturaMáximaMalbec,
        "nombre": "Colomé Altura Máxima Malbec",
        "anio_cosecha": 2021,
        "temperatura_servicio": [
            {
                'min': 16,
                'max': 18
            }
        ],
        "maridaje": ["Guisos", "Carnes a la leña"],
        "aroma": "Frutas negras, especias y tierra mojada",
        "notas_cata": "Potente, mineral, de gran profundidad",
        "variedad_uva": ["Malbec"],
        "precio_promedio": 9500,
        "tiempo_decantacion_min": 60,
        "bodega": "Bodega Colomé",
        "descripcion_bodega": "Una de las bodegas más altas del mundo, ubicada en Salta",
        "tipo": "Tinto",
        "rating": 2
    },
    {
        "id": 9,
        "img": CadusSignatureBlend,
        "nombre": "Cadus Signature Blend",
        "anio_cosecha": 2019,
        "temperatura_servicio": [
            {
                'min': 17,
                'max': 19
            }
        ],
        "maridaje": ["Asado", "Quesos duros", "Platos gourmet"],
        "aroma": "Café, frutas maduras, especias dulces",
        "notas_cata": "Intenso, complejo, con final largo y especiado",
        "variedad_uva": ["Malbec", "Cabernet Franc", "Petit Verdot", "Syrah"],
        "precio_promedio": 8900,
        "tiempo_decantacion_min": 50,
        "bodega": "Cadus Wines",
        "descripcion_bodega": "Pequeña bodega mendocina enfocada en vinos de autor",
        "tipo": "Tinto",
        "rating": 5
    }
]