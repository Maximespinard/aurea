import { Calendar, User, Activity } from 'lucide-react';
import type { Profile } from '@/lib/api/profile';
import { useCycleCalculations } from '../hooks/useCycleCalculations';

interface CycleStatsProps {
  profile: Profile | undefined;
  isLoading: boolean;
}

export function CycleStats({ profile, isLoading }: CycleStatsProps) {
  const cycleData = useCycleCalculations(profile);

  const stats = [
    {
      title: 'Current Cycle Day',
      value: cycleData.currentDay,
      icon: Activity,
      description: profile ? 'Days since last period' : 'Set up your profile to track cycles',
    },
    {
      title: 'Next Period',
      value: cycleData.nextPeriod,
      icon: Calendar,
      description: profile?.lastPeriodDate ? 'Estimated start date' : 'Add your last period date',
    },
    {
      title: 'Average Cycle',
      value: cycleData.cycleLength,
      icon: User,
      description: profile ? 'Your cycle length' : 'Complete profile setup',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 px-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl border border-muted/20 p-6 transition-all duration-300 hover:-translate-y-1"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground mt-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-2">{stat.description}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                <Icon className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}