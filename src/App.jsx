import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import trainImg from './assets/train.png'
import landscapeImg from './assets/landscape.jpg'
import logoImg from './assets/logo.png'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const landscapeRef = useRef(null)
  const trainRef = useRef(null)
  const titleRef = useRef(null)
  const logoRef = useRef(null)
  const titleWrapRef = useRef(null)
  const logoWrapRef = useRef(null)
  const sectionWrapperRef = useRef(null)
  const textLeftRef = useRef(null)
  const textRightRef = useRef(null)
  const navRef = useRef(null)

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

      if (titleWrapRef.current)
        titleWrapRef.current.style.transform = `translate(-50%, calc(-50% + ${translateY}px))`

      if (logoWrapRef.current)
        logoWrapRef.current.style.transform = `translate(-50%, calc(-50% + ${translateY}px))`

      if (trainRef.current) {
        const t = Math.min(scroll / Math.max(sectionStart, 1), 1)
        const eased = t * t * (3 - 2 * t)
        trainRef.current.style.transform = `scale(${1 + eased * 2})`
      }
    })

    lenis.on('scroll', ScrollTrigger.update)

    const lenisRaf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(lenisRaf)
    gsap.ticker.lagSmoothing(0)

    const fogInOut = (el) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.scroll-spacer',
          start: '35% top',
          end: '95% top',
          scrub: 0.5,
        },
      })

      tl.fromTo(
        el,
        { opacity: 0, filter: 'blur(20px)', x: -40, y: -25 },
        { opacity: 1, filter: 'blur(0px)', x: 0, y: 0, duration: 0.5, ease: 'power1.inOut' }
      )

      tl.to(
        el,
        { opacity: 0, filter: 'blur(24px)', duration: 0.8, ease: 'power2.in' }
      )

      return tl
    }

    fogInOut(titleRef.current)
    fogInOut(logoRef.current)

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

    return () => {
      gsap.ticker.remove(lenisRaf)
      lenis.destroy()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <>
      <nav ref={navRef} className="nav">
        <div className="nav-group">
          <a href="#">Главная</a>
          <a href="#">О нас</a>
        </div>
        <div className="nav-group">
          <a href="#">Маршруты</a>
          <a href="#">Контакты</a>
        </div>
      </nav>
      <div className="scroll-spacer" />
      <div className="scene">
        <div ref={landscapeRef} className="landscape">
          <div className="landscape-sway" style={{ '--img': `url(${landscapeImg})` }}>
            <div className="landscape-tile" />
            <div className="landscape-tile landscape-tile--mirror" />
            <div className="landscape-tile" />
            <div className="landscape-tile landscape-tile--mirror" />
          </div>
        </div>
        <img ref={trainRef} className="train" src={trainImg} alt="train" />
        <div ref={logoWrapRef} className="logo-wrap">
          <img ref={logoRef} className="logo" src={logoImg} alt="logo" />
        </div>
        <div ref={titleWrapRef} className="title-wrap">
          <h1 ref={titleRef} className="title">БЧ. Мой поезд</h1>
        </div>
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
