// src/pages/PetsPage.tsx

import React, { useState } from 'react';
import { 
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, 
    IonButton, IonIcon, IonSearchbar, IonButtons, useIonViewWillEnter, IonItem, IonLabel, 
    IonSpinner // Asegurarse de importar IonSpinner para la carga
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
// 🛑 Importamos 'menu' para el botón de la esquina
import { add, menu, list } from 'ionicons/icons'; 
import { CardComponent } from '../components/Card.component'; 
import { getPets, Pet } from '../service/Pet.service';

const PetsPage: React.FC = () => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [searchText, setSearchText] = useState(''); 
    const [isLoading, setIsLoading] = useState(true);
    const history = useHistory(); 

    // ... (loadPets y useIonViewWillEnter - Se mantienen igual)
    const loadPets = () => {
        setIsLoading(true);
        try {
            const storedPets = getPets();
            setPets(storedPets);
        } catch (error) {
            console.error("Error al cargar mascotas:", error);
            setPets([]);
        } finally {
            setIsLoading(false);
        }
    };

    useIonViewWillEnter(() => {
        loadPets();
    });

    // 🛑 HANDLER DE NAVEGACIÓN A TIPOS DE MASCOTAS (Se mantiene igual)
    const handleTypesClick = () => {
        console.log("Navegando a /pets/types"); 
        history.push('/pets/types'); 
    };

    // Handlers de CRUD principal (Se mantienen igual)
    const handleCreatePet = () => {
        history.push('/pets/create'); 
    };
    
    const handleDetailsClick = (petId: string) => {
        history.push(`/pets/details/${petId}`); 
    };
    
    const handleEditClick = (petId: string) => {
        history.push(`/pets/edit/${petId}`); 
    };

    const filteredPets = pets.filter(pet => 
        pet.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (pet.breed && pet.breed.toLowerCase().includes(searchText.toLowerCase()))
    );

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    {/* 🛑 BOTÓN DE MENÚ LATERAL (COSOS AZULES) */}
                    <IonButtons slot="start">
                        <IonButton color="primary" 
                            // Aquí iría la lógica para abrir el menú lateral (ej: toggleMenu)
                        >
                            <IonIcon slot="icon-only" icon={menu} />
                        </IonButton>
                    </IonButtons>
                    
                    <IonTitle className="pets-list-title">Mis Mascotas</IonTitle>
                    
                    {/* BOTÓN DE CREAR MASCOTA (SUMA VERDE) */}
                    <IonButtons slot="end">
                        <IonButton color="success" onClick={handleCreatePet}>
                            <IonIcon slot="icon-only" icon={add} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
                
                {/* SEGUNDO TOOLBAR: Botón 'Tipos' y Barra de Búsqueda */}
                <IonToolbar>
                    
                    {/* 🛑 BOTÓN 'TIPOS' AJUSTADO: Usamos IonItem con el fondo y bordes redondeados */}
                    <IonItem 
                        lines="none" 
                        slot="start" 
                        button={true}
                        detail={false} 
                        onClick={handleTypesClick} // 🛑 Llama al handler de navegación
                        className="ion-margin-start"
                        style={{ 
                            '--background': 'var(--ion-color-light, #f4f5f8)', 
                            borderRadius: '10px', 
                            padding: '10px 15px', 
                            minWidth: '80px',
                            height: '50px' 
                        }}
                    >
                        {/* El color del ícono y el texto puede ser 'tertiary' (morado) o 'primary' (azul) */}
                        <IonLabel color="tertiary" className="ion-text-center">Tipos</IonLabel>
                    </IonItem>
                    
                    {/* Barra de Búsqueda */}
                    <IonSearchbar 
                        value={searchText}
                        onIonChange={(e) => setSearchText(e.detail.value!)}
                        placeholder="Buscar mascotas" 
                        slot="end"
                        debounce={500} 
                        style={{ 
                            '--background': 'var(--ion-toolbar-background, #fff)', 
                            '--border-radius': '10px',
                            margin: '5px 10px 5px 0'
                        }}
                    />
                </IonToolbar>
            </IonHeader>
            
            <IonContent fullscreen>
                {isLoading && (
                    <div className="ion-text-center ion-padding">
                        <IonSpinner name="dots" color="primary" />
                        <p>Cargando mascotas...</p>
                    </div>
                )}
                
                {!isLoading && (
                    <IonList>
                        {filteredPets.map((pet) => (
                            <CardComponent
                                key={pet.id}
                                itemId={pet.id}
                                title={pet.name}
                                subtitle={`${pet.species || 'Desconocida'} - ${pet.breed || 'Sin raza'}`} 
                                note={`ID: ${pet.id.slice(0, 4)}`} 
                                imageUrl={pet.photoUrl || `https://i.pravatar.cc/150?img=10&u=${pet.id}`}
                                
                                onDetailsClick={() => handleDetailsClick(pet.id)}
                                onEditClick={() => handleEditClick(pet.id)} 
                                
                                showDetailsButton={true} 
                                showEditButton={true} 
                            />
                        ))}
                    </IonList>
                )}

                {(!isLoading && pets.length === 0) && <p className="ion-padding ion-text-center">No hay mascotas registradas.</p>}
            </IonContent>
        </IonPage>
    );
};

export default PetsPage;