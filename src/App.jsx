import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import trainImg from './assets/train.png'
import landscapeImg from './assets/landscape.jpg'
import logoImg from './assets/logo.png'
import cloudsImg from './assets/clouds.webp'
import loadScreenImg from './assets/load-screen.png'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const [loaderVisible, setLoaderVisible] = useState(true)
  const loaderRef = useRef(null)
  const landscapeRef = useRef(null)
  const trainRef = useRef(null)
  const titleRef = useRef(null)
  const logoRef = useRef(null)
  const brandRef = useRef(null)
  const sectionWrapperRef = useRef(null)
  const textLeftRef = useRef(null)
  const textRightRef = useRef(null)
  const navRef = useRef(null)
  const cloudsTrackRef = useRef(null)
  const cloudsLayerRef = useRef(null)
  const navBrandRef = useRef(null)
  const navLogoRef = useRef(null)

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!loaderRef.current) return
    document.body.style.overflow = 'hidden'
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = ''
        setLoaderVisible(false)
      },
    })
    tl.to(loaderRef.current, { scale: 20, duration: 3.8, ease: 'power2.inOut' }, 0)
    return () => {
      tl.kill()
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const lenis = new Lenis({
      duration: 2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    lenis.on('scroll', ({ scroll }) => {
      const sectionStart = sectionWrapperRef.current
        ? sectionWrapperRef.current.offsetTop - window.innerHeight
        : 0
      const translateY = -Math.min(Math.max(0, scroll - sectionStart), window.innerHeight)

      if (landscapeRef.current)
        landscapeRef.current.style.transform = `translateX(${-scroll * 0.5}px) translateY(${translateY}px)`

      if (cloudsLayerRef.current)
        cloudsLayerRef.current.style.transform = `translateY(${translateY}px)`

      if (cloudsTrackRef.current)
        cloudsTrackRef.current.style.transform = `translateX(${-scroll * 0.3}px)`

      if (trainRef.current) {
        const t = Math.min(scroll / Math.max(sectionStart, 1), 1)
        const eased = 1 - Math.pow(1 - t, 4)
        trainRef.current.style.transform = `scale(${1 + eased * 3})`
      }
    })

    lenis.on('scroll', ScrollTrigger.update)

    const lenisRaf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(lenisRaf)
    gsap.ticker.lagSmoothing(0)

    gsap.set([logoRef.current, titleRef.current], { opacity: 0 })
    gsap.set(navLogoRef.current, { opacity: 0 })

    const brandTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.scroll-spacer',
        start: '25% top',
        end: '70% top',
        scrub: 0.5,
      },
    })

    brandTl.to(
      [logoRef.current, titleRef.current],
      { opacity: 1, duration: 0.25, ease: 'power1.inOut' },
      0
    )

    brandTl.to(
      logoRef.current,
      { y: -80, opacity: 0, filter: 'blur(12px)', height: 0, duration: 0.5, ease: 'power2.inOut' },
      0.3
    )

    brandTl.to(
      brandRef.current,
      { top: '1.5rem', y: 0, gap: 0, duration: 0.6, ease: 'power2.inOut' },
      0.3
    )

    brandTl.to(
      titleRef.current,
      { fontSize: '1rem', letterSpacing: '0.12em', duration: 0.6, ease: 'power2.inOut' },
      0.3
    )

    const transitionTrigger = {
      trigger: sectionWrapperRef.current,
      start: 'top 60%',
      end: 'top top',
      scrub: 0.5,
    }

    gsap.to(landscapeRef.current, {
      filter: 'blur(20px)', ease: 'power1.inOut', scrollTrigger: transitionTrigger,
    })

    gsap.to(trainRef.current, {
      opacity: 0, ease: 'power1.inOut', scrollTrigger: transitionTrigger,
    })

    gsap.fromTo(
      [textLeftRef.current, textRightRef.current],
      { opacity: 0, filter: 'blur(20px)', y: 20 },
      {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: sectionWrapperRef.current,
          start: 'top 60%',
          end: 'bottom bottom',
          scrub: 1,
          onLeave: () => gsap.set(
            [textLeftRef.current, textRightRef.current],
            { opacity: 1, filter: 'blur(0px)', y: 0 }
          ),
        },
      }
    )

    gsap.to(navRef.current, {
      color: '#000',
      ease: 'none',
      scrollTrigger: {
        trigger: sectionWrapperRef.current,
        start: 'top top',
        end: 'top top',
        toggleActions: 'play none none reverse',
      },
    })

    gsap.to(titleRef.current, {
      color: '#000',
      ease: 'none',
      scrollTrigger: {
        trigger: sectionWrapperRef.current,
        start: 'top top',
        end: 'top top',
        toggleActions: 'play none none reverse',
      },
    })

    return () => {
      gsap.ticker.remove(lenisRaf)
      lenis.destroy()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <>
      {loaderVisible && (
        <div className="loader" aria-hidden="true">
          <div ref={loaderRef} className="loader-inner">
            <img className="loader-img" src={loadScreenImg} alt="" />
          </div>
        </div>
      )}
      <nav ref={navRef} className="nav">
        <div className="nav-group">
          <a href="#">Главная</a>
          <a href="#">О нас</a>
        </div>
        <div ref={navBrandRef} className="nav-brand">
          <img ref={navLogoRef} className="nav-brand-logo" src={logoImg} alt="logo" />
        </div>
        <div className="nav-group">
          <a href="#">Маршруты</a>
          <a href="#">Контакты</a>
        </div>
      </nav>
      <div className="scroll-spacer" />
      <div className="scene">
        <div ref={landscapeRef} className="landscape">
          <img className="landscape-img" src={landscapeImg} alt="" />
          <img className="landscape-img landscape-img--mirror" src={landscapeImg} alt="" />
        </div>
        <div ref={cloudsLayerRef} className="clouds-layer">
          <div className="clouds-drift">
            <div ref={cloudsTrackRef} className="clouds-track">
              <img className="clouds-img" src={cloudsImg} alt="" />
              <img className="clouds-img" src={cloudsImg} alt="" />
            </div>
          </div>
        </div>
        <img ref={trainRef} className="train" src={trainImg} alt="train" />
      </div>
      <div ref={brandRef} className="brand">
        <img ref={logoRef} className="brand-logo" src={logoImg} alt="logo" />
        <h1 ref={titleRef} className="brand-title">БЧ. Мой поезд</h1>
      </div>
      <div ref={sectionWrapperRef} className="section-yellow-wrapper">
        <section className="section-yellow">
          <div ref={textLeftRef} className="section-text">
            <h3>Что такое Lorem Ipsum?</h3>
            <p>Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.</p>
          </div>
          <div ref={textRightRef} className="section-text">
            <h3>Почему он используется?</h3>
            <p>Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться.</p>
          </div>
        </section>
      </div>
    </>
  )
}

export default App
