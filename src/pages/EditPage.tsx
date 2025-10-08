// src/pages/EditPage.tsx

import React, { useState, useEffect } from 'react';
import { 
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLoading, 
    IonBackButton, IonButtons, useIonAlert 
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import { FormComponent } from '../components/Form.component'; 
import { getUserById, updateUser, User } from '../service/LocalStorageService'; 

interface RouteParams {
    id: string;
}

const EditPage: React.FC = () => {
    const { id } = useParams<RouteParams>(); 
    const history = useHistory();
    const [presentAlert] = useIonAlert();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true); 
        
        if (id) {
            const currentUser = getUserById(id);
            if (currentUser) {
                setUser(currentUser); 
            } else {
                setUser(null); 
                // Si el usuario no existe, redirigimos después de la alerta.
                presentAlert({
                    header: 'Error',
                    message: `Usuario con ID ${id} no encontrado.`,
                    buttons: [{ text: 'OK', handler: () => history.replace('/list') }],
                });
            }
        }
        
        // 🛑 CRÍTICO: Asegura que el estado de carga termine inmediatamente
        setLoading(false); 
        
    }, [id, history, presentAlert]); 
    
    // La función handleSaveUser se mantiene igual y es correcta.
    const handleSaveUser = (formData: Omit<User, 'id'>) => {
        if (!user) return; 

        const updatedUser: User = {
            ...user, 
            ...formData, 
            id: user.id, 
        };

        if (!('password' in formData) && user.password) {
            updatedUser.password = user.password;
        }

        updateUser(updatedUser); 
        
        presentAlert({
            header: 'Éxito',
            message: `Usuario ${updatedUser.name} actualizado.`,
            buttons: [{ text: 'OK', handler: () => history.push('/list') }],
        });
    };

    // --- LÓGICA DE RENDERIZADO MEJORADA ---

    // 🛑 1. Muestra el IonLoading en formato OVERLAY
    // Esto es el equivalente a la imagen que muestra el spinner sobre el contenido
    return (
        <IonPage>
            {/* IonLoading como Overlay. Se abre si loading=true Y user=null, O si el loading sigue activo */}
            <IonLoading 
                isOpen={loading || (!user && !loading)} 
                message="Cargando usuario..." 
                spinner="crescent" 
            /> 
            
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start"><IonBackButton defaultHref="/list" /></IonButtons>
                    <IonTitle>Editar Usuario</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                
                {/* 🛑 2. Muestra el Formulario SÓLO si el usuario está cargado (user !== null) */}
                {!loading && user && (
                    <FormComponent 
                        onSaveUser={handleSaveUser} 
                        initialData={user} 
                        submitButtonText="Guardar Cambios" 
                        isEditing={true} 
                    />
                )}
                
                {/* 3. Muestra un mensaje si la carga terminó pero el usuario es nulo. */}
                {!loading && !user && <p className="ion-text-center">Error al cargar el usuario. Volviendo a la lista...</p>}

            </IonContent>
        </IonPage>
    );
};

export default EditPage;