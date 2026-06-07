"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import {
  Plus,
  X,
  Loader2,
  Navigation,
  CheckCircle,
  ImageIcon,
  Upload,
  MapPin,
} from "lucide-react";
import { CATEGORIES } from "./WargaDashboard";
import { ReportCategory } from "@/app/types/report.type";
import { useCreateReport } from "@/app/hooks/report/useCreateReport";

type ReportFormInputs = {
  title: string;
  category: ReportCategory;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
  photo: FileList;
};

const LocationPicker = dynamic(() => import("@/components/LocationPicker"), {
  ssr: false,
});

const ReportForm = ({
  onClose,
  onSubmitSuccess,
}: {
  onClose: () => void;
  onSubmitSuccess: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ReportFormInputs>();

  const createReportMutation = useCreateReport();
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);

  // State baru untuk menyimpan URL preview gambar
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const photoFile = watch("photo");
  const lat = watch("latitude");
  const lng = watch("longitude");

  // Logika untuk menangani pratinjau gambar (diambil dari snippet atas, disesuaikan react-hook-form)
  useEffect(() => {
    // photoFile adalah FileList. Cek jika ada file yang dipilih.
    if (photoFile && photoFile.length > 0) {
      const file = photoFile[0];

      // Buat object URL untuk preview
      const url = URL.createObjectURL(file);
      setImagePreview(url);

      // Cleanup function untuk menghindari memory leak
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      // Jika file dihapus, hapus preview
      setImagePreview(null);
    }
  }, [photoFile]);

  // Fungsi untuk menghapus foto
  const handleRemovePhoto = () => {
    // Reset nilai di react-hook-form
    setValue("photo", null as any, { shouldValidate: true });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung Geolocation");
      return;
    }
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue("latitude", position.coords.latitude.toString(), {
          shouldValidate: true,
        });
        setValue("longitude", position.coords.longitude.toString(), {
          shouldValidate: true,
        });
        setIsGettingLocation(false);
      },
      (error) => {
        console.error(error);
        alert("Gagal mendapatkan lokasi. Pastikan izin lokasi diaktifkan.");
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true },
    );
  };

  const handleLocationSelect = (lat: number, lng: number, addr: string) => {
    setValue("latitude", lat.toString(), { shouldValidate: true });
    setValue("longitude", lng.toString(), { shouldValidate: true });
    setValue("address", addr, { shouldValidate: true });
    setShowMapPicker(false);
  };

  const onSubmit = async (data: ReportFormInputs) => {
    try {
      await createReportMutation.mutateAsync({
        title: data.title,
        description: data.description,
        category: data.category,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        photo: data.photo[0], // Ambil file pertama
      });
      onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to submit report", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1E293B] rounded-2xl w-full max-w-lg border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-full">
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-[#0F172A]">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Plus size={18} className="text-blue-500" /> Buat Laporan Baru
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          <form
            id="report-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 text-slate-200"
          >
            {/* Judul */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-300">
                Judul Laporan *
              </label>
              <input
                {...register("title", { required: "Judul wajib diisi" })}
                className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Contoh: Jalan berlubang di M.H. Thamrin"
              />
              {errors.title && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-300">
                Kategori *
              </label>
              <select
                {...register("category", {
                  required: "Kategori wajib dipilih",
                })}
                className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
              >
                <option value="">Pilih Kategori</option>
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <option key={key} value={key}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Lokasi */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-300">
                Lokasi & Titik Peta *
              </label>
              <input
                {...register("address", { required: "Alamat wajib diisi" })}
                className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all mb-2"
                placeholder="Tuliskan nama jalan/patokan detail..."
              />
              {errors.address && (
                <p className="text-red-400 text-xs mt-1 mb-2">
                  {errors.address.message}
                </p>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex gap-2 flex-1">
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isGettingLocation}
                    className="flex flex-1 items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isGettingLocation ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Navigation size={16} />
                    )}
                    <span className="hidden sm:inline">GPS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowMapPicker(true)}
                    className="flex flex-1 items-center justify-center gap-2 px-3 py-2 text-sm bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors"
                  >
                    <MapPin size={16} />
                    <span>Pilih Peta</span>
                  </button>
                </div>

                {lat && lng && (
                  <div className="flex-1 text-[10px] font-mono bg-green-500/10 text-green-400 p-2 rounded-lg border border-green-500/30 truncate text-center">
                    {lat}, {lng}
                  </div>
                )}
              </div>

              <input type="hidden" {...register("latitude")} />
              <input type="hidden" {...register("longitude")} />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-300">
                Deskripsi Detail *
              </label>
              <textarea
                {...register("description", {
                  required: "Deskripsi wajib diisi",
                })}
                rows={3}
                className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                placeholder="Jelaskan secara detail kondisi yang terjadi..."
              />
              {errors.description && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Foto Bukti - Implementasi Preview */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-300">
                Foto Bukti (Wajib) *
              </label>

              {imagePreview ? (
                // Tampilan saat gambar sudah dipilih (diambil dari snippet atas, disesuaikan gaya dark)
                <div className="relative rounded-xl overflow-hidden border border-slate-700 group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                  {/* Overlay tombol hapus saat di-hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors"
                      title="Hapus foto"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
              ) : (
                // Tampilan kotak unggah saat gambar kosong
                <div className="relative border-2 border-dashed border-slate-600 rounded-xl bg-[#0F172A] hover:bg-slate-800 transition-colors p-6 flex flex-col items-center justify-center gap-2 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    {...register("photo", {
                      required: "Foto bukti wajib diunggah",
                    })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="p-3 bg-blue-500/10 rounded-full text-blue-500">
                    <Upload size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-300">
                      Klik untuk unggah foto
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      JPG, PNG, max 10MB
                    </p>
                  </div>
                </div>
              )}

              {errors.photo && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.photo.message}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-700 bg-[#0F172A] flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            form="report-form"
            disabled={createReportMutation.isPending}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-70"
          >
            {createReportMutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CheckCircle size={16} />
            )}
            {createReportMutation.isPending ? "Mengirim..." : "Kirim Laporan"}
          </button>
        </div>
      </div>

      {showMapPicker && (
        <LocationPicker
          onSelect={handleLocationSelect}
          onClose={() => setShowMapPicker(false)}
        />
      )}
    </div>
  );
};

export default ReportForm;
