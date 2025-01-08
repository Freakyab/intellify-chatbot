import React from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { UseModelSettings } from "./modelSettingContext";
import { getSession } from "next-auth/react";
import { getTotalToken } from "@/app/actions/user";

const ApiSelection = ({
  isOpen,
  setIsOpen,
  setToken,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setToken: (value: number) => void;
}) => {
  const { setFormData, formData } = UseModelSettings();
  const [allKeys, setAllKeys] = React.useState<
    { apiKey: string; totalToken: number }[]
  >([]);
  const [selectedKey, setSelectedKey] = React.useState<string>("");
  const handleChange = () => {
    if (selectedKey === "") {
      return;
    }
    const tokenData = allKeys.find((res: { apiKey: string }) => {
      return res.apiKey === selectedKey;
    });
    setToken(tokenData?.totalToken || 0);
    setFormData({ ...formData, apiKey: tokenData?.apiKey || "", user: true });
    setIsOpen(false);
  };

  React.useEffect(() => {
    const fetchKeys = async () => {
      const session = await getSession();
      if (!session) {
        throw new Error("Session is null");
      }
      const tokenResponse = await getTotalToken({ userId: session.user.id });
      if (tokenResponse.status === "error") {
        throw new Error(tokenResponse.message);
      } else {
        const tokenData = tokenResponse.data.find((res: { apiKey: string }) => {
          return res.apiKey === formData.apiKey;
        });
        setToken(tokenData?.totalToken || 0);
        setAllKeys(tokenResponse.data);
      }
    };
    fetchKeys();
  }, []);

  return (
    <div>
      <Dialog
        key={"api-selection"}
        open={isOpen}
        onOpenChange={() => setIsOpen(false)}>
        <DialogContent>
          <div className="space-y-4">
            <p>Select API key</p>
            <select
              className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              onChange={(e) => setSelectedKey(e.target.value)}
              value={selectedKey}>
              {allKeys.map((key) => (
                <option key={key.apiKey} value={key.apiKey}>
                  {key.apiKey}
                </option>
              ))}
            </select>
            <div className="flex justify-between w-full">
              <Button onClick={() => setIsOpen(false)} variant="outline">
                Close
              </Button>
              <Button onClick={handleChange} >
                Select
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApiSelection;
