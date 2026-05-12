import { useState, useEffect } from 'react';
import { X, Save, Edit2, Trash2, GripVertical } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import ConfirmDeleteButton from './ConfirmDeleteButton';

interface Item {
  id: string;
  name: string;
}

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  onDelete?: (id: string) => void;
  onEditItem?: (item: any) => void;
  onReorder?: (items: Item[]) => void;
  items?: Item[];
  title: string;
  label: string;
  placeholder: string;
  maxLength?: number;
  initialValue?: string;
  isEditing?: boolean;
}

export default function SimpleModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  onEditItem,
  onReorder,
  items = [],
  title,
  label,
  placeholder,
  maxLength = 30,
  initialValue = '',
  isEditing = false,
}: SimpleModalProps) {
  const [name, setName] = useState(initialValue);

  useEffect(() => {
    setName(initialValue);
  }, [initialValue, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim());
    if (!isEditing) setName('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                {isEditing ? `Sửa: ${initialValue}` : label} (Tối đa {maxLength} ký tự)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={maxLength}
                  required
                  autoFocus
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={placeholder}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-red text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-md flex items-center justify-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <span className={`text-xs ${name.length === maxLength ? 'text-red-500' : 'text-gray-400'}`}>
                  {name.length}/{maxLength}
                </span>
              </div>
            </div>
          </form>

          {/* List of items with Reorder */}
          {items.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Danh sách hiện có</h3>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Kéo để sắp xếp</span>
              </div>
              
              <Reorder.Group
                axis="y"
                values={items}
                onReorder={(newOrder) => onReorder?.(newOrder)}
                className="space-y-2"
              >
                {items.map((item) => (
                  <Reorder.Item
                    key={item.id}
                    value={item}
                    className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors shadow-sm cursor-grab active:cursor-grabbing"
                    whileDrag={{ 
                      scale: 1.02, 
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                      background: "white",
                      zIndex: 10
                    }}
                  >
                    <div className="flex items-center flex-1 min-w-0 mr-4">
                      <GripVertical className="w-4 h-4 text-gray-300 mr-2 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700 truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditItem?.(item);
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <ConfirmDeleteButton onDelete={() => onDelete?.(item.id)} />
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-all"
          >
            Đóng
          </button>
        </div>
      </motion.div>
    </div>
  );
}
