// src/service/PetType.service.ts

export interface PetType {
    id: string;
    name: string;
    icon: string;
}

const PET_TYPES_STORAGE_KEY = 'pet_types_data';

const initialPetTypes: PetType[] = [
    { id: 't1', name: 'Perro', icon: 'dog' },
    { id: 't2', name: 'Gato', icon: 'cat' },
    // ... más tipos iniciales
];

// --- FUNCIONES DE PERSISTENCIA ---

export const savePetTypes = (types: PetType[]) => {
    localStorage.setItem(PET_TYPES_STORAGE_KEY, JSON.stringify(types));
};

export const getPetTypes = (): PetType[] => {
    const data = localStorage.getItem(PET_TYPES_STORAGE_KEY);
    if (data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error("Error parsing pet types data from localStorage:", e);
            savePetTypes(initialPetTypes);
            return initialPetTypes;
        }
    }
    
    savePetTypes(initialPetTypes);
    return initialPetTypes;
};

// --- FUNCIONES CRUD ESPECÍFICAS ---

/**
 * Obtiene un tipo de mascota por su ID.
 * 🛑 Importante: El ID es un string.
 */
export const getPetTypeById = (id: string): PetType | undefined => {
    const types = getPetTypes();
    // Usa comparación estricta (===)
    return types.find(type => type.id === id); 
};

/**
 * Crea un nuevo tipo de mascota.
 */
export const createPetType = (newTypeData: { name: string, icon: string }): PetType => {
    const types = getPetTypes();
    
    const newType: PetType = {
        // 🛑 CLAVE: Genera un ID único como string
        id: Date.now().toString(), 
        name: newTypeData.name,
        icon: newTypeData.icon,
    };
    
    types.push(newType);
    savePetTypes(types);
    return newType;
};

/**
 * Actualiza un tipo de mascota existente.
 */
export const updatePetType = (updatedType: PetType): void => {
    let types = getPetTypes();
    // 🛑 CLAVE: Encuentra el índice exacto por ID
    const index = types.findIndex(type => type.id === updatedType.id);
    
    if (index === -1) {
        throw new Error(`Tipo de Mascota con ID ${updatedType.id} no encontrado para actualizar.`);
    }
    
    types[index] = updatedType;
    savePetTypes(types);
};

/**
 * Elimina un tipo de mascota por su ID.
 */
export const deletePetType = (id: string): void => {
    let types = getPetTypes();
    const initialLength = types.length;
    
    types = types.filter(type => type.id !== id);
    
    if (types.length === initialLength) {
        throw new Error(`Tipo de Mascota con ID ${id} no encontrado para eliminar.`);
    }
    
    savePetTypes(types);
};