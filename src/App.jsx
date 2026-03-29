import { useState, useEffect } from 'react'
import axiosInstance from './api/axiosInstance'
import { 
    Car, Users, Calendar, LayoutDashboard, Loader2, 
    ArrowRight, Zap, ShieldCheck, LogOut, ChevronRight, TrendingUp 
} from 'lucide-react'
import VehiclePage from './pages/VehiclePage'
import CustomerPage from './pages/CustomerPage'
import BookingPage from './pages/BookingPage'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [recentBookings, setRecentBookings] = useState([]) 
  const [stats, setStats] = useState({ vehicles: 0, bookings: 0, customers: 0 })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardData()
    }
  }, [activeTab])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [vRes, bRes, cRes] = await Promise.all([
        axiosInstance.get('/vehicles'),
        axiosInstance.get('/bookings'),
        axiosInstance.get('/customers')
      ])
      
      setStats({
        vehicles: vRes.data.length,
        bookings: bRes.data.length,
        customers: cRes.data.length
      })

      const sortedBookings = [...bRes.data].reverse().slice(0, 5)
      setRecentBookings(sortedBookings)

    } catch (err) {
      console.error("Dashboard Sync Error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-gray-200 font-sans selection:bg-red-600 selection:text-white">
      
      {/* --- PREMIUM DARK SIDEBAR --- */}
      <aside className="w-72 bg-[#141414] flex flex-col z-20 border-r border-red-900/20 shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
        <div className="p-8 mb-4">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-gradient-to-br from-red-500 to-red-800 p-2.5 rounded-xl group-hover:rotate-12 transition-all duration-500 shadow-[0_0_25px_rgba(220,38,38,0.4)]">
                <Zap size={24} className="fill-white text-white" />
            </div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-white">
                SmartDrive <span className="text-red-600 block text-[10px] not-italic tracking-[0.4em] font-black mt-1 opacity-90">Elite Admin</span>
            </h1>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-3">
          {[
            { id: 'dashboard', label: 'Control Center', icon: LayoutDashboard },
            { id: 'vehicles', label: 'Fleet Manager', icon: Car },
            { id: 'customers', label: 'Client Base', icon: Users },
            { id: 'bookings', label: 'Reservations', icon: Calendar },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between w-full p-4 rounded-2xl transition-all duration-500 group ${
                activeTab === item.id 
                ? 'bg-red-600 text-white shadow-[0_15px_30px_rgba(220,38,38,0.25)] scale-[1.02]' 
                : 'text-gray-500 hover:bg-red-600/10 hover:text-red-500'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon size={20} className={activeTab === item.id ? "animate-pulse" : "opacity-50 group-hover:opacity-100"} />
                <span className="text-[13px] font-black uppercase tracking-wider">{item.label}</span>
              </div>
              {activeTab === item.id && <ChevronRight size={14} className="animate-bounce-x" />}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
            <button className="flex items-center gap-3 text-gray-600 hover:text-red-500 transition-all p-4 w-full font-black text-[11px] uppercase tracking-[0.2em] border-t border-white/5">
                <LogOut size={16} /> Logout Session
            </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12 relative bg-[radial-gradient(circle_at_top_right,_#1a1a1a_0%,_#0f0f0f_100%)]">
        
        {/* Top Header */}
        <header className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
          <div>
            <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] mb-2">Management Portal</p>
            <h1 className="text-4xl font-black text-white capitalize tracking-tighter italic">
              {activeTab} <span className="text-red-900/50">/</span> Overview
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="hidden md:flex flex-col items-end">
                <p className="text-xs font-black text-white uppercase tracking-widest leading-none">Chanuka Admin</p>
                <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                    <p className="text-[9px] text-red-500/70 font-bold uppercase tracking-tighter">System Online</p>
                </div>
             </div>
             <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-900 border-2 border-white/10 shadow-2xl rounded-2xl flex items-center justify-center text-white font-black text-xl italic relative">
                C
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#0f0f0f] rounded-full"></div>
             </div>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          {activeTab === 'dashboard' ? (
            <div className="space-y-10">
              
              {/* Stat Cards - Red Glassmorphism */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: 'Fleet Inventory', value: stats.vehicles, icon: Car },
                  { label: 'System Bookings', value: stats.bookings, icon: Calendar, highlight: true },
                  { label: 'Active Clients', value: stats.customers, icon: Users },
                ].map((card, i) => (
                  <div key={i} className={`p-10 rounded-[2.5rem] border transition-all duration-500 group hover:-translate-y-2 ${
                    card.highlight 
                    ? 'bg-red-600 border-red-500 shadow-[0_20px_40px_rgba(220,38,38,0.2)]' 
                    : 'bg-[#1a1a1a] border-white/5 shadow-2xl'
                  }`}>
                    <div className="flex justify-between items-start mb-6">
                        <div className={`p-4 rounded-2xl transition-colors duration-500 ${
                            card.highlight ? 'bg-white/20 text-white' : 'bg-red-600/10 text-red-500 group-hover:bg-red-600 group-hover:text-white'
                        }`}>
                            <card.icon size={28} />
                        </div>
                        <div className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter ${
                            card.highlight ? 'bg-white/20 text-white' : 'bg-red-500/10 text-red-500'
                        }`}>+ LIVE DATA</div>
                    </div>
                    <h3 className={`text-[11px] font-black uppercase tracking-[0.2em] ${card.highlight ? 'text-red-100' : 'text-gray-500'}`}>
                        {card.label}
                    </h3>
                    <p className={`text-5xl font-black mt-2 tracking-tighter italic ${card.highlight ? 'text-white' : 'text-white'}`}>
                        {loading ? '...' : card.value.toString().padStart(2, '0')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Activity Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Recent Activity Table */}
                <div className="lg:col-span-2 bg-[#141414] rounded-[3rem] p-10 shadow-2xl border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none text-red-600">
                        <TrendingUp size={150} />
                    </div>
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h2 className="text-xl font-black text-white tracking-tight italic uppercase">
                            Recent <span className="text-red-600">Activity</span>
                        </h2>
                        <button onClick={() => setActiveTab('bookings')} className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                            Check Registry <ArrowRight size={14} />
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left border-separate border-spacing-y-3">
                            <thead>
                                <tr className="text-[9px] uppercase tracking-[0.3em] text-gray-600 font-black">
                                    <th className="px-4 pb-2">Client Identity</th>
                                    <th className="px-4 pb-2">Fleet Unit</th>
                                    <th className="px-4 pb-2">Transaction Date</th>
                                    <th className="px-4 pb-2 text-right">Fee</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBookings.map((b) => (
                                    <tr key={b.id} className="group hover:bg-white/[0.02] transition-all">
                                        <td className="p-5 rounded-l-2xl font-bold text-gray-300 text-sm bg-white/5 border-y border-l border-white/5 group-hover:border-red-600/30 transition-colors">
                                            {b.customer?.name || 'N/A'}
                                        </td>
                                        <td className="p-5 bg-white/5 border-y border-white/5">
                                            <span className="text-[10px] font-black text-red-500 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 uppercase">
                                                {b.vehicle?.vehicleNumber || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="p-5 bg-white/5 border-y border-white/5 text-[11px] font-black text-gray-500 uppercase tracking-tighter">
                                            {b.bookingDate}
                                        </td>
                                        <td className="p-5 rounded-r-2xl bg-white/5 border-y border-r border-white/5 text-right font-black text-white text-sm group-hover:text-red-500 transition-colors">
                                            LKR {Number(b.amount).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Performance Side Panel */}
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-red-600/20 rounded-[3rem] p-10 text-white shadow-2xl flex flex-col justify-between group relative overflow-hidden">
                    <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-20 group-hover:scale-125 transition-all duration-700 text-red-600">
                        <ShieldCheck size={250} />
                    </div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(220,38,38,0.4)]">
                            <Zap size={28} className="fill-white text-white" />
                        </div>
                        <h2 className="text-3xl font-black italic uppercase leading-tight tracking-tighter">
                            Scale Your <span className="text-red-600">Fleet</span>
                        </h2>
                        <p className="text-gray-500 mt-4 text-[11px] font-bold leading-relaxed uppercase tracking-widest">
                            Add luxury units to maximize revenue and satisfaction.
                        </p>
                    </div>
                    <button 
                        onClick={() => setActiveTab('vehicles')}
                        className="bg-red-600 text-white px-8 py-5 rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.2em] hover:bg-red-700 transition-all shadow-[0_10px_30px_rgba(220,38,38,0.3)] active:scale-95 mt-8 z-10"
                    >
                        Access Fleet Manager
                    </button>
                </div>
              </div>
            </div>
          ) : activeTab === 'vehicles' ? (
            <VehiclePage />
          ) : activeTab === 'customers' ? (
            <CustomerPage />
          ) : activeTab === 'bookings' ? (
            <BookingPage />
          ) : null}
        </div>
      </main>
    </div>
  )
}

export default App