// data/businessIdeas.ts
import { EnhancedBusinessIdea } from '../types/business';

export const ENHANCED_BUSINESS_IDEAS: EnhancedBusinessIdea[] = [
  {
    id: '1',
    name: 'EcoDelivery',
    description: 'Sustainable food delivery using electric bikes',
    market: 'Food Tech',
    difficulty: 6,
    potential: 8,
    productCosts: {
      initialInventory: {
        items: [
          {
            name: 'Electric Bikes',
            unitCost: 2000,
            quantity: 10,
            lifespan: 24, // 2 years
            maintenanceCost: 100
          },
          {
            name: 'Delivery Bags',
            unitCost: 100,
            quantity: 15,
            lifespan: 6,
            maintenanceCost: 20
          },
          {
            name: 'Rider Equipment',
            unitCost: 200,
            quantity: 12,
            lifespan: 12,
            maintenanceCost: 30
          },
          {
            name: 'Charging Stations',
            unitCost: 1500,
            quantity: 2,
            lifespan: 36,
            maintenanceCost: 50
          }
        ],
        totalCost: 28000 // Pre-calculated total
      },
      operationalCosts: {
        perUnit: 6.50,
        laborPerUnit: 5,
        materialPerUnit: 1,
        maintenancePerUnit: 0.50
      },
      scaling: {
        minCapacity: 100, // deliveries per day
        maxCapacity: 1000,
        scaleIncrementCost: 5000, // Cost to increase capacity
        scaleIncrementUnits: 100 // Additional deliveries per increment
      }
    },
    marketData: {
      totalMarketSize: 5000000,
      growthRate: 15,
      competitorCount: 3,
      marketShare: 5,
      customerSegments: [
        {
          name: 'Urban Professionals',
          size: 45,
          priceElasticity: 0.7,
          growthPotential: 20
        },
        {
          name: 'Students',
          size: 30,
          priceElasticity: 0.9,
          growthPotential: 15
        },
        {
          name: 'Eco-conscious Consumers',
          size: 25,
          priceElasticity: 0.5,
          growthPotential: 25
        }
      ]
    },
    financials: {
      initialCosts: {
        inventory: 28000,
        setup: 12000,
        legal: 3000,
        marketing: 5000,
        other: 2000
      },
      monthlyFixed: {
        rent: 2000,
        salaries: 15000,
        utilities: 500,
        insurance: 1000,
        other: 500
      },
      breakEven: {
        unitSales: 5834,
        timeframe: 6,
        revenueRequired: 87510
      },
      projections: {
        monthlyRevenue: 100000,
        yearlyRevenue: 1200000,
        profitMargin: 15,
        roi: 85
      }
    },
    requirements: {
      licenses: ['Business License', 'Food Delivery Permit', 'Vehicle Insurance'],
      certifications: ['Food Safety', 'First Aid'],
      regulations: ['Local Transportation Laws', 'Food Safety Regulations'],
      minimumTeamSize: 15,
      keyRoles: ['Operations Manager', 'Fleet Manager', 'Delivery Riders', 'Maintenance Tech'],
      infrastructure: ['Bike Storage', 'Charging Station', 'Maintenance Workshop']
    },
    industrySpecifics: {
      type: 'service',
      keyMetrics: [
        'Deliveries per Day',
        'Average Delivery Time',
        'Customer Rating',
        'Rider Utilization'
      ],
      successFactors: [
        'Quick Delivery Times',
        'Reliable Service',
        'Environmental Impact',
        'Customer Service'
      ],
      risks: [
        'Weather Dependency',
        'Equipment Maintenance',
        'Rider Safety',
        'Peak Hour Management'
      ],
      seasonality: {
        highSeasons: ['Summer', 'Holiday Season'],
        lowSeasons: ['Winter', 'Early Spring'],
        impact: 30
      }
    },
    monthlyProgression: {
      milestones: [
        'First 1000 Deliveries',
        'Fleet Expansion',
        'Coverage Area Extension',
        'Premium Service Launch'
      ],
      challenges: [
        'Weather Management',
        'Peak Hour Capacity',
        'Equipment Maintenance',
        'Staff Retention'
      ],
      opportunities: [
        'Corporate Partnerships',
        'Event Catering',
        'Subscription Service',
        'Green Initiative Grants'
      ]
    }
  }
  // Add other business ideas similarly
];