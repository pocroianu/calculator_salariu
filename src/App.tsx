import React, { useState, useEffect } from 'react';
import { Calculator, Info, Languages } from 'lucide-react';
import { Chart } from 'react-google-charts';

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
  }
};

function App() {
  const [language, setLanguage] = useState<'ro' | 'en'>('ro');
  const [grossSalary, setGrossSalary] = useState<number>(5800);
  const [netSalary, setNetSalary] = useState<number>(0);
  const [breakdown, setBreakdown] = useState({
    healthInsurance: 0,
    socialInsurance: 0,
    incomeTax: 0
  });

  const t = translations[language];

  const calculateNetSalary = (gross: number) => {
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

  const chartData = [
    ["Category", "Amount"],
    [t.netSalary, netSalary],
    [t.healthInsurance, breakdown.healthInsurance],
    [t.socialInsurance, breakdown.socialInsurance],
    [t.incomeTax, breakdown.incomeTax],
  ];

  const chartOptions = {
    title: t.chartTitle,
    pieHole: 0.4,
    colors: ['#4F46E5', '#EC4899', '#8B5CF6', '#F59E0B'],
    legend: { position: 'bottom' },
    chartArea: { width: '100%', height: '80%' },
  };

  useEffect(() => {
    calculateNetSalary(grossSalary);
  }, [grossSalary]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Calculator className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-800">{t.title}</h1>
            </div>
            <button
              onClick={() => setLanguage(language === 'ro' ? 'en' : 'ro')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors"
            >
              <Languages className="w-4 h-4" />
              <span>{language.toUpperCase()}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.grossSalary}
                </label>
                <input
                  type="number"
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="0"
                  step="100"
                />
              </div>

              <div className="bg-indigo-50 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.calculationDetails}</h2>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-indigo-600" />
                      <h3 className="font-medium">{t.healthInsurance}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {grossSalary.toFixed(2)} × 10% = {breakdown.healthInsurance.toFixed(2)} RON
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-indigo-600" />
                      <h3 className="font-medium">{t.socialInsurance}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {grossSalary.toFixed(2)} × 25% = {breakdown.socialInsurance.toFixed(2)} RON
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-indigo-600" />
                      <h3 className="font-medium">{t.incomeTax}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      ({grossSalary.toFixed(2)} - {breakdown.healthInsurance.toFixed(2)} - {breakdown.socialInsurance.toFixed(2)}) × 10% = {breakdown.incomeTax.toFixed(2)} RON
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-indigo-600" />
                      <h3 className="font-medium">{t.netSalary}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {grossSalary.toFixed(2)} - {breakdown.healthInsurance.toFixed(2)} - {breakdown.socialInsurance.toFixed(2)} - {breakdown.incomeTax.toFixed(2)} = {netSalary.toFixed(2)} RON
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
                  {netSalary.toFixed(2)} RON
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