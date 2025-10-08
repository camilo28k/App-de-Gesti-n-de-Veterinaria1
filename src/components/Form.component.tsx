// src/components/Form.component.tsx

import React, { useState, useEffect } from 'react';
import { 
  IonButton, IonInput, IonItem, IonLabel, IonList, IonSelect,      
  IonSelectOption, IonRadioGroup, IonRadio, IonItemDivider, IonNote, IonIcon
} from '@ionic/react';
import { User } from '../service/LocalStorageService'; 
import { cloudUploadOutline } from 'ionicons/icons'; 
import './Form.component.css'; 

// 1. Tipo base (lo que onSaveUser espera): Usuario sin ID.
type UserDraft = Omit<User, 'id'>;

// 2. Tipo para el estado interno (FormData): Hacemos que 'password' sea opcional para usar 'delete'.
type FormData = Omit<UserDraft, 'password'> & { password?: string };

interface FormProps {
  onSaveUser: (user: UserDraft) => void;
  initialData?: User;             
  submitButtonText?: string;      
  isEditing?: boolean;            
}

const initialFormState: FormData = {
  name: '',
  email: '',
  role: 'Asistente', 
  password: '', 
  status: 'Activo', 
  photoUrl: undefined,
};

export const FormComponent: React.FC<FormProps> = ({ 
    onSaveUser, 
    initialData, 
    submitButtonText = "Crear Usuario",
    isEditing = false
}) => {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  useEffect(() => {
    if (initialData) {
        const { id, password, ...draft } = initialData; 
        setFormData({ ...initialFormState, ...draft, password: '' });
    }
  }, [initialData]);

  const handleChange = (name: keyof FormData, value: string | undefined | null) => {
    if (value !== null && value !== undefined) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordRequired = !isEditing || showPasswordChange;
    
    if (formData.name && formData.email && formData.role && formData.status && 
        (!passwordRequired || (passwordRequired && formData.password))) {
      
      const dataToSave: FormData = {...formData};
      
      // LÓGICA DE BORRADO DE CONTRASEÑA: Resuelve el error de TypeScript.
      if (isEditing && !showPasswordChange && dataToSave.password === '') {
          delete dataToSave.password; 
      }

      onSaveUser(dataToSave as UserDraft); 
      
      if (!isEditing) {
          setFormData(initialFormState); 
      }
    } else {
      alert(`Por favor, rellena todos los campos.`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setFormData((prevData) => ({
            ...prevData,
            photoUrl: URL.createObjectURL(file), 
        }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <IonList>
        {/* Nombre y Email (Desactivados en Edición según image_6d456c.png) */}
        <IonItem><IonLabel position="stacked">Nombre completo</IonLabel><IonInput type="text" value={formData.name} onIonChange={(e) => handleChange('name', e.detail.value)} placeholder="Ingrese el nombre completo" required disabled={isEditing} /></IonItem>
        <IonItem><IonLabel position="stacked">Correo electrónico</IonLabel><IonInput type="email" value={formData.email} onIonChange={(e) => handleChange('email', e.detail.value)} placeholder="Ingrese el correo electrónico" required disabled={isEditing} /></IonItem>
        
        {/* Rol */}
        <IonItem>
          <IonLabel position="stacked">Rol</IonLabel>
          <IonSelect value={formData.role} onIonChange={(e) => handleChange('role', e.detail.value)} placeholder="Seleccione el rol" required>
            <IonSelectOption value="Administrador">Administrador</IonSelectOption>
            <IonSelectOption value="Veterinario">Veterinario</IonSelectOption>
            <IonSelectOption value="Asistente">Asistente</IonSelectOption>
          </IonSelect>
        </IonItem>

        {/* Estado */}
        <IonItemDivider><IonLabel>Estado</IonLabel></IonItemDivider>
        <IonRadioGroup value={formData.status} onIonChange={(e) => handleChange('status', e.detail.value)}>
          <IonItem lines="none" className={formData.status === 'Activo' ? 'radio-active-highlight' : ''}>
            <IonLabel>Activo</IonLabel><IonRadio slot="start" value="Activo" />
          </IonItem>
          <IonItem lines="none" className={formData.status === 'Inactivo' ? 'radio-active-highlight' : ''}>
            <IonLabel>Inactivo</IonLabel><IonRadio slot="start" value="Inactivo" />
          </IonItem>
        </IonRadioGroup>

        {/* Lógica de Contraseña */}
        {(isEditing && !showPasswordChange) ? (
            <div className="ion-padding-top">
                <IonButton expand="block" fill="clear" color="success" onClick={() => setShowPasswordChange(true)}>
                    Cambiar contraseña
                </IonButton>
            </div>
        ) : (
            <IonItem className={isEditing ? 'ion-margin-top' : ''}>
                <IonLabel position="stacked">{isEditing ? 'Nueva Contraseña' : 'Contraseña'}</IonLabel>
                <IonInput
                    type="password" 
                    value={formData.password}
                    onIonChange={(e) => handleChange('password', e.detail.value)}
                    placeholder={isEditing ? 'Dejar vacío para no cambiar' : 'Ingrese la contraseña'}
                    required={!isEditing || showPasswordChange} 
                />
            </IonItem>
        )}
        
        {/* Campo: Foto */}
        <IonItemDivider><IonLabel>Foto</IonLabel></IonItemDivider>
        <div className="file-upload-box">
            <input 
                type="file" 
                id="file-upload" 
                accept="image/png, image/jpeg, image/gif" 
                onChange={handleFileChange}
                style={{ display: 'none' }} 
            />
            <label htmlFor="file-upload" className="file-upload-label">
                <IonIcon icon={cloudUploadOutline} size="large" />
                <p>Arrastra o **selecciona un archivo**</p>
                <IonNote>PNG, JPG, GIF hasta 10MB</IonNote>
            </label>
            {formData.photoUrl && <IonNote color="success">Archivo listo: {formData.photoUrl.substring(0, 30)}...</IonNote>}
        </div>

      </IonList>
      
      <div className="ion-padding">
        <IonButton expand="block" type="submit" color="success">
          {submitButtonText}
        </IonButton>
      </div>
    </form>
  );
};