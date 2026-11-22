export type Currency = 'EUR' | 'USD';
export type ReceiptSource = 'gallery' | 'camera';
export type ReceiptScanStatus = 'analyzing' | 'reviewed';

export interface User {
  email: string;
  username: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  date: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  createdAt: string;
}

export interface ReceiptScanJob {
  id: string;
  tripId: string;
  uploadedBy: string;
  source: ReceiptSource;
  imageUri: string;
  status: ReceiptScanStatus;
  createdAt: string;
}

export interface Trip {
  id: string;
  name: string;
  description: string;
  currency: Currency;
  members: string[];
  expenses: Expense[];
  messages: ChatMessage[];
  receiptScans: ReceiptScanJob[];
}

// Tipovi konteksta
export interface AuthContextType {
  user: User | null;
  login: (email: string, username?: string) => void;
  logout: () => void;
}

export interface TripsContextType {
  trips: Trip[];
  addTrip: (name: string, description: string, currency: Currency) => string;
  addMemberToTrip: (tripId: string, username: string) => boolean;
  addExpenseToTrip: (tripId: string, title: string, amount: number, paidBy: string) => void;
  addMessageToTrip: (tripId: string, text: string) => void;
  submitReceiptForAiReview: (
    tripId: string,
    imageUri: string,
    source: ReceiptSource
  ) => Promise<ReceiptScanJob | null>;
}