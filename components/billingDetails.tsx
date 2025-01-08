import { ChartNoAxesCombined, Settings } from "lucide-react";
import React from "react";
import SettingsModel from "./settingsModel";
import { UseModelSettings } from "./modelSettingContext";
import { Progress } from "./ui/progress";
import ApiSelection from "./apiSelect";

function BillingDetails({
  setIsSettingsOpen,
  isSettingsOpen,
  setIsSettingModelOpen,
  isSettingModelOpen,
  totalBill,
  getWidth,
  token,
  setToken,
}: {
  setIsSettingsOpen: (value: boolean) => void;
  isSettingsOpen: boolean;
  isSettingModelOpen: boolean;
  setIsSettingModelOpen: (value: boolean) => void;
  totalBill: () => string;
  getWidth: () => number;
  token: number;
  setToken: (value: number) => void;
}) {
  const { formData } = UseModelSettings();
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="flex flex-col rounded-xl w-full h-[30vh] bg-green-400/20 p-4 border border-green-400 shadow-lg">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center gap-3">
          <div
            className="p-2 text-primary rounded-full bg-white"
            onMouseEnter={() => setIsSettingsOpen(true)}
            onMouseLeave={() => setIsSettingsOpen(false)}>
            {isSettingsOpen ? (
              <Settings
                onClick={() => setIsSettingModelOpen(true)}
                className="h-5 w-5 transform rotate-180 cursor-pointer"
                style={{ animation: "spin 2s linear" }}
              />
            ) : (
              <ChartNoAxesCombined className="h-5 w-5" />
            )}
          </div>
          <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
        </div>
        <span
          className="px-3 py-1 text-sm font-medium text-primary bg-white rounded-full cursor-pointer"
          onClick={() => setIsOpen(true)}>
          {!formData.user ? "Free" : formData.apiType}
        </span>
      </div>
        <ApiSelection
          setToken={setToken}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />

      <div className="p-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">API Cost</span>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-xl font-semibold ${
                parseFloat(totalBill()) >= formData.moneyLimit - 1
                  ? "text-red-700"
                  : "text-gray-900"
              }`}>
              ${totalBill()}
            </span>
            <span className="text-sm text-gray-500">/ $50 limit</span>
          </div>
        </div>
        <Progress value={getWidth()} />
        {/* <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${getWidth()}%` }}
          />
        </div> */}

        <div className="py-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Tokens Used</span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-semibold text-gray-900 capitalize">
                {token.toLocaleString("en-US", {
                  notation: "compact",
                  compactDisplay: "long",
                })}
              </span>
              <span className="text-sm text-gray-500">tokens</span>
            </div>
          </div>
          <SettingsModel
            setToken={setToken}
            isOpen={isSettingModelOpen}
            onClose={() => setIsSettingModelOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}

export default BillingDetails;
