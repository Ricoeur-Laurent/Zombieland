"use client";

import { useState, FormEvent } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

import { LogIn } from "lucide-react";
import { useTokenContext } from "@/context/ TokenProvider";

export default function ConnexionForm() {
  const { setToken } = useTokenContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("votre@email.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials or server error");
      }

      const data = await response.json();
      setToken(data.token);

      const redirectPath = searchParams.get("redirect");
      router.push(redirectPath || "/reservations");
    } catch (e: any) {
      console.error(e);
      setError("Identifiants invalides ou erreur serveur.");
    }
  };

  // handle submit for testing

  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   setError("");
  
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 1000)); // simulation of an api call
  
  //     // simulation working :
  //     const fakeToken = "token_de_test_zombieland";
  //     setToken(fakeToken);
  
  //     const redirectPath = searchParams.get("redirect");
  //     router.push(redirectPath || "/reservations");
  
  //     // // error testing , comment lines above and active line under:
  //     // throw new Error("Erreur simulée");
  //   } catch (e: any) {
  //     console.error(e);
  //     setError("Identifiants invalides ou erreur serveur simulée.");
  //   }
  // };
  

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-xl mx-auto bg-surface bg-opacity-90 backdrop-blur-sm p-6 rounded-lg border border-primary shadow-lg"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-primary-light font-subtitle uppercase tracking-wide text-xl">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-bg text-text border border-muted rounded-lg px-3 py-2 focus:outline-none focus:border-primary placeholder:text-muted font-body text xl"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-primary-light font-subtitle uppercase tracking-wide text-xl">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-bg text-text border border-muted rounded-lg px-3 py-2 focus:outline-none focus:border-primary placeholder:text-muted font-body text-xl"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm font-body">{error}</p>
      )}

      <button
        type="submit"
        className="bg-primary text-black font-subtitle uppercase tracking-wide py-2 rounded-lg hover:bg-primary-dark transition flex items-center justify-center gap-2"
      >
        <LogIn size={18} />
        Me connecter
      </button>
    </form>
  );
}
