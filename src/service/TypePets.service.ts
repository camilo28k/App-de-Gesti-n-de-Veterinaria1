// src/service/Pet.service.ts

// Definición de la interfaz Pet
export interface Pet {
    id: string;
    name: string;
    species: string; // Especie (ej: Perro, Gato)
    breed: string; // Raza (ej: Pitbull, Siamés)
    ownerId: string; // ID del propietario (Usuario)
    photoUrl?: string; // URL de la foto
    // Puedes añadir más campos aquí, como birthDate, weight, etc.
}

const STORAGE_KEY = 'pets';

// Función para obtener todas las mascotas del Local Storage
export const getPets = (): Pet[] => {
    try {
        const storedPets = localStorage.getItem(STORAGE_KEY);
        // Devuelve el array de mascotas o un array vacío si no hay nada
        return storedPets ? JSON.parse(storedPets) : []; 
    } catch (e) {
        console.error("Error al obtener mascotas del storage", e);
        return [];
    }
};

// Función para obtener una mascota por ID
export const getPetById = (id: string): Pet | undefined => {
    const pets = getPets();
    return pets.find(pet => pet.id === id);
};

// Función para crear una nueva mascota
export const createPet = (newPetData: Omit<Pet, 'id'>) => {
    const pets = getPets();
    const newPet: Pet = {
        id: Date.now().toString(), // Generar un ID simple
        ...newPetData
    };
    pets.push(newPet);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pets));
};

// Función para actualizar una mascota existente
export const updatePet = (updatedPet: Pet) => {
    let pets = getPets();
    const index = pets.findIndex(pet => pet.id === updatedPet.id);
    if (index !== -1) {
        pets[index] = updatedPet;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pets));
    } else {
        console.error("Mascota no encontrada para actualizar:", updatedPet.id);
    }
};

// Función para eliminar una mascota
export const deletePet = (id: string) => {
    let pets = getPets();
    pets = pets.filter(pet => pet.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pets));
};