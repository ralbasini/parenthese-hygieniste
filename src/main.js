// ── Hero height: use visualViewport to get the real visible height on iOS Safari.
// Set once at load, update only on orientation change (never on scroll).
function setHeroHeight () {
  const raw = window.visualViewport?.height ?? window.innerHeight
  document.documentElement.style.setProperty('--hero-h', raw + 'px')
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
  navbar.classList.toggle('scrolled', scrollY > 60)

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
