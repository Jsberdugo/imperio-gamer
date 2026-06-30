import { useState, useRef, useCallback, useEffect } from "react";
import {
  Wallet, RefreshCw, ShoppingCart, History, Package, Zap, Crown,
  Check, Clock, X, Bitcoin, Star, Mail, Lock,
  Eye, EyeOff, ArrowLeft, User, Gamepad2, Music, Smartphone,
  Monitor, Headphones, Shield, Swords, Trophy, Flame, Gift, Tv,
  Pencil, LogOut, Copy, Download, FileText, ChevronRight,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────
   TIER SYSTEM
────────────────────────────────────────────────────────────── */
const TIERS = [
  { name: "Bronce",   min: 0,    max: 99.99,   discount: 0,  color: "#CD7F32", dimColor: "#7a4a18", bg: "rgba(205,127,50,0.1)",  border: "rgba(205,127,50,0.35)", next: 100,  label: "Nivel de entrada",     perks: ["Acceso al catálogo completo","Soporte estándar"] },
  { name: "Plata",    min: 100,  max: 499.99,  discount: 3,  color: "#B8C4CC", dimColor: "#6b7a82", bg: "rgba(184,196,204,0.1)", border: "rgba(184,196,204,0.3)", next: 500,  label: "Comprador frecuente",  perks: ["3% descuento","Soporte prioritario","Ofertas Plata"] },
  { name: "Oro",      min: 500,  max: 1999.99, discount: 7,  color: "#D4A843", dimColor: "#8a6a1a", bg: "rgba(212,168,67,0.1)",  border: "rgba(212,168,67,0.3)",  next: 2000, label: "Comprador premium",    perks: ["7% descuento","Soporte VIP 24/7","Acceso anticipado","Bonos de recarga"] },
  { name: "Diamante", min: 2000, max: Infinity, discount: 12, color: "#5DD9FC", dimColor: "#1a7a9a", bg: "rgba(93,217,252,0.08)", border: "rgba(93,217,252,0.3)",  next: null, label: "Élite Imperio Gamer",  perks: ["12% descuento","Gestor dedicado","Precios especiales","Productos limitados","Cashback 2%"] },
] as const;

type TierName = typeof TIERS[number]["name"];
function getTier(spent: number) { return [...TIERS].reverse().find(t => spent >= t.min) ?? TIERS[0]; }

/* ──────────────────────────────────────────────────────────────
   PRODUCT INSTRUCTIONS
────────────────────────────────────────────────────────────── */
const INSTRUCTIONS: Record<string, { steps: string[]; note?: string }> = {
  Roblox:     { steps: ["Ve a roblox.com/redeem","Inicia sesión en tu cuenta","Ingresa el código y haz clic en Canjear","Los Robux aparecerán en tu cuenta al instante"] },
  Fortnite:   { steps: ["Abre el juego Fortnite","Ve a la Tienda del ítem","Selecciona el ícono de regalo (esquina superior)","Ingresa el código y confirma"] },
  Steam:      { steps: ["Abre Steam en tu PC o navegador","Ve a Juegos > Canjear un código de Steam","Ingresa el código exactamente como aparece","El saldo o juego se añadirá a tu cuenta"] },
  PSN:        { steps: ["Abre PlayStation Store","Selecciona tu avatar en la parte superior","Elige 'Canjear códigos'","Ingresa el código de 12 dígitos y confirma"] },
  Xbox:       { steps: ["Ve a xbox.com/redeem o abre la app Xbox","Inicia sesión en tu cuenta Microsoft","Ingresa el código de 25 caracteres","El saldo se añadirá inmediatamente"] },
  "Riot Games":{ steps: ["Ve a riotgames.com/es-es/riot-points-shop","Inicia sesión en tu cuenta Riot","Selecciona 'Canjear código'","Los puntos se acreditarán en tu cuenta"], note: "Aplica para Valorant VP y League of Legends RP." },
  Discord:    { steps: ["Ve a discord.com o abre la app","Haz clic en Configuración > Nitro","Selecciona '¿Ya tienes un código?'","Ingresa el código y disfruta Nitro"] },
  Spotify:    { steps: ["Ve a spotify.com/redeem","Inicia sesión en tu cuenta Spotify","Ingresa el código de regalo","La suscripción Premium se activará de inmediato"] },
  Netflix:    { steps: ["Ve a netflix.com/redeem","Inicia sesión o crea una cuenta","Ingresa el código del regalo","Tu suscripción quedará activa"] },
  Google:     { steps: ["Abre la app Google Play en tu dispositivo","Toca tu foto de perfil","Ve a Pagos y suscripciones > Canjear código","Ingresa el código y confirma"] },
  Apple:      { steps: ["Abre App Store en tu iPhone o iPad","Toca tu foto de perfil","Selecciona 'Canjear regalo o código'","Ingresa el código o apunta la cámara"] },
};

/* ──────────────────────────────────────────────────────────────
   CODE GENERATOR
────────────────────────────────────────────────────────────── */
function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `${seg()}-${seg()}-${seg()}-${seg()}`;
}

/* ──────────────────────────────────────────────────────────────
   DATA
────────────────────────────────────────────────────────────── */
const PRODUCTS = [
  { id: 1,  name: "Robux 4500",       category: "Roblox",     price: 10.00, maxUnits: 10, tag: "Popular", icon: Gamepad2,   color: "#FF5252" },
  { id: 2,  name: "V-Bucks 2800",     category: "Fortnite",   price: 20.00, maxUnits: 5,  tag: "Hot",     icon: Flame,      color: "#7B68EE" },
  { id: 3,  name: "Steam Wallet $20", category: "Steam",      price: 20.00, maxUnits: 3,  tag: null,      icon: Monitor,    color: "#66C0F4" },
  { id: 4,  name: "PlayStation $25",  category: "PSN",        price: 25.00, maxUnits: 2,  tag: "Oferta",  icon: Trophy,     color: "#003087" },
  { id: 5,  name: "Xbox Game Pass",   category: "Xbox",       price: 15.00, maxUnits: 4,  tag: null,      icon: Shield,     color: "#52B043" },
  { id: 6,  name: "Valorant 1650 VP", category: "Riot Games", price: 10.00, maxUnits: 6,  tag: "Popular", icon: Swords,     color: "#D13639" },
  { id: 7,  name: "Discord Nitro 1M", category: "Discord",    price: 8.00,  maxUnits: 5,  tag: null,      icon: Headphones, color: "#5865F2" },
  { id: 8,  name: "Spotify Premium",  category: "Spotify",    price: 9.00,  maxUnits: 5,  tag: null,      icon: Music,      color: "#1DB954" },
  { id: 9,  name: "League RP 3250",   category: "Riot Games", price: 20.00, maxUnits: 4,  tag: "Hot",     icon: Crown,      color: "#C89B3C" },
  { id: 10, name: "Netflix Premium",  category: "Netflix",    price: 18.00, maxUnits: 2,  tag: null,      icon: Tv,         color: "#E50914" },
  { id: 11, name: "Google Play $15",  category: "Google",     price: 15.00, maxUnits: 4,  tag: null,      icon: Smartphone, color: "#4285F4" },
  { id: 12, name: "Apple Gift $25",   category: "Apple",      price: 25.00, maxUnits: 2,  tag: "Nuevo",   icon: Gift,       color: "#A2AAAD" },
];

interface TxBase { id: string; date: string; status: "Completado" | "Pendiente" | "Cancelado"; }
interface PurchaseTx extends TxBase { type: "compra"; product: string; productId: number; qty: number; amount: string; amountNum: number; codes: string[]; category: string; }
interface RechargeTx extends TxBase { type: "recarga"; amount: string; amountNum: number; }
type Transaction = PurchaseTx | RechargeTx;

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: "TXN-2847", type: "compra",  product: "Robux 4500",     productId: 1,  qty: 3, date: "28 Jun 2026, 14:32", amount: "$30.00",  amountNum: 30,  status: "Completado", category: "Roblox",     codes: [generateCode(), generateCode(), generateCode()] },
  { id: "TXN-2846", type: "recarga", date: "28 Jun 2026, 11:05", amount: "$100.00", amountNum: 100, status: "Completado" },
  { id: "TXN-2845", type: "compra",  product: "V-Bucks 2800",   productId: 2,  qty: 2, date: "27 Jun 2026, 20:18", amount: "$40.00",  amountNum: 40,  status: "Pendiente",  category: "Fortnite",   codes: [generateCode(), generateCode()] },
  { id: "TXN-2844", type: "compra",  product: "Xbox Game Pass", productId: 5,  qty: 1, date: "27 Jun 2026, 16:44", amount: "$15.00",  amountNum: 15,  status: "Completado", category: "Xbox",       codes: [generateCode()] },
  { id: "TXN-2843", type: "recarga", date: "26 Jun 2026, 09:22", amount: "$50.00",  amountNum: 50,  status: "Cancelado" },
  { id: "TXN-2842", type: "compra",  product: "Discord Nitro × 5", productId: 7, qty: 5, date: "25 Jun 2026, 18:55", amount: "$40.00", amountNum: 40, status: "Completado", category: "Discord",   codes: Array.from({ length: 5 }, generateCode) },
];

const PRESET_AMOUNTS = [10, 25, 50, 100, 200];

/* ──────────────────────────────────────────────────────────────
   TIER ICON
────────────────────────────────────────────────────────────── */
function TierIcon({ tier, size = 18 }: { tier: ReturnType<typeof getTier>; size?: number }) {
  const s = size; const c = tier.color;
  if (tier.name === "Bronce") {
    const pts = Array.from({ length: 5 }, (_, i) => { const a = (i * 72 - 90) * (Math.PI / 180); return `${s/2+(s*.42)*Math.cos(a)},${s/2+(s*.42)*Math.sin(a)}`; }).join(" ");
    const inner = Array.from({ length: 5 }, (_, i) => { const a = (i * 72 - 90) * (Math.PI / 180); return `${s/2+(s*.22)*Math.cos(a)},${s/2+(s*.22)*Math.sin(a)}`; }).join(" ");
    return <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><polygon points={pts} fill={`${c}28`} stroke={c} strokeWidth="1.5"/><polygon points={inner} fill={c} opacity="0.7"/></svg>;
  }
  if (tier.name === "Plata") {
    const pts = Array.from({ length: 6 }, (_, i) => { const a = (i * 60 - 90) * (Math.PI / 180); return `${s/2+(s*.43)*Math.cos(a)},${s/2+(s*.43)*Math.sin(a)}`; }).join(" ");
    return <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><polygon points={pts} fill={`${c}22`} stroke={c} strokeWidth="1.5"/><line x1={s*.3} y1={s/2} x2={s*.7} y2={s/2} stroke={c} strokeWidth="1.5" opacity="0.8"/><line x1={s/2} y1={s*.3} x2={s/2} y2={s*.7} stroke={c} strokeWidth="1.5" opacity="0.8"/></svg>;
  }
  if (tier.name === "Oro") {
    const o = s*.44, inn = s*.22, cx = s/2, cy = s/2;
    const pts = Array.from({ length: 12 }, (_, i) => { const a = (i*30-90)*(Math.PI/180); const r = i%2===0?o:inn; return `${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`; }).join(" ");
    return <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><polygon points={pts} fill={c} opacity="0.85"/></svg>;
  }
  const cx = s/2, cy = s/2;
  return <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><polygon points={`${cx},${cy-s*.44} ${cx+s*.32},${cy} ${cx},${cy+s*.44} ${cx-s*.32},${cy}`} fill={`${c}28`} stroke={c} strokeWidth="1.5"/><polygon points={`${cx},${cy-s*.22} ${cx+s*.16},${cy} ${cx},${cy+s*.22} ${cx-s*.16},${cy}`} fill={c} opacity="0.9"/><circle cx={cx+s*.44} cy={cy-s*.3} r="1.2" fill={c} opacity="0.7"/></svg>;
}

/* ──────────────────────────────────────────────────────────────
   COIN CANVAS
────────────────────────────────────────────────────────────── */
function CoinCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    interface Coin { x:number;y:number;r:number;speed:number;opacity:number;rot:number;rotSpeed:number;wobble:number;wobbleSpeed:number; }
    const count = window.innerWidth < 640 ? 22 : 55;
    const coins: Coin[] = Array.from({ length: count }, () => ({ x:Math.random()*window.innerWidth, y:Math.random()*window.innerHeight*2-window.innerHeight, r:5+Math.random()*11, speed:.6+Math.random()*1.4, opacity:.12+Math.random()*.28, rot:Math.random()*Math.PI*2, rotSpeed:(Math.random()-.5)*.06, wobble:Math.random()*Math.PI*2, wobbleSpeed:.012+Math.random()*.018 }));
    let animId: number;
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      coins.forEach(c => {
        c.y+=c.speed; c.rot+=c.rotSpeed; c.wobble+=c.wobbleSpeed; c.x+=Math.sin(c.wobble)*.5;
        if (c.y-c.r>canvas.height) { c.y=-c.r*2; c.x=Math.random()*canvas.width; }
        ctx.save(); ctx.translate(c.x,c.y); ctx.rotate(c.rot); ctx.globalAlpha=c.opacity;
        ctx.scale(1,Math.abs(Math.cos(c.rot))*.4+.6);
        const g=ctx.createRadialGradient(-c.r*.3,-c.r*.3,0,0,0,c.r); g.addColorStop(0,"#ffe57a"); g.addColorStop(.5,"#d4a843"); g.addColorStop(1,"#7a5800");
        ctx.beginPath(); ctx.arc(0,0,c.r,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
        ctx.beginPath(); ctx.arc(-c.r*.25,-c.r*.25,c.r*.38,0,Math.PI*2); ctx.fillStyle="rgba(255,240,120,0.35)"; ctx.fill();
        ctx.restore();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize",resize); cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{zIndex:1}}/>;
}

/* ──────────────────────────────────────────────────────────────
   TILT CARD
────────────────────────────────────────────────────────────── */
function TiltCard({ children, className="" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({x:0,y:0});
  const [glow, setGlow] = useState({x:50,y:50});
  const [hovered, setHovered] = useState(false);
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setTilt({x:((e.clientY-r.top-r.height/2)/(r.height/2))*-10, y:((e.clientX-r.left-r.width/2)/(r.width/2))*10});
    setGlow({x:((e.clientX-r.left)/r.width)*100, y:((e.clientY-r.top)/r.height)*100});
  }, []);
  return (
    <div ref={ref} className={`relative ${className}`} style={{perspective:"700px"}} onMouseMove={onMove} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>{setTilt({x:0,y:0});setHovered(false);}}>
      <div className="h-full transition-transform duration-100 ease-out" style={{transform:`rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,transformStyle:"preserve-3d"}}>
        {hovered && <div className="absolute inset-0 rounded-xl pointer-events-none z-10" style={{background:`radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(212,168,67,0.6) 0%, rgba(24,165,84,0.2) 40%, transparent 65%)`,padding:"1.5px",WebkitMask:"linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",WebkitMaskComposite:"xor",maskComposite:"exclude"}}/>}
        <div className="absolute inset-0 rounded-xl pointer-events-none" style={{border:"1px solid rgba(212,168,67,0.2)",opacity:hovered?0:1,transition:"opacity 0.3s"}}/>
        {children}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   STATUS BADGE
────────────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string,{bg:string;text:string;icon:React.ReactNode}> = {
    Completado:{bg:"bg-green-900/40",text:"text-green-400",icon:<Check className="w-3 h-3"/>},
    Pendiente: {bg:"bg-yellow-900/40",text:"text-yellow-400",icon:<Clock className="w-3 h-3"/>},
    Cancelado: {bg:"bg-red-900/40",text:"text-red-400",icon:<X className="w-3 h-3"/>},
  };
  const s = map[status] ?? map.Pendiente;
  return <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>{s.icon}{status}</span>;
}

/* ──────────────────────────────────────────────────────────────
   PRODUCT CARD
────────────────────────────────────────────────────────────── */
function ProductCard({ product, loggedIn, onLoginRequired, onRequestBuy, tier, justConfirmed }: {
  product: typeof PRODUCTS[0];
  loggedIn: boolean;
  onLoginRequired: (name: string) => void;
  onRequestBuy: (product: typeof PRODUCTS[0]) => void;
  tier: ReturnType<typeof getTier>;
  justConfirmed: boolean;
}) {
  const Icon = product.icon;
  const discount = tier.discount;
  const finalPrice = product.price * (1 - discount / 100);
  const handleBuy = () => { if (!loggedIn) { onLoginRequired(product.name); return; } onRequestBuy(product); };
  return (
    <TiltCard className="h-full">
      <div className="h-full rounded-xl p-4 flex flex-col gap-3" style={{background:"rgba(16,20,28,0.88)",backdropFilter:"blur(8px)"}}>
        <div className="h-0.5 rounded-full" style={{background:`linear-gradient(90deg, ${product.color}, transparent)`}}/>
        <div className="flex items-start justify-between">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{background:`${product.color}22`,border:`1px solid ${product.color}44`}}>
            <Icon className="w-5 h-5" style={{color:product.color}}/>
          </div>
          {product.tag && <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded" style={{background:"rgba(212,168,67,0.18)",color:"#d4a843"}}>{product.tag}</span>}
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground font-semibold tracking-widest uppercase">{product.category}</p>
          <h3 className="font-bold leading-tight mt-0.5" style={{fontFamily:"'Rajdhani', sans-serif",fontSize:"1rem"}}>{product.name}</h3>
        </div>
        <div>
          {discount > 0 ? (
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-bold" style={{fontFamily:"'Rajdhani', sans-serif",color:"#d4a843"}}>${finalPrice.toFixed(2)}</p>
              <p className="text-xs line-through text-muted-foreground">${product.price.toFixed(2)}</p>
            </div>
          ) : <p className="text-xl font-bold" style={{fontFamily:"'Rajdhani', sans-serif",color:"#d4a843"}}>${product.price.toFixed(2)}</p>}
          {discount > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{background:tier.bg,color:tier.color,border:`1px solid ${tier.border}`}}>-{discount}% {tier.name}</span>}
        </div>
        <p className="text-[11px] text-muted-foreground">Máx. <span className="text-foreground font-semibold">{product.maxUnits}</span> unid.</p>
        <div className="mt-auto">
          <button onClick={handleBuy}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-bold transition-all duration-200 hover:brightness-110 active:scale-95"
            style={{background:justConfirmed?"linear-gradient(135deg,#d4a843,#a07020)":"linear-gradient(135deg,#18a554,#0f7a3d)",color:"#fff",fontFamily:"'Rajdhani', sans-serif"}}>
            {justConfirmed ? <><Check className="w-3.5 h-3.5"/>¡Listo!</> : <><ShoppingCart className="w-3.5 h-3.5"/>Comprar</>}
          </button>
        </div>
      </div>
    </TiltCard>
  );
}

/* ──────────────────────────────────────────────────────────────
   CONFIRM PURCHASE MODAL  (qty selector + description)
────────────────────────────────────────────────────────────── */
interface PendingPurchase { product: typeof PRODUCTS[0]; }

function ConfirmPurchaseModal({ pending, balance, tier, onConfirm, onCancel }: {
  pending: PendingPurchase;
  balance: number;
  tier: ReturnType<typeof getTier>;
  onConfirm: (qty: number) => void;
  onCancel: () => void;
}) {
  const { product } = pending;
  const [qty, setQty] = useState(1);
  const Icon = product.icon;
  const discount = tier.discount;
  const finalPrice = product.price * (1 - discount / 100);
  const total = finalPrice * qty;
  const balanceAfter = balance - total;
  const insufficient = balanceAfter < 0;
  const instructions = INSTRUCTIONS[product.category];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 overflow-y-auto"
      style={{background:"rgba(9,11,15,0.88)",backdropFilter:"blur(8px)"}}
      onClick={e=>{if(e.target===e.currentTarget)onCancel();}}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl my-auto" style={{background:"#10141c",border:"1px solid rgba(212,168,67,0.3)"}}>

        {/* header */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between" style={{borderBottom:"1px solid rgba(212,168,67,0.1)"}}>
          <h3 className="text-lg font-bold" style={{fontFamily:"'Rajdhani', sans-serif"}}>Confirmar Compra</h3>
          <button onClick={onCancel} className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"><X className="w-4 h-4"/></button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* product */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{background:`${product.color}22`,border:`1px solid ${product.color}55`}}>
              <Icon className="w-7 h-7" style={{color:product.color}}/>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold tracking-widest uppercase">{product.category}</p>
              <p className="font-bold text-base" style={{fontFamily:"'Rajdhani', sans-serif"}}>{product.name}</p>
              {discount > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 inline-block" style={{background:tier.bg,color:tier.color,border:`1px solid ${tier.border}`}}>-{discount}% {tier.name}</span>}
            </div>
          </div>

          {/* how to redeem */}
          {instructions && (
            <div className="rounded-xl p-4" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)"}}>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">¿Cómo canjear este código?</p>
              <ol className="space-y-1.5">
                {instructions.steps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
                    <span className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5" style={{background:"rgba(212,168,67,0.15)",color:"#d4a843"}}>{i+1}</span>
                    {step}
                  </li>
                ))}
              </ol>
              {instructions.note && <p className="text-[11px] text-muted-foreground mt-2 italic">{instructions.note}</p>}
            </div>
          )}

          {/* qty selector */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Cantidad (máx. {product.maxUnits})</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-xl overflow-hidden" style={{border:"1px solid rgba(212,168,67,0.25)"}}>
                <button className="px-4 py-2.5 text-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" onClick={()=>setQty(q=>Math.max(1,q-1))}>−</button>
                <span className="px-5 py-2.5 font-mono font-bold text-foreground text-lg min-w-[3rem] text-center">{qty}</span>
                <button className="px-4 py-2.5 text-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" onClick={()=>setQty(q=>Math.min(product.maxUnits,q+1))}>+</button>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">${finalPrice.toFixed(2)} c/u</p>
                <p className="text-xl font-bold" style={{fontFamily:"'Rajdhani', sans-serif",color:"#d4a843"}}>${total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* balance impact */}
          <div className="rounded-xl p-3.5 space-y-2" style={{background:insufficient?"rgba(212,56,56,0.08)":"rgba(255,255,255,0.03)",border:`1px solid ${insufficient?"rgba(212,56,56,0.3)":"rgba(212,168,67,0.12)"}`}}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tu saldo actual</span>
              <span className="font-mono font-semibold">${balance.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Saldo después</span>
              <span className="font-mono font-semibold" style={{color:insufficient?"#ef4444":"#18a554"}}>${balanceAfter.toFixed(2)}</span>
            </div>
            {insufficient && <p className="text-xs font-medium pt-1" style={{color:"#ef4444"}}>Saldo insuficiente — recarga antes de continuar.</p>}
          </div>

          {/* actions */}
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-secondary active:scale-95" style={{border:"1px solid rgba(212,168,67,0.2)",color:"#8a8fa0"}}>Cancelar</button>
            <button onClick={()=>onConfirm(qty)} disabled={insufficient}
              className="flex-1 py-3 rounded-xl text-sm font-bold transition-all hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{background:insufficient?"#1a1f2e":"linear-gradient(135deg,#18a554,#0f7a3d)",color:"#fff",fontFamily:"'Rajdhani', sans-serif",boxShadow:insufficient?"none":"0 4px 16px rgba(24,165,84,0.3)"}}>
              <span className="flex items-center justify-center gap-1.5"><Check className="w-4 h-4"/>Confirmar Compra</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   RECEIPT VIEW
────────────────────────────────────────────────────────────── */
interface Receipt {
  product: typeof PRODUCTS[0];
  qty: number;
  unitPrice: number;
  total: number;
  codes: string[];
  txId: string;
  date: string;
}

function ReceiptView({ receipt, onContinue, onHistory }: { receipt: Receipt; onContinue: () => void; onHistory: () => void; }) {
  const { product, qty, unitPrice, total, codes, txId, date } = receipt;
  const Icon = product.icon;
  const instructions = INSTRUCTIONS[product.category];
  const [copiedAll, setCopiedAll] = useState(false);

  const copyAll = () => {
    navigator.clipboard.writeText(codes.join("\n"));
    setCopiedAll(true); setTimeout(()=>setCopiedAll(false), 2000);
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* success header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{background:"rgba(24,165,84,0.15)",border:"2px solid rgba(24,165,84,0.5)",boxShadow:"0 0 30px rgba(24,165,84,0.2)"}}>
          <Check className="w-8 h-8" style={{color:"#18a554"}}/>
        </div>
        <h2 className="text-2xl font-bold mb-1" style={{fontFamily:"'Rajdhani', sans-serif",color:"#18a554"}}>¡Compra Exitosa!</h2>
        <p className="text-sm text-muted-foreground">{txId} · {date}</p>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{background:"rgba(16,20,28,0.9)",border:"1px solid rgba(212,168,67,0.25)"}}>
        {/* product summary */}
        <div className="px-6 py-5 flex items-center gap-4" style={{borderBottom:"1px solid rgba(212,168,67,0.1)"}}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{background:`${product.color}22`,border:`1px solid ${product.color}44`}}>
            <Icon className="w-6 h-6" style={{color:product.color}}/>
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">{product.category}</p>
            <p className="font-bold" style={{fontFamily:"'Rajdhani', sans-serif"}}>{product.name}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">{qty} unid. × ${unitPrice.toFixed(2)}</p>
            <p className="font-bold text-lg" style={{fontFamily:"'Rajdhani', sans-serif",color:"#d4a843"}}>${total.toFixed(2)}</p>
          </div>
        </div>

        {/* codes */}
        <div className="px-6 py-5" style={{borderBottom:"1px solid rgba(212,168,67,0.1)"}}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold uppercase tracking-widest" style={{color:"#d4a843"}}>Tus Códigos ({codes.length})</p>
            <button onClick={copyAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95"
              style={{background:copiedAll?"rgba(24,165,84,0.2)":"rgba(212,168,67,0.12)",color:copiedAll?"#18a554":"#d4a843",border:`1px solid ${copiedAll?"rgba(24,165,84,0.4)":"rgba(212,168,67,0.3)"}`}}>
              {copiedAll ? <><Check className="w-3 h-3"/>Copiados</> : <><Copy className="w-3 h-3"/>Copiar todos</>}
            </button>
          </div>
          <div className="space-y-2">
            {codes.map((code, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-lg" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)"}}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold w-5 text-center" style={{color:"#d4a843"}}>#{i+1}</span>
                  <span className="font-mono text-sm font-semibold tracking-widest text-foreground">{code}</span>
                </div>
                <button onClick={()=>navigator.clipboard.writeText(code)} className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors">
                  <Copy className="w-3.5 h-3.5"/>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* how to redeem */}
        {instructions && (
          <div className="px-6 py-5" style={{borderBottom:"1px solid rgba(212,168,67,0.1)"}}>
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{color:"#d4a843"}}>¿Cómo canjear?</p>
            <ol className="space-y-2">
              {instructions.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                  <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5" style={{background:"rgba(212,168,67,0.15)",color:"#d4a843"}}>{i+1}</span>
                  {step}
                </li>
              ))}
            </ol>
            {instructions.note && <p className="text-xs text-muted-foreground mt-3 italic">{instructions.note}</p>}
          </div>
        )}

        {/* actions */}
        <div className="px-6 py-5 flex gap-3">
          <button onClick={onHistory}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-secondary active:scale-95"
            style={{border:"1px solid rgba(212,168,67,0.2)",color:"#8a8fa0"}}>
            <History className="w-4 h-4"/>Historial
          </button>
          <button onClick={onContinue}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all hover:brightness-110 active:scale-95"
            style={{background:"linear-gradient(135deg,#d4a843,#a07020)",color:"#0a0c10",fontFamily:"'Rajdhani', sans-serif",boxShadow:"0 4px 16px rgba(212,168,67,0.3)"}}>
            <ShoppingCart className="w-4 h-4"/>Seguir Comprando
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   CSV DOWNLOAD HELPER
────────────────────────────────────────────────────────────── */
function downloadCodesCSV(codes: string[], productName: string, txId: string) {
  const rows = ["#,Código", ...codes.map((c, i) => `${i + 1},${c}`)].join("\n");
  const blob = new Blob([rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `codigos-${productName.replace(/\s+/g, "-")}-${txId}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ──────────────────────────────────────────────────────────────
   CODES MODAL
────────────────────────────────────────────────────────────── */
function CodesModal({ tx, onClose }: { tx: PurchaseTx; onClose: () => void }) {
  const [copiedAll, setCopiedAll] = useState(false);
  const product = PRODUCTS.find(p => p.id === tx.productId);
  const Icon = product?.icon ?? Package;

  const copyAll = () => {
    navigator.clipboard.writeText(tx.codes.join("\n"));
    setCopiedAll(true); setTimeout(()=>setCopiedAll(false),2000);
  };

  const downloadCSV = () => downloadCodesCSV(tx.codes, tx.product, tx.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{background:"rgba(9,11,15,0.88)",backdropFilter:"blur(8px)"}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl" style={{background:"#10141c",border:"1px solid rgba(212,168,67,0.3)"}}>
        <div className="px-5 pt-5 pb-4 flex items-center justify-between" style={{borderBottom:"1px solid rgba(212,168,67,0.1)"}}>
          <div className="flex items-center gap-3">
            <Icon className="w-4 h-4" style={{color:product?.color??"#d4a843"}}/>
            <h3 className="font-bold" style={{fontFamily:"'Rajdhani', sans-serif"}}>{tx.product}</h3>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"><X className="w-4 h-4"/></button>
        </div>

        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-xs text-muted-foreground flex-1">{tx.codes.length} código{tx.codes.length>1?"s":""} · {tx.date}</p>
            <button onClick={copyAll} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all" style={{background:copiedAll?"rgba(24,165,84,0.2)":"rgba(212,168,67,0.12)",color:copiedAll?"#18a554":"#d4a843",border:`1px solid ${copiedAll?"rgba(24,165,84,0.4)":"rgba(212,168,67,0.25)"}`}}>
              {copiedAll?<><Check className="w-3 h-3"/>Copiados</>:<><Copy className="w-3 h-3"/>Copiar todos</>}
            </button>
            <button onClick={downloadCSV} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all" style={{background:"rgba(93,217,252,0.08)",color:"#5DD9FC",border:"1px solid rgba(93,217,252,0.25)"}}>
              <Download className="w-3 h-3"/>Excel
            </button>
          </div>
          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {tx.codes.map((code,i)=>(
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"}}>
                <span className="text-xs font-bold w-4 shrink-0 text-center" style={{color:"#d4a843"}}>#{i+1}</span>
                <span className="font-mono text-sm font-semibold tracking-wider flex-1">{code}</span>
                <button onClick={()=>navigator.clipboard.writeText(code)} className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors shrink-0"><Copy className="w-3 h-3"/></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   TRANSACTIONS TABLE
────────────────────────────────────────────────────────────── */
function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
  const [codesModal, setCodesModal] = useState<PurchaseTx | null>(null);

  return (
    <>
      <div className="rounded-2xl overflow-hidden" style={{border:"1px solid rgba(212,168,67,0.18)"}}>
        {/* desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{background:"rgba(16,20,28,0.9)",borderBottom:"1px solid rgba(212,168,67,0.12)"}}>
                {["ID","Tipo","Descripción","Fecha","Monto","Estado",""].map(h=>(
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-widest" style={{color:"#8a8fa0"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx,i)=>(
                <tr key={tx.id} className="transition-colors duration-150 hover:bg-secondary/40" style={{background:i%2===0?"rgba(16,20,28,0.85)":"rgba(13,16,24,0.85)",borderBottom:"1px solid rgba(212,168,67,0.06)"}}>
                  <td className="px-4 py-3.5"><span className="text-xs font-mono font-medium" style={{color:"#d4a843"}}>{tx.id}</span></td>
                  <td className="px-4 py-3.5">
                    {tx.type === "recarga"
                      ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold" style={{background:"rgba(93,217,252,0.1)",color:"#5DD9FC",border:"1px solid rgba(93,217,252,0.25)"}}><Wallet className="w-2.5 h-2.5"/>Saldo</span>
                      : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold" style={{background:"rgba(212,168,67,0.1)",color:"#d4a843",border:"1px solid rgba(212,168,67,0.25)"}}><ShoppingCart className="w-2.5 h-2.5"/>Compra</span>}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm">{tx.type==="recarga" ? "Recarga de saldo" : (tx as PurchaseTx).product}</span>
                    {tx.type==="compra" && <p className="text-xs text-muted-foreground">{(tx as PurchaseTx).qty} unid.</p>}
                  </td>
                  <td className="px-4 py-3.5"><span className="text-sm text-muted-foreground">{tx.date}</span></td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-semibold font-mono" style={{color:tx.type==="recarga"?"#18a554":undefined}}>
                      {tx.type==="recarga" ? `+${tx.amount}` : tx.amount}
                    </span>
                  </td>
                  <td className="px-4 py-3.5"><StatusBadge status={tx.status}/></td>
                  <td className="px-4 py-3.5">
                    {tx.type==="compra" && tx.status==="Completado" && (
                      <div className="flex items-center gap-1.5">
                        <button onClick={()=>setCodesModal(tx as PurchaseTx)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all hover:brightness-110 whitespace-nowrap"
                          style={{background:"rgba(212,168,67,0.1)",color:"#d4a843",border:"1px solid rgba(212,168,67,0.25)"}}>
                          <FileText className="w-3 h-3"/>Ver códigos
                        </button>
                        <button onClick={()=>downloadCodesCSV((tx as PurchaseTx).codes,(tx as PurchaseTx).product,tx.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all hover:brightness-110 whitespace-nowrap"
                          style={{background:"rgba(93,217,252,0.08)",color:"#5DD9FC",border:"1px solid rgba(93,217,252,0.25)"}}>
                          <Download className="w-3 h-3"/>Excel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* mobile */}
        <div className="sm:hidden divide-y" style={{borderColor:"rgba(212,168,67,0.08)"}}>
          {transactions.map(tx=>(
            <div key={tx.id} className="p-4 space-y-2" style={{background:"rgba(16,20,28,0.9)"}}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-medium" style={{color:"#d4a843"}}>{tx.id}</span>
                <div className="flex items-center gap-2">
                  {tx.type==="recarga"
                    ? <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full" style={{background:"rgba(93,217,252,0.1)",color:"#5DD9FC"}}><Wallet className="w-2.5 h-2.5"/>Saldo</span>
                    : <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:"rgba(212,168,67,0.1)",color:"#d4a843"}}>Compra</span>}
                  <StatusBadge status={tx.status}/>
                </div>
              </div>
              <p className="text-sm">{tx.type==="recarga"?"Recarga de saldo":(tx as PurchaseTx).product}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{tx.date}</p>
                <p className="text-sm font-semibold font-mono" style={{color:tx.type==="recarga"?"#18a554":undefined}}>
                  {tx.type==="recarga"?`+${tx.amount}`:tx.amount}
                </p>
              </div>
              {tx.type==="compra" && tx.status==="Completado" && (
                <div className="flex gap-2">
                  <button onClick={()=>setCodesModal(tx as PurchaseTx)}
                    className="flex-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold justify-center transition-all"
                    style={{background:"rgba(212,168,67,0.08)",color:"#d4a843",border:"1px solid rgba(212,168,67,0.2)"}}>
                    <FileText className="w-3 h-3"/>Ver códigos
                  </button>
                  <button onClick={()=>downloadCodesCSV((tx as PurchaseTx).codes,(tx as PurchaseTx).product,tx.id)}
                    className="flex-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold justify-center transition-all"
                    style={{background:"rgba(93,217,252,0.08)",color:"#5DD9FC",border:"1px solid rgba(93,217,252,0.25)"}}>
                    <Download className="w-3 h-3"/>Excel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {codesModal && <CodesModal tx={codesModal} onClose={()=>setCodesModal(null)}/>}
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   PROFILE SECTION
────────────────────────────────────────────────────────────── */
function ProfileSection({ username, setUsername, totalSpent }: { username: string; setUsername: (v:string)=>void; totalSpent: number; }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(username);
  const tier = getTier(totalSpent);
  const nextTier = TIERS.find(t=>t.min>tier.min)??null;
  const progress = nextTier ? Math.min(100,(totalSpent/nextTier.min)*100) : 100;
  const save = () => { if(draft.trim()) setUsername(draft.trim()); setEditing(false); };
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl p-6 sm:p-8" style={{background:"rgba(16,20,28,0.88)",backdropFilter:"blur(12px)",border:`1px solid ${tier.border}`}}>
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0" style={{background:tier.bg,border:`2px solid ${tier.border}`,color:tier.color,fontFamily:"'Rajdhani', sans-serif"}}>{username.charAt(0).toUpperCase()}</div>
            <div>
              {editing ? (
                <div className="flex items-center gap-2">
                  <input autoFocus value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")save();if(e.key==="Escape")setEditing(false);}} className="px-3 py-1.5 rounded-lg text-foreground text-lg font-bold focus:outline-none focus:ring-2" style={{background:"#161b26",border:"1px solid rgba(212,168,67,0.3)",fontFamily:"'Rajdhani', sans-serif",["--tw-ring-color" as string]:"#d4a843",maxWidth:"180px"}}/>
                  <button onClick={save} className="p-1.5 rounded-lg transition-colors hover:bg-green-900/40" style={{color:"#18a554"}}><Check className="w-4 h-4"/></button>
                  <button onClick={()=>setEditing(false)} className="p-1.5 rounded-lg transition-colors hover:bg-red-900/40" style={{color:"#ef4444"}}><X className="w-4 h-4"/></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold" style={{fontFamily:"'Rajdhani', sans-serif"}}>{username}</h2>
                  <button onClick={()=>{setDraft(username);setEditing(true);}} className="p-1 rounded transition-colors text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5"/></button>
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-0.5">Mayorista · Imperio Gamer</p>
            </div>
          </div>
          <div className="shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl" style={{background:tier.bg,border:`1px solid ${tier.border}`}}>
            <TierIcon tier={tier} size={32}/><span className="text-xs font-bold tracking-widest uppercase" style={{color:tier.color}}>{tier.name}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[["Total gastado",`$${totalSpent.toFixed(0)}`],["Transacciones","124"],["Descuento activo",tier.discount>0?`-${tier.discount}%`:"—"]].map(([label,val])=>(
            <div key={label} className="px-3 py-3 rounded-xl text-center" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(212,168,67,0.1)"}}>
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className="text-lg font-bold" style={{fontFamily:"'Rajdhani', sans-serif",color:label==="Descuento activo"&&tier.discount>0?"#18a554":"#f0ede6"}}>{val}</p>
            </div>
          ))}
        </div>
        {nextTier ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Progreso hacia <span className="font-semibold" style={{color:nextTier.color}}>{nextTier.name}</span></p>
              <p className="text-xs font-mono text-muted-foreground">${totalSpent.toFixed(0)} / ${nextTier.min}</p>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{background:"rgba(255,255,255,0.06)"}}>
              <div className="h-full rounded-full transition-all duration-700" style={{width:`${progress}%`,background:`linear-gradient(90deg, ${tier.color}, ${nextTier.color})`}}/>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Te faltan <span className="font-semibold text-foreground">${(nextTier.min-totalSpent).toFixed(0)}</span> para alcanzar {nextTier.name}</p>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{background:"rgba(93,217,252,0.08)",border:"1px solid rgba(93,217,252,0.3)"}}>
            <TierIcon tier={tier} size={18}/>
            <p className="text-sm font-semibold" style={{color:"#5DD9FC"}}>Nivel máximo alcanzado — ¡Eres élite Imperio Gamer!</p>
          </div>
        )}
      </div>
      <div className="rounded-2xl p-6" style={{background:"rgba(16,20,28,0.88)",backdropFilter:"blur(12px)",border:"1px solid rgba(212,168,67,0.18)"}}>
        <h3 className="text-lg font-bold mb-5" style={{fontFamily:"'Rajdhani', sans-serif"}}>Sistema de Niveles</h3>
        <div className="space-y-3">
          {TIERS.map((t,i)=>{
            const isActive=t.name===tier.name; const isPast=TIERS.indexOf(t)<TIERS.indexOf(tier); const isFuture=!isActive&&!isPast;
            return (
              <div key={t.name} className="flex gap-4 p-4 rounded-xl" style={{background:isActive?t.bg:"rgba(255,255,255,0.02)",border:`1px solid ${isActive?t.border:"rgba(255,255,255,0.06)"}`,opacity:isFuture?0.55:1}}>
                <div className="shrink-0 flex flex-col items-center gap-1 pt-0.5">
                  <TierIcon tier={t} size={24}/>
                  {i<TIERS.length-1&&<div className="w-px flex-1 mt-2" style={{background:isActive||isPast?t.color+"44":"rgba(255,255,255,0.08)",minHeight:"12px"}}/>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold" style={{fontFamily:"'Rajdhani', sans-serif",color:t.color}}>{t.name}</span>
                    <span className="text-xs text-muted-foreground">{t.label}</span>
                    {isActive&&<span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{background:t.bg,color:t.color,border:`1px solid ${t.border}`}}>Nivel actual</span>}
                    <span className="text-xs text-muted-foreground ml-auto">{t.max===Infinity?`$${t.min}+`:`$${t.min}–$${t.max}`}</span>
                  </div>
                  <ul className="space-y-0.5">
                    {t.perks.map(p=>(
                      <li key={p} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Check className="w-3 h-3 shrink-0" style={{color:isPast||isActive?t.color:"#4a4f60"}}/>{p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   GOOGLE ICON
────────────────────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────
   AUTH PANEL
────────────────────────────────────────────────────────────── */
type AuthView = "login" | "register" | "forgot";
function AuthPanel({ onLogin }: { onLogin: () => void }) {
  const [view, setView] = useState<AuthView>("login");
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false); const [loading, setLoading] = useState(false); const [sent, setSent] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if(view==="forgot"){setSent(true);return;} setLoading(true); setTimeout(()=>{setLoading(false);onLogin();},900); };
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-2xl p-8 shadow-2xl" style={{background:"rgba(10,12,16,0.92)",backdropFilter:"blur(24px)",border:"1px solid rgba(212,168,67,0.25)"}}>
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style={{background:"linear-gradient(135deg,#d4a843,#a07020)",boxShadow:"0 8px 32px rgba(212,168,67,0.35)"}}><Crown className="w-7 h-7 text-black"/></div>
          <h1 className="text-2xl font-bold tracking-wider uppercase" style={{fontFamily:"'Rajdhani', sans-serif",color:"#d4a843"}}>Imperio Gamer</h1>
          <p className="text-xs text-muted-foreground mt-1 tracking-widest uppercase">Tienda Mayorista</p>
        </div>
        <div className="mb-6">
          {view!=="login"&&<button onClick={()=>{setView("login");setSent(false);}} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors"><ArrowLeft className="w-3.5 h-3.5"/>Volver al inicio de sesión</button>}
          <h2 className="text-xl font-bold" style={{fontFamily:"'Rajdhani', sans-serif"}}>{view==="login"?"Iniciar Sesión":view==="register"?"Crear Cuenta":"Recuperar Contraseña"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{view==="login"?"Accede a tu cuenta mayorista":view==="register"?"Únete a Imperio Gamer hoy":"Te enviaremos instrucciones por correo"}</p>
        </div>
        {view==="forgot"&&sent ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{background:"rgba(24,165,84,0.15)",border:"1px solid rgba(24,165,84,0.4)"}}><Check className="w-7 h-7" style={{color:"#18a554"}}/></div>
            <p className="font-semibold mb-1">Correo enviado</p>
            <p className="text-sm text-muted-foreground">Revisa tu bandeja en <span className="text-primary">{email||"tu correo"}</span></p>
            <button onClick={()=>{setView("login");setSent(false);}} className="mt-6 text-sm font-medium" style={{color:"#d4a843"}}>Volver al inicio de sesión</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {view==="register"&&<div className="relative"><User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/><input required value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre completo" className="w-full pl-10 pr-4 py-3 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2" style={{background:"#161b26",border:"1px solid rgba(212,168,67,0.2)",["--tw-ring-color" as string]:"#d4a843"}}/></div>}
            <div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Correo electrónico" className="w-full pl-10 pr-4 py-3 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2" style={{background:"#161b26",border:"1px solid rgba(212,168,67,0.2)",["--tw-ring-color" as string]:"#d4a843"}}/></div>
            {view!=="forgot"&&<div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/><input required type={showPw?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Contraseña" className="w-full pl-10 pr-11 py-3 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2" style={{background:"#161b26",border:"1px solid rgba(212,168,67,0.2)",["--tw-ring-color" as string]:"#d4a843"}}/><button type="button" onClick={()=>setShowPw(s=>!s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">{showPw?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button></div>}
            {view==="login"&&<div className="flex justify-end"><button type="button" onClick={()=>setView("forgot")} className="text-xs font-medium transition-colors hover:text-primary" style={{color:"#8a8fa0"}}>¿Olvidaste tu contraseña?</button></div>}
            <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl font-bold tracking-wider uppercase transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-70" style={{background:"linear-gradient(135deg,#d4a843,#a07020)",color:"#0a0c10",fontFamily:"'Rajdhani', sans-serif",fontSize:"0.95rem",boxShadow:"0 4px 20px rgba(212,168,67,0.3)"}}>
              {loading?<span className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4 animate-spin"/>Verificando...</span>:view==="login"?"Iniciar Sesión":view==="register"?"Crear Cuenta":"Enviar instrucciones"}
            </button>
            {view==="login"&&<><div className="flex items-center gap-3 my-1"><div className="flex-1 h-px" style={{background:"rgba(212,168,67,0.15)"}}/><span className="text-xs text-muted-foreground">o continúa con</span><div className="flex-1 h-px" style={{background:"rgba(212,168,67,0.15)"}}/></div><button type="button" onClick={onLogin} className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:brightness-105 active:scale-[0.98]" style={{background:"#fff",color:"#1a1a1a",boxShadow:"0 2px 12px rgba(0,0,0,0.4)"}}><GoogleIcon/>Continuar con Google</button></>}
            {view==="login"&&<p className="text-center text-sm text-muted-foreground pt-1">¿No tienes cuenta?{" "}<button type="button" onClick={()=>setView("register")} className="font-semibold" style={{color:"#d4a843"}}>Regístrate gratis</button></p>}
            {view==="register"&&<p className="text-center text-sm text-muted-foreground">¿Ya tienes cuenta?{" "}<button type="button" onClick={()=>setView("login")} className="font-semibold" style={{color:"#d4a843"}}>Inicia sesión</button></p>}
          </form>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   LOGIN MODAL
────────────────────────────────────────────────────────────── */
function LoginModal({ onClose, onLogin, pendingProduct }: { onClose:()=>void; onLogin:()=>void; pendingProduct:string; }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{background:"rgba(9,11,15,0.82)",backdropFilter:"blur(6px)"}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="w-full max-w-md relative">
        <button onClick={onClose} className="absolute -top-4 -right-4 w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-secondary z-10" style={{background:"rgba(16,20,28,0.95)",border:"1px solid rgba(212,168,67,0.2)"}}><X className="w-4 h-4 text-muted-foreground"/></button>
        <div className="mb-3 px-4 py-3 rounded-xl flex items-center gap-3" style={{background:"rgba(212,168,67,0.12)",border:"1px solid rgba(212,168,67,0.3)"}}>
          <ShoppingCart className="w-4 h-4 shrink-0" style={{color:"#d4a843"}}/>
          <p className="text-sm leading-relaxed" style={{color:"#f0ede6"}}>Para comprar <span className="font-semibold" style={{color:"#d4a843"}}>{pendingProduct}</span> necesitas iniciar sesión — es rápido. ¡Funciona para no perder tus compras y puntos!</p>
        </div>
        <AuthPanel onLogin={onLogin}/>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   DASHBOARD
────────────────────────────────────────────────────────────── */
type Section = "productos" | "saldo" | "historial" | "perfil";

function Dashboard({ loggedIn, username, setUsername, totalSpent, onLogout, onLoginOpen, onLoginNav }: {
  loggedIn: boolean; username: string; setUsername: (v:string)=>void; totalSpent: number;
  onLogout: ()=>void; onLoginOpen: (p:string)=>void; onLoginNav: ()=>void;
}) {
  const [section, setSection] = useState<Section>("productos");
  const [selectedAmount, setSelectedAmount] = useState<number|null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [glowing, setGlowing] = useState(false);
  const [balance, setBalance] = useState(1247.50);
  const [pendingPurchase, setPendingPurchase] = useState<PendingPurchase|null>(null);
  const [receipt, setReceipt] = useState<Receipt|null>(null);
  const [lastConfirmedId, setLastConfirmedId] = useState<number|null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const binanceRef = useRef<HTMLDivElement>(null);

  const tier = getTier(totalSpent);
  const finalAmount = customAmount ? parseFloat(customAmount)||0 : selectedAmount??0;

  const scrollToBinance = () => {
    setSection("saldo"); setReceipt(null);
    setTimeout(()=>{ binanceRef.current?.scrollIntoView({behavior:"smooth",block:"center"}); setGlowing(true); setTimeout(()=>setGlowing(false),2800); },60);
  };

  const handleRequestBuy = (product: typeof PRODUCTS[0]) => { setPendingPurchase({ product }); };

  const handleConfirmPurchase = (qty: number) => {
    if (!pendingPurchase) return;
    const { product } = pendingPurchase;
    const discount = tier.discount;
    const unitPrice = product.price * (1 - discount/100);
    const total = unitPrice * qty;
    const codes = Array.from({ length: qty }, generateCode);
    const txId = `TXN-${Math.floor(1000+Math.random()*8999)}`;
    const date = new Date().toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
    const newTx: PurchaseTx = { id: txId, type:"compra", product: product.name, productId: product.id, qty, date, amount:`$${total.toFixed(2)}`, amountNum: total, status:"Completado", codes, category: product.category };
    setTransactions(prev=>[newTx,...prev]);
    setBalance(b=>b-total);
    setLastConfirmedId(product.id);
    setPendingPurchase(null);
    setReceipt({ product, qty, unitPrice, total, codes, txId, date });
    setTimeout(()=>setLastConfirmedId(null),2000);
  };

  const navItems: [Section,string,React.ElementType][] = [
    ["productos","Productos",Package],["saldo","Mi Saldo",Wallet],["historial","Historial",History],
    ...(loggedIn?[["perfil","Perfil",User] as [Section,string,React.ElementType]]:[]),
  ];

  const handleSectionChange = (s: Section) => { setSection(s); setReceipt(null); };

  return (
    <div className="min-h-screen flex flex-col" style={{fontFamily:"'Inter', sans-serif"}}>
      {/* NAV */}
      <nav className="sticky top-0 z-40 border-b border-border" style={{background:"rgba(9,11,15,0.88)",backdropFilter:"blur(16px)"}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"linear-gradient(135deg,#d4a843,#a07020)"}}><Crown className="w-4 h-4 text-black"/></div>
            <span className="text-lg font-bold tracking-wider uppercase hidden sm:block" style={{fontFamily:"'Rajdhani', sans-serif",color:"#d4a843"}}>Imperio Gamer</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 flex-1 justify-center">
            {navItems.map(([key,label,Icon])=>(
              <button key={key} onClick={()=>handleSectionChange(key)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200" style={section===key&&!receipt?{background:"rgba(212,168,67,0.12)",color:"#d4a843"}:{color:"#8a8fa0"}}>
                <Icon className="w-4 h-4"/>{label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {loggedIn ? (
              <>
                <button onClick={scrollToBinance} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all hover:brightness-110" title="Recargar saldo" style={{background:"rgba(24,165,84,0.12)",border:"1px solid rgba(24,165,84,0.3)"}}>
                  <Wallet className="w-3.5 h-3.5" style={{color:"#18a554"}}/>
                  <span className="text-sm font-bold font-mono" style={{color:"#18a554"}}>${balance.toFixed(2)}</span>
                </button>
                <button onClick={()=>{setReceipt(null);setSection("perfil");}} className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all hover:brightness-110" style={{background:tier.bg,border:`1px solid ${tier.border}`}}>
                  <TierIcon tier={tier} size={16}/>
                  <span className="text-sm font-semibold hidden sm:block" style={{color:tier.color,fontFamily:"'Rajdhani', sans-serif"}}>{username}</span>
                  <span className="text-xs font-bold hidden md:block" style={{color:tier.dimColor,fontFamily:"'Rajdhani', sans-serif"}}>{tier.name}</span>
                </button>
                <button onClick={onLogout} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" title="Salir"><LogOut className="w-4 h-4"/></button>
              </>
            ) : (
              <button onClick={onLoginNav} className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:brightness-110 active:scale-95" style={{background:"linear-gradient(135deg,#d4a843,#a07020)",color:"#0a0c10",fontFamily:"'Rajdhani', sans-serif"}}>
                <User className="w-4 h-4"/>Iniciar Sesión
              </button>
            )}
          </div>
        </div>
        <div className="sm:hidden flex border-t border-border">
          {navItems.map(([key,label,Icon])=>(
            <button key={key} onClick={()=>handleSectionChange(key)} className="flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors" style={{color:section===key&&!receipt?"#d4a843":"#8a8fa0"}}>
              <Icon className="w-4 h-4"/>{label}
            </button>
          ))}
        </div>
      </nav>

      {/* CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* RECEIPT */}
        {receipt && (
          <ReceiptView receipt={receipt} onContinue={()=>{setReceipt(null);setSection("productos");}} onHistory={()=>{setReceipt(null);setSection("historial");}}/>
        )}

        {/* PRODUCTOS */}
        {!receipt && section==="productos" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2 className="text-2xl font-bold" style={{fontFamily:"'Rajdhani', sans-serif"}}>Catálogo Mayorista</h2>
                <p className="text-sm text-muted-foreground mt-1">{PRODUCTS.length} productos · Precios exclusivos</p>
              </div>
              <div className="flex items-center gap-3">
                {loggedIn&&tier.discount>0&&<div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold" style={{background:tier.bg,color:tier.color,border:`1px solid ${tier.border}`}}><TierIcon tier={tier} size={14}/>-{tier.discount}% aplicado</div>}
                <div className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{background:"rgba(24,165,84,0.15)",color:"#18a554",border:"1px solid rgba(24,165,84,0.3)"}}>Stock disponible</div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {PRODUCTS.map(p=>(
                <ProductCard key={p.id} product={p} loggedIn={loggedIn} onLoginRequired={onLoginOpen} onRequestBuy={handleRequestBuy} tier={tier} justConfirmed={lastConfirmedId===p.id}/>
              ))}
            </div>
          </div>
        )}

        {/* SALDO */}
        {!receipt && section==="saldo" && (
          <>
            <div className="relative rounded-2xl overflow-hidden p-6 sm:p-8" style={{background:"rgba(16,20,28,0.88)",backdropFilter:"blur(12px)",border:"1px solid rgba(212,168,67,0.25)"}}>
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none" style={{background:"radial-gradient(circle,rgba(212,168,67,0.1) 0%,transparent 70%)"}}/>
              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                  <p className="text-sm font-semibold tracking-widest uppercase mb-2" style={{color:"#8a8fa0"}}>Tu Saldo</p>
                  <p className="text-5xl sm:text-6xl font-bold" style={{fontFamily:"'Rajdhani', sans-serif",color:"#d4a843",textShadow:"0 0 40px rgba(212,168,67,0.3)"}}>${balance.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground mt-2">Última actualización: ahora</p>
                </div>
                <div className="flex flex-col sm:items-end gap-3">
                  <button onClick={scrollToBinance} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:brightness-110 active:scale-95" style={{background:"linear-gradient(135deg,#18a554,#0f7a3d)",color:"#fff",fontFamily:"'Rajdhani', sans-serif",fontSize:"1rem",boxShadow:"0 4px 20px rgba(24,165,84,0.3)"}}>
                    <Zap className="w-4 h-4"/>Recargar Saldo
                  </button>
                  <div className="flex gap-4 text-center">
                    {[["Este mes","$3,840"],["Transacciones",String(transactions.length)],["Nivel",tier.name]].map(([label,val])=>(
                      <div key={label}><p className="text-xs text-muted-foreground">{label}</p><p className="text-sm font-bold" style={{color:label==="Nivel"?tier.color:"#f0ede6"}}>{val}</p></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{background:"rgba(212,168,67,0.08)",border:"1px solid rgba(212,168,67,0.3)"}}>
              <Zap className="w-4 h-4 shrink-0" style={{color:"#d4a843"}}/>
              <p className="text-sm" style={{color:"#f0ede6"}}><span className="font-semibold" style={{color:"#d4a843"}}>Aviso:</span> El sistema aplica un <span className="font-semibold" style={{color:"#d4a843"}}>1% de fee</span> adicional sobre el monto recargado. No se realizan reembolsos bajo ninguna circunstancia.</p>
            </div>

            {glowing&&<style>{`@keyframes binance-glow-pulse{0%,100%{box-shadow:0 0 0 1px rgba(212,168,67,0.6),0 0 18px rgba(212,168,67,0.35);}50%{box-shadow:0 0 0 3px rgba(212,168,67,0.9),0 0 50px rgba(212,168,67,0.6),0 0 90px rgba(212,168,67,0.2);}}.binance-glow{animation:binance-glow-pulse 0.75s ease-in-out 4;border-color:rgba(212,168,67,0.7)!important;}`}</style>}

            <div ref={binanceRef} className={`grid grid-cols-1 lg:grid-cols-2 gap-6 rounded-2xl transition-all ${glowing?"binance-glow":""}`}>
              <div className="rounded-2xl p-6" style={{background:"rgba(16,20,28,0.88)",backdropFilter:"blur(12px)",border:"1px solid rgba(212,168,67,0.18)"}}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:"rgba(212,168,67,0.15)"}}><Bitcoin className="w-5 h-5" style={{color:"#d4a843"}}/></div>
                  <div><h2 className="text-lg font-bold" style={{fontFamily:"'Rajdhani', sans-serif"}}>Recargar con Binance Pay</h2><p className="text-xs text-muted-foreground">Confirmación automática al instante</p></div>
                </div>
                <div className="mb-5">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Monto rápido</label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_AMOUNTS.map(amt=>(
                      <button key={amt} onClick={()=>{setSelectedAmount(amt);setCustomAmount("");}} className="px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95" style={selectedAmount===amt&&!customAmount?{background:"linear-gradient(135deg,#d4a843,#a07020)",color:"#0a0c10",boxShadow:"0 2px 12px rgba(212,168,67,0.35)"}:{background:"#161b26",color:"#8a8fa0",border:"1px solid rgba(212,168,67,0.15)"}}>
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Monto personalizado</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold" style={{color:"#d4a843"}}>$</span>
                    <input type="number" placeholder="0.00" value={customAmount} onChange={e=>{setCustomAmount(e.target.value);setSelectedAmount(null);}} className="w-full pl-8 pr-4 py-3 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2" style={{background:"#161b26",border:"1px solid rgba(212,168,67,0.18)",fontFamily:"'JetBrains Mono',monospace",["--tw-ring-color" as string]:"#d4a843"}}/>
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-4" style={{background:"rgba(212,168,67,0.07)",border:"1px solid rgba(212,168,67,0.18)"}}>
                  <span className="text-sm text-muted-foreground">Total a recargar</span>
                  <div className="text-right">
                    <p className="text-xl font-bold" style={{fontFamily:"'Rajdhani', sans-serif",color:"#d4a843"}}>${finalAmount.toFixed(2)}</p>
                    {finalAmount>0&&<p className="text-xs text-muted-foreground">+${(finalAmount*.01).toFixed(2)} fee (1%)</p>}
                  </div>
                </div>
                <button className="w-full py-3.5 rounded-xl font-bold tracking-wider uppercase transition-all hover:brightness-110 active:scale-[0.98]" style={{background:finalAmount>0?"linear-gradient(135deg,#18a554,#0f7a3d)":"#1a1f2e",color:finalAmount>0?"#fff":"#4a4f60",fontFamily:"'Rajdhani', sans-serif",fontSize:"0.95rem",cursor:finalAmount>0?"pointer":"not-allowed",boxShadow:finalAmount>0?"0 4px 20px rgba(24,165,84,0.3)":"none"}}>
                  <span className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4"/>Recargar Ahora</span>
                </button>
              </div>
              <div className="rounded-2xl p-6 flex flex-col gap-4" style={{background:"rgba(16,20,28,0.88)",backdropFilter:"blur(12px)",border:"1px solid rgba(212,168,67,0.18)"}}>
                <h3 className="text-lg font-bold" style={{fontFamily:"'Rajdhani', sans-serif"}}>¿Cómo funciona?</h3>
                {[["1","Escoge cuánto quieres recargar usando los botones rápidos o ingresando un monto personalizado."],["2","Presiona el botón <b>Recargar Ahora</b>."],["3","El sistema automatizado de Binance confirmará tu pago al instante y tu saldo se acreditará de forma inmediata."]].map(([n,t])=>(
                  <div key={n} className="flex gap-3"><div className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold" style={{background:"rgba(212,168,67,0.15)",color:"#d4a843"}}>{n}</div><p className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{__html:t}}/></div>
                ))}
                <div className="flex items-start gap-3 p-4 rounded-xl mt-2" style={{background:"rgba(24,165,84,0.07)",border:"1px solid rgba(24,165,84,0.25)"}}><Check className="w-4 h-4 shrink-0 mt-0.5" style={{color:"#18a554"}}/><p className="text-sm" style={{color:"#18a554"}}>Confirmación automática · Sin esperas · Disponible 24/7</p></div>
                <div className="flex items-start gap-3 p-4 rounded-xl" style={{background:"rgba(212,168,67,0.06)",border:"1px solid rgba(212,168,67,0.2)"}}><Zap className="w-4 h-4 shrink-0 mt-0.5" style={{color:"#d4a843"}}/><p className="text-xs text-muted-foreground leading-relaxed">Se aplica un <span className="font-semibold text-foreground">1% de fee</span>. No se realizan reembolsos bajo ninguna circunstancia.</p></div>
              </div>
            </div>
          </>
        )}

        {/* HISTORIAL */}
        {!receipt && section==="historial" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2 className="text-2xl font-bold" style={{fontFamily:"'Rajdhani', sans-serif"}}>Historial de Transacciones</h2>
                <p className="text-sm text-muted-foreground mt-1">{transactions.length} operaciones registradas</p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{background:"rgba(93,217,252,0.08)",color:"#5DD9FC",border:"1px solid rgba(93,217,252,0.2)"}}><Wallet className="w-3 h-3"/>Saldo</div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{background:"rgba(212,168,67,0.08)",color:"#d4a843",border:"1px solid rgba(212,168,67,0.2)"}}><ShoppingCart className="w-3 h-3"/>Compra</div>
              </div>
            </div>
            <TransactionsTable transactions={transactions}/>
          </div>
        )}

        {/* PERFIL */}
        {!receipt && section==="perfil" && loggedIn && (
          <div>
            <div className="mb-6"><h2 className="text-2xl font-bold" style={{fontFamily:"'Rajdhani', sans-serif"}}>Mi Perfil</h2><p className="text-sm text-muted-foreground mt-1">Gestiona tu cuenta y consulta tu nivel</p></div>
            <ProfileSection username={username} setUsername={setUsername} totalSpent={totalSpent}/>
          </div>
        )}
      </main>

      {pendingPurchase && (
        <ConfirmPurchaseModal pending={pendingPurchase} balance={balance} tier={tier} onConfirm={handleConfirmPurchase} onCancel={()=>setPendingPurchase(null)}/>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   ROOT
────────────────────────────────────────────────────────────── */
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("GamerPro99");
  const [totalSpent] = useState(487);
  const [loginModal, setLoginModal] = useState<{open:boolean;product:string}>({open:false,product:""});
  const handleLogin = () => { setLoggedIn(true); setLoginModal({open:false,product:""}); };
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <CoinCanvas/>
      <div className="fixed inset-0 z-10 pointer-events-none" style={{background:"rgba(9,11,15,0.72)"}}/>
      <div className="relative z-20">
        <Dashboard loggedIn={loggedIn} username={username} setUsername={setUsername} totalSpent={totalSpent} onLogout={()=>setLoggedIn(false)} onLoginOpen={p=>setLoginModal({open:true,product:p})} onLoginNav={()=>setLoginModal({open:true,product:""})}/>
      </div>
      {loginModal.open && <LoginModal pendingProduct={loginModal.product} onClose={()=>setLoginModal({open:false,product:""})} onLogin={handleLogin}/>}
    </div>
  );
}
