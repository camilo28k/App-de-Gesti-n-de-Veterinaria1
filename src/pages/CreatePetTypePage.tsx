// src/pages/CreatePetTypePage.tsx

import React, { useState } from 'react';
import { 
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonButtons, IonBackButton, IonButton, IonIcon, IonItem, 
    IonLabel, IonInput, IonList, IonToast, IonSpinner, IonSelect, IonSelectOption
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { checkmark } from 'ionicons/icons'; 
import { createPetType } from '../service/PetType.service'; 

// Lista de iconos sugeridos de Ionic
const ICON_OPTIONS = [
    { name: 'Pez', icon: 'fish' },
    { name: 'Pata (General)', icon: 'paw' },
    { name: 'Perro', icon: 'dog' },
    { name: 'Gato', icon: 'cat' },
    { name: 'Pájaro', icon: 'bird' },
    { name: 'Ratón', icon: 'mouse' },
    { name: 'Tortuga', icon: 'bug' },
];

const CreatePetTypePage: React.FC = () => {
    const history = useHistory();
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('paw'); 
    const [showToast, setShowToast] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name.trim()) {
            alert('El nombre del tipo es obligatorio.');
            return;
        }

        setIsSaving(true);
        
        try {
            // Llama al servicio para guardar
            createPetType({ 
                name: name.trim(), 
                icon: icon,
            });
            
            setShowToast(true);
            
            // Redireccionar a la lista de tipos después de la creación
            setTimeout(() => {
                history.replace('/pets/types');
            }, 1000);

        } catch (error) {
            console.error('Error al crear el tipo de mascota:', error);
            alert('Hubo un error al guardar el tipo de mascota.');
            setIsSaving(false);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/pets/types" /> 
                    </IonButtons>
                    <IonTitle>Crear Tipo de Mascota</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                
                <form onSubmit={handleCreate}>
                    <IonList lines="full">
                        
                        {/* Campo Nombre */}
                        <IonItem>
                            <IonLabel position="stacked">Nombre del Tipo <span style={{ color: 'red' }}>*</span></IonLabel>
                            <IonInput value={name} placeholder="Ej: Perro, Gato, Ave" onIonChange={(e) => setName(e.detail.value!)} required/>
                        </IonItem>

                        {/* Selector de Ícono */}
                        <IonItem>
                            <IonLabel position="stacked">Icono Representativo</IonLabel>
                            <IonSelect 
                                value={icon} 
                                placeholder="Seleccionar Icono" 
                                onIonChange={(e) => setIcon(e.detail.value)} 
                                required
                            >
                                {ICON_OPTIONS.map(option => (
                                    <IonSelectOption key={option.icon} value={option.icon}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <IonIcon icon={option.icon} slot="start" style={{ marginRight: '10px' }} />
                                            {option.name}
                                        </div>
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonItem>
                        
                    </IonList>

                    <div className="ion-padding">
                        <IonButton 
                            expand="block" 
                            type="submit" 
                            color="success" 
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <IonSpinner name="dots" />
                                    <span className="ion-padding-start">Guardando...</span>
                                </>
                            ) : (
                                <>
                                    <IonIcon slot="start" icon={checkmark} />
                                    Guardar Tipo
                                </>
                            )}
                        </IonButton>
                    </div>
                </form>

                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message="¡Tipo de mascota creado con éxito!"
                    duration={1000}
                    color="success"
                />
            </IonContent>
        </IonPage>
    );
};

export default CreatePetTypePage;