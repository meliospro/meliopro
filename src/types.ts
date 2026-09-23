export type AppRole = 'client' | 'driver' | 'admin';

export type TripStatus =
  | 'IDLE'
  | 'SEARCHING_DRIVER'
  | 'DRIVER_ASSIGNED'
  | 'DRIVER_ARRIVING'
  | 'DRIVER_ARRIVED'
  | 'TRIP_STARTED'
  | 'TRIP_COMPLETED'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'CANCELLED';

export type PaymentMethod = 'CASH' | 'WAVE' | 'ORANGE_MONEY' | 'CARD';

export interface LocationPoint {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  icon?: 'home' | 'work' | 'airport' | 'shop' | 'beach' | 'landmark';
}

export interface VehicleCategory {
  id: string;
  name: string;
  subtitle: string;
  capacity: number;
  etaMinutes: number;
  basePrice: number;
  pricePerKm: number;
  pricePerMin: number;
  iconName: string;
  features: string[];
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  photoUrl: string;
  rating: number;
  totalTrips: number;
  isOnline: boolean;
  status: 'available' | 'on_trip' | 'offline' | 'incident';
  car: {
    model: string;
    brand: string;
    color: string;
    plate: string;
    category: string;
    year: number;
  };
  location: {
    lat: number;
    lng: number;
    heading: number;
  };
  verified: boolean;
  licenseNumber?: string;
  licenseCategory?: string;
  licenseIssueDate?: string;
  hasHelmet?: boolean;
  documentsStatus: {
    license: 'verified' | 'pending' | 'rejected';
    idCard: 'verified' | 'pending' | 'rejected';
    carRegistration: 'verified' | 'pending' | 'rejected';
    insurance: 'verified' | 'pending' | 'rejected';
  };
  joinedDate: string;
  walletBalance: number;
}

export interface DriverRegistrationInput {
  name: string;
  phone: string;
  cniNumber: string;
  motoBrand: string;
  motoModel: string;
  motoColor: string;
  plate: string;
  year: number;
  licenseNumber: string; // STRICTEMENT OBLIGATOIRE
  licenseCategory: string;
  licenseIssueDate: string;
  licenseImageUrl?: string;
  hasHelmet: boolean;
}

export interface Trip {
  id: string;
  clientName: string;
  clientPhone: string;
  clientRating: number;
  driverId?: string;
  driver?: Driver;
  pickup: LocationPoint;
  destination: LocationPoint;
  distanceKm: number;
  durationMin: number;
  category: VehicleCategory;
  estimatedPrice: number;
  finalPrice: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  receiptNumber?: string;
  status: TripStatus;
  requestedAt: string;
  completedAt?: string;
  rating?: number;
  ratingComment?: string;
  ratingTags?: string[];
  routeProgress?: number; // 0 to 100%
}

export interface PromoCode {
  id: string;
  code: string;
  discountPercentage: number;
  maxDiscountFCFA: number;
  description: string;
  expiryDate: string;
  isActive: boolean;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string; // ST-20260921-0012
  userId: string;
  userName: string;
  userType: 'client' | 'driver';
  category: 'trip_issue' | 'payment' | 'driver_behavior' | 'lost_item' | 'app_bug' | 'safety' | 'other';
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  tripId?: string;
}

export interface PricingSettings {
  baseFareEco: number;
  kmRateEco: number;
  minRateEco: number;
  baseFareComfort: number;
  kmRateComfort: number;
  minRateComfort: number;
  baseFareXL: number;
  kmRateXL: number;
  minRateXL: number;
  baseFarePremium: number;
  kmRatePremium: number;
  minRatePremium: number;
  commissionPercentage: number;
  minimumFare: number;
  cancellationFee: number;
}
