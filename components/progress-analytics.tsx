"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Flame,
  Trophy,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Lightbulb,
  CheckCircle,
  Zap,
} from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Sample data for weekly streak
const streakData = [
  { day: "Mon", completed: 5, total: 5 },
  { day: "Tue", completed: 4, total: 5 },
  { day: "Wed", completed: 5, total: 5 },
  { day: "Thu", completed: 3, total: 5 },
  { day: "Fri", completed: 5, total: 5 },
  { day: "Sat", completed: 2, total: 3 },
  { day: "Sun", completed: 1, total: 2 },
]

// Sample data for subject time with yellow shades
const subjectTimeData = [
  { name: "Data Structures", hours: 8, color: "#FFD700" }, // Gold
  { name: "Machine Learning", hours: 6, color: "#FFA500" }, // Orange
  { name: "Web Development", hours: 5, color: "#FFFF00" }, // Yellow
  { name: "System Design", hours: 4, color: "#FFFFE0" }, // Light Yellow
  { name: "Mathematics", hours: 3, color: "#F0E68C" }, // Khaki
]

// Sample data for completion rate
const completionRateData = [
  { day: "Mon", rate: 100 },
  { day: "Tue", rate: 80 },
  { day: "Wed", rate: 100 },
  { day: "Thu", rate: 60 },
  { day: "Fri", rate: 100 },
  { day: "Sat", rate: 67 },
  { day: "Sun", rate: 50 },
]

// Custom label component for pie chart with dark orange text
const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="#CC5500"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function ProgressAnalytics() {
  const currentStreak = 5
  const totalHours = subjectTimeData.reduce((sum, subject) => sum + subject.hours, 0)
  const averageCompletionRate = Math.round(
    completionRateData.reduce((sum, day) => sum + day.rate, 0) / completionRateData.length,
  )
  const mostMissedSubject = "System Design"

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Professional Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 professional-shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-primary uppercase tracking-wide">
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Tooltip>
                  <TooltipTrigger>
                    <Flame className="h-8 w-8 text-red-500 mr-4 animate-professional-pulse" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Consecutive days of successful completion</p>
                  </TooltipContent>
                </Tooltip>
                <div className="text-4xl font-bold text-primary">{currentStreak}</div>
                <div className="text-lg font-medium text-muted-foreground ml-2">days</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20 bg-gradient-to-br from-secondary/5 to-secondary/10 professional-shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-secondary uppercase tracking-wide">
                Total Study Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Tooltip>
                  <TooltipTrigger>
                    <Trophy className="h-8 w-8 text-amber-500 mr-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total hours invested this week</p>
                  </TooltipContent>
                </Tooltip>
                <div className="text-4xl font-bold text-secondary">{totalHours}</div>
                <div className="text-lg font-medium text-muted-foreground ml-2">hrs</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 professional-shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-primary uppercase tracking-wide">
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Tooltip>
                  <TooltipTrigger>
                    <TrendingUp className="h-8 w-8 text-green-500 mr-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Average task completion percentage</p>
                  </TooltipContent>
                </Tooltip>
                <div className="text-4xl font-bold text-primary">{averageCompletionRate}</div>
                <div className="text-lg font-medium text-muted-foreground ml-1">%</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10 professional-shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-destructive uppercase tracking-wide">
                Requires Focus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Tooltip>
                  <TooltipTrigger>
                    <AlertTriangle className="h-8 w-8 text-amber-500 mr-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Subject requiring additional attention</p>
                  </TooltipContent>
                </Tooltip>
                <div className="text-lg font-bold text-destructive truncate">{mostMissedSubject}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Professional Charts */}
        <Tabs defaultValue="weekly" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 h-14">
            <TabsTrigger
              value="weekly"
              className="data-[state=active]:bg-primary data-[state=active]:text-black font-semibold text-base"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Weekly Progress
            </TabsTrigger>
            <TabsTrigger
              value="subjects"
              className="data-[state=active]:bg-secondary data-[state=active]:text-black font-semibold text-base"
            >
              <PieChart className="h-4 w-4 mr-2" />
              Subject Analysis
            </TabsTrigger>
            <TabsTrigger
              value="completion"
              className="data-[state=active]:bg-primary data-[state=active]:text-black font-semibold text-base"
            >
              <Activity className="h-4 w-4 mr-2" />
              Performance Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="pt-6">
            <Card className="border-2 border-primary/20 professional-shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-primary/10">
                <CardTitle className="text-2xl text-primary flex items-center">
                  <BarChart3 className="h-6 w-6 mr-3" />
                  Weekly Task Completion Analysis
                </CardTitle>
                <CardDescription className="text-base">
                  Comprehensive overview of daily task completion rates and consistency metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={streakData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="day" stroke="#64748b" fontSize={12} fontWeight={600} />
                      <YAxis stroke="#64748b" fontSize={12} fontWeight={600} />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "2px solid #FFD700",
                          borderRadius: "8px",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="total"
                        name="Total Tasks"
                        fill="#C0C0C0"
                        radius={[4, 4, 0, 0]}
                        stroke="#36454F"
                        strokeWidth={1}
                      />
                      <Bar
                        dataKey="completed"
                        name="Completed Tasks"
                        fill="#FFD700"
                        radius={[4, 4, 0, 0]}
                        stroke="#36454F"
                        strokeWidth={1}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="pt-6">
            <Card className="border-2 border-secondary/20 professional-shadow-lg">
              <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10 border-b border-secondary/10">
                <CardTitle className="text-2xl text-secondary flex items-center">
                  <PieChart className="h-6 w-6 mr-3" />
                  Subject Time Distribution Analysis
                </CardTitle>
                <CardDescription className="text-base">
                  Detailed breakdown of time allocation across all study subjects
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={subjectTimeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={140}
                        fill="#8884d8"
                        dataKey="hours"
                        label={CustomPieLabel}
                        stroke="#0A0A0A"
                        strokeWidth={2}
                      >
                        {subjectTimeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value) => [`${value} hours`, "Study Time"]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "2px solid #C0C0C0",
                          borderRadius: "8px",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "hsl(var(--foreground))",
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-wrap gap-4 justify-center mt-8">
                  {subjectTimeData.map((subject) => (
                    <Badge
                      key={subject.name}
                      variant="outline"
                      className="px-4 py-2 text-sm font-semibold border-2"
                      style={{
                        backgroundColor: `${subject.color}40`,
                        color: "#CC5500", // Dark orange color for all subject names
                        borderColor: subject.color,
                      }}
                    >
                      {subject.name}: {subject.hours} hrs
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completion" className="pt-6">
            <Card className="border-2 border-primary/20 professional-shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-primary/10">
                <CardTitle className="text-2xl text-primary flex items-center">
                  <Activity className="h-6 w-6 mr-3" />
                  Performance Trend Analysis
                </CardTitle>
                <CardDescription className="text-base">
                  Advanced metrics tracking consistency and performance patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={completionRateData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="day" stroke="#64748b" fontSize={12} fontWeight={600} />
                      <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} fontWeight={600} />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "2px solid #FFD700",
                          borderRadius: "8px",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="rate"
                        name="Completion Rate"
                        stroke="#FFD700"
                        strokeWidth={4}
                        dot={{ r: 8, fill: "#0A0A0A", stroke: "#FFD700", strokeWidth: 3 }}
                        activeDot={{ r: 10, fill: "#FFD700", stroke: "#0A0A0A", strokeWidth: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Professional Insights - 2x2 Card Grid with Bullet Points */}
        <Card className="border-2 border-primary/20 professional-shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-primary/10">
            <CardTitle className="text-2xl text-primary">Professional Performance Insights</CardTitle>
            <CardDescription className="text-base">
              AI-powered analysis and strategic recommendations for academic excellence
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Performance Excellence Card */}
              <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-green-700 dark:text-green-300 flex items-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    Performance Excellence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-green-600 dark:text-green-400">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">Outstanding consistency in Data Structures & Algorithms</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">Systematic approach yielding exceptional results</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">Leverage momentum for sustained academic success</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Strategic Optimization Card */}
              <Card className="border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-900">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-amber-700 dark:text-amber-300 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Strategic Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-amber-600 dark:text-amber-400">
                    <li className="flex items-start">
                      <Target className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">System Design requires enhanced focus allocation</span>
                    </li>
                    <li className="flex items-start">
                      <Target className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">Implement 25-minute intensive sessions</span>
                    </li>
                    <li className="flex items-start">
                      <Target className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">Consider advanced study methodologies</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Professional Recommendation Card */}
              <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-purple-100 dark:from-blue-950 dark:to-purple-900">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-blue-700 dark:text-blue-300 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Professional Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-blue-600 dark:text-blue-400">
                    <li className="flex items-start">
                      <Lightbulb className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">Peak cognitive performance: 9:00 AM - 12:00 PM</span>
                    </li>
                    <li className="flex items-start">
                      <Lightbulb className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">Schedule high-complexity subjects optimally</span>
                    </li>
                    <li className="flex items-start">
                      <Lightbulb className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">Maximize learning efficiency and retention</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Achievement Recognition Card */}
              <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-900">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-purple-700 dark:text-purple-300 flex items-center">
                    <Flame className="h-5 w-5 mr-2" />
                    Achievement Recognition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-purple-600 dark:text-purple-400">
                    <li className="flex items-start">
                      <Zap className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">
                        {streakData.reduce((sum, day) => sum + day.completed, 0)} tasks completed this week
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Zap className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">{totalHours} hours of dedicated study time</span>
                    </li>
                    <li className="flex items-start">
                      <Zap className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">Professional-grade discipline demonstrated</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
