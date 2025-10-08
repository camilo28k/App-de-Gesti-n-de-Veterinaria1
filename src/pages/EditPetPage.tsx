// src/pages/EditPetPage.tsx

import React, { useState } from 'react';
import { 
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, 
    IonBackButton, IonList, IonItem, IonLabel, IonInput, IonSelect, 
    IonSelectOption, IonButton, useIonToast, useIonViewWillEnter, IonSpinner 
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import { getPets, savePets, getPetById, Pet } from '../service/Pet.service';

interface RouteParams {
    id: string;
}

const EditPetPage: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const history = useHistory();
    const [presentToast] = useIonToast();
    
    const [formData, setFormData] = useState<Pet | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadPetData = () => {
        const petToEdit = getPetById(id);
        if (petToEdit) {
            setFormData(petToEdit);
        }
        setIsLoading(false);
    };

    useIonViewWillEnter(() => {
        loadPetData();
    });

    const handleChange = (name: keyof Pet, value: string | undefined | null) => {
        if (value !== null && value !== undefined && formData) {
            setFormData((prevData) => ({
                ...(prevData as Pet),
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData || !formData.name || !formData.species || !formData.breed) {
            presentToast({ message: 'Por favor, rellena todos los campos requeridos.', duration: 2000, color: 'warning' });
            return;
        }

        try {
            const allPets = getPets();
            const petIndex = allPets.findIndex(p => p.id === id);

            if (petIndex !== -1) {
                // Actualizar la mascota en la lista
                allPets[petIndex] = formData;
                savePets(allPets);
                
                presentToast({ message: `Mascota ${formData.name} actualizada exitosamente.`, duration: 2000, color: 'success' });
                history.push(`/pets/details/${id}`); // Volver a los detalles
            } else {
                presentToast({ message: 'Error: Mascota no encontrada.', duration: 2000, color: 'danger' });
            }
        } catch (error) {
            presentToast({ message: 'Error al actualizar la mascota.', duration: 2000, color: 'danger' });
        }
    };

    if (isLoading) {
        return (
            <IonPage>
                <IonHeader><IonToolbar><IonTitle>Cargando...</IonTitle></IonToolbar></IonHeader>
                <IonContent className="ion-padding ion-text-center"><IonSpinner /></IonContent>
            </IonPage>
        );
    }
    
    if (!formData) {
        return (
            <IonPage>
                <IonHeader><IonToolbar><IonTitle>Error</IonTitle></IonToolbar></IonHeader>
                <IonContent className="ion-padding">Mascota con ID "{id}" no encontrada.</IonContent>
            </IonPage>
        );
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref={`/pets/details/${id}`} /> 
                    </IonButtons>
                    <IonTitle>Editar Mascota: {formData.name}</IonTitle>
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
                                required 
                            />
                        </IonItem>

                        {/* Especie */}
                        <IonItem>
                            <IonLabel position="stacked">Especie</IonLabel>
                            <IonSelect 
                                value={formData.species} 
                                onIonChange={(e) => handleChange('species', e.detail.value)} 
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
                                required 
                            />
                        </IonItem>
                        
                        {/* OwnerID (Inmutable) */}
                        <IonItem>
                            <IonLabel>ID Propietario</IonLabel>
                            <IonInput value={formData.ownerId} disabled />
                        </IonItem>
                        
                    </IonList>
                    
                    <div className="ion-padding-top">
                        <IonButton expand="block" type="submit" color="warning">
                            GUARDAR CAMBIOS
                        </IonButton>
                    </div>
                </form>
            </IonContent>
        </IonPage>
    );
};

export default EditPetPage;