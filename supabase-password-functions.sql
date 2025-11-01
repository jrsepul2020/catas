-- Función SQL para verificar contraseñas con crypt() en Supabase
-- Ejecuta esto en el SQL Editor de Supabase si tu tabla usa hashes crypt

CREATE OR REPLACE FUNCTION verify_password(input_password text, stored_hash text)
RETURNS boolean AS $$
BEGIN
  -- Verificar si el hash almacenado es válido
  IF stored_hash IS NULL OR stored_hash = '' THEN
    RETURN FALSE;
  END IF;
  
  -- Verificar contraseña usando crypt
  RETURN stored_hash = crypt(input_password, stored_hash);
EXCEPTION
  WHEN OTHERS THEN
    -- En caso de error, retornar false
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función adicional para hash de contraseña (para registro de nuevos usuarios)
CREATE OR REPLACE FUNCTION hash_password(input_password text)
RETURNS text AS $$
BEGIN
  -- Generar hash SHA-512 con salt aleatorio
  RETURN crypt(input_password, gen_salt('bf', 8));
EXCEPTION
  WHEN OTHERS THEN
    -- En caso de error, usar MD5 como fallback
    RETURN crypt(input_password, gen_salt('md5'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Conceder permisos de ejecución a usuarios autenticados
GRANT EXECUTE ON FUNCTION verify_password(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION hash_password(text) TO authenticated;