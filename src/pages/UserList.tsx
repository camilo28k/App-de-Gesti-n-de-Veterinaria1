// src/pages/UserList.tsx

import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, 
  IonItem, IonLabel, IonNote, IonButtons, IonButton, IonIcon, IonSearchbar 
} from '@ionic/react';
import { useHistory } from 'react-router-dom'; 
import { useIonViewWillEnter } from '@ionic/react'; // 🛑 Importación corregida
import { add } from 'ionicons/icons'; 
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

  // 🛑 Recarga los datos al entrar a la vista (incluyendo después de crear un usuario)
  useIonViewWillEnter(() => {
    loadUsers();
  });

  const handleCreateUser = () => {
    history.push('/create'); 
  };
  
  const handleItemClick = (userId: string) => {
      console.log('Navegar para editar usuario:', userId);
      // history.push(`/edit/${userId}`); // Implementación futura
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="user-list-title">Usuarios</IonTitle>
          <IonButtons slot="end">
            <IonButton 
              color="success" 
              onClick={handleCreateUser}
            >
              <IonIcon slot="icon-only" icon={add} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        {/* Barra de búsqueda (vista en la imagen) */}
        <IonToolbar>
            <IonSearchbar placeholder="Buscar usuarios" />
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        {isLoading && <p className="ion-padding">Cargando usuarios...</p>}
        
        <IonList>
          {users.map((user) => (
            <IonItem key={user.id} detail={true} button onClick={() => handleItemClick(user.id)}> 
              
              <img 
                // Usamos photoUrl si existe, si no, un placeholder de avatar
                src={user.photoUrl || `https://i.pravatar.cc/150?u=${user.id}`} 
                alt={user.name} 
                className="user-avatar"
                slot="start" 
              />
              
              <IonLabel>
                <h2>{user.name}</h2>
                <p>{user.role}</p> 
              </IonLabel>
              
              <IonNote slot="end">
                <span className={`user-status ${user.status === 'Activo' ? 'active' : 'inactive'}`}>
                  {user.status}
                </span>
              </IonNote>
            </IonItem>
          ))}
        </IonList>

        {(!isLoading && users.length === 0) && <p className="ion-padding">No hay usuarios registrados.</p>}
      </IonContent>
    </IonPage>
  );
};

export default UserList;