import { useState } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { DashboardOverview } from './components/DashboardOverview';
import { ProductCatalog } from './components/ProductCatalog';
import { SoftwareServicesSection } from './components/SoftwareServicesSection';
import { FinancingSection } from './components/FinancingSection';
import { ServicePortal } from './components/ServicePortal';
import { ContactSection } from './components/ContactSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { PhoneCompareModal } from './components/PhoneCompareModal';
import { Toast } from './components/Toast';
import { PhoneProduct, FinancingPartnerId } from './types';
import { MessageSquare } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [catalogCategory, setCatalogCategory] = useState<string>('all');
  const [laptopCondition, setLaptopCondition] = useState<string>('all');
  const [selectedProductForModal, setSelectedProductForModal] = useState<PhoneProduct | null>(null);
  const [comparedProducts, setComparedProducts] = useState<PhoneProduct[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  const handleOpenWhatsApp = (customText?: string, phoneNumber?: string) => {
    const phone = phoneNumber || '254712124922';
    const text = customText || 'Hello Denlight IT Solutions, I want to inquire about products at Kariuki Chotara road shop, Naivasha.';
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  const handleNavigateTab = (tabId: string) => {
    if (tabId === 'smartphones') {
      setCatalogCategory('smartphones');
      setLaptopCondition('all');
      setActiveTab('catalog');
    } else if (tabId === 'laptops' || tabId === 'laptops-desktops') {
      setCatalogCategory('laptops-desktops');
      setLaptopCondition('all');
      setActiveTab('catalog');
    } else if (tabId === 'printers' || tabId === 'printers-toners') {
      setCatalogCategory('printers-toners');
      setLaptopCondition('all');
      setActiveTab('catalog');
    } else if (tabId === 'accessories' || tabId === 'oraimo-accessories') {
      setCatalogCategory('oraimo-accessories');
      setLaptopCondition('all');
      setActiveTab('catalog');
    } else if (tabId === 'cctv' || tabId === 'networking-cctv') {
      setCatalogCategory('networking-cctv');
      setLaptopCondition('all');
      setActiveTab('catalog');
    } else if (tabId === 'ex-uk') {
      setCatalogCategory('laptops-desktops');
      setLaptopCondition('ex-uk');
      setActiveTab('catalog');
    } else if (tabId === 'new-laptops') {
      setCatalogCategory('laptops-desktops');
      setLaptopCondition('new');
      setActiveTab('catalog');
    } else {
      setActiveTab(tabId);
    }
  };

  const handleToggleCompare = (product: PhoneProduct) => {
    const exists = comparedProducts.some((p) => p.id === product.id);
    if (exists) {
      setComparedProducts((prev) => prev.filter((p) => p.id !== product.id));
      setToastMessage(`Removed ${product.name} from comparison.`);
    } else {
      if (comparedProducts.length >= 3) {
        setToastMessage('You can compare up to 3 devices at a time.');
        return;
      }
      setComparedProducts((prev) => [...prev, product]);
      setToastMessage(`Added ${product.name} to comparison list.`);
    }
  };

  const handleSelectPartnerFromFinancing = (partnerId: FinancingPartnerId) => {
    setActiveTab('catalog');
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={handleNavigateTab}
      currentCatalogCategory={catalogCategory}
      compareCount={comparedProducts.length}
      onOpenCompareModal={() => setIsCompareModalOpen(true)}
      onOpenWhatsApp={handleOpenWhatsApp}
    >
      {/* View Switching */}
      {activeTab === 'overview' && (
        <DashboardOverview
          onNavigateTab={handleNavigateTab}
          onSelectProduct={(p) => setSelectedProductForModal(p)}
          onOpenWhatsApp={handleOpenWhatsApp}
        />
      )}

      {activeTab === 'catalog' && (
        <ProductCatalog
          initialCategory={catalogCategory}
          initialLaptopCondition={laptopCondition}
          onSelectProduct={(p) => setSelectedProductForModal(p)}
          onToggleCompare={handleToggleCompare}
          comparedProducts={comparedProducts}
          onOpenWhatsApp={handleOpenWhatsApp}
        />
      )}

      {activeTab === 'software-services' && (
        <SoftwareServicesSection
          onOpenWhatsApp={handleOpenWhatsApp}
        />
      )}

      {activeTab === 'financing' && (
        <FinancingSection
          onSelectPartner={handleSelectPartnerFromFinancing}
          onOpenWhatsApp={handleOpenWhatsApp}
        />
      )}

      {activeTab === 'services' && (
        <ServicePortal
          onOpenWhatsApp={handleOpenWhatsApp}
        />
      )}

      {activeTab === 'location' && (
        <ContactSection
          onOpenWhatsApp={handleOpenWhatsApp}
        />
      )}

      {/* Modals & Overlays */}
      <ProductDetailModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onOpenWhatsApp={handleOpenWhatsApp}
      />

      {isCompareModalOpen && (
        <PhoneCompareModal
          products={comparedProducts}
          onClose={() => setIsCompareModalOpen(false)}
          onRemove={(p) => handleToggleCompare(p)}
          onClearAll={() => setComparedProducts([])}
          onOpenWhatsApp={handleOpenWhatsApp}
        />
      )}

      {/* Floating WhatsApp Action Button */}
      <button
        onClick={() => handleOpenWhatsApp('Hello Denlight IT Solutions Naivasha, I need assistance.')}
        className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-full border border-blue-400/30 shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center group"
        title="Chat on WhatsApp"
        aria-label="WhatsApp Chat"
      >
        <MessageSquare className="w-5 h-5 text-white" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold tracking-wide pl-0 group-hover:pl-2">
          WhatsApp Naivasha
        </span>
      </button>

      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

    </DashboardLayout>
  );
}
