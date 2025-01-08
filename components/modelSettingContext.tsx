"use client";
import { ModelSettingsType } from "@/app/types/types";
import React, {  ReactNode } from "react";

export const ModelContext = React.createContext<{
  formData: ModelSettingsType;
  setFormData: (data: ModelSettingsType) => void;
}>({
  formData: {
    user: false,
    apiType: "Free",
    tokenLimit: 500,
    apiKey: "Free",
    systemMessage: "",
    moneyLimit : 10,
    messageLength: 10,
  },
  setFormData: () => {},
});

export const ModelProvider = ({ children }: { children: ReactNode }) => {
  const [formData, SetFormData] = React.useState<ModelSettingsType>(() => {
    const saved = localStorage.getItem("formData");
    return saved ? JSON.parse(saved) : {
      user: false,
      apiType: "Free",
      tokenLimit: 500,
      apiKey: "Free",
      systemMessage: "",
      messageLength: 10,
      moneyLimit : 10,
    };
  });

  React.useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

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
