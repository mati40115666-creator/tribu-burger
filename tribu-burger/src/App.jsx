import React, { useState, useEffect } from 'react';
import { ShoppingBag, ChevronDown, Clock, MapPin, Instagram, X, Plus, Minus, Trash2, Beef, Leaf, Check, Send, AlertCircle, Copy, Loader2 } from 'lucide-react';
import logoSrc from './assets/logo.webp';
import imgAncestral from './assets/ancestral.webp';
import imgIncaGold from './assets/inca-gold.webp';
import imgMaya from './assets/maya.webp';
import imgTotem from './assets/totem.webp';
import imgTribu from './assets/tribu.webp';

const productImages = {
  'ancestral': imgAncestral,
  'inca-gold': imgIncaGold,
  'maya':      imgMaya,
  'totem':     imgTotem,
  'tribu':     imgTribu,
};
import { supabase } from './lib/supabase';
import {
  defaultConfig, defaultCategories, defaultProducts, defaultExtras, defaultZones,
  buildMenu, buildConfig
} from './data/defaults';

// ═══════════════════════════════════════════════════════════
// CARGA DE DATOS DESDE SUPABASE (fallback a defaults)
// ═══════════════════════════════════════════════════════════

async function loadAppData() {
  if (!supabase) {
    return {
      config: defaultConfig,
      menu: buildMenu(defaultCategories, defaultProducts),
      extrasAvailable: defaultExtras.filter(e => e.active),
      zones: defaultZones.filter(z => z.active)
    };
  }
  try {
    const [{ data: cfgData }, { data: cats }, { data: prods }, { data: exts }, { data: zns }] = await Promise.all([
      supabase.from('config').select('*').single(),
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('products').select('*').order('sort_order'),
      supabase.from('extras').select('*').eq('active', true),
      supabase.from('zones').select('*').eq('active', true)
    ]);
    return {
      config: buildConfig(cfgData || defaultConfig),
      menu: buildMenu(cats || defaultCategories, prods || defaultProducts),
      extrasAvailable: (exts || defaultExtras).map(e => ({ id: e.id, name: e.name, price: e.price })),
      zones: (zns || defaultZones).map(z => ({ id: z.id, name: z.name, price: z.price }))
    };
  } catch {
    return {
      config: defaultConfig,
      menu: buildMenu(defaultCategories, defaultProducts),
      extrasAvailable: defaultExtras.filter(e => e.active),
      zones: defaultZones.filter(z => z.active)
    };
  }
}

const config = defaultConfig;

// Variables de módulo — se actualizan cuando carga Supabase
// Necesario porque los componentes están definidos fuera de App()
let _dynConfig  = defaultConfig;
let _dynExtras  = defaultExtras.filter(e => e.active);
let _dynZones   = defaultZones.filter(z => z.active);

const themes = {
  totem:     { accent: '#d4a574', deep: '#1a0f0a', glow: 'rgba(212,165,116,0.35)', label: '#e8c99a' },
  azteca:    { accent: '#c53030', deep: '#1a0808', glow: 'rgba(197,48,48,0.4)',   label: '#f5a0a0' },
  maya:      { accent: '#7a8b3a', deep: '#0f1408', glow: 'rgba(122,139,58,0.4)',  label: '#c2d48a' },
  inca:      { accent: '#e8a830', deep: '#1a1208', glow: 'rgba(232,168,48,0.45)', label: '#f5d28a' },
  ancestral: { accent: '#8b2a2a', deep: '#1a0505', glow: 'rgba(139,42,42,0.45)',  label: '#d48a8a' },
  tribu:     { accent: '#c74a1d', deep: '#1a0a05', glow: 'rgba(199,74,29,0.45)',  label: '#f0b090' }
};

const menu = [
  {
    id: 'burgers', name: 'HAMBURGUESAS', bannerColor: 'amber',
    products: [
      { id: 'totem', name: 'TÓTEM BURGER', theme: 'totem', maskType: 'totem',
        description: 'Blend de carne · Barbacoa ahumada · Bacon · Cheddar fundido',
        basePrice: 10000, hasMedallon: true },
      { id: 'azteca', name: 'AZTECA', theme: 'azteca', maskType: 'azteca',
        description: 'Blend de carne · Barbacoa ahumada · Bacon · Cebolla crispy · Cheddar fundido',
        basePrice: 10000, hasMedallon: true },
      { id: 'maya', name: 'MAYA BURGER', theme: 'maya', maskType: 'maya',
        description: 'Blend de carne · Salsa alioli · Tomates asados · Rúcula · Queso tybo',
        basePrice: 10000, hasMedallon: true },
      { id: 'inca-gold', name: 'INCA GOLD', theme: 'inca', maskType: 'inca',
        description: 'Blend de carne · Volcán de cheddar y panceta · Barbacoa ahumada · Bacon',
        basePrice: 10000, hasMedallon: true },
      { id: 'ancestral', name: 'ANCESTRAL BURGER', theme: 'ancestral', maskType: 'ancestral',
        description: 'Blend de carne · Salsa tasty · Pepinillos · Bacon · Cheddar',
        basePrice: 10000, hasMedallon: true },
      { id: 'tribu', name: 'TRIBU BURGER', subtitle: 'LA DE LA CASA', theme: 'tribu', maskType: 'tribu',
        description: 'Blend de carne · Mayonesa de chimichurri · Lechuga · Tomate · Queso tybo · Jamón · Huevo',
        basePrice: 10000, hasMedallon: true }
    ]
  },
  {
    id: 'sides', name: 'ACOMPAÑAMIENTOS', bannerColor: 'red',
    products: [
      { id: 'papas-clasicas', name: 'PAPAS CLÁSICAS', theme: 'totem', maskType: 'fries',
        description: 'Papas fritas crocantes', basePrice: 10000, hasMedallon: false },
      { id: 'papas-cheddar', name: 'PAPAS CON CHEDDAR Y BACON', theme: 'inca', maskType: 'fries',
        description: 'Papas fritas con cheddar fundido y bacon crocante', basePrice: 10000, hasMedallon: false }
    ]
  },
  {
    id: 'drinks', name: 'BEBIDAS', bannerColor: 'green',
    products: [
      { id: 'gaseosa', name: 'GASEOSA', theme: 'azteca', maskType: 'drink',
        description: 'Línea Coca-Cola · consultar variedades', basePrice: 10000, hasMedallon: false },
      { id: 'agua', name: 'AGUA', theme: 'maya', maskType: 'drink',
        description: 'Con o sin gas', basePrice: 10000, hasMedallon: false },
      { id: 'cerveza', name: 'CERVEZA', theme: 'inca', maskType: 'beer',
        description: 'Rubia / Negra / IPA', basePrice: 10000, hasMedallon: false }
    ]
  }
];

// extrasAvailable, zones, config se cargan dinámicamente desde Supabase en el componente App
// paymentMethods es estático
const paymentMethods = [
  { id: 'efectivo', name: 'Efectivo' },
  { id: 'transferencia', name: 'Transferencia' }
];

const formatPrice = (n) => `$${n.toLocaleString('es-AR')}`;

// Helper: genera descripción legible del item del carrito
const describeItem = (item) => {
  const parts = [];
  if (item.variantLabel) parts.push(item.variantLabel.toUpperCase());
  if (item.extras && item.extras.length > 0) {
    parts.push(item.extras.map((e) => e.name).join(' · '));
  } else if (item.variantLabel) {
    parts.push('Sin extras');
  }
  return parts.join(' · ');
};

const itemUnitPrice = (item) =>
  item.basePrice + (item.variantSurcharge || 0) + (item.extras?.reduce((s, e) => s + e.price, 0) || 0);

const itemSubtotal = (item) => itemUnitPrice(item) * item.quantity;

// ═══════════════════════════════════════════════════════════
// MÁSCARAS TRIBALES
// ═══════════════════════════════════════════════════════════

function TotemMask({ color }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <rect x="30" y="22" width="40" height="56" fill="none" stroke={color} strokeWidth="2" rx="2" />
      <line x1="32" y1="28" x2="68" y2="28" stroke={color} strokeWidth="1" opacity="0.7"/>
      <line x1="32" y1="31" x2="68" y2="31" stroke={color} strokeWidth="1" opacity="0.7"/>
      <circle cx="40" cy="42" r="4" fill={color} />
      <circle cx="60" cy="42" r="4" fill={color} />
      <path d="M47 50 L44 62 L56 62 L53 50 Z" fill="none" stroke={color} strokeWidth="1.5"/>
      <line x1="40" y1="68" x2="60" y2="68" stroke={color} strokeWidth="2"/>
      <line x1="42" y1="72" x2="58" y2="72" stroke={color} strokeWidth="1"/>
      <line x1="30" y1="78" x2="70" y2="78" stroke={color} strokeWidth="1" opacity="0.7"/>
    </svg>
  );
}

function AztecaSunMask({ color }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {[...Array(12)].map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const x1 = 50 + 32 * Math.cos(a), y1 = 50 + 32 * Math.sin(a);
        const x2 = 50 + 46 * Math.cos(a), y2 = 50 + 46 * Math.sin(a);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2.5" strokeLinecap="round"/>;
      })}
      <circle cx="50" cy="50" r="30" fill="none" stroke={color} strokeWidth="2"/>
      <circle cx="50" cy="50" r="26" fill="none" stroke={color} strokeWidth="0.8" opacity="0.5"/>
      <circle cx="42" cy="46" r="3" fill={color}/>
      <circle cx="58" cy="46" r="3" fill={color}/>
      <path d="M48 52 L46 58 L54 58 L52 52 Z" fill={color}/>
      <path d="M42 62 Q50 66 58 62" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="36" cy="40" r="1" fill={color}/>
      <circle cx="64" cy="40" r="1" fill={color}/>
    </svg>
  );
}

function MayaMask({ color }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5"/>
      <path d="M25 28 L75 28 L80 50 L75 72 L25 72 L20 50 Z" fill="none" stroke={color} strokeWidth="2"/>
      <path d="M30 32 L70 32" stroke={color} strokeWidth="1"/>
      <path d="M28 36 L72 36" stroke={color} strokeWidth="0.7" opacity="0.6"/>
      <rect x="36" y="42" width="8" height="6" fill={color}/>
      <rect x="56" y="42" width="8" height="6" fill={color}/>
      <circle cx="40" cy="45" r="1.5" fill="#0f1408"/>
      <circle cx="60" cy="45" r="1.5" fill="#0f1408"/>
      <path d="M46 54 L44 62 L56 62 L54 54" fill="none" stroke={color} strokeWidth="1.5"/>
      <path d="M40 68 L60 68" stroke={color} strokeWidth="2"/>
      <path d="M44 72 L48 70 L52 70 L56 72" fill="none" stroke={color} strokeWidth="1.2"/>
      <path d="M28 50 L24 46 L24 54 Z" fill={color}/>
      <path d="M72 50 L76 46 L76 54 Z" fill={color}/>
    </svg>
  );
}

function IncaGoldMask({ color }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {[...Array(16)].map((_, i) => {
        const a = (i * 22.5 * Math.PI) / 180;
        const len = i % 2 === 0 ? 14 : 9;
        const x1 = 50 + 30 * Math.cos(a), y1 = 50 + 30 * Math.sin(a);
        const x2 = 50 + (30 + len) * Math.cos(a), y2 = 50 + (30 + len) * Math.sin(a);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={i % 2 === 0 ? 2.5 : 1.5} strokeLinecap="round"/>;
      })}
      <circle cx="50" cy="50" r="28" fill="none" stroke={color} strokeWidth="2.5"/>
      <circle cx="50" cy="50" r="24" fill="none" stroke={color} strokeWidth="0.8" opacity="0.6"/>
      <ellipse cx="42" cy="46" rx="4" ry="3" fill={color}/>
      <ellipse cx="58" cy="46" rx="4" ry="3" fill={color}/>
      <path d="M46 54 L44 60 L56 60 L54 54" fill="none" stroke={color} strokeWidth="1.5"/>
      <path d="M40 64 Q50 68 60 64" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M38 38 L42 40" stroke={color} strokeWidth="1.5"/>
      <path d="M62 38 L58 40" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}

function AncestralMask({ color }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="1" opacity="0.4"/>
      <path d="M50 18 L72 28 L76 52 L68 74 L50 82 L32 74 L24 52 L28 28 Z" fill="none" stroke={color} strokeWidth="2"/>
      <path d="M32 26 L50 22 L68 26" stroke={color} strokeWidth="1.2"/>
      <path d="M28 30 L72 30" stroke={color} strokeWidth="0.8" opacity="0.6"/>
      <path d="M35 42 L42 38 L45 42 L42 46 L35 46 Z" fill={color}/>
      <path d="M55 42 L58 38 L65 42 L65 46 L58 46 Z" fill={color}/>
      <circle cx="40" cy="42" r="1.5" fill="#1a0505"/>
      <circle cx="60" cy="42" r="1.5" fill="#1a0505"/>
      <path d="M50 50 L46 62 L54 62 Z" fill="none" stroke={color} strokeWidth="1.5"/>
      <path d="M42 68 L46 66 L50 68 L54 66 L58 68" fill="none" stroke={color} strokeWidth="1.5"/>
      <line x1="50" y1="72" x2="50" y2="78" stroke={color} strokeWidth="1"/>
      <path d="M38 54 L36 58 L40 58 Z" fill={color}/>
      <path d="M62 54 L60 58 L64 58 Z" fill={color}/>
    </svg>
  );
}

function TribuChiefMask({ color }) {
  const featherColors = ['#c74a1d', '#3a8a8c', '#e8a830', '#c74a1d', '#3a8a8c', '#e8a830', '#c74a1d'];
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {featherColors.map((fc, i) => {
        const x = 20 + i * 10;
        const tilt = (i - 3) * 3;
        return (
          <g key={i} transform={`translate(${x} 10) rotate(${tilt})`}>
            <path d="M0 0 Q-3 8 -2 16 Q0 22 2 16 Q3 8 0 0 Z" fill={fc} opacity="0.95"/>
            <line x1="0" y1="2" x2="0" y2="18" stroke="#1a0a05" strokeWidth="0.5"/>
          </g>
        );
      })}
      <path d="M28 36 L72 36 L68 42 L32 42 Z" fill={color}/>
      <path d="M30 42 L70 42 L70 48 L30 48 Z" fill="none" stroke={color} strokeWidth="1.5"/>
      <circle cx="42" cy="56" r="2.5" fill={color}/>
      <circle cx="58" cy="56" r="2.5" fill={color}/>
      <path d="M36 50 L44 50" stroke="#e8a830" strokeWidth="1"/>
      <path d="M56 50 L64 50" stroke="#e8a830" strokeWidth="1"/>
      <path d="M38 62 L42 62" stroke="#3a8a8c" strokeWidth="1.5"/>
      <path d="M58 62 L62 62" stroke="#3a8a8c" strokeWidth="1.5"/>
      <path d="M48 62 L46 70 L54 70 L52 62 Z" fill="none" stroke={color} strokeWidth="1.2"/>
      <path d="M42 76 Q50 80 58 76" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="32" cy="58" r="2" fill={color}/>
      <circle cx="68" cy="58" r="2" fill={color}/>
    </svg>
  );
}

function FriesIcon({ color }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="1" opacity="0.4"/>
      <path d="M28 50 L34 86 L66 86 L72 50 Z" fill="none" stroke={color} strokeWidth="2"/>
      <path d="M28 50 L72 50" stroke={color} strokeWidth="1.5"/>
      <rect x="36" y="24" width="4" height="30" fill={color}/>
      <rect x="44" y="18" width="4" height="36" fill={color}/>
      <rect x="52" y="22" width="4" height="32" fill={color}/>
      <rect x="60" y="26" width="4" height="28" fill={color}/>
      <path d="M34 58 L66 58" stroke={color} strokeWidth="0.8" opacity="0.6"/>
      <path d="M36 66 L64 66" stroke={color} strokeWidth="0.8" opacity="0.6"/>
      <path d="M38 74 L62 74" stroke={color} strokeWidth="0.8" opacity="0.6"/>
    </svg>
  );
}

function DrinkIcon({ color }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="1" opacity="0.4"/>
      <path d="M36 24 L64 24 L62 82 L38 82 Z" fill="none" stroke={color} strokeWidth="2"/>
      <path d="M36 32 L64 32" stroke={color} strokeWidth="1"/>
      <path d="M42 40 L58 40" stroke={color} strokeWidth="1" opacity="0.6"/>
      <path d="M44 48 L56 48" stroke={color} strokeWidth="1" opacity="0.6"/>
      <circle cx="50" cy="56" r="6" fill="none" stroke={color} strokeWidth="1.5"/>
      <path d="M44 64 L56 64" stroke={color} strokeWidth="1" opacity="0.6"/>
      <path d="M42 72 L58 72" stroke={color} strokeWidth="1" opacity="0.6"/>
    </svg>
  );
}

function BeerIcon({ color }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="1" opacity="0.4"/>
      <path d="M30 28 L64 28 L62 82 L32 82 Z" fill="none" stroke={color} strokeWidth="2"/>
      <path d="M64 36 L74 36 L74 64 L62 64" fill="none" stroke={color} strokeWidth="2"/>
      <path d="M30 28 Q34 20 42 22 Q46 16 52 22 Q60 20 64 28" fill="none" stroke={color} strokeWidth="1.5"/>
      <path d="M36 44 L58 44" stroke={color} strokeWidth="0.8" opacity="0.6"/>
      <path d="M36 52 L58 52" stroke={color} strokeWidth="0.8" opacity="0.6"/>
      <path d="M36 60 L58 60" stroke={color} strokeWidth="0.8" opacity="0.6"/>
      <path d="M36 68 L58 68" stroke={color} strokeWidth="0.8" opacity="0.6"/>
    </svg>
  );
}

function MaskFor({ type, color }) {
  switch (type) {
    case 'totem': return <TotemMask color={color} />;
    case 'azteca': return <AztecaSunMask color={color} />;
    case 'maya': return <MayaMask color={color} />;
    case 'inca': return <IncaGoldMask color={color} />;
    case 'ancestral': return <AncestralMask color={color} />;
    case 'tribu': return <TribuChiefMask color={color} />;
    case 'fries': return <FriesIcon color={color} />;
    case 'drink': return <DrinkIcon color={color} />;
    case 'beer': return <BeerIcon color={color} />;
    default: return <TotemMask color={color} />;
  }
}

// ═══════════════════════════════════════════════════════════
// LOGO
// ═══════════════════════════════════════════════════════════

function TribuLogo() {
  return (
    <div
      className="relative"
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        padding: '3px',
        background: 'conic-gradient(from 0deg, #b45309, #78350f, #991b1b, #b45309, #f59e0b, #b45309)',
        boxShadow: '0 0 60px -12px rgba(251,146,60,0.8), 0 0 120px -30px rgba(199,74,29,0.5)'
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: '#fef9ef',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <img
          src={logoSrc}
          alt="Tribu Burger"
          style={{ width: '96%', height: '96%', objectFit: 'contain' }}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DECORATIVOS
// ═══════════════════════════════════════════════════════════

function SunGlyph({ size = 60, color = '#78350f', opacity = 0.15 }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ opacity }}>
      <circle cx="50" cy="50" r="20" fill="none" stroke={color} strokeWidth="2"/>
      {[...Array(12)].map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const x1 = 50 + 22 * Math.cos(a), y1 = 50 + 22 * Math.sin(a);
        const x2 = 50 + 38 * Math.cos(a), y2 = 50 + 38 * Math.sin(a);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2"/>;
      })}
      <circle cx="50" cy="50" r="8" fill={color}/>
      <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="1" strokeDasharray="3 3"/>
    </svg>
  );
}

function SideBorder({ side = 'left' }) {
  return (
    <div
      className={`hidden lg:block fixed top-0 ${side === 'left' ? 'left-0' : 'right-0'} w-20 h-full pointer-events-none z-0`}
      style={{
        background: `linear-gradient(${side === 'left' ? '90deg' : '270deg'}, rgba(139,69,19,0.08), transparent)`
      }}
    >
      <div className="flex flex-col items-center justify-around h-full py-10">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <SunGlyph key={i} size={50} color="#92400e" opacity={0.22} />
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════════════

function Hero() {
  return (
    <header className="relative overflow-hidden pt-10 pb-10 px-6">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center top, rgba(232,168,48,0.15) 0, transparent 55%),
                       radial-gradient(ellipse at 20% 60%, rgba(199,74,29,0.1) 0, transparent 55%),
                       radial-gradient(ellipse at 80% 60%, rgba(139,42,42,0.1) 0, transparent 55%)`
        }}
      />
      <div className="relative flex flex-col items-center">
        <div className="w-36 h-36 md:w-44 md:h-44 relative">
          <div
            className="absolute inset-0 rounded-full blur-2xl"
            style={{ background: 'radial-gradient(circle, rgba(232,168,48,0.35) 0, transparent 65%)' }}
          />
          <div className="relative w-full h-full">
            <TribuLogo />
          </div>
        </div>

        <h1
          className="mt-2 text-center text-5xl md:text-7xl tracking-wide leading-none"
          style={{
            fontFamily: "'Alfa Slab One', serif",
            background: 'linear-gradient(180deg, #fde68a 0%, #e8a830 35%, #c74a1d 75%, #8b2a2a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 2px 0 rgba(0,0,0,0.5))'
          }}
        >
          {_dynConfig.name}
        </h1>

        <div className="flex flex-col items-center gap-2 mt-4">
          <div className="flex items-center gap-2 w-full justify-center">
            <span className="flex-1 max-w-[40px] h-px bg-gradient-to-r from-transparent to-amber-700" />
            <SunGlyph size={14} color="#b45309" opacity={0.9} />
            <SunGlyph size={14} color="#b45309" opacity={0.9} />
            <span className="flex-1 max-w-[40px] h-px bg-gradient-to-l from-transparent to-amber-700" />
          </div>
          <p className="text-[10px] md:text-xs tracking-[0.25em] text-amber-300/70 uppercase font-semibold text-center px-4">
            {_dynConfig.tagline}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-5 text-amber-200/50 text-xs">
          <Clock className="w-3.5 h-3.5" />
          <span>{_dynConfig.schedule}</span>
        </div>
      </div>
    </header>
  );
}

// ═══════════════════════════════════════════════════════════
// PRODUCT CARD
// ═══════════════════════════════════════════════════════════

function ProductCard({ product, onSelect, onDrinkVariant, cartCount = 0, onAdd, onRemove }) {
  const t = themes[product.theme];
  const isBurger = product.hasMedallon;
  const hasDrinkVariants = !isBurger && !!DRINK_VARIANTS[product.id];
  const isClickable = isBurger || hasDrinkVariants;

  const handleClick = () => {
    if (isBurger) onSelect(product);
    else if (hasDrinkVariants) onDrinkVariant(product);
  };

  return (
    <div
      onClick={isClickable ? handleClick : undefined}
      className={`group relative rounded-lg overflow-hidden transition-all duration-300 ${isClickable ? 'cursor-pointer hover:scale-[1.015] active:scale-[0.99]' : ''}`}
      style={{
        background: `linear-gradient(135deg, ${t.deep} 0%, #0a0604 100%)`,
        boxShadow: `inset 0 0 0 1px ${t.accent}33, 0 4px 20px -8px ${t.glow}`
      }}
    >
      <div
        className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.4 0 0 0 0 0.2 0 0 0 0 0.1 0 0 0 0.6 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }}
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 30% 50%, ${t.glow}, transparent 70%)` }}
      />
      <div className="relative flex gap-4 p-4">
        <div
          className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-md overflow-hidden relative"
          style={{
            background: `radial-gradient(circle, ${t.deep} 0%, #000 100%)`,
            border: `1.5px solid ${t.accent}55`
          }}
        >
          {(productImages[product.id] || product.image_url) ? (
            <img
              src={productImages[product.id] || product.image_url}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <>
              <div className="absolute inset-1 rounded" style={{ border: `1px solid ${t.accent}22` }} />
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-[85%] h-[85%]">
                  <MaskFor type={product.maskType} color={t.accent} />
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <h3
              className="text-lg md:text-xl leading-tight tracking-wide"
              style={{
                fontFamily: "'Alfa Slab One', serif",
                color: t.label,
                textShadow: `0 1px 0 #000, 0 0 20px ${t.glow}`
              }}
            >
              {product.name}
            </h3>
            {product.subtitle && (
              <div className="mt-1 inline-block px-2 py-0.5 rounded-sm" style={{ background: `${t.accent}22`, border: `1px solid ${t.accent}55` }}>
                <p className="text-[9px] font-bold tracking-[0.3em]" style={{ color: t.label }}>
                  · {product.subtitle} ·
                </p>
              </div>
            )}
            <p className="text-[11px] md:text-xs text-amber-100/55 mt-2 leading-relaxed">
              {product.description}
            </p>
            {isBurger && (
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(139,69,19,0.25)', border: '1px solid rgba(139,69,19,0.5)' }}>
                <span style={{ fontSize: '10px' }}>🍟</span>
                <span className="text-[10px] font-bold tracking-wide" style={{ color: '#d4a574' }}>
                  Incluye papas fritas
                </span>
              </div>
            )}
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: `${t.accent}cc` }}>
                {product.hasMedallon ? 'desde' : ''}
              </span>
              <span className="text-lg font-bold" style={{ color: t.label, fontFamily: "'Alfa Slab One', serif" }}>
                {product.basePrice > 0 ? formatPrice(product.basePrice) : 'Consultar'}
              </span>
            </div>
            {!isBurger && !hasDrinkVariants && (
              <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                {cartCount > 0 && (
                  <>
                    <button
                      onClick={onRemove}
                      className="w-7 h-7 rounded-full flex items-center justify-center transition hover:scale-110 active:scale-95"
                      style={{ background: `${t.accent}33`, border: `1px solid ${t.accent}66`, color: t.label }}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-sm font-bold" style={{ color: t.label, fontFamily: "'Alfa Slab One', serif" }}>
                      {cartCount}
                    </span>
                  </>
                )}
                <button
                  onClick={onAdd}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition hover:scale-110 active:scale-95"
                  style={{ background: `linear-gradient(135deg, ${t.accent}, ${t.deep})`, border: `1px solid ${t.accent}`, color: '#fff', boxShadow: `0 2px 8px -2px ${t.glow}` }}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, transparent, ${t.accent}, transparent)` }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CATEGORY BANNER
// ═══════════════════════════════════════════════════════════

const bannerStyles = {
  amber: { from: '#92400e', to: '#451a03', text: '#fde68a', border: '#d97706' },
  red:   { from: '#7f1d1d', to: '#450a0a', text: '#fecaca', border: '#dc2626' },
  green: { from: '#365314', to: '#1a2e05', text: '#d9f99d', border: '#84cc16' }
};

function CategoryBanner({ name, color, isOpen, onToggle }) {
  const s = bannerStyles[color];
  return (
    <button onClick={onToggle} className="relative w-full group">
      <div
        className="relative py-4 px-6 flex items-center justify-between transition-all"
        style={{
          background: `linear-gradient(180deg, ${s.from} 0%, ${s.to} 100%)`,
          boxShadow: `inset 0 1px 0 ${s.border}88, inset 0 -3px 12px rgba(0,0,0,0.5), 0 4px 15px -5px ${s.from}99`,
          clipPath: 'polygon(0 0, 98% 0, 100% 50%, 98% 100%, 0 100%, 2% 50%)'
        }}
      >
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
          }}
        />
        <div className="relative flex items-center gap-3 min-w-0 flex-1">
          <span className="hidden sm:block h-px w-8 flex-shrink-0" style={{ background: `linear-gradient(to right, transparent, ${s.text}88)` }} />
          <h2
            className="text-lg md:text-2xl tracking-[0.1em] md:tracking-[0.15em] truncate"
            style={{
              fontFamily: "'Alfa Slab One', serif",
              color: s.text,
              textShadow: '0 2px 0 rgba(0,0,0,0.6), 0 0 18px rgba(0,0,0,0.4)'
            }}
          >
            {name}
          </h2>
          <span className="hidden sm:block h-px w-8 flex-shrink-0" style={{ background: `linear-gradient(to left, transparent, ${s.text}88)` }} />
        </div>
        <ChevronDown
          className="relative w-5 h-5 transition-transform duration-300"
          style={{ color: s.text, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </div>
    </button>
  );
}

function Category({ category, isOpen, onToggle, onSelectProduct, onDrinkVariant, cartItems, onAdd, onRemove }) {
  return (
    <div className="mb-3">
      <CategoryBanner name={category.name} color={category.bannerColor} isOpen={isOpen} onToggle={onToggle} />
      <div className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? 'max-h-[5000px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
        <div className="space-y-2.5 px-1">
          {category.products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={onSelectProduct}
              onDrinkVariant={onDrinkVariant}
              cartCount={cartItems.filter(i => i.productId === p.id).reduce((s, i) => s + i.quantity, 0)}
              onAdd={() => onAdd(p)}
              onRemove={() => onRemove(p)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MODAL · Wrapper genérico
// ═══════════════════════════════════════════════════════════

function Modal({ isOpen, onClose, children, title, subtitle }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 animate-[fadeIn_0.2s_ease-out]"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full md:max-w-md max-h-[90vh] overflow-hidden rounded-t-2xl md:rounded-2xl animate-[slideUp_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: `linear-gradient(180deg, #1a0f0a 0%, #0a0604 100%)`,
          boxShadow: `0 -20px 60px -10px rgba(232,168,48,0.3), inset 0 1px 0 rgba(232,168,48,0.4)`,
          border: '1px solid rgba(139,69,19,0.5)'
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
          }}
        />

        <div className="relative flex flex-col max-h-[90vh]">
          <div className="flex items-start justify-between px-5 pt-5 pb-3">
            <div className="flex-1">
              <h3
                className="text-2xl tracking-wide"
                style={{
                  fontFamily: "'Alfa Slab One', serif",
                  background: 'linear-gradient(180deg, #fde68a, #c74a1d)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-amber-200/60 mt-1 tracking-wider uppercase">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition hover:scale-110"
              style={{ background: 'rgba(139,69,19,0.3)', border: '1px solid rgba(232,168,48,0.3)' }}
              aria-label="Cerrar"
            >
              <X className="w-4 h-4 text-amber-300" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 px-5 pb-2">
            <span className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-700/40 to-transparent" />
            <SunGlyph size={16} color="#b45309" opacity={0.7} />
            <span className="flex-1 h-px bg-gradient-to-l from-transparent via-amber-700/40 to-transparent" />
          </div>

          <div className="overflow-y-auto flex-1">{children}</div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// VARIANT MODAL · Simple / Doble / Triple
// ═══════════════════════════════════════════════════════════

// Surcharges dinámicos — se actualizan cuando carga Supabase
const getBurgerVariants = () => [
  { id: 'simple', label: 'SIMPLE', surcharge: 0 },
  { id: 'doble',  label: 'DOBLE',  surcharge: _dynConfig.surcharge_doble ?? 1500 },
  { id: 'triple', label: 'TRIPLE', surcharge: _dynConfig.surcharge_triple ?? 3000 }
];

// Variantes de bebidas con precio propio
const DRINK_VARIANTS = {
  cervezas: [
    { id: 'budweiser', label: 'BUDWEISER', price: 2500 },
    { id: 'heineken',  label: 'HEINEKEN',  price: 3000 }
  ],
  gaseosas: [
    { id: 'coca',   label: 'COCA-COLA', price: 1700 },
    { id: 'sprite', label: 'SPRITE',    price: 1700 },
    { id: 'pepsi',  label: 'PEPSI',     price: 1500 }
  ],
  dips: [
    { id: 'mayonesa',  label: 'MAYONESA',         price: 700 },
    { id: 'barbacoa',  label: 'BARBACOA',         price: 700 },
    { id: 'ketchup',   label: 'KETCHUP',          price: 700 },
    { id: 'sabora',    label: 'SABORA',           price: 700 },
    { id: 'tasty',     label: 'SALSA TASTY',      price: 700 },
    { id: 'alioli',    label: 'ALIOLI',           price: 700 },
    { id: 'mayochimi', label: 'MAYO CHIMICHURRI', price: 700 },
    { id: 'cheddar',   label: 'CHEDDAR',          price: 700 }
  ]
};

function VariantModal({ product, isOpen, onClose, onSelect }) {
  if (!product) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ELEGÍ EL TAMAÑO" subtitle={product.name}>
      <div className="p-5 pt-2 space-y-3">
        {getBurgerVariants().map((v) => {
          const price = product.basePrice + v.surcharge;
          return (
            <button
              key={v.id}
              onClick={() => onSelect({ ...v, basePrice: price })}
              className="w-full p-4 rounded-xl flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #78350f 0%, #451a03 100%)',
                border: '1.5px solid rgba(217,119,6,0.6)',
                boxShadow: '0 4px 20px -6px rgba(232,168,48,0.4), inset 0 1px 0 rgba(232,168,48,0.3)'
              }}
            >
              <span className="text-xl tracking-wide" style={{ fontFamily: "'Alfa Slab One', serif", color: '#fde68a' }}>
                {v.label}
              </span>
              <span className="text-xl font-bold" style={{ fontFamily: "'Alfa Slab One', serif", color: '#fbbf24' }}>
                {formatPrice(price)}
              </span>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}

function DrinkVariantModal({ product, isOpen, onClose, onSelect }) {
  if (!product) return null;
  const variants = DRINK_VARIANTS[product.id] || [];
  const t = themes[product.theme] || themes.inca;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.name} subtitle="Elegí tu opción">
      <div className="p-5 pt-2 space-y-3">
        {variants.map((v) => (
          <button
            key={v.id}
            onClick={() => onSelect(v)}
            className="w-full p-4 rounded-xl flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${t.deep} 0%, #0a0604 100%)`,
              border: `1.5px solid ${t.accent}88`,
              boxShadow: `0 4px 20px -6px ${t.glow}, inset 0 1px 0 ${t.accent}33`
            }}
          >
            <span className="text-lg tracking-wide" style={{ fontFamily: "'Alfa Slab One', serif", color: t.label }}>
              {v.label}
            </span>
            <span className="text-lg font-bold" style={{ fontFamily: "'Alfa Slab One', serif", color: t.label }}>
              {formatPrice(v.price)}
            </span>
          </button>
        ))}
      </div>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════
// EXTRAS MODAL
// ═══════════════════════════════════════════════════════════

function ExtrasModal({ product, medallon, isOpen, onClose, onConfirm }) {
  const [selected, setSelected] = useState([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) { setSelected([]); setNotes(''); }
  }, [isOpen]);

  if (!product) return null;

  const toggle = (extra) => {
    setSelected((prev) =>
      prev.find((e) => e.id === extra.id)
        ? prev.filter((e) => e.id !== extra.id)
        : [...prev, extra]
    );
  };

  const variantSurcharge = medallon?.surcharge || 0;
  const subtotal = product.basePrice + variantSurcharge + selected.reduce((s, e) => s + e.price, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="¿EXTRAS?" subtitle={`${product.name} · ${medallon?.label?.toUpperCase() || ''}`}>
      <div className="p-5 pt-2 space-y-2.5">
        {_dynExtras.map((extra) => {
          const isChecked = !!selected.find((e) => e.id === extra.id);
          return (
            <button
              key={extra.id}
              onClick={() => toggle(extra)}
              className="w-full p-3.5 rounded-lg flex items-center gap-3 transition-all"
              style={{
                background: isChecked
                  ? 'linear-gradient(135deg, #78350f 0%, #451a03 100%)'
                  : 'linear-gradient(135deg, #1a0f0a 0%, #0a0604 100%)',
                border: `1.5px solid ${isChecked ? '#d97706' : 'rgba(139,69,19,0.4)'}`,
                boxShadow: isChecked
                  ? '0 4px 20px -6px rgba(217,119,6,0.5), inset 0 1px 0 rgba(251,191,36,0.3)'
                  : 'inset 0 1px 0 rgba(139,69,19,0.2)'
              }}
            >
              <div
                className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center transition-all"
                style={{
                  background: isChecked ? '#d97706' : 'transparent',
                  border: `1.5px solid ${isChecked ? '#fbbf24' : '#78350f'}`
                }}
              >
                {isChecked && <Check className="w-4 h-4 text-stone-950" strokeWidth={3} />}
              </div>
              <div className="flex-1 flex items-center justify-between text-left">
                <span
                  className="text-sm tracking-wide font-bold"
                  style={{
                    fontFamily: "'Alfa Slab One', serif",
                    color: isChecked ? '#fde68a' : '#d4a574'
                  }}
                >
                  {extra.name}
                </span>
                <span
                  className="text-sm font-bold ml-2"
                  style={{ color: isChecked ? '#fbbf24' : '#78350f' }}
                >
                  +{formatPrice(extra.price)}
                </span>
              </div>
            </button>
          );
        })}

        {selected.length === 0 && (
          <p className="text-center text-xs text-amber-200/40 italic pt-1">
            Sin extras seleccionados
          </p>
        )}

        <div className="pt-2">
          <p className="text-[10px] uppercase tracking-widest text-amber-700 font-bold mb-1.5">Aclaraciones (opcional)</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej: sin lechuga, sin cheddar, término del medallón..."
            rows={2}
            className="w-full text-xs p-2.5 rounded-md resize-none focus:outline-none transition"
            style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(139,69,19,0.4)',
              color: '#fde68a',
              fontFamily: "'Karla', sans-serif"
            }}
          />
        </div>
      </div>

      <div
        className="sticky bottom-0 p-5 pt-4"
        style={{
          background: 'linear-gradient(180deg, transparent, #0a0604 40%)',
          borderTop: '1px solid rgba(139,69,19,0.3)'
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">Subtotal</span>
          <span
            className="text-xl font-bold"
            style={{ fontFamily: "'Alfa Slab One', serif", color: '#fde68a' }}
          >
            {formatPrice(subtotal)}
          </span>
        </div>
        <button
          onClick={() => onConfirm(selected, notes)}
          className="w-full py-3.5 rounded-lg font-bold tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #e8a830 0%, #c74a1d 100%)',
            color: '#1a0a05',
            fontFamily: "'Alfa Slab One', serif",
            fontSize: '15px',
            letterSpacing: '0.1em',
            boxShadow: '0 6px 20px -4px rgba(232,168,48,0.6), inset 0 1px 0 rgba(255,255,255,0.3)',
            border: '1.5px solid rgba(253, 230, 138, 0.5)'
          }}
        >
          AGREGAR AL CARRITO
        </button>
      </div>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════
// CHECKOUT MODAL · datos del cliente + envío por WhatsApp
// ═══════════════════════════════════════════════════════════

function buildWhatsAppMessage({ customer, cart, payment, cashAmount, generalNotes }) {
  const total = cart.reduce((s, i) => s + itemSubtotal(i), 0);

  const L = [];
  L.push('*🔥 PEDIDO · TRIBU BURGER 🔥*');
  L.push('');
  L.push(`*Nombre:* ${customer.name}`);
  L.push(`*Dirección:* ${customer.address}`);
  L.push(`*Teléfono:* ${customer.phone}`);
  L.push('');
  L.push(`*Forma de pago:* ${payment === 'efectivo' ? 'Efectivo' : 'Transferencia'}`);
  if (payment === 'efectivo' && cashAmount) {
    L.push(`*Abona con:* $${cashAmount}`);
  }
  if (payment === 'transferencia') {
    L.push(`_Alias: ${_dynConfig?.bank_alias}_`);
  }
  L.push('');
  L.push('*── PEDIDO ──*');
  cart.forEach((item) => {
    const desc = describeItem(item);
    L.push(`*${item.quantity}x* ${item.name}${desc ? ` _(${desc})_` : ''}`);
    L.push(`   Subtotal: ${formatPrice(itemSubtotal(item))}`);
    if (item.notes && item.notes.trim()) {
      L.push(`   _Aclaraciones: ${item.notes.trim()}_`);
    }
  });
  L.push('');
  L.push(`*TOTAL: ${formatPrice(total)}*`);

  if (generalNotes && generalNotes.trim()) {
    L.push('');
    L.push(`*Aclaraciones:* ${generalNotes.trim()}`);
  }

  return L.join('\n');
}

function FormField({ label, required, error, children }) {
  return (
    <div>
      <label className="text-xs font-bold tracking-wider uppercase text-amber-300/80 flex items-center gap-1">
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && (
        <div className="flex items-center gap-1 mt-1 text-[11px] text-red-400">
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

function CheckoutModal({ isOpen, onClose, cart, onSuccess, generalNotes }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const [payment, setPayment] = useState(null);
  const [cashAmount, setCashAmount] = useState('');
  const [errors, setErrors] = useState({});
  const [aliasCopied, setAliasCopied] = useState(false);

  // Reset form al abrir
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setAliasCopied(false);
    }
  }, [isOpen]);

  const total = cart.reduce((s, i) => s + itemSubtotal(i), 0);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Completá tu nombre';
    if (!address.trim()) e.address = 'Completá tu dirección';
    if (!phone.trim()) e.phone = 'Completá tu teléfono';
    else if (!/^\d[\d\s-]{6,}$/.test(phone.trim())) e.phone = 'Teléfono inválido';
    if (!payment) e.payment = 'Elegí la forma de pago';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const message = buildWhatsAppMessage({
      customer: { name: name.trim(), address: address.trim(), phone: phone.trim() },
      cart,
      payment,
      cashAmount: cashAmount.trim(),
      generalNotes
    });
    const waNumber = (_dynConfig.whatsapp && _dynConfig.whatsapp !== '5493420000000')
      ? _dynConfig.whatsapp
      : '5493426516104';
    const url = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    onSuccess();
  };

  const copyAlias = () => {
    navigator.clipboard?.writeText(_dynConfig?.bank_alias || '');
    setAliasCopied(true);
    setTimeout(() => setAliasCopied(false), 2000);
  };

  const inputStyle = {
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(139,69,19,0.5)',
    color: '#fde68a',
    fontSize: '14px'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="COMPLETÁ TUS DATOS" subtitle="Para que el pedido llegue bien">
      <div className="p-5 pt-2 space-y-4">
        <FormField label="Nombre y apellido" required error={errors.name}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600/50 transition"
            style={inputStyle}
            placeholder="Tu nombre completo"
          />
        </FormField>

        <FormField label="Dirección" required error={errors.address}>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600/50 transition"
            style={inputStyle}
            placeholder="Calle, número, depto/timbre, referencia"
          />
        </FormField>

        <FormField label="Teléfono" required error={errors.phone}>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600/50 transition"
            style={inputStyle}
            placeholder="Ej: 3426264360"
          />
        </FormField>

        <FormField label="Forma de pago" required error={errors.payment}>
          <div className="grid grid-cols-2 gap-2">
            {paymentMethods.map((p) => {
              const active = p.id === payment;
              return (
                <button
                  key={p.id}
                  onClick={() => setPayment(p.id)}
                  className="py-2.5 rounded-md font-bold tracking-wider text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: active
                      ? 'linear-gradient(135deg, #78350f 0%, #451a03 100%)'
                      : 'rgba(0,0,0,0.4)',
                    border: `1.5px solid ${active ? '#d97706' : 'rgba(139,69,19,0.4)'}`,
                    color: active ? '#fde68a' : '#d4a574',
                    fontFamily: "'Alfa Slab One', serif",
                    boxShadow: active ? '0 4px 15px -4px rgba(217,119,6,0.5)' : 'none'
                  }}
                >
                  {p.name.toUpperCase()}
                </button>
              );
            })}
          </div>
        </FormField>

        {payment === 'efectivo' && (
          <FormField label="¿Con cuánto abonás?" error={null}>
            <input
              type="tel"
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value.replace(/[^\d]/g, ''))}
              className="w-full px-3 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600/50 transition"
              style={inputStyle}
              placeholder="Opcional · ej: 30000"
            />
          </FormField>
        )}

        {payment === 'transferencia' && (
          <div
            className="rounded-lg p-3 flex items-center justify-between gap-3"
            style={{
              background: 'linear-gradient(135deg, #1a0f0a 0%, #0a0604 100%)',
              border: '1px dashed rgba(232,168,48,0.5)'
            }}
          >
            <div>
              <div className="text-[10px] uppercase tracking-widest text-amber-700 font-bold">Alias</div>
              <div className="text-sm text-amber-200 font-mono mt-0.5">{_dynConfig?.bank_alias}</div>
            </div>
            <button
              onClick={copyAlias}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-bold transition"
              style={{
                background: aliasCopied ? 'rgba(22,163,74,0.3)' : 'rgba(139,69,19,0.3)',
                border: `1px solid ${aliasCopied ? '#16a34a' : 'rgba(232,168,48,0.3)'}`,
                color: aliasCopied ? '#86efac' : '#fde68a'
              }}
            >
              {aliasCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {aliasCopied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
        )}
      </div>

      <div
        className="sticky bottom-0 p-5 pt-4"
        style={{
          background: 'linear-gradient(180deg, transparent, #0a0604 30%)',
          borderTop: '1px solid rgba(139,69,19,0.3)'
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">Total del pedido</span>
          <span style={{ fontFamily: "'Karla', sans-serif", fontWeight: 800, fontSize: '26px', color: '#fde68a' }}>
            {formatPrice(total)}
          </span>
        </div>
        <button
          onClick={handleSubmit}
          className="w-full py-3.5 rounded-lg font-bold tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            color: '#fff',
            fontFamily: "'Alfa Slab One', serif",
            fontSize: '14px',
            letterSpacing: '0.1em',
            boxShadow: '0 6px 20px -4px rgba(22,163,74,0.6), inset 0 1px 0 rgba(255,255,255,0.3)',
            border: '1.5px solid rgba(134,239,172,0.5)'
          }}
        >
          <Send className="w-4 h-4" />
          ENVIAR POR WHATSAPP · {formatPrice(total)}
        </button>
      </div>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════
// CART DRAWER
// ═══════════════════════════════════════════════════════════

function CartItem({ item, onUpdateQty, onUpdateNotes, onRemove }) {
  const t = themes[item.theme];
  return (
    <div
      className="rounded-lg p-3 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${t.deep} 0%, #0a0604 100%)`,
        border: `1px solid ${t.accent}44`,
        boxShadow: `inset 0 1px 0 ${t.accent}22`
      }}
    >
      <div className="flex gap-3">
        <div
          className="flex-shrink-0 w-14 h-14 rounded-md flex items-center justify-center relative"
          style={{
            background: `radial-gradient(circle, ${t.deep} 0%, #000 100%)`,
            border: `1px solid ${t.accent}55`
          }}
        >
          <div className="w-[80%] h-[80%]">
            <MaskFor type={item.maskType} color={t.accent} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h4
                className="text-sm tracking-wide truncate"
                style={{ fontFamily: "'Alfa Slab One', serif", color: t.label }}
              >
                {item.name}
              </h4>
              <p className="text-[10px] text-amber-200/50 mt-0.5 leading-tight">
                {describeItem(item) || 'Sin personalización'}
              </p>
            </div>
            <button
              onClick={() => onRemove(item.cartId)}
              className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center hover:bg-red-900/30 transition"
              aria-label="Quitar"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400/70" />
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div
              className="flex items-center gap-1 rounded-md"
              style={{ background: '#0a0604', border: `1px solid ${t.accent}44` }}
            >
              <button
                onClick={() => onUpdateQty(item.cartId, Math.max(1, item.quantity - 1))}
                className="w-7 h-7 flex items-center justify-center hover:bg-stone-800 transition rounded-l-md"
                aria-label="Menos"
              >
                <Minus className="w-3 h-3" style={{ color: t.accent }} />
              </button>
              <span className="w-7 text-center text-sm font-bold" style={{ color: t.label, fontFamily: "'Alfa Slab One', serif" }}>
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQty(item.cartId, item.quantity + 1)}
                className="w-7 h-7 flex items-center justify-center hover:bg-stone-800 transition rounded-r-md"
                aria-label="Más"
              >
                <Plus className="w-3 h-3" style={{ color: t.accent }} />
              </button>
            </div>
            <span
              className="text-sm font-bold"
              style={{ color: t.label, fontFamily: "'Alfa Slab One', serif" }}
            >
              {formatPrice(itemSubtotal(item))}
            </span>
          </div>
        </div>
      </div>
      {item.notes && (
        <p className="mt-2 text-[11px] italic px-1" style={{ color: `${t.accent}bb` }}>
          📝 {item.notes}
        </p>
      )}
    </div>
  );
}

function CartDrawer({ isOpen, onClose, cart, onUpdateQty, onUpdateNotes, onRemove, onCheckout, generalNotes, onUpdateGeneralNotes }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const total = cart.reduce((s, item) => s + itemSubtotal(item), 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center animate-[fadeIn_0.2s_ease-out]"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full md:max-w-md max-h-[90vh] rounded-t-2xl md:rounded-2xl overflow-hidden flex flex-col animate-[slideUp_0.3s_ease-out]"
        style={{
          background: 'linear-gradient(180deg, #1a0f0a 0%, #0a0604 100%)',
          boxShadow: '0 -20px 60px -10px rgba(232,168,48,0.3), inset 0 1px 0 rgba(232,168,48,0.4)',
          border: '1px solid rgba(139,69,19,0.5)'
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
          }}
        />
        <div className="relative flex flex-col h-full">
          <div className="flex items-start justify-between px-5 pt-5 pb-3">
            <div>
              <h3
                className="text-2xl tracking-wide"
                style={{
                  fontFamily: "'Alfa Slab One', serif",
                  background: 'linear-gradient(180deg, #fde68a, #c74a1d)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                TU PEDIDO
              </h3>
              <p className="text-xs text-amber-200/60 mt-1 tracking-wider">
                {cart.length} {cart.length === 1 ? 'producto' : 'productos'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition hover:scale-110"
              style={{ background: 'rgba(139,69,19,0.3)', border: '1px solid rgba(232,168,48,0.3)' }}
            >
              <X className="w-4 h-4 text-amber-300" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 px-5 pb-3">
            <span className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-700/40 to-transparent" />
            <SunGlyph size={16} color="#b45309" opacity={0.7} />
            <span className="flex-1 h-px bg-gradient-to-l from-transparent via-amber-700/40 to-transparent" />
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2.5">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-amber-900 mx-auto mb-3 opacity-50" />
                <p className="text-sm text-amber-200/50">Tu pedido está vacío</p>
                <p className="text-xs text-amber-200/30 mt-1">Elegí algo de la carta</p>
              </div>
            ) : (
              cart.map((item) => (
                <CartItem
                  key={item.cartId}
                  item={item}
                  onUpdateQty={onUpdateQty}
                  onUpdateNotes={onUpdateNotes}
                  onRemove={onRemove}
                />
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div
              className="p-5 pt-4"
              style={{
                background: 'linear-gradient(180deg, transparent, #0a0604 30%)',
                borderTop: '1px solid rgba(139,69,19,0.3)'
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">Total</span>
                <span className="text-2xl font-bold" style={{ fontFamily: "'Alfa Slab One', serif", color: '#fde68a' }}>
                  {formatPrice(total)}
                </span>
              </div>
              <div className="mb-3">
                <p className="text-[10px] uppercase tracking-widest text-amber-700 font-bold mb-1.5">Aclaraciones generales (opcional)</p>
                <textarea
                  value={generalNotes}
                  onChange={(e) => onUpdateGeneralNotes(e.target.value)}
                  placeholder="Algo que quieras aclarar sobre el pedido..."
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-md resize-none focus:outline-none transition"
                  style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(139,69,19,0.4)', color: '#fde68a', fontFamily: "'Karla', sans-serif" }}
                />
              </div>
              <button
                onClick={onCheckout}
                className="w-full py-3.5 rounded-lg font-bold tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  color: '#fff',
                  fontFamily: "'Alfa Slab One', serif",
                  fontSize: '15px',
                  letterSpacing: '0.1em',
                  boxShadow: '0 6px 20px -4px rgba(22,163,74,0.6), inset 0 1px 0 rgba(255,255,255,0.3)',
                  border: '1.5px solid rgba(134,239,172,0.5)'
                }}
              >
                CONTINUAR CON EL PEDIDO
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CART BUTTON
// ═══════════════════════════════════════════════════════════

function CartButton({ count, onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110 active:scale-95"
      style={{
        background: 'linear-gradient(135deg, #e8a830 0%, #c74a1d 100%)',
        boxShadow: '0 8px 30px -5px rgba(232,168,48,0.6), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 6px rgba(0,0,0,0.3)',
        border: '2px solid rgba(253, 230, 138, 0.5)'
      }}
      aria-label="Ver carrito"
    >
      <ShoppingBag className="w-7 h-7 text-stone-950" strokeWidth={2.5} />
      {count > 0 && (
        <span
          className="absolute -top-1 -right-1 min-w-[24px] h-6 px-1.5 rounded-full text-xs font-bold flex items-center justify-center animate-[pop_0.3s_ease-out]"
          style={{ background: '#7f1d1d', color: '#fde68a', border: '2px solid #1a0a05' }}
        >
          {count}
        </span>
      )}
      <style>{`@keyframes pop { 0% { transform: scale(0.5); opacity: 0 } 100% { transform: scale(1); opacity: 1 } }`}</style>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════

function Footer() {
  return (
    <footer className="mt-10 pt-10 pb-28 px-6 relative">
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #78350f, #b45309, #78350f, transparent)' }}
      />
      <div className="flex items-center justify-center gap-3 mb-5">
        <SunGlyph size={32} color="#b45309" opacity={0.8} />
        <SunGlyph size={40} color="#d97706" opacity={0.9} />
        <SunGlyph size={32} color="#b45309" opacity={0.8} />
      </div>
      <h3 className="text-center text-3xl md:text-4xl tracking-wide"
        style={{
          fontFamily: "'Alfa Slab One', serif",
          background: 'linear-gradient(180deg, #fde68a, #c74a1d)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        {_dynConfig.name}
      </h3>
      <p className="text-center text-[10px] tracking-[0.3em] text-amber-700 mt-2 uppercase font-bold">
        {_dynConfig.tagline}
      </p>
      <div className="flex flex-col items-center gap-2.5 mt-8 text-sm text-amber-200/60">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-700" />
          <span>{_dynConfig.schedule}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-700" />
          <span>{_dynConfig.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Instagram className="w-4 h-4 text-amber-700" />
          <span>{_dynConfig.instagram}</span>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════

export default function App() {
  // ── Carga de datos desde Supabase ──────────────────────────
  const [appData, setAppData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    loadAppData().then(data => {
      // Actualizar variables de módulo para los componentes externos
      _dynConfig = data.config || defaultConfig;
      _dynExtras = data.extrasAvailable || defaultExtras.filter(e => e.active);
      _dynZones  = data.zones || defaultZones.filter(z => z.active);
      setAppData(data);
      setDataLoading(false);
    });
  }, []);

  const liveConfig       = appData?.config        || defaultConfig;
  const liveMenu         = appData?.menu          || buildMenu(defaultCategories, defaultProducts);
  const liveExtras       = appData?.extrasAvailable || defaultExtras;
  const liveZones        = appData?.zones         || defaultZones;
  // ──────────────────────────────────────────────────────────

  const [openCategory, setOpenCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [selectedMedallon, setSelectedMedallon] = useState(null);
  const [flowStep, setFlowStep] = useState(null); // 'medallon' | 'extras' | null

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [generalNotes, setGeneralNotes] = useState('');

  if (dataLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f0604', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={36} style={{ color: '#e8a830', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  const handleSelectProduct = (product) => {
    setActiveProduct(product);
    if (product.hasMedallon) {
      setFlowStep('medallon');
    } else if (DRINK_VARIANTS[product.id]) {
      setFlowStep('drinkVariant');
    }
    // Sides simples: manejados por handleAddSimple/handleRemoveSimple
  };

  const handleSelectDrinkVariant = (drinkVariant) => {
    addToCart(activeProduct, null, [], '', drinkVariant);
    resetFlow();
  };

  const handleSelectVariant = (variant) => {
    setSelectedMedallon(variant);
    setFlowStep('extras');
  };

  const handleConfirmExtras = (extras, notes) => {
    addToCart(activeProduct, selectedMedallon, extras, notes);
    resetFlow();
  };

  const addToCart = (product, variant, extras, notes = '', drinkVariant = null) => {
    const effectivePrice = drinkVariant ? drinkVariant.price : product.basePrice;
    const cartItem = {
      cartId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      productId: product.id,
      name: product.name,
      theme: product.theme,
      maskType: product.maskType,
      basePrice: effectivePrice,
      variantLabel: drinkVariant?.label || variant?.label || null,
      variantSurcharge: variant?.surcharge || 0,
      extras,
      quantity: 1,
      notes
    };
    setCart((prev) => [...prev, cartItem]);
  };

  // Handlers para +/- de acompañamientos y bebidas (sin personalización)
  const handleAddSimple = (product) => {
    const existing = cart.find(i => i.productId === product.id);
    if (existing) {
      updateQty(existing.cartId, existing.quantity + 1);
    } else {
      addToCart(product, null, [], '');
    }
  };

  const handleRemoveSimple = (product) => {
    const existing = cart.find(i => i.productId === product.id);
    if (!existing) return;
    if (existing.quantity > 1) {
      updateQty(existing.cartId, existing.quantity - 1);
    } else {
      removeItem(existing.cartId);
    }
  };

  const resetFlow = () => {
    setActiveProduct(null);
    setSelectedMedallon(null);
    setFlowStep(null);
  };

  const updateQty = (cartId, newQty) => {
    setCart((prev) => prev.map((i) => (i.cartId === cartId ? { ...i, quantity: newQty } : i)));
  };

  const updateNotes = (cartId, newNotes) => {
    setCart((prev) => prev.map((i) => (i.cartId === cartId ? { ...i, notes: newNotes } : i)));
  };

  const removeItem = (cartId) => {
    setCart((prev) => prev.filter((i) => i.cartId !== cartId));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSent = () => {
    setIsCheckoutOpen(false);
    setCart([]);
    setGeneralNotes('');
  };

  return (
    <div
      className="min-h-screen relative"
      style={{
        fontFamily: "'Karla', sans-serif",
        background: `
          radial-gradient(ellipse at 50% 0%, #2a1810 0%, transparent 50%),
          radial-gradient(ellipse at 0% 100%, #1a0a05 0%, transparent 60%),
          radial-gradient(ellipse at 100% 50%, #1a0505 0%, transparent 60%),
          linear-gradient(180deg, #0f0604 0%, #0a0403 100%)
        `,
        color: '#fde68a'
      }}
    >
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.08] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.9 0 0 0 0 0.6 0 0 0 0 0.3 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)'
        }}
      />
      <SideBorder side="left" />
      <SideBorder side="right" />

      <div className="relative z-10">
        <Hero />
        <main className="max-w-2xl mx-auto px-3 pb-6">
          {liveMenu.map((cat) => (
            <Category
              key={cat.id}
              category={cat}
              isOpen={openCategory === cat.id}
              onToggle={() => setOpenCategory(openCategory === cat.id ? null : cat.id)}
              onSelectProduct={handleSelectProduct}
              onDrinkVariant={handleSelectProduct}
              cartItems={cart}
              onAdd={handleAddSimple}
              onRemove={handleRemoveSimple}
            />
          ))}
        </main>
        <Footer />
      </div>

      <CartButton count={cart.reduce((s, i) => s + i.quantity, 0)} onClick={() => setIsCartOpen(true)} />

      <VariantModal
        product={activeProduct}
        isOpen={flowStep === 'medallon'}
        onClose={resetFlow}
        onSelect={handleSelectVariant}
      />

      <DrinkVariantModal
        product={activeProduct}
        isOpen={flowStep === 'drinkVariant'}
        onClose={resetFlow}
        onSelect={handleSelectDrinkVariant}
      />

      <ExtrasModal
        product={activeProduct}
        medallon={selectedMedallon}
        isOpen={flowStep === 'extras'}
        onClose={resetFlow}
        onConfirm={handleConfirmExtras}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={updateQty}
        onUpdateNotes={updateNotes}
        onRemove={removeItem}
        onCheckout={handleCheckout}
        generalNotes={generalNotes}
        onUpdateGeneralNotes={setGeneralNotes}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onSuccess={handleOrderSent}
        generalNotes={generalNotes}
      />
    </div>
  );
}
