
import { OperationalEvent } from '../types/build';

export const OPERATIONAL_EVENTS: OperationalEvent[] = [
  {
    id: 'equipment_failure',
    type: 'equipment',
    title: 'Critical Equipment Failure',
    description: 'A critical development server has crashed, affecting team productivity.',
    probability: 0.15,
    impact: {
      productivity: -20,
      morale: -10,
      cost: 2000,
      timeDelay: 2
    },
    options: [
      {
        id: 'quick_fix',
        text: 'Apply quick temporary fix',
        effect: {
          productivity: -10,
          morale: -5,
          cost: 500,
          time: 1
        }
      },
      {
        id: 'full_replacement',
        text: 'Replace with new equipment',
        effect: {
          productivity: 5,
          morale: 5,
          cost: 3000,
          time: 3
        }
      }
    ]
  },
  {
    id: 'team_conflict',
    type: 'staff',
    title: 'Team Conflict',
    description: 'Disagreements have arisen between team members about technical decisions.',
    probability: 0.2,
    impact: {
      productivity: -15,
      morale: -20,
      cost: 0,
      timeDelay: 3
    },
    options: [
      {
        id: 'mediate',
        text: 'Mediate the conflict',
        effect: {
          productivity: -5,
          morale: 10,
          cost: 0,
          time: 2
        }
      },
      {
        id: 'reassign',
        text: 'Reassign team members',
        effect: {
          productivity: -10,
          morale: -5,
          cost: 1000,
          time: 1
        }
      }
    ]
  },
  // Add more events...
];

export const OPPORTUNITY_EVENTS: OperationalEvent[] = [
  {
    id: 'tech_breakthrough',
    type: 'opportunity',
    title: 'Technical Breakthrough',
    description: 'Team has discovered a more efficient way to implement features.',
    probability: 0.1,
    impact: {
      productivity: 20,
      morale: 15,
      cost: -1000,
      timeDelay: -3
    },
    options: [
      {
        id: 'implement',
        text: 'Implement new approach',
        effect: {
          productivity: 15,
          morale: 10,
          cost: 500,
          time: -2,
          teamSkill: 1
        }
      },
      {
        id: 'stick_to_plan',
        text: 'Stick to current plan',
        effect: {
          productivity: 0,
          morale: -5,
          cost: 0,
          time: 0
        }
      }
    ]
  }
  // Add more opportunities...
];