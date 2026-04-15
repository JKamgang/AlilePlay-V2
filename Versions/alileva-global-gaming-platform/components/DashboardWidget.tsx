
import React from 'react';

interface DashboardWidgetProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl shadow-lg p-4 sm:p-6 h-full border border-gray-700/50">
      <div className="flex items-center mb-4">
        <div className="text-brand-primary mr-3">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default DashboardWidget;
