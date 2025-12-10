# Formula 1 Marketplace - Official & Creator Merchandise

A premium e-commerce platform for Formula 1 merchandise featuring both official team gear and creator-made products. Built with a luxury editorial aesthetic inspired by high-end fashion publications.

## Features

### 🏁 Core Functionality
- **Dual Channel Marketplace**: Official team merchandise and creator-made products
- **Full E-commerce Flow**: Catalog → Product Detail → Cart → Checkout → Payment
- **Advanced Filtering**: By channel, team, category, price range, and more
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 🎨 Design & Experience
- **Luxury Editorial Aesthetic**: Inspired by Dior and high-end fashion publications
- **Premium Typography**: Playfair Display for headlines, Inter for body text
- **Sophisticated Animations**: Smooth transitions and micro-interactions
- **Particle Background**: Dynamic p5.js particle system on homepage

### 💳 Payment Integration
- **Stripe Integration**: Credit/debit card processing (test mode)
- **PayPal Sandbox**: PayPal payment flow simulation
- **Cryptocurrency**: Demo crypto payment interface
- **Secure Checkout**: Form validation and payment processing

### 🛍️ Product Management
- **Comprehensive Catalog**: 12+ sample products with detailed information
- **Variant Support**: Size, color, and style options
- **Stock Management**: Real-time stock indicators and inventory tracking
- **Creator Royalties**: Transparent royalty information for creator products

### 🌍 Internationalization
- **Multi-language Support**: English and Indonesian translations
- **Currency Display**: USD pricing with proper formatting
- **Global Shipping**: Worldwide delivery options

## Technology Stack

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Tailwind CSS with custom properties
- **JavaScript ES6+**: Modern JavaScript with class-based architecture
- **Responsive Design**: Mobile-first approach with flexible layouts

### Libraries & Frameworks
- **Anime.js**: Smooth animations and transitions
- **Typed.js**: Typewriter effects for hero text
- **Splide.js**: Product carousels and image galleries
- **p5.js**: Particle background system
- **Splitting.js**: Advanced text animations
- **Stripe.js**: Payment processing integration

### Data Management
- **JSON Data Files**: Products, vendors, and translations
- **Local Storage**: Cart persistence across sessions
- **Mock APIs**: Simulated backend responses

## File Structure

```
/
├── index.html              # Homepage with hero and featured products
├── catalog.html            # Product catalog with filtering
├── product-detail.html     # Individual product pages
├── cart.html              # Shopping cart and checkout
├── main.js                # Core JavaScript functionality
├── products.json          # Sample product data
├── vendors.json           # Vendor/team information
├── en.json               # English translations
├── id.json               # Indonesian translations
├── resources/             # Images and assets
│   ├── hero-bg.jpg        # Hero background image
│   ├── product-*.jpg      # Product images
│   └── team-logos/        # Team logo images
├── interaction.md         # UX design documentation
├── design.md             # Visual design system
├── outline.md            # Project structure outline
└── README.md             # This file
```

## Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional but recommended)
- Node.js (for advanced development)

### Quick Start

1. **Clone or download the project files**
   ```bash
   git clone [repository-url]
   cd formula-1-marketplace
   ```

2. **Start a local server**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Python 2
   python -m SimpleHTTPServer 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   Navigate to `http://localhost:8000` in your web browser

### Payment Integration Setup

#### Stripe Integration
The project includes Stripe test integration. To use your own Stripe account:

1. **Get your Stripe keys**
   - Sign up at [stripe.com](https://stripe.com)
   - Get your publishable key from the Stripe Dashboard
   - Get your secret key for server-side operations

2. **Update the JavaScript**
   ```javascript
   // In main.js, update the Stripe initialization
   this.stripe = Stripe('your_publishable_key_here');
   ```

3. **Server-side implementation** (for production)
   ```javascript
   // Example serverless function for creating payment sessions
   const stripe = require('stripe')('your_secret_key_here');
   
   exports.createCheckoutSession = async (req, res) => {
     const session = await stripe.checkout.sessions.create({
       payment_method_types: ['card'],
       line_items: [{
         price_data: {
           currency: 'usd',
           product_data: { name: 'Product Name' },
           unit_amount: 9999, // Price in cents
         },
         quantity: 1,
       }],
       mode: 'payment',
       success_url: 'https://yourdomain.com/success',
       cancel_url: 'https://yourdomain.com/cancel',
     });
     
     res.json({ sessionId: session.id });
   };
   ```

#### PayPal Integration
To enable PayPal payments:

1. **Get PayPal credentials**
   - Create a PayPal Developer account
   - Create an app to get client ID and secret

2. **Update the payment processing**
   ```javascript
   // Add PayPal script to HTML
   <script src="https://www.paypal.com/sdk/js?client-id=your_client_id"></script>
   ```

3. **Implement PayPal buttons**
   ```javascript
   paypal.Buttons({
     createOrder: function(data, actions) {
       return actions.order.create({
         purchase_units: [{
           amount: { value: '99.99' }
         }]
       });
     },
     onApprove: function(data, actions) {
       return actions.order.capture().then(function(details) {
         // Handle successful payment
       });
     }
   }).render('#paypal-button-container');
   ```

#### Cryptocurrency Integration
For crypto payments, consider integrating with services like:
- Coinbase Commerce
- BitPay
- CoinGate

## Configuration

### Customization Options

#### Color Scheme
Update CSS custom properties in each HTML file:
```css
:root {
  --primary-white: #FFFFFF;
  --light-gray: #F8F9FA;
  --accent-black: #1A1A1A;
  --formula-red: #DC143C;
  --neutral-gray: #6C757D;
}
```

#### Typography
Modify font imports in HTML `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont&display=swap" rel="stylesheet">
```

#### Product Data
Update `products.json` with your merchandise:
```json
{
  "id": "unique-product-id",
  "title": "Product Name",
  "vendor_type": "official|creator",
  "team": "Ferrari",
  "price": 89.99,
  "images": ["path/to/image.jpg"],
  "variants": [{"id": "s", "label": "S", "stock": 10}],
  "description": "Product description",
  "badges": ["official", "new"]
}
```

### Email Configuration
For order confirmations, integrate with email services:

#### Using Mailtrap (Development)
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "your_mailtrap_username",
    pass: "your_mailtrap_password"
  }
});
```

#### Using SendGrid (Production)
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('your_sendgrid_api_key');

const msg = {
  to: 'customer@example.com',
  from: 'orders@yourdomain.com',
  subject: 'Order Confirmation',
  text: 'Thank you for your order!',
  html: '<strong>Order details here</strong>',
};

sgMail.send(msg);
```

## Development

### Adding New Features

#### New Product Categories
1. Update the category filter in `catalog.html`
2. Add category validation in `main.js`
3. Update product data in `products.json`

#### Additional Payment Methods
1. Add payment option to `cart.html`
2. Implement payment processing in `main.js`
3. Update order summary calculations

#### Language Support
1. Create new translation file (e.g., `es.json`)
2. Add language selector to navigation
3. Implement language switching logic

### Performance Optimization

#### Image Optimization
- Use WebP format with JPEG fallback
- Implement lazy loading for product images
- Use responsive images with srcset

#### Code Optimization
- Minify CSS and JavaScript for production
- Implement code splitting for large features
- Use CDN for external libraries

#### Caching Strategy
- Implement service worker for offline support
- Use browser caching for static assets
- Optimize API response caching

## Deployment

### Static Hosting
The project can be deployed to any static hosting service:

#### Netlify
1. Connect your GitHub repository
2. Set build command: `(empty)`
3. Set publish directory: `/`

#### Vercel
1. Import project from GitHub
2. Framework preset: Static
3. Build command: `(empty)`

#### GitHub Pages
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select main branch as source

### Server Requirements
For full functionality (payments, emails), deploy backend services:

#### Serverless Functions
- **Vercel Functions**: Deploy API endpoints
- **Netlify Functions**: Serverless backend logic
- **AWS Lambda**: Scalable serverless computing

#### Database Options
- **MongoDB Atlas**: Cloud database for product data
- **Firebase Firestore**: Real-time database
- **PostgreSQL**: Relational database option

## Testing

### Manual Testing Checklist
- [ ] Homepage loads with animations
- [ ] Product catalog displays correctly
- [ ] Filtering and sorting work properly
- [ ] Product details show all information
- [ ] Add to cart functionality works
- [ ] Cart updates quantities correctly
- [ ] Checkout form validates properly
- [ ] Payment processing completes
- [ ] Success modal appears after order
- [ ] Cart clears after successful purchase

### Automated Testing
Consider implementing:
- Unit tests for JavaScript functions
- Integration tests for checkout flow
- End-to-end tests with Cypress or Playwright
- Performance testing with Lighthouse

## Browser Support

### Supported Browsers
- Chrome 90+ (recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

### Progressive Enhancement
- Core functionality works without JavaScript
- Enhanced features require modern browser
- Graceful degradation for older browsers

## Security Considerations

### Client-side Security
- Input validation and sanitization
- XSS prevention measures
- HTTPS enforcement
- Content Security Policy headers

### Payment Security
- PCI compliance for payment processing
- Secure token handling
- Encrypted data transmission
- Regular security audits

### Data Protection
- GDPR compliance for EU users
- Privacy policy implementation
- User consent management
- Data encryption at rest

## Troubleshooting

### Common Issues

#### Cart not persisting
- Check localStorage availability
- Verify JavaScript is enabled
- Clear browser cache

#### Images not loading
- Verify image paths in JSON files
- Check file permissions
- Ensure proper MIME types

#### Payment failures
- Check Stripe/PayPal credentials
- Verify test mode settings
- Review error logs

#### Performance issues
- Optimize image sizes
- Minimize JavaScript execution
- Use browser DevTools for profiling

### Getting Help
- Check browser console for errors
- Review network tab for failed requests
- Test in incognito mode
- Disable browser extensions

## Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Implement changes
4. Test thoroughly
5. Submit pull request

### Code Standards
- Follow existing code style
- Add comments for complex logic
- Update documentation
- Test cross-browser compatibility

## License

This project is created for demonstration purposes. All Formula 1 team names, logos, and trademarks are property of their respective owners.

## Acknowledgments

- Formula 1 teams for inspiration
- Open source libraries and frameworks
- Design inspiration from luxury fashion brands
- F1 community for product ideas

---

**Note**: This is a prototype/demo application. For production use, implement proper backend services, security measures, and compliance requirements.