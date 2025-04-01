"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Utensils, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"
import ThemeToggleButton from "@/components/theme-toggle-button"

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    altura: "",
    peso: "",
    sexo: "Masculino",
    objetivo: "Emagrecimento",
    nivelAtividade: "Moderado",
    calorias: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const apiUser = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/user`,
    withCredentials: true,
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const emailResponse = await apiUser.get(`/email`)
        const email = emailResponse.data.email

        const response = await apiUser.get(`/find/${email}`)
        const data = response.data

        setFormData({
          nome: data.nome || "",
          idade: data.userInfo.idade.toString() || "",
          altura: data.userInfo.altura.toString() || "",
          peso: data.userInfo.peso.toString() || "",
          sexo: data.userInfo.sexo || "Masculino",
          objetivo: data.userInfo.objetivo || "Emagrecimento",
          nivelAtividade: data.userInfo.nivelAtividade || "Moderado",
          calorias: data.userMetabolism.calorias || 0,
        })
      } catch (err) {
        console.error("Erro ao buscar dados do usuário:", err)
        router.push("/login")
      }
    }

    fetchUserData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const emailResponse = await apiUser.get(`/email`, { withCredentials: true });
      const email = emailResponse.data.email;
  
      if (!email) {
        router.push('/login');
        return;
      }

      const updateResponse = await apiUser.post(`/update/${email}`, formData);
      if (!updateResponse || !updateResponse.data) {
        throw new Error('Não foi possível fazer as mudanças');
      }
  
      const tmbResponse = await apiUser.post(`/tmbCalculator/${email}`);
      if (!tmbResponse || !tmbResponse.data) {
        throw new Error("Erro ao calcular TMB.");
      }

      const macrosResponse = await apiUser.post(`/macros/${email}`, { calorias: formData.calorias });
      if (!macrosResponse || !macrosResponse.data) {
        throw new Error("Erro ao calcular macros.");
      }
  
      setSuccess("Mudanças salvas com sucesso!");
  
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 500) {
        setError("O déficit de calorias deve ser menor. Por favor, ajuste o valor.");
      } else {
        console.error("Erro ao salvar mudanças:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Utensils className="h-6 w-6" />
            <span className="text-xl font-bold">EasyMacros</span>
          </Link>
          <ThemeToggleButton />
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-2xl">
          <div className="mb-6">
            <Link href="/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Macros
            </Link>
          </div>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Editar Perfil</CardTitle>
              <CardDescription>Atualize suas informações pessoais e medidas</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{error}</div>}
                {success && <div className="bg-green-50 text-green-500 p-3 rounded-md text-sm">{success}</div>}
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" name="nome" value={formData.nome} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Idade</Label>
                    <Input
                      id="age"
                      name="idade"
                      type="number"
                      value={formData.idade} onChange={handleChange} required />
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
                    <Label>Sexo</Label>
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
                <div className="space-y-2">
                  <Label>Nível de atividade</Label>
                  <RadioGroup
                    name="nivelAtividade"
                    value={formData.nivelAtividade}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, nivelAtividade: value }))}
                    className="grid grid-cols-1 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Sedentário" id="sedentary" />
                      <Label htmlFor="sedentary">Sedentário (pouco ou nenhum exercício)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Leve" id="light" />
                      <Label htmlFor="light">Leve (exercício 1-3 dias/semana)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Moderado" id="moderate" />
                      <Label htmlFor="moderate">Moderado (exercício 3-5 dias/semana)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Ativo" id="active" />
                      <Label htmlFor="active">Ativo (exercício 6-7 dias/semana)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Muito ativo" id="veryActive" />
                      <Label htmlFor="veryActive">Muito Ativo (exercício intenso diário)</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal">Sua meta</Label>
                  <Select
                    name="objetivo"
                    value={formData.objetivo}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, objetivo: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o seu objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Emagrecimento">Emagrecimento</SelectItem>
                      <SelectItem value="Manutenção">Manutenção de peso</SelectItem>
                      <SelectItem value="Ganho de massa">Ganho de massa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calorias">Quantidade de Calorias para ganho ou perda de peso (opcional)</Label>
                  <Input
                    id="calorias"
                    name="calorias"
                    type="number"
                    value={formData.calorias}
                    onChange={handleChange}
                    placeholder="Quantidade de calorias"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href="/dashboard">
                  <Button variant="outline">Cancelar</Button>
                </Link>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}

