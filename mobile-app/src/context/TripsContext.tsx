import React, { createContext, useState, useContext } from 'react';
import { useAuth } from './AuthContext';
import {
  Expense,
  ChatMessage,
  ReceiptSource,
  ReceiptScanJob,
  Trip, 
  TripsContextType
} from '../types/index';

const TripsContext = createContext<TripsContextType>({
  trips: [],
  addTrip: () => '',
  addMemberToTrip: () => false,
  addExpenseToTrip: () => {},
  addMessageToTrip: () => {},
  submitReceiptForAiReview: async () => null,
});

export const TripsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);

  const addTrip = (name: string, description: string, currency: 'EUR' | 'USD'): string => {
    const currentUserName = user?.username || 'Ti';
    const newId = Date.now().toString();

    const newTrip: Trip = {
      id: newId,
      name: name.trim(),
      description: description.trim(),
      currency,
      members: [currentUserName],
      expenses: [],
      messages: [],
      receiptScans: [],
    };

    setTrips((prev) => [newTrip, ...prev]);
    return newId;
  };

  const addMemberToTrip = (tripId: string, username: string): boolean => {
    const cleanUsername = username.trim().replace(/^@/, '');
    if (!cleanUsername) return false;

    let added = false;
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        if (trip.members.includes(cleanUsername)) return trip;
        added = true;
        return {
          ...trip,
          members: [...trip.members, cleanUsername],
        };
      })
    );
    return added;
  };

  const addExpenseToTrip = (
    tripId: string,
    title: string,
    amount: number,
    paidBy: string
  ) => {
    if (!title.trim() || isNaN(amount) || amount <= 0) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      title: title.trim(),
      amount,
      paidBy: paidBy || user?.username || 'Ti',
      date: new Date().toLocaleDateString('hr-HR'),
    };

    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        return {
          ...trip,
          expenses: [newExpense, ...trip.expenses],
        };
      })
    );
  };

  const addMessageToTrip = (tripId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: user?.username || 'Ti',
      text: trimmed,
      createdAt: new Date().toLocaleTimeString('hr-HR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        return {
          ...trip,
          messages: [...trip.messages, newMessage],
        };
      })
    );
  };

  // pokrece zasebnu obradu slike racuna za AI pregled
  const submitReceiptForAiReview = async (
    tripId: string,
    imageUri: string,
    source: ReceiptSource
  ): Promise<ReceiptScanJob | null> => {
    if (!imageUri) return null;

    const jobId = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const newJob: ReceiptScanJob = {
      id: jobId,
      tripId,
      uploadedBy: user?.username || 'Ti',
      source,
      imageUri,
      status: 'analyzing',
      createdAt: new Date().toLocaleTimeString('hr-HR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        return {
          ...trip,
          receiptScans: [newJob, ...trip.receiptScans],
        };
      })
    );

    // kasnije ce bit backend poziv
    await new Promise((resolve) => setTimeout(resolve, 600));

    const completedJob: ReceiptScanJob = {
      ...newJob,
      status: 'reviewed',
    };

    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        return {
          ...trip,
          receiptScans: trip.receiptScans.map((item) =>
            item.id === jobId ? completedJob : item
          ),
        };
      })
    );

    return completedJob;
  };

  return (
    <TripsContext.Provider
      value={{
        trips,
        addTrip,
        addMemberToTrip,
        addExpenseToTrip,
        addMessageToTrip,
        submitReceiptForAiReview,
      }}
    >
      {children}
    </TripsContext.Provider>
  );
};

export const useTrips = () => useContext(TripsContext);