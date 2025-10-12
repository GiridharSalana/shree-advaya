# ShreeAdvaya - Premium Saree Collection Website

A modern, responsive website showcasing premium saree collections with seamless WhatsApp integration for business inquiries.

## 🎨 Features

- **Modern Design**: Beautiful UI with symmetrical layouts and centered content
- **Hero Slideshow**: HD background image slideshow with smooth transitions
- **Responsive**: Optimized for desktop, tablet, and mobile devices
- **Product Showcase**: Filterable product categories (Silk, Cotton, Designer, Bridal)
- **Gallery**: Interactive image gallery with lightbox functionality
- **WhatsApp Integration**: Direct messaging for business inquiries
- **Smooth Animations**: Scroll-triggered animations and hover effects
- **All Images Local**: No external dependencies - works offline

## 📁 Project Structure

```
ShreeAdvaya/
├── index.html                  # Main HTML file
├── README.md                   # Project documentation
└── assets/                     # All assets organized by type
    ├── css/
    │   └── styles.css          # Main stylesheet (20 KB)
    ├── js/
    │   └── script.js           # JavaScript functionality (13 KB)
    ├── images/
    │   ├── hero-1.jpg to hero-4.jpg       # HD slideshow backgrounds
    │   ├── product-1.jpg to product-6.jpg # Product images
    │   └── gallery-1.jpg to gallery-6.jpg # Gallery images
    └── README.md               # Assets documentation
```

## 🚀 Setup

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- A text editor (VS Code, Sublime Text, etc.) for customization

### Installation
1. **Download/Clone** this repository
2. **Open** `index.html` in your web browser
3. That's it! The website is ready to use.

### Local Development
```bash
# Navigate to project directory
cd ShreeAdvaya

# Open with your default browser (on Linux/Mac)
open index.html

# Or use a local server (optional)
python -m http.server 8000
# Then visit http://localhost:8000
```

## ⚙️ Configuration

### Update Business Information

#### WhatsApp Number
1. Open `assets/js/script.js`
2. Find line 70:
```javascript
const phoneNumber = '919876543210'; // Replace with your number
```
3. Replace with your WhatsApp business number (include country code, no + or spaces)

#### Contact Details
Edit `index.html` and update:
- Phone: `+91 98765 43210`
- Email: `info@shreeadvaya.com`
- Location: `Mumbai, Maharashtra, India`

### Customize Products
In `index.html`, locate the Products section and update:
- Product names
- Prices (₹)
- Categories (data-category attribute)
- Images (update src paths in assets/images/)

### Change Colors
In `assets/css/styles.css`, update:
- Primary gold: `#d4af37`
- Backgrounds: `#fefbf5`, `#f8f4eb`
- Text colors: `#1a1a1a`, `#666`

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Key Sections

1. **Hero Section**: Full-screen slideshow with call-to-action buttons
2. **About Section**: Business overview with 4 feature cards
3. **Products Section**: Filterable product grid with 6 sarees
4. **Gallery Section**: 6-image gallery with lightbox
5. **Contact Section**: Contact info and quick inquiry form
6. **Footer**: Links, categories, and social media

## 📦 Total Size

- **Images**: ~3.1 MB (16 files)
- **CSS**: 20 KB
- **JavaScript**: 13 KB
- **HTML**: 17 KB
- **Total**: ~3.16 MB

## 🔧 Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with flexbox/grid
- **Vanilla JavaScript**: No frameworks needed
- **Font Awesome**: Icons
- **Google Fonts**: Playfair Display + Inter

## 📄 License

Created for ShreeAdvaya. All rights reserved.

---

**Note**: Update all placeholder content with your actual business information before publishing.
