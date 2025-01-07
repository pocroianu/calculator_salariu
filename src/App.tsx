import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, Info, Languages, Copy, RotateCcw, AlertCircle } from 'lucide-react';
import { Chart } from 'react-google-charts';

const MAX_SALARY = 1000000;
const DEFAULT_SALARY = 5800;

const translations = {
  ro: {
    title: 'Calculator Salariu Net',
    grossSalary: 'Salariu Brut (RON)',
    calculationDetails: 'Detalii Calcul:',
    healthInsurance: 'Contribuția la sănătate (10%)',
    socialInsurance: 'Contribuția la asigurări sociale (25%)',
    incomeTax: 'Impozit pe venit (10% după contribuții)',
    netSalary: 'Salariu Net',
    finalNetSalary: 'Salariu Net Final',
    chartTitle: 'Distribuția Salariului',
    period: 'Perioadă',
    monthly: 'Lunar',
    yearly: 'Anual',
    reset: 'Resetează',
    copy: 'Copiază rezultatele',
    copied: 'Copiat!',
    invalidInput: 'Vă rugăm introduceți o valoare între 1 și 1,000,000 RON',
    tooltips: {
      health: 'Contribuția obligatorie la sistemul de sănătate',
      social: 'Contribuția la sistemul de asigurări sociale',
      tax: 'Impozitul pe venit calculat după deducerea contribuțiilor',
    }
  },
  en: {
    title: 'Net Salary Calculator',
    grossSalary: 'Gross Salary (RON)',
    calculationDetails: 'Calculation Details:',
    healthInsurance: 'Health Insurance (10%)',
    socialInsurance: 'Social Insurance (25%)',
    incomeTax: 'Income Tax (10% after contributions)',
    netSalary: 'Net Salary',
    finalNetSalary: 'Final Net Salary',
    chartTitle: 'Salary Distribution',
    period: 'Period',
    monthly: 'Monthly',
    yearly: 'Yearly',
    reset: 'Reset',
    copy: 'Copy results',
    copied: 'Copied!',
    invalidInput: 'Please enter a value between 1 and 1,000,000 RON',
    tooltips: {
      health: 'Mandatory contribution to the health system',
      social: 'Contribution to the social security system',
      tax: 'Income tax calculated after deducting contributions',
    }
  }
};

function App() {
  const [language, setLanguage] = useState<'ro' | 'en'>('ro');
  const [grossSalary, setGrossSalary] = useState<number>(DEFAULT_SALARY);
  const [isYearly, setIsYearly] = useState(false);
  const [netSalary, setNetSalary] = useState<number>(0);
  const [breakdown, setBreakdown] = useState({
    healthInsurance: 0,
    socialInsurance: 0,
    incomeTax: 0
  });
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const t = translations[language];

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(language === 'ro' ? 'ro-RO' : 'en-US').format(num);
  };

  const calculateNetSalary = (gross: number) => {
    if (gross <= 0 || gross > MAX_SALARY) {
      setError(t.invalidInput);
      return;
    }
    setError('');

    const healthInsurance = gross * 0.1;
    const socialInsurance = gross * 0.25;
    const taxableIncome = gross - healthInsurance - socialInsurance;
    const incomeTax = taxableIncome * 0.1;
    const net = gross - healthInsurance - socialInsurance - incomeTax;
    
    setBreakdown({
      healthInsurance,
      socialInsurance,
      incomeTax
    });
    
    setNetSalary(net);
  };

  const chartData = useMemo(() => [
    ["Category", "Amount"],
    [t.netSalary, netSalary],
    [t.healthInsurance, breakdown.healthInsurance],
    [t.socialInsurance, breakdown.socialInsurance],
    [t.incomeTax, breakdown.incomeTax],
  ], [netSalary, breakdown, t]);

  const chartOptions = useMemo(() => ({
    title: t.chartTitle,
    pieHole: 0.4,
    colors: ['#4F46E5', '#EC4899', '#8B5CF6', '#F59E0B'],
    legend: { position: 'bottom' },
    chartArea: { width: '100%', height: '80%' },
  }), [t]);

  const handleCopy = async () => {
    const text = `
${t.grossSalary}: ${formatNumber(grossSalary)} RON
${t.healthInsurance}: ${formatNumber(breakdown.healthInsurance)} RON
${t.socialInsurance}: ${formatNumber(breakdown.socialInsurance)} RON
${t.incomeTax}: ${formatNumber(breakdown.incomeTax)} RON
${t.netSalary}: ${formatNumber(netSalary)} RON
    `;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setGrossSalary(DEFAULT_SALARY);
    setIsYearly(false);
    setError('');
  };

  useEffect(() => {
    const multiplier = isYearly ? 12 : 1;
    calculateNetSalary(grossSalary * multiplier);
  }, [grossSalary, isYearly]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'l') {
        setLanguage(prev => prev === 'ro' ? 'en' : 'ro');
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Calculator className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-800">{t.title}</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                title={t.reset}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLanguage(language === 'ro' ? 'en' : 'ro')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors"
                title="Alt + L"
              >
                <Languages className="w-4 h-4" />
                <span>{language.toUpperCase()}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.grossSalary}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={grossSalary}
                    onChange={(e) => setGrossSalary(Number(e.target.value))}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      error ? 'border-red-300' : 'border-gray-300'
                    }`}
                    min="1"
                    max={MAX_SALARY}
                    step="100"
                  />
                  {error && (
                    <div className="absolute -bottom-6 left-0 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <span className="text-sm font-medium text-gray-700">{t.period}:</span>
                <div className="flex rounded-lg overflow-hidden border border-gray-300">
                  <button
                    onClick={() => setIsYearly(false)}
                    className={`px-4 py-2 text-sm ${
                      !isYearly
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {t.monthly}
                  </button>
                  <button
                    onClick={() => setIsYearly(true)}
                    className={`px-4 py-2 text-sm ${
                      isYearly
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {t.yearly}
                  </button>
                </div>
              </div>

              <div className="bg-indigo-50 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">{t.calculationDetails}</h2>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-white hover:bg-gray-50 text-gray-600 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copied ? t.copied : t.copy}</span>
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-indigo-600" title={t.tooltips.health} />
                      <h3 className="font-medium">{t.healthInsurance}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {formatNumber(grossSalary)} × 10% = {formatNumber(breakdown.healthInsurance)} RON
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-indigo-600" title={t.tooltips.social} />
                      <h3 className="font-medium">{t.socialInsurance}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {formatNumber(grossSalary)} × 25% = {formatNumber(breakdown.socialInsurance)} RON
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-indigo-600" title={t.tooltips.tax} />
                      <h3 className="font-medium">{t.incomeTax}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      ({formatNumber(grossSalary)} - {formatNumber(breakdown.healthInsurance)} - {formatNumber(breakdown.socialInsurance)}) × 10% = {formatNumber(breakdown.incomeTax)} RON
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-indigo-600" />
                      <h3 className="font-medium">{t.netSalary}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {formatNumber(grossSalary)} - {formatNumber(breakdown.healthInsurance)} - {formatNumber(breakdown.socialInsurance)} - {formatNumber(breakdown.incomeTax)} = {formatNumber(netSalary)} RON
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-xl p-6 mb-8 h-[400px]">
                <Chart
                  chartType="PieChart"
                  data={chartData}
                  options={chartOptions}
                  width="100%"
                  height="100%"
                />
              </div>

              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-6 text-white">
                <h2 className="text-xl font-semibold mb-2">{t.finalNetSalary}</h2>
                <div className="text-3xl font-bold">
                  {formatNumber(netSalary)} RON
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;