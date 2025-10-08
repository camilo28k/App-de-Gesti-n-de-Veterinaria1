// src/pages/PetDetailPage.tsx

import React, { useState } from 'react';
import { 
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
    IonIcon, IonButtons, IonBackButton, IonList, IonItem, IonLabel, 
    IonNote, useIonViewWillEnter, IonSpinner
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import { create, paw, man, calendarOutline, heartOutline } from 'ionicons/icons';
import { getPetById, Pet } from '../service/Pet.service';

interface RouteParams {
  id: string;
}

const PetDetailPage: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const history = useHistory();
    
    const [pet, setPet] = useState<Pet | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadPet = () => {
        setIsLoading(true);
        const foundPet = getPetById(id);
        setPet(foundPet || null);
        setIsLoading(false);
    };

    useIonViewWillEnter(() => {
        loadPet();
    });

    // Función para navegar al formulario de edición
    const handleEdit = () => {
        history.push(`/pets/edit/${id}`); 
    };

    if (isLoading) {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton defaultHref="/pets/list" />
                        </IonButtons>
                        <IonTitle>Cargando Detalles...</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen className="ion-padding ion-text-center">
                    <div className="ion-padding-top">
                        <IonSpinner name="crescent" />
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    if (!pet) {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton defaultHref="/pets/list" />
                        </IonButtons>
                        <IonTitle>Mascota No Encontrada</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen className="ion-padding ion-text-center">
                    <p>La mascota con ID "{id}" no existe.</p>
                </IonContent>
            </IonPage>
        );
    }
    
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/pets/list" />
                    </IonButtons>
                    <IonTitle>Detalles de {pet.name}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                
                {/* Cabecera del perfil de la mascota */}
                <div className="profile-header ion-padding ion-text-center">
                    <img 
                        src={pet.photoUrl || `https://i.pravatar.cc/150?img=10&u=${pet.id}`} 
                        alt={pet.name} 
                        className="profile-avatar"
                        style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', margin: '10px auto' }}
                    />
                    <h2>{pet.name}</h2>
                    <p className="ion-text-muted">{pet.species}</p>
                    <IonNote className="role-tag ion-margin-end">{pet.breed}</IonNote>
                </div>

                {/* Lista de Información de la Mascota */}
                <h3 className="ion-padding-horizontal ion-padding-top">Detalles</h3>
                <IonList lines="full" className="ion-no-margin">
                    
                    <IonItem>
                        <IonIcon icon={paw} slot="start" />
                        <IonLabel>Especie</IonLabel>
                        <IonNote slot="end">{pet.species}</IonNote>
                    </IonItem>
                    
                    <IonItem>
                        <IonIcon icon={heartOutline} slot="start" />
                        <IonLabel>Raza</IonLabel>
                        <IonNote slot="end">{pet.breed}</IonNote>
                    </IonItem>
                    
                    <IonItem>
                        <IonIcon icon={man} slot="start" />
                        <IonLabel>ID del Propietario</IonLabel>
                        <IonNote slot="end">{pet.ownerId}</IonNote>
                    </IonItem>
                    
                    <IonItem>
                        <IonIcon icon={calendarOutline} slot="start" />
                        <IonLabel>ID de Registro</IonLabel>
                        <IonNote slot="end">{id}</IonNote> 
                    </IonItem>
                    
                </IonList>

                {/* Botón de Edición (Navega a /pets/edit/:id) */}
                <div className="ion-padding">
                    <IonButton expand="block" color="warning" onClick={handleEdit}>
                        <IonIcon slot="start" icon={create} />
                        EDITAR MASCOTA
                    </IonButton>
                </div>
                
            </IonContent>
        </IonPage>
    );
};

export default PetDetailPage;