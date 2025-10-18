"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const r = useRouter();
  const { toast } = useToast();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;

    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();
      await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      toast({ title: "Cuenta creada", description: `Has iniciado sesión como ${email}` });
      r.replace("/dashboard");
    } catch (err: any) {
      console.error(err);
      let msg = "No se pudo crear la cuenta.";
      if (err?.code === "auth/email-already-in-use") msg = "Ese correo ya está registrado.";
      if (err?.code === "auth/weak-password") msg = "La contraseña es muy débil (mínimo 6 caracteres).";
      // Firebase throws this when the sign-in provider (Email/Password) is not enabled
      if (err?.code === "auth/configuration-not-found")
        msg = "El proveedor de autenticación no está configurado en Firebase. Habilita 'Email/Password' en la consola de Firebase (Authentication → Sign-in method).";
      toast({ variant: "destructive", title: "Error", description: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Crear cuenta</CardTitle>
            <CardDescription>Regístrate para usar DulceBocado.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button className="w-full" disabled={loading} type="submit">
                {loading ? "Creando..." : "Registrarme"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <Link className="underline" href="/login">Inicia sesión</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
