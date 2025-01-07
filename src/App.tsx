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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div className="flex items-center gap-3">
              <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{t.title}</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                title={t.reset}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLanguage(language === 'ro' ? 'en' : 'ro')}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors"
                title="Alt + L"
              >
                <Languages className="w-4 h-4" />
                <span>{language.toUpperCase()}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Input Section */}
            <div className="order-1">
              <div className="bg-white rounded-xl p-4 sm:p-5">
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.grossSalary}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={grossSalary}
                      onChange={(e) => setGrossSalary(Number(e.target.value))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base lg:text-lg ${
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

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">{t.period}:</span>
                  <div className="flex rounded-lg overflow-hidden border border-gray-300 w-full sm:w-auto">
                    <button
                      onClick={() => setIsYearly(false)}
                      className={`flex-1 sm:flex-none px-6 py-2 text-sm font-medium ${
                        !isYearly
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {t.monthly}
                    </button>
                    <button
                      onClick={() => setIsYearly(true)}
                      className={`flex-1 sm:flex-none px-6 py-2 text-sm font-medium ${
                        isYearly
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {t.yearly}
                    </button>
                  </div>
                </div>
              </div>

              {/* Net Salary Result - Desktop */}
              <div className="hidden lg:block mt-6">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-5 text-white">
                  <h2 className="text-lg font-semibold mb-1">{t.finalNetSalary}</h2>
                  <div className="text-3xl font-bold break-words">
                    {formatNumber(netSalary)} RON
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="order-2">
              <div className="bg-white rounded-xl p-4 sm:p-5 h-[250px] lg:h-[360px]">
                <Chart
                  chartType="PieChart"
                  data={chartData}
                  options={{
                    ...chartOptions,
                    chartArea: { width: '100%', height: '85%' },
                  }}
                  width="100%"
                  height="100%"
                />
              </div>
            </div>

            {/* Net Salary Result - Mobile */}
            <div className="order-3 lg:hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-5 text-white">
                <h2 className="text-lg font-semibold mb-1">{t.finalNetSalary}</h2>
                <div className="text-3xl font-bold break-words">
                  {formatNumber(netSalary)} RON
                </div>
              </div>
            </div>

            {/* Calculation Details */}
            <div className="order-4 lg:col-span-2">
              <div className="bg-indigo-50 rounded-xl p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                  <h2 className="text-lg font-semibold text-gray-800">{t.calculationDetails}</h2>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-white hover:bg-gray-50 text-gray-600 transition-colors w-full sm:w-auto justify-center sm:justify-start"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copied ? t.copied : t.copy}</span>
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-indigo-600" title={t.tooltips.health} />
                      <h3 className="font-medium">{t.healthInsurance}</h3>
                    </div>
                    <p className="text-sm text-gray-600 break-words">
                      {formatNumber(grossSalary)} × 10% = {formatNumber(breakdown.healthInsurance)} RON
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-indigo-600" title={t.tooltips.social} />
                      <h3 className="font-medium">{t.socialInsurance}</h3>
                    </div>
                    <p className="text-sm text-gray-600 break-words">
                      {formatNumber(grossSalary)} × 25% = {formatNumber(breakdown.socialInsurance)} RON
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-indigo-600" title={t.tooltips.tax} />
                      <h3 className="font-medium">{t.incomeTax}</h3>
                    </div>
                    <p className="text-sm text-gray-600 break-words">
                      ({formatNumber(grossSalary)} - {formatNumber(breakdown.healthInsurance)} - {formatNumber(breakdown.socialInsurance)}) × 10% = {formatNumber(breakdown.incomeTax)} RON
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-indigo-600" />
                      <h3 className="font-medium">{t.netSalary}</h3>
                    </div>
                    <p className="text-sm text-gray-600 break-words">
                      {formatNumber(grossSalary)} - {formatNumber(breakdown.healthInsurance)} - {formatNumber(breakdown.socialInsurance)} - {formatNumber(breakdown.incomeTax)} = {formatNumber(netSalary)} RON
                    </p>
                  </div>
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