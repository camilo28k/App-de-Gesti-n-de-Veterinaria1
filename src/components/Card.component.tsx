// src/components/Card.component.tsx

import React from 'react';
import { 
    IonItem, IonLabel, IonNote, IonIcon, IonButton
} from '@ionic/react';
// Asegúrate de importar el ícono correcto para Editar y Detalles (create e informationCircleOutline son comunes)
import { create, informationCircleOutline } from 'ionicons/icons';

interface CardProps {
    title: string;
    subtitle: string;
    note?: string; 
    imageUrl?: string;
    
    onDetailsClick: () => void;
    onEditClick: () => void;
    
    itemId: string;
    
    // 🛑 PROPIEDADES AGREGADAS Y CORREGIDAS
    // Controla si se debe mostrar el botón de detalles
    showDetailsButton?: boolean; // 🛑 NUEVA PROPIEDAD
    // Controla si se debe mostrar el botón de editar
    showEditButton?: boolean; 
}

export const CardComponent: React.FC<CardProps> = ({ 
    title, 
    subtitle, 
    note, 
    imageUrl, 
    onDetailsClick, 
    onEditClick, 
    itemId,
    // 🛑 ASIGNAR VALOR POR DEFECTO a las propiedades, incluyendo la nueva
    showDetailsButton = true, // Por defecto, es visible
    showEditButton = true // Por defecto, es visible
}) => {
    
    // Usamos una URL genérica como fallback, diferente para usuarios y mascotas/tipos
    const fallbackImage = (title.includes('Mascotas') || title.includes('pet') || title.includes('Tipo')) 
        ? `https://i.pravatar.cc/150?img=10&u=${itemId}`
        : `https://i.pravatar.cc/150?u=${itemId}`; 

    return (
        <IonItem lines="full"> 
            
            <img 
                src={imageUrl || fallbackImage} 
                alt={title} 
                className="card-avatar"
                slot="start" 
                style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
            />
            
            <IonLabel>
                <h2>{title}</h2>
                <p>{subtitle}</p> 
            </IonLabel>
            
            {note && (
                <IonNote slot="end" className="ion-margin-end">
                    <span className="card-note">
                     {note}
                    </span>
                </IonNote>
            )}
            
            {/* GRUPO DE BOTONES */}
            <div slot="end" className="action-buttons-group">
                
                {/* 🛑 Botón de Detalles (Condicional) */}
                {showDetailsButton && ( 
                    <IonButton 
                        fill="clear" 
                        color="primary" 
                        onClick={(e) => {
                            e.stopPropagation(); 
                            onDetailsClick();
                        }}
                        title="Ver Detalles"
                    >
                        <IonIcon slot="icon-only" icon={informationCircleOutline} />
                    </IonButton>
                )}

                {/* Botón de Edición (Condicional) */}
                {showEditButton && (
                    <IonButton 
                        fill="clear" 
                        color="warning" 
                        onClick={(e) => {
                            e.stopPropagation(); 
                            onEditClick();
                        }}
                        title="Editar"
                    >
                        <IonIcon slot="icon-only" icon={create} />
                    </IonButton>
                )}
            </div>
        </IonItem>
    );
};