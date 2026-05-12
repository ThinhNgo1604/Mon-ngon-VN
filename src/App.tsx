import { useState, useEffect, useMemo } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  query, 
  orderBy,
  setDoc,
  getDocs,
  writeBatch,
  deleteField
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from './lib/firebase';
import { Store, Category, Area } from './types';
import { OperationType, handleFirestoreError } from './lib/utils';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StoreList from './components/StoreList';
import StoreModal from './components/StoreModal';
import SimpleModal from './components/SimpleModal';
import { UtensilsCrossed, Plus, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [isStoreModalOpen, setStoreModalOpen] = useState(false);
  const [isAreaModalOpen, setAreaModalOpen] = useState(false);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Auth Listener
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      console.log('Auth state changed:', u?.email);
      setUser(u);
    });
  }, []);

  // Connection Test
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { doc, getDocFromServer } = await import('firebase/firestore');
        await getDocFromServer(doc(db, 'test', 'connection'));
        console.log('Firebase connection successful');
      } catch (error: any) {
        if (error.message?.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        } else {
          console.error("Firebase connection error:", error);
        }
      }
    };
    testConnection();
  }, []);

  // Data Listeners
  useEffect(() => {
    const qStores = query(collection(db, 'stores'), orderBy('createdAt', 'desc'));
    const unsubscribeStores = onSnapshot(qStores, (snapshot) => {
      setStores(snapshot.docs.map(d => {
        const data = d.data();
        // Migrate legacy categoryId to categoryIds array
        const categoryIds = data.categoryIds || (data.categoryId ? [data.categoryId] : []);
        return { 
          id: d.id, 
          ...data,
          categoryIds 
        } as Store;
      }));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'stores'));

    const unsubscribeCats = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const cats = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Category));
      // Sắp xếp thủ công để hỗ trợ dữ liệu cũ chưa có trường 'order'
      setCategories(cats.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'categories'));

    const unsubscribeAreas = onSnapshot(collection(db, 'areas'), (snapshot) => {
      const ars = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Area));
      // Sắp xếp thủ công để hỗ trợ dữ liệu cũ chưa có trường 'order'
      setAreas(ars.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'areas'));

    return () => {
      unsubscribeStores();
      unsubscribeCats();
      unsubscribeAreas();
    };
  }, []);

  // Filtering Logic
  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           store.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesArea = selectedAreas.length === 0 || selectedAreas.includes(store.areaId);
      const matchesCategory = selectedCategories.length === 0 || 
                             store.categoryIds?.some(id => selectedCategories.includes(id));
      
      return matchesSearch && matchesArea && matchesCategory;
    });
  }, [stores, searchQuery, selectedAreas, selectedCategories]);

  // Toggle Selection Helpers
  const toggleArea = (id: string | null) => {
    if (id === null) {
      setSelectedAreas([]);
    } else {
      setSelectedAreas(prev => 
        prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
      );
    }
  };

  const toggleCategory = (id: string | null) => {
    if (id === null) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(prev => 
        prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
      );
    }
  };

  // CRUD Actions
  const handleSaveStore = async (data: Partial<Store>) => {
    if (!user) return;
    try {
      // Strip metadata fields that shouldn't be in the document payload
      const { id, createdAt, creatorId, updatedAt, categoryId, ...cleanData } = data as any;
      console.log('Saving store:', { cleanData, editingStoreId: editingStore?.id });
      
      if (editingStore) {
        await updateDoc(doc(db, 'stores', editingStore.id), {
          ...cleanData,
          updatedAt: serverTimestamp(),
          categoryId: deleteField(),
        });
      } else {
        await addDoc(collection(db, 'stores'), {
          ...cleanData,
          creatorId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      setStoreModalOpen(false);
      setEditingStore(null);
    } catch (err: any) {
      console.error('Save failed details:', err);
      if (err.message?.includes('permissions')) {
        alert('Lỗi phân quyền: Bạn không có quyền thực hiện thao tác này.');
      } else {
        alert('Không thể lưu thông tin. Vui lòng thử lại hoặc liên hệ admin.');
      }
      handleFirestoreError(err, OperationType.WRITE, 'stores');
    }
  };

  const handleDeleteStore = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'stores', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `stores/${id}`);
    }
  };

  const handleAddCategory = async (name: string) => {
    if (!editingCategory && categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      alert('Loại này đã tồn tại!');
      return;
    }
    try {
      if (editingCategory) {
        await updateDoc(doc(db, 'categories', editingCategory.id), {
          name,
        });
      } else {
        const nextOrder = categories.length > 0 
          ? Math.max(...categories.map(c => c.order)) + 1 
          : 0;
        await addDoc(collection(db, 'categories'), {
          name,
          order: nextOrder,
          createdAt: serverTimestamp(),
        });
      }
      setEditingCategory(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'categories');
    }
  };

  const handleAddArea = async (name: string) => {
    if (!editingArea && areas.some(a => a.name.toLowerCase() === name.toLowerCase())) {
      alert('Khu vực này đã tồn tại!');
      return;
    }
    try {
      if (editingArea) {
        await updateDoc(doc(db, 'areas', editingArea.id), {
          name,
        });
      } else {
        const nextOrder = areas.length > 0 
          ? Math.max(...areas.map(a => a.order)) + 1 
          : 0;
        await addDoc(collection(db, 'areas'), {
          name,
          order: nextOrder,
          createdAt: serverTimestamp(),
        });
      }
      setEditingArea(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'areas');
    }
  };

  const handleReorderCategories = async (newOrderItems: Category[]) => {
    // Optimistic update
    setCategories(newOrderItems);
    try {
      const batch = writeBatch(db);
      newOrderItems.forEach((item, index) => {
        const ref = doc(db, 'categories', item.id);
        batch.update(ref, { order: index });
      });
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'categories');
    }
  };

  const handleReorderAreas = async (newOrderItems: Area[]) => {
    // Optimistic update
    setAreas(newOrderItems);
    try {
      const batch = writeBatch(db);
      newOrderItems.forEach((item, index) => {
        const ref = doc(db, 'areas', item.id);
        batch.update(ref, { order: index });
      });
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'areas');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      setSelectedCategories(prev => prev.filter(c => c !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `categories/${id}`);
    }
  };

  const handleDeleteArea = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'areas', id));
      setSelectedAreas(prev => prev.filter(a => a !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `areas/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-warm-bg">
      <Header user={user} onSearch={setSearchQuery} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <Sidebar
            user={user}
            areas={areas}
            categories={categories}
            selectedAreas={selectedAreas}
            selectedCategories={selectedCategories}
            onSelectArea={toggleArea}
            onSelectCategory={toggleCategory}
            onAddArea={() => {
              setEditingArea(null);
              setAreaModalOpen(true);
            }}
            onAddCategory={() => {
              setEditingCategory(null);
              setCategoryModalOpen(true);
            }}
            onEditArea={(area) => {
              setEditingArea(area);
              setAreaModalOpen(true);
            }}
            onEditCategory={(cat) => {
              setEditingCategory(cat);
              setCategoryModalOpen(true);
            }}
            onDeleteArea={handleDeleteArea}
            onDeleteCategory={handleDeleteCategory}
          />

          {/* Main Content */}
          <motion.div layout className="flex-1 space-y-6">
            <motion.div layout className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <motion.div layout>
                <h2 className="text-3xl font-black text-gray-900 serif-display">
                  Khám phá món ngon
                </h2>
                <p className="text-gray-500 mt-1">Danh sách tinh hoa ẩm thực Việt Nam</p>
              </motion.div>
              
              {user && (
                <motion.button
                  layout
                  onClick={() => {
                    setEditingStore(null);
                    setStoreModalOpen(true);
                  }}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-2xl shadow-lg text-white bg-brand-red hover:bg-red-700 transition-all transform hover:scale-105 active:scale-95"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Thêm món mới
                </motion.button>
              )}
            </motion.div>

            <motion.div layout className="min-h-[400px]">
              <StoreList
                user={user}
                stores={filteredStores}
                categories={categories}
                areas={areas}
                onEdit={(s) => {
                  setEditingStore(s);
                  setStoreModalOpen(true);
                }}
                onDelete={handleDeleteStore}
              />
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Footer Decoration */}
      <footer className="py-12 text-center text-gray-400">
        <div className="flex justify-center mb-4">
          <ChefHat className="w-8 h-8 opacity-20" />
        </div>
        <p className="text-sm">© {new Date().getFullYear()} Món ngon ở Việt Nam. Ăn là mê, chê là không được!</p>
      </footer>

      {/* Modals */}
      <StoreModal
        isOpen={isStoreModalOpen}
        onClose={() => {
          setStoreModalOpen(false);
          setEditingStore(null);
        }}
        onSave={handleSaveStore}
        editData={editingStore}
        categories={categories}
        areas={areas}
        user={user}
      />

      <SimpleModal
        isOpen={isAreaModalOpen}
        onClose={() => {
          setAreaModalOpen(false);
          setEditingArea(null);
        }}
        onSave={handleAddArea}
        onDelete={handleDeleteArea}
        onEditItem={setEditingArea}
        onReorder={handleReorderAreas as any}
        items={areas}
        title={editingArea ? "Sửa khu vực" : "Quản lý khu vực"}
        label="Tên khu vực"
        placeholder="VD: Quận 1, Hà Nội..."
        maxLength={30}
        initialValue={editingArea?.name || ''}
        isEditing={!!editingArea}
      />

      <SimpleModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleAddCategory}
        onDelete={handleDeleteCategory}
        onEditItem={setEditingCategory}
        onReorder={handleReorderCategories as any}
        items={categories}
        title={editingCategory ? "Sửa loại món" : "Quản lý loại món ăn"}
        label="Tên loại"
        placeholder="VD: Phở, Bún chả..."
        maxLength={30}
        initialValue={editingCategory?.name || ''}
        isEditing={!!editingCategory}
      />
    </div>
  );
}
