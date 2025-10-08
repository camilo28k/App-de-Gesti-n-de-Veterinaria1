// src/App.tsx

import { Redirect, Route } from 'react-router-dom';
import { 
    IonApp, IonRouterOutlet, setupIonicReact, IonTabs, 
    IonTabBar, IonTabButton, IonIcon, IonLabel 
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

// Importar los íconos de la barra de pestañas (Usuarios y Mascotas)
import { people, paw } from 'ionicons/icons'; 

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

// Importación de las páginas de Usuarios (Asumo que existen)
import CreatePage from './pages/CreatePage';
import UserList from './pages/UserList';
import EditPage from './pages/EditPage'; 
import DetailPage from './pages/DetailPage';

// Importación de las páginas de Mascotas (CRUD Principal)
import PetsPage from './pages/PetsPage'; 
import CreatePetPage from './pages/CreatePetPage'; 
import PetDetailPage from './pages/PetDetailPage'; 
import EditPetPage from './pages/EditPetPage'; 

// 🛑 Importación de las páginas de Tipos de Mascotas (CRUD Auxiliar)
import CreatePetTypePage from './pages/CreatePetTypePage';
import PetTypesPage from './pages/PetTypesPage';
import EditTypePage from './pages/EditTypePage'; // 🛑 AGREGADO: Se importa la página de edición de tipo

setupIonicReact();

const App: React.FC = () => (
    <IonApp>
        <IonReactRouter>
            {/* IonTabs: Contenedor principal para la navegación con pestañas */}
            <IonTabs>
                
                {/* IonRouterOutlet: Contiene todas las rutas que se cargarán */}
                <IonRouterOutlet>
                    
                    {/* 1. RUTAS DE USUARIOS (CRUD) */}
                    <Route path="/users" exact={true}>
                        <Redirect to="/users/list" />
                    </Route>
                    <Route exact path="/users/list">
                        <UserList />
                    </Route>
                    <Route exact path="/users/create">
                        <CreatePage />
                    </Route>
                    <Route exact path="/users/details/:id">
                        <DetailPage />
                    </Route>
                    <Route exact path="/users/edit/:id">
                        <EditPage />
                    </Route>

                    {/* 2. RUTAS DE MASCOTAS (CRUD Principal) */}
                    <Route path="/pets" exact={true}>
                        <Redirect to="/pets/list" />
                    </Route>
                    <Route exact path="/pets/list">
                        <PetsPage />
                    </Route>
                    <Route exact path="/pets/create"> 
                        <CreatePetPage /> 
                    </Route>
                    <Route exact path="/pets/details/:id"> 
                        <PetDetailPage /> 
                    </Route>
                    <Route exact path="/pets/edit/:id">
                        <EditPetPage />
                    </Route>
                    
                    {/* 3. RUTAS DE TIPOS DE MASCOTAS (CRUD Auxiliar) */}
                    <Route exact path="/pets/types"> 
                        <PetTypesPage /> 
                    </Route>
                    <Route exact path="/pets/types/create"> 
                        <CreatePetTypePage /> 
                    </Route>
                    {/* 🛑 RUTA ACTIVADA: Edición de Tipos */}
                    <Route exact path="/pets/types/edit/:id"> 
                        <EditTypePage /> 
                    </Route>

                    {/* Redirección inicial */}
                    <Route exact path="/">
                        <Redirect to="/users/list" />
                    </Route>
                    
                </IonRouterOutlet>
                
                {/* IonTabBar: La barra de menú inferior */}
                <IonTabBar slot="bottom">
                    
                    {/* Botón de Usuarios */}
                    <IonTabButton tab="users" href="/users/list">
                        <IonIcon icon={people} />
                        <IonLabel>Usuarios</IonLabel>
                    </IonTabButton>
                    
                    {/* Botón de Mascotas */}
                    <IonTabButton tab="pets" href="/pets/list">
                        <IonIcon icon={paw} />
                        <IonLabel>Mascotas</IonLabel>
                    </IonTabButton>
                </IonTabBar>
            </IonTabs>
        </IonReactRouter>
    </IonApp>
);

export default App;