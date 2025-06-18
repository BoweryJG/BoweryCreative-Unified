import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthModal = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const handleAuthSuccess = () => {
    closeAuthModal();
    navigate('/admin');
  };

  return {
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    handleAuthSuccess,
  };
};