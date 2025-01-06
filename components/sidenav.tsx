import {
  ChartNoAxesCombined,
  EllipsisVertical,
  MessageCircle,
  Settings,
} from "lucide-react";
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { getHistory } from "@/app/actions/chat";
import { getSession } from "next-auth/react";
import { getTotalToken } from "@/app/actions/user";
import { Message } from "ai";
import { useToast } from "@/hooks/use-toast";
import SettingsModel from "./settingsModel";
import { UseModelSettings } from "./modelSettingContext";

function Sidenav({
  chatId,
  token,
  setToken,
  messages,
}: {
  chatId: string;
  token: number;
  messages: Message[];
  setToken: (token: number) => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { formData } = UseModelSettings();
  const [history, setHistory] = React.useState<
    {
      _id: string;
      title: string;
      chatId: string;
      userId: string;
    }[]
  >([]);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isSettingModelOpen, setIsSettingModelOpen] = React.useState(false);

  const fetchSessionAndHistory = useCallback(async () => {
    try {
      const session = await getSession();
      if (session && session.user.id && chatId) {
        const allHistory = await getHistory({ userId: session.user.id });
        if (allHistory.data) {
          setHistory(allHistory.data);
        }
        const tokenResponse = await getTotalToken({ userId: session.user.id });
        if (tokenResponse.status === "error") {
          throw new Error(tokenResponse.message);
        } else {
          setToken(tokenResponse.data[0].totalToken || 0);
        }
      }
    } catch (e) {
      toast({ title: "Error", description: "Something went wrong" });
      console.error(e);
    }
  }, [router, messages]);

  const getWidth = useCallback(() => {
    // 1 million = $2.50 , maxBill = $50
    const maxBill = 50;
    const costPerMillion = 2.5;
    const totalCost = (token / 1_000_000) * costPerMillion;
    const width = (totalCost / maxBill) * 100;
    
    if (width > 100) return 100;
    return width;
  }, [token]);

  const totalBill = useCallback(() => {
    // 1 million = $2.50 , maxBill = $50
    const maxBill = 50;
    const costPerMillion = 2.5;
    const totalCost = (token / 1_000_000) * costPerMillion;
    return totalCost > maxBill ? maxBill.toFixed(2) : totalCost.toFixed(2);
  }, [token]);
  
  React.useEffect(() => {
    fetchSessionAndHistory();
  }, [router, token]);

  return (
    <div className="w-1/4 flex flex-col gap-4 justify-center">
      {/* Add sidebar content here */}
      <div className="w-full h-2/3  border border-primary/30 rounded-xl shadow-lg bg-white p-2 ">
        <p className="text-2xl tracking-widest py-4 px-2">Chat History </p>
        <div className="overflow-auto w-full flex flex-col gap-3 max-h-[50vh]">
          {history.map((h) => (
            <button
              onClick={(e) => {
                e.preventDefault();
                router.push(`/${h.chatId}`);
              }}
              key={h._id}
              className="flex relative group bg-green-400/10 p-4 border items-center border-green-400 rounded-lg gap-4">
              <div className="p-2 bg-white rounded-full items-center">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <p>"{h.title}"</p>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("clicked");
                }}
                className="hidden group-hover:block absolute right-2 top-1/3 cursor-pointer">
                <EllipsisVertical className="h-5 w-5 text-primary" />
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col rounded-xl w-full  h-fit bg-green-400/20 p-4 border border-green-400 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between">
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
            <h2 className="text-xl font-semibold text-gray-900">
              User Details
            </h2>
          </div>
          <span className="px-3 py-1 text-sm font-medium text-primary bg-white rounded-full">
            Gemini API
          </span>
        </div>

        {/* Cost Section */}
        <div className="p-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">API Cost</span>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-xl font-semibold 
                ${
                  parseFloat(totalBill()) >= formData.moneyLimit - 1
                    ? "text-red-700"
                    : "text-gray-900"
                }
                `}>
                ${totalBill()}
              </span>
              <span className="text-sm text-gray-500">/ $50 limit</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${getWidth()}%` }}
            />
          </div>

          {/* Token Usage */}
          <div className="py-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tokens Used</span>
              <div className="flex items-baseline gap-1">
                <span
                  className="text-sm font-semibold text-gray-900 capitalize
              ">
                  {token.toLocaleString("en-US", {
                    notation: "compact",
                    compactDisplay: "long",
                  })}
                </span>
                <span className="text-sm text-gray-500">tokens</span>
              </div>
            </div>
            <SettingsModel
              isOpen={isSettingModelOpen}
              onClose={() => setIsSettingModelOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidenav;
