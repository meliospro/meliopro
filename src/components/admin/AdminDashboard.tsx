import React, { useState } from 'react';
import { useTaxi } from '../../context/TaxiContext';
import { DakarMap } from '../common/DakarMap';
import { SamaLogo } from '../common/SamaLogo';
import { Driver, PricingSettings } from '../../types';
import {
  LayoutDashboard,
  Users,
  Bike,
  MapPin,
  DollarSign,
  Tag,
  AlertCircle,
  Settings,
  ShieldCheck,
  CheckCircle,
  XCircle,
  TrendingUp,
  FileText,
  Search,
  Plus,
  RefreshCw,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    drivers,
    trips,
    pricing,
    updatePricing,
    promos,
    tickets,
    resolveTicket,
    approveDriver,
    suspendDriver,
  } = useTaxi();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'map' | 'drivers' | 'clients' | 'pricing' | 'promos' | 'tickets'
  >('overview');

  const [searchDriver, setSearchDriver] = useState('');
  const [selectedDriverForModal, setSelectedDriverForModal] = useState<Driver | null>(null);

  // Editable pricing state
  const [editPricing, setEditPricing] = useState<PricingSettings>(pricing);
  const [pricingSaved, setPricingSaved] = useState(false);

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    updatePricing(editPricing);
    setPricingSaved(true);
    setTimeout(() => setPricingSaved(false), 2000);
  };

  // Metrics calculations
  const onlineDriversCount = drivers.filter((d) => d.isOnline).length;
  const onTripDriversCount = drivers.filter((d) => d.status === 'on_trip').length;
  const totalVolumeFCFA = trips.reduce((acc, t) => acc + t.finalPrice, 1425000);
  const totalCommissionFCFA = Math.round((totalVolumeFCFA * pricing.commissionPercentage) / 100);

  const filteredDrivers = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(searchDriver.toLowerCase()) ||
      d.phone.includes(searchDriver) ||
      d.car.plate.toLowerCase().includes(searchDriver.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-neutral-900 text-neutral-100 overflow-hidden font-sans select-none min-h-[750px]">
      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col p-4 flex-shrink-0">
        <div className="flex items-center gap-3 px-2 py-3 border-b border-neutral-800/80 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#F5B800] text-neutral-950 flex items-center justify-center font-black text-sm">
            ST
          </div>
          <div>
            <div className="font-extrabold text-sm text-white font-display flex items-baseline">
              <span>Sama</span>
              <span className="text-amber-400">Taxi</span>
              <span className="text-[10px] text-neutral-400 ml-1">Admin</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Kaolack Hub Connecté</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Vue d’ensemble', icon: LayoutDashboard },
            { id: 'map', label: 'Flotte en direct (Carte)', icon: MapPin },
            { id: 'drivers', label: 'Chauffeurs Motos', icon: Bike, badge: drivers.length },
            { id: 'clients', label: 'Clients & Passagers', icon: Users },
            { id: 'pricing', label: 'Tarifs & Commission', icon: DollarSign },
            { id: 'promos', label: 'Codes Promotions', icon: Tag, badge: promos.length },
            {
              id: 'tickets',
              label: 'Réclamations & Support',
              icon: AlertCircle,
              badge: tickets.filter((t) => t.status === 'open').length,
            },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition ${
                  isActive
                    ? 'bg-amber-400 text-neutral-950 shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-neutral-950 text-amber-400' : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Admin Footer */}
        <div className="pt-3 border-t border-neutral-800/80 text-[11px] text-neutral-500 flex items-center justify-between">
          <span>Plateforme Sénégal</span>
          <span className="text-amber-400 font-bold">2026.1</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-neutral-900 no-scrollbar p-4 md:p-6">
        {/* TAB 1: OVERVIEW METRICS (Prompt #41) */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black font-display text-white">
                  Tableau de bord Général
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Surveillance en direct des opérations SamaTaxi à Kaolack Ville.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-neutral-800 border border-neutral-700 px-3 py-1.5 rounded-xl font-semibold text-neutral-300">
                  Aujourd’hui : 21 Septembre 2026
                </span>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 shadow-md">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Chauffeurs en ligne
                </span>
                <div className="text-2xl font-black font-display text-emerald-400 mt-1 flex items-baseline gap-2">
                  <span>{onlineDriversCount}</span>
                  <span className="text-xs font-semibold text-neutral-400">/ {drivers.length} inscrits</span>
                </div>
                <div className="text-[10px] text-neutral-500 mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{onTripDriversCount} en course actuellement</span>
                </div>
              </div>

              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 shadow-md">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Volume de courses (FCFA)
                </span>
                <div className="text-2xl font-black font-display text-amber-400 mt-1">
                  {totalVolumeFCFA.toLocaleString('fr-FR')} <span className="text-xs text-white">F</span>
                </div>
                <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
                  <TrendingUp size={12} />
                  <span>+14.2% vs semaine passée</span>
                </div>
              </div>

              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 shadow-md">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Commission SamaTaxi ({pricing.commissionPercentage}%)
                </span>
                <div className="text-2xl font-black font-display text-white mt-1">
                  {totalCommissionFCFA.toLocaleString('fr-FR')} <span className="text-xs text-amber-400">FCFA</span>
                </div>
                <div className="text-[10px] text-neutral-400 mt-1">
                  Revenus de plateforme sécurisés
                </div>
              </div>

              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 shadow-md">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Satisfaction Passagers
                </span>
                <div className="text-2xl font-black font-display text-amber-400 mt-1 flex items-baseline gap-1">
                  <span>★ 4.88</span>
                  <span className="text-xs text-neutral-400 font-semibold">/ 5</span>
                </div>
                <div className="text-[10px] text-neutral-400 mt-1">
                  Sur 2 840 avis recueillis
                </div>
              </div>
            </div>

            {/* Live Fleet Preview */}
            <div className="bg-neutral-950 rounded-3xl border border-neutral-800 p-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-amber-400" />
                  <span className="text-xs font-bold text-white">Carte en direct Kaolack & Position des Véhicules</span>
                </div>
                <button
                  onClick={() => setActiveTab('map')}
                  className="text-xs font-bold text-amber-400 hover:underline"
                >
                  Agrandir la carte ›
                </button>
              </div>

              <div className="h-72 rounded-2xl overflow-hidden border border-neutral-800">
                <DakarMap drivers={drivers} heightClass="h-full" />
              </div>
            </div>

            {/* Recent Trips Table */}
            <div className="bg-neutral-950 rounded-3xl border border-neutral-800 p-4">
              <span className="text-xs font-bold text-white block mb-3">Dernières courses enregistrées</span>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead className="text-[10px] uppercase text-neutral-500 border-b border-neutral-800">
                    <tr>
                      <th className="pb-2">Course ID</th>
                      <th className="pb-2">Client</th>
                      <th className="pb-2">Trajet</th>
                      <th className="pb-2">Chauffeur</th>
                      <th className="pb-2">Montant</th>
                      <th className="pb-2">Paiement</th>
                      <th className="pb-2">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900">
                    {trips.map((t) => (
                      <tr key={t.id} className="hover:bg-neutral-900/60">
                        <td className="py-2.5 font-mono text-amber-400 font-bold">{t.id}</td>
                        <td className="py-2.5 font-medium text-white">{t.clientName}</td>
                        <td className="py-2.5 text-neutral-400 truncate max-w-[200px]">
                          {t.pickup.name} → {t.destination.name}
                        </td>
                        <td className="py-2.5">{t.driver?.name || 'Mamadou Ndiaye'}</td>
                        <td className="py-2.5 font-bold text-white">{t.finalPrice.toLocaleString('fr-FR')} F</td>
                        <td className="py-2.5 text-neutral-300">
                          {t.paymentMethod === 'WAVE' ? 'Wave' : t.paymentMethod === 'ORANGE_MONEY' ? 'Orange Money' : 'Cash'}
                        </td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Payé
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE MAP (Prompt #42) */}
        {activeTab === 'map' && (
          <div className="flex-1 flex flex-col space-y-4 h-full">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black font-display text-white">
                  Supervision Cartographique de la Flotte
                </h2>
                <p className="text-xs text-neutral-400">
                  Légende : Vert = Disponible • Orange = En course • Gris = Hors ligne
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold">
                  {onlineDriversCount} véhicules actifs
                </span>
              </div>
            </div>

            <div className="flex-1 min-h-[500px] rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl relative">
              <DakarMap
                drivers={drivers}
                heightClass="h-full"
                interactive={true}
              />
            </div>
          </div>
        )}

        {/* TAB 3: DRIVERS MANAGEMENT (Prompt #43) */}
        {activeTab === 'drivers' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black font-display text-white">
                  Gestion des Chauffeurs SamaTaxi
                </h2>
                <p className="text-xs text-neutral-400">
                  Vérification des documents (permis, assurance, carte grise) et habilitation.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-3 text-neutral-500" />
                <input
                  type="text"
                  value={searchDriver}
                  onChange={(e) => setSearchDriver(e.target.value)}
                  placeholder="Rechercher par nom, plaque..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="bg-neutral-950 rounded-3xl border border-neutral-800 overflow-hidden shadow-md">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="text-[10px] uppercase text-neutral-500 border-b border-neutral-800 bg-neutral-900/50">
                  <tr>
                    <th className="p-3">Chauffeur</th>
                    <th className="p-3">Véhicule</th>
                    <th className="p-3">Immatriculation</th>
                    <th className="p-3">Note & Courses</th>
                    <th className="p-3">Statut</th>
                    <th className="p-3">Documents</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {filteredDrivers.map((drv) => (
                    <tr key={drv.id} className="hover:bg-neutral-900/60">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={drv.photoUrl}
                            alt={drv.name}
                            className="w-8 h-8 rounded-full object-cover border border-amber-400"
                          />
                          <div>
                            <div className="font-bold text-white">{drv.name}</div>
                            <div className="text-[10px] text-neutral-500">{drv.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        {drv.car.brand} {drv.car.model}
                      </td>
                      <td className="p-3 font-mono font-bold text-amber-400">
                        {drv.car.plate}
                      </td>
                      <td className="p-3">
                        <span className="text-amber-400 font-bold">★ {drv.rating}</span>{' '}
                        <span className="text-neutral-500">({drv.totalTrips})</span>
                      </td>
                      <td className="p-3">
                        {drv.isOnline ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            En ligne
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-800 text-neutral-400">
                            Hors ligne
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                          <CheckCircle size={13} />
                          <span>Vérifiés</span>
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {drv.verified ? (
                            <button
                              onClick={() => suspendDriver(drv.id)}
                              className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-[10px] font-bold"
                            >
                              Suspendre
                            </button>
                          ) : (
                            <button
                              onClick={() => approveDriver(drv.id)}
                              className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-bold"
                            >
                              Valider
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CLIENT DIRECTORY (Prompt #44) */}
        {activeTab === 'clients' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-black font-display text-white">
                Répertoire des Clients & Passagers
              </h2>
              <p className="text-xs text-neutral-400">
                Gestion des comptes, notations et historique des usagers.
              </p>
            </div>

            <div className="bg-neutral-950 rounded-3xl border border-neutral-800 p-4">
              <div className="divide-y divide-neutral-900">
                {[
                  { name: 'Ousmane Fall', phone: '+221 77 500 12 34', rating: 4.9, rides: 24, status: 'Actif', city: 'Médina Baye, Kaolack' },
                  { name: 'Aminata Touré', phone: '+221 78 220 99 88', rating: 5.0, rides: 18, status: 'Actif', city: 'Kasnack, Kaolack' },
                  { name: 'Jean Mendy', phone: '+221 76 111 22 33', rating: 4.8, rides: 42, status: 'Actif', city: 'Marché Central, Kaolack' },
                  { name: 'Awa Diagne', phone: '+221 70 889 44 55', rating: 4.7, rides: 9, status: 'Actif', city: 'Ndorong, Kaolack' },
                ].map((c, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-400 text-neutral-950 font-black text-xs flex items-center justify-center">
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">{c.name}</div>
                        <div className="text-[10px] text-neutral-400">{c.phone} • {c.city}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <div className="text-xs font-bold text-amber-400">★ {c.rating}</div>
                        <div className="text-[10px] text-neutral-500">{c.rides} courses effectuées</div>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-bold">
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PRICING CONFIGURATION (Prompt #45 & #46) */}
        {activeTab === 'pricing' && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <h2 className="text-xl font-black font-display text-white">
                Configuration des Tarifs & Commissions
              </h2>
              <p className="text-xs text-neutral-400">
                Ajustez le prix de base, le tarif au km, à la minute et le pourcentage de commission SamaTaxi.
              </p>
            </div>

            <form onSubmit={handleSavePricing} className="bg-neutral-950 p-5 rounded-3xl border border-neutral-800 space-y-4">
              {/* Commission Percentage */}
              <div className="p-4 bg-amber-400/10 border border-amber-400/30 rounded-2xl">
                <label className="text-xs font-bold text-amber-400 block mb-1">
                  Commission SamaTaxi (%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={5}
                    max={40}
                    value={editPricing.commissionPercentage}
                    onChange={(e) =>
                      setEditPricing({ ...editPricing, commissionPercentage: Number(e.target.value) })
                    }
                    className="w-24 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-xs text-neutral-300">
                    Actuellement {editPricing.commissionPercentage}% prélevé sur le total brut par course.
                  </span>
                </div>
              </div>

              {/* Sama Moto Standard Tarifs */}
              <div className="border border-neutral-800 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white block">🏍️ Sama Moto Standard (Règle officielle : 200 FCFA / 500m)</span>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md">
                    Barème officiel
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">Tarif / 500m (FCFA)</label>
                    <input
                      type="number"
                      value={200}
                      disabled
                      className="w-full bg-neutral-900/60 border border-neutral-700 rounded-xl p-2 text-xs font-bold text-amber-400 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">Équivalent / Km (FCFA)</label>
                    <input
                      type="number"
                      value={400}
                      disabled
                      className="w-full bg-neutral-900/60 border border-neutral-700 rounded-xl p-2 text-xs font-bold text-white cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">Prix de base (FCFA)</label>
                    <input
                      type="number"
                      value={editPricing.baseFareEco}
                      onChange={(e) => setEditPricing({ ...editPricing, baseFareEco: Number(e.target.value) })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs font-bold text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Sama Moto Confort & Express */}
              <div className="border border-neutral-800 rounded-2xl p-4">
                <span className="text-xs font-bold text-white block mb-3">🛵 Sama Moto Confort & Express (Bagages / Casque Deluxe)</span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">Prix de base (FCFA)</label>
                    <input
                      type="number"
                      value={editPricing.baseFareComfort}
                      onChange={(e) => setEditPricing({ ...editPricing, baseFareComfort: Number(e.target.value) })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs font-bold text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">Prix / Km (FCFA)</label>
                    <input
                      type="number"
                      value={editPricing.kmRateComfort}
                      onChange={(e) => setEditPricing({ ...editPricing, kmRateComfort: Number(e.target.value) })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs font-bold text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">Prix / Min (FCFA)</label>
                    <input
                      type="number"
                      value={editPricing.minRateComfort}
                      onChange={(e) => setEditPricing({ ...editPricing, minRateComfort: Number(e.target.value) })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs font-bold text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Minimum Fare & Cancellation */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-neutral-400 block mb-1">Course Minimum (FCFA)</label>
                  <input
                    type="number"
                    value={editPricing.minimumFare}
                    onChange={(e) => setEditPricing({ ...editPricing, minimumFare: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs font-bold text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 block mb-1">Frais d’annulation (FCFA)</label>
                  <input
                    type="number"
                    value={editPricing.cancellationFee}
                    onChange={(e) => setEditPricing({ ...editPricing, cancellationFee: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs font-bold text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#F5B800] hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow-md transition"
                >
                  ENREGISTRER LA GRILLE TARIFAIRE
                </button>
                {pricingSaved && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle size={15} />
                    <span>Enregistré avec succès !</span>
                  </span>
                )}
              </div>
            </form>
          </div>
        )}

        {/* TAB 6: PROMOTIONS MANAGER (Prompt #29) */}
        {activeTab === 'promos' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black font-display text-white">
                  Gestion des Codes Promotions
                </h2>
                <p className="text-xs text-neutral-400">
                  Offres marketing pour stimuler les réservations au Sénégal.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {promos.map((p) => (
                <div key={p.id} className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-black text-amber-400 text-sm">{p.code}</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full">
                      Actif
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 mb-2">{p.description}</p>
                  <div className="text-[10px] text-neutral-500 space-y-0.5 border-t border-neutral-900 pt-2">
                    <div>Réduction : <strong>{p.discountPercentage}%</strong></div>
                    <div>Plafond : <strong>{p.maxDiscountFCFA} FCFA</strong></div>
                    <div>Expire : <strong>{p.expiryDate}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: TICKETS & SUPPORT (Prompt #50) */}
        {activeTab === 'tickets' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-black font-display text-white">
                Centre de Réclamations & Support
              </h2>
              <p className="text-xs text-neutral-400">
                Suivi des objets oubliés, contestations de tarifs et réclamations de sécurité.
              </p>
            </div>

            <div className="space-y-3">
              {tickets.map((tkt) => (
                <div key={tkt.id} className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-400 text-xs">
                          {tkt.ticketNumber}
                        </span>
                        <span className="text-[10px] text-neutral-500">• {tkt.createdAt}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">{tkt.subject}</h4>
                      <p className="text-xs text-neutral-300 mt-1 max-w-xl">{tkt.description}</p>
                      <div className="text-[10px] text-neutral-400 mt-2">
                        Émis par : <strong className="text-white">{tkt.userName}</strong> ({tkt.userType === 'client' ? 'Client' : 'Chauffeur'})
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          tkt.status === 'resolved'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {tkt.status === 'resolved' ? 'Résolu' : 'En cours'}
                      </span>

                      {tkt.status !== 'resolved' && (
                        <button
                          onClick={() => resolveTicket(tkt.id)}
                          className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition"
                        >
                          Marquer résolu
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
