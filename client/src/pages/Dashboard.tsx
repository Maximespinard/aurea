import { useAuthStore } from '@/stores/authStore';
import { Calendar, User, Activity, Heart, Sparkles } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { addDays, differenceInDays } from 'date-fns';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfile();

  // Calculate cycle data
  const calculateCycleData = () => {
    if (!profile?.lastPeriodDate) {
      return {
        currentDay: '--',
        nextPeriod: '--',
        cycleLength: '--',
      };
    }

    const lastPeriod = new Date(profile.lastPeriodDate);
    const today = new Date();
    const daysSinceLastPeriod = differenceInDays(today, lastPeriod);
    const cycleLength = profile.cycleLength || 28;
    const nextPeriodDate = addDays(lastPeriod, cycleLength);
    const daysUntilNextPeriod = differenceInDays(nextPeriodDate, today);

    return {
      currentDay: daysSinceLastPeriod + 1,
      nextPeriod: daysUntilNextPeriod > 0 
        ? `${daysUntilNextPeriod} days` 
        : daysUntilNextPeriod === 0 
        ? 'Today' 
        : 'Late',
      cycleLength: `${cycleLength} days`,
    };
  };

  const cycleData = calculateCycleData();

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
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Welcome Header with Gradient Background */}
      <div className="relative mb-12 -mt-6 -mx-6 px-6 pt-12 pb-16 bg-gradient-to-br rounded-b-3xl">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
        <div className="relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Here's your cycle overview and insights.
          </p>
        </div>
      </div>

      {/* Stats Grid with Animation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cycle Progress Indicator */}
      {profile && (
        <div className="mb-10 bg-gradient-to-br from-primary/5 to-pink-50 rounded-2xl p-8 border border-primary/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Cycle Progress
            </h3>
            <Sparkles className="h-5 w-5 text-primary/60" />
          </div>
          <div className="relative">
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500 ease-out"
                style={{ width: `${Math.min((cycleData.currentDay / (profile.cycleLength || 28)) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Day 1</span>
              <span>Day {profile.cycleLength || 28}</span>
            </div>
          </div>
          <p className="text-center mt-4 text-sm text-muted-foreground">
            You are on day <span className="font-semibold text-primary">{cycleData.currentDay}</span> of your cycle
          </p>
        </div>
      )}

      {/* Quick Actions with Enhanced Design */}
      <div className="bg-gradient-to-br from-white to-primary/5 rounded-2xl shadow-lg border border-primary/10 p-8 mb-8">
        <h2 className="text-xl font-bold text-foreground mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onClick={() => navigate('/dashboard/profile')}
            className="group relative p-6 text-left bg-white border-2 border-transparent rounded-xl hover:border-primary/20 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-lg">
                  {profile ? 'Update Profile' : 'Complete Profile'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {profile ? 'Edit your cycle information' : 'Set up your cycle information'}
                </p>
              </div>
            </div>
          </button>
          <button 
            onClick={() => navigate('/dashboard/calendar')}
            className="group relative p-6 text-left bg-white border-2 border-transparent rounded-xl hover:border-primary/20 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-lg">View Calendar</p>
                <p className="text-sm text-muted-foreground mt-1">Track symptoms and cycles</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Profile Setup Prompt with Enhanced Design */}
      {!profile && !isLoading && (
        <div className="relative bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200/50 rounded-2xl p-6 overflow-hidden">
          <div className="absolute inset-0 bg-grid-amber-900/[0.02] bg-[size:20px_20px]" />
          <div className="relative flex items-center">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-amber-900">
                Complete Your Profile
              </h3>
              <p className="mt-2 text-sm text-amber-800">
                Set up your cycle information to get personalized insights and predictions.
              </p>
            </div>
            <Button 
              onClick={() => navigate('/dashboard/profile')}
              className="ml-6 bg-primary hover:bg-primary/90 shadow-lg"
              size="lg"
            >
              Set Up Profile
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
