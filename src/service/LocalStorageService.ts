// src/service/LocalStorageService.ts

const STORAGE_KEY = 'vetAppUsers';

// Interfaz User (Centralizada aquí)
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  password: string; 
  status: 'Activo' | 'Inactivo';
  photoUrl?: string; 
}

/**
 * Recupera la lista de usuarios desde LocalStorage.
 */
export const getUsers = (): User[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? (JSON.parse(data) as User[]) : [];
  } catch (e) {
    console.error("Error al leer LocalStorage:", e);
    return [];
  }
};

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
  
  const newUser: User = {
    ...newUserDraft,
    id: Date.now().toString(), 
  };
  
  users.push(newUser);
  saveUsers(users);
};

/**
 * Busca un usuario por su ID.
 */
export const getUserById = (id: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

/**
 * Actualiza un usuario existente por su ID.
 */
export const updateUser = (updatedUser: User): void => {
  const users = getUsers();
  const index = users.findIndex(user => user.id === updatedUser.id);

  if (index !== -1) {
    users[index] = updatedUser; 
    saveUsers(users);
  } else {
    console.warn(`Usuario con ID ${updatedUser.id} no encontrado para actualizar.`);
  }
};