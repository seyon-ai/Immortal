const canvas = document.getElementById('sky');
const ctx = canvas.getContext('2d');
let w, h, dpr, particles = [];
function resize(){
  dpr = Math.min(devicePixelRatio || 1, 2); w = canvas.clientWidth; h = canvas.clientHeight;
  canvas.width = w*dpr; canvas.height = h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
  particles = Array.from({length: Math.min(230, Math.floor(w/5))}, () => ({
    x: Math.random()*w, y: Math.random()*h, r: Math.random()*1.25+.15,
    a: Math.random()*.7+.1, speed: Math.random()*.11+.025, drift: (Math.random()-.5)*.06
  }));
}
function draw(){
  ctx.clearRect(0,0,w,h);
  const glow = ctx.createRadialGradient(w*.65,h*.43,0,w*.65,h*.43,Math.min(w,h)*.54);
  glow.addColorStop(0,'rgba(178,205,125,.13)'); glow.addColorStop(.35,'rgba(75,104,79,.09)'); glow.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=glow; ctx.fillRect(0,0,w,h);
  particles.forEach(p=>{ p.y-=p.speed; p.x+=p.drift; if(p.y<0){p.y=h;p.x=Math.random()*w} if(p.x<0)p.x=w;if(p.x>w)p.x=0; ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(213,233,159,${p.a})`;ctx.fill(); });
  requestAnimationFrame(draw);
}
resize(); draw(); window.addEventListener('resize',resize);
const hero = document.querySelector('.hero');
window.addEventListener('pointermove', e => {
  if (!hero || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const x = (e.clientX / innerWidth - .5) * 2, y = (e.clientY / innerHeight - .5) * 2;
  hero.style.backgroundPosition = `calc(50% + ${x * 10}px) calc(50% + ${y * 6}px)`;
  document.querySelectorAll('.hero-copy,.hero-aside,.hero-coordinate').forEach((el,i) => el.style.transform = `translate(${x*(i+1)*1.8}px,${y*(i+1)*1.2}px)`);
});
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); }), {threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
// Deliberately stagger adjacent elements for a quiet, measured reveal.
document.querySelectorAll('.principles .reveal').forEach((el,i)=>el.style.transitionDelay=`${i*100}ms`);
