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
  const [paymentModal, setPaymentModal] = useState(null);

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

  useEffect(() => {
    if (allImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }, 3000); // Auto-slide every 3 seconds
    
    return () => clearInterval(interval);
  }, [allImages.length]);

  const prevImage = () => {
    if (allImages.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const nextImage = () => {
    if (allImages.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const scrollToPayment = () => {
    // Instead of scrolling to the payment section, open the modal for the main book
    setPaymentModal({
      title: settings.bookTitle,
      price: settings.price,
      qrCode: settings.qrCode,
      upiId: settings.upiId,
      isMain: true
    });
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



      {/* ADDITIONAL BOOKS SECTION */}
      {settings.books && (
        <section className={styles.additionalBooksSection} style={{ padding: '4rem 0', backgroundColor: '#fff' }}>
          <div className="container">
            <div className={styles.sectionTitle}>
              <h2>More Books Available</h2>
              <p>Check out our other premium titles below.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
              {(() => {
                let parsedBooks = [];
                try {
                  parsedBooks = typeof settings.books === 'string' ? JSON.parse(settings.books) : settings.books;
                } catch(e) {}
                
                return parsedBooks.map((book, idx) => {
                  const bookWhatsappMessage = encodeURIComponent(`Hi, I have completed the payment of ₹${book.price} for the eBook: ${book.title}. Here is my payment screenshot. Please send me the PDF.`);
                  const bookWhatsappUrl = `https://wa.me/${specificWhatsappNumber}?text=${bookWhatsappMessage}`;

                  return (
                    <div key={idx} style={{ border: '1px solid var(--border)', borderRadius: '1rem', overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                      <div style={{ position: 'relative', width: '100%', height: '250px', backgroundColor: '#f3f4f6' }}>
                        {book.coverImage ? (
                          <Image src={book.coverImage} alt={book.title} fill style={{ objectFit: 'contain', padding: '1rem' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>No Cover</div>
                        )}
                      </div>
                      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>{book.title}</h3>
                        <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-muted)', fontSize: '1rem', flexGrow: 1 }}>{book.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                          <span style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>₹{book.price}</span>
                          <button onClick={() => setPaymentModal({ title: book.title, price: book.price, qrCode: settings.qrCode, upiId: settings.upiId, isMain: false })} style={{ background: '#10B981', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)' }}>Buy Now</button>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </section>
      )}

      {/* PAYMENT MODAL */}
      {paymentModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setPaymentModal(null)}>
          <div style={{ background: '#fff', borderRadius: '1rem', padding: '2rem', maxWidth: '400px', width: '100%', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setPaymentModal(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
            
            <h3 style={{ textAlign: 'center', margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{paymentModal.title}</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', color: '#10B981', marginBottom: '1rem' }}>₹{paymentModal.price}</div>
            
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.85rem' }}>One-time payment • PDF eBook</p>
                
            <h4 style={{ textAlign: 'center', margin: '0 0 0.5rem 0' }}>Scan & Pay</h4>
            <div className={styles.qrContainer} style={{ margin: '0 auto 0.5rem auto', width: '180px', height: '180px', padding: '0.5rem', border: '2px solid #e5e7eb', borderRadius: '0.5rem' }}>
              {paymentModal.qrCode ? (
                 <Image src={paymentModal.qrCode} alt="Payment QR Code" width={160} height={160} style={{ objectFit: 'contain' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', color: '#9ca3af', fontSize: '0.8rem', textAlign: 'center' }}>
                  [QR CODE]
                </div>
              )}
            </div>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <span className={styles.upiId} style={{ fontSize: '1rem', padding: '0.25rem 0.75rem', background: '#f3f4f6', borderRadius: '999px', display: 'inline-block' }}>UPI ID: {paymentModal.upiId}</span>
            </div>
            
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>After payment, send the screenshot on WhatsApp to get your PDF immediately.</p>
            
            <a href={`https://wa.me/${specificWhatsappNumber}?text=${encodeURIComponent(`Hi, I have completed the payment of ₹${paymentModal.price} for the eBook: ${paymentModal.title}. Here is my payment screenshot. Please send me the PDF.`)}`} target="_blank" rel="noopener noreferrer" className={styles.btnWhatsapp} style={{ padding: '0.75rem 1rem', fontSize: '1rem', display: 'flex', justifyContent: 'center', width: '100%' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem' }}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              SEND SCREENSHOT
            </a>
          </div>
        </div>
      )}
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
