import { Plus, X, Edit2, MapPin, Tag } from 'lucide-react';
import { Area, Category } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  user: any;
  areas: Area[];
  categories: Category[];
  selectedAreas: string[];
  selectedCategories: string[];
  onSelectArea: (id: string | null) => void;
  onSelectCategory: (id: string | null) => void;
  onAddArea: () => void;
  onAddCategory: () => void;
  onEditArea: (area: Area) => void;
  onEditCategory: (cat: Category) => void;
  onDeleteArea: (id: string) => void;
  onDeleteCategory: (id: string) => void;
}

export default function Sidebar({
  user,
  areas,
  categories,
  selectedAreas,
  selectedCategories,
  onSelectArea,
  onSelectCategory,
  onAddArea,
  onAddCategory,
  onEditArea,
  onEditCategory,
  onDeleteArea,
  onDeleteCategory,
}: SidebarProps) {
  return (
    <aside className="w-full lg:w-64 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
      {/* Categories */}
      <motion.div layout>
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
          <h2 className="text-lg font-black flex items-center serif-display">
            <Tag className="w-5 h-5 mr-2 text-brand-red" />
            Loại món ăn
          </h2>
          {user && user.email === 'nlhthinh95@gmail.com' && (
            <button
              onClick={onAddCategory}
              className="p-1 hover:bg-red-50 text-brand-red rounded-full transition-colors bg-white border border-red-100"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
        <motion.div layout className="flex flex-wrap gap-2">
          <button
            onClick={() => onSelectCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
              selectedCategories.length === 0
                ? 'bg-brand-red text-white border-brand-red shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-200'
            }`}
          >
            Tất cả loại
          </button>
          {categories.map((cat) => (
            <motion.div layout key={cat.id} className="group relative flex items-center gap-1">
              <button
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center justify-between border ${
                  selectedCategories.includes(cat.id)
                    ? 'bg-brand-red text-white border-brand-red shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-200'
                }`}
              >
                <span className="truncate">{cat.name}</span>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Areas */}
      <motion.div layout>
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
          <h2 className="text-lg font-black flex items-center serif-display">
            <MapPin className="w-5 h-5 mr-2 text-brand-red" />
            Khu vực
          </h2>
          {user && user.email === 'nlhthinh95@gmail.com' && (
            <button
              onClick={onAddArea}
              className="p-1 hover:bg-red-50 text-brand-red rounded-full transition-colors bg-white border border-red-100"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
        <motion.div layout className="flex flex-wrap gap-2">
          <button
            onClick={() => onSelectArea(null)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
              selectedAreas.length === 0
                ? 'bg-brand-red text-white border-brand-red shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-200'
            }`}
          >
            Tất cả khu vực
          </button>
          {areas.map((area) => (
            <motion.div layout key={area.id} className="group relative flex items-center gap-1">
              <button
                onClick={() => onSelectArea(area.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center justify-between border ${
                  selectedAreas.includes(area.id)
                    ? 'bg-brand-red text-white border-brand-red shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-200'
                }`}
              >
                <span className="truncate">{area.name}</span>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </aside>
  );
}
