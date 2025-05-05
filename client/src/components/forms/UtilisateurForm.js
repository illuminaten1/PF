//src/components/forms/UtilisateurForm.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FormField from '../common/FormField';

const UtilisateurForm = ({ onSubmit, initialData, isEditing }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    genre: '',
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    role: 'redacteur'
  });
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.username || '',
        password: '', // Ne pas afficher le mot de passe existant
        genre: initialData.genre || '',
        prenom: initialData.prenom || '',
        nom: initialData.nom || '',
        email: initialData.email || '',
        telephone: initialData.telephone || '',
        role: initialData.role || 'redacteur'
      });
    }
  }, [initialData]);
  
  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Le nom d\'utilisateur est requis';
    if (!isEditing && !formData.password.trim()) newErrors.password = 'Le mot de passe est requis';
    if (!formData.genre) newErrors.genre = 'Le genre/grade est requis';
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    
    // Validation email
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    // Validation téléphone si présent
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    if (formData.telephone && !phoneRegex.test(formData.telephone)) {
      newErrors.telephone = 'Format de téléphone invalide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };
  
  // Liste des grades
  const genres = [
    'Madame', 'Monsieur', 
    'Général', 'Colonel', 'Lieutenant-colonel', 'Chef d\'escadron', 
    'Commandant', 'Capitaine', 'Lieutenant', 'Sous-lieutenant', 
    'Aspirant', 'Major', 'Adjudant-chef', 'Adjudant', 
    'Maréchal des logis-chef', 'Gendarme', 'Elève-Gendarme', 
    'Maréchal des logis', 'Brigadier-chef', 'Brigadier', 
    'Gendarme adjoint volontaire', 'Gendarme adjoint de 2ème classe'
  ];
  
  return (
    <Form onSubmit={handleSubmit}>
      <FormSection>
        <SectionTitle>Informations de connexion</SectionTitle>
        <FormRow>
          <FormGroup>
            <FormField 
              label="Nom d'utilisateur" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              required 
              error={errors.username}
            />
          </FormGroup>
          
          <FormGroup>
            <FormField 
              label={isEditing ? "Nouveau mot de passe (laisser vide pour ne pas changer)" : "Mot de passe"} 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required={!isEditing} 
              error={errors.password}
            />
          </FormGroup>
        </FormRow>
      </FormSection>
      
      <FormSection>
        <SectionTitle>Informations personnelles</SectionTitle>
        <FormRow>
          <FormGroup>
            <FormField 
              label="Genre/Grade" 
              type="select" 
              name="genre" 
              value={formData.genre} 
              onChange={handleChange} 
              required 
              error={errors.genre}
              options={genres}
            />
          </FormGroup>
          
          <FormGroup>
            <FormField 
              label="Prénom" 
              name="prenom" 
              value={formData.prenom} 
              onChange={handleChange} 
              required 
              error={errors.prenom}
            />
          </FormGroup>
          
          <FormGroup>
            <FormField 
              label="Nom" 
              name="nom" 
              value={formData.nom} 
              onChange={handleChange} 
              required 
              error={errors.nom}
            />
          </FormGroup>
        </FormRow>
        
        <FormRow>
          <FormGroup>
            <FormField 
              label="Email" 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              error={errors.email}
            />
          </FormGroup>
          
          <FormGroup>
            <FormField 
              label="Téléphone" 
              name="telephone" 
              value={formData.telephone} 
              onChange={handleChange} 
              error={errors.telephone}
              placeholder="Ex: 06 12 34 56 78"
            />
          </FormGroup>
        </FormRow>
      </FormSection>
      
      {/* Section rôle (visible uniquement pour les administrateurs) */}
      <FormSection>
        <SectionTitle>Rôle dans le système</SectionTitle>
        <FormGroup>
          <FormField 
            label="Rôle" 
            type="select" 
            name="role" 
            value={formData.role} 
            onChange={handleChange}
            options={[
              { value: 'redacteur', label: 'Rédacteur' },
              { value: 'administrateur', label: 'Administrateur' }
            ]}
          />
        </FormGroup>
      </FormSection>
      
      <SubmitButton type="submit">
        {isEditing ? 'Mettre à jour' : 'Créer'} l'utilisateur
      </SubmitButton>
    </Form>
  );
};

// Styles
const Form = styled.form`
  padding: 20px;
  position: relative;
`;

const FormSection = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;

const FormGroup = styled.div`
  flex: 1;
  min-width: 0;
`;

const SubmitButton = styled.button`
  background-color: #3f51b5;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 20px;
  width: 100%;
  
  &:hover {
    background-color: #303f9f;
  }
`;

export default UtilisateurForm;