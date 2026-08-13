import React, { useState } from 'react';
import { DenlightLogo } from './DenlightLogo';
import { Footer } from './Footer';
import {
  LayoutDashboard,
  Smartphone,
  ShieldCheck,
  Wrench,
  MapPin,
  MessageSquare,
  Phone,
  Layers,
  Menu,
  X,
  ChevronRight,
  ArrowLeft,
  Laptop,
  Printer,
  BatteryCharging,
  Video,
  ShoppingBag,
  Search,
  User,
  Heart,
  Globe
} from 'lucide-react';

interface DashboardLayoutProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  currentCatalogCategory?: string;
  compareCount: number;
  onOpenCompareModal: () => void;
  onOpenWhatsApp: (text?: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeTab,
  setActiveTab,
  currentCatalogCategory = 'all',
  compareCount,
  onOpenCompareModal,
  onOpenWhatsApp,
  children
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { id: 'overview', label: 'Home' },
    { id: 'catalog', label: 'Shop Catalog' },
    { id: 'software-services', label: 'Software Services' },
    { id: 'financing', label: 'Lipa Mdogo' },
    { id: 'services', label: 'Tech Lab' },
    { id: 'location', label: 'Naivasha Store' }
  ];

  const categoryTabs = [
    { id: 'overview', label: 'Gadgets' },
    { id: 'smartphones', label: 'Smartphones' },
    { id: 'laptops', label: 'Laptops' },
    { id: 'printers', label: 'Printers & Inks' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'cctv', label: 'Smart CCTV' },
    { id: 'financing', label: 'Lipa Mdogo' },
    { id: 'software-services', label: 'Software Services' }
  ];

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCategoryActive = (catId: string) => {
    if (activeTab === catId) return true;
    if (activeTab === 'catalog') {
      if (catId === 'smartphones' && currentCatalogCategory === 'smartphones') return true;
      if (catId === 'laptops' && currentCatalogCategory === 'laptops-desktops') return true;
      if (catId === 'printers' && currentCatalogCategory === 'printers-toners') return true;
      if (catId === 'accessories' && currentCatalogCategory === 'oraimo-accessories') return true;
      if (catId === 'cctv' && currentCatalogCategory === 'networking-cctv') return true;
    }
    return false;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('catalog');
    }
  };

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Store Overview';
      case 'catalog':
        return 'Product & Accessories Catalog';
      case 'software-services':
        return 'Software & Digital Solutions';
      case 'financing':
        return 'Lipa Mdogo Mdogo Financing';
      case 'services':
        return 'Service Lab & Tech Repairs';
      case 'location':
        return 'Naivasha Store Location & Contact';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/80 flex flex-col antialiased selection:bg-red-600 selection:text-white font-sans text-slate-900">
      
      {/* Top Header Row matching TechVerse */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleTabChange('overview')}
              className="flex items-center gap-2 text-left focus:outline-none shrink-0 cursor-pointer"
            >
              <DenlightLogo variant="dark" size="md" />
            </button>
          </div>

          {/* Centered Wide Search Pill (Matching TechVerse image) */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-4 items-center relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for tech gadgets, HP laptops, printers, WATU phones..."
              className="w-full bg-slate-100/90 focus:bg-white text-slate-900 placeholder:text-slate-400 text-xs font-medium pl-5 pr-12 py-2.5 rounded-full border border-transparent focus:border-slate-300 focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Search store"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Right Links & Actions */}
          <div className="flex items-center gap-5 shrink-0 text-xs font-semibold">
            
            {/* Nav Menu Links */}
            <nav className="hidden lg:flex items-center gap-6">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`transition-colors cursor-pointer ${
                      isActive ? 'text-red-600 font-bold' : 'text-slate-700 hover:text-red-600'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="h-4 w-px bg-slate-200 hidden lg:block" />

            {/* Compare Counter */}
            {compareCount > 0 && (
              <button
                onClick={onOpenCompareModal}
                className="flex items-center gap-1.5 text-slate-700 hover:text-red-600 transition-colors cursor-pointer"
                title="Compare Products"
              >
                <Layers className="w-4 h-4 text-red-600" />
                <span className="hidden sm:inline">Compare</span>
                <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {compareCount}
                </span>
              </button>
            )}

            {/* Direct WhatsApp Callout */}
            <button
              onClick={() => onOpenWhatsApp('Hello Denlight IT Solutions, I want to inquire about products in Naivasha.')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-full text-xs transition-all shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Naivasha Shop</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-red-600" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Category Horizontal Bar with RED Bottom Underline Active State (Matching TechVerse Header Row 2) */}
        <div className="border-t border-slate-100 bg-white px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
            
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
              {categoryTabs.map((cat) => {
                const isActive = isCategoryActive(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleTabChange(cat.id)}
                    className={`py-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                      isActive
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-slate-700 hover:text-red-600'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <div className="hidden sm:flex items-center gap-3 text-[11px] font-medium text-slate-500 shrink-0">
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-slate-400" />
                <span>Naivasha CBD</span>
              </span>
              <span>•</span>
              <span className="text-slate-800 font-semibold">Store Visit & Lipa Mdogo Plans</span>
            </div>

          </div>
        </div>

      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex flex-col">
          <div className="bg-white text-slate-900 p-4 border-b border-slate-200 flex items-center justify-between">
            <DenlightLogo variant="dark" size="sm" />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-slate-100 text-slate-900 cursor-pointer"
            >
              <X className="w-6 h-6 text-red-600" />
            </button>
          </div>

          <div className="bg-white flex-1 overflow-y-auto p-5 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Store Menu
              </span>
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 opacity-60" />
                  </button>
                );
              })}
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenWhatsApp('Hello Denlight IT Solutions, I need assistance in Naivasha.');
                }}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-2xl text-xs transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-white" />
                <span>Chat on WhatsApp</span>
              </button>

              <a
                href="tel:+254712124922"
                className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 py-3 rounded-2xl text-xs font-semibold border border-slate-200"
              >
                <Phone className="w-4 h-4 text-red-600" />
                <span>Call Sales (+254 712 124 922)</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Canvas View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Breadcrumb Bar when inside sub-tabs */}
        {activeTab !== 'overview' && (
          <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-xs">
            <button
              onClick={() => handleTabChange('overview')}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-red-600 text-white font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-red-500 group-hover:text-white transition-transform group-hover:-translate-x-1" />
              <span>Back to Store Overview</span>
            </button>

            <div className="flex items-center gap-2 text-slate-500 hidden sm:flex">
              <span>Store</span>
              <span>/</span>
              <span className="text-slate-900 font-bold">{getBreadcrumbTitle()}</span>
            </div>
          </div>
        )}

        {children}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tabId) => handleTabChange(tabId)}
        onOpenWhatsApp={onOpenWhatsApp}
      />

    </div>
  );
};

