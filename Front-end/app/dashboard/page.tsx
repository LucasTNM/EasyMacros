"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Utensils, User, Settings, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export default function DashboardPage() {
  const [userData, setUserData] = useState({
    nome: "",
    email: "",
    userInfo: {
      idade: 0,
      sexo: "",
      peso: 0,
      altura: 0,
      nivelAtividade: "",
      objetivo: "",
    },
    userMetabolism: {
      taxaMetabolicaBasal: 0,
      gastoTotalDiario: 0,
      consumo: 0,
      calorias: 0,
      proteinas: 0,
      carboidratos: 0,
      gorduras: 0,
    },
    Chat: {
      dieta: "",
      ultimaRequisicao: "",
    }
  });

  const [dietPlan, setDietPlan] = useState<{ title: string; items: string[] }[]>([]);

  const apiUser = axios.create({
    baseURL: "https://easymacros.onrender.com/api/user",
    withCredentials: true,
  });

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {

        const emailResponse = await apiUser.get(`/email`, { withCredentials: true });
        const email = emailResponse.data.email;

        if (!email) {
          router.push('/login');
        }

        const response = await apiUser.get(`/find/${email}`,);

        if (!response.data) {
          throw new Error("Failed to fetch user data");
        }

        const data = response.data;

        if (!data.userInfo || !data.userMetabolism) {
          throw new Error("Incomplete user data");
        }

        const dieta = data.Chat.dieta || "Nenhuma dieta disponível no momento.";
        const processedDiet = processDietResponse(dieta);
        setDietPlan(processedDiet);

        setUserData({
          nome: data.nome,
          email: data.email,
          userInfo: {
            idade: data.userInfo.idade,
            sexo: data.userInfo.sexo,
            peso: data.userInfo.peso,
            altura: data.userInfo.altura,
            nivelAtividade: data.userInfo.nivelAtividade,
            objetivo: data.userInfo.objetivo,
          },
          userMetabolism: {
            taxaMetabolicaBasal: data.userMetabolism.taxaMetabolicaBasal,
            gastoTotalDiario: data.userMetabolism.gastoTotalDiario,
            consumo: data.userMetabolism.consumo,
            calorias: data.userMetabolism.calorias,
            proteinas: data.userMetabolism.proteinas,
            carboidratos: data.userMetabolism.carboidratos,
            gorduras: data.userMetabolism.gorduras,
          },
          Chat: {
            dieta: data.Chat.dieta,
            ultimaRequisicao: data.Chat.ultimaRequisicao,
          },
        });
      } catch (err) {
        console.error(err);
        router.push("/login");
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await apiUser.post(`/logout`);
    router.push("/login");
  };

  const handlePercentage = () => {
    const { proteinas, carboidratos, gorduras, consumo } = userData.userMetabolism;

    const caloriasProteinas = proteinas * 4;
    const caloriasCarboidratos = carboidratos * 4;
    const caloriasGorduras = gorduras * 9;

    const porcentagemProteinas = parseFloat(((caloriasProteinas / consumo) * 100).toFixed(2));
    const porcentagemCarboidratos = parseFloat(((caloriasCarboidratos / consumo) * 100).toFixed(2));
    const porcentagemGorduras = parseFloat(((caloriasGorduras / consumo) * 100).toFixed(2));

    return {
      porcentagemProteinas,
      porcentagemCarboidratos,
      porcentagemGorduras,
    };
  };

  const { porcentagemProteinas, porcentagemCarboidratos, porcentagemGorduras } = handlePercentage();

  const processDietResponse = (dieta: string) => {
    const sections = dieta.split(/(?=Café da manhã|Almoço|Lanche|Jantar|Total do dia)/g);

    const dietPlan = sections.map((section) => {
      const [title, ...items] = section.split(/-\s/).map((item) => item.trim());
      return {
        title: title.replace(":", ""),
        items: items.filter((item) => item),
      };
    });

    return dietPlan;
  };

  const calculateWaterIntake = (peso: number) => {
    const waterInmililiters = (peso * 35);
    return waterInmililiters;
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <Utensils className="h-6 w-6" />
            <span className="text-xl font-bold">EasyMacros</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="container">
          <h1 className="text-3xl font-bold mb-8">Bem vindo, {userData.nome}</h1>

          <Tabs defaultValue="macros" className="space-y-8">
            <TabsList>
              <TabsTrigger value="macros">Macronutrientes</TabsTrigger>
              <TabsTrigger value="diet">Sugestão de dieta</TabsTrigger>
              <TabsTrigger value="profile">Perfil</TabsTrigger>
            </TabsList>

            <TabsContent value="macros" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Calorias Diarias</CardTitle>
                    <CardDescription>Meta de calorias</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{userData.userMetabolism.consumo}</div>
                    <p className="text-xs text-muted-foreground">kcal</p>
                  </CardContent>
                </Card>
                <Card className="shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Proteinas</CardTitle>
                    <CardDescription>{porcentagemProteinas}% das calorias</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-3xl font-bold">{userData.userMetabolism.proteinas}g</div>
                    <Progress value={porcentagemProteinas} className="h-2" />
                  </CardContent>
                </Card>
                <Card className="shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Carboidratos</CardTitle>
                    <CardDescription>{porcentagemCarboidratos}% das calorias</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-3xl font-bold">{userData.userMetabolism.carboidratos}g</div>
                    <Progress value={porcentagemCarboidratos} className="h-2" />
                  </CardContent>
                </Card>
                <Card className="shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Gorduras</CardTitle>
                    <CardDescription>{porcentagemGorduras}% das calorias</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-3xl font-bold">{userData.userMetabolism.gorduras}g</div>
                    <Progress value={porcentagemGorduras} className="h-2" />
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-md mt-6">
                <CardHeader>
                  <CardTitle>Tabela de macros</CardTitle>
                  <CardDescription>Seu controle de macronutrientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full bg-primary"></div>
                          <span>Proteinas</span>
                        </div>
                        <span className="font-medium">{userData.userMetabolism.proteinas}g ({porcentagemProteinas}%)</span>
                      </div>
                      <Progress value={porcentagemProteinas} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                          <span>Carboidratos</span>
                        </div>
                        <span className="font-medium">{userData.userMetabolism.carboidratos}g ({porcentagemCarboidratos}%)</span>
                      </div>
                      <Progress value={porcentagemCarboidratos} className="h-2 bg-blue-100" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
                          <span>Gorduras</span>
                        </div>
                        <span className="font-medium">{userData.userMetabolism.gorduras}g ({porcentagemGorduras}%)</span>
                      </div>
                      <Progress value={porcentagemGorduras} className="h-2 bg-yellow-100" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="diet" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Plano de dieta sugerido</CardTitle>
                  <CardDescription>Baseado na necessidade dos seus macronutrientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {dietPlan.length > 0 ? (
                      dietPlan.map((section, index) => (
                        <div key={index}>
                          <h3 className="text-lg font-medium mb-2">{section.title}</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {section.items.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))
                    ) : (
                      <p>Nenhuma dieta disponível no momento.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dicas para Preparação de Refeições</CardTitle>
                  <CardDescription>Facilite a adesão à sua dieta</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Mantenha-se hidratado bebendo pelo menos {calculateWaterIntake(userData.userInfo.peso)} ml de água por dia</li>
                    <li>Prepare refeições em grande quantidade nos finais de semana para economizar tempo durante a semana</li>
                    <li>Use uma balança de cozinha para medir as porções com precisão</li>
                    <li>Armazene as refeições em recipientes com porções controladas</li>
                    <li>Mantenha lanches saudáveis sempre à mão para evitar escolhas não saudáveis</li>
                    <li>Ajuste seu plano alimentar com base no seu nível de atividade quando necessário</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>Your current metrics and settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="font-medium mb-2">Personal Information</h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Name:</dt>
                          <dd>{userData.nome}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Age:</dt>
                          <dd>{userData.userInfo.idade} years</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Gender:</dt>
                          <dd className="capitalize">{userData.userInfo.sexo}</dd>
                        </div>
                      </dl>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Body Metrics</h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Height:</dt>
                          <dd>{userData.userInfo.altura} cm</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Weight:</dt>
                          <dd>{userData.userInfo.peso} kg</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Activity Level:</dt>
                          <dd className="capitalize">{userData.userInfo.nivelAtividade.replace(/([A-Z])/g, " $1").trim()}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link href="/dashboard/profile/edit">
                      <Button>Edit Profile</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

