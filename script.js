// ====================================================
// LOADING ANIMATION - GIF intro
// ====================================================
(function() {
  const loader = document.getElementById('siteLoader');
  if (!loader) return;
  const loaderVideo = loader.querySelector('video');
  let pageLoaded = false;
  let animationFinished = false;
  let loaderHidden = false;

  if (loaderVideo) {
    loaderVideo.play().catch(() => {});
  }

  const hideLoader = () => {
    if (loaderHidden || !pageLoaded || !animationFinished) return;
    loaderHidden = true;
    document.body.classList.remove('is-loading');
    loader.classList.add('is-hidden');
    setTimeout(() => loader.remove(), 1000);
  };

  window.addEventListener('load', () => {
    pageLoaded = true;
    hideLoader();
  });

  if (loaderVideo) {
    loaderVideo.addEventListener('ended', () => {
      animationFinished = true;
      hideLoader();
    }, { once: true });
  }

  setTimeout(() => {
    pageLoaded = true;
    animationFinished = true;
    hideLoader();
  }, 4500);
})();

// ====================================================
// CANVAS BACKGROUND - LiquidChrome-style WebGL brand shader
// ====================================================
(function() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const gl = canvas.getContext('webgl', {
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance'
  });

  if (!gl) {
    const fallback = canvas.getContext('2d');
    if (fallback) {
      fallback.fillStyle = '#F7F2EE';
      fallback.fillRect(0, 0, canvas.width, canvas.height);
    }
    return;
  }

  const vertexShader = `
    attribute vec2 aPosition;
    varying vec2 vUv;
    void main() {
      vUv = aPosition * 0.5 + 0.5;
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;

  const fragmentShader = `
    precision highp float;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform float uAmplitude;
    uniform float uSpeed;
    uniform float uFrequencyX;
    uniform float uFrequencyY;
    varying vec2 vUv;

    vec3 cream = vec3(0.9686, 0.9490, 0.9333);
    vec3 navy  = vec3(0.0706, 0.0784, 0.1647);
    vec3 pink  = vec3(0.9490, 0.7216, 0.7961);
    vec3 green = vec3(0.6392, 0.9098, 0.4784);

    float softCircle(vec2 uv, vec2 center, float radius, float softness) {
      return 1.0 - smoothstep(radius - softness, radius + softness, length(uv - center));
    }

    vec3 brandField(vec2 uv, float t) {
      vec2 p1 = vec2(0.18 + sin(t * 0.42) * 0.18, 0.22 + cos(t * 0.34) * 0.16);
      vec2 p2 = vec2(0.82 + cos(t * 0.31) * 0.17, 0.28 + sin(t * 0.45) * 0.14);
      vec2 p3 = vec2(0.55 + sin(t * 0.26 + 2.0) * 0.20, 0.74 + cos(t * 0.39) * 0.16);
      vec2 p4 = vec2(0.78 + sin(t * 0.50 + 1.5) * 0.13, 0.78 + cos(t * 0.28) * 0.13);

      float a = softCircle(uv, p1, 0.48, 0.34);
      float b = softCircle(uv, p2, 0.52, 0.34);
      float c = softCircle(uv, p3, 0.58, 0.38);
      float d = softCircle(uv, p4, 0.32, 0.22);

      vec3 col = cream;
      col = mix(col, pink, a * 0.95);
      col = mix(col, green, b * 0.92);
      col = mix(col, navy, c * 0.10);
      col = mix(col, pink + green * 0.38, d * 0.48);
      return col;
    }

    vec4 renderImage(vec2 uvCoord) {
      vec2 fragCoord = uvCoord * uResolution.xy;
      vec2 uv = (2.0 * fragCoord - uResolution.xy) / min(uResolution.x, uResolution.y);
      float t = uTime * uSpeed;

      for (float i = 1.0; i < 9.0; i++) {
        uv.x += uAmplitude / i * cos(i * uFrequencyX * uv.y + t + uMouse.x * 3.14159);
        uv.y += uAmplitude / i * sin(i * uFrequencyY * uv.x + t * 0.9 + uMouse.y * 3.14159);
      }

      vec2 diff = uvCoord - uMouse;
      float dist = length(diff);
      float falloff = exp(-dist * 12.0);
      float ripple = sin(14.0 * dist - t * 2.5) * 0.035;
      uv += (diff / (dist + 0.0001)) * ripple * falloff;

      vec2 liquidUv = uvCoord + uv * 0.085;
      vec3 col = brandField(liquidUv, t);

      float chrome = 0.88 + 0.18 * sin(t - uv.x * 1.8 - uv.y * 1.4);
      col *= chrome;
      col += green * smoothstep(0.18, 1.0, sin(uv.x * 2.4 + t) * 0.5 + 0.5) * 0.18;
      col += pink * smoothstep(0.14, 1.0, cos(uv.y * 2.8 - t * 0.8) * 0.5 + 0.5) * 0.16;
      col = mix(col, cream, 0.08);
      col = pow(col, vec3(0.86));

      float vignette = smoothstep(1.10, 0.25, length(uvCoord - vec2(0.5)));
      col = mix(cream, col, 0.96 + vignette * 0.04);

      float heroReadability = smoothstep(0.88, 0.15, uvCoord.x) * smoothstep(0.02, 0.75, uvCoord.y);
      col = mix(col, cream, heroReadability * 0.18);

      return vec4(col, 1.0);
    }

    void main() {
      vec4 col = vec4(0.0);
      for (int i = -1; i <= 1; i++) {
        for (int j = -1; j <= 1; j++) {
          vec2 offset = vec2(float(i), float(j)) * (1.0 / min(uResolution.x, uResolution.y));
          col += renderImage(vUv + offset);
        }
      }
      gl_FragColor = col / 9.0;
    }
  `;

  function createShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertex = createShader(gl.VERTEX_SHADER, vertexShader);
  const fragment = createShader(gl.FRAGMENT_SHADER, fragmentShader);
  if (!vertex || !fragment) return;

  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn(gl.getProgramInfoLog(program));
    return;
  }
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const uniforms = {
    time: gl.getUniformLocation(program, 'uTime'),
    resolution: gl.getUniformLocation(program, 'uResolution'),
    mouse: gl.getUniformLocation(program, 'uMouse'),
    amplitude: gl.getUniformLocation(program, 'uAmplitude'),
    speed: gl.getUniformLocation(program, 'uSpeed'),
    frequencyX: gl.getUniformLocation(program, 'uFrequencyX'),
    frequencyY: gl.getUniformLocation(program, 'uFrequencyY')
  };

  const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  const isMobile = () => window.innerWidth < 768;
  let animationFrame = null;
  let width = 0;
  let height = 0;
  let dpr = 1;

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, isMobile() ? 1 : 1.35);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform1f(uniforms.amplitude, isMobile() ? 0.38 : 0.58);
    gl.uniform1f(uniforms.speed, reduceMotion.matches ? 0 : 0.55);
    gl.uniform1f(uniforms.frequencyX, 2.9);
    gl.uniform1f(uniforms.frequencyY, 2.15);
  }

  function updateMouse(event) {
    const point = event.touches ? event.touches[0] : event;
    if (!point) return;
    mouse.tx = point.clientX / Math.max(width, 1);
    mouse.ty = 1 - point.clientY / Math.max(height, 1);
  }

  function render(timestamp) {
    mouse.x += (mouse.tx - mouse.x) * 0.075;
    mouse.y += (mouse.ty - mouse.y) * 0.075;

    gl.useProgram(program);
    gl.uniform1f(uniforms.time, timestamp * 0.001);
    gl.uniform2f(uniforms.mouse, mouse.x, mouse.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (!reduceMotion.matches) {
      animationFrame = requestAnimationFrame(render);
    }
  }

  function startAnimation() {
    cancelAnimationFrame(animationFrame);
    resizeCanvas();
    animationFrame = requestAnimationFrame(render);
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });
  window.addEventListener('mousemove', updateMouse, { passive: true });
  window.addEventListener('touchmove', updateMouse, { passive: true });
  reduceMotion.addEventListener('change', startAnimation);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animationFrame);
    else startAnimation();
  });

  startAnimation();
})();

// ====================================================
// CUSTOM CURSOR
// ════════════════════════════════════════════════════
(function initCustomCursor(){
  // Disabled: replaced site-wide by the cursor.svg CSS cursor (commit 2ee7489).
  // Leaving the JS overlay active was hiding the OS cursor (body.style.cursor = 'none')
  // while the .custom-cursor divs stayed display:none, so the cursor went invisible.
  return;
  const dot = document.getElementById('customCursorDot');
  const ring = document.getElementById('customCursorRing');
  if(!dot || !ring || window.innerWidth <= 768 || 'ontouchstart' in window) return;

  const targetSelector = 'a, button, .nav-links a, .svc-row, .work-card, .testimonial-card, .process-step-item, .stat, .marquee-section, .mouse-trail-section, .focus-word, img';
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let dotX = mouseX;
  let dotY = mouseY;
  let ringX = mouseX;
  let ringY = mouseY;
  let prevRingX = ringX;
  let prevRingY = ringY;
  let isHovering = false;
  let isPressed = false;
  let isVisible = true;

  const lerp = (a,b,t)=>a+(b-a)*t;
  document.body.style.cursor = 'none';

  function animateCursor(){
    dotX = lerp(dotX, mouseX, .42);
    dotY = lerp(dotY, mouseY, .42);
    ringX = lerp(ringX, mouseX, .14);
    ringY = lerp(ringY, mouseY, .14);

    const vx = ringX - prevRingX;
    const vy = ringY - prevRingY;
    prevRingX = ringX;
    prevRingY = ringY;
    const speed = Math.min(Math.hypot(vx,vy) * .018, .34);
    const angle = Math.atan2(vy,vx) * 180 / Math.PI;
    const hoverScale = isHovering ? 1.9 : 1;
    const pressScale = isPressed ? .82 : 1;
    const opacity = isVisible ? 1 : 0;

    dot.style.opacity = opacity;
    ring.style.opacity = opacity;
    dot.style.transform = `translate3d(${dotX}px,${dotY}px,0) translate(-50%,-50%) scale(${pressScale})`;
    ring.style.transform = `translate3d(${ringX}px,${ringY}px,0) translate(-50%,-50%) rotate(${angle}deg) scale(${hoverScale*pressScale + speed}, ${hoverScale*pressScale - speed*.45})`;

    requestAnimationFrame(animateCursor);
  }

  window.addEventListener('mousemove',(event)=>{
    mouseX = event.clientX;
    mouseY = event.clientY;
    isVisible = true;
  });
  window.addEventListener('mousedown',()=>{ isPressed = true; });
  window.addEventListener('mouseup',()=>{ isPressed = false; });
  document.documentElement.addEventListener('mouseleave',()=>{
    isVisible = false;
    dot.classList.add('is-hidden');
    ring.classList.add('is-hidden');
  });
  document.documentElement.addEventListener('mouseenter',()=>{
    isVisible = true;
    dot.classList.remove('is-hidden');
    ring.classList.remove('is-hidden');
  });
  window.addEventListener('mouseover',(event)=>{
    const target = event.target.closest(targetSelector);
    isHovering = Boolean(target);
    dot.classList.toggle('is-hovering', isHovering);
    ring.classList.toggle('is-hovering', isHovering);
  },{passive:true});
  window.addEventListener('mouseout',(event)=>{
    const next = event.relatedTarget;
    if(!next || !next.closest || !next.closest(targetSelector)){
      isHovering = false;
      dot.classList.remove('is-hovering');
      ring.classList.remove('is-hovering');
    }
  },{passive:true});

  animateCursor();
})();

// INTERACTIVE MARQUEE DIVIDER
const marqueeDivider = document.getElementById('curvedLoopMarquee');
if(marqueeDivider){
  const marqueeTrack = marqueeDivider.querySelector('.marquee-track');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let marqueeOffset = 0;
  let marqueeWidth = 1;
  let marqueeDragging = false;
  let marqueeLastX = 0;
  let marqueeVelocity = 0;
  let marqueeDirection = -1;

  const measureMarquee = ()=>{
    const firstText = marqueeTrack.querySelector('.marquee-text');
    marqueeWidth = firstText ? firstText.offsetWidth : 1;
  };

  const wrapMarquee = ()=>{
    if(marqueeOffset <= -marqueeWidth) marqueeOffset += marqueeWidth;
    if(marqueeOffset > 0) marqueeOffset -= marqueeWidth;
  };

  const renderMarquee = ()=>{
    wrapMarquee();
    marqueeTrack.style.transform = `translate3d(${marqueeOffset}px,0,0)`;
  };

  const marqueeLoop = ()=>{
    if(!marqueeDragging && !reduceMotion){
      marqueeOffset += marqueeDirection * .94;
      renderMarquee();
    }
    requestAnimationFrame(marqueeLoop);
  };

  marqueeDivider.addEventListener('pointerdown',(event)=>{
    marqueeDragging = true;
    marqueeLastX = event.clientX;
    marqueeVelocity = 0;
    marqueeDivider.classList.add('is-dragging');
    marqueeDivider.setPointerCapture(event.pointerId);
  });

  marqueeDivider.addEventListener('pointermove',(event)=>{
    if(!marqueeDragging) return;
    const dx = event.clientX - marqueeLastX;
    marqueeLastX = event.clientX;
    marqueeVelocity = dx;
    marqueeOffset += dx;
    renderMarquee();
  });

  const endMarqueeDrag = ()=>{
    if(!marqueeDragging) return;
    marqueeDragging = false;
    marqueeDirection = marqueeVelocity > 0 ? 1 : -1;
    marqueeDivider.classList.remove('is-dragging');
  };

  marqueeDivider.addEventListener('pointerup',endMarqueeDrag);
  marqueeDivider.addEventListener('pointercancel',endMarqueeDrag);
  marqueeDivider.addEventListener('pointerleave',endMarqueeDrag);
  window.addEventListener('resize',measureMarquee);
  measureMarquee();
  renderMarquee();
  requestAnimationFrame(marqueeLoop);
}

// MOUSE IMAGE TRAIL BETWEEN KIND WORDS AND GET IN TOUCH
(function initMouseImageTrail(){
  const section = document.getElementById('mouseTrail');
  if(!section) return;

  const content = section.querySelector('.content');
  const cards = [...section.querySelectorAll('.content__img')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const isSmall = window.innerWidth < 768;
  if(reduceMotion || isTouch || isSmall || !cards.length || !content || !window.gsap) return;
  document.body.appendChild(content);

  const palette = [
    {bg:'#A3E87A', fg:'#12142A', accent:'#F7F2EE', label:'STRATEGY'},
    {bg:'#F2B8CB', fg:'#12142A', accent:'#A3E87A', label:'CONTENT'},
    {bg:'#12142A', fg:'#F7F2EE', accent:'#A3E87A', label:'SOCIAL'},
    {bg:'#F7F2EE', fg:'#12142A', accent:'#F2B8CB', label:'PAID MEDIA'},
    {bg:'#A3E87A', fg:'#12142A', accent:'#F2B8CB', label:'GROWTH'},
    {bg:'#F2B8CB', fg:'#12142A', accent:'#F7F2EE', label:'CREATIVE'},
    {bg:'#12142A', fg:'#A3E87A', accent:'#F2B8CB', label:'BRANDS'},
    {bg:'#F7F2EE', fg:'#12142A', accent:'#A3E87A', label:'RESULTS'}
  ];

  const makeTrailCard = ({bg,fg,accent,label}, index)=>{
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 330">
        <rect width="480" height="330" rx="36" fill="${bg}"/>
        <circle cx="${index % 2 ? 392 : 82}" cy="${index % 2 ? 72 : 252}" r="74" fill="${accent}" opacity=".9"/>
        <path d="M-20 238 C 90 166, 150 330, 270 218 S 422 126, 520 176" fill="none" stroke="${fg}" stroke-width="18" stroke-linecap="round" opacity=".22"/>
        <path d="M-30 112 C 86 18, 174 192, 298 82 S 432 34, 520 88" fill="none" stroke="${fg}" stroke-width="10" stroke-linecap="round" opacity=".18"/>
        <text x="34" y="70" fill="${fg}" font-size="24" font-family="Arial, sans-serif" font-weight="900" letter-spacing="7">GREENLIGHT</text>
        <text x="34" y="210" fill="${fg}" font-size="${label.length > 8 ? 48 : 64}" font-family="Arial, sans-serif" font-weight="900" letter-spacing="1">${label}</text>
        <text x="36" y="262" fill="${fg}" font-size="22" font-family="Arial, sans-serif" font-weight="900" opacity=".72">DIGITAL MOMENT ${String(index + 1).padStart(2,'0')}</text>
      </svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };

  cards.forEach((card,index)=>{
    const inner = card.querySelector('.content__img-inner');
    if(inner) inner.style.backgroundImage = `url("${makeTrailCard(palette[index % palette.length], index)}")`;
    gsap.set(card,{opacity:0, scale:1, x:0, y:0, xPercent:-50, yPercent:-50});
  });

  const renderImageBuffer = 32;
  const rotationRange = 18;
  let mousePos = {x:0,y:0};
  let lastMousePos = {x:0,y:0};
  let cacheMousePos = {x:0,y:0};
  let hasStarted = false;
  let imgPosition = 0;
  let zIndexVal = 1;

  const lerp = (a,b,n)=>(1 - n) * a + n * b;
  const getDistance = (p1,p2)=>Math.hypot(p1.x - p2.x, p1.y - p2.y);
  const getPointerPos = (event)=>({x:event.clientX, y:event.clientY});

  const showNextImage = ()=>{
    zIndexVal += 1;
    imgPosition = imgPosition < cards.length - 1 ? imgPosition + 1 : 0;

    const card = cards[imgPosition];
    const inner = card.querySelector('.content__img-inner');
    const rotation = Math.random() * rotationRange;
    const fromRotate = imgPosition % 2 ? rotation : -rotation;
    const toRotate = imgPosition % 2 ? -rotation : rotation;
    const speed = getDistance(mousePos, cacheMousePos);

    gsap.killTweensOf(card);
    if(inner) gsap.killTweensOf(inner);

    gsap.timeline()
      .fromTo(card,
        {
          opacity:1,
          scale:.82,
          zIndex:zIndexVal,
          xPercent:-50,
          yPercent:-50,
          rotation:fromRotate,
          x:cacheMousePos.x,
          y:cacheMousePos.y
        },
        {
          duration:.24,
          ease:'power2.out',
          scale:1,
          xPercent:-50,
          yPercent:-50,
          rotation:toRotate,
          x:mousePos.x,
          y:mousePos.y
        },
        0
      )
      .to(card,
        {
          duration:.42,
          ease:'power3.in',
          opacity:0,
          scale:.18
        },
        .28
      );

    if(inner){
      gsap.fromTo(inner,
        {scale:1.45, filter:`brightness(${Math.min(180, 110 + speed)}%)`},
        {duration:.42, ease:'power2.out', scale:1, filter:'brightness(100%)'},
        0
      );
    }
  };

  section.addEventListener('mousemove',(event)=>{
    mousePos = getPointerPos(event);
    if(!hasStarted){
      hasStarted = true;
      lastMousePos = {...mousePos};
      cacheMousePos = {...mousePos};
      requestAnimationFrame(renderTrail);
    }
  },{passive:true});

  const renderTrail = ()=>{
    const distance = getDistance(mousePos,lastMousePos);
    cacheMousePos.x = lerp(cacheMousePos.x, mousePos.x, .22);
    cacheMousePos.y = lerp(cacheMousePos.y, mousePos.y, .22);

    if(distance > renderImageBuffer){
      showNextImage();
      lastMousePos = {...mousePos};
    }

    requestAnimationFrame(renderTrail);
  };
})();

// ════════════════════════════════════════════════════
// GSAP + ScrollTrigger
// ════════════════════════════════════════════════════
gsap.registerPlugin(ScrollTrigger);

// NAV
const nav = document.getElementById('mainNav');
ScrollTrigger.create({
  start:'top -60',
  onEnter:     ()=>{nav.classList.add('is-scrolled');nav.style.background='rgba(247,242,238,0.92)';nav.style.backdropFilter='blur(20px)';nav.style.borderBottom='1px solid rgba(18,20,42,0.08)';},
  onLeaveBack: ()=>{nav.classList.remove('is-scrolled');nav.style.background='transparent';nav.style.backdropFilter='none';nav.style.borderBottom='none';}
});

// PILL NAV HOVER EFFECT
const pillNavLinks = document.querySelectorAll('.nav-links a');
pillNavLinks.forEach((pill)=>{
  const circle = pill.querySelector('.hover-circle');
  const label = pill.querySelector('.pill-label');
  const hoverLabel = pill.querySelector('.pill-label-hover');
  let tl;

  const layoutPill = ()=>{
    if(!circle) return;
    const rect = pill.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const radius = ((w*w)/4 + h*h) / (2*h);
    const diameter = Math.ceil(2 * radius) + 2;
    const delta = Math.ceil(radius - Math.sqrt(Math.max(0, radius*radius - (w*w)/4))) + 1;
    const originY = diameter - delta;

    circle.style.width = `${diameter}px`;
    circle.style.height = `${diameter}px`;
    circle.style.bottom = `-${delta}px`;

    gsap.set(circle,{xPercent:-50,scale:0,transformOrigin:`50% ${originY}px`});
    if(label) gsap.set(label,{y:0});
    if(hoverLabel) gsap.set(hoverLabel,{y:h+12,opacity:0});

    tl?.kill();
    tl = gsap.timeline({paused:true});
    tl.to(circle,{scale:1.2,xPercent:-50,duration:1.2,ease:'power3.out',overwrite:'auto'},0);
    if(label) tl.to(label,{y:-(h+8),duration:1.2,ease:'power3.out',overwrite:'auto'},0);
    if(hoverLabel) tl.to(hoverLabel,{y:0,opacity:1,duration:1.2,ease:'power3.out',overwrite:'auto'},0);
  };

  layoutPill();
  pill.addEventListener('mouseenter',()=>tl && tl.tweenTo(tl.duration(),{duration:.28,ease:'power3.out',overwrite:'auto'}));
  pill.addEventListener('mouseleave',()=>tl && tl.tweenTo(0,{duration:.22,ease:'power3.out',overwrite:'auto'}));
  window.addEventListener('resize',layoutPill);
});

// HERO
gsap.timeline({delay:.2})
  .to('.gs-hero-eyebrow', {opacity:1,y:0,duration:.8,ease:'power3.out'})
  .to('.gs-hero-headline',{opacity:1,y:0,duration:.9,ease:'power3.out'},'-=.5')
  .to('.gs-hero-bottom',  {opacity:1,y:0,duration:.8,ease:'power3.out'},'-=.5');

// HERO ROTATING TEXT
(function() {
  const target = document.getElementById('heroRotatingText');
  if (!target) return;

  const words = ['move', 'grow', 'win'];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let intervalId = null;

  function splitWord(word) {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      return Array.from(new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(word), part => part.segment);
    }
    return Array.from(word);
  }

  function renderWord(word, animateIn = true) {
    target.innerHTML = '';
    const wrapper = document.createElement('span');
    wrapper.className = 'rotating-text-word';
    wrapper.style.letterSpacing = word.length < 4 ? '-.02em' : '0';
    splitWord(word).forEach((char, charIndex) => {
      const span = document.createElement('span');
      span.className = 'rotating-text-char';
      span.textContent = char;
      wrapper.appendChild(span);
      if (animateIn) {
        setTimeout(() => span.classList.add('is-visible'), charIndex * 28 + 20);
      } else {
        span.classList.add('is-visible');
      }
    });
    target.appendChild(wrapper);
  }

  function rotateWord() {
    const chars = Array.from(target.querySelectorAll('.rotating-text-char'));
    if (!chars.length || reduceMotion.matches) {
      index = (index + 1) % words.length;
      renderWord(words[index], false);
      return;
    }

    chars.reverse().forEach((char, charIndex) => {
      setTimeout(() => {
        char.classList.remove('is-visible');
        char.classList.add('is-exiting');
      }, charIndex * 24);
    });

    const exitTime = chars.length * 24 + 300;
    setTimeout(() => {
      index = (index + 1) % words.length;
      renderWord(words[index], true);
    }, exitTime);
  }

  renderWord(words[index], !reduceMotion.matches);
  if (!reduceMotion.matches) {
    intervalId = setInterval(rotateWord, 2100);
  }

  reduceMotion.addEventListener('change', () => {
    clearInterval(intervalId);
    renderWord(words[index], false);
    if (!reduceMotion.matches) {
      intervalId = setInterval(rotateWord, 2100);
    }
  });
})();

// SPLIT TITLES — word-by-word reveal
document.querySelectorAll('.gs-split-title').forEach(el=>{
  const parts = el.innerHTML.split(/(\s+|<br>)/);
  el.innerHTML = parts.map(w=>
    w==='<br>' ? '<br>' :
    w.trim()==='' ? w :
    `<span class="split-word"><span class="split-word-inner">${w}</span></span>`
  ).join('');
  gsap.from(el.querySelectorAll('.split-word-inner'),{
    scrollTrigger:{trigger:el,start:'top 85%',toggleActions:'play none none none'},
    y:'110%',opacity:0,duration:.8,stagger:.07,ease:'power4.out'
  });
});

// FADE UPS
gsap.utils.toArray('.gs-fade-up').forEach(el=>{
  gsap.from(el,{
    scrollTrigger:{trigger:el,start:'top 88%',toggleActions:'play none none none'},
    y:40,opacity:0,duration:.8,ease:'power3.out'
  });
});

// SERVICES STAGGER
gsap.from('.gs-svc-row',{
  scrollTrigger:{trigger:'.services-list',start:'top 80%',toggleActions:'play none none none'},
  x:-60,opacity:0,duration:.7,stagger:.1,ease:'power3.out'
});
document.querySelectorAll('.svc-row').forEach(r=>r.style.setProperty('--hover-color',r.dataset.color));

// TRUE FOCUS PROCESS TITLE
const focusTitle = document.getElementById('processFocusTitle');
if(focusTitle){
  const focusContainer = focusTitle.querySelector('.focus-container');
  const focusWords = Array.from(focusTitle.querySelectorAll('.focus-word'));
  const focusFrame = focusTitle.querySelector('.focus-frame');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let focusIndex = 0;
  let focusTimer;

  const setFocusWord = (index)=>{
    const word = focusWords[index];
    if(!word || !focusContainer || !focusFrame) return;
    const parentRect = focusContainer.getBoundingClientRect();
    const wordRect = word.getBoundingClientRect();
    focusWords.forEach((item,i)=>{
      item.classList.toggle('active',i===index);
      item.style.filter = i===index || reduceMotion ? 'blur(0px)' : 'blur(3px)';
      item.style.opacity = i===index || reduceMotion ? '1' : '.72';
    });
    focusFrame.style.transform = `translate(${wordRect.left-parentRect.left}px, ${wordRect.top-parentRect.top}px)`;
    focusFrame.style.width = `${wordRect.width}px`;
    focusFrame.style.height = `${wordRect.height}px`;
    focusFrame.style.opacity = reduceMotion ? '0' : '1';
    focusIndex = index;
  };

  const startFocusLoop = ()=>{
    if(reduceMotion) return;
    clearInterval(focusTimer);
    focusTimer = setInterval(()=>{
      setFocusWord((focusIndex+1)%focusWords.length);
    },1450);
  };

  focusWords.forEach((word,index)=>{
    word.addEventListener('mouseenter',()=>{
      clearInterval(focusTimer);
      setFocusWord(index);
    });
    word.addEventListener('mouseleave',startFocusLoop);
    word.addEventListener('focus',()=>setFocusWord(index));
  });
  window.addEventListener('resize',()=>setFocusWord(focusIndex));
  setFocusWord(0);
  startFocusLoop();
}

// MANIFESTO WORD REVEAL
const mEl = document.querySelector('.gs-manifesto');
if(mEl){
  const tmp=document.createElement('div');
  tmp.innerHTML=mEl.innerHTML;
  let out='';
  tmp.childNodes.forEach(node=>{
    if(node.nodeType===3){
      out+=node.textContent.split(' ').map(w=>
        w?`<span class="split-word"><span class="split-word-inner">${w}</span></span> `:''
      ).join('');
    } else { out+=node.outerHTML+' '; }
  });
  mEl.innerHTML=out;
  gsap.from(mEl.querySelectorAll('.split-word-inner'),{
    scrollTrigger:{trigger:mEl,start:'top 80%',toggleActions:'play none none none'},
    y:'100%',opacity:0,duration:.6,stagger:.03,ease:'power3.out'
  });
}

// WORK CARDS — entrance + parallax
gsap.utils.toArray('.gs-work-card').forEach((card,i)=>{
  gsap.from(card,{
    scrollTrigger:{trigger:'.work-grid',start:'top 85%',toggleActions:'play none none none'},
    y:80,opacity:0,duration:.9,delay:i*.15,ease:'power3.out'
  });
  gsap.to(card,{
    scrollTrigger:{trigger:card,start:'top bottom',end:'bottom top',scrub:1.5},
    y: i%2===0 ? -30 : 30, ease:'none'
  });
});

// PROCESS THREAD + STICKY STEPS
const steps = document.querySelectorAll('.process-step-item');
const threadEl = document.getElementById('threadProgress');
steps.forEach(step=>{
  gsap.to(step,{
    scrollTrigger:{trigger:step,start:'top 75%',toggleActions:'play none none none'},
    opacity:1,y:0,duration:.8,ease:'power3.out',delay:.1
  });
  ScrollTrigger.create({
    trigger:step, start:'top 60%', end:'bottom 40%',
    onEnter:()=>step.classList.add('is-active'),
    onLeave:()=>step.classList.remove('is-active'),
    onEnterBack:()=>step.classList.add('is-active'),
    onLeaveBack:()=>step.classList.remove('is-active'),
  });
});
ScrollTrigger.create({
  trigger:'.process-thread-wrap',start:'top 60%',end:'bottom 40%',scrub:.8,
  onUpdate:self=>{ threadEl.style.height=(self.progress*100)+'%'; }
});

// TESTIMONIALS
gsap.from('.gs-testimonial',{
  scrollTrigger:{trigger:'.testimonials-grid',start:'top 80%',toggleActions:'play none none none'},
  y:60,opacity:0,duration:.8,stagger:.15,ease:'power3.out'
});

// REACT BITS STYLE COUNTUP FOR STATS
(function initCountUpStats(){
  const stats = document.querySelectorAll('.gs-stat');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const decimalPlaces = number => {
    const string = String(number);
    return string.includes('.') && parseInt(string.split('.')[1],10) !== 0 ? string.split('.')[1].length : 0;
  };

  const formatValue = (value, from, to, separator) => {
    const decimals = Math.max(decimalPlaces(from), decimalPlaces(to));
    const formatted = new Intl.NumberFormat('en-US',{
      useGrouping: !!separator,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
    return separator ? formatted.replace(/,/g, separator) : formatted;
  };

  const springCount = (el, options) => {
    const from = options.from;
    const to = options.to;
    const prefix = options.prefix;
    const suffix = options.suffix;
    const separator = options.separator;
    const duration = options.duration;

    if(reduceMotion){
      el.textContent = prefix + formatValue(to, from, to, separator) + suffix;
      return;
    }

    if(el._countUpFrame) cancelAnimationFrame(el._countUpFrame);
    const start = performance.now();
    const easeOutCubic = progress => 1 - Math.pow(1 - progress, 3);

    const tick = now => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = easeOutCubic(progress);
      const value = from + (to - from) * eased;

      if(progress >= 1){
        el.textContent = prefix + formatValue(value, from, to, separator) + suffix;
        el._countUpFrame = null;
        return;
      }

      el.textContent = prefix + formatValue(value, from, to, separator) + suffix;
      el._countUpFrame = requestAnimationFrame(tick);
    };

    el._countUpFrame = requestAnimationFrame(tick);
  };

  stats.forEach(stat=>{
    const numEl = stat.querySelector('.stat-num');
    if(!numEl) return;

    const from = parseFloat(numEl.dataset.from || '0');
    const to = parseFloat(numEl.dataset.target || '0');
    const prefix = numEl.dataset.prefix || '';
    const suffix = numEl.dataset.suffix || '';
    const separator = numEl.dataset.separator || '';
    const duration = parseFloat(numEl.dataset.duration || '2');

    const resetCount = () => {
      if(numEl._countUpFrame) cancelAnimationFrame(numEl._countUpFrame);
      numEl._countUpFrame = null;
      numEl.textContent = prefix + formatValue(from, from, to, separator) + suffix;
      gsap.set(numEl,{scale:1, y:0});
    };

    const playCount = () => {
      resetCount();
      gsap.fromTo(numEl,{scale:.88, y:14},{scale:1, y:0, duration:.9, ease:'back.out(1.8)'});
      springCount(numEl,{from,to,prefix,suffix,separator,duration});
    };

    resetCount();

    gsap.from(stat,{
      scrollTrigger:{trigger:stat,start:'top 75%',toggleActions:'play none none reverse'},
      y:40,opacity:0,duration:.7,ease:'power3.out'
    });

    ScrollTrigger.create({
      trigger:stat,
      start:'top 75%',
      end:'bottom 25%',
      onEnter:playCount,
      onEnterBack:playCount,
      onLeave:resetCount,
      onLeaveBack:resetCount
    });
  });
})();

// ====================================================
// LET'S TALK — eye tracking + inverted hover square
// ════════════════════════════════════════════════════
(function initLetsTalk(){
  const section = document.getElementById('lets-talk');
  const visual  = document.getElementById('ltVisual');
  const blob    = document.getElementById('ltBlob');
  const square  = document.getElementById('ltHoverSquare');
  if(!section || !visual || !blob || !square) return;

  const eyes = blob.querySelectorAll('.lt-eye');
  const MAX_EYE_OFFSET = 10;
  const EYE_EASE = 0.24;
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let pointerSeen = false;
  let squareActive = false;
  const targetX = Array.from(eyes, () => 0);
  const targetY = Array.from(eyes, () => 0);
  const curX    = Array.from(eyes, () => 0);
  const curY    = Array.from(eyes, () => 0);

  function eyeScreenCenter(eye){
    const r = blob.getBoundingClientRect();
    const viewBox = blob.viewBox.baseVal;
    const cx = parseFloat(eye.dataset.cx);
    const cy = parseFloat(eye.dataset.cy);
    return {
      x: r.left + ((cx - viewBox.x) / viewBox.width) * r.width,
      y: r.top  + ((cy - viewBox.y) / viewBox.height) * r.height,
    };
  }

  function tick(){
    eyes.forEach((eye, i) => {
      curX[i] += (targetX[i] - curX[i]) * EYE_EASE;
      curY[i] += (targetY[i] - curY[i]) * EYE_EASE;
      const tx = `translate(${curX[i].toFixed(2)}px, ${curY[i].toFixed(2)}px)`;
      eye.style.setProperty('--eye-tx', tx);
      eye.style.transform = tx;
    });
    requestAnimationFrame(tick);
  }

  function setEyeTarget(eye, i, x, y){
    const c = eyeScreenCenter(eye);
    const dx = x - c.x;
    const dy = y - c.y;
    const angle = Math.atan2(dy, dx);
    const distance = Math.min(MAX_EYE_OFFSET, Math.hypot(dx, dy));

    targetX[i] = Math.cos(angle) * distance;
    targetY[i] = Math.sin(angle) * distance;
  }

  function updateTargets(){
    eyes.forEach((eye, i) => {
      if(pointerSeen) setEyeTarget(eye, i, mouseX, mouseY);
      else {
        targetX[i] = 0;
        targetY[i] = 0;
      }
    });
  }

  function handlePointerMove(e){
    pointerSeen = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
    updateTargets();
    if(squareActive){
      square.style.left = mouseX + 'px';
      square.style.top  = mouseY + 'px';
    }
  }

  function resetEyes(){
    pointerSeen = false;
    updateTargets();
  }

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('pointerleave', resetEyes, { passive: true });
  window.addEventListener('blur', resetEyes);
  window.addEventListener('scroll', updateTargets, { passive: true });
  window.addEventListener('resize', updateTargets);

  // Idle blink loop
  function scheduleBlink(){
    const delay = 2800 + Math.random() * 3200;
    setTimeout(() => {
      eyes.forEach(eye => {
        eye.classList.add('is-blink');
        setTimeout(() => eye.classList.remove('is-blink'), 240);
      });
      scheduleBlink();
    }, delay);
  }
  scheduleBlink();

  // Hover square — track on the visual area
  visual.addEventListener('mouseenter', () => {
    squareActive = true;
    square.style.left = mouseX + 'px';
    square.style.top  = mouseY + 'px';
    requestAnimationFrame(() => square.classList.add('is-active'));
  });
  visual.addEventListener('mouseleave', () => {
    squareActive = false;
    square.classList.remove('is-active');
  });

  tick();
})();

