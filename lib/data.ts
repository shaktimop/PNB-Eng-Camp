export const campaignData = {
  title: "PNB on Pulse: Engagement Campaign",
  duration: {
    totalDays: 90,
    completedDays: 45,
    remainingDays: 45,
  },
  platforms: [
    {
      name: "Facebook",
      icon: "facebook",
      metrics: {
        impressions: 1200000,
        engagement: 45000,
        reach: 800000,
      },
      targets: {
        impressions: 1500000,
        engagement: 60000,
        reach: 1000000,
      },
      trends: {
        impressions: "+12%",
        engagement: "+5%",
        reach: "+8%",
      },
      creative: "https://about.fb.com/wp-content/uploads/2025/03/02_Pin-a-Tab.gif"
    },
    {
      name: "Instagram",
      icon: "instagram",
      metrics: {
        impressions: 2500000,
        engagement: 150000,
        reach: 1800000,
      },
      targets: {
        impressions: 3000000,
        engagement: 180000,
        reach: 2200000,
      },
      trends: {
        impressions: "+25%",
        engagement: "+18%",
        reach: "+20%",
      },
      creative: "https://picsum.photos/seed/pnb-ig/400/300"
    },
    {
      name: "YouTube",
      icon: "youtube",
      metrics: {
        impressions: 5000000,
        views: 1200000,
        reach: 3500000,
      },
      targets: {
        impressions: 6000000,
        engagement: 1500000, // Using views as engagement target
        reach: 4000000,
      },
      trends: {
        impressions: "+15%",
        views: "+10%",
        reach: "+12%",
      },
      creative: "https://picsum.photos/seed/pnb-yt/400/300"
    },
    {
      name: "X (Twitter)",
      icon: "twitter",
      metrics: {
        impressions: 800000,
        engagement: 25000,
        reach: 500000,
      },
      targets: {
        impressions: 1000000,
        engagement: 35000,
        reach: 600000,
      },
      trends: {
        impressions: "+8%",
        engagement: "+3%",
        reach: "+5%",
      },
      creative: "https://picsum.photos/seed/pnb-x/400/300"
    },
    {
      name: "LinkedIn",
      icon: "linkedin",
      metrics: {
        impressions: 600000,
        clicks: 15000,
      },
      targets: {
        impressions: 800000,
        engagement: 20000, // Using clicks as engagement target
        reach: 500000,
      },
      trends: {
        impressions: "+20%",
        clicks: "+15%",
      },
      creative: "https://picsum.photos/seed/pnb-li/400/300"
    }
  ],
  summary: {
    targeted: [
      { name: 'Impressions', target: 12000000, achieved: 10100000 },
      { name: 'Engagement', target: 300000, achieved: 235000 },
      { name: 'Reach', target: 8000000, achieved: 6600000 },
    ],
    overall: {
      target: 20000000,
      actual: 16935000,
      percentage: 84.6
    }
  },
  budget: {
    allocated: 5000000,
    spent: 3800000,
  },
  audience: {
    age: [
      { group: "18-24", value: 35 },
      { group: "25-34", value: 45 },
      { group: "35-44", value: 15 },
      { group: "45+", value: 5 },
    ],
    gender: [
      { name: "Male", value: 60 },
      { name: "Female", value: 38 },
      { name: "Other", value: 2 },
    ],
    geography: [
      { region: "Maharashtra", value: 25 },
      { region: "Delhi NCR", value: 20 },
      { region: "Karnataka", value: 15 },
      { region: "Gujarat", value: 12 },
      { region: "Tamil Nadu", value: 10 },
      { region: "Others", value: 18 },
    ],
    interests: ["Finance", "Investment", "Technology", "Business", "Startups"]
  }
}
