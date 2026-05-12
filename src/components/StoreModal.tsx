import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Store, Category, Area } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Store>) => void;
  editData?: Store | null;
  categories: Category[];
  areas: Area[];
}

export default function StoreModal({
  isOpen,
  onClose,
  onSave,
  editData,
  categories,
  areas,
}: StoreModalProps) {
  const [formData, setFormData] = useState<Partial<Store>>({
    name: '',
    address: '',
    categoryIds: [],
    areaId: '',
    mapLink: '',
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        categoryIds: editData.categoryIds || []
      });
    } else {
      setFormData({
        name: '',
        address: '',
        categoryIds: [],
        areaId: '',
        mapLink: '',
      });
    }
  }, [editData, isOpen]);

  const toggleCategory = (id: string) => {
    setFormData(prev => {
      const current = prev.categoryIds || [];
      const updated = current.includes(id) 
        ? current.filter(c => c !== id) 
        : [...current, id];
      return { ...prev, categoryIds: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.categoryIds?.length || !formData.areaId) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc (phải chọn ít nhất 1 loại món)!');
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">
            {editData ? 'Chỉnh sửa món ngon' : 'Thêm món ngon mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Tên cửa hàng (Tối đa 50 ký tự) <span className="text-brand-red">*</span>
            </label>
            <input
              type="text"
              maxLength={50}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Phở Thìn Lò Đúc"
            />
            <div className="flex justify-end mt-1">
              <span className={`text-xs ${formData.name?.length === 50 ? 'text-red-500' : 'text-gray-400'}`}>
                {formData.name?.length || 0}/50
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Loại món (Có thể chọn nhiều) <span className="text-brand-red">*</span>
              </label>
              <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-2xl bg-gray-50/50">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                      formData.categoryIds?.includes(cat.id)
                        ? 'bg-brand-red text-white border-brand-red shadow-sm scale-105'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
                {categories.length === 0 && (
                  <p className="text-xs text-gray-400 italic">Chưa có loại món nào...</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Khu vực <span className="text-brand-red">*</span>
              </label>
              <select
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all appearance-none bg-white"
                value={formData.areaId}
                onChange={(e) => setFormData({ ...formData, areaId: e.target.value })}
              >
                <option value="">Chọn khu vực</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>{area.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Địa chỉ (Tối đa 100 ký tự) <span className="text-brand-red">*</span>
            </label>
            <textarea
              maxLength={100}
              required
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="VD: 13 Lò Đúc, Phạm Đình Hổ, Hai Bà Trưng, Hà Nội"
            />
            <div className="flex justify-end mt-1">
              <span className={`text-xs ${formData.address?.length === 100 ? 'text-red-500' : 'text-gray-400'}`}>
                {formData.address?.length || 0}/100
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Link Google Maps (Chỉ hiện trong Admin)
            </label>
            <input
              type="url"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
              value={formData.mapLink}
              onChange={(e) => setFormData({ ...formData, mapLink: e.target.value })}
              placeholder="https://goo.gl/maps/..."
            />
          </div>

          <div className="pt-4 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-brand-red text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-md flex items-center justify-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Lưu thông tin
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
