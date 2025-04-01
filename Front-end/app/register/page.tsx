"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import { Utensils } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from 'axios';
import ThemeToggleButton from "@/components/theme-toggle-button"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    idade: "",
    altura: "",
    peso: "",
    sexo: "Masculino",
    objetivo: "Emagrecimento",
    nivelAtividade: "Moderado",
    calorias: 0,
  })

  const apiUser = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    try {
      const response = await apiUser.post('/user/register', formData);

      if (response.data) {
        const tmbResponse = await apiUser.post(`user/tmbCalculator/${formData.email}`);
        if (!tmbResponse.data) throw new Error("Erro ao calcular TMB.");

        const macrosResponse = await apiUser.post(`/user/macros/${formData.email}`, { calorias: formData.calorias });
        if (!macrosResponse.data) throw new Error("Erro ao calcular macros.");

        const dietResponse = await apiUser.post(`/chat/generateDiet/${formData.email}`);
        if (!dietResponse.data) throw new Error("Erro ao gerar dieta.");
      }

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError(err.response.data.message);
      } else {
        setError("Erro ao registrar usuário. Tente novamente mais tarde.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <Utensils className="h-6 w-6" />
            <span className="text-xl font-bold">EasyMacros</span>
          </Link>
          <ThemeToggleButton />
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Criar uma Conta</CardTitle>
            <CardDescription>Insira seus dados para começar com EasyMacros</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{error}</div>}
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" name="nome" value={formData.nome} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="senha"
                  type="password"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  name="confirmarSenha"
                  type="password"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Idade</Label>
                  <Input id="age" name="idade" type="number" value={formData.idade} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    name="altura"
                    type="number"
                    value={formData.altura}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    name="peso"
                    type="number"
                    value={formData.peso}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gênero</Label>
                  <RadioGroup
                    name="sexo"
                    value={formData.sexo}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, sexo: value }))}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Masculino" id="male" />
                      <Label htmlFor="male">Masculino</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Feminino" id="female" />
                      <Label htmlFor="female">Feminino</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Objetivo</Label>
                  <RadioGroup
                    name="goal"
                    value={formData.objetivo}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, objetivo: value }))}
                    className="grid grid-cols-1 gap-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Emagrecimento" id="emagrecimento" />
                      <Label htmlFor="emagrecimento">Emagrecimento</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Manutenção" id="manutencao" />
                      <Label htmlFor="manutencao">Manutenção</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Ganho de massa" id="ganho" />
                      <Label htmlFor="ganho">Ganho de massa</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Nível de Atividade</Label>
                  <RadioGroup
                    name="activityLevel"
                    value={formData.nivelAtividade}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, nivelAtividade: value }))}
                    className="grid grid-cols-1 gap-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Sedentário" id="sedentary" />
                      <Label htmlFor="sedentary">Sedentário</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Leve" id="light" />
                      <Label htmlFor="light">Leve</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Moderado" id="moderate" />
                      <Label htmlFor="moderate">Moderado</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Ativo" id="active" />
                      <Label htmlFor="active">Ativo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Muito ativo" id="veryActive" />
                      <Label htmlFor="veryActive">Muito Ativo</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Criando Conta..." : "Registrar"}
              </Button>
              <div className="text-center text-sm">
                Já tem uma conta?{" "}
                <Link href="/login" className="text-primary hover:underline">
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

