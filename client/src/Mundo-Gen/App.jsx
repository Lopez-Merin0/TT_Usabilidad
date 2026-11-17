// rutas principales del proyecto TENER CUIDADOOOs
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import GameAudio from './GameAudio';
import WorldScreen from './WorldScreen';
import AuthScreen from '../LogIn/AuthScreen';
import LoginScreen from '../LogIn/LoginScreen';
import FirstMinigame from '../Primer-Game/FirstMinigame';
import SecondMinigame from '../Segundo-Game/SecondMinigame';
import ThirdMiniGame from '../Tercer-Game/ThirdMinigame';
import RegisterScreen from '../LogIn/RegisterScreen';
import Room from './Room';
import SoundControl from '../ui/SoundControl';

import { MinigameProgressProvider } from '../contexts/MinigameProgressContext';
import { Minigame2ProgressProvider } from '../contexts/Minigame2ProgressContext';
import { Minigame3ProgressProvider } from '../contexts/Minigame3ProgressContext';
import { GlobalProgressProvider } from '../contexts/GlobalProgressContext';

const isAuthenticated = () => {
  return localStorage.getItem('authToken') !== null;
};

// Revisa el token al momento de entrar a la ruta, no cuando se renderizó App.
// Si se evalúa dentro de App, el resultado queda guardado del primer render y
// después del login (sin recargar la página) sigue diciendo "no autenticado".
const RequireAuth = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

const FallbackRedirect = () => {
  return <Navigate to={isAuthenticated() ? '/room' : '/'} replace />;
};

const App = () => {
  const [isMusicEnabled, setIsMusicEnabled] = useState(
    () => {
      const savedState = localStorage.getItem('isMusicEnabled');
      return savedState !== null ? JSON.parse(savedState) : true;
    }
  );

  useEffect(() => {
    localStorage.setItem('isMusicEnabled', JSON.stringify(isMusicEnabled));
  }, [isMusicEnabled]);


  const toggleMusic = () => {
    setIsMusicEnabled(prev => !prev);
  };

  const [musicVolume, setMusicVolume] = useState(
    () => {
      const savedVolume = localStorage.getItem('musicVolume');
      return savedVolume !== null ? parseFloat(savedVolume) : 0.3;
    }
  );

  useEffect(() => {
    localStorage.setItem('musicVolume', musicVolume.toString());
  }, [musicVolume]);

  const getUserName = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        return parsedData.username || 'Player';
      } catch {
        return 'Player';
      }
    }
    return 'Player';
  };

  return (
    <GlobalProgressProvider>
      <MinigameProgressProvider>
        <Minigame2ProgressProvider>
          <Minigame3ProgressProvider>
            <Router>
              <GameAudio
                isMusicEnabled={isMusicEnabled}
                musicVolume={musicVolume}
              />

              <SoundControl
                isMusicEnabled={isMusicEnabled}
                musicVolume={musicVolume}
                onToggleMusic={toggleMusic}
                onMusicVolumeChange={setMusicVolume}
              />

              <Routes>
                <Route path="/" element={<AuthScreen />} />

                <Route path="/login" element={<LoginScreen />} />
                <Route path="/register" element={<RegisterScreen />} />

                <Route path="/primer mini juego" element={<FirstMinigame userName={getUserName()} />} />
                <Route path="/segundo mini juego" element={<SecondMinigame userName={getUserName()} />} />
                <Route path="/tercer mini juego" element={<ThirdMiniGame />} />

                <Route
                  path="/room"
                  element={
                    <RequireAuth>
                      <Room />
                    </RequireAuth>
                  }
                />

                <Route
                  path="/world"
                  element={
                    <RequireAuth>
                      <WorldScreen />
                    </RequireAuth>
                  }
                />

                <Route path="*" element={<FallbackRedirect />} />
              </Routes>
            </Router>
          </Minigame3ProgressProvider>
        </Minigame2ProgressProvider>
      </MinigameProgressProvider>
    </GlobalProgressProvider>
  );
};

export default App;