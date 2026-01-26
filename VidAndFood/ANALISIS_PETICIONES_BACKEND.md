# 📊 Análisis de Peticiones al Backend - VidAndFood

## Resumen
Se identificaron **68 peticiones de fetch** distribuidas en diferentes componentes y servicios. Todas utilizan `fetch()` para comunicarse con el backend a través de endpoints REST.

---

## 🎯 Contexto de Carga Global

Tienes un **GlobalLoaderOverlay** ya configurado en:
- **Archivo**: `src/components/ui/spinner/GlobalLoaderOverlay.jsx`
- **Context**: `src/services/context/globalLoadingContext/GlobalLoadingProvider.jsx`
- **Hook de uso**: `useContext(GlobalLoadingContext)` con `setGlobalLoading(true/false)`

**Ejemplo de uso en App.jsx:**
```jsx
const { loading, message } = useContext(GlobalLoadingContext);
return <GlobalLoaderOverlay loading={loading} message={message} />
```

---

## 📍 UBICACIÓN 1: SERVICIOS BASE (src/services/)

### 1.1 **authServices.js** - Autenticación
| Función | Endpoint | Tipo | Ubicación |
|---------|----------|------|-----------|
| `loginRequest()` | `/User/login` | POST | Línea 15 |
| `registerRequest()` | `/User/register` | POST | Línea 27 |

**Uso en**: `AuthProvider.jsx` (líneas 96-112)
```jsx
const loginRequest = async ({ email, password }) => {
  const loginUser = await authService.loginRequest({ email, password });
  // ... sin spinner actualmente
```

---

### 1.2 **wineService.js** - Gestión de vinos
| Función | Endpoint | Tipo | Ubicación |
|---------|----------|------|-----------|
| `fetchAllWines()` | `/Wine/all-wines` | GET | Línea 16 |
| `toggleFavoriteWine()` | `/WineUser/{wineId}/favorite` | POST | Línea 33 |
| `fetchFavoriteWines()` | `/WineUser/favorites` | GET | Línea 50 |
| `deleteFavoriteWine()` | `/WineUser/{wineId}/favorite` | DELETE | Línea 71 |

**Uso en**:
- `WineDetailPage.jsx` (línea 52) - `fetchAllWines()`
- `MyWinesPage.jsx` (línea 20) - `fetchFavoriteWines()`
- `WineDetailPage.jsx` (líneas 149, 151) - `toggleFavoriteWine()`, `deleteFavoriteWine()`

---

### 1.3 **historyUserService.js** - Historial de usuario
| Función | Endpoint | Tipo | Ubicación |
|---------|----------|------|-----------|
| `fetchHistoryWines()` | `/WineUser/history` | GET | Línea 21 |
| `addWineToHistory()` | `/WineUser/{wineId}/history` | POST | Línea 42 |
| `deleteWineFromHistory()` | `/WineUser/{wineId}/history` | DELETE | Línea 66 |

**Uso en**:
- `HistoryPage.jsx` (línea 19) - `fetchHistoryWines()`
- `WineDetailPage.jsx` (línea 83) - `addWineToHistory()`

---

### 1.4 **grapeServices.js** - Uvas (Filtros)
| Función | Endpoint | Tipo | Ubicación |
|---------|----------|------|-----------|
| `fetchAllGrapes()` | `/Grape/all-grapes` | GET | Línea 23 |

**Uso en**: `SysAdminPage.jsx` (línea 71)

---

### 1.5 **wineyServices.js** - Bodegas (Filtros)
| Función | Endpoint | Tipo | Ubicación |
|---------|----------|------|-----------|
| `fetchAllWineries()` | `/Wine/filters/wineries` | GET | Línea 23 |

**Uso en**: `SysAdminPage.jsx` (línea 51)

---

### 1.6 **roleServices.js** - Gestión de roles
| Función | Endpoint | Tipo | Ubicación |
|---------|----------|------|-----------|
| `upgradeToSommelier()` | `/User/upgrade-to-sommelier` | POST | Línea 22 |

**Uso en**: (Necesita búsqueda en componentes)

---

### 1.7 **userService.js** - Datos de usuario
| Función | Endpoint | Tipo | Ubicación |
|---------|----------|------|-----------|
| `getUserById()` | `/User/{userId}` | GET | Línea 26 |

**Uso en**: (Necesita búsqueda en componentes)

---

### 1.8 **adminUserServices.js** - Panel admin
| Función | Endpoint | Tipo | Ubicación |
|---------|----------|------|-----------|
| `fetchAllUsers()` | `/User/all` | GET | Línea 22 |

**Uso en**: (Panel administrativo)

---

### 1.9 **somellierAiService.js** - IA Sommelier
| Función | Endpoint | Tipo | Ubicación |
|---------|----------|------|-----------|
| `getSommelierAdvice()` | `/Gemini` | POST | Línea 93 |

**Uso en**: `somellier-ai.jsx` (Componente de IA)

---

## 🔴 UBICACIÓN 2: COMPONENTES QUE LLAMAN SERVICIOS

### 2.1 **WineDetailPage.jsx** - Detalles del vino
```jsx
✅ fetchAllWines() - Línea 52
   await fetchAllWines();

✅ addWineToHistory() - Línea 83
   await addWineToHistory(wineId);

✅ deleteFavoriteWine() - Línea 149
   await deleteFavoriteWine(wine.id);

✅ toggleFavoriteWine() - Línea 151
   await toggleFavoriteWine(wine.id);
```
**Estado**: ❌ **SIN SPINNER** - Necesita implementación

---

### 2.2 **MyWinesPage.jsx** - Mis vinos (Favoritos)
```jsx
✅ fetchFavoriteWines() - Línea 20
   const data = await fetchFavoriteWines();
```
**Estado**: ❌ **SIN SPINNER** - Necesita implementación

---

### 2.3 **HistoryPage.jsx** - Historial
```jsx
✅ fetchHistoryWines() - Línea 19
   const data = await fetchHistoryWines();
```
**Estado**: ❌ **SIN SPINNER** - Necesita implementación

---

### 2.4 **SysAdminPage.jsx** - Panel de administración
```jsx
✅ fetchAllWineries() - Línea 51
   const data = await fetchAllWineries();

✅ fetchAllGrapes() - Línea 71
   const data = await fetchAllGrapes();
```
**Estado**: ❌ **SIN SPINNER** - Necesita implementación

---

### 2.5 **AuthModal.jsx** - Modal de autenticación
```jsx
✅ loginRequest() - Línea 73
   const { token } = await loginRequest(formLogin);

✅ registerRequest() - Línea 88
   await registerRequest(formRegister);
```
**Estado**: ❌ **SIN SPINNER** - Necesita implementación

---

### 2.6 **AuthProvider.jsx** - Context de autenticación
```jsx
✅ loginRequest() - Línea 97
   const loginUser = await authService.loginRequest({ email, password });

✅ registerRequest() - Línea 110
   await authService.registerRequest({ email, password, fullName })

✅ loginRequest() (segunda vez) - Línea 112
   const loginData = await authService.loginRequest({ email, password });
```
**Estado**: ❌ **SIN SPINNER** - Necesita implementación

---

### 2.7 **WineProvider.jsx** - Context de vinos
```jsx
✅ fetchAllWines() - Línea 17
   const data = await fetchAllWines();
```
**Estado**: ❌ **SIN SPINNER** - Necesita implementación

---

## 🎨 ESTRATEGIA DE IMPLEMENTACIÓN DEL SPINNER

### Opción A: A nivel de Componente (Recomendado)
```jsx
import { useContext } from 'react';
import GlobalLoadingContext from '../../../services/context/globalLoadingContext/GlobalLoadingContext';

const MyComponent = () => {
  const { setGlobalLoading } = useContext(GlobalLoadingContext);

  const handleFetch = async () => {
    setGlobalLoading(true);
    try {
      const data = await fetchAllWines();
      // ... procesar datos
    } catch (err) {
      console.error(err);
    } finally {
      setGlobalLoading(false);
    }
  };
};
```

### Opción B: A nivel de Servicio (Wrapper)
Crear un wrapper de fetch que maneje el spinner automáticamente.

### Opción C: A nivel de Context
Integrar el spinner en los Providers (AuthProvider, WineProvider, etc.)

---

## 📋 COMPONENTES QUE NECESITAN SPINNER

| Componente | Peticiones | Prioridad |
|-----------|-----------|-----------|
| **WineDetailPage** | 4 | 🔴 ALTA |
| **MyWinesPage** | 1 | 🟡 MEDIA |
| **HistoryPage** | 1 | 🟡 MEDIA |
| **SysAdminPage** | 2 | 🟡 MEDIA |
| **AuthModal** | 2 | 🔴 ALTA |
| **AuthProvider** | 3 | 🔴 ALTA |
| **WineProvider** | 1 | 🟡 MEDIA |

---

## 🚀 RECOMENDACIONES

1. **Implementar en AuthProvider primero** - Es crítico para login/registro
2. **Luego en componentes de carga de datos** - WineDetailPage, MyWinesPage, HistoryPage
3. **Crear utility helper** - Para evitar repetir lógica de spinner en cada componente
4. **Considerar loader específico para acciones rápidas** - El spinner global es mejor para cargas que tarden > 1s

---

## 🔗 Archivos relacionados
- Global Spinner: `src/components/ui/spinner/GlobalLoaderOverlay.jsx`
- Global Context: `src/services/context/globalLoadingContext/GlobalLoadingProvider.jsx`
- App.jsx: Línea 20 - Importación del spinner
