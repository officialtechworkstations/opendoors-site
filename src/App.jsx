import { useRef, useState } from 'react'
import { Apple, ArrowRight, Check, ChevronLeft, ChevronRight, Download, MapPin, Pause, Play, Smartphone, Zap } from 'lucide-react'

const poolImage = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-10-12%20at%2011.10.49%20AM-nIAK3ZdqIPG0y3mLFwUbNoeq6ufqGg.jpeg'

const sourceReels = [
  { src: '/reels/open1.mp4', title: 'Luxury 2-Bed Penthouse', location: 'Lekki Phase 1, Lagos', price: '₦140,000 / night', featured: true },
  { src: '/reels/open2.mp4', title: 'Modern Studio Apartment', location: 'Victoria Island, Lagos', price: '₦85,000 / night' },
  { src: '/reels/open3.mp4', title: 'Cozy 1-Bed Apartment', location: 'Ikoyi, Lagos', price: '₦120,000 / night' },
]

// Repeat the three supplied clips to create the requested six-card looping reel.
const reels = Array.from({ length: 6 }, (_, index) => ({
  ...sourceReels[index % sourceReels.length],
  id: `reel-${index + 1}`,
}))

function Brand() {
  return <span className="brand">Open<span>Doors</span></span>
}

function AppDownload() {
  return (
    <section className="download-card" id="download" aria-label="Download the OpenDoors app">
      <div className="download-wave" />
      <div className="download-content">
        <span className="download-label">GET THE OPENDOORS APP</span>
        <p>Book stays &amp; explore experiences anywhere.</p>
        <a className="download-button" href="#app-store">
          <span className="download-icon"><Download size={13} strokeWidth={3} /></span>
          Download OpenDoors
        </a>
      </div>
      <div className="store-buttons">
        <a href="#google-play" className="store-button"><Smartphone size={17} fill="currentColor" /><span><small>GET IT ON</small>Google Play</span></a>
        <a href="#app-store" className="store-button"><Apple size={17} fill="currentColor" /><span><small>DOWNLOAD ON</small>App Store</span></a>
      </div>
    </section>
  )
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) return '--:--'
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`
}

function ReelCard({ reel, index }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState('--:--')

  const togglePlayback = async () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      document.querySelectorAll('.reel-video').forEach((item) => {
        if (item !== video) item.pause()
      })
      try {
        await video.play()
      } catch {
        setPlaying(false)
      }
    } else {
      video.pause()
    }
  }

  return (
    <article className="reel-card" data-reel-index={index} aria-label={`${reel.title} video reel`}>
      <video
        ref={videoRef}
        className="reel-video"
        src={reel.src}
        preload="metadata"
        playsInline
        loop
        onLoadedMetadata={(event) => {
          setDuration(formatDuration(event.currentTarget.duration))
          event.currentTarget.currentTime = 0.01
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <div className="reel-shade" />
      <span className="duration"><i />{duration}</span>
      <button className={`play-button ${playing ? 'playing' : ''}`} onClick={togglePlayback} aria-label={playing ? `Pause ${reel.title}` : `Play ${reel.title}`}>
        {playing ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
      </button>
      <div className="reel-copy">
        {reel.featured && <span className="featured">FEATURED</span>}
        <h3>{reel.title}</h3>
        <div className="reel-meta"><span><MapPin size={14} fill="currentColor" /> {reel.location}</span><strong>{reel.price}</strong></div>
      </div>
    </article>
  )
}

function ReelsSection() {
  const viewportRef = useRef(null)
  const [activeReel, setActiveReel] = useState(0)

  const showReel = (nextIndex) => {
    const normalizedIndex = (nextIndex + reels.length) % reels.length
    setActiveReel(normalizedIndex)

    const viewport = viewportRef.current
    const card = viewport?.querySelector(`[data-reel-index="${normalizedIndex}"]`)
    if (viewport && card) viewport.scrollTo({ left: card.offsetLeft, behavior: 'smooth' })
  }

  const updateActiveReel = () => {
    const viewport = viewportRef.current
    if (!viewport) return

    const cards = Array.from(viewport.querySelectorAll('[data-reel-index]'))
    const closestCard = cards.reduce((closest, card) => (
      Math.abs(card.offsetLeft - viewport.scrollLeft) < Math.abs(closest.offsetLeft - viewport.scrollLeft) ? card : closest
    ), cards[0])

    if (closestCard) setActiveReel(Number(closestCard.dataset.reelIndex))
  }

  return (
    <section className="reels-section" id="all-reels" aria-labelledby="reels-title">
      <div className="reels-heading-row">
        <div className="reels-heading-main">
          <span className="eyebrow orange">EXPLORE</span>
          <h2 id="reels-title">With Our <span>Reels Feature</span></h2>
          <p>Watch real apartments, fall in love, book now.</p>
        </div>
        <div className="reels-actions" aria-label="Reel navigation">
          <button className="carousel-button previous" onClick={() => showReel(activeReel - 1)} aria-label="Previous reel"><ChevronLeft size={24} /></button>
          <button className="carousel-button next" onClick={() => showReel(activeReel + 1)} aria-label="Next reel"><ChevronRight size={24} /></button>
          <button className="see-all" onClick={() => showReel(reels.length - 1)}>See all <ChevronRight size={18} /></button>
        </div>
      </div>
      <div className="reels-viewport" ref={viewportRef} onScroll={updateActiveReel}>
        <div className="reels-track">
          {reels.map((reel, index) => <ReelCard key={reel.id} reel={reel} index={index} />)}
        </div>
      </div>
      <div className="dots" aria-label="Choose a reel">
        {reels.map((reel, index) => (
          <button key={reel.id} className={index === activeReel ? 'active' : ''} onClick={() => showReel(index)} aria-label={`Show reel ${index + 1}`} aria-current={index === activeReel ? 'true' : undefined} />
        ))}
      </div>
    </section>
  )
}

export default function App() {
  return (
    <main className="site-shell">
      <section className="hero">
        <img className="hero-image" src={poolImage} alt="Bright luxury apartment courtyard with a swimming pool" />
        <div className="hero-top"><Brand /><span className="verified"><i /> VERIFIED HOSTS</span></div>
        <div className="desktop-hero-copy">
          <div className="desktop-eyebrow">FIND YOUR PERFECT STAY</div>
          <h1>Don&apos;t just<br />book your stay,<br /><em>book an<br />experience</em></h1>
          <p>Discover unique stays, unforgettable<br className="desktop-copy-break" /> experiences and amazing places, all in one<br className="desktop-copy-break" /> place.</p>
          <a className="desktop-cta" href="#download">
            <span>Get the OpenDoors app</span>
            <ArrowRight aria-hidden="true" size={30} strokeWidth={1.8} />
          </a>
        </div>
        <div className="hero-cutout" />
      </section>
      <section className="intro">
        <div className="eyebrow">★ &nbsp; FIND YOUR PERFECT STAY</div>
        <h1>Don&apos;t just book<br />your stay,<br /><em>book an experience</em></h1>
        <p className="intro-copy">Discover beautiful short lets for every moment from getaways to business trips and more.</p>
        <AppDownload />
      </section>
      <ReelsSection />
      <section className="trust-grid">
        <article><span className="trust-icon"><Check size={16} /></span><h3>100% Verified Homes</h3><p>Inspected for safety, power &amp; luxury amenities.</p></article>
        <article><span className="trust-icon"><Zap size={16} /></span><h3>Instant Check-in</h3><p>Seamless smart-lock and 24/7 concierge.</p></article>
      </section>
      <footer><Brand /><p>Africa&apos;s premier platform for bespoke shortlets, luxury stays, and curated travel living.</p><nav><a href="#about">About</a><a href="#stays">Find Stays</a><a href="#host">Host a Home</a><a href="#support">Support</a></nav><div className="home-bar" /><small>© 2025 OpenDoors Technologies Ltd (opendoors.ng). All rights reserved.</small></footer>
    </main>
  )
}
