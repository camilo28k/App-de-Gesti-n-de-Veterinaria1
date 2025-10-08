// src/service/Pet.service.ts (NUEVO ARCHIVO)

const STORAGE_KEY_PETS = 'vetAppPets';

// Interfaz Pet
export interface Pet {
  id: string; 
  name: string;
  species: 'Perro' | 'Gato' | 'Pez' | 'Ave' | 'Otro';
  breed: string;
  ownerId: string; // ID del usuario/propietario
  photoUrl?: string; // Opcional
}

/**
 * Recupera la lista de mascotas desde LocalStorage.
 */
export const getPets = (): Pet[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_PETS);
    return data ? (JSON.parse(data) as Pet[]) : [];
  } catch (e) {
    console.error("Error al leer LocalStorage (Pets):", e);
    return [];
  }
};

/**
 * Guarda la lista completa de mascotas en LocalStorage.
 */
export const savePets = (pets: Pet[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_PETS, JSON.stringify(pets));
  } catch (e) {
    console.error("Error al escribir en LocalStorage (Pets):", e);
  }
};

/**
 * Añade una nueva mascota con un ID único.
 */
export const addPet = (newPetDraft: Omit<Pet, 'id'>): void => {
  const pets = getPets();
  
  const newPet: Pet = {
    ...newPetDraft,
    id: Date.now().toString(), 
  };
  
  pets.push(newPet);
  savePets(pets);
};

/**
 * Busca una mascota por su ID.
 */
export const getPetById = (id: string): Pet | undefined => {
  const pets = getPets();
  return pets.find(pet => pet.id === id);
};