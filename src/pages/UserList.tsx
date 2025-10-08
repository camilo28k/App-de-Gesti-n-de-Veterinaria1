// src/pages/UserList.tsx

import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, 
  IonButton, IonIcon, IonSearchbar, IonButtons
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useIonViewWillEnter } from '@ionic/react'; 
import { add } from 'ionicons/icons'; // Solo necesitamos 'add' para el botón de creación
import { getUsers, User } from '../service/LocalStorageService';
import { CardComponent } from '../components/Card.component'; // 🛑 CardComponent Importado
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
    // Usamos la ruta con prefijo de tabs: /users/create
    history.push('/users/create'); 
  };
  
  const handleDetailsClick = (userId: string) => {
    // Navegación a DETALLES: /users/details/:id
    history.push(`/users/details/${userId}`); 
  };
  
  // La función existe para pasarla como prop, pero el botón no se renderiza.
  const handleEditClick = (userId: string) => {
    // Navegación a EDICIÓN: /users/edit/:id
    history.push(`/users/edit/${userId}`); 
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
            // 🛑 Uso del CardComponent
            <CardComponent
                key={user.id}
                itemId={user.id}
                title={user.name}
                subtitle={user.role}
                note={user.status}
                imageUrl={user.photoUrl || `https://i.pravatar.cc/150?u=${user.id}`}
                // Handlers de acción
                onDetailsClick={() => handleDetailsClick(user.id)}
                onEditClick={() => handleEditClick(user.id)} 
                // 🛑 Control para mostrar solo el botón de Detalles
                showEditButton={false} 
            />
          ))}
        </IonList>

        {(!isLoading && users.length === 0) && <p className="ion-padding">No hay usuarios registrados.</p>}
      </IonContent>
    </IonPage>
  );
};

export default UserList;