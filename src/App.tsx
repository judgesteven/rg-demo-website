import { Navigate, Route, Routes } from 'react-router-dom';
import { TopBar } from './components/TopBar';
import { Footer } from './components/Footer';
import { PlayerPage } from './player/PlayerPage';
import { TeamPage } from './team/TeamPage';

export function App() {
  return (
    <>
      <TopBar />
      <main id="main">
        <Routes>
          <Route path="/player" element={<PlayerPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="*" element={<Navigate to="/player" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
