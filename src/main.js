// ── Hero height: use visualViewport to get the real visible height on iOS Safari.
// Set once at load, update only on orientation change (never on scroll).
function setHeroHeight () {
  const raw = window.visualViewport?.height ?? window.innerHeight
  document.documentElement.style.setProperty('--hero-h', (raw * 0.90) + 'px')
}
setHeroHeight()
window.addEventListener('orientationchange', () => setTimeout(setHeroHeight, 200))

// ── Access gate
const gate      = document.getElementById('access-gate')
const gateInput = document.getElementById('gate-input')
const gateError = document.getElementById('gate-error')
const CODE      = '3979'
const STORE_KEY = 'ph_unlocked'

function unlock () {
  sessionStorage.setItem(STORE_KEY, '1')
  gate.classList.add('unlocked')
  gate.addEventListener('transitionend', () => gate.remove(), { once: true })
}

if (sessionStorage.getItem(STORE_KEY) === '1') {
  gate.remove()
} else {
  gateInput.focus()
  gateInput.addEventListener('input', () => {
    gateError.classList.remove('visible')
    if (gateInput.value.length === 4) {
      if (gateInput.value === CODE) {
        unlock()
      } else {
        gateError.textContent = 'Code incorrect — réessayez.'
        gateError.classList.add('visible')
        gateInput.value = ''
        gateInput.focus()
      }
    }
  })
}

// ── Scroll-reveal animations via Intersection Observer
const revealEls = document.querySelectorAll('.fade-in')
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        revealObserver.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
)
revealEls.forEach((el) => revealObserver.observe(el))

// Trigger hero elements immediately (above the fold)
const heroEls = document.querySelectorAll('.hero-content .fade-in')
heroEls.forEach((el, i) => {
  setTimeout(() => el.classList.add('visible'), 300 + i * 160)
})

// ── Navbar: translucent → white on scroll + active link tracking
const navbar     = document.getElementById('navbar')
const sections   = Array.from(document.querySelectorAll('section[id]'))
const navLinks   = document.querySelectorAll('.nav-link')

function updateNavbar () {
  const scrollY = window.scrollY

  // Background
  navbar.classList.toggle('scrolled', scrollY > 20)

  // Active section highlight
  let currentId = ''
  sections.forEach((sec) => {
    if (scrollY >= sec.offsetTop - 130) currentId = sec.id
  })
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`)
  })
}

window.addEventListener('scroll', updateNavbar, { passive: true })
updateNavbar()

// ── Hamburger / mobile menu toggle
const hamburger  = document.getElementById('hamburger')
const mobileMenu = document.getElementById('mobile-menu')

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('is-open')
  mobileMenu.classList.toggle('is-open', !isOpen)
  hamburger.classList.toggle('open', !isOpen)
  navbar.classList.toggle('menu-open', !isOpen)
  hamburger.setAttribute('aria-expanded', String(!isOpen))
})

// Close mobile menu when a link is tapped
mobileMenu.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open')
    hamburger.classList.remove('open')
    navbar.classList.remove('menu-open')
    hamburger.setAttribute('aria-expanded', 'false')
  })
})

// ── Collab card accordion — click anywhere on card
document.querySelectorAll('.collab-card').forEach(card => {
  if (!card.querySelector('.collab-toggle')) return
  card.style.cursor = 'pointer'
  card.addEventListener('click', () => {
    card.classList.toggle('is-open')
  })
})

// ── Protocol card accordion — click anywhere on card
document.querySelectorAll('.protocol-card').forEach(card => {
  const btn = card.querySelector('.protocol-rdv[type="button"]')
  if (!btn) return
  card.style.cursor = 'pointer'
  card.addEventListener('click', () => {
    const isOpen = card.classList.toggle('is-open')
    btn.textContent = isOpen ? 'Fermer' : 'Plus d\'information'
  })
})

// ── Subtle parallax on hero background
const heroBg = document.querySelector('.hero-bg')
if (heroBg) {
  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.3
    heroBg.style.transform = `translateY(${offset}px)`
  }, { passive: true })
}

// ── Google Maps — style crème/brun assorti au site
const MAP_STYLES = [
  { elementType: 'geometry',                              stylers: [{ color: '#ffffff' }] },
  { elementType: 'labels.text.fill',                     stylers: [{ color: '#7a5c48' }] },
  { elementType: 'labels.text.stroke',                   stylers: [{ color: '#ffffff' }] },
  { featureType: 'administrative',       elementType: 'geometry.stroke',     stylers: [{ color: '#d4bfaa' }] },
  { featureType: 'landscape',            elementType: 'geometry',            stylers: [{ color: '#ffffff' }] },
  { featureType: 'landscape.man_made',   elementType: 'geometry.fill',       stylers: [{ color: '#eeeeee' }] },
  { featureType: 'landscape.man_made',   elementType: 'geometry.stroke',     stylers: [{ color: '#8a5c35' }] },
  { featureType: 'poi',                  elementType: 'geometry',            stylers: [{ color: '#f0ebe4' }] },
  { featureType: 'poi',                  elementType: 'labels',              stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park',             elementType: 'geometry.fill',       stylers: [{ color: '#e8e0d0' }] },
  { featureType: 'road',                 elementType: 'geometry',            stylers: [{ color: '#d4b896' }] },
  { featureType: 'road',                 elementType: 'geometry.stroke',     stylers: [{ color: '#c9a882' }] },
  { featureType: 'road',                 elementType: 'labels.text.fill',    stylers: [{ color: '#9a7a62' }] },
  { featureType: 'road.local',           elementType: 'geometry',            stylers: [{ color: '#e8d8c4' }] },
  { featureType: 'road.highway',         elementType: 'geometry',            stylers: [{ color: '#c9a882' }] },
  { featureType: 'road.highway',         elementType: 'geometry.stroke',     stylers: [{ color: '#b89070' }] },
  { featureType: 'transit',              elementType: 'geometry',            stylers: [{ color: '#e8e0d4' }] },
  { featureType: 'transit',              elementType: 'labels',              stylers: [{ visibility: 'off' }] },
  { featureType: 'water',                elementType: 'geometry.fill',       stylers: [{ color: '#dde8e4' }] },
  { featureType: 'water',                elementType: 'labels.text.fill',    stylers: [{ color: '#8aaa9a' }] },
]

window.initCabinetMap = function () {
  const mapEl = document.getElementById('cabinet-map')
  if (!mapEl) return

  const map = new google.maps.Map(mapEl, {
    center: { lat: 46.2353, lng: 7.5168 },
    zoom: 17,
    styles: MAP_STYLES,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER,
    },
  })

  const geocoder = new google.maps.Geocoder()
  geocoder.geocode({ address: 'Rue de Pramagnon 54, 3979 Grône, Valais, Suisse' }, (results, status) => {
    if (status === 'OK' && results[0]) {
      const position = results[0].geometry.location
      map.setCenter(position)
      new google.maps.Marker({
        position,
        map,
        title: 'Cabinet Parenthèse Hygiéniste',
        icon: {
          path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
          fillColor: '#6F437E',
          fillOpacity: 1,
          strokeColor: '#5A3268',
          strokeWeight: 1,
          scale: 1.4,
          anchor: new google.maps.Point(12, 22),
        },
      })
    }
  })
}
