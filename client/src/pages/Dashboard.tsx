import { useAuthStore } from '@/stores/authStore';
import { Calendar, User, Heart, Sparkles } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { CycleStats } from '@/features/Dashboard/components/CycleStats';
import { useCycleCalculations } from '@/features/Dashboard/hooks/useCycleCalculations';

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfile();
  const cycleData = useCycleCalculations(profile);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Welcome Header */}
      <div className="mb-8 p-8 -m-6 rounded-b-2xl">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-muted-foreground mt-3 text-lg">
          Here's your cycle overview and insights.
        </p>
      </div>

      {/* Stats Grid with Animation */}
      <CycleStats profile={profile} isLoading={isLoading} />

      {/* Cycle Progress Indicator */}
      {profile && (
        <div className="mb-10 mx-6 bg-gradient-to-br from-primary/5 to-pink-50 rounded-2xl p-8 border border-primary/10">
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
                style={{ width: `${Math.min((typeof cycleData.currentDay === 'number' ? cycleData.currentDay : 0) / (profile.cycleLength || 28) * 100, 100)}%` }}
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
      <div className="bg-gradient-to-br from-white to-primary/5 rounded-2xl shadow-lg border border-primary/10 p-8 mb-8 mx-6">
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
