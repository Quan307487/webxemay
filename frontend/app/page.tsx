'use client';
import { useState, useEffect, useRef } from 'react';
import { productsApi, categoriesApi, brandsApi } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Zap, Shield, Truck, HeadphonesIcon, Award, Star, ArrowRight, ChevronRight, Flame, Sparkles, Clock } from 'lucide-react';
import { ProductsGridSkeleton } from '@/components/Skeleton';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function HomePage() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [newProducts, setNewProducts] = useState<any[]>([]);
  const [discounted, setDiscounted] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      productsApi.getAll({ limit: 8, active: '1', sort: 'diem_danh_gia' }),
      productsApi.getAll({ limit: 8, active: '1', sort: 'ngay_lap' }),
      productsApi.getAll({ limit: 4, active: '1', has_discount: '1' }),
      categoriesApi.getAll(true),
      brandsApi.getAll(true),
    ]).then(([feat, newP, disc, cats, brs]) => {
      setFeatured(feat.data.data || []);
      setNewProducts(newP.data.data || []);
      setDiscounted(disc.data.data || []);
      setCategories(cats.data || []);
      setBrands(brs.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const catConfig: Record<string, { icon: string; color: string; gradient: string }> = {
    xe_so: { icon: '🏍', color: '#f59e0b', gradient: 'rgba(245,158,11,0.1)' },
    xe_ga: { icon: '🛵', color: '#3b82f6', gradient: 'rgba(59,130,246,0.1)' },
    xe_con_tay: { icon: '🏁', color: '#8b5cf6', gradient: 'rgba(139,92,246,0.1)' },
    xe_dien: { icon: '⚡', color: '#10b981', gradient: 'rgba(16,185,129,0.1)' },
    phan_khoi_lon: { icon: '🔥', color: '#ef4444', gradient: 'rgba(239,68,68,0.1)' },
  };

  const uspItems = [
    { icon: <Truck size={26} />, title: 'Giao hàng toàn quốc', desc: 'Miễn phí vận chuyển cho đơn trên 50 triệu đồng', color: '#3b82f6' },
    { icon: <Shield size={26} />, title: 'Bảo hành chính hãng', desc: 'Đầy đủ giấy tờ, hỗ trợ bảo hành tận nhà', color: '#10b981' },
    { icon: <Award size={26} />, title: '100% chính hãng', desc: 'Tất cả xe đều có giấy tờ xuất xứ rõ ràng', color: '#f59e0b' },
    { icon: <HeadphonesIcon size={26} />, title: 'Hỗ trợ 24/7', desc: 'Tư vấn miễn phí, sẵn sàng giải đáp mọi thắc mắc', color: '#8b5cf6' },
  ];

  const stats = [
    { value: '200+', label: 'Mẫu xe', suffix: '' },
    { value: '50K+', label: 'Khách hàng', suffix: '' },
    { value: '4.9', label: 'Đánh giá', suffix: '★' },
    { value: '100%', label: 'Chính hãng', suffix: '' },
  ];

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '68px' }}>

        {/* ═══════════════════════════════
            HERO SECTION (SLIDER)
        ═══════════════════════════════ */}
        <section className="hero-section" ref={heroRef} style={{ padding: 0, minHeight: 'auto', height: 'calc(100vh - 68px)', maxHeight: '800px' }}>
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true, renderBullet: (index, className) => `<span class="${className}" style="width: 12px; height: 12px; margin: 0 6px; border: 2px solid rgba(255,255,255,0.8); background: transparent; border-radius: 50%; opacity: 1; transition: all 0.3s;"></span>` }}
            style={{ width: '100%', height: '100%' }}
          >
            <style jsx global>{`
              .swiper-pagination-bullet-active {
                background: white !important;
                transform: scale(1.2);
              }
            `}</style>

            {/* Silde 1: Thể thao */}
            <SwiperSlide>
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <img src="/hero-slider/banner1.png" alt="MotoShop Collection 2025" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(6,11,24,0.9) 0%, rgba(6,11,24,0.4) 50%, transparent 100%)' }} />

                <div style={{ position: 'absolute', top: '50%', left: '10%', transform: 'translateY(-50%)', maxWidth: '600px', zIndex: 10 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(230,57,70,0.12)', border: '1px solid rgba(230,57,70,0.25)', borderRadius: '40px', padding: '8px 16px', marginBottom: '28px' }}>
                    <Sparkles size={14} color="#f87171" />
                    <span style={{ color: '#f87171', fontSize: '13px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Bộ sưu tập 2025</span>
                  </div>

                  <h1 style={{ fontSize: 'clamp(42px, 5.5vw, 76px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: '24px', fontFamily: 'Outfit, sans-serif', color: 'white' }}>
                    Khám phá<br />
                    <span className="gradient-text">Xe Máy Đỉnh</span><br />
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>Chất lượng cao</span>
                  </h1>

                  <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '40px', lineHeight: 1.8 }}>
                    Hơn <strong style={{ color: 'white' }}>200+ mẫu xe máy</strong> chính hãng Honda, Yamaha, VinFast, Piaggio. Giá tốt nhất thị trường, giao hàng toàn quốc tận tay.
                  </p>

                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    <Link href="/products">
                      <button className="btn-primary" style={{ padding: '16px 32px', fontSize: '16px', borderRadius: '16px', gap: '10px' }}>
                        🏍 Xem tất cả xe <ArrowRight size={18} />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            {/* Slide 2: Xe Điện */}
            <SwiperSlide>
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <img src="/hero-slider/banner2.png" alt="Xe điện thông minh" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(6,11,24,0.9) 0%, rgba(6,11,24,0.4) 50%, transparent 100%)' }} />

                <div style={{ position: 'absolute', top: '50%', left: '10%', transform: 'translateY(-50%)', maxWidth: '600px', zIndex: 10 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '40px', padding: '8px 16px', marginBottom: '28px' }}>
                    <Zap size={14} color="#4ade80" />
                    <span style={{ color: '#4ade80', fontSize: '13px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Tương lai di chuyển</span>
                  </div>

                  <h1 style={{ fontSize: 'clamp(42px, 5.5vw, 76px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: '24px', fontFamily: 'Outfit, sans-serif', color: 'white' }}>
                    Kỷ nguyên mới<br />
                    <span style={{ background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Xe Điện Xanh</span>
                  </h1>

                  <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '40px', lineHeight: 1.8 }}>
                    Lái thông minh, thảnh thơi tận hưởng. Trải nghiệm ngay các dòng xe điện cao cấp với phạm vi hoạt động ấn tượng lên tới 150km/sạc.
                  </p>

                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    <Link href="/products?kieu_xe=xe_dien">
                      <button className="btn-primary" style={{ padding: '16px 32px', fontSize: '16px', borderRadius: '16px', gap: '10px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                        ⚡ Khám phá ngay <ArrowRight size={18} />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </section>


        {/* ═══════════════════════════════
            USP SECTION
        ═══════════════════════════════ */}
        <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {uspItems.map((usp, i) => (
              <div key={i} className="usp-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="usp-icon-wrap" style={{ background: `rgba(${usp.color === '#3b82f6' ? '59,130,246' : usp.color === '#10b981' ? '16,185,129' : usp.color === '#f59e0b' ? '245,158,11' : '139,92,246'},0.12)`, borderColor: `${usp.color}30`, color: usp.color }}>
                  {usp.icon}
                </div>
                <h3 style={{ fontWeight: 800, fontSize: '16px', marginBottom: '10px', fontFamily: 'Outfit, sans-serif' }}>{usp.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7 }}>{usp.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════
            DANH MỤC XE
        ═══════════════════════════════ */}
        {categories.length > 0 && (
          <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px 80px' }}>
            <div className="section-header">
              <div>
                <div className="section-eyebrow">
                  <Zap size={12} /> Danh mục
                </div>
                <h2 className="section-title">Tìm xe theo loại</h2>
                <p className="section-subtitle">Lựa chọn theo kiểu xe phù hợp với bạn</p>
              </div>
              <Link href="/products" style={{ textDecoration: 'none' }}>
                <button className="btn-secondary" style={{ gap: '6px' }}>Xem tất cả <ChevronRight size={16} /></button>
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '16px' }}>
              {categories.map((cat: any) => {
                const key = cat.ten_danhmuc?.toLowerCase().replace(/\s+/g, '_').replace('côn', 'con');
                const cfg = catConfig[key] || catConfig['xe_so'];
                return (
                  <Link key={cat.ma_danhmuc} href={`/products?ma_danhmuc=${cat.ma_danhmuc}`} style={{ textDecoration: 'none' }}>
                    <div className="cat-card" style={{ background: `linear-gradient(160deg, ${cfg.gradient} 0%, rgba(13,21,38,0.9) 100%)` }}>
                      <span className="cat-emoji">{cfg.icon}</span>
                      <p style={{ fontWeight: 700, fontSize: '15px', color: 'white', marginBottom: '4px' }}>{cat.ten_danhmuc}</p>
                      {cat.so_san_pham > 0 && (
                        <p style={{ fontSize: '12px', color: cfg.color, fontWeight: 600 }}>{cat.so_san_pham} mẫu xe</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════
            TOP SẢN PHẨM
        ═══════════════════════════════ */}
        <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px 80px' }}>
          <div className="section-header">
            <div>
              <div className="section-eyebrow">
                <Star size={12} fill="currentColor" /> Đánh giá cao
              </div>
              <h2 className="section-title">Xe được yêu thích nhất</h2>
              <p className="section-subtitle">Lựa chọn hàng đầu của hơn 50.000 khách hàng</p>
            </div>
            <Link href="/products?sort=diem_danh_gia" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary" style={{ gap: '6px' }}>Xem tất cả <ChevronRight size={16} /></button>
            </Link>
          </div>
          {loading ? <ProductsGridSkeleton count={8} /> : (
            <div className="products-grid">
              {featured.map((p: any) => <ProductCard key={p.ma_sanpham} product={p} />)}
            </div>
          )}
        </section>

        {/* ═══════════════════════════════
            SALE BANNER
        ═══════════════════════════════ */}
        {(!loading && discounted.length > 0) && (
          <section id="khuyen-mai" className="sale-banner" style={{ padding: '80px 0' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>
              <div className="section-header">
                <div>
                  <div className="section-eyebrow" style={{ background: 'rgba(230,57,70,0.15)', borderColor: 'rgba(230,57,70,0.3)' }}>
                    <Flame size={12} /> Ưu đãi hôm nay
                  </div>
                  <h2 className="section-title">Xe đang giảm giá</h2>
                  <p className="section-subtitle">Đừng bỏ lỡ những deal hấp dẫn — Số lượng có hạn!</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.2)', borderRadius: '12px', padding: '10px 16px' }}>
                    <Clock size={16} color="#f87171" />
                    <span style={{ color: '#f87171', fontWeight: 700, fontSize: '14px' }}>Ưu đãi có hạn</span>
                  </div>
                  <Link href="/products" style={{ textDecoration: 'none' }}>
                    <button className="btn-secondary" style={{ gap: '6px' }}>Xem tất cả <ChevronRight size={16} /></button>
                  </Link>
                </div>
              </div>
              <div className="products-grid">
                {discounted.map((p: any) => <ProductCard key={p.ma_sanpham} product={p} />)}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════
            XE MỚI VỀ
        ═══════════════════════════════ */}
        <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 32px' }}>
          <div className="section-header">
            <div>
              <div className="section-eyebrow" style={{ background: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.2)', color: '#60a5fa' }}>
                <Zap size={12} /> Mới nhất
              </div>
              <h2 className="section-title">Xe mới cập nhật</h2>
              <p className="section-subtitle">Những mẫu xe mới nhất vừa về kho, cập nhật hàng tuần</p>
            </div>
            <Link href="/products" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary" style={{ gap: '6px' }}>Xem tất cả <ChevronRight size={16} /></button>
            </Link>
          </div>
          {loading ? <ProductsGridSkeleton count={8} /> : (
            <div className="products-grid">
              {newProducts.map((p: any) => <ProductCard key={p.ma_sanpham} product={p} />)}
            </div>
          )}
        </section>

        {/* ═══════════════════════════════
            GIỚI THIỆU SECTION
        ═══════════════════════════════ */}
        <section id="gioi-thieu" style={{ padding: '100px 32px' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: '60px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100px', height: '100px', background: 'rgba(230,57,70,0.1)', filter: 'blur(40px)', zIndex: 0 }} />
              <img src="/showroom.png" alt="MotoShop Showroom" style={{ width: '100%', borderRadius: '32px', boxShadow: '0 32px 64px rgba(0,0,0,0.4)', position: 'relative', zIndex: 1, border: '1px solid rgba(255,255,255,0.08)' }} />
              <div style={{ position: 'absolute', bottom: '30px', right: '-40px', background: 'rgba(13,21,38,0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '24px', maxWidth: '240px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', zIndex: 2 }} className="animate-float">
                <div style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '32px', fontFamily: 'Outfit, sans-serif' }}>10+</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600 }}>Năm kinh nghiệm trong ngành xe máy</p>
              </div>
            </div>
            <div>
              <div className="section-eyebrow">
                <Shield size={12} /> Về chúng tôi
              </div>
              <h2 className="section-title" style={{ fontSize: 'clamp(28px, 4vw, 48px)', marginBottom: '24px' }}>Chào mừng đến với <span className="gradient-text">MotoShop</span></h2>
              <p style={{ fontSize: '17px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' }}>
                Hệ thống showroom xe máy hàng đầu Việt Nam, nơi hội tụ những dòng xe mới nhất, từ xe số bình dân, xe ga sang trọng đến các dòng phân khối lớn và xe điện bền bỉ.
              </p>
              <p style={{ fontSize: '17px', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '32px' }}>
                Chúng tôi không chỉ bán xe, chúng tôi mang lại giải pháp di chuyển tối ưu cùng dịch vụ hậu mãi chuẩn 5 sao. Mỗi chiếc xe tại MotoShop đều được kiểm định khắt khe trước khi bàn giao.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', flexShrink: 0 }}>
                    <Zap size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 800, color: 'white', marginBottom: '4px' }}>Tốc độ</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Thủ trợ trả góp & đăng ký biển số siêu tốc.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', flexShrink: 0 }}>
                    <Award size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 800, color: 'white', marginBottom: '4px' }}>Uy tín</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Cam kết 100% linh kiện & xe chính hãng.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ═══════════════════════════════
            THƯƠNG HIỆU
        ═══════════════════════════════ */}
        {brands.length > 0 && (
          <section style={{ background: 'rgba(13,21,38,0.5)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '80px 0' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <div className="section-eyebrow" style={{ display: 'inline-flex' }}>
                  <Award size={12} /> Đối tác
                </div>
                <h2 className="section-title" style={{ marginTop: '12px' }}>Thương hiệu uy tín</h2>
                <p className="section-subtitle">Phân phối chính hãng 100% từ các hãng xe hàng đầu thế giới</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
                {brands.map((brand: any) => (
                  <Link key={brand.ma_thuonghieu} href={`/products?ma_thuonghieu=${brand.ma_thuonghieu}`} style={{ textDecoration: 'none' }}>
                    <div className="brand-chip">
                      <span style={{ fontSize: '20px', fontWeight: 900, color: 'white', fontFamily: 'Outfit, sans-serif' }}>{brand.ten_thuonghieu}</span>
                      {brand.nuoc_san_xuat && (
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>{brand.nuoc_san_xuat}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════
            TESTIMONIALS
        ═══════════════════════════════ */}
        <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div className="section-eyebrow" style={{ display: 'inline-flex' }}>
              <Star size={12} fill="currentColor" /> Đánh giá
            </div>
            <h2 className="section-title" style={{ marginTop: '12px' }}>Khách hàng nói gì?</h2>
            <p className="section-subtitle">Hơn 50.000 khách hàng hài lòng trên toàn quốc</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[
              { name: 'Nguyễn Văn Minh', location: 'TP. Hồ Chí Minh', text: 'Mua Honda Wave Alpha tại MotoShop, giá tốt hơn đại lý 2 triệu, giao hàng nhanh trong ngày. Nhân viên tư vấn nhiệt tình, am hiểu!', rating: 5, xe: 'Honda Wave Alpha', avatar: '🧑' },
              { name: 'Trần Thị Lan', location: 'Hà Nội', text: 'Mua VinFast Feliz S cho chồng, thủ tục cực đơn giản và có hỗ trợ trả góp 0%. Dịch vụ xuất sắc, rất hài lòng!', rating: 5, xe: 'VinFast Feliz S', avatar: '👩' },
              { name: 'Phạm Quốc Huy', location: 'Đà Nẵng', text: 'Website giao diện đẹp, thông tin xe đầy đủ. Đặt hàng online từ Đà Nẵng, ship về tận nhà an toàn. Cực kỳ tiện lợi!', rating: 5, xe: 'Yamaha Exciter 155', avatar: '👦' },
            ].map((t, i) => (
              <div key={i} className="testimonial-card" style={{ animationDelay: `${i * 0.15}s` }}>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '16px' }}>
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={15} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.8, marginBottom: '20px' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(230,57,70,0.08)', border: '1px solid rgba(230,57,70,0.15)', padding: '5px 12px', borderRadius: '20px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '12px', color: '#f87171', fontWeight: 700 }}>🏍️ {t.xe}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: '15px', color: 'white' }}>{t.name}</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════
            CTA SECTION
        ═══════════════════════════════ */}
        <section id="lien-he" style={{ padding: '0 32px 100px' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(230,57,70,0.15) 0%, rgba(244,162,97,0.08) 50%, rgba(139,92,246,0.1) 100%)',
              border: '1px solid rgba(230,57,70,0.2)',
              borderRadius: '32px',
              padding: '64px 48px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(230,57,70,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ fontSize: '14px', color: '#f87171', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>🚀 Bắt đầu ngay hôm nay</p>
                <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, fontFamily: 'Outfit, sans-serif', letterSpacing: '-1px', marginBottom: '16px', lineHeight: 1.1 }}>
                  Chiếc xe mơ ước của bạn<br />
                  <span className="gradient-text">đang chờ đợi!</span>
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginBottom: '36px', maxWidth: '520px', margin: '0 auto 36px' }}>
                  Đăng ký ngay để nhận ưu đãi độc quyền, cập nhật mẫu xe mới và giảm giá đặc biệt cho thành viên.
                </p>
                <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link href="/products">
                    <button className="btn-primary" style={{ padding: '16px 36px', fontSize: '16px', borderRadius: '16px' }}>
                      🏍 Khám phá ngay
                    </button>
                  </Link>
                  <Link href="/auth/register">
                    <button className="btn-secondary" style={{ padding: '16px 32px', fontSize: '16px', borderRadius: '16px' }}>
                      Đăng ký miễn phí
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
