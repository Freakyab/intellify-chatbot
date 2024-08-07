import { Message } from "ai"

export interface Chat extends Record<string, any> {
  id: string,
  chatId: string
  userId: string,
  messages: JSON[]
}


export type JSONValue = string | number | boolean | JSONObject | JSONArray | null;
export interface JSONObject { [key: string]: JSONValue; }
export interface JSONArray extends Array<JSONValue> {}