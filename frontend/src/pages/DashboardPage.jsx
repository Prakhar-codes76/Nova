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
    <div>
      <HeaderGreeting />
      <NovaSuggestionWidget />
      <OverviewCards />
      <NextActivityCard />
      <QuickActions
        onOpenAddTask={() => setIsTaskModalOpen(true)}
        onOpenAddSchedule={() => setIsScheduleModalOpen(true)}
      />
      <TodayTasks />
      <ProductivityChart />

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
