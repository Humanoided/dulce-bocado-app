"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function LogoutButton() {
  async function onLogout() {
    try {
      await fetch("/api/session", { method: "DELETE" });
      await signOut(auth);
    } catch (e) {
      console.error("Error al cerrar sesión:", e);
    } finally {
      
      window.location.href = "/login";
    }
  }

  return (
    <Button onClick={onLogout} variant="ghost" className="w-full justify-start">
      <LogOut className="mr-2 h-4 w-4" />
      <span>Cerrar Sesión</span>
    </Button>
  );
}
