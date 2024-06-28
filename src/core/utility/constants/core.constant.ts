import { CSSVariablesResolver, createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'primary',
  primaryShade: 7,
  colors: {
    primary: [
      '#e9f5ff',
      '#d6e4fa',
      '#acc7ee',
      '#80a8e4',
      '#5b8eda',
      '#437dd6',
      '#3575d4',
      '#2560b6',
      '#1c58a9',
      '#064c97',
    ],
  },
  cursorType: 'pointer',
});
const containerWidth = localStorage.getItem('role') === 'Admin' ? '85%' : '95%';
export const resolver: CSSVariablesResolver = () => ({
  variables: {
    '--mantine-font-family-headings': "'Inter', sans-serif",
    '--mantine-font-family': "'Inter', sans-serif",
    '--mantine-color-secondary': '#031837 ',
    '--mantine-color-grey': '#95A1B5',
    '--mantine-color-dark': '#202224',
    '--mantine-container-width-admin': '85%',
    '--mantine-container-width-user': '95%',
    '--mantine-header-height': '65px',
    '--mantine-body-bg': ' #F3F4F8',
    '--loader-color': 'var(--mantine-color-primary)',
    '--mantine-border-color': '#D3D8E2',
  },
  dark: {},
  light: {},
});
