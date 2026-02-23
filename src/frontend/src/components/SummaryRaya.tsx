import { useFamilies } from '../hooks/useFamilies';
import { useSummaryStats } from '../hooks/useSummaryStats';
import { useFoodBreakdown } from '../hooks/useFoodBreakdown';
import StatisticCard from './StatisticCard';
import FamilyCard from './FamilyCard';
import FoodPieChart from './FoodPieChart';
import FamilyBarChart from './FamilyBarChart';
import AnimatedCounter from './AnimatedCounter';
import { Users } from 'lucide-react';

export default function SummaryRaya() {
  const { data: families = [], isLoading: familiesLoading } = useFamilies();
  const { data: stats, isLoading: statsLoading } = useSummaryStats();
  const { data: foodBreakdown = [] } = useFoodBreakdown();

  if (familiesLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuatkan data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Animated Counter */}
      <div className="text-center py-8 bg-card rounded-lg shadow-soft">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Users className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">Jumlah Kehadiran</h2>
        </div>
        <AnimatedCounter target={Number(stats?.totalAttendees || 0)} duration={1000} />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticCard label="Total Orang" value={Number(stats?.totalAttendees || 0)} />
        <StatisticCard label="Total Keluarga" value={Number(stats?.totalFamilies || 0)} />
        <StatisticCard label="Total Jenis Makanan" value={Number(stats?.totalFoodTypes || 0)} />
        <StatisticCard
          label="Keluarga Paling Ramai"
          value={stats?.largestFamilyName || '-'}
          subtitle={stats?.largestFamilySize ? `${stats.largestFamilySize} orang` : ''}
        />
      </div>

      {/* Charts Section */}
      {families.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FoodPieChart data={foodBreakdown} />
          <FamilyBarChart data={families} />
        </div>
      )}

      {/* Family Cards */}
      <div>
        <h2 className="text-2xl font-bold text-primary mb-4">Senarai Keluarga</h2>
        {families.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg">
            <p className="text-muted-foreground">Tiada keluarga didaftarkan lagi</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {families.map((family, index) => (
              <FamilyCard key={index} family={family} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
