import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import VideoPage from './VideoPage.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* עמוד הבית עם הטופס הצהוב-כחול */}
        <Route path="/" element={<App />} />
        
        {/* עמוד הסרטון שאליו מגיעים מהמייל */}
        <Route path="/video-page" element={<VideoPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)