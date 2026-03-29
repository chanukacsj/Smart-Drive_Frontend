import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { 
    Car, Trash2, Loader2, Edit3, X, 
    AlertCircle, Fuel, Image as ImageIcon, ShieldAlert, Zap
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const VehiclePage = () => {
    const [vehicle, setVehicle] = useState({
        brand: '',
        model: '',
        vehicleNumber: '',
        fuelType: 'Petrol'
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [fetching, setFetching] = useState(true);

    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        setFetching(true);
        try {
            const response = await axiosInstance.get('/vehicles');
            setVehicles(response.data);
        } catch (error) {
            toast.error("Cloud Sync Failed: Could not load fleet! 🚨");
        } finally {
            setFetching(false);
        }
    };

    const handleEditClick = (v) => {
        setIsEditMode(true);
        setEditingId(v.id);
        setVehicle({
            brand: v.brand,
            model: v.model,
            vehicleNumber: v.vehicleNumber,
            fuelType: v.fuelType
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setIsEditMode(false);
        setEditingId(null);
        setVehicle({ brand: '', model: '', vehicleNumber: '', fuelType: 'Petrol' });
        setImage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        const vehicleBlob = new Blob([JSON.stringify(vehicle)], { type: 'application/json' });
        formData.append('vehicle', vehicleBlob);
        if (image) { formData.append('file', image); }

        try {
            if (isEditMode) {
                await axiosInstance.put(`/vehicles/${editingId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Vehicle specifications updated! ✨");
            } else {
                await axiosInstance.post('/vehicles/save-with-image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("New vehicle added to fleet! ✅");
            }
            resetForm();
            fetchVehicles();
        } catch (error) {
            toast.error("Action failed. Verify server connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-gray-900 font-bold">
                    <AlertCircle className="text-red-600" size={20} />
                    <span>Decommission Vehicle?</span>
                </div>
                <p className="text-[11px] text-gray-500 font-medium">
                    This action will permanently remove this unit from the registry.
                </p>
                <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => toast.dismiss(t.id)} className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600">Keep</button>
                    <button onClick={() => { toast.dismiss(t.id); executeDelete(id); }} 
                        className="px-5 py-2 text-[10px] font-black bg-red-600 text-white rounded-xl shadow-lg shadow-red-200 hover:bg-red-700 uppercase tracking-widest">
                        Confirm Delete
                    </button>
                </div>
            </div>
        ), { duration: 5000, position: 'top-center' });
    };

    const executeDelete = async (id) => {
        const deleteToast = toast.loading("Wiping record from cloud...");
        try {
            await axiosInstance.delete(`/vehicles/${id}`);
            toast.success("Vehicle record purged successfully.", { id: deleteToast });
            fetchVehicles();
        } catch (error) {
            toast.error("Authorization failed. Could not delete.", { id: deleteToast });
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] p-4 md:p-10 font-sans text-gray-900">
            <Toaster />
            
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Red & Dark Header */}
                <div className="bg-[#1a1a1a] p-8 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center justify-between border-b-8 border-red-600">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">Smart-Drive <span className="text-red-600 text-xl block md:inline md:ml-2 tracking-widest">Fleet Control</span></h1>
                        <div className="flex items-center gap-2 mt-1 justify-center md:justify-start">
                            <Zap className="text-yellow-400 fill-yellow-400" size={12} />
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Auth: Chanuka</p>
                        </div>
                    </div>
                    <div className="hidden md:block bg-red-600/10 p-4 rounded-2xl border border-red-600/20">
                        <ShieldAlert className="text-red-600" size={32} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* Vehicle Registry Form */}
                    <div className="lg:col-span-5">
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200 border border-gray-100 relative overflow-hidden">
                            <h2 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-3 italic underline decoration-red-600 decoration-4 underline-offset-8">
                                {isEditMode ? 'MODIFY UNIT' : 'NEW REGISTRY'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 group">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-tighter ml-1 group-focus-within:text-red-600 transition-colors">Brand</label>
                                        <input type="text" required value={vehicle.brand} onChange={(e) => setVehicle({ ...vehicle, brand: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-red-600 focus:bg-white outline-none transition-all font-bold text-gray-700" placeholder="TOYOTA" />
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-tighter ml-1 group-focus-within:text-red-600 transition-colors">Model</label>
                                        <input type="text" required value={vehicle.model} onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-red-600 focus:bg-white outline-none transition-all font-bold text-gray-700" placeholder="VITZ" />
                                    </div>
                                </div>

                                <div className="space-y-2 group">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-tighter ml-1 group-focus-within:text-red-600 transition-colors">License Plate</label>
                                    <input type="text" required value={vehicle.vehicleNumber} onChange={(e) => setVehicle({ ...vehicle, vehicleNumber: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-red-600 focus:bg-white outline-none transition-all font-black text-red-600 tracking-widest italic" placeholder="WP-CAD-1234" />
                                </div>

                                <div className="space-y-2 group">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-tighter ml-1 group-focus-within:text-red-600 transition-colors">Propulsion Type</label>
                                    <select value={vehicle.fuelType} onChange={(e) => setVehicle({ ...vehicle, fuelType: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-red-600 focus:bg-white outline-none transition-all font-bold text-gray-700 appearance-none">
                                        <option>Petrol</option><option>Diesel</option><option>Hybrid</option><option>Electric</option>
                                    </select>
                                </div>

                                <div className="p-6 bg-red-50/50 rounded-3xl border-2 border-dashed border-red-100">
                                    <label className="text-[11px] font-black text-red-600 uppercase tracking-widest flex items-center gap-2 mb-3">
                                        <ImageIcon size={14} /> Profile Image
                                    </label>
                                    <input type="file" onChange={(e) => setImage(e.target.files[0])}
                                        className="block w-full text-[10px] font-black text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-red-600 file:text-white file:font-black hover:file:bg-red-700 cursor-pointer" />
                                </div>

                                <button type="submit" disabled={loading}
                                    className={`w-full py-5 rounded-[1.5rem] font-black text-white transition-all shadow-xl hover:shadow-red-200 active:scale-95 flex justify-center items-center gap-3 ${
                                        loading ? 'bg-gray-300' : isEditMode ? 'bg-orange-500' : 'bg-red-600 hover:bg-red-700'
                                    }`}>
                                    {loading ? <Loader2 className="animate-spin" size={24} /> : isEditMode ? <Edit3 size={24} /> : <Zap size={24} />}
                                    <span className="tracking-[0.2em]">{loading ? 'UPLOADING...' : isEditMode ? 'COMMIT UPDATE' : 'DEPLOY VEHICLE'}</span>
                                </button>
                                
                                {isEditMode && (
                                    <button onClick={resetForm} className="w-full py-2 text-gray-400 font-black text-[10px] tracking-widest hover:text-red-600 uppercase">Discard Changes</button>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Fleet Inventory Table */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-[3rem] shadow-xl shadow-gray-200 border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                                <h3 className="font-black text-gray-800 text-lg flex items-center gap-3 uppercase tracking-tighter">
                                    <Car size={22} className="text-red-600" /> Fleet Inventory
                                </h3>
                                <div className="text-[10px] font-black text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100 italic">
                                    {vehicles.length} Units Active
                                </div>
                            </div>

                            <div className="overflow-x-auto p-4">
                                {!fetching ? (
                                    <table className="w-full border-separate border-spacing-y-4">
                                        <thead>
                                            <tr className="text-gray-400 text-[9px] font-black uppercase tracking-[0.2em]">
                                                <th className="px-6 pb-2 text-left">Unit Profile</th>
                                                <th className="px-6 pb-2 text-left">Registry No.</th>
                                                <th className="px-6 pb-2 text-right">Control</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-transparent">
                                            {vehicles.map((v) => (
                                                <tr key={v.id} className="group hover:bg-red-50/30 transition-all duration-300 shadow-sm rounded-2xl overflow-hidden">
                                                    <td className="px-6 py-5 bg-gray-50/50 rounded-l-2xl border-y border-l border-gray-100">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-16 w-20 bg-white rounded-xl overflow-hidden border border-gray-200 shadow-inner p-1 group-hover:border-red-200 transition-colors">
                                                                <img src={v.imageUrl || 'https://via.placeholder.com/150'} className="w-full h-full object-cover rounded-lg" alt="v" />
                                                            </div>
                                                            <div>
                                                                <div className="font-black text-gray-800 text-base italic">{v.brand}</div>
                                                                <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{v.model} • {v.fuelType}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 bg-gray-50/50 border-y border-gray-100">
                                                        <span className="font-mono text-xs font-black text-red-600 bg-white px-3 py-2 rounded-lg border border-red-100 shadow-sm tracking-tighter">
                                                            {v.vehicleNumber}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 bg-gray-50/50 rounded-r-2xl border-y border-r border-gray-100 text-right">
                                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                            <button onClick={() => handleEditClick(v)} className="p-3 bg-white text-gray-400 hover:text-orange-500 rounded-xl shadow-sm border border-gray-100 hover:border-orange-100 transition-all"><Edit3 size={18} /></button>
                                                            <button onClick={() => handleDelete(v.id)} className="p-3 bg-white text-gray-400 hover:text-red-600 rounded-xl shadow-sm border border-gray-100 hover:border-red-100 transition-all"><Trash2 size={18} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="py-24 flex flex-col items-center justify-center gap-5">
                                        <Loader2 className="animate-spin text-red-600" size={50} />
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Querying Fleet Records...</p>
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

export default VehiclePage;