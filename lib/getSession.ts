// utils/getSession.js
import { jwtDecode } from "jwt-decode";
export function getSessionFromCookie() {
    const cookieName = "sb-access-token";
    const cookieValue = document.cookie
      .split("; ")
      .find(row => row.startsWith(cookieName))
      ?.split("=")[1];
    if (cookieValue) {
      try {
        // Decode the JWT token if needed (optional, depending on how you want to use it)
        const payload = jwtDecode(cookieValue);
        return payload;

      } catch (error) {
        console.error("Failed to parse session token", error);
        return null;
      }
    }
  
    return null;
  }
  