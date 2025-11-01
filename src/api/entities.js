// Importar desde Supabase en lugar de Base44
import { 
  Muestra, 
  Tanda, 
  Cata, 
  CataEspirituoso 
} from './supabaseEntities';

// Usar sistema de usuarios personalizado
import { UsuarioCustom as User } from './usuarioCustom';

export { Muestra, Tanda, Cata, CataEspirituoso, User };