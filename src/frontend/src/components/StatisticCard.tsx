import { Card, CardContent } from '@/components/ui/card';

interface StatisticCardProps {
  label: string;
  value: number | string;
  subtitle?: string;
}

export default function StatisticCard({ label, value, subtitle }: StatisticCardProps) {
  return (
    <Card className="shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in">
      <CardContent className="pt-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">{label}</p>
          <p className="text-3xl font-bold text-primary">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
