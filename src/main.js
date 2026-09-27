// ── Hero height: use visualViewport to get the real visible height on iOS Safari.
// Set once at load, update only on orientation change (never on scroll).
function setHeroHeight () {
  const raw = window.visualViewport?.height ?? window.innerHeight
  document.documentElement.style.setProperty('--hero-h', (raw * 0.90) + 'px')
}
setHeroHeight()
window.addEventListener('orientationchange', () => setTimeout(setHeroHeight, 200))

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

// ── Navbar: translucent → white on scroll + active link tracking
const navbar     = document.getElementById('navbar')
const navLinks   = document.querySelectorAll('.nav-link')
const navHrefs   = new Set(Array.from(navLinks).map(l => l.getAttribute('href').slice(1)))
const sections   = Array.from(document.querySelectorAll('section[id]')).filter(s => navHrefs.has(s.id))

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

// ── Cabinet carousel (infinite loop via cloned edge slides)
;(function () {
  const carousel = document.querySelector('.cabinet-carousel')
  if (!carousel) return
  const track = carousel.querySelector('.cabinet-carousel-track')
  const dots  = carousel.querySelectorAll('.cabinet-carousel-dot')
  const originalSlides = Array.from(carousel.querySelectorAll('.cabinet-carousel-slide'))
  const total = originalSlides.length
  if (total < 2) return

  const firstClone = originalSlides[0].cloneNode(true)
  const lastClone  = originalSlides[total - 1].cloneNode(true)
  firstClone.setAttribute('aria-hidden', 'true')
  lastClone.setAttribute('aria-hidden', 'true')
  track.appendChild(firstClone)
  track.insertBefore(lastClone, originalSlides[0])

  // Native w/h ratio of each real photo, so the frame can match portrait or landscape shots without cropping
  const ratios = originalSlides.map(img => Number(img.dataset.w) / Number(img.dataset.h))

  // Extended track: [lastClone, slide0..slideN-1, firstClone] → real slides live at index 1..total
  let current = 1
  let timer

  function realIndexOf(pos) {
    return (pos - 1 + total) % total
  }

  function render() {
    track.style.transform = `translateX(-${current * 100}%)`
  }

  function updateDots() {
    const realIndex = realIndexOf(current)
    dots.forEach((d, i) => d.classList.toggle('is-active', i === realIndex))
  }

  const BASE_HEIGHT = 480 // target height (px) when there's room; width follows each photo's own ratio

  function setSizeFor(pos, animate) {
    const ratio = ratios[realIndexOf(pos)]
    const parentStyle    = getComputedStyle(carousel.parentElement)
    const availableWidth = carousel.parentElement.clientWidth
      - parseFloat(parentStyle.paddingLeft) - parseFloat(parentStyle.paddingRight)

    let width  = BASE_HEIGHT * ratio
    let height = BASE_HEIGHT
    if (width > availableWidth) {
      width  = availableWidth
      height = availableWidth / ratio
    }

    if (!animate) carousel.style.transition = 'none'
    carousel.style.width  = `${width}px`
    carousel.style.height = `${height}px`
    if (!animate) {
      carousel.offsetHeight // force reflow so the next transition re-applies
      carousel.style.transition = ''
    }
  }

  function jumpTo(index) {
    track.style.transition = 'none'
    current = index
    render()
    setSizeFor(current, false)
    track.offsetHeight // force reflow so the next transition re-applies
    track.style.transition = ''
  }

  jumpTo(1) // initial position, no animation

  function goTo(index) {
    current = index
    render()
    updateDots()
    setSizeFor(current, true)
  }

  window.addEventListener('resize', () => setSizeFor(current, false))

  track.addEventListener('transitionend', (e) => {
    if (e.propertyName !== 'transform') return
    if (current === 0) jumpTo(total)
    else if (current === total + 1) jumpTo(1)
  })

  carousel.querySelector('.cabinet-carousel-btn--prev').addEventListener('click', () => { goTo(current - 1); resetTimer() })
  carousel.querySelector('.cabinet-carousel-btn--next').addEventListener('click', () => { goTo(current + 1); resetTimer() })
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i + 1); resetTimer() }))

  // Touch/swipe support
  let touchStartX = 0
  carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX }, { passive: true })
  carousel.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); resetTimer() }
  }, { passive: true })

  function resetTimer() { clearInterval(timer); timer = setInterval(() => goTo(current + 1), 5000) }

  // Only start auto-advancing once the carousel has scrolled into view for the first time
  const autoplayObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        resetTimer()
        autoplayObserver.unobserve(entry.target)
      }
    })
  }, { threshold: 0.2 })
  autoplayObserver.observe(carousel)

  // Mobile/desktop browsers sometimes drop the GPU layer of transformed elements
  // while the tab/app is backgrounded, leaving images black on return — force a repaint.
  function forceRepaint() {
    carousel.querySelectorAll('img').forEach((img) => {
      img.style.display = 'none'
      void img.offsetHeight
      img.style.display = ''
    })
    const prevTransition = track.style.transition
    track.style.transition = 'none'
    render()
    void track.offsetHeight
    track.style.transition = prevTransition
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return
    forceRepaint()
    setTimeout(forceRepaint, 150) // some mobile browsers restore the layer late
  })

  // Back/forward-cache restores (e.g. returning via the browser's back button)
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) forceRepaint()
  })
})()

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

// ── RDV modal
const rdvModal   = document.getElementById('rdv-modal')
const rdvClose   = document.getElementById('rdv-modal-close')
const rdvOverlay = document.getElementById('rdv-modal-overlay')

function openRdvModal ()  { rdvModal.hidden = false; document.body.style.overflow = 'hidden' }
function closeRdvModal () { rdvModal.hidden = true;  document.body.style.overflow = '' }

document.querySelectorAll('.rdv-trigger').forEach(btn => btn.addEventListener('click', openRdvModal))
rdvClose.addEventListener('click', closeRdvModal)
rdvOverlay.addEventListener('click', closeRdvModal)
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeRdvModal() })

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

  // On mobile the container may be invisible (fade-in) when Maps first renders,
  // causing a blank tile area. Trigger resize once it becomes visible.
  const resizeObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      google.maps.event.trigger(map, 'resize')
      map.setCenter(map.getCenter())
      resizeObserver.disconnect()
    }
  }, { threshold: 0.1 })
  resizeObserver.observe(mapEl)

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
