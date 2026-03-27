// pages/dashboard/CreateTeam.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Loader2, MapPin, ArrowLeft, Globe } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { MapContainer, TileLayer, Marker, useMapEvents, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useCreateTeam } from "@/hooks/team/useTeam";
import { teamSchema } from "@/schemas/teamSchema";

// Fix Leaflet marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export default function CreateTeamPage({ user, onLogout }) {
  const navigate = useNavigate();
  const { mutate: createTeam, isPending: submitting } = useCreateTeam();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      team_name: "",
      base_latitude: 27.7172, // Kathmandu fallback
      base_longitude: 85.3240,
      coverage_radius_km: 5,
    },
  });

  const lat = watch("base_latitude");
  const lng = watch("base_longitude");
  const radius = watch("coverage_radius_km");

  const setCoordinates = (latlng) => {
    setValue("base_latitude", parseFloat(latlng.lat.toFixed(6)));
    setValue("base_longitude", parseFloat(latlng.lng.toFixed(6)));
  };

  const onSubmit = (data) => {
    createTeam(data, {
      onSuccess: (result) => {
        toast.success(result.message || "New team successfully established.");
        setTimeout(() => navigate("/dashboard/teams"), 1500);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to create team.");
      },
    });
  };

  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="p-8 max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
        
        {/* <div className="flex items-center justify-between">
          <Link 
            to="/dashboard/teams" 
            className="group flex items-center gap-2 text-gray-400 hover:text-blue-600 font-extrabold text-[10px] uppercase tracking-[0.2em] transition-all"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Return to HQ
          </Link>
        </div> */}

        <div className="space-y-4">
          {/* <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-blue-100 mb-2">
            <Globe className="w-8 h-8 text-white animate-pulse-slow" />
          </div> */}
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Create Response Team
          </h1>
          <p className="text-lg text-gray-500 font-medium leading-relaxed">
            Create new response team with a specific location and operational coverage area.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/40 border border-gray-100/50 p-12 space-y-10"
        >
          <div className="space-y-8">
            {/* Team Name */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-gray-300 uppercase tracking-widest block pl-1">
                Unit Identification Name
              </label>
              <input
                {...register("team_name")}
                className={`w-full px-8 py-5 bg-gray-50 border-none rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-xl font-bold text-gray-900 placeholder:text-gray-200 ${errors.team_name ? 'ring-2 ring-red-500/20' : ''}`}
                placeholder="e.g. Kathmandu North Emergency"
              />
              {errors.team_name && <p className="text-red-500 text-xs font-bold pl-2">{errors.team_name.message}</p>}
            </div>

            {/* Map Picker */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-gray-300 uppercase tracking-widest block pl-1">
                Select Base Location on Map
              </label>
              <div className="w-full h-[400px] rounded-3xl overflow-hidden border-4 border-gray-50 shadow-inner relative z-0">
                <MapContainer 
                  center={[lat, lng]} 
                  zoom={13} 
                  scrollWheelZoom={true} 
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker position={{lat, lng}} setPosition={setCoordinates} />
                  {radius && (
                    <Circle 
                      center={[lat, lng]} 
                      radius={radius * 1000} 
                      pathOptions={{ color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.1 }} 
                    />
                  )}
                </MapContainer>
              </div>
              <p className="text-[10px] text-gray-400 font-medium pl-2 italic">Click anywhere on the map to relocate the team base.</p>
            </div>

            {/* Coordinates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-300 uppercase tracking-widest block pl-1">
                  Base Latitude
                </label>
                <div className="relative">
                  <MapPin className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    {...register("base_latitude", { valueAsNumber: true })}
                    type="number"
                    step="any"
                    className="w-full px-8 py-5 bg-gray-50 border-none rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-xl font-bold text-gray-900"
                  />
                </div>
                {errors.base_latitude && <p className="text-red-500 text-xs font-bold pl-2">Invalid latitude</p>}
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-300 uppercase tracking-widest block pl-1">
                  Base Longitude
                </label>
                 <div className="relative">
                  <MapPin className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    {...register("base_longitude", { valueAsNumber: true })}
                    type="number"
                    step="any"
                    className="w-full px-8 py-5 bg-gray-50 border-none rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-xl font-bold text-gray-900"
                  />
                </div>
                {errors.base_longitude && <p className="text-red-500 text-xs font-bold pl-2">Invalid longitude</p>}
              </div>
            </div>

            {/* Radius */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-gray-300 uppercase tracking-widest block pl-1">
                Operational Radius (Kilometers)
              </label>
              <input
                {...register("coverage_radius_km")}
                type="number"
                step="0.1"
                className="w-full px-8 py-5 bg-gray-50 border-none rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-xl font-bold text-gray-900"
              />
              {errors.coverage_radius_km && <p className="text-red-500 text-xs font-bold pl-2">{errors.coverage_radius_km.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black text-xl tracking-wider hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-200 active:scale-[0.97] transition-all disabled:opacity-50 flex items-center justify-center gap-4 group"
          >
            {submitting ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <>
                <PlusCircle size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                Create
              </>
            )}
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
