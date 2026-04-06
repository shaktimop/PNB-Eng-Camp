"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  Facebook, Instagram, Youtube, Twitter, Linkedin, 
  TrendingUp, MapPin, Target, Activity, IndianRupee,
  Filter, Calendar, Download, AlertCircle, X
} from 'lucide-react';
import Image from 'next/image';

const COLORS = ['#003366', '#005b9f', '#0084d8', '#4db8ff', '#99d6ff', '#e6f5ff'];

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-IN').format(num || 0);
};

const formatCurrency = (num: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num || 0);
};

export default function Dashboard() {
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [fromDate, setFromDate] = useState('2026-04-01');
  const [toDate, setToDate] = useState('2026-06-30');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/data?from=${fromDate}&to=${toDate}`);
        const json = await res.json();
        setData(json.data);
        setIsMock(json.isMock);
      } catch (e) {
        console.error("Failed to fetch data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fromDate, toDate]);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366]"></div>
          <p className="text-slate-500 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const availablePlatforms = data.platforms.filter((p: any) => {
    const name = p.name.toLowerCase();
    return !name.includes('linkedin') && !name.includes('twitter') && name !== 'x';
  });

  const filteredPlatforms = selectedPlatform === 'All' 
    ? availablePlatforms 
    : availablePlatforms.filter((p: any) => p.name === selectedPlatform);

  let rawSheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || "1A8nYYHTgG3x6vOBYWuUHWlaUZP-LVYdABheA5LkMg20";
  let sheetId = rawSheetId.replace(/['"]/g, '').trim();
  if (sheetId === 'v1A8nYYHTgG3x6vOBYWuUHWlaUZP-LVYdABheA5LkMg20') {
    sheetId = '1A8nYYHTgG3x6vOBYWuUHWlaUZP-LVYdABheA5LkMg20';
  }
  
  const downloadUrl = sheetId 
    ? `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx`
    : '#';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      {isMock && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-amber-800 flex items-center justify-center gap-2 text-sm font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p>Showing sample data. To connect your live Google Sheet, configure <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_GOOGLE_SHEET_ID</code> and <code className="bg-amber-100 px-1 rounded">GOOGLE_SHEETS_API_KEY</code>.</p>
        </div>
      )}

      {/* Header Section */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col xl:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full xl:w-auto">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Punjab_National_Bank_new_logo.svg/960px-Punjab_National_Bank_new_logo.svg.png" 
              alt="PNB Logo" 
              className="h-10 w-auto object-contain flex-shrink-0"
              onError={(e) => { e.currentTarget.src = 'https://logo.clearbit.com/pnbindia.in' }}
            />
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#003366] truncate">
                {data.title}
              </h1>
              <p className="text-sm font-bold bg-gradient-to-r from-[#ff8c00] to-[#ff5722] bg-clip-text text-transparent">Engagement Campaign Report - AMJ 2026</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-start xl:justify-end">
            {/* Platform Filter */}
            <div className="flex items-center bg-slate-100 rounded-md px-3 py-2 border border-slate-200 flex-1 sm:flex-none">
              <Filter className="w-4 h-4 mr-2 text-slate-500 flex-shrink-0" />
              <select 
                className="bg-transparent border-none text-sm font-medium focus:ring-0 text-slate-700 outline-none w-full"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
              >
                <option value="All">All Platforms</option>
                {availablePlatforms.map((p: any) => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Date Selectors */}
            <div className="flex items-center bg-slate-100 rounded-md px-3 py-2 border border-slate-200 gap-2 flex-1 sm:flex-none">
              <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <input 
                type="date" 
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="bg-transparent border-none text-sm font-medium focus:ring-0 text-slate-700 outline-none w-full sm:w-32"
              />
              <span className="text-slate-400 text-sm">to</span>
              <input 
                type="date" 
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="bg-transparent border-none text-sm font-medium focus:ring-0 text-slate-700 outline-none w-full sm:w-32"
              />
            </div>

            {/* Download Excel Button */}
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (!sheetId) {
                  e.preventDefault();
                  alert("Please configure NEXT_PUBLIC_GOOGLE_SHEET_ID in your environment variables to enable downloads.");
                }
              }}
              className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium shadow-sm flex-1 sm:flex-none whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Download Excel</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Row: Timer, Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Section 1: Campaign Timer */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-[#003366]">
                <Activity className="w-5 h-5 text-[#ff8c00]" />
                Campaign Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-between relative h-[220px] pb-4">
              <div className="w-full flex-1 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff8c00" />
                        <stop offset="100%" stopColor="#ff5722" />
                      </linearGradient>
                    </defs>
                    <Pie
                      data={[
                        { name: 'Completed', value: data.duration.completedDays },
                        { name: 'Remaining', value: data.duration.remainingDays },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={70}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell fill="url(#orangeGradient)" />
                      <Cell fill="#e2e8f0" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold text-[#003366]">{data.duration.totalDays}</span>
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Days Total</span>
                </div>
              </div>
              <div className="w-full flex justify-between text-sm mt-2 px-4">
                <span className="text-[#ff8c00] font-semibold">{data.duration.completedDays} Days Done</span>
                <span className="text-slate-500">{data.duration.remainingDays} Days Left</span>
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Budget Tracking */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-[#003366]">
                <IndianRupee className="w-5 h-5 text-[#ff8c00]" />
                Budget Utilization
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-center h-[200px] space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">Total Spent</p>
                  <h3 className="text-3xl font-bold text-[#003366]">{formatCurrency(data.budget.spent)}</h3>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 font-medium mb-1">Allocated</p>
                  <h3 className="text-xl font-semibold text-slate-400">{formatCurrency(data.budget.allocated)}</h3>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-700">Utilization</span>
                  <span className="text-rose-500 font-bold">
                    {((data.budget.spent / data.budget.allocated) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#ff8c00] to-rose-500 rounded-full"
                    style={{ width: `${Math.min(100, (data.budget.spent / data.budget.allocated) * 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Section 2: Platform KPIs */}
        <div>
          <h2 className="text-xl font-bold text-[#003366] mb-4 flex items-center gap-2">
            Platform Performance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlatforms.map((platform: any) => {
              let Icon = Facebook;
              let colorClass = "text-blue-600";
              let bgClass = "bg-blue-50";
              
              const pName = platform.name.toLowerCase();
              if (pName.includes('instagram')) { Icon = Instagram; colorClass = "text-pink-600"; bgClass = "bg-pink-50"; }
              else if (pName.includes('youtube')) { Icon = Youtube; colorClass = "text-red-600"; bgClass = "bg-red-50"; }
              else if (pName.includes('twitter') || pName === 'x') { Icon = Twitter; colorClass = "text-sky-500"; bgClass = "bg-sky-50"; }
              else if (pName.includes('linkedin')) { Icon = Linkedin; colorClass = "text-blue-700"; bgClass = "bg-blue-50"; }
              else if (pName.includes('facebook')) { Icon = Facebook; colorClass = "text-blue-600"; bgClass = "bg-blue-50"; }

              return (
                <Card key={platform.name} className="shadow-sm hover:shadow-md transition-shadow border-slate-200">
                  <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-semibold text-slate-700">{platform.name}</CardTitle>
                    <div className={`p-2 rounded-md ${bgClass}`}>
                      <Icon className={`w-4 h-4 ${colorClass}`} />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 space-y-4">
                    {Object.entries(platform.metrics).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-end">
                        <div>
                          <p className="text-xs text-slate-500 capitalize">{key}</p>
                          <p className="text-lg font-bold text-[#003366]">{formatNumber(value as number)}</p>
                        </div>
                        <div className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {platform.trends[key as keyof typeof platform.trends] || '+0%'}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Middle Row: Platform KPI Targets vs Actuals */}
        <div className="grid grid-cols-1 gap-6">
          
          {/* Section 3: Platform KPI Targets vs Actuals */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg text-[#003366]">Platform KPI Targets vs Actuals</CardTitle>
              <CardDescription>Impressions, Engagement, and Reach progress by platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {filteredPlatforms.map((platform: any) => {
                  const metrics = [
                    { name: 'Impressions', actual: platform.metrics.impressions || 0, target: platform.targets?.impressions || 0 },
                    { name: 'Engagement', actual: platform.metrics.engagement || platform.metrics.views || platform.metrics.clicks || 0, target: platform.targets?.engagement || 0 },
                    { name: 'Reach', actual: platform.metrics.reach || 0, target: platform.targets?.reach || 0 },
                  ];

                  let styles = { bg: 'bg-slate-50 border-slate-100', gradient: 'from-slate-400 to-slate-600', iconBg: 'bg-slate-100 text-slate-600' };
                  if (platform.name === 'Facebook') styles = { bg: 'bg-blue-50/50 border-blue-100', gradient: 'from-blue-400 to-blue-600', iconBg: 'bg-blue-100 text-blue-600' };
                  else if (platform.name === 'Instagram') styles = { bg: 'bg-pink-50/50 border-pink-100', gradient: 'from-pink-400 to-pink-600', iconBg: 'bg-pink-100 text-pink-600' };
                  else if (platform.name === 'YouTube') styles = { bg: 'bg-red-50/50 border-red-100', gradient: 'from-red-400 to-red-600', iconBg: 'bg-red-100 text-red-600' };
                  else if (platform.name === 'X (Twitter)') styles = { bg: 'bg-slate-100/50 border-slate-200', gradient: 'from-slate-600 to-slate-800', iconBg: 'bg-slate-200 text-slate-800' };
                  else if (platform.name === 'LinkedIn') styles = { bg: 'bg-sky-50/50 border-sky-100', gradient: 'from-sky-400 to-sky-600', iconBg: 'bg-sky-100 text-sky-600' };

                  return (
                    <div key={platform.name} className={`flex flex-col md:flex-row md:items-center gap-4 border rounded-xl p-5 ${styles.bg}`}>
                      <div className="w-full md:w-48 flex items-center gap-3 flex-shrink-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${styles.iconBg}`}>
                          {(platform.name.toLowerCase().includes('facebook')) && <Facebook className="w-5 h-5" />}
                          {(platform.name.toLowerCase().includes('instagram')) && <Instagram className="w-5 h-5" />}
                          {(platform.name.toLowerCase().includes('youtube')) && <Youtube className="w-5 h-5" />}
                          {(platform.name.toLowerCase().includes('twitter') || platform.name.toLowerCase() === 'x') && <Twitter className="w-5 h-5" />}
                          {(platform.name.toLowerCase().includes('linkedin')) && <Linkedin className="w-5 h-5" />}
                        </div>
                        <span className="font-semibold text-slate-700">{platform.name}</span>
                      </div>
                      
                      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {metrics.map(m => {
                          const percent = m.target > 0 ? Math.min(100, Math.round((m.actual / m.target) * 100)) : 0;
                          return (
                            <div key={m.name} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">{m.name}</span>
                                <span className="text-slate-700">
                                  <span className="font-semibold">{formatNumber(m.actual)}</span>
                                  <span className="text-slate-400 text-xs ml-1">/ {formatNumber(m.target)}</span>
                                </span>
                              </div>
                              <div className="h-5 w-full bg-white rounded-full overflow-hidden border border-black/5 shadow-inner">
                                <div 
                                  className={`h-full rounded-full flex items-center justify-end pr-2 text-[11px] text-white font-bold bg-gradient-to-r ${styles.gradient}`}
                                  style={{ width: `${percent}%`, minWidth: percent > 0 ? '2.5rem' : '0' }}
                                >
                                  {percent > 0 ? `${percent}%` : ''}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Bottom Row: Creative Showcase */}
        <div className="grid grid-cols-1 gap-6">
          
          {/* Section 6: Creative Showcase */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg text-[#003366]">Creative Showcase</CardTitle>
              <CardDescription>Top performing creatives across platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                {availablePlatforms.map((platform: any) => {
                  let creativeUrl = platform.creative;
                  if (platform.name === 'Facebook') creativeUrl = 'https://blog.hootsuite.com/wp-content/uploads/2023/11/How-to-schedule-a-post-on-facebook-21.png';
                  if (platform.name === 'Instagram') creativeUrl = 'https://www.postplanner.com/hubfs/what-to-post-on-instagram.png';
                  if (platform.name === 'YouTube') creativeUrl = 'https://i.ytimg.com/vi/w25FNPlnXXQ/maxresdefault.jpg';
                  if (platform.name === 'LinkedIn') creativeUrl = 'https://revenuezen.com/wp-content/uploads/2021/12/examples-of-good-linkedin-posts-2-1024x801-1.png';
                  if (platform.name === 'X (Twitter)') creativeUrl = 'https://static01.nyt.com/images/2021/06/03/business/oakImage-1622737554865/oakImage-1622737554865-superJumbo.png';

                  return (
                  <div 
                    key={platform.name} 
                    className="group relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50 aspect-[4/3] cursor-pointer"
                    onClick={() => setSelectedImage(creativeUrl)}
                  >
                    <Image 
                      src={creativeUrl} 
                      alt={`${platform.name} creative`}
                      fill
                      unoptimized
                      className="object-cover transition-transform group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
                      <p className="text-white text-xs font-semibold">{platform.name}</p>
                    </div>
                  </div>
                )})}
              </div>
            </CardContent>
          </Card>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-4">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Punjab_National_Bank_new_logo.svg/960px-Punjab_National_Bank_new_logo.svg.png" 
            alt="Punjab National Bank" 
            className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100"
            onError={(e) => { e.currentTarget.src = 'https://logo.clearbit.com/pnbindia.in' }}
          />
          <div className="text-center">
            <p className="text-sm text-slate-500 font-medium">
              Punjab National Bank • Campaign Pulse Dashboard
            </p>
            <p className="text-xs text-slate-400 mt-1">
              © Goldmine Advertising Pvt. Ltd., 2026. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
            <button 
              className="absolute -top-12 right-0 text-white hover:text-slate-300 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X className="w-8 h-8" />
            </button>
            <img 
              src={selectedImage} 
              alt="Full screen creative" 
              className="max-w-full max-h-[90vh] object-contain rounded-md"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
