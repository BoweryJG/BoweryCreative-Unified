import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Box, Paper, Typography } from '@mui/material';

const DebugAuth: React.FC = () => {
  const auth = useAuth();
  
  return (
    <Paper sx={{ p: 2, m: 2 }}>
      <Typography variant="h6">Auth Debug Info</Typography>
      <Box component="pre" sx={{ fontSize: '12px', overflow: 'auto' }}>
        {JSON.stringify({
          user: auth.user ? { id: auth.user.id, email: auth.user.email } : null,
          loading: auth.loading,
          isAdmin: auth.isAdmin,
          isAuthorizedClient: auth.isAuthorizedClient,
          hasAccess: auth.hasAccess,
          clientData: auth.clientData
        }, null, 2)}
      </Box>
    </Paper>
  );
};

export default DebugAuth;