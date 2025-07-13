// MUI v7 Grid Component Usage Examples

import React from 'react';
import { Grid, Grid2 } from '@mui/material';

// ========================================
// Option 1: Using Grid2 (Recommended for MUI v7)
// ========================================
// Grid2 uses the 'size' prop instead of individual breakpoint props
export const Grid2Example = () => {
  return (
    <Grid2 container spacing={3}>
      {/* Full width on mobile, half on tablet, quarter on desktop */}
      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
        <div>Item 1</div>
      </Grid2>
      
      {/* Different sizes for different breakpoints */}
      <Grid2 size={{ xs: 12, md: 8 }}>
        <div>Main Content</div>
      </Grid2>
      
      {/* Simple numeric value for all breakpoints */}
      <Grid2 size={6}>
        <div>Half Width</div>
      </Grid2>
    </Grid2>
  );
};

// ========================================
// Option 2: Using Legacy Grid (Still supported in MUI v7)
// ========================================
// Legacy Grid uses individual breakpoint props (xs, sm, md, lg, xl)
export const LegacyGridExample = () => {
  return (
    <Grid container spacing={3}>
      {/* Old syntax with item prop and breakpoint props */}
      <Grid item xs={12} sm={6} md={3}>
        <div>Item 1</div>
      </Grid>
      
      <Grid item xs={12} md={8}>
        <div>Main Content</div>
      </Grid>
      
      <Grid item xs={6}>
        <div>Half Width</div>
      </Grid>
    </Grid>
  );
};

// ========================================
// Common Mistakes and Solutions
// ========================================

// ❌ WRONG: Mixing Grid2 syntax with legacy Grid component
// This causes TypeScript errors
const WrongExample1 = () => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}> {/* Error: 'size' doesn't exist on Grid */}
        <div>Content</div>
      </Grid>
    </Grid>
  );
};

// ❌ WRONG: Using legacy syntax with Grid2
const WrongExample2 = () => {
  return (
    <Grid2 container spacing={3}>
      <Grid2 item xs={12} md={6}> {/* Error: 'item', 'xs', 'md' don't exist on Grid2 */}
        <div>Content</div>
      </Grid2>
    </Grid2>
  );
};

// ✅ CORRECT: Choose one approach and stick with it
// Option A: Import Grid2 and use size prop
import { Grid2 } from '@mui/material';

const CorrectExample1 = () => {
  return (
    <Grid2 container spacing={3}>
      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <div>Content</div>
      </Grid2>
    </Grid2>
  );
};

// Option B: Import Grid and use legacy syntax
import { Grid } from '@mui/material';

const CorrectExample2 = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <div>Content</div>
      </Grid>
    </Grid>
  );
};

// ========================================
// Migration Strategy
// ========================================
// If you're seeing type errors with Grid, you have two options:

// 1. Switch to Grid2 (Recommended for new code):
//    - Import Grid2 instead of Grid
//    - Replace breakpoint props with size prop
//    - Remove 'item' prop

// 2. Keep using legacy Grid:
//    - Make sure you're importing Grid (not Grid2)
//    - Use 'item' prop on child components
//    - Use individual breakpoint props (xs, sm, md, lg, xl)

// Example migration:
// Before (legacy Grid):
<Grid container spacing={2}>
  <Grid item xs={12} md={6}>
    <Paper>Content</Paper>
  </Grid>
</Grid>

// After (Grid2):
<Grid2 container spacing={2}>
  <Grid2 size={{ xs: 12, md: 6 }}>
    <Paper>Content</Paper>
  </Grid2>
</Grid2>