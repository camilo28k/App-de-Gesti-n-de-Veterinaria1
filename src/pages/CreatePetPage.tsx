// src/pages/CreatePetPage.tsx (NUEVO ARCHIVO)

import React, { useState } from 'react';
import { 
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, 
    IonBackButton, IonList, IonItem, IonLabel, IonInput, IonSelect, 
    IonSelectOption, IonButton, useIonToast 
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { addPet, Pet } from '../service/Pet.service';

// Tipo de borrador de Pet (sin 'id')
type PetDraft = Omit<Pet, 'id'>;

const initialPetState: PetDraft = {
    name: '',
    species: 'Perro',
    breed: '',
    ownerId: '123456', // Usar un ID de propietario simulado por ahora
    photoUrl: undefined,
};

const CreatePetPage: React.FC = () => {
    const [formData, setFormData] = useState<PetDraft>(initialPetState);
    const history = useHistory();
    const [presentToast] = useIonToast();

    const handleChange = (name: keyof PetDraft, value: string | undefined | null) => {
        if (value !== null && value !== undefined) {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.name && formData.species && formData.breed) {
            try {
                addPet(formData);
                presentToast({
                    message: `Mascota ${formData.name} creada exitosamente!`,
                    duration: 2000,
                    color: 'success',
                });
                
                // Redirigir a la lista de mascotas
                history.push('/pets/list'); 
            } catch (error) {
                presentToast({
                    message: 'Error al guardar la mascota.',
                    duration: 2000,
                    color: 'danger',
                });
            }
        } else {
            presentToast({
                message: 'Por favor, rellena todos los campos requeridos.',
                duration: 2000,
                color: 'warning',
            });
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        {/* El botón de retroceso nos llevará automáticamente a /pets/list */}
                        <IonBackButton defaultHref="/pets/list" />
                    </IonButtons>
                    <IonTitle>Crear Nueva Mascota</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                <form onSubmit={handleSubmit}>
                    <IonList>
                        {/* Nombre */}
                        <IonItem>
                            <IonLabel position="stacked">Nombre</IonLabel>
                            <IonInput 
                                type="text" 
                                value={formData.name} 
                                onIonChange={(e) => handleChange('name', e.detail.value)} 
                                placeholder="Nombre de la mascota" 
                                required 
                            />
                        </IonItem>

                        {/* Especie */}
                        <IonItem>
                            <IonLabel position="stacked">Especie</IonLabel>
                            <IonSelect 
                                value={formData.species} 
                                onIonChange={(e) => handleChange('species', e.detail.value)} 
                                placeholder="Seleccione la especie" 
                                required
                            >
                                <IonSelectOption value="Perro">Perro</IonSelectOption>
                                <IonSelectOption value="Gato">Gato</IonSelectOption>
                                <IonSelectOption value="Pez">Pez</IonSelectOption>
                                <IonSelectOption value="Ave">Ave</IonSelectOption>
                                <IonSelectOption value="Otro">Otro</IonSelectOption>
                            </IonSelect>
                        </IonItem>

                        {/* Raza */}
                        <IonItem>
                            <IonLabel position="stacked">Raza</IonLabel>
                            <IonInput 
                                type="text" 
                                value={formData.breed} 
                                onIonChange={(e) => handleChange('breed', e.detail.value)} 
                                placeholder="Raza de la mascota" 
                                required 
                            />
                        </IonItem>

                        {/* OwnerID (oculto/simulado por ahora) */}
                        <IonItem style={{ display: 'none' }}>
                            <IonLabel>Propietario ID</IonLabel>
                            <IonInput value={formData.ownerId} disabled />
                        </IonItem>
                        
                        {/* Nota: Aquí podrías añadir el campo de PhotoUrl si lo necesitas */}
                        
                    </IonList>
                    
                    <div className="ion-padding-top">
                        <IonButton expand="block" type="submit" color="success">
                            Guardar Mascota
                        </IonButton>
                    </div>
                </form>
            </IonContent>
        </IonPage>
    );
};

export default CreatePetPage;