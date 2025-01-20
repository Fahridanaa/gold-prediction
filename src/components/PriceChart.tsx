"use client";

import { useGoldPrice } from "@/hooks/useGoldPrice";
import {
	Area,
	CartesianGrid,
	ComposedChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HTMLAttributes, useMemo, useState } from "react";
import type { TimeRange } from "@/types/gold";
import { Badge } from "./ui/badge";

const timeRanges = [
	{ value: "today", label: "Today" },
	{ value: "1w", label: "1 Week" },
	{ value: "1m", label: "1 Month" },
	{ value: "3m", label: "3 Month" },
	{ value: "6m", label: "6 Month" },
	{ value: "ytd", label: "YTD" },
	{ value: "1y", label: "1 Year" },
	{ value: "5y", label: "5 Year" },
	{ value: "all", label: "All Time" },
] as const;

export function PriceChart(props: HTMLAttributes<HTMLDivElement>) {
	const [selectedRange, setSelectedRange] = useState<TimeRange>("today");
	const { data, loading, error } = useGoldPrice(selectedRange);

	const isMarketClosed = useMemo(() => {
		const now = new Date();
		const day = now.getDay();
		return day === 0; // Sunday
	}, []);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error loading data</div>;
	if (!data?.length) return <div>No data available</div>;

	return (
		<Card {...props}>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span>Gold Price Chart</span>
						{isMarketClosed && (
							<Badge
								variant="secondary"
								className="text-muted-foreground"
							>
								Market Closed
							</Badge>
						)}
					</div>
					<div className="flex gap-2">
						{timeRanges.map((range) => (
							<button
								key={range.value}
								onClick={() => setSelectedRange(range.value)}
								className={`px-3 py-1 rounded-md ${
									selectedRange === range.value
										? "bg-primary text-primary-foreground"
										: "bg-secondary hover:bg-secondary/80"
								}`}
							>
								{range.label}
							</button>
						))}
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={400}>
					<ComposedChart data={data}>
						<defs>
							<linearGradient
								id="colorPrice"
								x1="0"
								y1="0"
								x2="0"
								y2="1"
							>
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
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="timestamp"
							type="number"
							domain={["dataMin", "dataMax"]}
							scale="time"
							tickFormatter={(unixTime) => {
								const date = new Date(unixTime);
								switch (selectedRange) {
									case "today":
										return date.toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										});
									case "1w":
										return date.toLocaleDateString([], {
											weekday: "short",
											hour: "2-digit",
										});
									case "1m":
										return date.toLocaleDateString([], {
											month: "short",
											day: "numeric",
										});
									case "3m":
									case "6m":
										return date.toLocaleDateString([], {
											month: "short",
											day: "numeric",
										});
									case "1y":
									case "5y":
										return date.toLocaleDateString([], {
											month: "short",
											year: "2-digit",
										});
									default:
										return date.toLocaleDateString();
								}
							}}
							interval="preserveStartEnd"
							minTickGap={50}
						/>
						<YAxis
							yAxisId="price"
							domain={["auto", "auto"]}
							tickFormatter={(value) => `$${value.toFixed(2)}`}
						/>
						<Tooltip
							content={({ active, payload }) => {
								if (active && payload?.length) {
									const data = payload[0].payload;
									return (
										<div className="rounded-lg bg-background p-2 shadow-md border">
											<div className="font-medium">
												${data.price.toFixed(2)}
											</div>
											<div
												className={`text-sm ${
													data.change >= 0
														? "text-green-500"
														: "text-red-500"
												}`}
											>
												{data.change >= 0 ? "+" : ""}
												{data.change.toFixed(2)}%
											</div>
											<div className="text-xs text-muted-foreground">
												{selectedRange === "today"
													? new Date(
															data.timestamp
													  ).toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit",
															hour12: false,
													  })
													: new Date(
															data.timestamp
													  ).toLocaleDateString([], {
															year: "numeric",
															month: "short",
															day: "numeric",
															hour: "2-digit",
															minute: "2-digit",
															hour12: false,
													  })}
											</div>
										</div>
									);
								}
								return null;
							}}
						/>
						<Area
							yAxisId="price"
							type="monotone"
							dataKey="price"
							stroke="hsl(var(--primary))"
							fill="url(#colorPrice)"
							fillOpacity={0.3}
							isAnimationActive={false}
						/>
					</ComposedChart>
				</ResponsiveContainer>
				{isMarketClosed && (
					<div className="mt-4 text-center text-sm text-muted-foreground">
						Market is closed on Sundays. Showing last available
						price data.
					</div>
				)}
			</CardContent>
			{/* <CardHeader>
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
      </CardHeader> */}
			{/* <CardContent>
        <ChartContainer config={chartConfig}>
            <ComposedChart data={data}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={30}
                tickFormatter={(value) =>
                  new Date(value).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })
                }
              />
              <YAxis
                yAxisId="price"
                axisLine={false}
                tickLine={false}
                tickCount={8}
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
              />
              <YAxis
                yAxisId="volume"
                orientation="right"
                axisLine={false}
                tickLine={false}
              />
              <Area
                yAxisId="price"
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--primary))"
                fill="url(#colorPrice)"
                fillOpacity={0.3}
              />
              <Bar
                yAxisId="volume"
                dataKey="volume"
                fill="hsl(var(--muted))"
                opacity={0.3}
              />
              <Brush
                dataKey="timestamp"
                height={30}
                stroke="hsl(var(--primary))"
                startIndex={startIndex}
                endIndex={endIndex}
                tickFormatter={(value) =>
                  new Date(value).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })
                }
              />
              <ChartTooltip
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
                          Volume: {data.volume.toLocaleString()}
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
            </ComposedChart>
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
      </CardContent> */}
		</Card>
	);
}
