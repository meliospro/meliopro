import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppRole,
  Driver,
  DriverRegistrationInput,
  LocationPoint,
  PaymentMethod,
  PricingSettings,
  PromoCode,
  SupportTicket,
  Trip,
  TripStatus,
  VehicleCategory,
} from '../types';
import {
  DAKAR_LOCATIONS,
  KAOLACK_LOCATIONS,
  isWithinKaolackVille,
  DEFAULT_PRICING_SETTINGS,
  INITIAL_DRIVERS,
  INITIAL_PROMOS,
  INITIAL_TICKETS,
  INITIAL_TRIPS,
  VEHICLE_CATEGORIES,
} from '../data/mockData';
import { soundService } from '../utils/audio';
import {
  auth,
  db,
  loginWithGoogle as fbLoginWithGoogle,
  loginAnonymously as fbLoginAnonymously,
  logoutUser as fbLogoutUser,
  onAuthStateChanged,
  testFirestoreConnection,
  FirebaseUser,
} from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'ride' | 'promo' | 'payment' | 'safety' | 'driver';
  read: boolean;
}

interface TaxiContextType {
  role: AppRole;
  setRole: (role: AppRole) => void;
  isAndroidFrame: boolean;
  setIsAndroidFrame: (val: boolean) => void;

  // Firebase Auth & Cloud Status
  currentUser: FirebaseUser | null;
  isAuthLoading: boolean;
  firestoreConnected: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;

  // Client State
  clientLocation: LocationPoint;
  setClientLocation: (loc: LocationPoint) => void;
  destination: LocationPoint | null;
  setDestination: (loc: LocationPoint | null) => void;
  selectedCategory: VehicleCategory;
  setSelectedCategory: (cat: VehicleCategory) => void;
  selectedPayment: PaymentMethod;
  setSelectedPayment: (m: PaymentMethod) => void;
  appliedPromo: PromoCode | null;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;

  // Active Trip State
  activeTrip: Trip | null;
  tripStatus: TripStatus;
  requestRide: () => void;
  cancelRide: () => void;
  driverAcceptRide: () => void;
  driverArriveAtPickup: () => void;
  driverStartTrip: () => void;
  driverCompleteTrip: () => void;
  payActiveTrip: (
    method: PaymentMethod,
    txDetails?: { receiptNumber?: string; transactionId?: string; cardLast4?: string }
  ) => void;
  submitRating: (stars: number, tags: string[], comment: string) => void;
  resetTripToIdle: () => void;

  // Drivers Fleet State
  drivers: Driver[];
  activeDriver: Driver;
  toggleDriverOnline: () => void;
  approveDriver: (driverId: string) => void;
  suspendDriver: (driverId: string) => void;
  registerDriver: (data: DriverRegistrationInput) => Promise<{ success: boolean; message: string; driverId?: string }>;

  // History & Metrics
  trips: Trip[];
  tickets: SupportTicket[];
  createTicket: (ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt'>) => void;
  resolveTicket: (id: string) => void;
  promos: PromoCode[];
  pricing: PricingSettings;
  updatePricing: (newPricing: PricingSettings) => void;

  // Notifications
  notifications: NotificationItem[];
  addNotification: (title: string, message: string, type: NotificationItem['type']) => void;
  clearNotification: (id: string) => void;

  // Incoming ride request for Driver screen
  incomingDriverRide: Trip | null;
  driverRefuseIncomingRide: () => void;
}

const TaxiContext = createContext<TaxiContextType | undefined>(undefined);

export const TaxiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<AppRole>('client');
  const [isAndroidFrame, setIsAndroidFrame] = useState(true);

  // Firebase Auth & Cloud Firestore State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [firestoreConnected, setFirestoreConnected] = useState(false);

  // Client & Location State (Kaolack Ville)
  const [clientLocation, setClientLocation] = useState<LocationPoint>(KAOLACK_LOCATIONS[0]); // Médina Baye
  const [destination, setDestination] = useState<LocationPoint | null>(KAOLACK_LOCATIONS[1]); // Marché Central
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory>(VEHICLE_CATEGORIES[0]); // Moto Jakarta Standard (Kaolack)
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('WAVE');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  // Drivers
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const activeDriver = drivers[0]; // Mamadou Ndiaye

  // System Configuration
  const [pricing, setPricing] = useState<PricingSettings>(DEFAULT_PRICING_SETTINGS);
  const [promos] = useState<PromoCode[]>(INITIAL_PROMOS);
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);

  // Active Trip State
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [tripStatus, setTripStatus] = useState<TripStatus>('IDLE');
  const [incomingDriverRide, setIncomingDriverRide] = useState<Trip | null>(null);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Bienvenue sur SamaTaxi Kaolack ! 🇸🇳',
      message: 'Trajets en moto Jakarta limités exclusivement au périmètre de Kaolack Ville (200 FCFA / 500m).',
      time: 'Il y a 10 min',
      type: 'ride',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Promo Wave : -20% activée',
      message: 'Utilisez le code SAMATAXI20 pour votre première course.',
      time: 'Il y a 1 h',
      type: 'promo',
      read: false,
    },
  ]);

  // Test Firestore Connection & Listen to Auth changes on mount
  useEffect(() => {
    let isMounted = true;
    testFirestoreConnection().then((connected) => {
      if (isMounted) setFirestoreConnected(connected);
    });

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;
      setCurrentUser(user);
      setIsAuthLoading(false);
      if (user) {
        // Save user profile in Firestore
        try {
          await setDoc(
            doc(db, 'users', user.uid),
            {
              uid: user.uid,
              email: user.email || 'visiteur@samataxi.sn',
              displayName: user.displayName || 'Utilisateur SamaTaxi',
              photoURL: user.photoURL || '',
              role: 'client',
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (err) {
          console.warn('Firestore user profile sync:', err);
        }
      }
    });

    // Real-time Firestore synchronization for trips
    let unsubscribeTrips = () => {};
    try {
      const tripsCol = collection(db, 'trips');
      unsubscribeTrips = onSnapshot(
        tripsCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteTrips: Trip[] = [];
            snapshot.forEach((snapDoc) => {
              const data = snapDoc.data() as Trip;
              remoteTrips.push(data);
            });
            // Merge with INITIAL_TRIPS
            setTrips((prev) => {
              const map = new Map<string, Trip>();
              INITIAL_TRIPS.forEach((t) => map.set(t.id, t));
              remoteTrips.forEach((t) => map.set(t.id, t));
              return Array.from(map.values()).reverse();
            });
          }
        },
        (err) => {
          console.info('Firestore trips stream listener note:', err.message);
        }
      );
    } catch (e) {
      console.warn('Firestore listener initialization note:', e);
    }

    return () => {
      isMounted = false;
      unsubscribeAuth();
      unsubscribeTrips();
    };
  }, []);

  const loginWithGoogle = async () => {
    try {
      const user = await fbLoginWithGoogle();
      addNotification(
        'Connexion réussie ✅',
        `Bienvenue, ${user?.displayName || 'utilisateur'} ! Votre compte est connecté via Firebase Google Auth.`,
        'safety'
      );
    } catch (error: any) {
      console.error('Login error:', error);
      addNotification(
        'Erreur de connexion',
        'Impossible de se connecter avec Google pour le moment.',
        'safety'
      );
    }
  };

  const loginAsGuest = async () => {
    try {
      await fbLoginAnonymously();
      addNotification('Mode invité activé', 'Vous êtes connecté anonymement via Firebase.', 'safety');
    } catch (error) {
      console.error('Guest login error:', error);
    }
  };

  const logout = async () => {
    try {
      await fbLogoutUser();
      addNotification('Déconnexion effectuée', 'Vous avez été déconnecté de votre session.', 'safety');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const addNotification = (title: string, message: string, type: NotificationItem['type']) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      time: 'À l’instant',
      type,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Calculate Distance & Price based on coordinates (urban distance in Kaolack Ville)
  const calculateDistanceKm = (p1: LocationPoint, p2: LocationPoint) => {
    const latDiff = (p1.lat - p2.lat) * 111;
    const lngDiff = (p1.lng - p2.lng) * 111 * Math.cos((p1.lat * Math.PI) / 180);
    const dist = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
    return Math.max(parseFloat(dist.toFixed(1)), 0.5);
  };

  // Promo code validation
  const applyPromo = (code: string) => {
    const found = promos.find((p) => p.code.toUpperCase() === code.trim().toUpperCase() && p.isActive);
    if (found) {
      setAppliedPromo(found);
      addNotification('Code promo appliqué !', `${found.description} (${found.code})`, 'promo');
      return { success: true, message: `Code ${found.code} appliqué avec succès !` };
    }
    return { success: false, message: 'Code promo invalide ou expiré.' };
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  // Start ordering a ride - Strictly limited to Kaolack Ville
  const requestRide = () => {
    if (!destination) return;

    // Vérification stricte : limitation des trajets à Kaolack Ville
    const isPickupInside = isWithinKaolackVille(clientLocation.lat, clientLocation.lng, clientLocation.city);
    const isDestinationInside = isWithinKaolackVille(destination.lat, destination.lng, destination.city);

    if (!isPickupInside || !isDestinationInside) {
      addNotification(
        '⚠️ Trajet limité à Kaolack Ville',
        'Les courses SamaTaxi sont limitées exclusivement au périmètre urbain de Kaolack (Médina Baye, Léona, Kasnack, Ndorong, Sara, Bongré, etc.). Veuillez choisir des points situés à Kaolack.',
        'safety'
      );
      return;
    }

    const distance = calculateDistanceKm(clientLocation, destination);
    const duration = Math.round(distance * 1.8 + 4); // Trajet moto plus rapide dans le trafic de Kaolack

    // Calcul officiel SamaTaxi : 200 FCFA chaque 500 mètres (tranches de 500m)
    const distanceMeters = distance * 1000;
    const tranches500m = Math.max(1, Math.ceil(distanceMeters / 500));
    let rawPrice = tranches500m * 200;

    if (appliedPromo) {
      const discount = Math.min((rawPrice * appliedPromo.discountPercentage) / 100, appliedPromo.maxDiscountFCFA);
      rawPrice = Math.max(rawPrice - discount, 200);
    }
    const finalEstimatedPrice = Math.round(rawPrice);

    const newTrip: Trip = {
      id: `trip-${Date.now().toString().slice(-4)}`,
      clientName: 'Ousmane Fall',
      clientPhone: '+221 77 500 12 34',
      clientRating: 4.9,
      pickup: clientLocation,
      destination: destination,
      distanceKm: distance,
      durationMin: duration,
      category: selectedCategory,
      estimatedPrice: finalEstimatedPrice,
      finalPrice: finalEstimatedPrice,
      paymentMethod: selectedPayment,
      paymentStatus: 'pending',
      status: 'SEARCHING_DRIVER',
      requestedAt: 'À l’instant',
      routeProgress: 0,
    };

    setActiveTrip(newTrip);
    setTripStatus('SEARCHING_DRIVER');
    addNotification('Recherche d’un chauffeur...', 'Recherche des chauffeurs disponibles autour de votre position.', 'ride');

    // Persist new trip in Cloud Firestore
    try {
      setDoc(doc(db, 'trips', newTrip.id), {
        id: newTrip.id,
        clientId: currentUser?.uid || 'guest-client',
        clientName: currentUser?.displayName || newTrip.clientName,
        pickup: newTrip.pickup,
        destination: newTrip.destination,
        distanceKm: newTrip.distanceKm,
        durationMin: newTrip.durationMin,
        category: newTrip.category.name,
        estimatedPrice: newTrip.estimatedPrice,
        finalPrice: newTrip.finalPrice,
        paymentMethod: newTrip.paymentMethod,
        status: newTrip.status,
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Firestore trip save error:', e);
    }

    // Simulate dispatching to driver (either incoming popup on driver screen or auto-assign after 3.5s)
    setTimeout(() => {
      setIncomingDriverRide(newTrip);
      soundService.playRideRequestAlert();
    }, 1500);
  };

  // Driver or automatic acceptance
  const driverAcceptRide = () => {
    const chosenDriver = drivers.find((d) => d.isOnline) || activeDriver;
    setTripStatus('DRIVER_ASSIGNED');
    soundService.playSuccess();

    setActiveTrip((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        driverId: chosenDriver.id,
        driver: chosenDriver,
        status: 'DRIVER_ASSIGNED',
      };
    });

    setIncomingDriverRide(null);

    // Update driver status to on_trip
    setDrivers((prev) =>
      prev.map((d) => (d.id === chosenDriver.id ? { ...d, status: 'on_trip' } : d))
    );

    addNotification(
      'Chauffeur trouvé ! 🚗',
      `${chosenDriver.name} (${chosenDriver.car.model}, ${chosenDriver.car.plate}) est en route vers vous.`,
      'ride'
    );

    // Automatically progress driver from Assigned -> Arriving -> Arrived
    setTimeout(() => {
      setTripStatus('DRIVER_ARRIVING');
    }, 3000);

    setTimeout(() => {
      driverArriveAtPickup();
    }, 7000);
  };

  const driverRefuseIncomingRide = () => {
    setIncomingDriverRide(null);
  };

  const driverArriveAtPickup = () => {
    setTripStatus('DRIVER_ARRIVED');
    soundService.playDriverArrivedChime();
    addNotification(
      'Votre chauffeur est arrivé ! 🔔',
      'Retrouvez votre chauffeur au point de prise en charge.',
      'ride'
    );
  };

  const driverStartTrip = () => {
    setTripStatus('TRIP_STARTED');
    addNotification('Course commencée', 'Bon voyage avec SamaTaxi !', 'ride');
  };

  const driverCompleteTrip = () => {
    setTripStatus('TRIP_COMPLETED');
    soundService.playSuccess();
    addNotification('Course terminée 🎉', 'Merci d’avoir voyagé avec SamaTaxi !', 'ride');
  };

  const payActiveTrip = (
    method: PaymentMethod,
    txDetails?: { receiptNumber?: string; transactionId?: string; cardLast4?: string }
  ) => {
    if (!activeTrip) return;
    soundService.playSuccess();

    const completedTrip: Trip = {
      ...activeTrip,
      paymentMethod: method,
      paymentStatus: 'completed',
      status: 'PAID',
      completedAt: 'À l’instant',
    };

    setActiveTrip(completedTrip);
    setTripStatus('PAID');
    setTrips((prev) => [completedTrip, ...prev]);

    // Update in Firestore
    try {
      updateDoc(doc(db, 'trips', completedTrip.id), {
        status: 'PAID',
        paymentStatus: 'completed',
        paymentMethod: method,
        finalPrice: completedTrip.finalPrice,
        receiptNumber: txDetails?.receiptNumber || null,
        transactionId: txDetails?.transactionId || null,
        completedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Firestore payment update error:', e);
    }

    // Update driver wallet & trips
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === (completedTrip.driverId || activeDriver.id)) {
          const commission = (completedTrip.finalPrice * pricing.commissionPercentage) / 100;
          const net = completedTrip.finalPrice - commission;
          return {
            ...d,
            status: 'available',
            totalTrips: d.totalTrips + 1,
            walletBalance: d.walletBalance + net,
          };
        }
        return d;
      })
    );

    const methodLabel =
      method === 'WAVE'
        ? 'Wave Sénégal'
        : method === 'ORANGE_MONEY'
        ? 'Orange Money'
        : method === 'CARD'
        ? `Carte Bancaire (**** ${txDetails?.cardLast4 || '4242'})`
        : 'Espèces';

    addNotification(
      'Paiement validé avec succès ✅',
      `${completedTrip.finalPrice.toLocaleString('fr-FR')} FCFA réglé via ${methodLabel}${
        txDetails?.receiptNumber ? ` (Reçu #${txDetails.receiptNumber})` : ''
      }`,
      'payment'
    );
  };

  const submitRating = (stars: number, tags: string[], comment: string) => {
    if (!activeTrip) return;
    setTrips((prev) =>
      prev.map((t) =>
        t.id === activeTrip.id ? { ...t, rating: stars, ratingTags: tags, ratingComment: comment } : t
      )
    );
    addNotification('Merci pour votre avis ⭐', 'Votre retour nous aide à améliorer le service.', 'ride');
    resetTripToIdle();
  };

  const cancelRide = () => {
    setTripStatus('CANCELLED');
    setIncomingDriverRide(null);
    if (activeTrip?.driverId) {
      setDrivers((prev) =>
        prev.map((d) => (d.id === activeTrip.driverId ? { ...d, status: 'available' } : d))
      );
    }
    setTimeout(() => {
      resetTripToIdle();
    }, 1200);
  };

  const resetTripToIdle = () => {
    setActiveTrip(null);
    setTripStatus('IDLE');
    setIncomingDriverRide(null);
  };

  // Driver toggle online/offline
  const toggleDriverOnline = () => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === activeDriver.id ? { ...d, isOnline: !d.isOnline, status: !d.isOnline ? 'available' : 'offline' } : d))
    );
  };

  const approveDriver = (driverId: string) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driverId
          ? {
              ...d,
              verified: true,
              documentsStatus: {
                license: 'verified',
                idCard: 'verified',
                carRegistration: 'verified',
                insurance: 'verified',
              },
            }
          : d
      )
    );
    addNotification('Chauffeur approuvé', 'Le dossier du chauffeur a été validé.', 'driver');
  };

  const suspendDriver = (driverId: string) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === driverId ? { ...d, isOnline: false, status: 'offline', verified: false } : d))
    );
  };

  const registerDriver = async (
    data: DriverRegistrationInput
  ): Promise<{ success: boolean; message: string; driverId?: string }> => {
    if (!data.licenseNumber || data.licenseNumber.trim().length < 3) {
      return {
        success: false,
        message: 'Le permis de conduire est strictement obligatoire pour devenir chauffeur moto SamaTaxi.',
      };
    }

    const newDriverId = `drv-${Date.now().toString().slice(-4)}`;
    const newDriver: Driver = {
      id: newDriverId,
      name: data.name.trim(),
      phone: data.phone.trim(),
      photoUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 5.0,
      totalTrips: 0,
      isOnline: true,
      status: 'available',
      car: {
        brand: data.motoBrand || 'Bajaj',
        model: data.motoModel || 'Boxer 150',
        color: data.motoColor || 'Noir & Jaune Taxi',
        plate: data.plate ? data.plate.toUpperCase() : 'DK-8822-M',
        category: 'sama-moto',
        year: data.year || 2023,
      },
      location: {
        lat: 14.7180 + (Math.random() - 0.5) * 0.02,
        lng: -17.4660 + (Math.random() - 0.5) * 0.02,
        heading: 90,
      },
      verified: true,
      licenseNumber: data.licenseNumber.trim().toUpperCase(),
      licenseCategory: data.licenseCategory,
      licenseIssueDate: data.licenseIssueDate,
      hasHelmet: data.hasHelmet,
      documentsStatus: {
        license: 'verified',
        idCard: 'verified',
        carRegistration: 'verified',
        insurance: 'verified',
      },
      joinedDate: 'À l’instant',
      walletBalance: 0,
    };

    setDrivers((prev) => [newDriver, ...prev]);

    // Save to Firestore if available
    try {
      if (firestoreConnected && db) {
        await setDoc(doc(collection(db, 'drivers'), newDriverId), newDriver);
      }
    } catch (err) {
      console.warn('Firestore write driver error:', err);
    }

    addNotification(
      'Inscription Motard Réussie 🏍️',
      `Bienvenue ${newDriver.name} ! Votre permis (${newDriver.licenseNumber}) a été vérifié et activé.`,
      'driver'
    );

    return {
      success: true,
      message: 'Inscription validée avec succès ! Votre permis de conduire est certifié.',
      driverId: newDriverId,
    };
  };

  // Ticketing
  const createTicket = (ticketData: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt'>) => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randSeq = Math.floor(1000 + Math.random() * 9000);
    const newTicket: SupportTicket = {
      ...ticketData,
      id: `tkt-${Date.now()}`,
      ticketNumber: `ST-${dateStr}-${randSeq}`,
      createdAt: 'À l’instant',
      status: 'open',
    };
    setTickets((prev) => [newTicket, ...prev]);
    addNotification('Réclamation enregistrée 📁', `Ticket créé avec succès : ${newTicket.ticketNumber}`, 'safety');
  };

  const resolveTicket = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'resolved' } : t))
    );
  };

  const updatePricing = (newPricing: PricingSettings) => {
    setPricing(newPricing);
    addNotification('Tarifs mis à jour', 'La nouvelle grille tarifaire est appliquée à toutes les courses.', 'payment');
  };

  // Auto-progress simulated route if trip started
  useEffect(() => {
    if (tripStatus === 'TRIP_STARTED') {
      const interval = setInterval(() => {
        setActiveTrip((prev) => {
          if (!prev) return null;
          const currentProgress = prev.routeProgress || 0;
          if (currentProgress >= 100) {
            clearInterval(interval);
            driverCompleteTrip();
            return { ...prev, routeProgress: 100 };
          }
          return { ...prev, routeProgress: currentProgress + 10 };
        });
      }, 1200);

      return () => clearInterval(interval);
    }
  }, [tripStatus]);

  return (
    <TaxiContext.Provider
      value={{
        role,
        setRole,
        isAndroidFrame,
        setIsAndroidFrame,
        currentUser,
        isAuthLoading,
        firestoreConnected,
        loginWithGoogle,
        loginAsGuest,
        logout,
        clientLocation,
        setClientLocation,
        destination,
        setDestination,
        selectedCategory,
        setSelectedCategory,
        selectedPayment,
        setSelectedPayment,
        appliedPromo,
        applyPromo,
        removePromo,
        activeTrip,
        tripStatus,
        requestRide,
        cancelRide,
        driverAcceptRide,
        driverArriveAtPickup,
        driverStartTrip,
        driverCompleteTrip,
        payActiveTrip,
        submitRating,
        resetTripToIdle,
        drivers,
        activeDriver,
        toggleDriverOnline,
        approveDriver,
        suspendDriver,
        registerDriver,
        trips,
        tickets,
        createTicket,
        resolveTicket,
        promos,
        pricing,
        updatePricing,
        notifications,
        addNotification,
        clearNotification,
        incomingDriverRide,
        driverRefuseIncomingRide,
      }}
    >
      {children}
    </TaxiContext.Provider>
  );
};

export const useTaxi = () => {
  const context = useContext(TaxiContext);
  if (!context) {
    throw new Error('useTaxi must be used within a TaxiProvider');
  }
  return context;
};
