import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  Clock, 
  FileText, 
  Activity,
  UsersRound,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardStats } from '../../types';
import { supabase } from '../../lib/supabase';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    patients_admitted_today: 0,
    patients_discharged_today: 0,
    average_length_of_stay: 0,
    pending_summaries: 0,
    active_patients: 0,
    total_staff: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch patients data for statistics
      const { data: patients } = await supabase
        .from('patients')
        .select('*')
        .eq('institution_id', user?.institution_id);

      const { data: summaries } = await supabase
        .from('discharge_summaries')
        .select('*')
        .eq('status', 'REVIEW_PENDING');

      const { data: staff } = await supabase
        .from('users')
        .select('*')
        .eq('institution_id', user?.institution_id);

      const today = new Date().toISOString().split('T')[0];
      const admittedToday = patients?.filter(p => 
        p.date_of_admission.startsWith(today)
      ).length || 0;

      const dischargedToday = patients?.filter(p => 
        p.status === 'DISCHARGED' && 
        p.updated_at.startsWith(today)
      ).length || 0;

      const activePatients = patients?.filter(p => p.status === 'ACTIVE').length || 0;

      // Calculate average length of stay (simplified)
      const avgStay = patients && patients.length > 0 
        ? Math.round(patients.reduce((acc, p) => {
            const admissionDate = new Date(p.date_of_admission);
            const now = new Date();
            const days = Math.ceil((now.getTime() - admissionDate.getTime()) / (1000 * 60 * 60 * 24));
            return acc + days;
          }, 0) / patients.length)
        : 0;

      setStats({
        patients_admitted_today: admittedToday,
        patients_discharged_today: dischargedToday,
        average_length_of_stay: avgStay,
        pending_summaries: summaries?.length || 0,
        active_patients: activePatients,
        total_staff: staff?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ComponentType<any>;
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, Dr. {user?.last_name}
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening at your institution today
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Patients Admitted Today"
          value={stats.patients_admitted_today}
          icon={Calendar}
          color="bg-blue-500"
        />
        
        <StatCard
          title="Patients Discharged Today"
          value={stats.patients_discharged_today}
          icon={UserCheck}
          color="bg-green-500"
        />
        
        <StatCard
          title="Average Length of Stay"
          value={stats.average_length_of_stay}
          icon={Clock}
          color="bg-orange-500"
          subtitle="days"
        />
        
        <StatCard
          title="Pending Summaries"
          value={stats.pending_summaries}
          icon={FileText}
          color="bg-red-500"
        />
        
        <StatCard
          title="Active Patients"
          value={stats.active_patients}
          icon={Activity}
          color="bg-purple-500"
        />
        
        <StatCard
          title="Total Staff"
          value={stats.total_staff}
          icon={UsersRound}
          color="bg-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">New patient admitted to Room 301</span>
              <span className="text-xs text-gray-500 ml-auto">2 min ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Discharge summary approved for John Doe</span>
              <span className="text-xs text-gray-500 ml-auto">15 min ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Summary pending review for Jane Smith</span>
              <span className="text-xs text-gray-500 ml-auto">1 hour ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="space-y-3">
            <button className="w-full text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Add New Patient</p>
                  <p className="text-sm text-gray-600">Register a new patient admission</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Generate Summary</p>
                  <p className="text-sm text-gray-600">Create discharge summary with AI</p>
                </div>
              </div>
            </button>
            
            {user?.role === 'DOCTOR' && (
              <button className="w-full text-left p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <UserCheck className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Review Summaries</p>
                    <p className="text-sm text-gray-600">Approve pending summaries</p>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;