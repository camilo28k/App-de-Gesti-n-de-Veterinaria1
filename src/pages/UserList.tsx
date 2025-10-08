// src/pages/UserList.tsx

import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, 
  IonItem, IonLabel, IonNote, IonButton, IonIcon, IonSearchbar, 
  IonButtons
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useIonViewWillEnter } from '@ionic/react'; 
// 🛑 Importamos los íconos de añadir, detalles y edición
import { add, informationCircleOutline, create } from 'ionicons/icons'; 
import { getUsers, User } from '../service/LocalStorageService';
import './UserList.css'; 

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory(); 

  const loadUsers = () => {
    setIsLoading(true);
    const storedUsers = getUsers();
    setUsers(storedUsers);
    setIsLoading(false);
  };

  useIonViewWillEnter(() => {
    loadUsers();
  });

  const handleCreateUser = () => {
    history.push('/create'); 
  };
  
  // Función para navegar a la página de detalles
  const handleDetailsClick = (userId: string) => {
    history.push(`/details/${userId}`); 
  };
  
  // 🛑 Nueva función para navegar a la página de edición
  const handleEditClick = (userId: string) => {
    history.push(`/edit/${userId}`); 
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="user-list-title">Usuarios</IonTitle>
          <IonButtons slot="end">
            <IonButton color="success" onClick={handleCreateUser}>
              <IonIcon slot="icon-only" icon={add} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
            <IonSearchbar placeholder="Buscar usuarios" />
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        {isLoading && <p className="ion-padding">Cargando usuarios...</p>}
        
        <IonList>
          {users.map((user) => (
            <IonItem key={user.id} lines="full"> 
              
              <img 
                src={user.photoUrl || `https://i.pravatar.cc/150?u=${user.id}`} 
                alt={user.name} 
                className="user-avatar"
                slot="start" 
              />
              
              <IonLabel>
                <h2>{user.name}</h2>
                <p>{user.role}</p> 
              </IonLabel>
              
              <IonNote slot="end" className="ion-margin-end">
                <span className={`user-status ${user.status === 'Activo' ? 'active' : 'inactive'}`}>
                  {user.status}
                </span>
              </IonNote>
              
              {/* 🛑 GRUPO DE BOTONES (Usamos un div o IonButtons para agrupar en el slot="end") */}
              <div slot="end" className="action-buttons-group">
                
                {/* 1. BOTÓN DE DETALLES */}
                <IonButton 
                  fill="clear" 
                  color="primary" 
                  onClick={(e) => {
                      e.stopPropagation(); 
                      handleDetailsClick(user.id);
                  }}
                  title="Ver Detalles"
                >
                  <IonIcon slot="icon-only" icon={informationCircleOutline} />
                </IonButton>

                {/* 2. BOTÓN DE EDICIÓN */}
                <IonButton 
                  fill="clear" 
                  color="warning" // Usamos un color distinto para diferenciar
                  onClick={(e) => {
                      e.stopPropagation(); 
                      handleEditClick(user.id);
                  }}
                  title="Editar Usuario"
                >
                  <IonIcon slot="icon-only" icon={create} />
                </IonButton>

              </div>
            </IonItem>
          ))}
        </IonList>

        {(!isLoading && users.length === 0) && <p className="ion-padding">No hay usuarios registrados.</p>}
      </IonContent>
    </IonPage>
  );
};

export default UserList;