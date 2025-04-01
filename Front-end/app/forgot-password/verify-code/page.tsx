"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Utensils } from "lucide-react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function VerifyCodePage() {
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const apiUser = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/user`,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  })

  useEffect(() => {
      const storedEmail = localStorage.getItem("email");
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
          throw new Error("Erro ao recuperar o email. Por favor, tente novamente mais tarde.");
      }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
        
        const response = await apiUser.post("/verifyResetCode", { email , code });
    
        if (!response || !response.data) {
          throw new Error("Código de redefinição inválido ou expirado. Por favor, tente novamente.");
        }
    
        setSuccess("Código verificado com sucesso! Você será redirecionado para criar uma nova senha.");
    
        setTimeout(() => {
          router.push("/forgot-password/verify-code/new-password");
        }, 2000);
      } catch (err: any) {
        setError(err.message || "Erro ao verificar o código. Por favor, tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" onClick={() => localStorage.removeItem(email)} className="flex items-center gap-2">
            <Utensils className="h-6 w-6" />
            <span className="text-xl font-bold">EasyMacros</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Esqueceu sua senha?</CardTitle>
            <CardDescription>Insira seu email para receber um link de recuperação</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{error}</div>}
              {success && <div className="bg-green-50 text-green-500 p-3 rounded-md text-sm">{success}</div>}
              <div className="space-y-2">
                <Label htmlFor="code">Código</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="XXXX"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar"}
              </Button>
              <div className="text-center text-sm">
                Lembrou sua senha?{" "}
                <Link href="/login" onClick={() => localStorage.removeItem(email)} className="text-primary hover:underline">
                  Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  )
}
