import React from 'react';
import { useTaxi } from '../../context/TaxiContext';
import {
  Bike,
  FileCheck2,
  ShieldCheck,
  Star,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface DriverProfileProps {
  onBack: () => void;
}

export const DriverProfile: React.FC<DriverProfileProps> = ({ onBack }) => {
  const { activeDriver } = useTaxi();

  return (
    <div className="flex-1 bg-neutral-50 flex flex-col p-4 select-none overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
        <button
          onClick={onBack}
          className="p-1.5 -ml-1 text-neutral-600 hover:text-neutral-900 rounded-full hover:bg-neutral-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-base font-bold font-display text-neutral-900">
          Profil Chauffeur Moto SamaTaxi
        </h2>
        <div className="w-8" />
      </div>

      {/* Driver Identity Card */}
      <div className="my-3 bg-white rounded-3xl p-4 border border-neutral-200 shadow-xs flex items-center gap-3.5">
        <div className="relative">
          <img
            src={activeDriver.photoUrl}
            alt={activeDriver.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-sm"
          />
          <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-white">
            <CheckCircle2 size={12} />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-bold font-display text-neutral-900 truncate">
              {activeDriver.name}
            </h3>
          </div>
          <p className="text-xs text-neutral-500">{activeDriver.phone}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center text-amber-500 font-extrabold text-xs">
              ★ {activeDriver.rating}
            </span>
            <span className="text-neutral-400">•</span>
            <span className="text-xs text-neutral-600 font-medium">
              {activeDriver.totalTrips} courses moto
            </span>
          </div>
        </div>
      </div>

      {/* Assigned Moto Details */}
      <div className="bg-white rounded-3xl p-4 border border-neutral-200 shadow-xs mb-3">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
          <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
            <Bike size={16} className="text-amber-500" />
            <span>Moto enregistrée</span>
          </span>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
            Conforme Moto-Taxi Kaolack
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[10px] text-neutral-400 block font-semibold">Marque & Modèle</span>
            <span className="font-bold text-neutral-800">
              {activeDriver.car.brand} {activeDriver.car.model} ({activeDriver.car.year})
            </span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 block font-semibold">Couleur</span>
            <span className="font-bold text-neutral-800">{activeDriver.car.color}</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 block font-semibold">Immatriculation</span>
            <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
              {activeDriver.car.plate}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 block font-semibold">Tarif Appliqué</span>
            <span className="font-bold text-amber-600">200 FCFA / 500m</span>
          </div>
        </div>
      </div>

      {/* Driver License & Document Verification */}
      <div className="bg-white rounded-3xl p-4 border border-neutral-200 shadow-xs mb-3">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
          <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>Permis & Sécurité (Obligatoire)</span>
          </span>
          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            100% Conforme
          </span>
        </div>

        <div className="mt-3 space-y-2.5">
          <div className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-neutral-900 block text-[11px]">
                Numéro de Permis de Conduire (Obligatoire)
              </span>
              <span className="font-mono text-xs font-black text-amber-800">
                {activeDriver.licenseNumber || 'SN-2022-84920'}
              </span>
            </div>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-white px-2 py-1 rounded-xl shadow-2xs border border-emerald-200">
              <CheckCircle2 size={11} className="text-emerald-500" />
              <span>Vérifié</span>
            </span>
          </div>

          {[
            { name: 'Catégorie du permis', detail: activeDriver.licenseCategory || 'Permis A (Moto)' },
            { name: 'Carte Nationale d’Identité (CNI)', detail: 'Certifiée DGID Sénégal' },
            { name: 'Casque passager homologué', detail: 'Vérifié présent à bord' },
            { name: 'Assurance professionnelle Moto', detail: 'En cours de validité' },
          ].map((doc, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-neutral-800 block text-[11px]">{doc.name}</span>
                <span className="text-[10px] text-neutral-400">{doc.detail}</span>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 size={11} />
                <span>Validé</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Driver Badges & Seniority */}
      <div className="bg-neutral-900 text-white rounded-3xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-400">
          <Award size={16} />
          <span>Statut Motard Vérifié SamaTaxi Kaolack</span>
        </div>
        <p className="text-[11px] text-neutral-300">
          Conducteur officiel enregistré avec permis valide depuis {activeDriver.joinedDate}. Tarif fixe garanti : 200 FCFA / 500m.
        </p>
      </div>
    </div>
  );
};
