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
        const currentUser = getUserById(id);
        if (currentUser) {
            setUser(currentUser);
        } else {
            presentAlert({
                header: 'Error',
                message: `Usuario con ID ${id} no encontrado.`,
                buttons: [{ text: 'OK', handler: () => history.replace('/list') }],
            });
        }
        setLoading(false);
    }, [id, history, presentAlert]);

    const handleSaveUser = (formData: Omit<User, 'id'>) => {
        if (!user) return; 

        const updatedUser: User = {
            ...user, 
            ...formData, 
            id: user.id, 
        };

        // Lógica para mantener la contraseña original si no fue modificada
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

    if (loading || !user) {
        return <IonLoading isOpen={true} message="Cargando usuario..." />;
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start"><IonBackButton defaultHref="/list" /></IonButtons>
                    <IonTitle>Editar Usuario</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                <FormComponent 
                    onSaveUser={handleSaveUser} 
                    initialData={user} 
                    submitButtonText="Guardar Cambios" 
                    isEditing={true} 
                />
            </IonContent>
        </IonPage>
    );
};

export default EditPage;