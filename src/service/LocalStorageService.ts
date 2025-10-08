// src/service/LocalStorageService.ts

const STORAGE_KEY = 'vetAppUsers';

// Interfaz User (Centralizada aquí)
export interface User {
  id: string; // Único y obligatorio
  name: string;
  email: string;
  role: string;
  password: string; 
  status: 'Activo' | 'Inactivo';
  photoUrl?: string; // Opcional
}

// -----------------------------------------------------
// LECTURA
// -----------------------------------------------------

/**
 * Recupera la lista de usuarios desde LocalStorage.
 * Asegura que siempre devuelve un array de User (vacío si no hay datos).
 */
export const getUsers = (): User[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    // Intenta parsear los datos. Si no hay datos, devuelve un array vacío.
    return data ? (JSON.parse(data) as User[]) : [];
  } catch (e) {
    console.error("Error al leer LocalStorage:", e);
    return [];
  }
};

/**
 * Busca un usuario por su ID.
 */
export const getUserById = (id: string): User | undefined => {
  const users = getUsers();
  // Busca el primer usuario cuyo ID coincida
  return users.find(user => user.id === id); 
};

// -----------------------------------------------------
// ESCRITURA
// -----------------------------------------------------

/**
 * Guarda la lista completa de usuarios en LocalStorage.
 */
export const saveUsers = (users: User[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Error al escribir en LocalStorage:", e);
  }
};

/**
 * Añade un nuevo usuario con un ID único.
 */
export const addUser = (newUserDraft: Omit<User, 'id'>): void => {
  const users = getUsers();
  
  // Genera un ID único (ej: timestamp)
  const newUser: User = {
    ...newUserDraft,
    id: Date.now().toString(), 
  };
  
  users.push(newUser);
  saveUsers(users);
};

/**
 * Actualiza un usuario existente por su ID.
 */
export const updateUser = (updatedUser: User): void => {
  const users = getUsers();
  const index = users.findIndex(user => user.id === updatedUser.id);

  if (index !== -1) {
    // Reemplaza el usuario en la posición encontrada
    users[index] = updatedUser; 
    saveUsers(users);
  } else {
    console.warn(`Usuario con ID ${updatedUser.id} no encontrado para actualizar.`);
  }
};