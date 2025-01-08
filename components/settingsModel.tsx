import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseModelSettings } from "./modelSettingContext";

function SettingsModel({
  isOpen,
  setToken,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
  setToken: (value: number) => void;
}) {
  const { formData, setFormData } = UseModelSettings();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl h-[70%] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Model Settings
          </DialogTitle>
          <DialogDescription>
            Configure your AI model parameters and API settings
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="api-type">API Type</Label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, apiType: value })
              }>
              <SelectTrigger id="api-type" className="w-full">
                <SelectValue placeholder="Select API provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini">Gemini</SelectItem>
                <SelectItem value="gpt">GPT</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              Choose between different AI model providers
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="token-limit">Token Limit</Label>
            <Input
              id="token-limit"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  tokenLimit: parseInt(e.target.value),
                });
              }}
              value={formData.tokenLimit}
              type="number"
              placeholder="Enter token limit"
              className="w-full"
            />
            <p className="text-sm text-gray-500">
              Maximum tokens per request (affects response length and cost)
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="money-limit">Money Limit</Label>
            <Input
              id="money-limit"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  moneyLimit: parseInt(e.target.value),
                });
              }}
              value={formData.moneyLimit}
              type="number"
              placeholder="Enter money limit"
              className="w-full"
            />
            <p className="text-sm text-gray-500">
              Maximum Cost set for API service
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              value={formData.apiKey}
              onChange={(e) =>
                setFormData({ ...formData, apiKey: e.target.value })
              }
              type="password"
              placeholder="Enter your API key"
              className="w-full"
            />
            <p className="text-sm text-gray-500">
              Your authentication key for accessing the AI service
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="system-message">System Message</Label>
            <Input
              id="system-message"
              value={formData.systemMessage}
              onChange={(e) =>
                setFormData({ ...formData, systemMessage: e.target.value })
              }
              type="text"
              placeholder="Enter system message"
              className="w-full"
            />
            <p className="text-sm text-gray-500">
              Initial prompt to set the AI's behavior and context
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="message-length">Message Length Limit</Label>
            <Input
              value={formData.messageLength}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  messageLength: parseInt(e.target.value),
                });
              }}
              id="message-length"
              type="number"
              placeholder="Enter message length limit"
              className="w-full"
            />
            <p className="text-sm text-gray-500">
              Maximum characters allowed per message
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              try {
                confirm("Are you sure you want to reset all settings?");
                setFormData({
                  user: false,
                  apiType: "Free",
                  tokenLimit: 500,
                  apiKey: "Free",
                  systemMessage: "",
                  messageLength: 10,
                  moneyLimit: 10,
                });
                onClose();
              } catch (e) {
                console.error(e);
              }
            }}
            className="mr-auto"
            variant="destructive">
            Reset
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => {
              console.log(formData);
              // if (formData.apiType.length < 42 ) {
              //   alert("Please select an API type");
              //   return;
              // }
              setFormData({ ...formData, user: true });
              setToken(0);
              onClose();
            }}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsModel;
