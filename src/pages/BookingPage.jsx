import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { 
    Calendar, Users, Car, CreditCard, Trash2, 
    Loader2, CheckCircle, AlertCircle, Zap, ShieldCheck
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const BookingPage = () => {
    const [bookings, setBookings] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [availableVehicles, setAvailableVehicles] = useState([]); 
    
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [fetchingVehicles, setFetchingVehicles] = useState(false);

    const [formData, setFormData] = useState({
        bookingDate: '',
        customerId: '',
        vehicleId: '',
        amount: ''
    });

    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (formData.bookingDate) {
            fetchAvailableVehicles(formData.bookingDate);
        } else {
            setAvailableVehicles([]);
        }
    }, [formData.bookingDate]);

    const loadInitialData = async () => {
        setFetching(true);
        try {
            const [bRes, cRes] = await Promise.all([
                axiosInstance.get('/bookings'),
                axiosInstance.get('/customers')
            ]);
            setBookings(bRes.data);
            setCustomers(cRes.data);
        } catch (err) {
            toast.error("System Sync Error! 🚨");
        } finally {
            setFetching(false);
        }
    };

    const fetchAvailableVehicles = async (date) => {
        setFetchingVehicles(true);
        try {
            const res = await axiosInstance.get('/vehicles/available', { params: { date } });
            setAvailableVehicles(res.data);
            if(res.data.length === 0) toast.error("Sold Out: No units available!");
        } catch (err) {
            setAvailableVehicles([]);
        } finally {
            setFetchingVehicles(false);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosInstance.post('/bookings', formData);
            toast.success("Reservation Secured! 🏁");
            setFormData({ bookingDate: '', customerId: '', vehicleId: '', amount: '' });
            loadInitialData(); 
        } catch (err) {
            toast.error("Process failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const deleteBooking = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-gray-900 font-bold">
                    <AlertCircle className="text-red-600" size={20} />
                    <span>Void Reservation?</span>
                </div>
                <p className="text-[11px] text-gray-500">This slot will be returned to the open inventory.</p>
                <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => toast.dismiss(t.id)} className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase">Keep</button>
                    <button onClick={() => { toast.dismiss(t.id); executeDelete(id); }} 
                        className="px-5 py-2 text-[10px] font-black bg-red-600 text-white rounded-xl shadow-lg hover:bg-red-700 uppercase">
                        Confirm Void
                    </button>
                </div>
            </div>
        ));
    };

    const executeDelete = async (id) => {
        const tId = toast.loading("Updating records...");
        try {
            await axiosInstance.delete(`/bookings/${id}`);
            toast.success("Reservation Voided!", { id: tId });
            loadInitialData();
        } catch (err) {
            toast.error("Failed to void.", { id: tId });
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] p-4 md:p-10 text-gray-900">
            <Toaster />

            <div className="max-w-7xl mx-auto space-y-10">
                
                {/* Unified Header */}
                <div className="bg-[#1a1a1a] p-8 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center justify-between border-b-8 border-red-600">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">Smart-Drive <span className="text-red-600 text-xl block md:inline md:ml-2 tracking-widest">Reservation Deck</span></h1>
                        <div className="flex items-center gap-2 mt-1 justify-center md:justify-start">
                            <Zap className="text-yellow-400 fill-yellow-400" size={12} />
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Auth: Chanuka</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10">
                        <div className="text-right">
                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Status</p>
                            <p className="text-green-500 text-xs font-black italic">SYSTEM ONLINE</p>
                        </div>
                        <ShieldCheck className="text-red-600" size={32} />
                    </div>
                </div>

                {/* Main Form Section */}
                <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                         <div className="text-6xl font-black text-gray-50 opacity-[0.03] select-none uppercase tracking-tighter">Booking</div>
                    </div>
                    
                    <h2 className="text-2xl font-black text-gray-800 mb-10 flex items-center gap-3 italic underline decoration-red-600 decoration-4 underline-offset-8 uppercase">
                        Reserve a Vehicle
                    </h2>

                    <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* 1. Date */}
                        <div className="space-y-2 group">
                            <label className="flex items-center text-[11px] font-black text-gray-400 uppercase tracking-widest group-focus-within:text-red-600 transition-colors">
                                <Calendar size={14} className="mr-2" /> Schedule Date
                            </label>
                            <input type="date" min={today} value={formData.bookingDate}
                                onChange={(e) => setFormData({...formData, bookingDate: e.target.value})}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-red-600 focus:bg-white outline-none transition-all font-bold text-gray-700 shadow-inner" required />
                        </div>

                        {/* 2. Customer */}
                        <div className="space-y-2 group">
                            <label className="flex items-center text-[11px] font-black text-gray-400 uppercase tracking-widest group-focus-within:text-red-600 transition-colors">
                                <Users size={14} className="mr-2" /> Select Customer
                            </label>
                            <select value={formData.customerId} onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-red-600 focus:bg-white outline-none transition-all font-bold text-gray-700 appearance-none shadow-inner" required>
                                <option value="">-- Active Clients --</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        {/* 3. Vehicle */}
                        <div className="space-y-2 group">
                            <label className="flex items-center text-[11px] font-black text-gray-400 uppercase tracking-widest group-focus-within:text-red-600 transition-colors">
                                <Car size={14} className="mr-2" /> Available Units
                            </label>
                            <select value={formData.vehicleId} onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}
                                disabled={!formData.bookingDate || fetchingVehicles}
                                className={`w-full px-6 py-4 border-2 rounded-2xl outline-none transition-all font-bold appearance-none shadow-inner ${
                                    !formData.bookingDate ? 'bg-gray-200 border-transparent text-gray-400' : 'bg-gray-50 border-gray-50 focus:border-red-600 focus:bg-white text-gray-700'
                                }`} required>
                                <option value="">
                                    {fetchingVehicles ? "SCANNING..." : !formData.bookingDate ? "WAITING FOR DATE" : "-- SELECT UNIT --"}
                                </option>
                                {availableVehicles.map(v => (
                                    <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.vehicleNumber})</option>
                                ))}
                            </select>
                        </div>

                        {/* 4. Amount */}
                        <div className="space-y-2 group">
                            <label className="flex items-center text-[11px] font-black text-gray-400 uppercase tracking-widest group-focus-within:text-red-600 transition-colors">
                                <CreditCard size={14} className="mr-2" /> Rental Fee (LKR)
                            </label>
                            <input type="number" placeholder="00.00" value={formData.amount}
                                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-red-600 focus:bg-white outline-none transition-all font-black text-red-600 shadow-inner italic" required />
                        </div>

                        <div className="md:col-span-2 lg:col-span-4 pt-4">
                            <button type="submit" disabled={loading || !formData.vehicleId}
                                className={`w-full py-5 rounded-[1.8rem] font-black text-white shadow-2xl transition-all flex items-center justify-center space-x-4 text-sm tracking-[0.3em] active:scale-[0.98] ${
                                    loading || !formData.vehicleId ? 'bg-gray-300' : 'bg-red-600 hover:bg-red-700 shadow-red-200'
                                }`}>
                                {loading ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle size={24} />}
                                <span>{loading ? "INITIALIZING..." : "SECURE RESERVATION"}</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Table Section */}
                <div className="bg-[#1a1a1a] rounded-[3.5rem] shadow-2xl border border-gray-800 overflow-hidden">
                    <div className="p-10 border-b border-gray-800 flex justify-between items-center bg-gradient-to-r from-[#1a1a1a] to-[#222]">
                        <div>
                            <h3 className="font-black text-white text-xl tracking-tighter italic uppercase">Registry Log</h3>
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Live Transaction Stream</p>
                        </div>
                        <div className="h-10 w-10 rounded-2xl bg-red-600/10 border border-red-600/20 flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-red-600 animate-ping"></div>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto p-6">
                        {!fetching ? (
                            <table className="w-full border-separate border-spacing-y-3">
                                <thead>
                                    <tr className="text-gray-500 text-[9px] font-black uppercase tracking-[0.3em]">
                                        <th className="px-8 pb-4 text-left">Ref. ID</th>
                                        <th className="px-8 pb-4 text-left">Unit Detail</th>
                                        <th className="px-8 pb-4 text-left">Client</th>
                                        <th className="px-8 pb-4 text-left">Timeline</th>
                                        <th className="px-8 pb-4 text-right">Fee</th>
                                        <th className="px-8 pb-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((b) => (
                                        <tr key={b.id} className="bg-[#222] hover:bg-[#282828] transition-all group rounded-2xl">
                                            <td className="px-8 py-5 rounded-l-2xl border-y border-l border-white/5 font-mono text-[10px] text-gray-600">#{b.id}</td>
                                            <td className="px-8 py-5 border-y border-white/5 font-black text-red-600 text-xs italic tracking-tighter">
                                                {b.vehicle?.vehicleNumber || "N/A"}
                                            </td>
                                            <td className="px-8 py-5 border-y border-white/5 font-bold text-gray-300 text-sm">{b.customer?.name || "N/A"}</td>
                                            <td className="px-8 py-5 border-y border-white/5">
                                                <div className="bg-white/5 px-3 py-1 rounded-lg border border-white/10 inline-block text-[10px] font-black text-gray-400">
                                                    {b.bookingDate}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 border-y border-white/5 text-right font-black text-white text-sm tracking-tighter">
                                                LKR {Number(b.amount).toLocaleString()}
                                            </td>
                                            <td className="px-8 py-5 rounded-r-2xl border-y border-r border-white/5 text-center">
                                                <button onClick={() => deleteBooking(b.id)} 
                                                    className="p-3 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="py-24 flex flex-col items-center gap-5">
                                <Loader2 className="animate-spin text-red-600" size={50} />
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Querying Database...</p>
                            </div>
                        )}
                        {bookings.length === 0 && !fetching && (
                            <div className="py-20 text-center font-black text-gray-700 uppercase tracking-widest text-xs">No active reservations found.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;