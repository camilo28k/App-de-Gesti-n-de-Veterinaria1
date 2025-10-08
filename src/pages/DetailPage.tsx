// src/pages/DetailPage.tsx (NUEVO ARCHIVO)

import React, { useState } from 'react';
import { 
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
    IonIcon, IonButtons, IonBackButton, IonList, IonItem, IonLabel, 
    IonNote, useIonViewWillEnter, IonSpinner
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import { create, mailOutline, calendarOutline, personOutline } from 'ionicons/icons';
import { getUserById, User } from '../service/LocalStorageService';

// Definimos los parámetros de la ruta (solo necesitamos el 'id')
interface RouteParams {
  id: string;
}

const DetailPage: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const history = useHistory();
    
    // Estado para los datos del usuario y el estado de carga
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadUser = () => {
        setIsLoading(true);
        const foundUser = getUserById(id);
        setUser(foundUser || null);
        setIsLoading(false);
    };

    useIonViewWillEnter(() => {
        loadUser();
    });

    // Función para navegar al formulario de edición
    const handleEdit = () => {
        // 🛑 Usamos la ruta correcta con el prefijo /users/
        history.push(`/users/edit/${id}`); 
    };

    const formatReadableDate = (timestamp: string | undefined): string => {
        if (!timestamp) return 'N/A';
        try {
            // El ID que generamos con Date.now() es un timestamp
            const date = new Date(parseInt(timestamp));
            // Ejemplo: 7 de octubre de 2025
            return date.toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch (e) {
            return timestamp; // Devuelve el timestamp crudo si falla la conversión
        }
    };


    if (isLoading) {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton defaultHref="/users/list" />
                        </IonButtons>
                        <IonTitle>Cargando...</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen className="ion-padding ion-text-center">
                    <div className="ion-padding-top">
                        <IonSpinner name="crescent" />
                        <p>Cargando detalles...</p>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    if (!user) {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton defaultHref="/users/list" />
                        </IonButtons>
                        <IonTitle>Usuario No Encontrado</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen className="ion-padding ion-text-center">
                    <p>El usuario con ID "{id}" no existe.</p>
                </IonContent>
            </IonPage>
        );
    }
    
    // Si el usuario existe, renderizamos los detalles
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/users/list" />
                    </IonButtons>
                    <IonTitle>Detalles del Usuario</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                
                {/* Cabecera del perfil, imitando la tarjeta de la imagen */}
                <div className="profile-header ion-padding ion-text-center">
                    <img 
                        src={user.photoUrl || `https://i.pravatar.cc/150?u=${user.id}`} 
                        alt={user.name} 
                        className="profile-avatar"
                        style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', margin: '10px auto' }}
                    />
                    <h2>{user.name}</h2>
                    <p className="ion-text-muted">{user.email}</p>
                    
                    {/* Tags de Rol y Estado */}
                    <div className="ion-padding-bottom">
                        <IonNote className="role-tag ion-margin-end">{user.role}</IonNote>
                        <IonNote className={`status-tag ${user.status === 'Activo' ? 'active' : 'inactive'}`}>
                            {user.status}
                        </IonNote>
                    </div>
                </div>

                {/* Lista de Información del Usuario */}
                <h3 className="ion-padding-horizontal ion-padding-top">Información del Usuario</h3>
                <IonList lines="full" className="ion-no-margin">
                    
                    <IonItem>
                        <IonIcon icon={personOutline} slot="start" />
                        <IonLabel>Nombre Completo</IonLabel>
                        <IonNote slot="end">{user.name}</IonNote>
                    </IonItem>
                    
                    <IonItem>
                        <IonIcon icon={mailOutline} slot="start" />
                        <IonLabel>Correo Electrónico</IonLabel>
                        <IonNote slot="end">{user.email}</IonNote>
                    </IonItem>
                    
                    <IonItem>
                        <IonLabel>Rol</IonLabel>
                        <IonNote slot="end">{user.role}</IonNote>
                    </IonItem>
                    
                    <IonItem>
                        <IonLabel>Estado</IonLabel>
                        <IonNote slot="end">{user.status}</IonNote>
                    </IonItem>
                    
                    <IonItem>
                        <IonIcon icon={calendarOutline} slot="start" />
                        <IonLabel>Fecha de Creación</IonLabel>
                        {/* Asumimos que el ID es un timestamp de creación */}
                        <IonNote slot="end">{formatReadableDate(user.id)}</IonNote> 
                    </IonItem>
                    
                </IonList>

                {/* Botón de Edición (Navega a /users/edit/:id) */}
                <div className="ion-padding">
                    <IonButton expand="block" color="success" onClick={handleEdit}>
                        <IonIcon slot="start" icon={create} />
                        EDITAR
                    </IonButton>
                </div>
                
            </IonContent>
        </IonPage>
    );
};

export default DetailPage;