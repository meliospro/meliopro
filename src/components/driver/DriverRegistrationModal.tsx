import React, { useState } from 'react';
import { useTaxi } from '../../context/TaxiContext';
import {
  Bike,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Upload,
  CheckCircle,
  X,
  User,
  Phone,
  CreditCard,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';

interface DriverRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessSwitchRole?: () => void;
}

export const DriverRegistrationModal: React.FC<DriverRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccessSwitchRole,
}) => {
  const { registerDriver, setRole } = useTaxi();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+221 ');
  const [cniNumber, setCniNumber] = useState('');
  const [motoBrand, setMotoBrand] = useState('Bajaj');
  const [motoModel, setMotoModel] = useState('Boxer 150cc');
  const [motoColor, setMotoColor] = useState('Noir & Jaune Taxi');
  const [plate, setPlate] = useState('KL-');
  const [year, setYear] = useState(2023);

  // Mandatory Driver License Fields
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseCategory, setLicenseCategory] = useState('Permis A (Moto)');
  const [licenseIssueDate, setLicenseIssueDate] = useState('2022-05-14');
  const [licenseFileSelected, setLicenseFileSelected] = useState(true); // Demo scan active
  const [hasHelmetChecked, setHasHelmetChecked] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);
  const [createdDriverId, setCreatedDriverId] = useState('');

  if (!isOpen) return null;

  // Strict check: Driver license is 100% mandatory
  const isLicenseFilled = licenseNumber.trim().length >= 4;
  const isFormValid =
    name.trim().length >= 3 &&
    phone.trim().length >= 8 &&
    isLicenseFilled &&
    hasHelmetChecked;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isLicenseFilled) {
      setErrorMsg(
        '⚠️ Le permis de conduire est STRICTEMENT OBLIGATOIRE. Veuillez saisir votre numéro de permis officiel.'
      );
      return;
    }

    if (!hasHelmetChecked) {
      setErrorMsg(
        '⚠️ Vous devez certifier disposer d’un casque de protection homologué pour vos passagers.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await registerDriver({
        name,
        phone,
        cniNumber,
        motoBrand,
        motoModel,
        motoColor,
        plate,
        year,
        licenseNumber,
        licenseCategory,
        licenseIssueDate,
        hasHelmet: hasHelmetChecked,
      });

      if (res.success) {
        setRegisteredSuccess(true);
        if (res.driverId) setCreatedDriverId(res.driverId);
      } else {
        setErrorMsg(res.message);
      }
    } catch {
      setErrorMsg("Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToDriverSpace = () => {
    setRole('driver');
    onClose();
    if (onSuccessSwitchRole) onSuccessSwitchRole();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-neutral-900 border border-neutral-800 text-neutral-100 shadow-2xl p-5 my-8 animate-in fade-in zoom-in-95">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition"
        >
          <X size={20} />
        </button>

        {!registeredSuccess ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-800">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-neutral-950 flex items-center justify-center font-black shadow-lg">
                <Bike size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white font-display">
                    Devenir Chauffeur Moto
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-400 border border-amber-400/40">
                    SamaTaxi Kaolack
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Tarif garanti : <strong>200 FCFA chaque 500 mètres</strong>
                </p>
              </div>
            </div>

            {/* Strict Notice: Permis Obligatoire */}
            <div className="mt-4 p-3 rounded-2xl bg-red-950/40 border border-red-500/50 flex items-start gap-3">
              <div className="p-1 rounded-lg bg-red-500/20 text-red-400 mt-0.5 shrink-0">
                <AlertTriangle size={16} />
              </div>
              <div className="text-xs text-red-200 leading-relaxed">
                <strong className="text-red-300 block font-bold text-xs uppercase tracking-wide">
                  ⚠️ Permis de conduire strictement obligatoire
                </strong>
                Conformément au Code de la Route sénégalais et aux règles de sécurité SamaTaxi,
                tout chauffeur motard doit impérativement posséder un permis de conduire officiel valide.
              </div>
            </div>

            {errorMsg && (
              <div className="mt-3 p-3 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              {/* Personal info */}
              <div className="space-y-2.5 bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-800">
                <span className="font-bold text-neutral-300 flex items-center gap-1.5 text-xs">
                  <User size={14} className="text-amber-400" />
                  <span>1. Identité du Conducteur</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">
                      Nom & Prénom <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Ibrahima Faye"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3 py-2 text-white placeholder-neutral-500 text-xs focus:border-amber-400 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">
                      Numéro Téléphone (+221) <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+221 77 000 00 00"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3 py-2 text-white placeholder-neutral-500 text-xs focus:border-amber-400 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">
                    Numéro CNI (Carte Nationale d'Identité)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 1 759 1995 02341"
                    value={cniNumber}
                    onChange={(e) => setCniNumber(e.target.value)}
                    className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3 py-2 text-white placeholder-neutral-500 text-xs focus:border-amber-400 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Moto Information */}
              <div className="space-y-2.5 bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-800">
                <span className="font-bold text-neutral-300 flex items-center gap-1.5 text-xs">
                  <Bike size={14} className="text-amber-400" />
                  <span>2. Moto & Équipement</span>
                </span>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">
                      Marque de la Moto
                    </label>
                    <select
                      value={motoBrand}
                      onChange={(e) => setMotoBrand(e.target.value)}
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3 py-2 text-white text-xs focus:border-amber-400 focus:outline-hidden"
                    >
                      <option value="Bajaj">Bajaj Boxer</option>
                      <option value="Yamaha">Yamaha Crux / YBR</option>
                      <option value="Haojue">Haojue Suzuki</option>
                      <option value="TVS">TVS HLX</option>
                      <option value="Kymco">Kymco Scooter</option>
                      <option value="Autre">Autre Moto homologuée</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">
                      Modèle / Cylindrée
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 150cc"
                      value={motoModel}
                      onChange={(e) => setMotoModel(e.target.value)}
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3 py-2 text-white text-xs focus:border-amber-400 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">
                      Immatriculation Moto
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: KL-5542-M"
                      value={plate}
                      onChange={(e) => setPlate(e.target.value)}
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3 py-2 text-white text-xs focus:border-amber-400 focus:outline-hidden uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">
                      Couleur Moto
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Noir & Jaune"
                      value={motoColor}
                      onChange={(e) => setMotoColor(e.target.value)}
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3 py-2 text-white text-xs focus:border-amber-400 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION PERMIS DE CONDUIRE (STRICTEMENT OBLIGATOIRE) */}
              <div className="space-y-3 bg-gradient-to-br from-neutral-900 to-amber-950/20 p-4 rounded-2xl border-2 border-amber-400/60 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-400 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                    <ShieldCheck size={16} />
                    <span>3. Permis de Conduire (Obligatoire)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-400 text-neutral-950">
                    EXIGÉ
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-amber-200 mb-1">
                      Numéro Officiel du Permis <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <CreditCard
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Ex: SN-2022-84920"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        className={`w-full rounded-xl bg-neutral-950 border pl-8 pr-3 py-2 text-white placeholder-neutral-500 text-xs focus:outline-hidden font-mono tracking-wider ${
                          isLicenseFilled
                            ? 'border-emerald-500/80 focus:border-emerald-400'
                            : 'border-red-500/70 focus:border-red-400'
                        }`}
                      />
                    </div>
                    {!isLicenseFilled && (
                      <span className="text-[10px] text-red-400 mt-1 block">
                        Champ obligatoire pour la validation.
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                      Catégorie de Permis <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={licenseCategory}
                      onChange={(e) => setLicenseCategory(e.target.value)}
                      className="w-full rounded-xl bg-neutral-950 border border-neutral-700 px-3 py-2 text-white text-xs focus:border-amber-400 focus:outline-hidden"
                    >
                      <option value="Permis A (Moto toutes cylindrées)">
                        Permis A (Moto toutes cylindrées)
                      </option>
                      <option value="Permis A1 (Moto légère 125cc)">
                        Permis A1 (Moto légère 125cc)
                      </option>
                      <option value="Permis B (Auto & Moto équivalent)">
                        Permis B (Auto & Moto)
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-300 mb-1">
                    Date d'obtention / délivrance
                  </label>
                  <div className="relative">
                    <Calendar
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      type="date"
                      value={licenseIssueDate}
                      onChange={(e) => setLicenseIssueDate(e.target.value)}
                      className="w-full rounded-xl bg-neutral-950 border border-neutral-700 pl-8 pr-3 py-2 text-white text-xs focus:border-amber-400 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Justificatif / Scan preview */}
                <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <FileCheck size={16} />
                    </div>
                    <div>
                      <span className="font-bold text-[11px] text-neutral-200 block">
                        Scan du Permis de Conduire
                      </span>
                      <span className="text-[10px] text-emerald-400">
                        {licenseFileSelected ? 'Document prêt pour vérification' : 'Non joint'}
                      </span>
                    </div>
                  </div>
                  <label className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[11px] font-semibold text-neutral-300 cursor-pointer flex items-center gap-1">
                    <Upload size={12} />
                    <span>Modifier</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={() => setLicenseFileSelected(true)}
                    />
                  </label>
                </div>

                {/* Case à cocher obligatoire : Casque & Sécurité */}
                <label className="flex items-start gap-2 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasHelmetChecked}
                    onChange={(e) => setHasHelmetChecked(e.target.checked)}
                    className="mt-0.5 rounded border-neutral-700 text-amber-400 focus:ring-amber-400 bg-neutral-950"
                  />
                  <span className="text-[11px] text-neutral-300 leading-tight">
                    <strong className="text-white">Engagement de sécurité obligatoire :</strong> Je certifie
                    sur l'honneur détenir un permis de conduire officiel en cours de validité et posséder
                    un casque homologué propre pour mon passager à chaque course SamaTaxi.
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition shadow-lg ${
                    isFormValid && !isSubmitting
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-neutral-950 cursor-pointer active:scale-98'
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                  }`}
                >
                  {isSubmitting ? (
                    <span>Validation du permis et inscription...</span>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      <span>Valider mon inscription motard</span>
                    </>
                  )}
                </button>

                {!isLicenseFilled && (
                  <p className="text-[10px] text-neutral-500 text-center mt-2 flex items-center justify-center gap-1">
                    <Info size={12} />
                    <span>Renseignez votre permis de conduire pour activer le bouton.</span>
                  </p>
                )}
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Success Screen */
          <div className="text-center py-6 px-3 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle size={36} />
            </div>

            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                Félicitations {name} !
              </span>
              <h3 className="text-lg font-black text-white mt-1">
                Votre inscription Chauffeur Moto est validée
              </h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                Votre permis de conduire <strong>({licenseNumber})</strong> a été enregistré et vérifié
                dans notre base sécurisée.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center text-neutral-400 pb-2 border-b border-neutral-800">
                <span>Identifiant Motard :</span>
                <span className="font-mono text-amber-400 font-bold">{createdDriverId}</span>
              </div>
              <div className="flex justify-between items-center text-neutral-400">
                <span>Véhicule enregistré :</span>
                <span className="text-white font-semibold">{motoBrand} {motoModel} ({plate})</span>
              </div>
              <div className="flex justify-between items-center text-neutral-400">
                <span>Permis de conduire :</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck size={13} />
                  <span>Vérifié & Conforme</span>
                </span>
              </div>
              <div className="flex justify-between items-center text-neutral-400">
                <span>Tarif applicable :</span>
                <span className="text-amber-400 font-bold">200 FCFA chaque 500m</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleGoToDriverSpace}
                className="w-full py-3 bg-[#F5B800] hover:bg-amber-500 text-neutral-950 font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-98"
              >
                <Bike size={16} />
                <span>Accéder à mon espace Chauffeur Moto</span>
              </button>
              <button
                onClick={onClose}
                className="w-full py-2.5 text-neutral-400 hover:text-white text-xs font-semibold"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
