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

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '68px' }}>
        {/* ═══════════════════════════════
            HERO SECTION (PREMIUM LIGHT)
        ═══════════════════════════════ */}
        <section className="hero-section" style={{ padding: 0, height: '700px', background: '#f8fafc', overflow: 'hidden' }}>
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            pagination={{
              clickable: true,
              renderBullet: (index, className) => `<span class="${className}" style="width: 24px; height: 4px; border-radius: 2px; margin: 0 4px; background: rgba(0,0,0,0.1); opacity: 1; transition: all 0.3s; display: inline-block;"></span>`
            }}
            style={{ width: '100%', height: '100%' }}
          >
            <style jsx global>{`
              .swiper-pagination-bullet-active {
                background: var(--primary) !important;
                width: 48px !important;
              }
              .hero-gradient-overlay {
                position: absolute;
                inset: 0;
                background: linear-gradient(90deg, #f8fafc 30%, rgba(248, 250, 252, 0) 70%, rgba(248, 250, 252, 0) 100%);
                z-index: 1;
              }
            `}</style>

            {/* Slide 1: Premium Speed */}
            <SwiperSlide>
              <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', background: '#f8fafc' }}>
                <img src="/hero-slider/premium-banner-1.png" alt="MotoShop 2025" style={{ position: 'absolute', right: 0, width: '65%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
                <div className="hero-gradient-overlay" />

                <div style={{ position: 'relative', marginLeft: '10%', maxWidth: '600px', zIndex: 10 }}>
                  <div className="reveal-in" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'white', color: 'var(--primary)', border: '1.5px solid var(--border)', borderRadius: '14px', padding: '12px 24px', marginBottom: '32px', fontWeight: 900, fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
                    <Sparkles size={16} /> NEW COLLECTION 2025
                  </div>

                  <h1 className="reveal-in" style={{ fontSize: 'clamp(44px, 6vw, 84px)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-3.5px', marginBottom: '36px', color: 'var(--secondary)', textShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
                    Đỉnh Cao <br />
                    <span className="gradient-text">Tốc Độ.</span>
                  </h1>

                  <p style={{ fontSize: '18px', color: '#334155', marginBottom: '48px', lineHeight: 1.6, maxWidth: '480px' }}>
                    Trải nghiệm hiệu năng thuần khiết trên những cung đường. Sportbike thế hệ mới dành riêng cho những tay lái thực thụ.
                  </p>

                  <div style={{ display: 'flex', gap: '16px' }}>
                    <Link href="/products">
                      <button className="btn-premium btn-primary" style={{ padding: '20px 48px', fontSize: '15px', borderRadius: '16px', boxShadow: 'var(--shadow-premium)' }}>
                        Mua Ngay <ArrowRight size={20} />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            {/* Slide 2: Tech & Eco */}
            <SwiperSlide>
              <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', background: '#f8fafc' }}>
                <img src="/hero-slider/premium-banner-2.png" alt="Eco Tech" style={{ position: 'absolute', right: 0, width: '65%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
                <div className="hero-gradient-overlay" />

                <div style={{ position: 'relative', marginLeft: '10%', maxWidth: '600px', zIndex: 10 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', color: '#3b82f6', border: '1px solid var(--border)', borderRadius: '12px', padding: '10px 20px', marginBottom: '32px', fontWeight: 800, fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <Zap size={14} /> FUTURE MOBILITY
                  </div>

                  <h1 style={{ fontSize: 'clamp(40px, 5vw, 76px)', fontWeight: 900, lineHeight: 1, letterSpacing: '-3px', marginBottom: '32px', color: '#0f172a', textShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                    Kỷ Nguyên <br />
                    <span style={{ color: '#3b82f6' }}>Xe Điện.</span>
                  </h1>

                  <p style={{ fontSize: '18px', color: '#334155', marginBottom: '48px', lineHeight: 1.6, maxWidth: '480px' }}>
                    Êm ái, mạnh mẽ và bảo vệ môi trường. Dẫn đầu xu hướng với các dòng xe điện thông minh nhất hiện nay.
                  </p>

                  <div style={{ display: 'flex', gap: '16px' }}>
                    <Link href="/products?type=xe_dien">
                      <button className="btn-premium" style={{ background: '#3b82f6', color: 'white', padding: '20px 48px', fontSize: '15px', borderRadius: '16px', boxShadow: '0 15px 30px rgba(59, 130, 246, 0.25)' }}>
                        Khám Phá <ChevronRight size={20} />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            {/* Slide 3: Adventure & Freedom */}
            <SwiperSlide>
              <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', background: '#f8fafc' }}>
                <img src="/hero-slider/premium-banner-3.png" alt="Adventure" style={{ position: 'absolute', right: 0, width: '65%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
                <div className="hero-gradient-overlay" />

                <div style={{ position: 'relative', marginLeft: '10%', maxWidth: '600px', zIndex: 10 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', color: '#10b981', border: '1px solid var(--border)', borderRadius: '12px', padding: '10px 20px', marginBottom: '32px', fontWeight: 800, fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <Flame size={14} /> ADVENTURE SPIRIT
                  </div>

                  <h1 style={{ fontSize: 'clamp(40px, 5vw, 76px)', fontWeight: 900, lineHeight: 1, letterSpacing: '-3px', marginBottom: '32px', color: '#0f172a', textShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                    Tự Do <br />
                    <span style={{ color: '#10b981' }}>Khám Phá.</span>
                  </h1>

                  <p style={{ fontSize: '18px', color: '#334155', marginBottom: '48px', lineHeight: 1.6, maxWidth: '480px' }}>
                    Không giới hạn khoảng cách. Những chiến mã Touring sẵn sàng cùng bạn chinh phục mọi chân trời mới.
                  </p>

                  <div style={{ display: 'flex', gap: '16px' }}>
                    <Link href="/products?type=phan_khoi_lon">
                      <button className="btn-premium" style={{ background: '#10b981', color: 'white', padding: '20px 48px', fontSize: '15px', borderRadius: '16px', boxShadow: '0 15px 30px rgba(16, 185, 129, 0.25)' }}>
                        Trải Nghiệm <ArrowRight size={20} />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </section>


        {/* ═══════════════════════════════
            USP SECTION (PREMIUM CARDS)
        ═══════════════════════════════ */}
        <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '100px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {uspItems.map((usp, i) => (
              <div key={i} className="premium-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', animationDelay: `${i * 0.1}s` }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--bg-elevated)',
                  color: usp.color,
                  marginBottom: '28px',
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.03)'
                }}>
                  {usp.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px', color: 'var(--secondary)' }}>{usp.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6 }}>{usp.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════
            CATEGORIES (MODERN GRIDS)
        ═══════════════════════════════ */}
        {
          categories.length > 0 && (
            <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px 100px' }}>
              <div className="section-header" style={{ alignItems: 'center', marginBottom: '56px' }}>
                <div>
                  <div className="section-eyebrow" style={{ background: 'var(--secondary)', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}>
                    <Flame size={12} /> CATEGORIES
                  </div>
                  <h2 className="section-title" style={{ fontSize: '48px', color: 'var(--secondary)' }}>Browse by Type</h2>
                  <p className="section-subtitle" style={{ fontSize: '17px' }}>Find the perfect ride for your lifestyle</p>
                </div>
                <Link href="/products" style={{ textDecoration: 'none' }}>
                  <button className="btn-premium btn-secondary" style={{ padding: '12px 24px', fontSize: '14px' }}>
                    Explore All <ArrowRight size={16} />
                  </button>
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                {categories.map((cat: any) => {
                  const key = cat.ten_danhmuc?.toLowerCase().replace(/\s+/g, '_').replace('côn', 'con');
                  const cfg = catConfig[key] || catConfig['xe_so'];
                  return (
                    <Link key={cat.ma_danhmuc} href={`/products?ma_danhmuc=${cat.ma_danhmuc}`} style={{ textDecoration: 'none' }}>
                      <div className="cat-card" style={{
                        background: 'var(--bg-card)',
                        padding: '40px 24px',
                        borderRadius: '32px',
                        border: '1px solid var(--border)',
                        textAlign: 'center',
                        transition: 'all 0.4s ease'
                      }}>
                        <div style={{ fontSize: '56px', marginBottom: '20px', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }}>{cfg.icon}</div>
                        <h4 style={{ fontWeight: 800, fontSize: '18px', color: 'var(--secondary)', marginBottom: '4px' }}>{cat.ten_danhmuc}</h4>
                        {cat.so_san_pham > 0 && (
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>{cat.so_san_pham} products</p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )
        }

        {/* ═══════════════════════════════
            FEATURED PRODUCTS (LIGHT GRID)
        ═══════════════════════════════ */}
        <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px 100px' }}>
          <div className="section-header" style={{ alignItems: 'center', marginBottom: '56px' }}>
            <div>
              <div className="section-eyebrow" style={{ background: 'var(--primary)', color: 'white', borderColor: 'transparent' }}>
                <Star size={12} fill="currentColor" /> TOP RATED
              </div>
              <h2 className="section-title" style={{ fontSize: '48px', color: 'var(--secondary)' }}>Featured Collection</h2>
              <p className="section-subtitle" style={{ fontSize: '17px' }}>Hand-picked premium rides for the ultimate experience</p>
            </div>
            <Link href="/products?sort=diem_danh_gia" style={{ textDecoration: 'none' }}>
              <button className="btn-premium btn-secondary">View Collection <ArrowRight size={16} /></button>
            </Link>
          </div>
          {loading ? <ProductsGridSkeleton count={8} /> : (
            <div className="products-grid">
              {featured.map((p: any) => <ProductCard key={p.ma_sanpham} product={p} />)}
            </div>
          )}
        </section>

        {/* ═══════════════════════════════
            SALE SECTION (ELEVATED)
        ═══════════════════════════════ */}
        {
          (!loading && discounted.length > 0) && (
            <section id="khuyen-mai" style={{
              background: 'var(--bg-elevated)',
              borderTop: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
              padding: '120px 0',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at 80% 20%, rgba(var(--primary-rgb), 0.05) 0%, transparent 50%)', pointerEvents: 'none' }} />

              <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
                <div className="section-header" style={{ alignItems: 'flex-end', marginBottom: '56px' }}>
                  <div>
                    <div className="section-eyebrow" style={{ background: '#f59e0b', color: 'white', borderColor: 'transparent' }}>
                      <Flame size={12} fill="currentColor" /> FLASH DEALS
                    </div>
                    <h2 className="section-title" style={{ fontSize: '48px', color: 'var(--secondary)' }}>Limited Offers</h2>
                    <p className="section-subtitle" style={{ fontSize: '17px' }}>Exclusive discounts on premium models — act fast!</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ padding: '12px 20px', background: 'white', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Clock size={18} color="var(--primary)" />
                      <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--secondary)' }}>Ends Today</span>
                    </div>
                    <Link href="/products" style={{ textDecoration: 'none' }}>
                      <button className="btn-premium btn-secondary">Explore All <ChevronRight size={16} /></button>
                    </Link>
                  </div>
                </div>
                <div className="products-grid">
                  {discounted.map((p: any) => <ProductCard key={p.ma_sanpham} product={p} />)}
                </div>
              </div>
            </section>
          )
        }

        {/* ═══════════════════════════════
            NEW ARRIVALS (CLEAN GRID)
        ═══════════════════════════════ */}
        <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '100px 32px' }}>
          <div className="section-header" style={{ alignItems: 'center', marginBottom: '56px' }}>
            <div>
              <div className="section-eyebrow" style={{ background: 'var(--accent)', color: 'white', borderColor: 'transparent' }}>
                <Zap size={12} /> JUST IN
              </div>
              <h2 className="section-title" style={{ fontSize: '48px', color: 'var(--secondary)' }}>New Arrivals</h2>
              <p className="section-subtitle" style={{ fontSize: '17px' }}>Freshly arrived premium motorcycles from top brands</p>
            </div>
            <Link href="/products" style={{ textDecoration: 'none' }}>
              <button className="btn-premium btn-secondary">Explore All <ChevronRight size={16} /></button>
            </Link>
          </div>
          {loading ? <ProductsGridSkeleton count={8} /> : (
            <div className="products-grid">
              {newProducts.map((p: any) => <ProductCard key={p.ma_sanpham} product={p} />)}
            </div>
          )}
        </section>

        {/* ═══════════════════════════════
            ABOUT / SHOWROOM (PREMIUM LAYOUT)
        ═══════════════════════════════ */}
        <section id="gioi-thieu" style={{ padding: '120px 32px', background: 'white' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: '80px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-40px', left: '-40px', width: '200px', height: '200px', background: 'var(--primary-light)', filter: 'blur(80px)', zIndex: 0, opacity: 0.5 }} />
              <img src="/showroom.png" alt="MotoShop Showroom" style={{ width: '100%', borderRadius: '40px', boxShadow: 'var(--shadow-lg)', position: 'relative', zIndex: 1, border: '8px solid white' }} />

              <div className="glass-panel animate-float" style={{ position: 'absolute', bottom: '40px', right: '-20px', padding: '32px', borderRadius: '32px', boxShadow: 'var(--shadow-premium)', zIndex: 2 }}>
                <div style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '44px', fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>10+</div>
                <p style={{ color: 'var(--secondary)', fontSize: '15px', fontWeight: 800, marginTop: '8px' }}>Years Experience</p>
                <div style={{ width: '40px', height: '4px', background: 'var(--primary)', borderRadius: '2px', marginTop: '16px' }} />
              </div>
            </div>

            <div className="reveal animate-slide-up">
              <div className="section-eyebrow" style={{ background: 'var(--secondary)', color: 'white' }}>
                <Shield size={12} /> HERITAGE
              </div>
              <h2 className="section-title" style={{ fontSize: '58px', color: 'var(--secondary)', marginBottom: '32px', lineHeight: 0.95 }}>
                Welcome to <br />
                <span className="gradient-text">MotoShop</span> Premium
              </h2>
              <p style={{ fontSize: '19px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '28px' }}>
                Dẫn đầu thị trường xe máy với hệ thống showroom trải dài toàn quốc. Chúng tôi mang đến những dòng xe đẳng cấp, từ xe số phổ thông đến phân khối lớn và xe điện thế hệ mới.
              </p>
              <p style={{ fontSize: '18px', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '40px' }}>
                Không chỉ là bán xe, MotoShop là nơi khơi nguồn cảm hứng tự do trên mọi cung đường. Cam kết chất lượng chuẩn 5 sao và dịch vụ hậu mãi trọn đời.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                    <Zap size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 800, color: 'var(--secondary)', marginBottom: '8px', fontSize: '18px' }}>Instant Service</h4>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>Hỗ trợ trả góp & đăng ký biển số siêu tốc trong 24h.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', flexShrink: 0 }}>
                    <Award size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 800, color: 'var(--secondary)', marginBottom: '8px', fontSize: '18px' }}>Verified Quality</h4>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>100% linh kiện & xe chính hãng, kiểm định 12 bước.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════
            BRANDS / PARTNERS (CLEAN)
        ═══════════════════════════════ */}
        {
          brands.length > 0 && (
            <section style={{ background: '#fafbfc', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '100px 0' }}>
              <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>
                <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                  <div className="section-eyebrow" style={{ display: 'inline-flex' }}>
                    Trust Partners
                  </div>
                  <h2 className="section-title" style={{ marginTop: '16px', fontSize: '36px' }}>Official Distribution</h2>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
                  {brands.map((brand: any) => (
                    <Link key={brand.ma_thuonghieu} href={`/products?ma_thuonghieu=${brand.ma_thuonghieu}`} style={{ textDecoration: 'none' }}>
                      <div className="brand-chip" style={{ background: 'white', border: '1px solid var(--border)', padding: '16px 32px', borderRadius: '20px', boxShadow: 'var(--shadow-sm)' }}>
                        <span style={{ fontSize: '22px', fontWeight: 900, color: 'var(--secondary)', fontFamily: 'Outfit, sans-serif' }}>{brand.ten_thuonghieu}</span>
                        {brand.nuoc_san_xuat && (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'var(--bg-elevated)', padding: '4px 10px', borderRadius: '8px', fontWeight: 800, textTransform: 'uppercase' }}>{brand.nuoc_san_xuat}</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )
        }

        {/* ═══════════════════════════════
            TESTIMONIALS (CARD STYLE)
        ═══════════════════════════════ */}
        <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '120px 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="section-eyebrow" style={{ display: 'inline-flex' }}>
              <Star size={12} fill="currentColor" /> Reviews
            </div>
            <h2 className="section-title" style={{ marginTop: '16px', fontSize: '42px' }}>What our customers say</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
            {[
              { name: 'Nguyễn Văn Minh', location: 'HCM City', text: 'Mua Honda Wave Alpha tại MotoShop, giá tốt hơn đại lý 2 triệu, giao hàng nhanh trong ngày. Nhân viên tư vấn nhiệt tình, am hiểu!', rating: 5, xe: 'Honda Wave Alpha', avatar: '🧑' },
              { name: 'Trần Thị Lan', location: 'Ha Noi', text: 'Mua VinFast Feliz S cho chồng, thủ tục cực đơn giản và có hỗ trợ trả góp 0%. Dịch vụ xuất sắc, rất hài lòng!', rating: 5, xe: 'VinFast Feliz S', avatar: '👩' },
              { name: 'Phạm Quốc Huy', location: 'Da Nang', text: 'Website giao diện đẹp, thông tin xe đầy đủ. Đặt hàng online từ Đà Nẵng, ship về tận nhà an toàn. Cực kỳ tiện lợi!', rating: 5, xe: 'Yamaha Exciter 155', avatar: '👦' },
            ].map((t, i) => (
              <div key={i} className="premium-card" style={{ padding: '40px', animationDelay: `${i * 0.15}s`, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={16} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '17px', lineHeight: 1.8, marginBottom: '32px', fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', border: '1px solid var(--border)' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: '16px', color: 'var(--secondary)' }}>{t.name}</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t.location} • <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{t.xe}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════
            CTA SECTION (PREMIUM PANEL)
        ═══════════════════════════════ */}
        <section id="lien-he" style={{ padding: '0 32px 120px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div className="glass-panel" style={{
              background: 'var(--secondary)',
              borderRadius: '48px',
              padding: '100px 48px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 40px 100px -20px rgba(15, 23, 42, 0.4)'
            }}>
              <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(230,57,70,0.2) 0%, transparent 70%)', pointerEvents: 'none', mixBlendMode: 'plus-lighter' }} />
              <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', pointerEvents: 'none', mixBlendMode: 'plus-lighter' }} />

              <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '8px 16px', marginBottom: '32px', color: 'white', fontWeight: 800, fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase' }}>
                  Join the Community
                </div>
                <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, fontFamily: 'Outfit, sans-serif', letterSpacing: '-2px', marginBottom: '24px', lineHeight: 1, color: 'white' }}>
                  Ready to Start Your <br />
                  <span className="gradient-text">Next Adventure?</span>
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '20px', marginBottom: '56px', lineHeight: 1.6 }}>
                  Đăng ký ngay để nhận ưu đãi đặc quyền, cập nhật mẫu xe giới hạn và nhận tư vấn chuyên sâu từ đội ngũ kỹ thuật viên 24/7.
                </p>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link href="/products">
                    <button className="btn-premium btn-primary" style={{ padding: '20px 44px', fontSize: '17px', borderRadius: '16px' }}>
                      Explore Collection
                    </button>
                  </Link>
                  <Link href="/auth/register">
                    <button className="btn-premium" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '20px 44px', fontSize: '17px', borderRadius: '16px' }}>
                      Create Account
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main >
      <Footer />
    </>
  );
}
