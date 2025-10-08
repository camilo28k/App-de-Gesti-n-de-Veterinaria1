// src/pages/UserList.tsx

import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, 
  IonItem, IonLabel, IonNote, IonButtons, IonButton, IonIcon, IonSearchbar 
} from '@ionic/react';
import { useHistory } from 'react-router-dom'; // 🛑 Asegúrate de que useHistory esté importado
import { useIonViewWillEnter } from '@ionic/react'; 
import { add } from 'ionicons/icons'; 
import { getUsers, User } from '../service/LocalStorageService';
import './UserList.css'; 

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory(); // 🛑 Hook necesario para la navegación

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
  
  // 🛑 Función clave para la navegación a Edición
  const handleItemClick = (userId: string) => {
    history.push(`/edit/${userId}`); // Usa el ID para construir la URL dinámica
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
        <IonToolbar>
            <IonSearchbar placeholder="Buscar usuarios" />
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        {isLoading && <p className="ion-padding">Cargando usuarios...</p>}
        
        <IonList>
          {users.map((user) => (
            // 🛑 El IonItem debe ser un botón y llamar a handleItemClick con el ID
            <IonItem 
              key={user.id} 
              detail={true} // Muestra la flecha de navegación (>)
              button // Hace que el elemento sea interactivo y tenga feedback visual
              onClick={() => handleItemClick(user.id)} // Llama a la función con el ID del usuario
            > 
              
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