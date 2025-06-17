// API configuration for BoweryCreative services
export const API_ENDPOINTS = {
  // Backend API
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'https://bowerycreative-backend.onrender.com',
  
  // Social Manager API
  SOCIAL_MANAGER_URL: import.meta.env.VITE_SOCIAL_MANAGER_URL || 'https://bowerycreative-socialmanager.onrender.com',
  
  // Endpoints
  MAGIC_LINK: '/magic/generate',
  HEALTH_CHECK: '/health',
  CAMPAIGNS: '/api/campaigns',
  EMAIL: '/api/email',
  SOCIAL_ACCOUNTS: '/api/social/accounts',
  SOCIAL_POSTS: '/api/social/posts'
};

// Helper function to send magic link
export async function sendMagicLink(email: string, practiceName: string) {
  const response = await fetch(`${API_ENDPOINTS.SOCIAL_MANAGER_URL}${API_ENDPOINTS.MAGIC_LINK}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, practiceName })
  });
  
  if (!response.ok) {
    throw new Error('Failed to send magic link');
  }
  
  return response.json();
}

// Helper function to check service health
export async function checkServiceHealth(service: 'backend' | 'social') {
  const url = service === 'backend' 
    ? API_ENDPOINTS.BACKEND_URL 
    : API_ENDPOINTS.SOCIAL_MANAGER_URL;
    
  const response = await fetch(`${url}${API_ENDPOINTS.HEALTH_CHECK}`);
  return response.ok;
}