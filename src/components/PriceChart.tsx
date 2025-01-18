"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"
import { HTMLAttributes, useState } from "react"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface GoldPriceData {
  timestamp: string;
  price: number;
  change: number;
}

type TimeRange = 'today' | '1w' | '1m' | '3m' | '6m' | '1y' | '5y' | 'all';

const timeRanges = [
  { value: 'today', label: 'Today' },
  { value: '1w', label: '1 Week' },
  { value: '1m', label: '1 Month' },
  { value: '3m', label: '3 Month' },
  { value: '6m', label: '6 Month' },
  { value: '1y', label: '1 Year' },
  { value: '5y', label: '5 Year' },
  { value: 'all', label: 'All Time' },
] as const;

const generateDummyData = (): GoldPriceData[] => {
  const data: GoldPriceData[] = [];
  const basePrice = 2740.34;
  const now = new Date();

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now);
    time.setHours(now.getHours() - i);

    const variation = (Math.random() - 0.5) * 30;
    const price = basePrice + variation;
    const change = variation / basePrice * 100;

    data.push({
      timestamp: time.toISOString(),
      price: Number(price.toFixed(2)),
      change: Number(change.toFixed(2))
    });
  }

  return data;
};

const dummyData = generateDummyData();

export function PriceChart(props: HTMLAttributes<HTMLDivElement>) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('today');
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            <svg width="56" height="56"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0h56v56H0V0z" fill="#D69A00" />
            <path d="M21.248 21.555h13.784l-2.01-5.393a1.17 1.17 0 00-.41-.553l-11.364 5.946zm-.038-6.401C21.698 13.842 22.772 13 23.956 13h8.151c1.184 0 2.258.842 2.747 2.154l2.009 5.393c.603 1.618-.371 3.453-1.831 3.453h-14c-1.46 0-2.433-1.835-1.831-3.453l2.01-5.393h-.001zM10.235 35.555h13.757l-2.01-5.393a1.171 1.171 0 00-.41-.553l-11.337 5.946zm-.039-6.401C10.685 27.842 11.76 27 12.943 27h8.124c1.184 0 2.259.842 2.747 2.154l2.009 5.393c.603 1.618-.37 3.453-1.831 3.453H10.017c-1.46 0-2.433-1.835-1.83-3.453l2.01-5.393zm35.89 6.401h-13.85l11.43-5.945c.179.126.323.316.413.553l2.008 5.392zM34.945 27c-1.184 0-2.259.842-2.747 2.154l-2.009 5.393c-.603 1.618.37 3.453 1.831 3.453h14.067c1.46 0 2.433-1.835 1.83-3.453l-2.01-5.393C45.422 27.842 44.348 27 43.164 27h-8.22z" fill="#fff" />
          </svg>
          </div>
          <h2 className="text-4xl/9 font-bold text-[#232526]">$2.740,34</h2>
          <div className="flex items-center gap-2 text-base/6 text-red-400 font-bold md:text-xl/7">
            <span>-10,56</span>
            <span>(-0,38%)</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" >
              <path d="M2.763 4a.8.8 0 00-.602 1.327l5.086 5.813a1 1 0 001.506 0l5.086-5.813A.8.8 0 0013.237 4H2.763z"></path>
            </svg>
          </div>
        </CardTitle>
        <CardDescription>
          Data Real-Time <time dateTime="2025-01-17T08:06:49.000Z" data-test="trading-time-label">15:06:49</time>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={dummyData}
              height={300}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  new Date(value).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                }
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickCount={8}
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
              />
              <ChartTooltip
                cursor={{ stroke: '#E5E7EB' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as GoldPriceData;
                    return (
                      <div className="rounded-lg bg-white p-2 shadow-md border">
                        <div className="text-sm font-medium">
                          ${data.price.toFixed(2)}
                        </div>
                        <div className={`text-xs ${data.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {data.change >= 0 ? '+' : ''}{data.change}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(data.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--primary))"
                fill="url(#colorPrice)"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="flex flex-wrap justify-center mt-4 gap-2">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setSelectedRange(range.value)}
              className={`px-3 py-1 text-sm rounded-md transition-colors
                ${selectedRange === range.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
