# Vinísima - Migración a Supabase

Este proyecto ha sido migrado de Base44 a Supabase para mayor control y flexibilidad.

## 🚀 Configuración Inicial

### 1. Crear proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota tu **Project URL** y **API Key (anon public)**

### 2. Configurar variables de entorno

1. Copia `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edita el archivo `.env` con tus credenciales de Supabase:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto-id.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-clave-publica-anonima
   ```

### 3. Crear las tablas en Supabase

1. Ve a tu proyecto en Supabase
2. Navega a **SQL Editor**
3. Copia y ejecuta todo el contenido del archivo `supabase-schema.sql`
4. Esto creará todas las tablas necesarias con sus políticas de seguridad

### 4. Instalar dependencias y ejecutar

```bash
npm install
npm run dev
```

## 📊 Estructura de Datos

### Tablas Principales

- **muestras**: Almacena información de vinos/bebidas a catar
- **tandas**: Sesiones de cata programadas
- **catas**: Evaluaciones de vinos tradicionales
- **catas_espirituosos**: Evaluaciones específicas para destilados

### Características de Seguridad

- **Row Level Security (RLS)**: Cada usuario solo ve sus propios datos
- **Autenticación**: Integrada con Supabase Auth
- **Políticas**: Configuradas automáticamente para proteger los datos

## 🔄 Diferencias con Base44

### Cambios Principales

1. **Cliente de conexión**: Ahora usa `@supabase/supabase-js`
2. **Autenticación**: Manejada por Supabase Auth
3. **Estructura de datos**: Adaptada a PostgreSQL
4. **Seguridad**: RLS implementado por defecto

### Archivos Modificados

- `src/api/supabaseClient.js` - Cliente de Supabase
- `src/api/supabaseEntities.js` - Entidades adaptadas a Supabase
- `src/api/entities.js` - Exporta las nuevas entidades
- `src/pages/Dashboard.jsx` - Actualizado para usar nuevas entidades
- `src/pages/Tandas.jsx` - Actualizado para usar nuevas entidades

## 🛠️ Próximos Pasos

### Páginas Pendientes de Actualizar

Necesitas actualizar estos archivos para usar las nuevas entidades:

- `src/pages/NuevaCata.jsx`
- `src/pages/CataEspirituosos.jsx` 
- `src/pages/Estadisticas.jsx`
- `src/components/dashboard/MuestrasPendientes.jsx`
- `src/components/dashboard/TandasHoy.jsx`
- `src/components/dashboard/ResumenEstadisticas.jsx`

### Patrón de Actualización

Cambia las importaciones de:
```javascript
import { base44 } from "@/api/base44Client";
// Y usar: base44.entities.Muestra.list()
```

A:
```javascript
import { Muestra, Tanda, Cata } from "@/api/entities";
// Y usar: Muestra.list()
```

## 🔧 Funcionalidades Adicionales

### Autenticación

Para implementar login/registro:
```javascript
import { User } from "@/api/entities";

// Registro
await User.signUp(email, password, { nombre: "Juan Pérez" });

// Login
await User.signIn(email, password);

// Logout
await User.signOut();

// Usuario actual
const user = await User.getUser();
```

### Real-time (Opcional)

Supabase soporta actualizaciones en tiempo real:
```javascript
import { supabase } from "@/api/supabaseClient";

// Escuchar cambios en tandas
supabase
  .channel('tandas-changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'tandas' },
    (payload) => {
      console.log('Cambio en tandas:', payload);
    }
  )
  .subscribe();
```

## 📚 Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de React con Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-react)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## ⚡ Ventajas de Supabase

1. **Código abierto**: Control total sobre tus datos
2. **PostgreSQL**: Base de datos robusta y escalable
3. **Real-time**: Actualizaciones instantáneas
4. **Autenticación integrada**: Login social, MFA, etc.
5. **Gratuito**: Generoso plan gratuito para proyectos pequeños
6. **Fácil despliegue**: Hosting incluido

¡Tu aplicación Vinísima ahora tiene total independencia y control! 🍷