import { Map, Edit2, ExternalLink } from 'lucide-react';
import { Store, Category, Area } from '../types';
import ConfirmDeleteButton from './ConfirmDeleteButton';

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
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tên cửa hàng</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Loại</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Khu vực</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Địa chỉ</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Bản đồ</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Tình trạng</th>
              {user && user.email === 'nlhthinh95@gmail.com' && <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {stores.length === 0 ? (
              <tr key="no-results">
                <td colSpan={user ? 6 : 5} className="px-6 py-12 text-center text-gray-500 italic">
                  Không tìm thấy món ngon nào...
                </td>
              </tr>
            ) : (
              stores.map((store) => (
                <tr
                  key={store.id}
                  className="hover:bg-gray-50 group bg-white"
                >
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900" title={store.name}>
                        {store.name}
                      </div>
                    </td>
    <td className="px-6 py-4 whitespace-nowrap">
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getAreaName(store.areaId)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {store.address || 'Đang cập nhật...'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {store.mapLink ? (
                        <a
                          href={store.mapLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center p-2 rounded-full text-brand-red hover:bg-red-50"
                        >
                          <Map className="w-5 h-5" />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Chưa có link</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {store.isActive !== false ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-green-50 text-green-700 border border-green-200">
                          HOẠT ĐỘNG
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-red-50 text-red-700 border border-red-200">
                          ĐÃ NGHỈ
                        </span>
                      )}
                    </td>
                    {user && user.email === 'nlhthinh95@gmail.com' && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => onEdit(store)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <ConfirmDeleteButton onDelete={() => onDelete(store.id)} />
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
