'use client'
import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Label,
    LabelList,
    Line,
    LineChart,
    Pie,
    PieChart,
    PolarAngleAxis,
    RadialBar,
    RadialBarChart,
    Rectangle,
    ReferenceLine,
    XAxis,
    YAxis,
} from "recharts"
import { Activity, TrendingUp } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartConfig
} from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"
import { fetchStravaData, getAthleteStats, getAllWeeklyStats, handleAllActivities, handleAthleteStatsData, transformStrava } from '@/lib/strava.controller'
import { testAllData, testAllWeeklyData, testAthleteStatsData, testLast30ActivitiesData } from '@/lib/stravaData'
import ClientDateTooltip from './ClientDataTooltip'

3
const averageHumanWeeklyCalories = 526
const maxHeartRate = 220 - 24
// chart 6 data 
export const description = "A stacked area chart"
const chartData = [
    { day: "1", time: 186 },
    { day: "2", time: 305 },
    { day: "3", time: 237 },
    { day: "4", time: 73 },
    { day: "5", time: 209 },
    { day: "6", time: 214 },
]
const chartConfig = {
    time: {
        label: "Time",
        color: "hsl(var(--chart-1))",
        icon: Activity,
    },
} satisfies ChartConfig
// CHART 3 DATA
const chart3Config = {
    count: {
        label: "Count",
    },
    WeightTraining: {
        label: "Lifting",
        color: "hsl(var(--chart-1))",
    },
    Run: {
        label: "Run",
        color: "hsl(var(--chart-2))",
    },
    Hike: {
        label: "Hike",
        color: "hsl(var(--chart-3))",
    },
    StairStepper: {
        label: "Stairs",
        color: "hsl(var(--chart-4))",
    },
} satisfies ChartConfig
const testData = [
    { type: "WeightTraining", count: 0, fill: "var(--color-WeightTraining)" },
    { type: "Run", count: 0, fill: "var(--color-Run)" },
    { type: "Hike", count: 0, fill: "var(--color-Hike)" },
    { type: "StairStepper", count: 0, fill: "var(--color-StairStepper)" },
]
interface WeeklyDataInterface {
    calorieData: any[],
    totalCaloriesWeekly: number,
    heartRateAvgData: any[],
    heartRateAvg: number,
    weeklyRunningMiles: number,
    weeklyWorkoutTimes: any[],
    weeklySufferScore: number,
    weeklyHeartRateMaxes: any[]
}
interface AllDataInterface {
    chart3Data: any[],
}
interface AthleteStatsDataInterface {
    totalRunQty: number,
    totalRunDistance: number,
    totalRunTime: number
}
const ClientDashboardComponent = () => {

    const [allWeeklyData, setAllWeeklyData] = useState<WeeklyDataInterface | any>({
        calorieData: [],
        totalCaloriesWeekly: 0,
        heartRateAvgData: [],
        heartRateAvg: 0,
        weeklyRunningMiles: 0,
        weeklyWorkoutTimes: [],
        weeklySufferScore: 0,
        weeklyHeartRateMaxes: []
    })
    const [allData, setAllData] = useState<AllDataInterface | any>({
        chart3Data: [],
    })
    const [athleteStatsData, setAthleteStatsData] = useState<AthleteStatsDataInterface>({
        totalRunQty: 0,
        totalRunDistance: 0,
        totalRunTime: 0
    })
    // const { data: session, status } = useSession({
    //     required: true,
    //     onUnauthenticated() {
    //         redirect('/api/auth/signin?callbackUrl=/')
    //     },
    // })
    const router = useRouter()
    // This useEffect loop pulls from strava account used for login in order to get all relevant athlete info. However, the live demo is currently pulling from static strava data since this app is only compatible with the user's strava account (API restrictions)
    // useEffect(() => {
    //     const getAthlete = async () => {
    //         if (session && session.accessToken) {
    //             const athleteData = await fetchStravaData(session.accessToken)
    //             if (athleteData) {
    //                 console.log('my athlete data here', athleteData)
    //                 // gets athlete info
    //                 const athleteStats = await getAthleteStats(session.accessToken, athleteData.athleteJson.id)
    //                 if (athleteStats) {
    //                     const formattedAthleteStatData = handleAthleteStatsData(athleteStats)
    //                     setAthleteStatsData(formattedAthleteStatData)
    //                 }
    //                 const weeklyData = await transformStrava(athleteData.athleteJson, athleteData.activitiesJson, session.accessToken)
    //                 if (weeklyData) {
    //                     setAllWeeklyData(weeklyData)
    //                 }
    //                 const aggregateData = handleAllActivities(athleteData.allActivitiesJson)
    //                 setAllData(aggregateData)
    //             } else {
    //                 router.push('/api/auth/signin')
    //             }
    //         }
    //     };
    //     if (status === 'authenticated') {
    //         getAthlete(); // Call the function to fetch data
    //     }
    // }, [session])
    // this useEffect hook simulates the pulling of all relevant data so that it may be accessible for chart components below
    useEffect(() => {
        const allDataSimulated = handleAllActivities(testLast30ActivitiesData)
        setAllWeeklyData(testAllWeeklyData)
        setAllData(allDataSimulated)
        setAthleteStatsData(testAthleteStatsData)
    }, [])
    console.log("All weekly data here", allWeeklyData)
    return (
        <div className="chart-wrapper mx-auto flex flex-col flex-wrap items-start justify-center gap-10 sm:flex-row py-2">
            <div className="grid w-full gap-6 sm:grid-cols-2 lg:max-w-[24rem] lg:grid-cols-1 xl:max-w-[30rem]">
                {/* CHART 1 */}
                {allWeeklyData.calorieData[0] && (
                    <Card
                        className="lg:max-w-md" x-chunk="charts-01-chunk-0"
                    >
                        <CardHeader className="space-y-0 pb-2">
                            <CardDescription className=''>Last Workout: <span className='text-xs text-slate-400'>{allWeeklyData.calorieData[0]["date"]} </span></CardDescription>
                            <CardTitle className="text-4xl tabular-nums">
                                {allWeeklyData.calorieData[0]["steps"]} {" "}
                                <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                                    calories
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={{
                                    steps: {
                                        label: "Steps",
                                        color: "blue",
                                    },
                                }}
                            >
                                {allWeeklyData.calorieData && (
                                    <BarChart
                                        accessibilityLayer
                                        margin={{
                                            left: -4,
                                            right: -4,
                                        }}
                                        data={allWeeklyData.calorieData}
                                    >
                                        <Bar
                                            dataKey="steps"
                                            fill="blue"
                                            radius={5}
                                            fillOpacity={0.6}
                                            activeBar={<Rectangle fillOpacity={0.8} />}
                                        />
                                        <XAxis
                                            dataKey="date"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={4}
                                            tickFormatter={(value) => {
                                                return new Date(value).toLocaleDateString("en-US", {
                                                    weekday: "short",
                                                })
                                            }}
                                        />
                                        <ChartTooltip
                                            defaultIndex={2}
                                            content={
                                                <ChartTooltipContent
                                                    hideIndicator
                                                    labelFormatter={(value) => {
                                                        return new Date(value).toLocaleDateString("en-US", {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        })
                                                    }}
                                                />
                                            }
                                            cursor={false}
                                        />

                                    </BarChart>
                                )}

                            </ChartContainer>
                        </CardContent>
                        {/* CHART 1 FOOTER */}
                        <CardFooter className="flex-col items-start gap-1">
                            <CardDescription>
                                Over the past 7 days, you have burned{" "}
                                <span className="font-medium text-foreground"> {allWeeklyData.totalCaloriesWeekly} </span> calories.
                            </CardDescription>
                            <CardDescription>
                                This is {" "}
                                <span className="font-medium text-foreground"> {Math.floor(allWeeklyData.totalCaloriesWeekly / averageHumanWeeklyCalories * 100)}</span> %
                                compared to the national average.
                            </CardDescription>
                        </CardFooter>
                    </Card>
                )}
                {/* CHART 2 */}
                <Card
                    className="flex flex-col lg:max-w-md" x-chunk="charts-01-chunk-1"
                >

                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2 [&>div]:flex-1">
                        <div>
                            <CardDescription>Average HR </CardDescription>
                            <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
                                {allWeeklyData.heartRateAvg}
                                <span className="text-sm font-normal tracking-normal text-muted-foreground">
                                    bpm
                                </span>
                            </CardTitle>
                        </div>
                        <div>
                            <CardDescription>% of max</CardDescription>
                            <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
                                {Math.floor(maxHeartRate - allWeeklyData.heartRateAvg)}
                                <span className="text-sm font-normal tracking-normal text-muted-foreground">
                                    %
                                </span>
                            </CardTitle>
                        </div>
                    </CardHeader>
                    {/* CHART 2 CONTENT  */}
                    <CardContent className="flex flex-1 items-center">
                        <ChartContainer
                            config={{
                                avgHr: {
                                    label: "avgHr",
                                    // color for resting heart rate line
                                    color: "aqua",
                                },
                            }}
                            className="w-full"
                        >
                            <LineChart
                                accessibilityLayer
                                margin={{
                                    left: 14,
                                    right: 14,
                                    top: 10,
                                }}
                                data={allWeeklyData.heartRateAvgData}
                            >
                                <CartesianGrid
                                    strokeDasharray="4 4"
                                    vertical={false}
                                    stroke="hsl(var(--muted-foreground))"
                                    strokeOpacity={0.5}
                                />
                                <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            weekday: "short",
                                        })
                                    }}
                                />
                                <Line
                                    dataKey="avgHr"
                                    type="natural"
                                    fill="green"
                                    stroke="var(--color-avgHr)"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{
                                        fill: "var(--color-avgHr)",
                                        stroke: "var(--color-avgHr)",
                                        r: 4,
                                    }}
                                />
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                            indicator="line"
                                            labelFormatter={(value) => <ClientDateTooltip value={value} />}
                                        />
                                    }
                                    cursor={false}
                                />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>

                </Card>
            </div>
            <div className="grid w-full flex-1 gap-6 lg:max-w-[20rem]">
                {/* CHART 3 */}
                <Card className="flex flex-col">
                    <CardHeader className="items-center pb-0">
                        <CardTitle>Workouts by Category</CardTitle>
                        <CardDescription>Last 30 workouts</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 pb-0">
                        <ChartContainer
                            config={chart3Config}
                            className="mx-auto aspect-square max-h-[250px]"
                        >
                            <PieChart>
                                <ChartTooltip
                                    content={<ChartTooltipContent nameKey="count" hideLabel />}
                                />
                                <Pie data={allData.chart3Data} dataKey="count">
                                    <LabelList
                                        dataKey="type"
                                        className="fill-background"
                                        stroke="none"
                                        fontSize={12}
                                        formatter={(value: keyof typeof chart3Config) =>
                                            chart3Config[value]?.label
                                        }
                                    />
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col gap-2 text-sm">
                        {/* <div className="flex items-center gap-2 font-medium leading-none">
                            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                        </div> */}
                        <div className="leading-none text-muted-foreground text-center">
                            Separated by category over past 30 workouts.
                        </div>
                    </CardFooter>
                </Card>
                {/* CHART 4 */}
                <Card
                    className="max-w-xs" x-chunk="charts-01-chunk-3"
                >
                    {/* CHART 4 HEADER */}
                    <CardHeader className="p-4 pb-0">
                        <CardTitle>Running Distance </CardTitle>
                        {allWeeklyData.weeklyRunningMiles && (
                            <CardDescription>
                                Over the last 7 days, your distance run is <span className='text-blue-700 underline'>
                                    {Math.floor(allWeeklyData.weeklyRunningMiles / 1600)}
                                </span> miles.
                            </CardDescription>
                        )}
                    </CardHeader>
                    {/* CHART 4 CONTENT */}
                    <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-0">
                        <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">

                            <span className="text-sm font-normal text-muted-foreground">
                                Goal: 7 miles/week
                            </span>
                        </div>
                        <ChartContainer
                            config={{
                                steps: {
                                    label: "Steps",
                                    color: "crimson",
                                },
                            }}
                            className="ml-auto w-[72px]"
                        >
                            <BarChart
                                accessibilityLayer
                                margin={{
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    bottom: 0,
                                }}
                                data={[
                                    {
                                        date: "2024-01-01",
                                        steps: 2000,
                                    },
                                    {
                                        date: "2024-01-02",
                                        steps: 2100,
                                    },
                                    {
                                        date: "2024-01-03",
                                        steps: 2200,
                                    },
                                    {
                                        date: "2024-01-04",
                                        steps: 1300,
                                    },
                                    {
                                        date: "2024-01-05",
                                        steps: 1400,
                                    },
                                    {
                                        date: "2024-01-06",
                                        steps: 2500,
                                    },
                                    {
                                        date: "2024-01-07",
                                        steps: 1600,
                                    },
                                ]}
                            >
                                <Bar
                                    dataKey="steps"
                                    fill="var(--color-steps)"
                                    radius={2}
                                    fillOpacity={0.2}
                                    activeIndex={6}
                                    activeBar={<Rectangle fillOpacity={0.8} />}
                                />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={4}
                                    hide
                                />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                {/* CHART 5 */}
                <Card
                    className="max-w-xs" x-chunk="charts-01-chunk-4"
                >
                    <CardHeader className="p-4 pb-0 text-center">
                        <CardTitle>Running Goals</CardTitle>
                    </CardHeader>
                    {/* CHART 5 CONTENT, DELETE CARD HEADER LATER */}
                    <CardContent className="flex gap-4 p-4 pb-2">
                        {athleteStatsData && (
                            <ChartContainer
                                // distance, time, amount
                                config={{
                                    distance: {
                                        label: "Distance",
                                        color: "pink",
                                    },
                                    time: {
                                        label: "Time",
                                        color: "magenta",
                                    },
                                    total: {
                                        label: "Total",
                                        color: "navy",
                                    },
                                }}
                                className="h-[140px] w-full"
                            >
                                {athleteStatsData && (
                                    <BarChart
                                        margin={{
                                            left: 0,
                                            right: 0,
                                            top: 0,
                                            bottom: 10,
                                        }}
                                        data={[
                                            {
                                                activity: "time",
                                                value: `${(athleteStatsData.totalRunTime / 60 / 60 / 10 * 100)}`,
                                                label: `${Math.floor(athleteStatsData.totalRunTime / 60 / 60)} / 10 hours`,
                                                fill: "var(--color-time)",
                                            },
                                            {
                                                activity: "total",
                                                value: `${(athleteStatsData.totalRunQty / 35) * 100}`,
                                                label: `${athleteStatsData.totalRunQty} / 35 runs`,
                                                fill: "var(--color-total)",
                                            },
                                            {
                                                activity: "distance",
                                                value: `${athleteStatsData.totalRunDistance / 1600 / 60 * 100}`,
                                                label: `${Math.floor(athleteStatsData.totalRunDistance / 1600)} / 60 miles`,
                                                fill: "var(--color-distance)",
                                            },
                                        ]}
                                        layout="vertical"
                                        barSize={32}
                                        barGap={2}
                                    >
                                        <XAxis type="number" dataKey="value" hide />
                                        <YAxis
                                            dataKey="activity"
                                            type="category"
                                            tickLine={false}
                                            tickMargin={4}
                                            axisLine={false}
                                            className="capitalize"
                                        />
                                        <Bar dataKey="value" radius={5}>
                                            <LabelList
                                                position="insideLeft"
                                                dataKey="label"
                                                fill="white"
                                                offset={8}
                                                fontSize={12}
                                            />
                                        </Bar>
                                    </BarChart>
                                )}

                            </ChartContainer>
                        )}

                    </CardContent>
                    {/* CHART 5 FOOTER DATA */}
                    <CardFooter className="flex flex-row border-t p-4">
                        <div className="flex w-full items-center gap-2">
                            <div className="grid flex-1 auto-rows-min gap-0.5">
                                <div className="text-xs text-muted-foreground">Time</div>
                                <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                                    {Math.round((athleteStatsData.totalRunTime / 60 / 60) * 100) / 100}
                                    <span className="text-sm font-normal text-muted-foreground">
                                        hrs
                                    </span>
                                </div>
                            </div>
                            <Separator orientation="vertical" className="mx-2 h-10 w-px" />
                            <div className="grid flex-1 auto-rows-min gap-0.5">
                                <div className="text-xs text-muted-foreground">Total</div>
                                <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                                    {athleteStatsData.totalRunQty}
                                    <span className="text-sm font-normal text-muted-foreground">
                                        runs
                                    </span>
                                </div>
                            </div>
                            <Separator orientation="vertical" className="mx-2 h-10 w-px" />
                            <div className="grid flex-1 auto-rows-min gap-0.5">
                                <div className="text-xs text-muted-foreground">Distance</div>
                                <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                                    {Math.round((athleteStatsData.totalRunDistance / 1600) * 10) / 10}
                                    <span className="text-sm font-normal text-muted-foreground">
                                        mi
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </div>
            <div className="grid w-full flex-1 gap-6">
                {/* CHART 6 */}
                <Card>
                    <CardHeader>
                        <CardTitle>Time per workout</CardTitle>
                        <CardDescription>
                            Showing time per workout over past week.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {allWeeklyData.weeklyWorkoutTimes && (
                            <ChartContainer config={chartConfig}>
                                <AreaChart
                                    accessibilityLayer
                                    data={allWeeklyData.weeklyWorkoutTimes}
                                    margin={{
                                        left: 12,
                                        right: 12,
                                    }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="day"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Area
                                        dataKey="time"
                                        type="step"
                                        fill="var(--color-time)"
                                        fillOpacity={0.4}
                                        stroke="var(--color-time)"
                                    />
                                </AreaChart>
                            </ChartContainer>
                        )}

                    </CardContent>
                    <CardFooter>
                        <div className="flex w-full items-start gap-2 text-sm">
                            <div className="grid gap-2">
                                <div className="flex items-center gap-2 font-medium leading-none">
                                    Trending up by 5.2% this week <TrendingUp className="h-4 w-4" />
                                </div>
                                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                                    Subtitle here
                                </div>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
                {/* CHART 8 */}
                <Card
                    className="max-w-xs" x-chunk="charts-01-chunk-7"
                >
                    {/* CHART 8 HEADER */}
                    <CardHeader className="space-y-0 pb-0">
                        <CardDescription> Max Heart Rate </CardDescription>
                        <CardTitle className="flex items-baseline gap-1 tabular-nums">
                            This week
                        </CardTitle>
                    </CardHeader>
                    {/* CHART 8 CONTENT */}
                    <CardContent className="p-0">
                        {allWeeklyData.weeklyHeartRateMaxes && (
                            <ChartContainer
                                config={{
                                    time: {
                                        label: "Time",
                                        color: "brown",
                                    },
                                }}
                            >
                                <AreaChart
                                    accessibilityLayer
                                    data={allWeeklyData.weeklyHeartRateMaxes}
                                    margin={{
                                        left: 0,
                                        right: 0,
                                        top: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <XAxis dataKey="date" hide />
                                    <YAxis domain={["dataMin - 5", "dataMax + 2"]} hide />
                                    <defs>
                                        <linearGradient id="fillTime" x1="0" y1="0" x2="0" y2="1">
                                            <stop
                                                offset="5%"
                                                stopColor="var(--color-time)"
                                                stopOpacity={0.8}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="var(--color-time)"
                                                stopOpacity={0.1}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <Area
                                        dataKey="time"
                                        type="natural"
                                        fill="url(#fillTime)"
                                        fillOpacity={0.4}
                                        stroke="var(--color-time)"
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                        formatter={(value) => (
                                            <div className="flex min-w-[120px] items-center text-xs text-muted-foreground">
                                                Max HR
                                                <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                                    {value}
                                                    <span className="font-normal text-muted-foreground">
                                                        bpm
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    />
                                </AreaChart>
                            </ChartContainer>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ClientDashboardComponent