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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BillingDetails from "./billingDetails";
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
  const [openDropMenuId, setOpenDropMenuId] = React.useState<string | null>(
    null
  );
  const { formData } = UseModelSettings();
  const fetchSessionAndHistory = useCallback(async () => {
    try {
      const session = await getSession();
      if (session && session.user.id && chatId) {
        const allHistory = await getHistory({ userId: session.user.id });
        if (allHistory.data) {
          setHistory(allHistory.data);
        }
        // const tokenResponse = await getTotalToken({ userId: session.user.id });
        // if (tokenResponse.status === "error") {
        //   throw new Error(tokenResponse.message);
        // } else {
        //   const isFree = formData.apiKey === "" || formData.apiKey === "Free";
        //   const tokenData = tokenResponse.data.find((res: { apiKey: string }) => {
        //     if (isFree) {
        //       return res.apiKey === "Free";
        //     }
        //     return res.apiKey === formData.apiKey;
        //   });
        //   setToken(tokenData?.totalToken || 0);
        // }
      }
    } catch (e) {
      toast({ title: "Error", description: "Something went wrong" });
      console.error(e);
    }
  }, [router, messages,formData]);

  const getWidth = useCallback(() => {
    const maxBill = 50;
    const costPerMillion = 2.5;
    const totalCost = (token / 1_000_000) * costPerMillion;
    const width = (totalCost / maxBill) * 100;
    return Math.min(width, 100);
  }, [token]);

  const totalBill = useCallback(() => {
    const maxBill = 50;
    const costPerMillion = 2.5;
    const totalCost = (token / 1_000_000) * costPerMillion;
    return totalCost > maxBill ? maxBill.toFixed(2) : totalCost.toFixed(2);
  }, [token]);

  React.useEffect(() => {
    fetchSessionAndHistory();
  }, [router, token]);

  return (
    <div className="w-1/4 flex flex-col gap-4 h-full">
      <div className="w-full h-2/3 border border-primary/30 rounded-xl shadow-lg bg-white p-2 ">
        <p className="text-2xl tracking-widest py-4 px-2">Chat History</p>
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
              <div className="ml-auto">
                <DropdownMenu
                  open={openDropMenuId === h._id}
                  onOpenChange={(open) => {
                    if (open) {
                      setOpenDropMenuId(h._id);
                    } else {
                      setOpenDropMenuId(null);
                    }
                  }}>
                  <DropdownMenuTrigger asChild>
                    <div onClick={(e) => e.stopPropagation()}>
                      <EllipsisVertical className="h-5 w-5 text-primary" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Delete clicked for:", h._id);
                      }}>
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Archive clicked for:", h._id);
                      }}>
                      Archive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </button>
          ))}
        </div>
      </div>

      <BillingDetails
        setIsSettingsOpen={setIsSettingsOpen}
        isSettingsOpen={isSettingsOpen}
        isSettingModelOpen={isSettingModelOpen}
        setIsSettingModelOpen={setIsSettingModelOpen}
        totalBill={totalBill}
        getWidth={getWidth}
        token={token}
        setToken={setToken}
      />
    </div>
  );
}

export default Sidenav;
