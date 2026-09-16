import React, { useState } from 'react';
import { HeaderGreeting } from '../components/dashboard/HeaderGreeting';
import { NovaSuggestionWidget } from '../components/dashboard/NovaSuggestionWidget';
import { OverviewCards } from '../components/dashboard/OverviewCards';
import { NextActivityCard } from '../components/dashboard/NextActivityCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { TodayTasks } from '../components/dashboard/TodayTasks';
import { ProductivityChart } from '../components/dashboard/ProductivityChart';
import { AddTaskModal } from '../components/tasks/AddTaskModal';
import { AddScheduleModal } from '../components/timetable/AddScheduleModal';

export const DashboardPage = () => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
      {/* Top Section */}
      <HeaderGreeting />
      <NovaSuggestionWidget />
      
      {/* Main KPI Cards */}
      <OverviewCards />

      {/* Main Grid Layout for the rest of the dashboard */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <NextActivityCard />
          <QuickActions
            onOpenAddTask={() => setIsTaskModalOpen(true)}
            onOpenAddSchedule={() => setIsScheduleModalOpen(true)}
          />
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <TodayTasks />
        </div>
      </div>

      {/* Full width chart at the bottom */}
      <div style={{ marginTop: '0.5rem' }}>
        <ProductivityChart />
      </div>

      <AddTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
      <AddScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
    </div>
  );
};
