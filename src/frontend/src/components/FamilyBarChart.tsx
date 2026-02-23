import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import type { FamilyRaya } from '../backend';

interface FamilyBarChartProps {
  data: FamilyRaya[];
}

export default function FamilyBarChart({ data }: FamilyBarChartProps) {
  const chartData = data.map((family) => ({
    name: family.familyName,
    ahli: family.members.length,
  }));

  const chartConfig = {
    ahli: {
      label: 'Bilangan Ahli',
      color: 'oklch(0.28 0.12 155)',
    },
  };

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardHeader>
        <CardTitle className="text-primary">Bilangan Ahli Setiap Keluarga</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 75)" />
              <XAxis
                dataKey="name"
                stroke="oklch(0.55 0.03 150)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="oklch(0.55 0.03 150)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="ahli" fill="oklch(0.28 0.12 155)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
