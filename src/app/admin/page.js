'use client';

import { useState, useEffect } from 'react';
import styles from './admin.module.css';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [settings, setSettings] = useState({
    bookTitle: '',
    bookSubtitle: '',
    price: '',
    upiId: '',
    whatsappNumber: '',
    instagramId: '',
    brandName: '',
    email: '',
    refundPolicy: '',
    privacyPolicy: '',
    terms: '',
  });

  useEffect(() => {
    // Fetch initial public settings just to populate the form if possible
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setSettings(prev => ({ ...prev, ...data }));
        }
      });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        setError('Incorrect password');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('username', username);
    formData.append('password', password);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setSettings(prev => ({ ...prev, [type]: data.url }));
        setSuccess(`${type} uploaded successfully!`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed');
    }
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, username, password }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccess('Settings saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to save');
        if (res.status === 401) {
          setIsAuthenticated(false); // wrong password
        }
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Admin Login</h1>
        <form className={styles.loginForm} onSubmit={handleLogin}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.inputGroup}>
            <label>Admin ID (Username)</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
            />
          </div>
          <button type="submit" className={styles.button}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Website Settings</h1>
      
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <form className={styles.adminForm} onSubmit={handleSave}>
        
        <div className={styles.section}>
          <h2>Product Details</h2>
          <div className={styles.inputGroup}>
            <label>Book Title</label>
            <input type="text" name="bookTitle" value={settings.bookTitle || ''} onChange={handleChange} required />
          </div>
          <br/>
          <div className={styles.inputGroup}>
            <label>Book Subtitle</label>
            <textarea name="bookSubtitle" value={settings.bookSubtitle || ''} onChange={handleChange} required />
          </div>
          <br/>
          <div className={styles.inputGroup}>
            <label>Price (₹)</label>
            <input type="number" name="price" value={settings.price || ''} onChange={handleChange} required />
          </div>
          <br/>
          <div className={styles.inputGroup}>
            <label>Book Cover Image</label>
            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'bookCover')} />
          </div>
          <br/>
          <div className={styles.inputGroup}>
            <label>Sample Image 1</label>
            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'sampleImage1')} />
          </div>
          <br/>
          <div className={styles.inputGroup}>
            <label>Sample Image 2</label>
            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'sampleImage2')} />
          </div>
        </div>

        <div className={styles.section}>
          <h2>Payment & Delivery</h2>
          <div className={styles.inputGroup}>
            <label>UPI ID</label>
            <input type="text" name="upiId" value={settings.upiId || ''} onChange={handleChange} required />
          </div>
          <br/>
          <div className={styles.inputGroup}>
            <label>WhatsApp Number (include country code, e.g., 919876543210)</label>
            <input type="text" name="whatsappNumber" value={settings.whatsappNumber || ''} onChange={handleChange} required />
          </div>
          <br/>
          <div className={styles.inputGroup}>
            <label>Payment QR Code Image</label>
            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'qrCode')} />
            <small>Upload your UPI QR code image here. (Will be instantly applied)</small>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Brand & Socials</h2>
          <div className={styles.inputGroup}>
            <label>Brand Name</label>
            <input type="text" name="brandName" value={settings.brandName || ''} onChange={handleChange} required />
          </div>
          <br/>
          <div className={styles.inputGroup}>
            <label>Instagram Username (e.g., @yourhandle)</label>
            <input type="text" name="instagramId" value={settings.instagramId || ''} onChange={handleChange} required />
          </div>
          <br/>
          <div className={styles.inputGroup}>
            <label>Contact Email</label>
            <input type="email" name="email" value={settings.email || ''} onChange={handleChange} required />
          </div>
        </div>



        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Saving...' : 'Save All Text Settings'}
        </button>
      </form>
    </div>
  );
}
