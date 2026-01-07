import React, { useEffect, useRef, useState } from 'react'

const Ques2 = () => {
  const aboutRef = useRef(null)
  const servicesRef = useRef(null)
  const portfolioRef = useRef(null)
  const contactRef = useRef(null)

  const sectionPositionsRef = useRef({})
  const [activeSection, setActiveSection] = useState('about')

  const sections = [
    { id: 'about', label: 'About', ref: aboutRef },
    { id: 'services', label: 'Services', ref: servicesRef },
    { id: 'portfolio', label: 'Portfolio', ref: portfolioRef },
    { id: 'contact', label: 'Contact', ref: contactRef },
  ]

  const scrollToSection = (id) => {
    const section = sections.find((s) => s.id === id)
    if (section?.ref?.current) {
      section.ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Store section positions in a ref (no re-render needed when they change)
  const updateSectionPositions = () => {
    const positions = {}
    sections.forEach((section) => {
      if (section.ref.current) {
        const rect = section.ref.current.getBoundingClientRect()
        const scrollTop = window.scrollY || window.pageYOffset
        positions[section.id] = rect.top + scrollTop
      }
    })
    sectionPositionsRef.current = positions
  }

  useEffect(() => {
    // Initial calculation after mount
    updateSectionPositions()

    const handleScroll = () => {
      const scrollPos = window.scrollY || window.pageYOffset
      const offset = 80 // account for fixed nav height

      let currentSection = 'about'
      const positions = sectionPositionsRef.current

      Object.keys(positions).forEach((id) => {
        if (scrollPos + offset >= positions[id]) {
          currentSection = id
        }
      })

      setActiveSection(currentSection)
    }

    const handleResize = () => {
      updateSectionPositions()
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div>
      {/* Fixed Navigation Bar */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          backgroundColor: '#1a1a1a',
          color: '#fff',
          zIndex: 1000,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            style={{
              border: 'none',
              background: 'none',
              color: activeSection === section.id ? '#646cff' : '#fff',
              fontWeight: activeSection === section.id ? '700' : '400',
              cursor: 'pointer',
              padding: '8px 12px',
              borderBottom:
                activeSection === section.id ? '2px solid #646cff' : '2px solid transparent',
            }}
          >
            {section.label}
          </button>
        ))}
      </nav>

      {/* Page Content */}
      <div style={{ paddingTop: '80px' }}>
        <section
          id="about"
          ref={aboutRef}
          style={{ minHeight: '100vh', padding: '40px 16px', backgroundColor: '#111827' }}
        >
          <h2>About</h2>
          <p>
            This is the About section. Scroll or use the navigation bar above to jump between
            sections smoothly.
          </p>
        </section>

        <section
          id="services"
          ref={servicesRef}
          style={{ minHeight: '100vh', padding: '40px 16px', backgroundColor: '#020617' }}
        >
          <h2>Services</h2>
          <p>
            This section describes the services offered. The navigation highlights the section
            currently in view.
          </p>
        </section>

        <section
          id="portfolio"
          ref={portfolioRef}
          style={{ minHeight: '100vh', padding: '40px 16px', backgroundColor: '#0f172a' }}
        >
          <h2>Portfolio</h2>
          <p>
            Showcase your work here. The scroll-to-section navigation uses refs without unnecessary
            re-renders for position tracking.
          </p>
        </section>

        <section
          id="contact"
          ref={contactRef}
          style={{ minHeight: '100vh', padding: '40px 16px', backgroundColor: '#020617' }}
        >
          <h2>Contact</h2>
          <p>Contact information and a call-to-action can be placed in this section.</p>
        </section>
      </div>
    </div>
  )
}

export default Ques2
