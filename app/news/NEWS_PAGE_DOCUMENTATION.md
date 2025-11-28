# News Page - Complete Documentation

## 📄 Page Overview

**File Location**: `app/news/page.tsx`

The News Page is a comprehensive AI-powered disaster news verification and alert system. It provides users with verified news, real-time disaster alerts, AI-powered news verification tools, and social media feeds from trusted sources.

---

## 🎯 Page Purpose

- **Primary Goal**: Provide verified disaster news and emergency alerts
- **Key Features**:
  - AI-powered news verification system
  - Real-time disaster alerts with severity indicators
  - Social media feed aggregation from official sources
  - Newsletter subscription for emergency updates
  - News reporting functionality

---

## 🏗️ Page Architecture

### Main Page File
```
app/news/page.tsx
```

**Components Used (in order of appearance)**:
1. HeroSection
2. VerifyNews
3. LatestAlerts
4. RelatedAlerts
5. SocialFeeds
6. SubscribeSection

---

## 📦 Components Breakdown

### 1. Hero Section

**Location**: `app/_components/news_Components/hero_section.tsx`

**Purpose**: 
- Eye-catching landing section with search functionality
- Background image with overlay
- Disaster news search with filters

**Features**:
- **Height**: 650px (mobile) / 800px (desktop)
- **Background Image**: `/images/news/hero.avif`
- **Search Filters**:
  - Region filter (North, South, East, West)
  - Type filter (Earthquake, Flood, Fire, Hurricane)
  - Time filter (Today, This Week, This Month)
- **API Integration**: `handleSearch()` - Logs filter values (ready for API implementation)

**Key Elements**:
- Dark overlay (40% opacity) for text readability
- Centered heading and subtitle
- Multi-select dropdown filters
- Search button with magnifying glass icon

**State Management**:
```typescript
const [filters, setFilters] = useState<SearchFilters>({
  region: '',
  type: '',
  time: '',
});
```

---

### 2. Verify News Section

**Location**: `app/_components/news_Components/verify_news.tsx`

**Purpose**: 
- AI-powered news verification system
- Upload text, images, or videos for fact-checking
- Display verification results with AI analysis

**Features**:
- **Input Methods**:
  - Text input (useRef - `newsTextRef`)
  - Image upload (max 10MB)
  - Video upload (max 50MB)
  
- **Verification Process**:
  - Loading state with professional multi-layer spinner
  - AI analysis with mock backend call
  - Results display with confidence score

- **Result Display**:
  - Large icon indicator (`/images/news/real.png` or `/images/news/fake.png`)
  - Status: "VERIFIED" or "FAKE NEWS"
  - Confidence percentage
  - Detailed explanation
  - Source links (clickable)
  - Collapsible full AI agent report

**API Functions**:
```typescript
verifyNewsWithAI(text: string, imageFile?: File, videoFile?: File)
// Returns: VerificationResult
```

**State Management**:
```typescript
const [imageFile, setImageFile] = useState<File | null>(null);
const [videoFile, setVideoFile] = useState<File | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [result, setResult] = useState<VerificationResult | null>(null);
```

**Design**:
- Two-column layout (desktop)
- Clean white background
- Professional spinner animation
- Color-coded results (green for real, red for fake)

---

### 3. Latest Alerts Section

**Location**: `app/_components/news_Components/latest_alerts.tsx`

**Purpose**: 
- Display grid of latest verified disaster alerts
- Show alert severity with visual indicators
- Provide quick access to alert details

**Features**:
- **Alert Data**:
  - 6 dummy alerts (replace with API)
  - Each has: type, title, description, image, severity
  
- **Severity Types**:
  - **Real**: Green badge with real.png icon
  - **Fake**: Red badge with fake.png icon
  - **Pass-Fake/Under Review**: Yellow badge with search.png icon

- **Card Design**:
  - Image with gradient overlay
  - Type badge on image (bottom-left)
  - Verification badge (top-right with icon)
  - Color-coded status bar
  - Hover effects (lift + image zoom)

**API Functions**:
```typescript
fetchLatestAlerts() // Returns: AlertCard[]
handleAlertClick(alertId: number)
handleSeeMore()
```

**Grid Layout**:
- 1 column (mobile)
- 2 columns (tablet)
- 3 columns (desktop)

**Bottom CTA**:
- White card encouraging users to verify news
- Button with search icon

---

### 4. Related Alerts Section

**Location**: `app/_components/news_Components/related_alerts.tsx`

**Purpose**: 
- Connect users to social media channels
- Provide links to official disaster management feeds

**Features**:
- **Social Platforms**:
  1. Twitter/X (black background)
  2. Instagram (purple-pink gradient)
  3. Facebook (blue)
  4. LinkedIn (dark blue)

- **Card Elements**:
  - Platform icon (official SVG)
  - Platform name
  - Description text
  - "Follow Now" link with animated arrow

**Trust Indicators** (bottom section):
- Real-time Updates (green pulsing dot)
- Verified Content (checkmark icon)
- Community Support (users icon)

**API Functions**:
```typescript
handleSocialLinkClick(platform: string, url: string)
// Opens social media platform in new tab
```

**Design**:
- Clean white background
- Gray cards with hover effects
- Blue accent decorations
- Responsive grid (1→2→4 columns)

---

### 5. Social Feeds Section

**Location**: `app/_components/news_Components/social_feeds.tsx`

**Purpose**: 
- Display verified posts from official disaster management accounts
- Show social media engagement metrics
- Provide star ratings for content credibility

**Features**:
- **Feed Types**:
  - Facebook posts
  - LinkedIn articles
  - Twitter/X updates
  - Instagram stories

- **Feed Card Elements**:
  - Platform icon (official SVG)
  - Author avatar (gradient circle with initial)
  - Timestamp
  - Content text (line-clamp-3)
  - Image (if available)
  - Star rating (out of 5)
  - Engagement metrics (likes, comments, shares)

- **Engagement Counts**:
  - Likes (heart icon)
  - Comments (chat icon)
  - Shares (share icon)

**API Functions**:
```typescript
fetchSocialFeeds() // Returns: SocialFeed[]
handleFeedClick(feedId: number)
handleSeeMoreFeeds()
```

**Grid Layout**:
- 1 column (mobile)
- 2 columns (desktop)

**Load More Button**:
- Gray button with refresh icon at bottom

---

### 6. Subscribe Section

**Location**: `app/_components/news_Components/subscribe_section.tsx`

**Purpose**: 
- Newsletter subscription for emergency alerts
- News reporting functionality
- Build user trust with statistics

**Features**:

**Left Column - Marketing Content**:
- "Stay Informed" badge with pulsing indicator
- Headline: "Never Miss Critical Updates"
- Feature list (4 items with icons):
  - ⚡ Real-time disaster alerts
  - ✅ AI-verified news only
  - 🔔 Customizable notifications
  - 🔒 Privacy protected
- Trust Statistics:
  - 50K+ Subscribers
  - 99.9% Accuracy Rate
  - 24/7 Monitoring

**Right Column - Subscription Form**:
- Email input field
- Email validation (checks for @)
- Success/error message display
- Loading state (spinner)
- Subscribe button (gradient blue)
- Divider ("or")
- Report News button (secondary)
- Privacy note

**API Functions**:
```typescript
handleSubscribe(email: string)
// Returns: { success: boolean, message: string }

handleReportNews()
// Navigate to report form
```

**State Management**:
```typescript
const [email, setEmail] = useState('');
const [isSubscribing, setIsSubscribing] = useState(false);
const [subscribeMessage, setSubscribeMessage] = useState<{
  type: 'success' | 'error';
  text: string;
} | null>(null);
```

**Design**:
- Gradient background (blue-900 → indigo-900)
- Animated background patterns (blurred circles)
- White card form with shadow
- Two-column layout (responsive)

---

## 🎨 Shared Resources

### Type Definitions

**Location**: `app/_types/news_types.tsx`

**Interfaces**:
```typescript
interface AlertCard {
  id: number;
  type: string;
  title: string;
  description: string;
  image: string;
  severity: 'Real' | 'Fake' | 'Pass-Fake';
  location?: string;
  time?: string;
}

interface SocialFeed {
  id: number;
  platform: 'Facebook' | 'LinkedIn' | 'X' | 'Instagram';
  content: string;
  image?: string;
  rating?: number;
  author?: string;
}

interface SearchFilters {
  region: string;
  type: string;
  time: string;
}
```

**Common Styles** (Tailwind utilities):
- Typography (Heading1-4, BodyText, SmallText)
- Spacing (Padding, Margin variations)
- Layout (Container, Grid, Flex)
- Buttons, Inputs, Cards
- Colors, Shadows, Transitions

---

## 🖼️ Image Assets

### Required Images

**News Icons**:
- `/images/news/hero.avif` - Hero background image
- `/images/news/search.png` - Search/verification icon
- `/images/news/real.png` - Verified/real news icon
- `/images/news/fake.png` - Fake news detection icon

**Alert Images** (in `/images/alerts/`):
- `heatwave.jpg`
- `earthquake.jpg`
- `drought.jpg`
- `hurricane.jpg`
- `forest-fire.jpg`
- `glacier.jpg`

**Social Feed Images** (in `/images/feeds/`):
- `feed1.jpg`
- `feed2.jpg`

---

## 🔌 API Integration Points

### Current State
All API functions are **placeholder implementations** that log to console. Ready for backend integration.

### Functions to Implement

1. **Hero Search**:
```typescript
handleSearch(filters: SearchFilters)
// TODO: Call backend with region, type, time filters
```

2. **News Verification**:
```typescript
verifyNewsWithAI(text: string, imageFile?: File, videoFile?: File)
// TODO: Upload to AI verification backend
// Expected response: VerificationResult
```

3. **Alerts**:
```typescript
fetchLatestAlerts()
// TODO: GET /api/alerts/latest
```

4. **Social Feeds**:
```typescript
fetchSocialFeeds()
// TODO: GET /api/social-feeds
```

5. **Subscription**:
```typescript
handleSubscribe(email: string)
// TODO: POST /api/subscribe
```

6. **Report News**:
```typescript
handleReportNews()
// TODO: Navigate to /report-news or open modal
```

---

## 🎯 Design System

### Color Scheme

**Primary Colors**:
- Blue 600 (`#2563eb`) - Primary actions, links
- Blue 900 (`#1e3a8a`) - Dark backgrounds

**Status Colors**:
- Green 500 (`#22c55e`) - Verified/Real
- Red 500 (`#ef4444`) - Fake news
- Yellow 500 (`#eab308`) - Under review

**Neutral Colors**:
- Gray 50 (`#f9fafb`) - Light backgrounds
- Gray 900 (`#111827`) - Dark text
- White (`#ffffff`) - Cards, forms

### Typography

**Font Family**: System defaults (no custom fonts)

**Sizes**:
- Heading1: `text-3xl md:text-5xl`
- Heading2: `text-2xl md:text-3xl`
- Heading4: `text-lg md:text-xl`
- Body: `text-base md:text-lg`

### Spacing

**Sections**: `py-12 md:py-20` (PaddingSection)
**Cards**: `p-4 md:p-6` (PaddingCard)

### Shadows

- Default: `shadow-lg`
- Hover: `shadow-xl`
- Cards: `shadow-md` → `hover:shadow-2xl`

---

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px (default styles)
- **Tablet**: 768px - 1024px (md:)
- **Desktop**: > 1024px (lg:)

### Layout Changes

**Hero Section**:
- Mobile: 650px height, single column search
- Desktop: 800px height, horizontal search bar

**Verify News**:
- Mobile: Stacked (form → results)
- Desktop: Two columns (form left, results right)

**Latest Alerts**:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

**Related Alerts**:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 4 columns

**Social Feeds**:
- Mobile: 1 column
- Desktop: 2 columns

**Subscribe**:
- Mobile: Stacked (content → form)
- Desktop: Two columns (content left, form right)

---

## 🔄 Component Interaction Flow

```
User Journey:

1. Lands on Hero → Searches for news by filters
   ↓
2. Scrolls to Verify News → Uploads content for verification
   ↓
3. Views Latest Alerts → Clicks alert for details
   ↓
4. Explores Related Alerts → Follows social media
   ↓
5. Reads Social Feeds → Engages with content
   ↓
6. Subscribes → Enters email for alerts
```

---

## 🚀 Development Workflow

### For New Developers

1. **Clone Repository**
2. **Install Dependencies**: `npm install`
3. **Run Dev Server**: `npm run dev`
4. **Navigate to**: `http://localhost:3000/news`

### Making Changes

**Component-Specific Styles**:
- Use inline `className` with Tailwind
- Only use `CommonStyles` for reusable utilities

**Adding New Features**:
1. Create component in `app/_components/news_Components/`
2. Import in `app/news/page.tsx`
3. Add to component order
4. Update this documentation

**API Integration**:
1. Replace `console.log` in placeholder functions
2. Add actual API calls
3. Handle loading/error states
4. Update TypeScript types if needed

---

## 🧪 Testing Checklist

### Manual Testing

- [ ] Hero search filters work correctly
- [ ] Verify News accepts text/image/video
- [ ] Loading states display properly
- [ ] Results show with correct icons
- [ ] Alert cards clickable
- [ ] Social links open in new tab
- [ ] Email validation works
- [ ] Success/error messages display
- [ ] All responsive breakpoints work
- [ ] Images load correctly
- [ ] Hover effects smooth

### Cross-Browser

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Accessibility

- [ ] Keyboard navigation
- [ ] Screen reader friendly
- [ ] Alternative text for images
- [ ] Focus indicators visible

---

## 📝 File Structure

```
app/
├── news/
│   ├── page.tsx                    # Main news page
│   └── NEWS_PAGE_DOCUMENTATION.md  # This file
├── _components/
│   └── news_Components/
│       ├── hero_section.tsx        # Hero with search
│       ├── verify_news.tsx         # AI verification
│       ├── latest_alerts.tsx       # Alert cards
│       ├── related_alerts.tsx      # Social media links
│       ├── social_feeds.tsx        # Feed posts
│       └── subscribe_section.tsx   # Newsletter signup
└── _types/
    └── news_types.tsx              # TypeScript types & CommonStyles

public/
└── images/
    ├── news/
    │   ├── hero.avif
    │   ├── search.png
    │   ├── real.png
    │   └── fake.png
    ├── alerts/
    │   └── *.jpg
    └── feeds/
        └── *.jpg
```

---

## 🎓 Quick Reference Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Format code
npm run format
```

---

## 📞 Support

For questions or issues:
1. Check this documentation first
2. Review component source code
3. Check console for API placeholder logs
4. Contact team lead

---

**Last Updated**: November 28, 2024
**Maintained By**: Development Team
**Version**: 1.0.0
