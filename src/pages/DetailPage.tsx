// src/pages/DetailPage.tsx (Solución para el 'Loading' persistente)

import React, { useState, useEffect } from 'react';
import { 
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLoading, 
    IonBackButton, IonButtons, IonItem, IonLabel, IonNote, IonIcon, 
    IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonButton, useIonAlert
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import { create } from 'ionicons/icons';
import { getUserById, User } from '../service/LocalStorageService'; 

interface RouteParams {
    id: string;
}

const DetailPage: React.FC = () => {
    const { id } = useParams<RouteParams>(); 
    const history = useHistory();
    const [presentAlert] = useIonAlert();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // 🛑 CRÍTICO: La lógica de carga DEBE ejecutarse solo al montar o si cambia el ID
    useEffect(() => {
        // Marcamos la carga al iniciar
        setLoading(true); 
        
        if (id) {
            const currentUser = getUserById(id);
            if (currentUser) {
                setUser(currentUser); 
            } else {
                // Usuario no encontrado: Limpiamos y mostramos alerta
                setUser(null); 
                presentAlert({
                    header: 'Error',
                    message: `Usuario con ID ${id} no encontrado.`,
                    buttons: [{ text: 'OK', handler: () => history.replace('/list') }],
                });
            }
        }
        
        // Marcamos el fin de la carga *inmediatamente* después de la búsqueda síncrona
        setLoading(false); 
        
    }, [id, history, presentAlert]); // Dependencias correctas

    const handleEdit = () => {
        history.push(`/edit/${id}`);
    };

    // --- LÓGICA DE RENDERIZADO ---
    
    // Muestra el IonLoading como overlay durante la carga
    // La condición 'loading' debe ser suficiente si el useEffect es correcto.
    return (
        <IonPage>
            <IonLoading 
                isOpen={loading} 
                message="Cargando detalles..." 
                spinner="crescent" 
            /> 
            
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start"><IonBackButton defaultHref="/list" /></IonButtons>
                    <IonTitle>Detalles del Usuario</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding ion-text-center">
                
                {/* 🛑 CRÍTICO: Solo renderizamos el contenido si la carga terminó Y el usuario fue encontrado */}
                {!loading && user && (
                    <>
                        <div className="ion-padding-vertical">
                            <img 
                                src={user.photoUrl || 'https://i.pravatar.cc/150?img=6'} 
                                alt={user.name} 
                                style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} 
                            />
                            <h2 className="ion-no-margin ion-padding-top">{user.name}</h2>
                            <p className="ion-text-sm ion-margin-bottom">{user.email}</p>
                            <IonNote color="primary" className="ion-margin-end ion-padding-horizontal">
                                {user.role}
                            </IonNote>
                            <IonNote color="success" className="ion-padding-horizontal">
                                {user.status}
                            </IonNote>
                        </div>
        
                        <IonCard className="ion-margin-top ion-text-start">
                            <IonCardContent>
                                <h3>Información del Usuario</h3>
                                <IonGrid className="detail-grid">
                                    <IonRow><IonCol size="6">Nombre Completo</IonCol><IonCol size="6" className="ion-text-end">{user.name}</IonCol></IonRow>
                                    <IonRow><IonCol size="6">Correo Electrónico</IonCol><IonCol size="6" className="ion-text-end">{user.email}</IonCol></IonRow>
                                    <IonRow><IonCol size="6">Rol</IonCol><IonCol size="6" className="ion-text-end">{user.role}</IonCol></IonRow>
                                    <IonRow><IonCol size="6">Estado</IonCol><IonCol size="6" className="ion-text-end">{user.status}</IonCol></IonRow>
                                    <IonRow><IonCol size="6">Fecha de Creación</IonCol><IonCol size="6" className="ion-text-end">{new Date(parseInt(user.id)).toLocaleDateString('es-ES')}</IonCol></IonRow>
                                </IonGrid>
                            </IonCardContent>
                        </IonCard>
                        
                        <div className="ion-padding-vertical">
                            <IonButton expand="block" color="success" onClick={handleEdit}>
                                <IonIcon slot="start" icon={create} />
                                Editar
                            </IonButton>
                        </div>
                    </>
                )}
                
                {/* Mensaje de fallback si la carga termina pero no hay usuario (solo se ve brevemente antes de la redirección) */}
                {!loading && !user && <p className="ion-text-center">El usuario no pudo ser cargado.</p>}

            </IonContent>
        </IonPage>
    );
};

export default DetailPage;