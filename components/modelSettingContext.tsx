"use client";
import { ModelSettingsType } from "@/app/types/types";
import React, { Children, ReactNode } from "react";

export const ModelContext = React.createContext<{
  formData: ModelSettingsType;
  setFormData: (data: ModelSettingsType) => void;
}>({
  formData: {
    user: false,
    apiType: "",
    tokenLimit: 500,
    apiKey: "",
    systemMessage: "",
    moneyLimit : 10,
    messageLength: 10,
  },
  setFormData: () => {},
});

export const ModelProvider = ({ children }: { children: ReactNode }) => {
  const [formData, SetFormData] = React.useState<ModelSettingsType>({
    user: false,
    apiType: "",
    tokenLimit: 500,
    apiKey: "",
    systemMessage: "",
    messageLength: 10,
    moneyLimit : 10,
  });

  return (
    <ModelContext.Provider
      value={{
        formData: formData,
        setFormData: SetFormData,
      }}>
      {children}
    </ModelContext.Provider>
  );
};

export const UseModelSettings = () => React.useContext(ModelContext);
