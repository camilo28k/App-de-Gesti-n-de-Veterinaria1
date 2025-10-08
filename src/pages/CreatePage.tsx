// src/pages/CreatePage.tsx

import React from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, IonTitle, IonBackButton, IonButtons } from '@ionic/react';
import { useHistory } from 'react-router-dom'; 
import { FormComponent } from '../components/Form.component';
import { addUser, User } from '../service/LocalStorageService'; 

const CreatePage: React.FC = () => {
    const history = useHistory(); 

    const handleSaveUser = (newUser: Omit<User, 'id'>) => {
        addUser(newUser); 
        
        // La alerta del formulario debe ser reemplazada por IonToast en una app real
        alert(`✅ Usuario ${newUser.name} creado.`); 
        
        history.push('/list'); 
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/list" />
                    </IonButtons>
                    <IonTitle>Crear Usuario</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                <FormComponent onSaveUser={handleSaveUser} />
            </IonContent>
        </IonPage>
    );
};

export default CreatePage;