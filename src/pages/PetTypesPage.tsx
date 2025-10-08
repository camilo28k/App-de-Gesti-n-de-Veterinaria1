// src/pages/PetTypesPage.tsx

import React, { useState } from 'react';
import { 
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonButtons, IonBackButton, IonButton, IonIcon, IonList, 
    useIonViewWillEnter, IonSpinner
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { add } from 'ionicons/icons'; 
import { getPetTypes, PetType } from '../service/PetType.service'; 

// Importa tu CardComponent genérico
import { CardComponent } from '../components/Card.component'; 

const PetTypesPage: React.FC = () => {
    const history = useHistory();
    const [petTypes, setPetTypes] = useState<PetType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const loadPetTypes = () => {
        setIsLoading(true);
        console.log("Cargando tipos de mascota desde el servicio...");
        try {
            const types = getPetTypes();
            setPetTypes(types);
        } catch (error) {
            console.error("Error al cargar tipos de mascota:", error);
            setPetTypes([]);
        } finally {
            setIsLoading(false);
        }
    };

    useIonViewWillEnter(() => {
        loadPetTypes();
    });

    // 🛑 CLAVE: Navega a la ruta de edición usando el ID del tipo
    const handleEditType = (id: string) => {
        console.log(`Navegando a edición del tipo: /pets/types/edit/${id}`);
        history.push(`/pets/types/edit/${id}`);
    }
    
    const handleCreateType = () => {
        history.push(`/pets/types/create`);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/pets/list" /> 
                    </IonButtons>
                    <IonTitle>Tipos de Mascotas</IonTitle>
                    <IonButtons slot="end">
                        <IonButton color="success" onClick={handleCreateType}>
                            <IonIcon slot="start" icon={add} />
                            Crear Tipo
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            
            <IonContent fullscreen className="ion-padding">
                
                {isLoading && (
                    <div className="ion-text-center ion-padding">
                        <IonSpinner name="dots" color="success" />
                        <p>Cargando tipos de mascotas...</p>
                    </div>
                )}
                
                {!isLoading && (
                    <IonList lines="none">
                        {petTypes.map((type) => (
                            <CardComponent 
                                key={type.id}
                                itemId={type.id}
                                title={type.name}
                                // Muestra el ID para debug si es necesario
                                subtitle={`Icono: ${type.icon}`} 
                                // Usamos un placeholder
                                imageUrl={`https://i.pravatar.cc/150?img=1&u=${type.id}`} 
                                
                                // Ambas acciones apuntan a editar
                                onDetailsClick={() => handleEditType(type.id)} 
                                onEditClick={() => handleEditType(type.id)} 
                                
                                showDetailsButton={false} 
                                showEditButton={true} 
                            />
                        ))}
                    </IonList>
                )}

                {!isLoading && petTypes.length === 0 && (
                    <p className="ion-padding ion-text-center">No hay tipos de mascotas registrados. ¡Crea uno!</p>
                )}
            </IonContent>
        </IonPage>
    );
};

export default PetTypesPage;