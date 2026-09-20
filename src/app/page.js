'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

function AccordionItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={styles.faqItem}>
      <button className={styles.faqQuestion} onClick={() => setIsOpen(!isOpen)}>
        {question}
        <span>{isOpen ? '−' : '+'}</span>
      </button>
      <div className={`${styles.faqAnswer} ${isOpen ? styles.open : ''}`}>
        <br/>
        {answer}
      </div>
    </div>
  );
}

export default function Home() {
  const [settings, setSettings] = useState(null);
  const [showSticky, setShowSticky] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));

    const handleScroll = () => {
      // Show sticky CTA after scrolling past 600px
      if (window.scrollY > 600) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const allImages = settings ? [settings.bookCover, settings.sampleImage1, settings.sampleImage2, settings.sampleImage3, settings.sampleImage4, settings.sampleImage5].filter(Boolean) : [];


  const prevImage = () => {
    if (allImages.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const nextImage = () => {
    if (allImages.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const scrollToPayment = () => {
    document.getElementById('payment-section').scrollIntoView({ behavior: 'smooth' });
  };

  if (!settings) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  const whatsappMessage = encodeURIComponent(`Hi, I have completed the payment for the eBook. Here is my payment screenshot. Please send me the PDF.`);
  const specificWhatsappNumber = '919415590278';
  const whatsappUrl = `https://wa.me/${specificWhatsappNumber}?text=${whatsappMessage}`;

  const customerMessages = [
    "Rahul from Delhi just bought this eBook",
    "Sneha from Mumbai just bought this eBook",
    "Aman from Pune just bought this eBook",
    "Priya from Bangalore just bought this eBook",
    "Vikram from Chennai just bought this eBook",
  ];
  const marqueeItems = [...customerMessages, ...customerMessages, ...customerMessages];

  return (
    <main className={styles.main}>
      {/* 2. HERO SECTION */}
      <section className={styles.hero} id="payment-section">
        <div className={styles.marqueeContainer}>
          <div className={styles.marqueeTrack}>
            {marqueeItems.map((msg, i) => (
              <div key={i} className={styles.marqueeItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span>Verified:</span> {msg}
              </div>
            ))}
          </div>
        </div>

        <div className={`container ${styles.animateFadeInUp}`} style={{ marginTop: '2.5rem' }}>
          <h1 className={styles.heroHeadline}>{settings.bookTitle}</h1>
          <p className={styles.heroSubtitle}>{settings.bookSubtitle}</p>
          
          <div className={styles.heroLayout}>
            <div className={styles.heroLeft}>
              <div className={styles.coverContainer}>
                {allImages.length > 0 ? (
                  <>
                    {allImages.map((img, idx) => (
                      <Image 
                        key={idx} 
                        src={img} 
                        alt={`Book Image ${idx + 1}`} 
                        fill 
                        style={{ 
                          objectFit: 'contain', 
                          opacity: idx === currentImageIndex ? 1 : 0, 
                          transition: 'opacity 0.3s ease-in-out' 
                        }} 
                      />
                    ))}
                    {allImages.length > 1 && (
                      <>
                        <button className={`${styles.navBtn} ${styles.navBtnLeft}`} onClick={prevImage} aria-label="Previous image">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>
                        <button className={`${styles.navBtn} ${styles.navBtnRight}`} onClick={nextImage} aria-label="Next image">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e5e7eb', color: '#9ca3af' }}>
                    [BOOK IMAGES]
                  </div>
                )}
              </div>
            </div>
            
            <div className={styles.heroRight}>
              <div className={styles.paymentBox}>
                <div className={styles.priceTag} style={{ marginBottom: '0.25rem', fontSize: '2.5rem' }}>₹{settings.price}</div>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.85rem' }}>One-time payment • PDF eBook</p>
                
                <h4 style={{ textAlign: 'center', margin: '0 0 0.5rem 0' }}>Scan & Pay</h4>
                <div className={styles.qrContainer} style={{ marginTop: '0', marginBottom: '0.5rem', width: '160px', height: '160px', padding: '0.5rem' }}>
                  {settings.qrCode ? (
                     <Image src={settings.qrCode} alt="Payment QR Code" fill style={{ objectFit: 'contain' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', color: '#9ca3af', fontSize: '0.8rem', textAlign: 'center' }}>
                      [YOUR PAYMENT QR CODE]
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <span className={styles.upiId} style={{ fontSize: '1rem', padding: '0.25rem 0.75rem' }}>UPI ID: {settings.upiId}</span>
                </div>
                
                <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>After payment, send the screenshot to get your PDF.</p>
                
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.btnWhatsapp} style={{ padding: '0.75rem 1rem', fontSize: '1rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  WHATSAPP +91 9415590278
                </a>

                <div className={styles.secureBadge}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  100% Secure Payment
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO GET IT SECTION */}
      <section className={styles.workflowSection}>
        <div className="container">
          <div className={styles.sectionTitle}>
            <h2>How to get your PDF?</h2>
            <p>A simple 4-step process to get instant access on WhatsApp.</p>
          </div>
          
          <div className={styles.workflowGrid}>
            <div className={styles.workflowStep}>
              <div className={styles.workflowIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path><rect x="7" y="7" width="10" height="10"></rect></svg>
              </div>
              <h4>1. Scan QR</h4>
              <p>Scan the payment QR code above.</p>
            </div>
            
            <div className={styles.workflowStep}>
              <div className={styles.workflowIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="M7 15h0M2 9.5h20"></path></svg>
              </div>
              <h4>2. Pay ₹{settings.price}</h4>
              <p>Complete the secure UPI payment.</p>
            </div>
            
            <div className={styles.workflowStep}>
              <div className={styles.workflowIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              </div>
              <h4>3. Screenshot</h4>
              <p>Take a screenshot of the successful payment screen.</p>
            </div>
            
            <div className={styles.workflowStep}>
              <div className={styles.workflowIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </div>
              <h4>4. Send on WhatsApp</h4>
              <p>Send the screenshot to us. We will send the PDF immediately!</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem', padding: '1.25rem', backgroundColor: '#F9FAFB', borderRadius: '0.75rem', border: '1px solid var(--border)', maxWidth: '500px', margin: '3rem auto 0' }}>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              If you face any issues, please contact support:<br/>
              <strong style={{ color: 'var(--foreground)', fontSize: '1.1rem', display: 'inline-block', marginTop: '0.25rem' }}>+91 9415590278</strong>
            </p>
          </div>
        </div>
      </section>











      {/* 16. MOBILE CTA (STICKY) */}
      <div className={`${styles.stickyCta} ${showSticky ? styles.visible : ''}`}>
        <button onClick={scrollToPayment} className={styles.btnPrimary} style={{ width: '100%', maxWidth: '400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
          <span>GET THE EBOOK</span>
          <span>₹{settings.price}</span>
        </button>
      </div>

    </main>
  );
}
