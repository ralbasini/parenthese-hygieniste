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
  const isOpen = !mobileMenu.classList.contains('hidden')
  mobileMenu.classList.toggle('hidden', isOpen)
  hamburger.classList.toggle('open', !isOpen)
  hamburger.setAttribute('aria-expanded', String(!isOpen))
})

// Close mobile menu when a link is tapped
mobileMenu.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => {
    mobileMenu.classList.add('hidden')
    hamburger.classList.remove('open')
    hamburger.setAttribute('aria-expanded', 'false')
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
