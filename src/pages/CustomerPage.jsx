import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { 
    UserPlus, Edit3, Trash2, Loader2, X, MapPin, 
    Phone, Mail, User, CreditCard, AlertCircle, Users, ShieldAlert
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const CustomerPage = () => {
    const [customers, setCustomers] = useState([]);
    const [customer, setCustomer] = useState({ name: '', email: '', nic: '', contactNumber: '', address: '' });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const CUSTOMER_PATH = "/customers";

    useEffect(() => {
       fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setFetching(true);
        try {
            const response = await axiosInstance.get(CUSTOMER_PATH);
            setCustomers(response.data);
        } catch (error) {
            toast.error("Error: Could not sync with database! 🚨");
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditMode) {
                await axiosInstance.put(`${CUSTOMER_PATH}/${editingId}`, customer);
                toast.success("Client record updated successfully! ✅");
            } else {
                await axiosInstance.post(CUSTOMER_PATH, customer);
                toast.success("New client registered successfully! 🚀");
            }
            resetForm();
            fetchCustomers();
        } catch (error) {
            toast.error("Operation failed. Please check server status!");
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (c) => {
        setIsEditMode(true);
        setEditingId(c.id);
        setCustomer({ name: c.name, email: c.email, nic: c.nic, contactNumber: c.contactNumber, address: c.address });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        toast((t) => (
            <div className="p-2">
                <p className="font-bold text-gray-900 mb-2 text-sm">Are you sure you want to delete this?</p>
                <div className="flex gap-2">
                    <button onClick={() => { toast.dismiss(t.id); executeDelete(id); }} className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md hover:bg-red-700">Delete Now</button>
                    <button onClick={() => toast.dismiss(t.id)} className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg text-xs font-bold">Cancel</button>
                </div>
            </div>
        ), { position: 'top-center', duration: 4000 });
    };

    const executeDelete = async (id) => {
        const delToast = toast.loading("Processing request...");
        try {
            await axiosInstance.delete(`${CUSTOMER_PATH}/${id}`);
            toast.success("Record permanently removed.", { id: delToast });
            fetchCustomers();
        } catch (error) {
            toast.error("Delete operation failed.", { id: delToast });
        }
    };

    const resetForm = () => {
        setCustomer({ name: '', email: '', nic: '', contactNumber: '', address: '' });
        setIsEditMode(false);
        setEditingId(null);
    };

    return (
        <div className="min-h-screen bg-[#fafafa] p-4 md:p-10 font-sans text-gray-900">
            <Toaster />
            
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Modern Red Header */}
                <div className="bg-[#1a1a1a] p-8 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center justify-between border-b-8 border-red-600">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-black text-white tracking-tighter italic">SMART-DRIVE <span className="text-red-600">ADMIN</span></h1>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Active Session: Chanuka</p>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0 bg-red-600/10 p-4 rounded-2xl border border-red-600/20">
                        <ShieldAlert className="text-red-600" size={32} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* Input Form Section */}
                    <div className="lg:col-span-5">
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200 border border-gray-100 relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full ${isEditMode ? 'bg-orange-500' : 'bg-red-600'} opacity-10`}></div>
                            
                            <h2 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-3">
                                {isEditMode ? <Edit3 className="text-orange-500" /> : <UserPlus className="text-red-600" />}
                                {isEditMode ? 'Edit Profile' : 'New Client'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2 group">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-tighter ml-1 group-focus-within:text-red-600 transition-colors">Legal Full Name</label>
                                    <input type="text" required value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-red-600 focus:bg-white outline-none transition-all font-bold text-gray-700" placeholder="Chanuka" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-tighter ml-1">Email ID</label>
                                        <input type="email" required value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-red-600 focus:bg-white outline-none transition-all font-bold text-gray-700" placeholder="chanuka@mail.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-tighter ml-1">National ID</label>
                                        <input type="text" required value={customer.nic} onChange={(e) => setCustomer({ ...customer, nic: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-red-600 focus:bg-white outline-none transition-all font-bold text-gray-700" placeholder="20001234..." />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-tighter ml-1">Phone Contact</label>
                                    <input type="text" required value={customer.contactNumber} onChange={(e) => setCustomer({ ...customer, contactNumber: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-red-600 focus:bg-white outline-none transition-all font-bold text-gray-700" placeholder="+94 77..." />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-tighter ml-1">Home Address</label>
                                    <textarea value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-red-600 focus:bg-white outline-none transition-all font-bold text-gray-700" placeholder="Street, City..." rows="2" />
                                </div>

                                <button type="submit" disabled={loading}
                                    className={`w-full py-5 rounded-[1.5rem] font-black text-white transition-all shadow-xl hover:shadow-red-200 active:scale-95 flex justify-center items-center gap-3 ${
                                        loading ? 'bg-gray-300' : isEditMode ? 'bg-orange-500' : 'bg-red-600 hover:bg-red-700'
                                    }`}>
                                    {loading ? <Loader2 className="animate-spin" size={24} /> : isEditMode ? <Edit3 size={24} /> : <UserPlus size={24} />}
                                    <span className="tracking-widest">{loading ? 'PROCESSING...' : isEditMode ? 'UPDATE RECORD' : 'REGISTER CLIENT'}</span>
                                </button>
                                
                                {isEditMode && (
                                    <button onClick={resetForm} className="w-full py-2 text-gray-400 font-black text-[10px] tracking-widest hover:text-red-600 transition-colors uppercase">Discard Changes</button>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Table / List Section */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-[3rem] shadow-xl shadow-gray-200 border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                                <h3 className="font-black text-gray-800 text-lg flex items-center gap-3 uppercase tracking-tighter">
                                    <Users size={22} className="text-red-600" /> Database Registry
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-red-600"></span>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{customers.length} Entries</span>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                {!fetching ? (
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-white text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] border-b">
                                                <th className="px-8 py-6 text-left">Customer Profile</th>
                                                <th className="px-8 py-6 text-left">NIC</th>
                                                <th className="px-8 py-6 text-right">Control</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {customers.map((c) => (
                                                <tr key={c.id} className="group hover:bg-red-50/30 transition-all duration-300">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-12 w-12 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-gray-400 group-hover:bg-red-600 group-hover:text-white transition-all">
                                                                {c.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="font-black text-gray-800 text-base group-hover:text-red-600 transition-colors">{c.name}</div>
                                                                <div className="text-xs text-gray-400 font-bold">{c.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="font-mono text-xs font-black text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                                                            {c.nic}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                                            <button onClick={() => handleEditClick(c)} className="p-3 bg-white text-gray-400 hover:text-orange-500 rounded-xl shadow-sm border border-gray-100 hover:border-orange-100 transition-all"><Edit3 size={18} /></button>
                                                            <button onClick={() => handleDelete(c.id)} className="p-3 bg-white text-gray-400 hover:text-red-600 rounded-xl shadow-sm border border-gray-100 hover:border-red-100 transition-all"><Trash2 size={18} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="py-24 flex flex-col items-center justify-center gap-5">
                                        <Loader2 className="animate-spin text-red-600" size={50} />
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Accessing Chanuka's Cloud...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CustomerPage;