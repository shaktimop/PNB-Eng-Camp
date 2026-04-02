import { NextResponse } from 'next/server';
import { campaignData as fallbackData } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const envSheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;
  const envApiKey = process.env.GOOGLE_SHEETS_API_KEY;
  
  // Clean up any potential quotes or whitespace from env vars
  let cleanSheetId = envSheetId ? envSheetId.replace(/['"]/g, '').trim() : "";
  if (cleanSheetId === 'v1A8nYYHTgG3x6vOBYWuUHWlaUZP-LVYdABheA5LkMg20') {
    cleanSheetId = '1A8nYYHTgG3x6vOBYWuUHWlaUZP-LVYdABheA5LkMg20';
  }
  const cleanApiKey = envApiKey ? envApiKey.replace(/['"]/g, '').trim() : "";

  const sheetId = cleanSheetId || "1A8nYYHTgG3x6vOBYWuUHWlaUZP-LVYdABheA5LkMg20";
  const apiKey = cleanApiKey || "AIzaSyBWfXBE01o_AIkWQI6s_Yqt_o2vW4-L5js";

  if (!sheetId || !apiKey) {
    return NextResponse.json({ data: fallbackData, isMock: true });
  }

  try {
    const ranges = ['Overview!A:B', 'Platforms!A:J', 'Demographics!A:C'];
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:batchGet?ranges=${ranges.join('&ranges=')}&key=${apiKey}`;
    
    console.log("Fetching Google Sheets URL:", url.replace(apiKey, 'HIDDEN_API_KEY'));

    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Sheets API Error Response:", errorText);
      return NextResponse.json({ data: fallbackData, isMock: true, error: `Google Sheets API error: ${response.statusText}`, errorDetails: errorText, debug: { sheetId, apiKey } });
    }

    const result = await response.json();
    const valueRanges = result.valueRanges;

    if (!valueRanges || valueRanges.length === 0) {
       return NextResponse.json({ data: fallbackData, isMock: true, error: "No data found in sheet" });
    }

    // Parse Overview
    const overviewRows = valueRanges[0]?.values || [];
    const overviewMap = Object.fromEntries(overviewRows.map((row: any[]) => [row[0], row[1]]));

    // Parse Platforms
    const platformRows = valueRanges[1]?.values || [];
    const platforms = platformRows.slice(1).map((row: any[]) => {
      const name = row[0];
      const fallbackPlatform = fallbackData.platforms.find(p => p.name === name);
      
      const impressions = parseInt(row[1] || '0', 10);
      const engagement = parseInt(row[2] || '0', 10);
      const reach = parseInt(row[3] || '0', 10);
      
      return {
        name,
        icon: name?.toLowerCase().replace(/[^a-z]/g, ''),
        metrics: {
          impressions,
          engagement,
          reach,
          views: parseInt(row[4] || '0', 10),
          clicks: parseInt(row[5] || '0', 10),
        },
        targets: {
          impressions: parseInt(row[7] || '0', 10) || fallbackPlatform?.targets?.impressions || Math.floor(impressions * 1.25),
          engagement: parseInt(row[8] || '0', 10) || fallbackPlatform?.targets?.engagement || Math.floor(engagement * 1.25),
          reach: parseInt(row[9] || '0', 10) || fallbackPlatform?.targets?.reach || Math.floor(reach * 1.25),
        },
        trends: {
          impressions: "+0%", engagement: "+0%", reach: "+0%"
        },
        creative: row[6] || "https://picsum.photos/seed/placeholder/400/300"
      };
    });

    // Parse Demographics
    const demoRows = valueRanges[2]?.values || [];
    const age: any[] = [];
    const gender: any[] = [];
    const geography: any[] = [];

    demoRows.slice(1).forEach((row: any[]) => {
      const type = row[0];
      const label = row[1];
      const value = parseInt(row[2] || '0', 10);
      if (type === 'Age') age.push({ group: label, value });
      if (type === 'Gender') gender.push({ name: label, value });
      if (type === 'Region') geography.push({ region: label, value });
    });

    const liveData = {
      ...fallbackData,
      title: overviewMap['Title'] || fallbackData.title,
      duration: {
        totalDays: parseInt(overviewMap['Total Days']) || fallbackData.duration.totalDays,
        completedDays: parseInt(overviewMap['Completed Days']) || fallbackData.duration.completedDays,
        remainingDays: (parseInt(overviewMap['Total Days']) - parseInt(overviewMap['Completed Days'])) || fallbackData.duration.remainingDays,
      },
      budget: {
        allocated: parseInt(overviewMap['Budget Allocated']) || fallbackData.budget.allocated,
        spent: parseInt(overviewMap['Budget Spent']) || fallbackData.budget.spent,
      },
      platforms: platforms.length > 0 ? platforms : fallbackData.platforms,
      audience: {
        ...fallbackData.audience,
        age: age.length > 0 ? age : fallbackData.audience.age,
        gender: gender.length > 0 ? gender : fallbackData.audience.gender,
        geography: geography.length > 0 ? geography : fallbackData.audience.geography,
      }
    };

    return NextResponse.json({ data: liveData, isMock: false });
  } catch (error: any) {
    console.error("Google Sheets Error:", error);
    return NextResponse.json({ data: fallbackData, isMock: true, error: "Failed to load live data", details: error.message || String(error) });
  }
}
