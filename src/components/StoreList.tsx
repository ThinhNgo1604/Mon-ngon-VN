import { Map, Edit2, ExternalLink } from 'lucide-react';
import { Store, Category, Area } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmDeleteButton from './ConfirmDeleteButton';
import MarqueeText from './MarqueeText';

interface StoreListProps {
  user: any;
  stores: Store[];
  categories: Category[];
  areas: Area[];
  onEdit: (store: Store) => void;
  onDelete: (id: string) => void;
}

export default function StoreList({
  user,
  stores,
  categories,
  areas,
  onEdit,
  onDelete,
}: StoreListProps) {
  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name || 'N/A';
  const getAreaName = (id: string) => areas.find((a) => a.id === id)?.name || 'N/A';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tên cửa hàng</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Loại</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Khu vực</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Địa chỉ</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Bản đồ</th>
              {user && user.email === 'nlhthinh95@gmail.com' && <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 relative">
            <AnimatePresence mode="popLayout" initial={false}>
              {stores.length === 0 ? (
                <motion.tr
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <td colSpan={user ? 6 : 5} className="px-6 py-12 text-center text-gray-500 italic">
                    Không tìm thấy món ngon nào...
                  </td>
                </motion.tr>
              ) : (
                stores.map((store) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ 
                      opacity: { duration: 0.2 },
                      layout: { type: "spring", stiffness: 500, damping: 50, mass: 1 }
                    }}
                    key={store.id}
                    className="hover:bg-gray-50 transition-colors group bg-white"
                  >
                    <td className="px-6 py-4 max-w-[200px]">
                      <MarqueeText 
                        text={store.name} 
                        className="text-sm font-semibold text-gray-900" 
                      />
                    </td>
    <td className="px-6 py-4">
      <div className="flex flex-wrap gap-1">
        {store.categoryIds.map((catId) => (
          <span 
            key={catId}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-orange-800 border border-orange-200"
          >
            {getCategoryName(catId)}
          </span>
        ))}
        {store.categoryIds.length === 0 && (
          <span className="text-xs text-gray-400 italic">Chưa phân loại</span>
        )}
      </div>
    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getAreaName(store.areaId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-[250px]">
                      <MarqueeText 
                        text={store.address || 'Đang cập nhật...'} 
                        className="text-sm text-gray-600" 
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      {store.mapLink ? (
                        <a
                          href={store.mapLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center p-2 rounded-full text-brand-red hover:bg-red-50 transition-all"
                        >
                          <Map className="w-5 h-5" />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Chưa có link</span>
                      )}
                    </td>
                    {user && user.email === 'nlhthinh95@gmail.com' && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => onEdit(store)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <ConfirmDeleteButton onDelete={() => onDelete(store.id)} />
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
