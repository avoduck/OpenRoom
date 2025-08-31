import React from 'react';
import { 
  Home, 
  Users, 
  FileText, 
  UserPlus, 
  BarChart3,
  Bed,
  Calendar,
  Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const { user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['DOCTOR', 'NURSE', 'JUNIOR_DOCTOR'] },
    { id: 'patients', label: 'Patients', icon: Users, roles: ['DOCTOR', 'NURSE', 'JUNIOR_DOCTOR'] },
    { id: 'summaries', label: 'Summaries', icon: FileText, roles: ['DOCTOR', 'NURSE', 'JUNIOR_DOCTOR'] },
    { id: 'staff', label: 'Staff Management', icon: UserPlus, roles: ['DOCTOR'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['DOCTOR'] },
    { id: 'rooms', label: 'Room Management', icon: Bed, roles: ['DOCTOR', 'NURSE'] },
    { id: 'schedule', label: 'Schedule', icon: Calendar, roles: ['DOCTOR', 'NURSE', 'JUNIOR_DOCTOR'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['DOCTOR', 'NURSE', 'JUNIOR_DOCTOR'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;