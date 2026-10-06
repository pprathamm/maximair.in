import React, { useState, useMemo } from 'react';

export const Calculator: React.FC = () => {
  const [ambientTemp, setAmbientTemp] = useState<number>(40); // 40°C
  const [humidity, setHumidity] = useState<number>(25); // 25% RH
  const [padArea, setPadArea] = useState<number>(10); // 10 m²
  const [airVelocity, setAirVelocity] = useState<number>(1.5); // 1.5 m/s

  // Wet-bulb estimation via Stull's formula
  const wetBulb = useMemo(() => {
    const T = ambientTemp;
    const RH = humidity;
    const tw =
      T * Math.atan(0.151977 * Math.pow(RH + 8.313659, 0.5)) +
      Math.atan(T + RH) -
      Math.atan(RH - 1.676331) +
      0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) -
      4.686035;
    return Math.max(10, Math.min(T, Number(tw.toFixed(1))));
  }, [ambientTemp, humidity]);

  // CelPad typical saturation efficiency ~ 90% (0.90)
  const saturationEfficiency = 0.90;
  const deliveredTemp = useMemo(() => {
    const tDelivered = ambientTemp - saturationEfficiency * (ambientTemp - wetBulb);
    return Number(tDelivered.toFixed(1));
  }, [ambientTemp, wetBulb]);

  const deltaT = useMemo(() => {
    return Number((ambientTemp - deliveredTemp).toFixed(1));
  }, [ambientTemp, deliveredTemp]);

  // Water evaporation rate estimate:
  // Evaporation rate approx = Airflow (m³/s) * density (1.15 kg/m³) * delta humidity ratio
  // Standard rule of thumb: ~ 1.2 to 1.8 Liters per hour per m² per °C drop
  const waterRateLitersPerHour = useMemo(() => {
    const ratePerM2 = deltaT * 0.95; // L/h/m²
    return Number((ratePerM2 * padArea).toFixed(1));
  }, [deltaT, padArea]);

  return (
    <section className="w-full py-20 bg-[#f5f3f0] px-6 md:px-12 border-t border-[#eae8e5]" id="calculator">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#006c4f] uppercase">
              Interactive Thermodynamic Tool
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#00231b] tracking-tight mt-1">
              Evaporative Cooling &amp; Water Estimator
            </h2>
            <p className="text-sm text-[#717975] mt-1 max-w-2xl">
              Simulate real-time psychrometric delivery temperatures and required water supply based on local weather conditions.
            </p>
          </div>
          <span className="text-xs font-bold text-[#006c4f] bg-white px-3 py-1.5 rounded-full border border-[#eae8e5] self-start md:self-auto">
            90% CelPad Matrix Efficiency
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 md:p-8 rounded-3xl border border-[#eae8e5] shadow-sm">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-[#717975] mb-2">
                <span>Ambient Dry-Bulb Temperature</span>
                <span className="text-sm font-extrabold text-[#00231b]">{ambientTemp}°C</span>
              </div>
              <input
                type="range"
                min="25"
                max="50"
                step="1"
                value={ambientTemp}
                onChange={(e) => setAmbientTemp(Number(e.target.value))}
                className="w-full h-2 bg-[#eae8e5] rounded-lg appearance-none cursor-pointer accent-[#006c4f]"
              />
              <div className="flex justify-between text-[11px] text-[#717975] mt-1">
                <span>25°C (Mild)</span>
                <span>38°C (Peak Summer)</span>
                <span>50°C (Extreme Desert)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-[#717975] mb-2">
                <span>Ambient Relative Humidity (RH)</span>
                <span className="text-sm font-extrabold text-[#00231b]">{humidity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={humidity}
                onChange={(e) => setHumidity(Number(e.target.value))}
                className="w-full h-2 bg-[#eae8e5] rounded-lg appearance-none cursor-pointer accent-[#006c4f]"
              />
              <div className="flex justify-between text-[11px] text-[#717975] mt-1">
                <span>10% (Arid / High Drop)</span>
                <span>40% (Moderate)</span>
                <span>80% (Monsoon)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#717975] mb-1.5">
                  Pad Wall Area (m²)
                </label>
                <div className="flex items-center border border-[#eae8e5] rounded-xl bg-[#f5f3f0] px-3 py-2">
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={padArea}
                    onChange={(e) => setPadArea(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-transparent text-sm font-bold text-[#00231b] outline-none"
                  />
                  <span className="text-xs font-bold text-[#717975]">m²</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#717975] mb-1.5">
                  Face Air Velocity
                </label>
                <select
                  value={airVelocity}
                  onChange={(e) => setAirVelocity(Number(e.target.value))}
                  className="w-full text-sm font-bold text-[#00231b] border border-[#eae8e5] rounded-xl bg-[#f5f3f0] px-3 py-2 outline-none focus:border-[#006c4f]"
                >
                  <option value={1.2}>1.2 m/s (5090 Flute)</option>
                  <option value={1.5}>1.5 m/s (Standard 7090)</option>
                  <option value={1.8}>1.8 m/s (High Intake)</option>
                  <option value={2.0}>2.0 m/s (Max Boundary)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary Badges */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-[#00231b] text-white space-y-1">
              <span className="text-[11px] font-bold text-[#59fdc5] uppercase tracking-wider">
                Delivered Supply Temp
              </span>
              <div className="text-4xl md:text-5xl font-black text-white tracking-tight">
                {deliveredTemp}°C
              </div>
              <p className="text-xs text-white/70 pt-1 font-medium">
                Down from {ambientTemp}°C at wet-bulb {wetBulb}°C
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#f5f3f0] border border-[#eae8e5] space-y-1">
              <span className="text-[11px] font-bold text-[#006c4f] uppercase tracking-wider">
                Temperature Drop (ΔT)
              </span>
              <div className="text-4xl md:text-5xl font-black text-[#006c4f] tracking-tight">
                -{deltaT}°C
              </div>
              <p className="text-xs text-[#717975] pt-1 font-medium">
                Sensible heat absorbed by water
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#f5f3f0] border border-[#eae8e5] space-y-1">
              <span className="text-[11px] font-bold text-[#717975] uppercase tracking-wider">
                Water Evaporated
              </span>
              <div className="text-3xl md:text-4xl font-black text-[#00231b] tracking-tight">
                {waterRateLitersPerHour} <span className="text-sm font-bold text-[#717975]">L/hr</span>
              </div>
              <p className="text-xs text-[#717975] pt-1 font-medium">
                For {padArea} m² pad wall area
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#f5f3f0] border border-[#eae8e5] space-y-1">
              <span className="text-[11px] font-bold text-[#717975] uppercase tracking-wider">
                Total Airflow Capacity
              </span>
              <div className="text-3xl md:text-4xl font-black text-[#00231b] tracking-tight">
                {Math.round(padArea * airVelocity * 3600).toLocaleString('en-IN')}{' '}
                <span className="text-sm font-bold text-[#717975]">m³/h</span>
              </div>
              <p className="text-xs text-[#717975] pt-1 font-medium">
                At {airVelocity} m/s face velocity
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
