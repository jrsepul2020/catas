-- Crear tablas para el proyecto Vinísima en Supabase
-- Ejecuta este SQL en tu panel de Supabase

-- Tabla Muestras
CREATE TABLE IF NOT EXISTS public.muestras (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Campos específicos de la muestra
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(100), -- 'Vino', 'Cava', 'Espirituoso', etc.
    denominacion VARCHAR(255),
    bodega VARCHAR(255),
    cosecha INTEGER,
    graduacion DECIMAL(4,2),
    estado VARCHAR(50) DEFAULT 'Pendiente', -- 'Pendiente', 'En Cata', 'Catada', 'Descartada'
    notas TEXT,
    precio DECIMAL(10,2),
    distribuidor VARCHAR(255),
    fecha_recepcion DATE,
    
    -- Metadatos
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabla Tandas
CREATE TABLE IF NOT EXISTS public.tandas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Campos específicos de la tanda
    nombre VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL,
    hora TIME,
    ubicacion VARCHAR(255),
    descripcion TEXT,
    estado VARCHAR(50) DEFAULT 'Programada', -- 'Programada', 'En Curso', 'Finalizada', 'Cancelada'
    max_participantes INTEGER,
    tipo_cata VARCHAR(100), -- 'Vinos', 'Espirituosos', 'Mixta'
    
    -- Metadatos
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabla Catas
CREATE TABLE IF NOT EXISTS public.catas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Referencias
    muestra_id UUID REFERENCES public.muestras(id) ON DELETE CASCADE,
    tanda_id UUID REFERENCES public.tandas(id) ON DELETE CASCADE,
    
    -- Evaluación visual
    color VARCHAR(100),
    intensidad_color INTEGER CHECK (intensidad_color >= 1 AND intensidad_color <= 10),
    limpieza INTEGER CHECK (limpieza >= 1 AND limpieza <= 10),
    
    -- Evaluación olfativa
    intensidad_aroma INTEGER CHECK (intensidad_aroma >= 1 AND intensidad_aroma <= 10),
    calidad_aroma INTEGER CHECK (calidad_aroma >= 1 AND calidad_aroma <= 10),
    descriptores_aroma TEXT[],
    
    -- Evaluación gustativa
    intensidad_sabor INTEGER CHECK (intensidad_sabor >= 1 AND intensidad_sabor <= 10),
    calidad_sabor INTEGER CHECK (calidad_sabor >= 1 AND calidad_sabor <= 10),
    equilibrio INTEGER CHECK (equilibrio >= 1 AND equilibrio <= 10),
    persistencia INTEGER CHECK (persistencia >= 1 AND persistencia <= 10),
    descriptores_sabor TEXT[],
    
    -- Evaluación general
    puntuacion_total INTEGER CHECK (puntuacion_total >= 0 AND puntuacion_total <= 100),
    comentarios TEXT,
    recomendacion VARCHAR(50), -- 'Excelente', 'Muy Bueno', 'Bueno', 'Regular', 'Deficiente'
    
    -- Metadatos
    catador VARCHAR(255),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabla Catas de Espirituosos (estructura específica para destilados)
CREATE TABLE IF NOT EXISTS public.catas_espirituosos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Referencias
    muestra_id UUID REFERENCES public.muestras(id) ON DELETE CASCADE,
    tanda_id UUID REFERENCES public.tandas(id) ON DELETE CASCADE,
    
    -- Evaluación visual específica para espirituosos
    color VARCHAR(100),
    transparencia INTEGER CHECK (transparencia >= 1 AND transparencia <= 10),
    densidad INTEGER CHECK (densidad >= 1 AND densidad <= 10),
    
    -- Evaluación olfativa
    intensidad_aroma INTEGER CHECK (intensidad_aroma >= 1 AND intensidad_aroma <= 10),
    complejidad_aroma INTEGER CHECK (complejidad_aroma >= 1 AND complejidad_aroma <= 10),
    calidad_aroma INTEGER CHECK (calidad_aroma >= 1 AND calidad_aroma <= 10),
    descriptores_aroma TEXT[],
    
    -- Evaluación gustativa específica
    ataque INTEGER CHECK (ataque >= 1 AND ataque <= 10),
    evolucion INTEGER CHECK (evolucion >= 1 AND evolucion <= 10),
    final INTEGER CHECK (final >= 1 AND final >= 10),
    equilibrio INTEGER CHECK (equilibrio >= 1 AND equilibrio <= 10),
    intensidad_alcohol INTEGER CHECK (intensidad_alcohol >= 1 AND intensidad_alcohol <= 10),
    descriptores_sabor TEXT[],
    
    -- Evaluación general
    puntuacion_total INTEGER CHECK (puntuacion_total >= 0 AND puntuacion_total <= 100),
    comentarios TEXT,
    recomendacion VARCHAR(50),
    
    -- Metadatos
    catador VARCHAR(255),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_muestras_estado ON public.muestras(estado);
CREATE INDEX IF NOT EXISTS idx_muestras_tipo ON public.muestras(tipo);
CREATE INDEX IF NOT EXISTS idx_muestras_user_id ON public.muestras(user_id);

CREATE INDEX IF NOT EXISTS idx_tandas_fecha ON public.tandas(fecha);
CREATE INDEX IF NOT EXISTS idx_tandas_estado ON public.tandas(estado);
CREATE INDEX IF NOT EXISTS idx_tandas_user_id ON public.tandas(user_id);

CREATE INDEX IF NOT EXISTS idx_catas_muestra_id ON public.catas(muestra_id);
CREATE INDEX IF NOT EXISTS idx_catas_tanda_id ON public.catas(tanda_id);
CREATE INDEX IF NOT EXISTS idx_catas_user_id ON public.catas(user_id);

CREATE INDEX IF NOT EXISTS idx_catas_espirituosos_muestra_id ON public.catas_espirituosos(muestra_id);
CREATE INDEX IF NOT EXISTS idx_catas_espirituosos_tanda_id ON public.catas_espirituosos(tanda_id);
CREATE INDEX IF NOT EXISTS idx_catas_espirituosos_user_id ON public.catas_espirituosos(user_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.muestras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tandas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catas_espirituosos ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad - Los usuarios solo pueden ver y modificar sus propios datos
CREATE POLICY "Users can view their own muestras" ON public.muestras
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own muestras" ON public.muestras
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own muestras" ON public.muestras
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own muestras" ON public.muestras
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para tandas
CREATE POLICY "Users can view their own tandas" ON public.tandas
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tandas" ON public.tandas
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tandas" ON public.tandas
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tandas" ON public.tandas
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para catas
CREATE POLICY "Users can view their own catas" ON public.catas
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own catas" ON public.catas
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own catas" ON public.catas
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own catas" ON public.catas
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para catas_espirituosos
CREATE POLICY "Users can view their own catas_espirituosos" ON public.catas_espirituosos
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own catas_espirituosos" ON public.catas_espirituosos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own catas_espirituosos" ON public.catas_espirituosos
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own catas_espirituosos" ON public.catas_espirituosos
    FOR DELETE USING (auth.uid() = user_id);

-- Funciones para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER handle_updated_at_muestras
    BEFORE UPDATE ON public.muestras
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_tandas
    BEFORE UPDATE ON public.tandas
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_catas
    BEFORE UPDATE ON public.catas
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_catas_espirituosos
    BEFORE UPDATE ON public.catas_espirituosos
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();