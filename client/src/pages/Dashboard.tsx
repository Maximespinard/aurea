import { useAuthStore } from '@/stores/authStore';
import { Calendar, User, Activity } from 'lucide-react';
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
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's your cycle overview and insights.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/dashboard/profile')}
            className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-gray-900">
                  {profile ? 'Update Profile' : 'Complete Profile'}
                </p>
                <p className="text-sm text-gray-600">
                  {profile ? 'Edit your cycle information' : 'Set up your cycle information'}
                </p>
              </div>
            </div>
          </button>
          <button 
            onClick={() => navigate('/dashboard/calendar')}
            className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-gray-900">View Calendar</p>
                <p className="text-sm text-gray-600">Track symptoms and cycles</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Profile Setup Prompt */}
      {!profile && !isLoading && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-amber-800">
                Complete Your Profile
              </h3>
              <p className="mt-1 text-sm text-amber-700">
                Set up your cycle information to get personalized insights and predictions.
              </p>
            </div>
            <Button 
              onClick={() => navigate('/dashboard/profile')}
              className="ml-4"
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
