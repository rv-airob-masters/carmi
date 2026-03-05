import Card, { CardBody, CardHeader } from '../components/Card';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="font-semibold text-[var(--color-text)]">{title}</h2>
      </CardHeader>
      <CardBody>
        <div className="text-sm text-[var(--color-text-muted)] space-y-2">{children}</div>
      </CardBody>
    </Card>
  );
}

export default function Help() {
  return (
    <div className="animate-fade-in space-y-4">
      {/* Welcome */}
      <div className="text-center py-4">
        <div className="w-14 h-14 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center mx-auto mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-[var(--color-text)]">How to Use Carmi</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Your complete guide to tracking fuel efficiency</p>
      </div>

      {/* Getting Started */}
      <Section title="🚀 Getting Started">
        <p><strong>1. Create an account</strong> — Sign up with your email and password. Your data is stored securely in the cloud and syncs across devices.</p>
        <p><strong>2. Choose your region</strong> — On your first login, you'll be asked to pick your region (UK, US, or India). This sets your currency, distance unit, and fuel pricing format automatically.</p>
        <p><strong>3. Start logging</strong> — Head to the <strong>Add Entry</strong> page (the default screen) and log your first fuel fill-up.</p>
      </Section>

      {/* Region Settings */}
      <Section title="🌍 Region & Units">
        <p>Your region determines how the app displays everything:</p>
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left py-2 pr-2 font-semibold text-[var(--color-text)]">Region</th>
                <th className="text-left py-2 pr-2 font-semibold text-[var(--color-text)]">Currency</th>
                <th className="text-left py-2 pr-2 font-semibold text-[var(--color-text)]">Distance</th>
                <th className="text-left py-2 font-semibold text-[var(--color-text)]">Fuel Price</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--color-border)]">
                <td className="py-2 pr-2">🇬🇧 UK</td>
                <td className="py-2 pr-2">£ (GBP)</td>
                <td className="py-2 pr-2">Miles</td>
                <td className="py-2">Pence / Litre</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="py-2 pr-2">🇺🇸 US</td>
                <td className="py-2 pr-2">$ (USD)</td>
                <td className="py-2 pr-2">Miles</td>
                <td className="py-2">Dollars / Gallon</td>
              </tr>
              <tr>
                <td className="py-2 pr-2">🇮🇳 India</td>
                <td className="py-2 pr-2">₹ (INR)</td>
                <td className="py-2 pr-2">Kilometers</td>
                <td className="py-2">Rupees / Litre</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2">You can change your region at any time in <strong>Settings</strong>.</p>
        <p><strong>Fuel efficiency</strong> (km/L or MPG) can be toggled independently — regardless of your region.</p>
      </Section>

      {/* Adding an Entry */}
      <Section title="📝 Adding a Fuel Entry">
        <p><strong>Distance</strong> — Enter the distance you drove since the last fill-up. The unit (miles or km) is based on your region. You can toggle between miles and km using the switch.</p>
        <p><strong>Fuel Volume</strong> — Enter the amount of fuel you filled. This is in litres for UK/India or gallons for US.</p>
        <p><strong>Price</strong> — Enter the fuel price as shown at your petrol station. For example: <em>145.9</em> pence/L in the UK, <em>$3.459</em>/gallon in the US, or <em>₹105.50</em>/L in India.</p>
        <p><strong>Date</strong> — Pick the date of the fill-up.</p>
        <p><strong>Receipt Photo</strong> (optional) — Attach a photo of the receipt for your records.</p>
        <p>The app automatically calculates your fuel efficiency (km/L and MPG) and cost efficiency when you save.</p>
      </Section>

      {/* History */}
      <Section title="📋 Viewing History">
        <p>The <strong>History</strong> tab shows all your logged entries as cards, sorted by date (newest first).</p>
        <p>Each card shows distance, fuel volume, price, mileage, and cost efficiency — all in your region's units.</p>
        <p>Tap the <strong>edit</strong> icon on any card to modify it, or the <strong>delete</strong> icon to remove it.</p>
      </Section>

      {/* Dashboard */}
      <Section title="📊 Dashboard & Export">
        <p>The <strong>Dashboard</strong> gives you an overview of your driving habits:</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>Total distance, fuel volume, and spending</li>
          <li>Average, best, and worst fuel efficiency</li>
          <li>A trend chart of your last 10 entries</li>
        </ul>
        <p className="mt-2"><strong>Export</strong> — Download your data as a <strong>CSV</strong> spreadsheet or a printable <strong>PDF</strong> report. Both formats use your region's units and currency.</p>
      </Section>

      {/* Offline & Sync */}
      <Section title="☁️ Offline & Cloud Sync">
        <p>Carmi works <strong>offline</strong>. All data is saved locally on your device using IndexedDB.</p>
        <p>When you're online and logged in, your entries sync to the cloud automatically. This means your data is available on any device you log into.</p>
        <p>If you add entries while offline, they'll sync the next time you connect.</p>
      </Section>

      {/* Settings */}
      <Section title="⚙️ Settings">
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Region</strong> — Switch between UK, US, and India at any time</li>
          <li><strong>Fuel Efficiency</strong> — Toggle between km/L and MPG</li>
          <li><strong>Dark Mode</strong> — Switch between light and dark theme</li>
          <li><strong>Sign Out</strong> — Log out of your account</li>
        </ul>
      </Section>

      {/* Tips */}
      <Section title="💡 Tips">
        <p>• Log every fill-up for the most accurate efficiency tracking.</p>
        <p>• Fill your tank fully each time for consistent mileage calculations.</p>
        <p>• Use the receipt photo feature to keep a record of fuel prices over time.</p>
        <p>• Install the app on your home screen for quick access — it's a PWA!</p>
      </Section>
    </div>
  );
}

