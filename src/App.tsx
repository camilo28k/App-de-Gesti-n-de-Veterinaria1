import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

// Núcleo y utilidades de estilos de Ionic
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css'; // Opcional, dependiendo de si usas el tema oscuro

import './theme/variables.css';

// Importación de las páginas
import CreatePage from './pages/CreatePage';
import UserList from './pages/UserList';
import EditPage from './pages/EditPage'; // 🛑 Importar la página de edición
import DetailPage from './pages/DetailPage';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        
        {/* Ruta de Listado de Usuarios (Vista principal) */}
        <Route exact path="/list">
          <UserList />
        </Route>
        
        {/* Ruta de Creación de Usuario */}
        <Route exact path="/create">
          <CreatePage />
        </Route>

        {/* 🛑 NUEVA RUTA: Ruta de Edición de Usuario. Usa el parámetro ":id" */}
        <Route exact path="/edit/:id">
          <EditPage />
        </Route>
        
        {/* Redirección: Al entrar en la raíz (/), redirige al listado de usuarios */}
        <Route exact path="/">
          <Redirect to="/list" />
        </Route>
        <Route exact path="/details/:id">
          <DetailPage />
        </Route>
        
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;