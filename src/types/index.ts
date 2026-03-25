export type UserRole = 'Admin' | 'Facility' | 'Superuser' | null;

export interface PriceListItem {
  id: string;
  itemCode: string;
  area: string;
  damageDescription: string;
  cost: number;
}

export interface Resident {
  reservationNumber: string;
  roomNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

export type CleanStatus = 'Awaiting PT Outgoing' | 'Completed' | 'Runner' | 'Needs Cleaning';
export type RepairStatus = 'Pending' | 'In Progress' | 'Completed' | 'None';

export interface Departure {
  departureId: string;
  reservationNumber: string;
  roomType: string;
  departDate: string;
  inspectedDate: string | null;
  originalBond: number;
  irregularCheckoutArrears: number;
  fmObservations: string;
  cleanStatus: CleanStatus;
  repairStatus: RepairStatus;
}

export interface DamageCharge {
  chargeId: string;
  departureId: string;
  priceListItemId: string;
  costOverride?: number;
  rectificationNote: string;
}

// Helper to bundle departure with resident info for UI
export interface PopulatedDeparture extends Departure {
  resident: Resident;
}

export type IrregularStatus = 'Lease Abandonment' | 'Lease Transfer' | 'Special Consideration';

export interface IrregularCheckout {
  id: string;
  month: string;
  reservationNumber: string;
  fullName: string;
  roomNumber: string;
  status: IrregularStatus;
  arrearsAmount: number;
  outstandingFees: number;
}

export interface ExtraCleaningCharge {
  id: string;
  dateLogged: string;
  roomNumber: string;
  chargeAmount: number;
  notes?: string;
}
