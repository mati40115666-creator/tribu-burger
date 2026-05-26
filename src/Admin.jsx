import React, { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from './lib/supabase'
import {
  LogOut, Save, Plus, Trash2, ChevronDown, ChevronUp,
  Settings, UtensilsCrossed, MapPin, Layers, Eye, EyeOff,
  AlertCircle, CheckCircle, Loader2, RefreshCw, Upload, Image
} from 'lucide-react'

// ─── Estilos base ──────────────────────────────────────────
const dark   = { background: '#0f0604', color: '#fde68a', fontFamily: "'Karla', sans-serif", minHeight: '100vh' }
const card   = { background: '#1a0f0a', border: '1px solid rgba(139,69,19,0.4)', borderRadius: '12px', padding: '16px' }
const input  = { width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(139,69,19,0.5)', borderRadius: '8px', color: '#fde68a', padding: '10px 12px', fontSize: '14px', fontFamily: "'Karla', sans-serif", boxSizing: 'border-box' }
const btnPrimary = { background: 'linear-gradient(135deg, #e8a830, #c74a1d)', color: '#1a0a05', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Alfa Slab One', serif", letterSpacing: '0.05em' }
const btnDanger  = { background: 'rgba(127,29,29,0.3)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }
const btnGhost   = { background: 'rgba(139,69,19,0.2)', color: '#d4a574', border: '1px solid rgba(139,69,19,0.4)', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }
const label  = { display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(253,230,138,0.7)', marginBottom: '6px' }

const formatPrice = n => `$${Number(n).toLocaleString('es-AR')}`

// ─── Toast de feedback ─────────────────────────────────────
function Toast({ msg, type }) {
  if (!msg) return null
  return (
    <div style={{
      position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, display: 'flex', alignItems: 'center', gap: '8px',
      background: type === 'ok' ? '#14532d' : '#7f1d1d',
      border: `1px solid ${type === 'ok' ? '#16a34a' : '#dc2626'}`,
      borderRadius: '10px', padding: '10px 16px', color: '#fff', fontSize: '13px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.5)', maxWidth: '90vw'
    }}>
      {type === 'ok' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {msg}
    </div>
  )
}

// ─── LOGIN ─────────────────────────────────────────────────
function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setLoading(true); setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) setError('Email o contraseña incorrectos')
    setLoading(false)
  }

  return (
    <div style={{ ...dark, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ ...card, width: '100%', maxWidth: '360px' }}>
        <h1 style={{ fontFamily: "'Alfa Slab One', serif", fontSize: '22px', color: '#e8a830', marginBottom: '4px', textAlign: 'center' }}>
          TRIBU BURGER
        </h1>
        <p style={{ textAlign: 'center', color: 'rgba(253,230,138,0.5)', fontSize: '12px', letterSpacing: '0.2em', marginBottom: '24px' }}>
          PANEL DE ADMINISTRACIÓN
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <span style={label}>Email</span>
            <input style={input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@tribu.com" />
          </div>
          <div>
            <span style={label}>Contraseña</span>
            <input style={input} type="password" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="••••••••" />
          </div>
          {error && <p style={{ color: '#fca5a5', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertCircle size={14} /> {error}
          </p>}
          <button onClick={handleLogin} disabled={loading} style={{ ...btnPrimary, justifyContent: 'center', padding: '12px', marginTop: '4px', opacity: loading ? 0.7 : 1 }}>
            {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
            {loading ? 'Ingresando...' : 'INGRESAR'}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

// ─── TAB: CONFIGURACIÓN ────────────────────────────────────
function ConfigTab({ onToast }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('config').select('*').single().then(({ data: d }) => {
      if (d) setData(d)
      setLoading(false)
    })
  }, [])

  const save = async () => {
    setSaving(true)
    const { error } = await supabase.from('config').update(data).eq('id', 1)
    onToast(error ? 'Error al guardar' : 'Configuración guardada ✓', error ? 'err' : 'ok')
    setSaving(false)
  }

  if (loading) return <Spinner />
  if (!data) return null

  const fields = [
    { key: 'name', label: 'Nombre del local' },
    { key: 'tagline', label: 'Slogan' },
    { key: 'whatsapp', label: 'WhatsApp (con código de país, sin +)', hint: 'Ej: 5493426264360' },
    { key: 'schedule', label: 'Horario de atención' },
    { key: 'address', label: 'Dirección / Ciudad' },
    { key: 'instagram', label: 'Instagram (@usuario)' },
    { key: 'bank_alias', label: 'Alias bancario (CBU/CVU)' }
  ]

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {fields.map(f => (
        <div key={f.key}>
          <span style={label}>{f.label}</span>
          <input style={input} value={data[f.key] || ''} onChange={e => setData({ ...data, [f.key]: e.target.value })} />
          {f.hint && <p style={{ color: 'rgba(253,230,138,0.4)', fontSize: '11px', marginTop: '4px' }}>{f.hint}</p>}
        </div>
      ))}
      <button onClick={save} disabled={saving} style={{ ...btnPrimary, alignSelf: 'flex-end', marginTop: '8px' }}>
        {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
        {saving ? 'Guardando...' : 'GUARDAR'}
      </button>
    </div>
  )
}

// ─── TAB: MENÚ ─────────────────────────────────────────────
const THEMES = ['totem', 'azteca', 'maya', 'inca', 'ancestral', 'tribu']
const MASKS  = ['totem', 'azteca', 'maya', 'inca', 'ancestral', 'tribu', 'fries', 'drink', 'beer']

// ─── Componente de subida de imagen ────────────────────────
function ImageUpload({ productId, currentUrl, onUploaded }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentUrl || null)
  const inputRef = useRef()

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten imágenes')
      return
    }

    setUploading(true)
    try {
      // Preview local inmediato
      const localUrl = URL.createObjectURL(file)
      setPreview(localUrl)

      // Subir a Supabase Storage
      const ext = file.name.split('.').pop()
      const path = `${productId}-${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      // Obtener URL pública
      const { data } = supabase.storage.from('product-images').getPublicUrl(path)
      onUploaded(data.publicUrl)
    } catch (err) {
      alert('Error al subir la imagen: ' + err.message)
      setPreview(currentUrl || null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <span style={{ ...label, display: 'block', marginBottom: '8px' }}>Foto del producto</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0,
            background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(139,69,19,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          {preview
            ? <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <Image size={28} color="rgba(139,69,19,0.6)" />
          }
        </div>
        <div style={{ flex: 1 }}>
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
          <button
            onClick={() => inputRef.current.click()}
            disabled={uploading}
            style={{
              ...btnGhost,
              width: '100%',
              justifyContent: 'center',
              opacity: uploading ? 0.6 : 1
            }}
          >
            {uploading
              ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Subiendo...</>
              : <><Upload size={14} /> {preview ? 'Cambiar foto' : 'Subir foto'}</>
            }
          </button>
          {preview && (
            <p style={{ fontSize: '11px', color: 'rgba(253,230,138,0.4)', marginTop: '4px', textAlign: 'center' }}>
              ✓ Foto cargada
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function ProductRow({ product, categories, onSave, onDelete, onToggle }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(product)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await onSave(form)
    setSaving(false)
    setOpen(false)
  }

  return (
    <div style={{ ...card, padding: '12px', marginBottom: '8px', borderColor: product.active ? 'rgba(139,69,19,0.4)' : 'rgba(139,69,19,0.15)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => onToggle(product)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: product.active ? '#e8a830' : '#78350f', flexShrink: 0 }}>
          {product.active ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Alfa Slab One', serif", fontSize: '14px', color: product.active ? '#e8c99a' : '#78350f', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {product.name}
          </div>
          <div style={{ fontSize: '12px', color: '#e8a830', marginTop: '2px' }}>{formatPrice(product.base_price)}</div>
        </div>
        <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d4a574', flexShrink: 0 }}>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {open && (
        <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(139,69,19,0.3)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <span style={label}>Nombre</span>
            <input style={input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <span style={label}>Subtítulo (ej: LA DE LA CASA)</span>
            <input style={input} value={form.subtitle || ''} onChange={e => setForm({ ...form, subtitle: e.target.value || null })} placeholder="Opcional" />
          </div>
          <div>
            <span style={label}>Descripción / Ingredientes</span>
            <textarea style={{ ...input, minHeight: '70px', resize: 'vertical' }} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <span style={label}>Precio ($)</span>
              <input style={input} type="number" value={form.base_price} onChange={e => setForm({ ...form, base_price: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <span style={label}>Categoría</span>
              <select style={{ ...input }} value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <span style={label}>Color (tema)</span>
              <select style={{ ...input }} value={form.theme} onChange={e => setForm({ ...form, theme: e.target.value })}>
                {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <span style={label}>Ícono (máscara)</span>
              <select style={{ ...input }} value={form.mask_type} onChange={e => setForm({ ...form, mask_type: e.target.value })}>
                {MASKS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="checkbox" id={`med-${product.id}`} checked={form.has_medallon} onChange={e => setForm({ ...form, has_medallon: e.target.checked })} />
            <label htmlFor={`med-${product.id}`} style={{ color: '#d4a574', fontSize: '13px', cursor: 'pointer' }}>Tiene opción Veggie / Carne</label>
          </div>
          <ImageUpload
            productId={product.id}
            currentUrl={form.image_url || null}
            onUploaded={(url) => setForm({ ...form, image_url: url })}
          />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
            <button onClick={() => onDelete(product)} style={btnDanger}>
              <Trash2 size={14} /> Eliminar
            </button>
            <button onClick={handleSave} disabled={saving} style={btnPrimary}>
              {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
              {saving ? 'Guardando...' : 'GUARDAR'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function NewProductForm({ categories, onSave, onCancel }) {
  const [form, setForm] = useState({
    id: '', category_id: categories[0]?.id || 'burgers', name: '', subtitle: '', description: '',
    base_price: 10000, has_medallon: true, theme: 'totem', mask_type: 'totem', sort_order: 99, active: true
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!form.name.trim() || !form.id.trim()) return
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  return (
    <div style={{ ...card, borderColor: '#e8a830', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <p style={{ fontFamily: "'Alfa Slab One', serif", color: '#e8a830', fontSize: '14px', margin: 0 }}>+ NUEVO PRODUCTO</p>
      <div>
        <span style={label}>ID único (sin espacios, ej: "nueva-burger")</span>
        <input style={input} value={form.id} onChange={e => setForm({ ...form, id: e.target.value.toLowerCase().replace(/\s/g, '-') })} placeholder="nueva-burger" />
      </div>
      <div>
        <span style={label}>Nombre</span>
        <input style={input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      </div>
      <div>
        <span style={label}>Subtítulo (opcional)</span>
        <input style={input} value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} placeholder="ej: LA DE LA CASA" />
      </div>
      <div>
        <span style={label}>Descripción / Ingredientes</span>
        <textarea style={{ ...input, minHeight: '70px', resize: 'vertical' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <span style={label}>Precio ($)</span>
          <input style={input} type="number" value={form.base_price} onChange={e => setForm({ ...form, base_price: parseInt(e.target.value) || 0 })} />
        </div>
        <div>
          <span style={label}>Categoría</span>
          <select style={{ ...input }} value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <span style={label}>Color</span>
          <select style={{ ...input }} value={form.theme} onChange={e => setForm({ ...form, theme: e.target.value })}>
            {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <span style={label}>Ícono</span>
          <select style={{ ...input }} value={form.mask_type} onChange={e => setForm({ ...form, mask_type: e.target.value })}>
            {MASKS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input type="checkbox" id="new-med" checked={form.has_medallon} onChange={e => setForm({ ...form, has_medallon: e.target.checked })} />
        <label htmlFor="new-med" style={{ color: '#d4a574', fontSize: '13px', cursor: 'pointer' }}>Tiene opción Veggie / Carne</label>
      </div>
      <ImageUpload
        productId={form.id || 'nuevo-producto'}
        currentUrl={form.image_url || null}
        onUploaded={(url) => setForm({ ...form, image_url: url })}
      />
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={btnGhost}>Cancelar</button>
        <button onClick={handleSave} disabled={saving || !form.name.trim() || !form.id.trim()} style={{ ...btnPrimary, opacity: (!form.name.trim() || !form.id.trim()) ? 0.5 : 1 }}>
          {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={14} />}
          AGREGAR
        </button>
      </div>
    </div>
  )
}

function MenuTab({ onToast }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)

  const load = useCallback(async () => {
    const [{ data: cats }, { data: prods }] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('products').select('*').order('sort_order')
    ])
    setCategories(cats || [])
    setProducts(prods || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async (p) => {
    const { error } = await supabase.from('products').update(p).eq('id', p.id)
    if (error) { onToast('Error al guardar', 'err'); return }
    setProducts(prev => prev.map(x => x.id === p.id ? p : x))
    onToast('Producto guardado ✓', 'ok')
  }

  const handleToggle = async (p) => {
    const updated = { ...p, active: !p.active }
    await supabase.from('products').update({ active: updated.active }).eq('id', p.id)
    setProducts(prev => prev.map(x => x.id === p.id ? updated : x))
  }

  const handleDelete = async (p) => {
    if (!window.confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`)) return
    const { error } = await supabase.from('products').delete().eq('id', p.id)
    if (error) { onToast('Error al eliminar', 'err'); return }
    setProducts(prev => prev.filter(x => x.id !== p.id))
    onToast('Producto eliminado', 'ok')
  }

  const handleNew = async (p) => {
    const { error } = await supabase.from('products').insert(p)
    if (error) { onToast(error.message.includes('duplicate') ? 'El ID ya existe, usá otro' : 'Error al crear', 'err'); return }
    setShowNew(false)
    onToast('Producto creado ✓', 'ok')
    load()
  }

  if (loading) return <Spinner />

  return (
    <div style={{ padding: '16px' }}>
      {categories.map(cat => (
        <div key={cat.id} style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: "'Alfa Slab One', serif", fontSize: '13px', color: '#e8a830', letterSpacing: '0.15em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ flex: 1, height: '1px', background: 'rgba(139,69,19,0.4)' }} />
            {cat.name}
            <span style={{ flex: 1, height: '1px', background: 'rgba(139,69,19,0.4)' }} />
          </div>
          {products.filter(p => p.category_id === cat.id).sort((a, b) => a.sort_order - b.sort_order).map(p => (
            <ProductRow key={p.id} product={p} categories={categories} onSave={handleSave} onDelete={handleDelete} onToggle={handleToggle} />
          ))}
        </div>
      ))}

      {showNew
        ? <NewProductForm categories={categories} onSave={handleNew} onCancel={() => setShowNew(false)} />
        : <button onClick={() => setShowNew(true)} style={{ ...btnGhost, width: '100%', justifyContent: 'center', padding: '12px' }}>
            <Plus size={16} /> Agregar nuevo producto
          </button>
      }
    </div>
  )
}

// ─── TAB: EXTRAS ───────────────────────────────────────────
function SimpleListTab({ table, fields, idField = 'id', onToast }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [showNew, setShowNew] = useState(false)
  const [newForm, setNewForm] = useState({})

  const emptyForm = fields.reduce((acc, f) => ({ ...acc, [f.key]: f.default ?? '' }), { [idField]: '' })

  useEffect(() => {
    supabase.from(table).select('*').then(({ data }) => {
      setItems(data || [])
      setLoading(false)
    })
  }, [table])

  const handleSave = async () => {
    const { error } = await supabase.from(table).update(editForm).eq(idField, editForm[idField])
    if (error) { onToast('Error al guardar', 'err'); return }
    setItems(prev => prev.map(x => x[idField] === editForm[idField] ? editForm : x))
    setEditId(null)
    onToast('Guardado ✓', 'ok')
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`¿Eliminar "${item.name}"?`)) return
    const { error } = await supabase.from(table).delete().eq(idField, item[idField])
    if (error) { onToast('Error al eliminar', 'err'); return }
    setItems(prev => prev.filter(x => x[idField] !== item[idField]))
    onToast('Eliminado', 'ok')
  }

  const handleToggle = async (item) => {
    const updated = { ...item, active: !item.active }
    await supabase.from(table).update({ active: updated.active }).eq(idField, item[idField])
    setItems(prev => prev.map(x => x[idField] === item[idField] ? updated : x))
  }

  const handleNew = async () => {
    const { error } = await supabase.from(table).insert({ ...newForm, active: true })
    if (error) { onToast(error.message.includes('duplicate') ? 'El ID ya existe' : 'Error', 'err'); return }
    const { data } = await supabase.from(table).select('*')
    setItems(data || [])
    setShowNew(false)
    setNewForm(emptyForm)
    onToast('Creado ✓', 'ok')
  }

  if (loading) return <Spinner />

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.map(item => (
        <div key={item[idField]} style={{ ...card, padding: '12px' }}>
          {editId === item[idField] ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {fields.map(f => (
                <div key={f.key}>
                  <span style={label}>{f.label}</span>
                  <input style={input} type={f.type || 'text'} value={editForm[f.key] ?? ''} onChange={e => setEditForm({ ...editForm, [f.key]: f.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value })} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button onClick={() => setEditId(null)} style={btnGhost}>Cancelar</button>
                <button onClick={handleSave} style={btnPrimary}><Save size={14} /> GUARDAR</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button onClick={() => handleToggle(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: item.active ? '#e8a830' : '#78350f' }}>
                {item.active ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#e8c99a', fontWeight: 700, fontSize: '14px' }}>{item.name}</div>
                {item.price !== undefined && <div style={{ color: '#e8a830', fontSize: '13px' }}>{formatPrice(item.price)}</div>}
              </div>
              <button onClick={() => { setEditId(item[idField]); setEditForm(item) }} style={btnGhost}>Editar</button>
              <button onClick={() => handleDelete(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fca5a5', padding: '4px' }}>
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      ))}

      {showNew ? (
        <div style={{ ...card, borderColor: '#e8a830', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ fontFamily: "'Alfa Slab One', serif", color: '#e8a830', fontSize: '14px', margin: 0 }}>+ NUEVO</p>
          <div>
            <span style={label}>ID único (sin espacios)</span>
            <input style={input} value={newForm[idField] || ''} onChange={e => setNewForm({ ...newForm, [idField]: e.target.value.toLowerCase().replace(/\s/g, '-') })} placeholder="mi-nuevo-item" />
          </div>
          {fields.map(f => (
            <div key={f.key}>
              <span style={label}>{f.label}</span>
              <input style={input} type={f.type || 'text'} value={newForm[f.key] ?? ''} onChange={e => setNewForm({ ...newForm, [f.key]: f.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value })} />
            </div>
          ))}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button onClick={() => { setShowNew(false); setNewForm(emptyForm) }} style={btnGhost}>Cancelar</button>
            <button onClick={handleNew} style={btnPrimary}><Plus size={14} /> AGREGAR</button>
          </div>
        </div>
      ) : (
        <button onClick={() => { setShowNew(true); setNewForm(emptyForm) }} style={{ ...btnGhost, justifyContent: 'center', padding: '12px' }}>
          <Plus size={16} /> Agregar nuevo
        </button>
      )}
    </div>
  )
}

// ─── SPINNER ───────────────────────────────────────────────
function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
      <Loader2 size={28} style={{ color: '#e8a830', animation: 'spin 1s linear infinite' }} />
    </div>
  )
}

// ─── DASHBOARD PRINCIPAL ───────────────────────────────────
const TABS = [
  { id: 'config',  label: 'General',  Icon: Settings },
  { id: 'menu',    label: 'Menú',     Icon: UtensilsCrossed },
  { id: 'extras',  label: 'Extras',   Icon: Layers },
  { id: 'zones',   label: 'Zonas',    Icon: MapPin }
]

function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('config')
  const [toast, setToast] = useState({ msg: '', type: 'ok' })

  const showToast = useCallback((msg, type = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast({ msg: '', type: 'ok' }), 3000)
  }, [])

  return (
    <div style={{ ...dark, paddingBottom: '70px' }}>
      {/* Header */}
      <div style={{ background: '#1a0f0a', borderBottom: '1px solid rgba(139,69,19,0.4)', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: "'Alfa Slab One', serif", fontSize: '18px', color: '#e8a830', margin: 0 }}>TRIBU BURGER</h1>
          <p style={{ fontSize: '11px', color: 'rgba(253,230,138,0.4)', margin: 0, letterSpacing: '0.15em' }}>PANEL ADMIN</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <a href="/" target="_blank" style={{ ...btnGhost, textDecoration: 'none', fontSize: '12px' }}>
            <Eye size={14} /> Ver menú
          </a>
          <button onClick={onLogout} style={{ ...btnDanger, fontSize: '12px' }}>
            <LogOut size={14} />
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div>
        {activeTab === 'config' && <ConfigTab onToast={showToast} />}
        {activeTab === 'menu'   && <MenuTab onToast={showToast} />}
        {activeTab === 'extras' && (
          <SimpleListTab
            table="extras" onToast={showToast}
            fields={[
              { key: 'name', label: 'Nombre' },
              { key: 'price', label: 'Precio ($)', type: 'number', default: 2000 }
            ]}
          />
        )}
        {activeTab === 'zones' && (
          <SimpleListTab
            table="zones" onToast={showToast}
            fields={[
              { key: 'name', label: 'Nombre de la zona' },
              { key: 'price', label: 'Costo de envío ($)', type: 'number', default: 2000 }
            ]}
          />
        )}
      </div>

      {/* Bottom nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: '#1a0f0a', borderTop: '1px solid rgba(139,69,19,0.4)',
        display: 'flex'
      }}>
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              flex: 1, padding: '10px 0', border: 'none', cursor: 'pointer',
              background: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              color: activeTab === id ? '#e8a830' : 'rgba(253,230,138,0.35)',
              borderTop: activeTab === id ? '2px solid #e8a830' : '2px solid transparent'
            }}
          >
            <Icon size={20} />
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em' }}>{label}</span>
          </button>
        ))}
      </nav>

      <Toast msg={toast.msg} type={toast.type} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } } * { box-sizing: border-box; }`}</style>
    </div>
  )
}

// ─── ENTRY POINT ───────────────────────────────────────────
export default function Admin() {
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!supabase) { setChecking(false); return }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setChecking(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = () => supabase.auth.signOut()

  if (checking) {
    return (
      <div style={{ ...dark, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Loader2 size={32} style={{ color: '#e8a830', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (!supabase) {
    return (
      <div style={{ ...dark, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center' }}>
        <div>
          <AlertCircle size={40} style={{ color: '#c74a1d', marginBottom: '12px' }} />
          <p style={{ color: '#fde68a', fontWeight: 700 }}>Supabase no configurado</p>
          <p style={{ color: 'rgba(253,230,138,0.5)', fontSize: '13px' }}>Completá las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY</p>
        </div>
      </div>
    )
  }

  return session ? <Dashboard onLogout={handleLogout} /> : <Login />
}
