import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Types
interface ProjectionData {
  age: number;
  total: number;
  contributions: number;
  dividends: number;
}

// Best practices data
const bestPractices = [
  {
    title: 'Start with Index Funds',
    description:
      'VOO, VTI, or VXUS provide instant diversification with minimal fees. Warren Buffett recommends S&P 500 index funds for most investors.',
    icon: '01',
  },
  {
    title: 'Maximize Tax-Advantaged Accounts',
    description:
      'Open a Roth IRA on Robinhood. Contributions grow tax-free, and you can withdraw gains tax-free after 59½.',
    icon: '02',
  },
  {
    title: 'Enable Dividend Reinvestment',
    description:
      'DRIP (Dividend Reinvestment Plan) automatically reinvests dividends to buy more shares, accelerating compound growth.',
    icon: '03',
  },
  {
    title: 'Dollar-Cost Average',
    description:
      'Invest a fixed amount regularly regardless of market conditions. This reduces timing risk and builds discipline.',
    icon: '04',
  },
  {
    title: 'Keep Emergency Fund Separate',
    description:
      'Maintain 3-6 months expenses in a high-yield savings account before aggressive investing.',
    icon: '05',
  },
  {
    title: 'Avoid Individual Stock Picking',
    description:
      '90% of actively managed funds underperform the index. Keep speculative plays under 5% of portfolio.',
    icon: '06',
  },
];

// Calculate projections
function calculateProjections(
  monthlyContribution: number,
  startAge: number,
  annualReturn: number,
  dividendYield: number
): ProjectionData[] {
  const data: ProjectionData[] = [];
  let totalValue = 0;
  let totalContributions = 0;
  let accumulatedDividends = 0;

  for (let age = startAge; age <= 65; age++) {
    const yearlyContribution = monthlyContribution * 12;
    totalContributions += yearlyContribution;

    // Growth from previous year
    const growthReturn = (annualReturn - dividendYield) / 100;
    const dividendReturn = dividendYield / 100;

    totalValue = totalValue * (1 + growthReturn + dividendReturn) + yearlyContribution;
    accumulatedDividends += totalValue * dividendReturn;

    data.push({
      age,
      total: Math.round(totalValue),
      contributions: Math.round(totalContributions),
      dividends: Math.round(accumulatedDividends),
    });
  }

  return data;
}

// Format currency
function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
}

// Custom tooltip
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    payload: ProjectionData;
  }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#1a1a1a] border border-[#d4a574]/30 p-4 rounded-lg shadow-2xl">
        <p className="text-[#d4a574] font-display text-lg mb-2">Age {data.age}</p>
        <p className="text-cream text-sm">
          Portfolio: <span className="text-[#d4a574] font-semibold">{formatCurrency(data.total)}</span>
        </p>
        <p className="text-cream/60 text-xs mt-1">
          You contributed: {formatCurrency(data.contributions)}
        </p>
        <p className="text-emerald-400/80 text-xs">
          Growth + Dividends: {formatCurrency(data.total - data.contributions)}
        </p>
      </div>
    );
  }
  return null;
}

function App() {
  const [monthlyAmount, setMonthlyAmount] = useState(300);
  const [startAge, setStartAge] = useState(21);
  const [annualReturn, setAnnualReturn] = useState(10);
  const [dividendYield, setDividendYield] = useState(1.8);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const projections = useMemo(
    () => calculateProjections(monthlyAmount, startAge, annualReturn, dividendYield),
    [monthlyAmount, startAge, annualReturn, dividendYield]
  );

  const finalValue = projections[projections.length - 1];
  const totalContributed = monthlyAmount * 12 * (65 - startAge);
  const totalGrowth = finalValue.total - totalContributed;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-cream relative overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#d4a574]/5 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#d4a574]/3 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 px-4 md:px-8 lg:px-16 py-8 md:py-16 max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 md:mb-20"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-8">
            <div>
              <p className="text-[#d4a574] tracking-[0.3em] uppercase text-xs md:text-sm mb-2 md:mb-4 font-medium">
                Wealth Building Guide
              </p>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.9] tracking-tight">
                Your{' '}
                <span className="text-[#d4a574] italic">Future</span>
                <br />
                <span className="text-cream/40">Starts Now</span>
              </h1>
            </div>
            <p className="text-cream/50 max-w-xs text-sm md:text-base leading-relaxed">
              Long-term investment strategies for Robinhood users aged 19-25. Compound growth is your greatest asset.
            </p>
          </div>
        </motion.header>

        {/* Main Calculator Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-24"
        >
          <div className="grid lg:grid-cols-[400px_1fr] gap-8 lg:gap-12">
            {/* Controls */}
            <div className="bg-[#151515] rounded-2xl p-6 md:p-8 border border-white/5">
              <h2 className="font-display text-xl md:text-2xl mb-6 md:mb-8">
                Projection <span className="text-[#d4a574]">Calculator</span>
              </h2>

              <div className="space-y-6 md:space-y-8">
                <div>
                  <label className="flex justify-between text-sm text-cream/60 mb-3">
                    <span>Monthly Investment</span>
                    <span className="text-[#d4a574] font-semibold">${monthlyAmount}</span>
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="2000"
                    step="50"
                    value={monthlyAmount}
                    onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                    className="w-full h-2 bg-[#2a2a2a] rounded-full appearance-none cursor-pointer slider-thumb"
                  />
                  <div className="flex justify-between text-xs text-cream/30 mt-2">
                    <span>$50</span>
                    <span>$2,000</span>
                  </div>
                </div>

                <div>
                  <label className="flex justify-between text-sm text-cream/60 mb-3">
                    <span>Starting Age</span>
                    <span className="text-[#d4a574] font-semibold">{startAge} years</span>
                  </label>
                  <input
                    type="range"
                    min="19"
                    max="25"
                    value={startAge}
                    onChange={(e) => setStartAge(Number(e.target.value))}
                    className="w-full h-2 bg-[#2a2a2a] rounded-full appearance-none cursor-pointer slider-thumb"
                  />
                  <div className="flex justify-between text-xs text-cream/30 mt-2">
                    <span>19</span>
                    <span>25</span>
                  </div>
                </div>

                <div>
                  <label className="flex justify-between text-sm text-cream/60 mb-3">
                    <span>Expected Annual Return</span>
                    <span className="text-[#d4a574] font-semibold">{annualReturn}%</span>
                  </label>
                  <input
                    type="range"
                    min="6"
                    max="12"
                    step="0.5"
                    value={annualReturn}
                    onChange={(e) => setAnnualReturn(Number(e.target.value))}
                    className="w-full h-2 bg-[#2a2a2a] rounded-full appearance-none cursor-pointer slider-thumb"
                  />
                  <div className="flex justify-between text-xs text-cream/30 mt-2">
                    <span>6% (Conservative)</span>
                    <span>12% (Aggressive)</span>
                  </div>
                </div>

                <div>
                  <label className="flex justify-between text-sm text-cream/60 mb-3">
                    <span>Dividend Yield (DRIP)</span>
                    <span className="text-[#d4a574] font-semibold">{dividendYield}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="0.2"
                    value={dividendYield}
                    onChange={(e) => setDividendYield(Number(e.target.value))}
                    className="w-full h-2 bg-[#2a2a2a] rounded-full appearance-none cursor-pointer slider-thumb"
                  />
                  <div className="flex justify-between text-xs text-cream/30 mt-2">
                    <span>0% (Growth)</span>
                    <span>4% (Dividend)</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-white/5">
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <p className="text-cream/40 text-xs uppercase tracking-wider mb-1">At 65</p>
                    <p className="font-display text-2xl md:text-3xl text-[#d4a574]">
                      {formatCurrency(finalValue.total)}
                    </p>
                  </div>
                  <div>
                    <p className="text-cream/40 text-xs uppercase tracking-wider mb-1">You Put In</p>
                    <p className="font-display text-2xl md:text-3xl text-cream/60">
                      {formatCurrency(totalContributed)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 md:mt-6 p-3 md:p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <p className="text-emerald-400 text-xs md:text-sm">
                    <span className="font-semibold">{formatCurrency(totalGrowth)}</span> in pure growth —
                    that's <span className="font-semibold">{((totalGrowth / totalContributed) * 100).toFixed(0)}%</span> more
                    than you contributed!
                  </p>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-[#151515] rounded-2xl p-4 md:p-8 border border-white/5 min-h-[400px] md:min-h-[500px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
                <h2 className="font-display text-xl md:text-2xl">
                  Growth <span className="text-[#d4a574]">Projection</span>
                </h2>
                <div className="flex gap-4 md:gap-6 text-xs md:text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#d4a574]" />
                    Portfolio Value
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-cream/30" />
                    Contributions
                  </span>
                </div>
              </div>

              <div className="h-[300px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projections} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d4a574" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#d4a574" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorContributions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f5f0e8" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#f5f0e8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis
                      dataKey="age"
                      stroke="#666"
                      tick={{ fill: '#888', fontSize: 12 }}
                      tickLine={{ stroke: '#444' }}
                    />
                    <YAxis
                      stroke="#666"
                      tick={{ fill: '#888', fontSize: 12 }}
                      tickLine={{ stroke: '#444' }}
                      tickFormatter={(value) => formatCurrency(value)}
                      width={70}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="contributions"
                      stroke="#f5f0e8"
                      strokeOpacity={0.3}
                      fillOpacity={1}
                      fill="url(#colorContributions)"
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#d4a574"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorTotal)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Best Practices */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-24"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12">
            <div>
              <p className="text-[#d4a574] tracking-[0.3em] uppercase text-xs mb-2 md:mb-4 font-medium">
                Essential Knowledge
              </p>
              <h2 className="font-display text-3xl md:text-5xl">
                Best <span className="text-[#d4a574] italic">Practices</span>
              </h2>
            </div>
            <p className="text-cream/50 max-w-sm text-sm leading-relaxed">
              Time-tested strategies that have built generational wealth
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {bestPractices.map((practice, index) => (
              <motion.article
                key={practice.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{
                  duration: 0.6,
                  delay: 0.5 + index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group bg-[#151515] rounded-2xl p-5 md:p-6 border border-white/5 hover:border-[#d4a574]/30 transition-all duration-500 hover:bg-[#1a1a1a]"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[#d4a574]/40 font-display text-3xl md:text-4xl tracking-tighter group-hover:text-[#d4a574]/60 transition-colors">
                    {practice.icon}
                  </span>
                </div>
                <h3 className="font-display text-lg md:text-xl mb-3 group-hover:text-[#d4a574] transition-colors">
                  {practice.title}
                </h3>
                <p className="text-cream/50 text-sm leading-relaxed">{practice.description}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* Key Metrics */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-24"
        >
          <div className="bg-gradient-to-br from-[#d4a574]/10 to-transparent rounded-3xl p-6 md:p-12 border border-[#d4a574]/20">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              <div className="text-center md:text-left">
                <p className="text-[#d4a574] tracking-[0.2em] uppercase text-xs mb-2">Historical S&P 500</p>
                <p className="font-display text-4xl md:text-6xl">10.5%</p>
                <p className="text-cream/40 text-sm mt-2">Average annual return since 1957</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[#d4a574] tracking-[0.2em] uppercase text-xs mb-2">Power of Starting Young</p>
                <p className="font-display text-4xl md:text-6xl">2x</p>
                <p className="text-cream/40 text-sm mt-2">Starting at 19 vs 25 can double your wealth</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[#d4a574] tracking-[0.2em] uppercase text-xs mb-2">DRIP Impact</p>
                <p className="font-display text-4xl md:text-6xl">+42%</p>
                <p className="text-cream/40 text-sm mt-2">Extra growth from dividend reinvestment</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Recommended Funds */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-20"
        >
          <h2 className="font-display text-2xl md:text-3xl mb-6 md:mb-8">
            Recommended <span className="text-[#d4a574]">ETFs</span>
          </h2>
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 text-cream/40 text-xs uppercase tracking-wider font-normal">
                    Ticker
                  </th>
                  <th className="text-left py-4 text-cream/40 text-xs uppercase tracking-wider font-normal">
                    Name
                  </th>
                  <th className="text-left py-4 text-cream/40 text-xs uppercase tracking-wider font-normal">
                    Expense Ratio
                  </th>
                  <th className="text-left py-4 text-cream/40 text-xs uppercase tracking-wider font-normal">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { ticker: 'VOO', name: 'Vanguard S&P 500 ETF', expense: '0.03%', type: 'Large Cap US' },
                  { ticker: 'VTI', name: 'Vanguard Total Stock Market', expense: '0.03%', type: 'Total US Market' },
                  { ticker: 'VXUS', name: 'Vanguard Total International', expense: '0.07%', type: 'International' },
                  { ticker: 'SCHD', name: 'Schwab US Dividend Equity', expense: '0.06%', type: 'Dividend Growth' },
                  { ticker: 'QQQ', name: 'Invesco QQQ Trust', expense: '0.20%', type: 'Tech/Growth' },
                ].map((fund) => (
                  <tr key={fund.ticker} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-4 font-display text-[#d4a574]">{fund.ticker}</td>
                    <td className="py-4">{fund.name}</td>
                    <td className="py-4 text-emerald-400">{fund.expense}</td>
                    <td className="py-4 text-cream/60">{fund.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="pt-8 border-t border-white/5">
          <p className="text-center text-cream/30 text-xs">
            Requested by @Quincy · Built by @clonkbot
          </p>
        </footer>
      </div>

      <style>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #d4a574;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(212, 165, 116, 0.4);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 0 30px rgba(212, 165, 116, 0.6);
        }
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #d4a574;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 20px rgba(212, 165, 116, 0.4);
        }
      `}</style>
    </div>
  );
}

export default App;
