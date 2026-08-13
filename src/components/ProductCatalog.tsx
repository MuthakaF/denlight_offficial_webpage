import React, { useState, useMemo, useEffect } from 'react';
import { PHONE_PRODUCTS } from '../data/phones';
import { PhoneProduct, CatalogFilterState } from '../types';
import { getProductImageUrl, hasCustomProductImage } from '../utils/imageStorage';
import { DeviceGraphic } from './DeviceGraphic';
import { Search, Smartphone, Eye, Layers, Headphones, Cable, Video, Sparkles, MessageSquare, CheckCircle2, Camera, Image, ShieldCheck, Laptop, Printer } from 'lucide-react';

interface ProductCatalogProps {
  initialCategory?: string;
  initialLaptopCondition?: string;
  onSelectProduct: (product: PhoneProduct) => void;
  onToggleCompare: (product: PhoneProduct) => void;
  comparedProducts: PhoneProduct[];
  onOpenWhatsApp: (text?: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  initialCategory = 'all',
  initialLaptopCondition = 'all',
  onSelectProduct,
  onToggleCompare,
  comparedProducts,
  onOpenWhatsApp
}) => {
  const [filters, setFilters] = useState<CatalogFilterState>({
    search: '',
    category: initialCategory,
    brand: 'all',
    partner: 'all',
    laptopCondition: initialLaptopCondition
  });

  useEffect(() => {
    if (initialCategory) {
      setFilters((prev) => ({
        ...prev,
        category: initialCategory,
        laptopCondition: initialLaptopCondition || 'all'
      }));
    }
  }, [initialCategory, initialLaptopCondition]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [displayType, setDisplayType] = useState<'vector' | 'photo'>('photo');
  const [, setRefreshCount] = useState(0);

  // Listen to custom image update events from imageStorage
  useEffect(() => {
    const handleCustomImageUpdate = () => {
      setRefreshCount((prev) => prev + 1);
    };
    window.addEventListener('custom-images-updated', handleCustomImageUpdate);
    return () => {
      window.removeEventListener('custom-images-updated', handleCustomImageUpdate);
    };
  }, []);

  const categories = [
    { id: 'all', label: 'All Products', icon: Sparkles },
    { id: 'smartphones', label: 'Smartphones', icon: Smartphone },
    { id: 'laptops-desktops', label: 'Laptops', icon: Laptop },
    { id: 'printers-toners', label: 'Printers & Inks', icon: Printer },
    { id: 'oraimo-accessories', label: 'Accessories', icon: Headphones },
    { id: 'networking-cctv', label: 'Smart CCTV', icon: Video }
  ];

  const brands = useMemo(() => {
    const set = new Set<string>();
    PHONE_PRODUCTS.forEach((p) => {
      if (filters.category === 'all' || p.category === filters.category) {
        set.add(p.brand);
      }
    });
    return ['all', ...Array.from(set)];
  }, [filters.category]);

  const filteredProducts = useMemo(() => {
    return PHONE_PRODUCTS.filter((product) => {
      // Category filter
      const matchesCategory = filters.category === 'all' || product.category === filters.category;

      // Laptop condition subcategory
      const matchesLaptopCondition =
        filters.category !== 'laptops-desktops' ||
        filters.laptopCondition === 'all' ||
        product.laptopCondition === filters.laptopCondition;

      // Search
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        filters.search === '' ||
        product.name.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        Object.values(product.specs).some((val) => val.toLowerCase().includes(searchLower));

      // Brand
      const matchesBrand = filters.brand === 'all' || product.brand === filters.brand;

      // Partner
      const matchesPartner =
        filters.partner === 'all' ||
        (product.availablePartners && product.availablePartners.includes(filters.partner as any));

      return matchesCategory && matchesLaptopCondition && matchesSearch && matchesBrand && matchesPartner;
    });
  }, [filters]);

  const isCompared = (id: string) => comparedProducts.some((p) => p.id === id);

  return (
    <section id="catalog" className="bg-white border border-zinc-200 rounded-3xl p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-900 text-xs font-semibold uppercase tracking-widest mb-3 font-mono">
              <Smartphone className="w-4 h-4 text-red-600" />
              <span>Naivasha Store • Kariuki Chotara Road</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight font-display">
              DYNAMIC PRODUCT & ACCESSORIES CATALOG.
            </h2>
            <p className="text-zinc-600 text-sm mt-2 max-w-2xl leading-relaxed">
              Explore 100% genuine Android phones, Oraimo airpods, Floating Ark power banks, HP keyboards/mice, cables, CCTV cameras, and Wi-Fi routers. Deposit terms set directly by <strong className="text-zinc-900 font-semibold">WATU Simu</strong> (Samsung A07 exclusive), <strong className="text-zinc-900 font-semibold">OnFon Mobile</strong>, and <strong className="text-zinc-900 font-semibold">MOGO Kenya</strong> (MOGO is strictly for Tecno, Infinix, Itel, & Oppo).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-500">
              Showing <strong className="text-black font-bold">{filteredProducts.length}</strong> Items
            </span>
            <div className="bg-zinc-100 border border-zinc-300 rounded-lg p-1 flex items-center">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-colors ${
                  viewMode === 'grid' ? 'bg-zinc-950 text-white border border-red-500/50 font-bold' : 'text-zinc-600 hover:text-black'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-colors ${
                  viewMode === 'list' ? 'bg-zinc-950 text-white border border-red-500/50 font-bold' : 'text-zinc-600 hover:text-black'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scroll-smooth scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={(e) => {
                  setFilters((prev) => ({ ...prev, category: cat.id, brand: 'all' }));
                  e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-zinc-950 text-white shadow-sm font-bold border-l-4 border-red-600'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-red-500' : 'text-zinc-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Laptop Subcategory Selection Bar */}
        {filters.category === 'laptops-desktops' && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-2xl flex flex-wrap items-center gap-2 animate-in fade-in duration-200">
            <span className="text-xs font-mono font-bold text-zinc-900 uppercase mr-2 flex items-center gap-1.5">
              <Laptop className="w-4 h-4 text-red-600" />
              <span>Laptop Categories:</span>
            </span>

            <button
              onClick={() => setFilters((prev) => ({ ...prev, laptopCondition: 'all' }))}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filters.laptopCondition === 'all'
                  ? 'bg-zinc-950 text-red-400 shadow-xs border border-red-500/50'
                  : 'bg-white text-zinc-800 hover:bg-zinc-100 border border-zinc-300'
              }`}
            >
              All Laptops
            </button>

            <button
              onClick={() => setFilters((prev) => ({ ...prev, laptopCondition: 'ex-uk' }))}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filters.laptopCondition === 'ex-uk'
                  ? 'bg-zinc-950 text-red-400 shadow-xs border border-red-500/50'
                  : 'bg-white text-zinc-800 hover:bg-zinc-100 border border-zinc-300'
              }`}
            >
              ex-uk (refurbished)
            </button>

            <button
              onClick={() => setFilters((prev) => ({ ...prev, laptopCondition: 'new' }))}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filters.laptopCondition === 'new'
                  ? 'bg-zinc-950 text-red-400 shadow-xs border border-red-500/50'
                  : 'bg-white text-zinc-800 hover:bg-zinc-100 border border-zinc-300'
              }`}
            >
              new devices
            </button>
          </div>
        )}

        {/* Search & Brand Filter Bar */}
        <div className="mt-4 bg-zinc-50 border border-zinc-200 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
            
            {/* Search Input */}
            <div className="lg:col-span-6 relative">
              <Search className="w-4 h-4 text-red-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Samsung, Tecno, Oraimo, Airpods, HDMI, CCTV, Router..."
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/30 transition-colors font-sans"
              />
            </div>

            {/* Brand Dropdown */}
            <div className="lg:col-span-3">
              <select
                value={filters.brand}
                onChange={(e) => setFilters((prev) => ({ ...prev, brand: e.target.value }))}
                className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-red-600 font-mono cursor-pointer"
              >
                <option value="all">All Brands in {filters.category === 'all' ? 'Store' : filters.category}</option>
                {brands.filter((b) => b !== 'all').map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Partner Filter */}
            <div className="lg:col-span-3">
              <select
                value={filters.partner}
                onChange={(e) => setFilters((prev) => ({ ...prev, partner: e.target.value }))}
                className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-red-600 font-mono cursor-pointer"
              >
                <option value="all">All Financing Options</option>
                <option value="watu">WATU Simu (Samsung A07 Exclusive)</option>
                <option value="onfon">OnFon Mobile (Tecno, Infinix, Itel, ZTE, Xiaomi, Oppo)</option>
                <option value="mogo">MOGO Kenya (Oppo, Tecno, Infinix, Itel ONLY)</option>
              </select>
            </div>

          </div>

          {/* Quick Brand Pills & Display Mode Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-200 text-xs font-mono uppercase">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-zinc-400 font-bold mr-1">Brands:</span>
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setFilters((prev) => ({ ...prev, brand }))}
                  className={`px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                    filters.brand === brand
                      ? 'bg-red-600 text-white font-bold'
                      : 'bg-white text-zinc-700 hover:bg-zinc-200 border border-zinc-300'
                  }`}
                >
                  {brand === 'all' ? 'All Brands' : brand}
                </button>
              ))}
            </div>

            {/* Display Mode Switcher */}
            <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-300">
              <button
                onClick={() => setDisplayType('vector')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  displayType === 'vector'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-black'
                }`}
                title="Vector Device Specs View"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Vector HUD</span>
              </button>
              <button
                onClick={() => setDisplayType('photo')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  displayType === 'photo'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-black'
                }`}
                title="Stock Photo View"
              >
                <Image className="w-3.5 h-3.5" />
                <span>Photo View</span>
              </button>
            </div>
          </div>

        </div>

        {/* Product Cards Grid / List */}
        {filteredProducts.length === 0 ? (
          <div className="mt-12 p-12 text-center rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4">
            <Smartphone className="w-12 h-12 text-zinc-400 mx-auto" />
            <h3 className="text-lg font-bold text-black uppercase tracking-wider font-display">No Products Found</h3>
            <p className="text-zinc-500 text-xs max-w-md mx-auto">
              We carry extensive tech inventory at our shop on Kariuki Chotara road, next to Naivas ndogo. Try adjusting your search query.
            </p>
            <button
              onClick={() =>
                setFilters({
                  search: '',
                  category: 'all',
                  brand: 'all',
                  partner: 'all'
                })
              }
              className="bg-black text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-mono"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {filteredProducts.map((product) => {
              const compared = isCompared(product.id);
              const isSmartphone = product.category === 'smartphones';
              const partners = product.availablePartners || [];
              const displayImageUrl = getProductImageUrl(product.id, product.imageUrl);
              const userHasCustomImage = hasCustomProductImage(product.id);
              const showVectorGraphic = displayType === 'vector' && !userHasCustomImage;

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-zinc-200 hover:border-red-500/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm"
                >
                  <div>
                    {/* Top Image & Badges */}
                    <div className={`relative aspect-[4/3] ${showVectorGraphic ? 'bg-zinc-950' : 'bg-zinc-50'} border-b border-zinc-200 flex items-center justify-center overflow-hidden`}>
                      {showVectorGraphic ? (
                        <DeviceGraphic product={product} />
                      ) : (
                        <img
                          src={displayImageUrl}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        />
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                        {product.badge && (
                          <span className="bg-red-600 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                            {product.badge}
                          </span>
                        )}
                        <span className="bg-white/90 text-zinc-800 border border-zinc-300 text-[10px] font-mono px-2 py-0.5 rounded font-semibold">
                          {product.brand}
                        </span>
                      </div>

                      {/* Compare Checkbox Toggle for smartphones */}
                      {isSmartphone && (
                        <button
                          onClick={() => onToggleCompare(product)}
                          className={`absolute top-3 right-3 p-1.5 rounded border transition-all text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer ${
                            compared
                              ? 'bg-red-600 text-white border-red-600'
                              : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100'
                          }`}
                          title="Compare Specifications"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          {compared ? 'Compared' : 'Compare'}
                        </button>
                      )}

                      {/* Bottom Availability Pill */}
                      <div className="absolute bottom-2 left-3 flex items-center justify-between text-[10px] font-mono text-zinc-600 bg-white/95 px-2.5 py-1 rounded border border-zinc-200">
                        <span className="text-black font-bold uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-red-600" />
                          In Stock
                        </span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="text-base font-black text-zinc-950 group-hover:underline leading-snug font-display">
                          {product.name}
                        </h3>
                        <p className="text-xs text-zinc-600 mt-1 leading-relaxed line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      {/* Price Row */}
                      <div className="flex items-center justify-between text-xs font-mono pt-1">
                        <span className="text-zinc-500 font-semibold">Price:</span>
                        {product.priceKsh ? (
                          <span className="text-sm font-black text-zinc-950">
                            Ksh {product.priceKsh.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                            Contact Store for Price
                          </span>
                        )}
                      </div>

                      {/* Key Specs Breakdown List */}
                      <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 space-y-1.5 text-[11px] font-mono">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                          Technical Specifications:
                        </span>
                        {Object.entries(product.specs).slice(0, 4).map(([key, val]) => (
                          <div key={key} className="flex justify-between gap-2 border-b border-zinc-200/60 pb-1 last:border-0 last:pb-0">
                            <span className="text-zinc-500 truncate">{key}:</span>
                            <strong className="text-zinc-900 font-bold truncate text-right">{val}</strong>
                          </div>
                        ))}
                      </div>

                      {/* Partner Tags for Smartphones */}
                      {isSmartphone && (
                        <div className="p-3 rounded-xl bg-zinc-950 text-white space-y-1.5 text-[11px] font-mono border border-zinc-800">
                          <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                            Deposit Partners Accepted:
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {partners.includes('watu') && (
                              <span className="bg-red-600 text-white px-2 py-0.5 rounded font-bold text-[10px]">WATU SIMU</span>
                            )}
                            {partners.includes('onfon') && (
                              <span className="bg-zinc-800 text-white px-2 py-0.5 rounded font-bold text-[10px] border border-zinc-700">ONFON</span>
                            )}
                            {partners.includes('mogo') && (
                              <span className="bg-zinc-800 text-red-400 px-2 py-0.5 rounded font-bold text-[10px] border border-zinc-700">MOGO</span>
                            )}
                            {partners.length === 0 && (
                              <span className="bg-zinc-700 text-white px-2 py-0.5 rounded font-bold text-[10px]">CASH PURCHASE ONLY</span>
                            )}
                          </div>
                          <div className="text-[10px] text-zinc-400 italic">
                            * Inquire at Kariuki Chotara road shop for exact deposit
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-5 pt-0 grid grid-cols-2 gap-2 font-mono">
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="flex items-center justify-center gap-1.5 bg-white hover:bg-zinc-100 text-zinc-900 font-bold py-2.5 rounded-xl text-xs border border-zinc-300 transition-colors uppercase tracking-wider cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-zinc-900" />
                      Full Specs
                    </button>

                    <button
                      onClick={() =>
                        onOpenWhatsApp(
                          `Hello Denlight IT Solutions, I want to inquire about availability and specs for ${product.name} at your shop on Kariuki Chotara road, Naivasha.`
                        )
                      }
                      className="flex items-center justify-center gap-1.5 bg-zinc-950 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl text-xs transition-all uppercase tracking-wider border border-zinc-800 hover:border-red-500 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-red-400 group-hover:text-white" />
                      Inquire
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4 mt-8">
            {filteredProducts.map((product) => {
              const displayImageUrl = getProductImageUrl(product.id, product.imageUrl);
              return (
                <div
                  key={product.id}
                  className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-red-500/60 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4 w-full md:w-2/3">
                    <div className="relative shrink-0">
                      <img
                        src={displayImageUrl}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 object-contain bg-zinc-50 p-2 rounded-xl border border-zinc-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-red-600 text-white">
                          {product.brand}
                        </span>
                        <h3 className="text-base font-black text-black font-display">{product.name}</h3>
                      </div>
                      <p className="text-xs text-zinc-600 line-clamp-1">{product.description}</p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono pt-1">
                        {product.priceKsh ? (
                          <span className="text-sm font-black text-zinc-950">
                            Ksh {product.priceKsh.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                            Contact Store for Price
                          </span>
                        )}
                        {Object.entries(product.specs).slice(0, 3).map(([k, v]) => (
                          <span key={k} className="bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200 text-zinc-600">
                            {k}: <strong className="text-black">{v}</strong>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-zinc-200 font-mono">
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="px-4 py-2.5 bg-white hover:bg-zinc-100 text-black text-xs font-bold uppercase tracking-wider border border-zinc-300 rounded-xl cursor-pointer"
                    >
                      View Specs
                    </button>
                    <button
                      onClick={() =>
                        onOpenWhatsApp(
                          `Hello Denlight, I want to inquire about ${product.name} at your Kariuki Chotara road shop.`
                        )
                      }
                      className="px-4 py-2.5 bg-zinc-950 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all border border-zinc-800 hover:border-red-500 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-red-400 group-hover:text-white" />
                      Inquire
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
