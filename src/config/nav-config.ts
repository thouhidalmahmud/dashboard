import { NavGroup } from '@/types';

/**
 * Navigation configuration with RBAC support.
 * Used for both the sidebar and the Cmd+K bar.
 * Active state is derived from the current pathname in app-sidebar.tsx,
 * so items do not hardcode isActive.
 */
export const navGroups: NavGroup[] = [
  {
    label: 'Main',
    items: [
      {
        title: 'Home',
        url: '/dashboard/overview',
        icon: 'dashboard',
        shortcut: ['g', 'h'],
        items: []
      },
      { title: 'Calls', url: '/dashboard/calls', icon: 'phone', shortcut: ['g', 'c'], items: [] },
      { title: 'Agent', url: '/dashboard/agent', icon: 'headset', shortcut: ['g', 'a'], items: [] },
      {
        title: 'Leads & Appointments',
        url: '/dashboard/leads',
        icon: 'calendar',
        shortcut: ['g', 'l'],
        items: []
      },
      {
        title: 'Insights',
        url: '/dashboard/insights',
        icon: 'chart',
        shortcut: ['g', 'i'],
        items: []
      },
      {
        title: 'Team',
        url: '/dashboard/workspaces/team',
        icon: 'teams',
        shortcut: ['g', 't'],
        items: [],
        access: { requireOrg: true }
      },
      {
        title: 'Settings',
        url: '/dashboard/settings',
        icon: 'settings',
        shortcut: ['g', 's'],
        items: []
      },
      { title: 'Help', url: '/dashboard/help', icon: 'help', shortcut: ['g', 'e'], items: [] }
    ]
  },
  {
    label: 'Account',
    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'profile',
        shortcut: ['m', 'm'],
        items: []
      },
      {
        title: 'Notifications',
        url: '/dashboard/notifications',
        icon: 'notification',
        shortcut: ['n', 'n'],
        items: []
      },
      {
        title: 'Billing',
        url: '/dashboard/billing',
        icon: 'billing',
        shortcut: ['b', 'b'],
        items: [],
        access: { requireOrg: true }
      }
    ]
  }
];
