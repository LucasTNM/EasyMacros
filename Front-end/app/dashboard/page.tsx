"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Utensils, User, Settings, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [userData, setUserData] = useState({
    name: "John Doe",
    age: 30,
    height: 180,
    weight: 80,
    gender: "male",
    activityLevel: "moderate",
    macros: {
      calories: 2500,
      protein: 200,
      carbs: 250,
      fat: 83,
    },
  })

  const router = useRouter()

  useEffect(() => {
    // Here you would fetch user data from your backend
    // const fetchUserData = async () => {
    //   try {
    //     const token = localStorage.getItem('token')
    //     if (!token) {
    //       router.push('/login')
    //       return
    //     }
    //
    //     const response = await fetch('your-backend-url/api/user', {
    //       headers: { Authorization: `Bearer ${token}` }
    //     })
    //
    //     if (!response.ok) {
    //       throw new Error('Failed to fetch user data')
    //     }
    //
    //     const data = await response.json()
    //     setUserData(data)
    //   } catch (err) {
    //     console.error(err)
    //     router.push('/login')
    //   }
    // }
    //
    // fetchUserData()
  }, [router])

  const handleLogout = () => {
    // localStorage.removeItem('token')
    router.push("/login")
  }

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
          <h1 className="text-3xl font-bold mb-8">Welcome, {userData.name}</h1>

          <Tabs defaultValue="macros" className="space-y-8">
            <TabsList>
              <TabsTrigger value="macros">Macros</TabsTrigger>
              <TabsTrigger value="diet">Diet Suggestions</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="macros" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Daily Calories</CardTitle>
                    <CardDescription>Target intake</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{userData.macros.calories}</div>
                    <p className="text-xs text-muted-foreground">kcal</p>
                  </CardContent>
                </Card>
                <Card className="shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Protein</CardTitle>
                    <CardDescription>30% of calories</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-3xl font-bold">{userData.macros.protein}g</div>
                    <Progress value={30} className="h-2" />
                  </CardContent>
                </Card>
                <Card className="shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Carbohydrates</CardTitle>
                    <CardDescription>40% of calories</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-3xl font-bold">{userData.macros.carbs}g</div>
                    <Progress value={40} className="h-2" />
                  </CardContent>
                </Card>
                <Card className="shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Fat</CardTitle>
                    <CardDescription>30% of calories</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-3xl font-bold">{userData.macros.fat}g</div>
                    <Progress value={30} className="h-2" />
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-md mt-6">
                <CardHeader>
                  <CardTitle>Macro Breakdown</CardTitle>
                  <CardDescription>Your personalized macronutrient distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full bg-primary"></div>
                          <span>Protein</span>
                        </div>
                        <span className="font-medium">{userData.macros.protein}g (30%)</span>
                      </div>
                      <Progress value={30} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                          <span>Carbohydrates</span>
                        </div>
                        <span className="font-medium">{userData.macros.carbs}g (40%)</span>
                      </div>
                      <Progress value={40} className="h-2 bg-blue-100" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
                          <span>Fat</span>
                        </div>
                        <span className="font-medium">{userData.macros.fat}g (30%)</span>
                      </div>
                      <Progress value={30} className="h-2 bg-yellow-100" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="diet" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Diet Plan</CardTitle>
                  <CardDescription>Based on your macronutrient needs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Breakfast</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>3 eggs (18g protein, 15g fat)</li>
                        <li>1 slice whole grain toast (3g protein, 15g carbs, 1g fat)</li>
                        <li>1 cup Greek yogurt (20g protein, 8g carbs, 0g fat)</li>
                        <li>1 medium banana (1g protein, 27g carbs, 0g fat)</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Lunch</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>6oz grilled chicken breast (50g protein, 0g carbs, 6g fat)</li>
                        <li>1 cup brown rice (5g protein, 45g carbs, 2g fat)</li>
                        <li>2 cups mixed vegetables (4g protein, 20g carbs, 0g fat)</li>
                        <li>1 tablespoon olive oil (0g protein, 0g carbs, 14g fat)</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Dinner</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>6oz salmon (34g protein, 0g carbs, 14g fat)</li>
                        <li>1 medium sweet potato (2g protein, 24g carbs, 0g fat)</li>
                        <li>1 cup steamed broccoli (3g protein, 6g carbs, 0g fat)</li>
                        <li>1 tablespoon butter (0g protein, 0g carbs, 12g fat)</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Snacks</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>1 protein shake (25g protein, 5g carbs, 2g fat)</li>
                        <li>1/4 cup mixed nuts (6g protein, 8g carbs, 16g fat)</li>
                        <li>1 apple with 2 tbsp peanut butter (8g protein, 25g carbs, 16g fat)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Meal Prep Tips</CardTitle>
                  <CardDescription>Make sticking to your diet easier</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Prepare meals in bulk on weekends to save time during the week</li>
                    <li>Use a food scale to measure portions accurately</li>
                    <li>Store meals in portion-controlled containers</li>
                    <li>Keep healthy snacks readily available to avoid unhealthy choices</li>
                    <li>Stay hydrated by drinking at least 8 glasses of water daily</li>
                    <li>Adjust your meal plan based on your activity level each day</li>
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
                          <dd>{userData.name}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Age:</dt>
                          <dd>{userData.age} years</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Gender:</dt>
                          <dd className="capitalize">{userData.gender}</dd>
                        </div>
                      </dl>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Body Metrics</h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Height:</dt>
                          <dd>{userData.height} cm</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Weight:</dt>
                          <dd>{userData.weight} kg</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Activity Level:</dt>
                          <dd className="capitalize">{userData.activityLevel.replace(/([A-Z])/g, " $1").trim()}</dd>
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

