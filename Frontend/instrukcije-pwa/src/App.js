import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom';
import Izbornik from './components/izbornik.component';
import Pocetna from './components/pocetna.component';
import NadzornaPloca from './components/nadzornaploca.component';
import Grupe from './components/grupa/grupe.component';
import DodajGrupa from './components/grupa/dodajGrupa.component';
import PromjeniGrupa from './components/grupa/promjeniGrupa.component';
import Polaznici from './components/polaznik/polaznici.component';
import DodajPolaznik from './components/polaznik/dodajPolaznik.component';
import PromjeniPolaznik from './components/polaznik/promjeniPolaznik.component';
import Predmeti from './components/predmet/predmeti.component';
import DodajPredmet from './components/predmet/dodajPredmet.component';
import PromjeniPredmet from './components/predmet/promjeniPredmet.component';
import Email from './components/grupa/email.component';
import Login from './components/login.component';
import Odjava from './components/odjava.component';

export default function App() {
  return (
    <Router>
      <Izbornik />
      <Routes>
        <Route path='/' element={<Pocetna />} />
        <Route path='/nadzornaploca' element={<NadzornaPloca />} />
        <Route path='/grupe' element={<Grupe />} />
        <Route path="/grupe/dodaj" element={<DodajGrupa />} />
        <Route path="/grupe/:sifra" element={<PromjeniGrupa />} />
        <Route path="/polaznici" element={<Polaznici />} />
        <Route path="/polaznici/dodaj" element={<DodajPolaznik />} />
        <Route path="/polaznici/:sifra" element={<PromjeniPolaznik />} />
        <Route path="/predmet" element={<Predmeti />} />
        <Route path="/predmeti/dodaj" element={<DodajPredmet />} />
        <Route path="/predmeti/:sifra" element={<PromjeniPredmet />} />
        <Route path="/predmeti/email/:sifra" element={<Email />} />
        <Route path="/login" element={<Login />} />
        <Route path="/odjava" element={<Odjava />} />
      </Routes>
     
    </Router>
  );
}
