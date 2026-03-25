import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PriceListItem, Resident, Departure, DamageCharge, UserRole, IrregularCheckout, ExtraCleaningCharge } from '../types';

// Seed Data
const initialPriceList: PriceListItem[] = [
  // Entry
  { id: 'E1', itemCode: 'E1', area: 'Entry', damageDescription: 'Door Handle Replacement', cost: 150.00 },
  { id: 'E3', itemCode: 'E3', area: 'Entry', damageDescription: 'Painting for the whole door', cost: 345.00 },
  { id: 'E4', itemCode: 'E4', area: 'Entry', damageDescription: 'Touch up paint/stains/scratches/dent repair (Up to 1sqm)', cost: 100.00 },
  // Kitchen
  { id: 'K2', itemCode: 'K2', area: 'Kitchen', damageDescription: 'Replacement Cooktop 2 by labour', cost: 230.00 },
  { id: 'K3', itemCode: 'K3', area: 'Kitchen', damageDescription: 'Siliconing Minor Crack/around basin', cost: 22.00 },
  { id: 'K4', itemCode: 'K4', area: 'Kitchen', damageDescription: 'Rangehood Assembly Replacement', cost: 225.00 },
  { id: 'K5', itemCode: 'K5', area: 'Kitchen', damageDescription: 'Rangehood Filter Replacement - too dirty', cost: 32.00 },
  { id: 'K6', itemCode: 'K6', area: 'Kitchen', damageDescription: 'Dent on the fridge/measured', cost: 20.00 },
  { id: 'K7', itemCode: 'K7', area: 'Kitchen', damageDescription: 'Sink Stopper Replacement S/S (11)', cost: 20.00 },
  { id: 'K8', itemCode: 'K8', area: 'Kitchen', damageDescription: 'GPO cover replacement', cost: 15.00 },
  { id: 'K9', itemCode: 'K9', area: 'Kitchen', damageDescription: 'Replacement Cooktop 1 by labour next price', cost: 159.00 },
  { id: 'K10', itemCode: 'K10', area: 'Kitchen', damageDescription: 'Fridge Replacement', cost: 977.50 },
  { id: 'K11', itemCode: 'K11', area: 'Kitchen', damageDescription: 'A small tray replacement (top)', cost: 25.50 },
  { id: 'K12', itemCode: 'K12', area: 'Kitchen', damageDescription: 'A large tray replacement (middle)', cost: 31.00 },
  { id: 'K13', itemCode: 'K13', area: 'Kitchen', damageDescription: 'A large tray replacement (bottom)', cost: 13.00 },
  { id: 'K14', itemCode: 'K14', area: 'Kitchen', damageDescription: 'Flipping cover fridge', cost: 48.00 },
  { id: 'K15', itemCode: 'K15', area: 'Kitchen', damageDescription: 'Sink Drain Strainer', cost: 15.00 },
  { id: 'K16', itemCode: 'K16', area: 'Kitchen', damageDescription: 'Fridge FJN243W', cost: 639.12 },
  { id: 'K17', itemCode: 'K17', area: 'Kitchen', damageDescription: 'Fridge Fruits and Veg Box 2025', cost: 52.72 },
  { id: 'K18', itemCode: 'K18', area: 'Kitchen', damageDescription: 'Fridge Shelf SR2283 Part 7', cost: 92.00 },
  { id: 'K19', itemCode: 'K19', area: 'Kitchen', damageDescription: 'Fridge Shelf SR2283 Part 8', cost: 55.00 },
  { id: 'K20', itemCode: 'K20', area: 'Kitchen', damageDescription: 'Fridge Shelf SR2243 Part 9', cost: 33.40 },
  { id: 'K21', itemCode: 'K21', area: 'Kitchen', damageDescription: 'Cupboard door hinge damaged- per replacement', cost: 8.40 },
  { id: 'K22', itemCode: 'K22', area: 'Kitchen', damageDescription: 'GPO replacement for RN 3.17 only', cost: 146.00 },
  { id: 'K23', itemCode: 'K23', area: 'Kitchen', damageDescription: 'Microwave replacement 2025', cost: 147.00 },
  { id: 'K24', itemCode: 'K24', area: 'Kitchen', damageDescription: 'Microwave plate 2025', cost: 28.00 },
  // Bedroom
  { id: 'B1', itemCode: 'B1', area: 'Bedroom', damageDescription: 'Single Mattress Replacement', cost: 245.00 },
  { id: 'B2', itemCode: 'B2', area: 'Bedroom', damageDescription: 'King Single Mattress Replacement', cost: 262.40 },
  { id: 'B3', itemCode: 'B3', area: 'Bedroom', damageDescription: 'Queen Mattress Replacement', cost: 302.50 },
  { id: 'B4', itemCode: 'B4', area: 'Bedroom', damageDescription: 'Single Bed Frame Replacement', cost: 156.40 },
  { id: 'B5', itemCode: 'B5', area: 'Bedroom', damageDescription: 'King Single Bed Frame Replacement', cost: 163.00 },
  { id: 'B6', itemCode: 'B6', area: 'Bedroom', damageDescription: 'Queen Bed Frame Replacement', cost: 195.00 },
  { id: 'B7', itemCode: 'B7', area: 'Bedroom', damageDescription: 'Blinds Replacement + labour', cost: 144.00 },
  { id: 'B8', itemCode: 'B8', area: 'Bedroom', damageDescription: 'Curtain Clean/Blind', cost: 50.00 },
  { id: 'B10', itemCode: 'B10', area: 'Bedroom', damageDescription: 'Smoke detector', cost: 100.00 },
  { id: 'B11', itemCode: 'B11', area: 'Bedroom', damageDescription: 'Deep dent/scratch need to be patched and repainted', cost: 90.00 },
  { id: 'B13', itemCode: 'B13', area: 'Bedroom', damageDescription: 'Chair replacement', cost: 160.00 },
  { id: 'B14', itemCode: 'B14', area: 'Bedroom', damageDescription: 'Mattress disposal 2025', cost: 55.00 },
  { id: 'B15', itemCode: 'B15', area: 'Bedroom', damageDescription: 'Wireless Master Replacement 2025', cost: 49.19 },
  { id: 'B17', itemCode: 'B17', area: 'Bedroom', damageDescription: '10Ah power adaptor missing', cost: 76.50 },
  { id: 'B19', itemCode: 'B19', area: 'Bedroom', damageDescription: 'Mattress disposal 2025', cost: 55.00 },
  { id: 'B20', itemCode: 'B20', area: 'Bedroom', damageDescription: 'Single Mattress Replacement 2025 + Disposal', cost: 300.00 },
  { id: 'B21', itemCode: 'B21', area: 'Bedroom', damageDescription: 'King Single Mattress Replacement 2025', cost: 264.00 },
  { id: 'B22', itemCode: 'B22', area: 'Bedroom', damageDescription: 'Queen Mattress Replacement and disposal (2025)', cost: 401.40 },
  { id: 'B24', itemCode: 'B24', area: 'Bedroom', damageDescription: 'King Single Bed Frame Replacement 2025', cost: 317.00 },
  { id: 'B26', itemCode: 'B26', area: 'Bedroom', damageDescription: 'Blind replacement MODEL 1 D/A/H (B/R/S/A)', cost: 145.00 },
  { id: 'B27', itemCode: 'B27', area: 'Bedroom', damageDescription: 'Wireless Master Replacement 2025', cost: 49.00 },
  { id: 'B28', itemCode: 'B28', area: 'Bedroom', damageDescription: 'Shower head replacement part for KS only', cost: 34.00 },
  { id: 'B29', itemCode: 'B29', area: 'Bedroom', damageDescription: 'Chair wheels replacement - one unit 2025', cost: 8.50 },
  { id: 'B30', itemCode: 'B30', area: 'Bedroom', damageDescription: 'Chair wheels replacement - two units 2025', cost: 17.00 },
  { id: 'B31', itemCode: 'B31', area: 'Bedroom', damageDescription: 'Chair wheels replacement - four units 2025', cost: 34.00 },
  { id: 'B32', itemCode: 'B32', area: 'Bedroom', damageDescription: 'Chair wheels replacement - base only 2025', cost: 34.00 },
  { id: 'B33', itemCode: 'B33', area: 'Bedroom', damageDescription: 'Blind replacement (for HK) 97x180x35', cost: 265.00 },
  { id: 'B34', itemCode: 'B34', area: 'Bedroom', damageDescription: 'Blind replacement (for HK) 61x180x35', cost: 124.00 },
  { id: 'B35', itemCode: 'B35', area: 'Bedroom', damageDescription: 'Blind replacement (for HK) 82x180x35', cost: 179.00 },
  { id: 'B36', itemCode: 'B36', area: 'Bedroom', damageDescription: 'Chair Cushion Replacement - 2025', cost: 30.00 },
  { id: 'B37', itemCode: 'B37', area: 'Bedroom', damageDescription: 'Blind replacement (for SYD) 86x180x35', cost: 126.00 },
  // Bathroom
  { id: 'T1', itemCode: 'T1', area: 'Bathroom', damageDescription: 'Chip at the wall (Sink area)/patch/paint', cost: 50.00 },
  { id: 'T2', itemCode: 'T2', area: 'Bathroom', damageDescription: 'Whole Walls patch/paint', cost: 315.00 },
  { id: 'T3', itemCode: 'T3', area: 'Bathroom', damageDescription: 'Door Frame Main', cost: 150.00 },
  { id: 'T4', itemCode: 'T4', area: 'Bathroom', damageDescription: 'Door Access/Handle damage or need to replace the whole set', cost: 150.00 },
  { id: 'T5', itemCode: 'T5', area: 'Bathroom', damageDescription: 'Chip/Dent on the bathroom door/patch/paint', cost: 50.00 },
  { id: 'T7', itemCode: 'T7', area: 'Bathroom', damageDescription: 'Standard clean shower', cost: 15.00 },
  { id: 'T8', itemCode: 'T8', area: 'Bathroom', damageDescription: 'drain stopper for face plate (2 pcs)', cost: 15.00 },
  { id: 'T9', itemCode: 'T9', area: 'Bathroom', damageDescription: 'Remove/fix any stickers via Missing SFW PRO?', cost: 80.00 },
  { id: 'T10', itemCode: 'T10', area: 'Bathroom', damageDescription: 'Sink Mixer 2025', cost: 182.00 },
  { id: 'T11', itemCode: 'T11', area: 'Bathroom', damageDescription: 'Sink Stopper 2025', cost: 41.57 },
  // Study
  { id: 'S1', itemCode: 'S1', area: 'Study', damageDescription: 'New Chair', cost: 160.00 },
  { id: 'S2', itemCode: 'S2', area: 'Study', damageDescription: 'Pinboard Replacement (damaged)', cost: 30.00 },
  { id: 'S3', itemCode: 'S3', area: 'Study', damageDescription: 'Dirty Chair Fabric cleaning (Single)', cost: 10.00 },
  { id: 'S4', itemCode: 'S4', area: 'Study', damageDescription: 'Dirty Chair Fabric cleaning (Multiple)', cost: 7.00 },
  { id: 'S5', itemCode: 'S5', area: 'Study', damageDescription: 'USB cable for desk lamp', cost: 15.00 },
  { id: 'S6', itemCode: 'S6', area: 'Study', damageDescription: 'Desk lamp', cost: 48.00 },
  { id: 'S7', itemCode: 'S7', area: 'Study', damageDescription: 'Missing/damaged bins', cost: 18.00 },
  { id: 'S8', itemCode: 'S8', area: 'Study', damageDescription: 'Desk lamp/Led /Panel Ceiling', cost: 44.00 },
  { id: 'S10', itemCode: 'S10', area: 'Study', damageDescription: 'Wardrobe Mirror Replacement', cost: 150.00 },
  { id: 'S11', itemCode: 'S11', area: 'Study', damageDescription: 'GPO Cover replacement', cost: 15.00 },
  { id: 'S12', itemCode: 'S12', area: 'Study', damageDescription: 'New Chair 2025', cost: 195.00 },
  { id: 'S14', itemCode: 'S14', area: 'Study', damageDescription: 'Wardrobe Mirror Replacement 2025', cost: 200.00 },
  // Others
  { id: 'O1', itemCode: 'O1', area: 'Others', damageDescription: 'Touch up Paint/stains or scratches repair by sand/patch/touch up paint - (1sq.M)', cost: 30.25 },
  { id: 'O2', itemCode: 'O2', area: 'Others', damageDescription: 'Remove any sticker or hook on wall- cost per hook', cost: 15.13 },
  { id: 'O3', itemCode: 'O3', area: 'Others', damageDescription: 'Paint wall, any 1 side wall only if too many patches on the same wall', cost: 350.00 },
  { id: 'O4', itemCode: 'O4', area: 'Others', damageDescription: 'Paint entire apartment', cost: 1550.00 },
  { id: 'O5', itemCode: 'O5', area: 'Others', damageDescription: 'Replace flooring for studio room', cost: 650.00 },
  { id: 'O6', itemCode: 'O6', area: 'Others', damageDescription: 'Replace flooring (Rate per M2)', cost: 45.00 },
  { id: 'O7', itemCode: 'O7', area: 'Others', damageDescription: 'Touch up Paint/stains, hole, or scratches- repair by sand/patch/touch', cost: 30.25 },
  { id: 'O8', itemCode: 'O8', area: 'Others', damageDescription: 'Remove any sticker or hook on wall, nail damage', cost: 30.25 },
  { id: 'O9', itemCode: 'O9', area: 'Others', damageDescription: 'Remove any sticker or hook on wall- cost per 2 hooks', cost: 30.25 },
  { id: 'O10', itemCode: 'O10', area: 'Others', damageDescription: 'Remove any sticker or hook on wall, caused nail damage, cost per 5', cost: 151.25 },
  { id: 'O11', itemCode: 'O11', area: 'Others', damageDescription: 'Remove any sticker or hook on wall- cost per 4 hooks', cost: 60.50 },
  { id: 'O12', itemCode: 'O12', area: 'Others', damageDescription: 'Labour per hour', cost: 35.00 },
  { id: 'O13', itemCode: 'O13', area: 'Others', damageDescription: 'Remove 3 hooks/sticker', cost: 45.38 },
  { id: 'O14', itemCode: 'O14', area: 'Others', damageDescription: 'Labour per half hour', cost: 18.15 },
  { id: 'O15', itemCode: 'O15', area: 'Others', damageDescription: 'O Touch up Paint/stains, hole, or scratches', cost: 30.25 },
  { id: 'O16', itemCode: 'O16', area: 'Others', damageDescription: 'Wireless Master + Hub + Missing bin', cost: 88.58 },
  { id: 'O17', itemCode: 'O17', area: 'Others', damageDescription: 'Remove any sticker or hook on wall- cost per 15 hooks', cost: 226.88 },
  { id: 'O18', itemCode: 'O18', area: 'Others', damageDescription: 'Remove any sticker or hook on wall- cost per 8 hooks', cost: 121.00 },
  { id: 'O19', itemCode: 'O19', area: 'Others', damageDescription: 'Remove any sticker or hook on wall, nail damage- cost per 4 hooks', cost: 121.00 },
  { id: 'O20', itemCode: 'O20', area: 'Others', damageDescription: 'Labour for 5 hours', cost: 151.25 },
];

interface AppContextType {
  isAuthenticated: boolean;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  priceList: PriceListItem[];
  setPriceList: React.Dispatch<React.SetStateAction<PriceListItem[]>>;
  residents: Resident[];
  setResidents: React.Dispatch<React.SetStateAction<Resident[]>>;
  addResident: (resident: Resident) => void;
  departures: Departure[];
  setDepartures: React.Dispatch<React.SetStateAction<Departure[]>>;
  updateDeparture: (departure: Departure) => void;
  addDeparture: (departure: Departure) => void;
  damageCharges: DamageCharge[];
  addDamageCharge: (charge: DamageCharge) => void;
  removeDamageCharge: (chargeId: string) => void;
  irregularCheckouts: IrregularCheckout[];
  setIrregularCheckouts: React.Dispatch<React.SetStateAction<IrregularCheckout[]>>;
  addIrregularCheckout: (checkout: IrregularCheckout) => void;
  extraCleaningCharges: ExtraCleaningCharge[];
  setExtraCleaningCharges: React.Dispatch<React.SetStateAction<ExtraCleaningCharge[]>>;
  addExtraCleaningCharge: (charge: ExtraCleaningCharge) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
  const [role, setRole] = useState<UserRole>(() => (localStorage.getItem('role') as UserRole) || null);
  
  // Initialize state from LocalStorage for unmigrated data
  const [priceList, setPriceList] = useState<PriceListItem[]>(() => {
    const saved = localStorage.getItem('priceList');
    return saved ? JSON.parse(saved) : initialPriceList;
  });

  const [damageCharges, setDamageCharges] = useState<DamageCharge[]>(() => {
    const saved = localStorage.getItem('damageCharges');
    return saved ? JSON.parse(saved) : [];
  });

  const [irregularCheckouts, setIrregularCheckouts] = useState<IrregularCheckout[]>(() => {
    const saved = localStorage.getItem('irregularCheckouts');
    return saved ? JSON.parse(saved) : [];
  });

  const [residents, setResidents] = useState<Resident[]>(() => {
    const saved = localStorage.getItem('residents');
    return saved ? JSON.parse(saved) : [];
  });

  const [departures, setDepartures] = useState<Departure[]>(() => {
    const saved = localStorage.getItem('departures');
    return saved ? JSON.parse(saved) : [];
  });

  const [extraCleaningCharges, setExtraCleaningCharges] = useState<ExtraCleaningCharge[]>(() => {
    const saved = localStorage.getItem('extraCleaningCharges');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync to LocalStorage
  useEffect(() => { localStorage.setItem('priceList', JSON.stringify(priceList)); }, [priceList]);
  useEffect(() => { localStorage.setItem('damageCharges', JSON.stringify(damageCharges)); }, [damageCharges]);
  useEffect(() => { localStorage.setItem('irregularCheckouts', JSON.stringify(irregularCheckouts)); }, [irregularCheckouts]);
  useEffect(() => { localStorage.setItem('residents', JSON.stringify(residents)); }, [residents]);
  useEffect(() => { localStorage.setItem('departures', JSON.stringify(departures)); }, [departures]);
  useEffect(() => { localStorage.setItem('extraCleaningCharges', JSON.stringify(extraCleaningCharges)); }, [extraCleaningCharges]);
  useEffect(() => { 
    if (role) localStorage.setItem('role', role); 
    else localStorage.removeItem('role');
  }, [role]);

  const login = async (username: string, pass: string) => {
    const savedUsers = localStorage.getItem('mock_users');
    const usersList = savedUsers ? JSON.parse(savedUsers) : [
      { id: 1, username: 'superuser', password: 'Qw3rty@123', role: 'Superuser' },
      { id: 2, username: 'admin', password: 'admin123', role: 'Admin' },
      { id: 3, username: 'facility', password: 'facility123', role: 'Facility' }
    ];
    
    if (!savedUsers) {
      localStorage.setItem('mock_users', JSON.stringify(usersList));
    }

    const found = usersList.find((u: any) => u.username === username && u.password === pass);
    if (found) {
      localStorage.setItem('token', `mock-jwt-${found.role.toLowerCase()}`);
      setRole(found.role as UserRole);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setRole(null);
  };

  const updateDeparture = async (updatedDeparture: Departure) => {
    setDepartures(prev => prev.map(dep => dep.departureId === updatedDeparture.departureId ? updatedDeparture : dep));
  };

  const addDeparture = async (newDeparture: Departure) => {
    setDepartures(prev => [...prev, newDeparture]);
  };

  const addResident = async (resident: Resident) => {
    setResidents(prev => [...prev, resident]);
  };

  const addExtraCleaningCharge = async (charge: ExtraCleaningCharge) => {
    setExtraCleaningCharges(prev => [...prev, charge]);
  };

  const addDamageCharge = (charge: DamageCharge) => setDamageCharges(prev => [...prev, charge]);
  const removeDamageCharge = (chargeId: string) => setDamageCharges(prev => prev.filter(c => c.chargeId !== chargeId));
  const addIrregularCheckout = (checkout: IrregularCheckout) => setIrregularCheckouts(prev => [...prev, checkout]);

  return (
    <AppContext.Provider value={{
      isAuthenticated, login, logout,
      role, setRole,
      priceList, setPriceList,
      residents, setResidents, addResident,
      departures, setDepartures, updateDeparture, addDeparture,
      damageCharges, addDamageCharge, removeDamageCharge,
      irregularCheckouts, setIrregularCheckouts, addIrregularCheckout,
      extraCleaningCharges, setExtraCleaningCharges, addExtraCleaningCharge
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
