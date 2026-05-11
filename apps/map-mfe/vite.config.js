import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'map_mfe',
      filename: 'remoteEntry.js',
      exposes: {
        './FederatedMap': './src/FederatedMap.jsx',
        './ParkingArea': './src/ParkingArea.jsx',
        './LaserShow': './src/LaserShow.jsx',
        './AkharaRegistration': './src/AkharaRegistration.jsx',
        './LostAndFound': './src/LostAndFound.jsx',
        './WorkerRegistration': './src/WorkerRegistration.jsx',
        './FacilitiesLayout': './src/FacilitiesLayout.jsx',
        './FoodVendorRegistration': './src/FoodVendorRegistration.jsx',
        './MedicalAssistance': './src/MedicalAssistance.jsx',
        './RationManagement': './src/RationManagement.jsx',
        './DonationManagement': './src/DonationManagement.jsx',
        './CrowdManagement': './src/CrowdManagement.jsx'
      },
      shared: ['react', 'react-dom']
    })
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  },
  server: {
    cors: true,
  }
})
