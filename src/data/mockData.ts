import { Driver, LocationPoint, PricingSettings, PromoCode, SupportTicket, Trip, VehicleCategory } from '../types';

// Périmètre géographique strict de Kaolack Ville
export const KAOLACK_BOUNDS = {
  minLat: 14.110,
  maxLat: 14.190,
  minLng: -16.120,
  maxLng: -16.030,
  cityName: 'Kaolack',
};

// Fonction de validation : trajets limités exclusivement à Kaolack Ville
export const isWithinKaolackVille = (lat: number, lng: number, city?: string): boolean => {
  if (city && city.trim().toLowerCase() !== 'kaolack') {
    // Si la ville n'est pas Kaolack
    return false;
  }
  return (
    lat >= KAOLACK_BOUNDS.minLat &&
    lat <= KAOLACK_BOUNDS.maxLat &&
    lng >= KAOLACK_BOUNDS.minLng &&
    lng <= KAOLACK_BOUNDS.maxLng
  );
};

export const KAOLACK_LOCATIONS: LocationPoint[] = [
  {
    id: 'loc-1',
    name: 'Médina Baye — Grande Mosquée',
    address: 'Place Barham, Médina Baye',
    city: 'Kaolack',
    lat: 14.1612,
    lng: -16.0682,
    icon: 'landmark',
  },
  {
    id: 'loc-2',
    name: 'Marché Central de Kaolack',
    address: 'Avenue Cheikh Ibrahima Niass, Centre-Ville',
    city: 'Kaolack',
    lat: 14.1482,
    lng: -16.0754,
    icon: 'shop',
  },
  {
    id: 'loc-3',
    name: 'Léona Niassène — Grande Mosquée',
    address: 'Quartier Léona Niassène, Kaolack',
    city: 'Kaolack',
    lat: 14.1554,
    lng: -16.0792,
    icon: 'landmark',
  },
  {
    id: 'loc-4',
    name: 'Grand Carrefour Kasnack',
    address: 'Intersection RN1 / Route de Gossas, Kasnack',
    city: 'Kaolack',
    lat: 14.1585,
    lng: -16.0881,
    icon: 'work',
  },
  {
    id: 'loc-5',
    name: 'Rond-point Ndorong',
    address: 'Boulevard Valdiodio Ndiaye, Ndorong',
    city: 'Kaolack',
    lat: 14.1422,
    lng: -16.0825,
    icon: 'home',
  },
  {
    id: 'loc-6',
    name: 'Gare Routière Ndiolofène (Garage Dakar)',
    address: 'Ndiolofène, Sortie Ouest RN1',
    city: 'Kaolack',
    lat: 14.1362,
    lng: -16.0715,
    icon: 'work',
  },
  {
    id: 'loc-7',
    name: 'Hôpital Régional El Hadji Ibrahima Niass',
    address: 'Avenue de l’Hôpital, Kaolack',
    city: 'Kaolack',
    lat: 14.1441,
    lng: -16.0652,
    icon: 'work',
  },
  {
    id: 'loc-8',
    name: 'Université du Sine Saloum (USSEIN)',
    address: 'Campus Kaolack / Sing Sing',
    city: 'Kaolack',
    lat: 14.1725,
    lng: -16.0855,
    icon: 'landmark',
  },
  {
    id: 'loc-9',
    name: 'Sara Nimzatt & Sara Guilèle',
    address: 'Quartier Sara Nimzatt, Kaolack Ouest',
    city: 'Kaolack',
    lat: 14.1495,
    lng: -16.0952,
    icon: 'home',
  },
  {
    id: 'loc-10',
    name: 'Quartier Bongré',
    address: 'Boulevard Valdiodio Ndiaye prolongé, Bongré',
    city: 'Kaolack',
    lat: 14.1438,
    lng: -16.0894,
    icon: 'home',
  },
  {
    id: 'loc-11',
    name: 'Dialègne & Berges du Saloum',
    address: 'Quartier Dialègne, Kaolack Sud',
    city: 'Kaolack',
    lat: 14.1392,
    lng: -16.0945,
    icon: 'work',
  },
  {
    id: 'loc-12',
    name: 'Ngane Saër & Alassane',
    address: 'Quartier Ngane, Kaolack Nord-Est',
    city: 'Kaolack',
    lat: 14.1662,
    lng: -16.0594,
    icon: 'home',
  },
  {
    id: 'loc-13',
    name: 'Port Fluvial de Kaolack (Saloum)',
    address: 'Zone Portuaire, Berges du Bras du Saloum',
    city: 'Kaolack',
    lat: 14.1352,
    lng: -16.0835,
    icon: 'work',
  },
  {
    id: 'loc-14',
    name: 'Koutal (Périphérie Sud)',
    address: 'Sortie Sud RN4, Kaolack',
    city: 'Kaolack',
    lat: 14.1205,
    lng: -16.0505,
    icon: 'work',
  }
];

// Alias pour compatibilité
export const DAKAR_LOCATIONS = KAOLACK_LOCATIONS;

export const VEHICLE_CATEGORIES: VehicleCategory[] = [
  {
    id: 'sama-moto',
    name: 'Moto Jakarta Standard (Kaolack)',
    subtitle: 'Rapide, idéale pour les ruelles et le marché de Kaolack • Casque fourni',
    capacity: 1,
    etaMinutes: 2,
    basePrice: 200,
    pricePerKm: 400, // 200 FCFA / 500m
    pricePerMin: 0,
    iconName: 'bike',
    features: ['1 Passager', 'Casque de protection fourni', '200 FCFA chaque 500m', 'Permis chauffeur vérifié'],
  },
  {
    id: 'sama-moto-confort',
    name: 'Maxi Moto Confort (Kaolack)',
    subtitle: 'Scooter 150cc • Assise grand confort avec dossier à Kaolack',
    capacity: 1,
    etaMinutes: 3,
    basePrice: 200,
    pricePerKm: 400, // 200 FCFA / 500m
    pricePerMin: 0,
    iconName: 'comfort',
    features: ['Assise grand confort', 'Casque intégral désinfecté', '200 FCFA chaque 500m', 'Dossier & repose-pieds'],
  },
  {
    id: 'sama-moto-express',
    name: 'Tiak-Tiak Express & Colis',
    subtitle: 'Livraison express urgente de colis et plis dans tout Kaolack Ville',
    capacity: 1,
    etaMinutes: 3,
    basePrice: 200,
    pricePerKm: 400, // 200 FCFA / 500m
    pricePerMin: 0,
    iconName: 'delivery',
    features: ['Transport de colis & plis', 'Sacoche étanche sécurisée', '200 FCFA chaque 500m', 'Remise contre signature'],
  },
];

export const INITIAL_DRIVERS: Driver[] = [
  {
    id: 'drv-1',
    name: 'Mamadou Ndiaye',
    phone: '+221 77 645 28 19',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 4.88,
    totalTrips: 1840,
    isOnline: true,
    status: 'available',
    car: {
      brand: 'Bajaj',
      model: 'Boxer 150cc',
      color: 'Noir & Jaune Taxi',
      plate: 'KL-4812-M',
      category: 'sama-moto',
      year: 2023,
    },
    location: {
      lat: 14.1520,
      lng: -16.0780,
      heading: 45,
    },
    verified: true,
    licenseNumber: 'SN-2021-48192',
    licenseCategory: 'Permis A (Moto)',
    licenseIssueDate: '2021-03-12',
    hasHelmet: true,
    documentsStatus: {
      license: 'verified',
      idCard: 'verified',
      carRegistration: 'verified',
      insurance: 'verified',
    },
    joinedDate: 'Mars 2024',
    walletBalance: 84500,
  },
  {
    id: 'drv-2',
    name: 'Cheikh Tidiane Diop',
    phone: '+221 78 312 90 44',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 4.92,
    totalTrips: 2150,
    isOnline: true,
    status: 'available',
    car: {
      brand: 'Yamaha',
      model: 'Crux 110',
      color: 'Jaune Kaolack',
      plate: 'KL-9021-M',
      category: 'sama-moto',
      year: 2022,
    },
    location: {
      lat: 14.1580,
      lng: -16.0850,
      heading: 120,
    },
    verified: true,
    licenseNumber: 'SN-2020-19283',
    licenseCategory: 'Permis A (Moto)',
    licenseIssueDate: '2020-07-22',
    hasHelmet: true,
    documentsStatus: {
      license: 'verified',
      idCard: 'verified',
      carRegistration: 'verified',
      insurance: 'verified',
    },
    joinedDate: 'Janvier 2024',
    walletBalance: 123000,
  },
  {
    id: 'drv-3',
    name: 'Fatou Binetou Sow',
    phone: '+221 76 890 12 34',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 4.95,
    totalTrips: 980,
    isOnline: true,
    status: 'available',
    car: {
      brand: 'Kymco',
      model: 'Agility 150 Maxi',
      color: 'Gris Métal',
      plate: 'KL-3341-M',
      category: 'sama-moto-confort',
      year: 2023,
    },
    location: {
      lat: 14.1440,
      lng: -16.0710,
      heading: 270,
    },
    verified: true,
    licenseNumber: 'SN-2022-77182',
    licenseCategory: 'Permis A (Moto)',
    licenseIssueDate: '2022-09-05',
    hasHelmet: true,
    documentsStatus: {
      license: 'verified',
      idCard: 'verified',
      carRegistration: 'verified',
      insurance: 'verified',
    },
    joinedDate: 'Juin 2024',
    walletBalance: 245000,
  },
  {
    id: 'drv-4',
    name: 'Moussa Bâ',
    phone: '+221 70 456 78 90',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    rating: 4.75,
    totalTrips: 640,
    isOnline: true,
    status: 'available',
    car: {
      brand: 'TVS',
      model: 'HLX 150',
      color: 'Bleu Nuit',
      plate: 'KL-7750-M',
      category: 'sama-moto-express',
      year: 2023,
    },
    location: {
      lat: 14.1620,
      lng: -16.0660,
      heading: 180,
    },
    verified: true,
    licenseNumber: 'SN-2023-55419',
    licenseCategory: 'Permis A (Moto)',
    licenseIssueDate: '2023-01-18',
    hasHelmet: true,
    documentsStatus: {
      license: 'verified',
      idCard: 'verified',
      carRegistration: 'verified',
      insurance: 'verified',
    },
    joinedDate: 'Octobre 2024',
    walletBalance: 61000,
  },
  {
    id: 'drv-5',
    name: 'Ibrahima Diallo',
    phone: '+221 77 123 45 67',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    rating: 4.81,
    totalTrips: 1120,
    isOnline: false,
    status: 'offline',
    car: {
      brand: 'Haojue',
      model: 'HJ125',
      color: 'Noir Ébène',
      plate: 'KL-1122-M',
      category: 'sama-moto',
      year: 2022,
    },
    location: {
      lat: 14.1480,
      lng: -16.0910,
      heading: 90,
    },
    verified: true,
    licenseNumber: 'SN-2019-38910',
    licenseCategory: 'Permis A (Moto)',
    licenseIssueDate: '2019-11-04',
    hasHelmet: true,
    documentsStatus: {
      license: 'verified',
      idCard: 'verified',
      carRegistration: 'verified',
      insurance: 'verified',
    },
    joinedDate: 'Février 2024',
    walletBalance: 42000,
  }
];

export const INITIAL_PROMOS: PromoCode[] = [
  {
    id: 'pr-1',
    code: 'KAOLACK20',
    discountPercentage: 20,
    maxDiscountFCFA: 1000,
    description: '-20% sur votre prochaine course dans tout Kaolack Ville',
    expiryDate: '31 Décembre 2026',
    isActive: true,
  },
  {
    id: 'pr-2',
    code: 'SALOUM10',
    discountPercentage: 10,
    maxDiscountFCFA: 600,
    description: 'Réduction de bienvenue Sine-Saloum pour vos trajets à Kaolack',
    expiryDate: '15 Novembre 2026',
    isActive: true,
  },
  {
    id: 'pr-3',
    code: 'BARHAM500',
    discountPercentage: 15,
    maxDiscountFCFA: 500,
    description: 'Spécial Médina Baye & Kasnack : voyagez serein avec SamaTaxi',
    expiryDate: '30 Novembre 2026',
    isActive: true,
  }
];

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trip-901',
    clientName: 'Ousmane Fall',
    clientPhone: '+221 77 500 12 34',
    clientRating: 4.9,
    driverId: 'drv-1',
    driver: INITIAL_DRIVERS[0],
    pickup: KAOLACK_LOCATIONS[0], // Médina Baye
    destination: KAOLACK_LOCATIONS[1], // Marché Central
    distanceKm: 2.1,
    durationMin: 7,
    category: VEHICLE_CATEGORIES[0], // Moto Jakarta
    estimatedPrice: 1000, // 5 tranches de 500m x 200 FCFA
    finalPrice: 1000,
    paymentMethod: 'WAVE',
    paymentStatus: 'completed',
    status: 'PAID',
    requestedAt: '21 Septembre 2026, 09:15',
    completedAt: '21 Septembre 2026, 09:22',
    rating: 5,
    ratingComment: 'Motard très prudent, casque propre et évitement impeccable des ruelles de Kaolack !',
    ratingTags: ['Chauffeur prudent', 'Casque propre', 'Rapide dans le trafic'],
  },
  {
    id: 'trip-902',
    clientName: 'Aminata Touré',
    clientPhone: '+221 78 220 99 88',
    clientRating: 5.0,
    driverId: 'drv-2',
    driver: INITIAL_DRIVERS[1],
    pickup: KAOLACK_LOCATIONS[4], // Rond-point Ndorong
    destination: KAOLACK_LOCATIONS[3], // Carrefour Kasnack
    distanceKm: 2.4,
    durationMin: 8,
    category: VEHICLE_CATEGORIES[0], // Moto Jakarta
    estimatedPrice: 1000, // 5 tranches de 500m x 200 FCFA
    finalPrice: 1000,
    paymentMethod: 'ORANGE_MONEY',
    paymentStatus: 'completed',
    status: 'PAID',
    requestedAt: '20 Septembre 2026, 18:30',
    completedAt: '20 Septembre 2026, 18:38',
    rating: 5,
    ratingComment: 'Arrivée en 8 minutes au carrefour Kasnack.',
    ratingTags: ['Conduite agréable', 'Ponctuel', 'Casque fourni'],
  },
  {
    id: 'trip-903',
    clientName: 'Jean Mendy',
    clientPhone: '+221 76 111 22 33',
    clientRating: 4.8,
    driverId: 'drv-4',
    driver: INITIAL_DRIVERS[3],
    pickup: KAOLACK_LOCATIONS[1], // Marché Central
    destination: KAOLACK_LOCATIONS[6], // Hôpital Régional
    distanceKm: 1.6,
    durationMin: 5,
    category: VEHICLE_CATEGORIES[2], // Tiak-Tiak Express
    estimatedPrice: 800, // 4 tranches de 500m x 200 FCFA
    finalPrice: 800,
    paymentMethod: 'CASH',
    paymentStatus: 'completed',
    status: 'PAID',
    requestedAt: '19 Septembre 2026, 11:45',
    completedAt: '19 Septembre 2026, 11:50',
    rating: 5,
    ratingComment: 'Colis urgent livré à l’Hôpital Régional très rapidement.',
    ratingTags: ['Livraison soignée', 'Rapide'],
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-1',
    ticketNumber: 'ST-20260921-0012',
    userId: 'user-client-1',
    userName: 'Ousmane Fall',
    userType: 'client',
    category: 'lost_item',
    subject: 'Portefeuille oublié dans le top-case de la moto',
    description: 'J’ai fait le trajet Médina Baye vers le Marché Central de Kaolack et j’ai laissé un petit carnet dans le coffre arrière de la moto Bajaj.',
    status: 'in_progress',
    createdAt: '21 Septembre 2026, 10:20',
    tripId: 'trip-901',
  },
  {
    id: 'tkt-2',
    ticketNumber: 'ST-20260920-0089',
    userId: 'drv-2',
    userName: 'Cheikh Tidiane Diop',
    userType: 'driver',
    category: 'payment',
    subject: 'Confirmation de virement Wave hebdomadaire motard',
    description: 'Vérification du solde de versement Wave pour les courses de moto du vendredi.',
    status: 'resolved',
    createdAt: '20 Septembre 2026, 19:40',
  }
];

export const DEFAULT_PRICING_SETTINGS: PricingSettings = {
  baseFareEco: 200, // 200 FCFA par 500m
  kmRateEco: 400, // 400 FCFA / km (2 x 200 FCFA)
  minRateEco: 0,
  baseFareComfort: 200,
  kmRateComfort: 400,
  minRateComfort: 0,
  baseFareXL: 200,
  kmRateXL: 400,
  minRateXL: 0,
  baseFarePremium: 200,
  kmRatePremium: 400,
  minRatePremium: 0,
  commissionPercentage: 15,
  minimumFare: 200, // 1 tranche minimum de 500m
  cancellationFee: 500,
};
