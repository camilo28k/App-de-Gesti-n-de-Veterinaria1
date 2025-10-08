// src/pages/EditTypePage.tsx

import React, { useState, useEffect } from 'react';
import { 
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonButtons, IonBackButton, IonButton, IonIcon, IonItem, 
    IonLabel, IonInput, IonList, IonToast, IonSpinner, IonAlert
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import { checkmark, trash } from 'ionicons/icons'; 
import { 
    getPetTypeById, 
    updatePetType, 
    deletePetType, 
    PetType 
} from '../service/PetType.service'; 

// Interfaz para los parámetros de la URL
interface EditTypeRouteParams {
    id: string;
}

const EditTypePage: React.FC = () => {
    const history = useHistory();
    // 🛑 CLAVE: Obtiene el ID como string desde la URL
    const { id: typeId } = useParams<EditTypeRouteParams>(); 
    
    const [petType, setPetType] = useState<PetType | null>(null);
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('');
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    // 1. Cargar los datos del tipo al entrar
    useEffect(() => {
        const loadType = () => {
            console.log("Cargando datos para edición, ID:", typeId); // 🛑 Debug
            const storedType = getPetTypeById(typeId);
            
            if (storedType) {
                setPetType(storedType);
                setName(storedType.name);
                setIcon(storedType.icon || '');
            } else {
                console.error(`Tipo de Mascota con ID ${typeId} NO encontrado en el storage. Redirigiendo.`);
                // Si no lo encuentra, redirige. Este es el síntoma de tu problema.
                history.replace('/pets/types');
            }
            setIsLoading(false);
        };
        // Siempre llamamos a loadType para evitar errores de renderizado.
        if (typeId) {
            loadType();
        }
    }, [typeId, history]); 

    // 2. Manejar la actualización
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name.trim() || !petType) return;

        setIsSaving(true);
        
        try {
            const updatedType: PetType = { 
                ...petType,
                name: name.trim(), 
                icon: icon.trim() || petType.icon
            };
            
            updatePetType(updatedType); // 🛑 Llama a la función de actualización del servicio
            
            setShowToast(true);
            
            setTimeout(() => {
                history.replace('/pets/types');
            }, 1000);

        } catch (error) {
            console.error('Error al actualizar el tipo de mascota:', error);
            alert('Hubo un error al guardar los cambios.');
            setIsSaving(false);
        }
    };

    // 3. Manejar la eliminación (se mantiene igual, asume que el servicio funciona)
    const handleDelete = () => {
        if (!petType) return;
        
        setIsSaving(true);
        try {
            deletePetType(petType.id); 
            setShowToast(true);
            
            setTimeout(() => {
                history.replace('/pets/types');
            }, 500);
            
        } catch (error) {
            console.error('Error al eliminar el tipo de mascota:', error);
            alert('Hubo un error al eliminar el tipo.');
            setIsSaving(false);
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
    
    // Si no se encuentra el tipo, se redirecciona, así que si llegamos aquí, petType existe
    if (!petType) return null; 

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/pets/types" /> 
                    </IonButtons>
                    <IonTitle>Editar: {petType.name}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton color="danger" onClick={() => setShowDeleteAlert(true)} disabled={isSaving}>
                            <IonIcon slot="icon-only" icon={trash} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                
                <form onSubmit={handleUpdate}>
                    {/* ... Controles de formulario (IonInput, IonLabel, etc.) ... */}
                    <IonList lines="full">
                        <IonItem>
                            <IonLabel position="stacked">Nombre</IonLabel>
                            <IonInput value={name} onIonChange={(e) => setName(e.detail.value!)} required/>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Icono (Ej: paw)</IonLabel>
                            <IonInput value={icon} onIonChange={(e) => setIcon(e.detail.value!)} />
                        </IonItem>
                    </IonList>

                    <div className="ion-padding">
                        <IonButton expand="block" type="submit" color="success" disabled={isSaving}>
                            {isSaving ? (<><IonSpinner name="dots" /><span className="ion-padding-start">Guardando...</span></>) : 
                            (<><IonIcon slot="start" icon={checkmark} />Actualizar Tipo</>)}
                        </IonButton>
                    </div>
                </form>

                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message="Tipo de Mascota actualizado/eliminado con éxito."
                    duration={1500}
                    color="success"
                />

                <IonAlert
                    isOpen={showDeleteAlert}
                    onDidDismiss={() => setShowDeleteAlert(false)}
                    header={'Confirmar Eliminación'}
                    message={'¿Está seguro que desea eliminar este tipo de mascota?'}
                    buttons={['Cancelar', { text: 'Eliminar', handler: handleDelete, cssClass: 'danger' }]}
                />
            </IonContent>
        </IonPage>
    );
};

export default EditTypePage;