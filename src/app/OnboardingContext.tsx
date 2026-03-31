import React, { createContext, useContext, useState } from "react";

export type OnboardingData = {
  email?: string;
  fullName?: string;
  // Add more fields as needed for onboarding
  [key: string]: any;
};

export type OnboardingContextType = {
  data: OnboardingData;
  setData: (data: Partial<OnboardingData>) => void;
  reset: () => void;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage if available
  const [data, setDataState] = useState<OnboardingData>(() => {
    try {
      const stored = localStorage.getItem("onboardingData");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const setData = (newData: Partial<OnboardingData>) => {
    const updated = { ...data, ...newData };
    try {
      // Persist immediately so route guards that read localStorage can allow next-step navigation right away.
      localStorage.setItem("onboardingData", JSON.stringify(updated));
    } catch {}
    setDataState(updated);
  };

  const reset = () => {
    setDataState({});
    try {
      localStorage.removeItem("onboardingData");
    } catch {}
  };

  return (
    <OnboardingContext.Provider value={{ data, setData, reset }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}
