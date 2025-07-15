# Smart Card Rewards Chrome Extension

## Overview

This project is a Chrome extension that detects when users are browsing merchant websites and recommends the optimal credit card to use for maximum rewards. The extension analyzes the current webpage, identifies the merchant and spending category, and suggests the best credit card from the user's collection based on reward rates.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Chrome Extension Popup**: HTML/CSS/JavaScript interface that displays merchant information and card recommendations
- **Content Script**: Injected into web pages to detect merchant information
- **Background Script**: Service worker that manages extension state and communication between components

### Backend Architecture
- **Client-side Processing**: All logic runs locally in the browser extension
- **No Server Required**: Extension operates entirely offline using Chrome's storage API
- **Merchant Detection**: Pattern-based system that identifies merchants from URL domains

### Data Storage Solutions
- **Chrome Storage API**: Used for persisting user credit card data and merchant information
- **Local Storage Only**: No external databases or cloud storage
- **Tab-specific Storage**: Merchant information stored per browser tab

## Key Components

### 1. Merchant Detection System
- **File**: `merchant-detector.js`
- **Purpose**: Identifies merchants and categorizes spending types
- **Approach**: Domain-based pattern matching with predefined merchant database
- **Categories**: dining, gas, groceries, travel, online shopping

### 2. Background Service Worker
- **File**: `background.js`
- **Purpose**: Manages extension lifecycle and inter-component communication
- **Features**: Badge updates, message handling, tab state management

### 3. Content Script
- **File**: `content.js`
- **Purpose**: Runs on merchant websites to detect spending opportunities
- **Integration**: Communicates with background script and popup

### 4. Popup Interface
- **Files**: `popup.html`, `popup.css`, `popup.js`
- **Purpose**: User interface for viewing recommendations and managing cards
- **Features**: Card recommendations, merchant info display, card management

### 5. Rewards Calculator
- **File**: `rewards.js`
- **Purpose**: Calculates optimal card recommendations based on reward rates
- **Logic**: Matches merchant categories to card reward categories

### 6. Storage Manager
- **File**: `storage.js`
- **Purpose**: Handles credit card data persistence
- **Operations**: CRUD operations for user credit cards

## Data Flow

1. **Page Load**: Content script detects merchant on webpage
2. **Merchant Identification**: Domain patterns matched against merchant database
3. **Background Notification**: Merchant info sent to background script
4. **Badge Update**: Extension icon updated to show merchant detected
5. **Popup Interaction**: User clicks extension to view recommendations
6. **Card Analysis**: Rewards calculator determines best card options
7. **Display Results**: Popup shows merchant info and card recommendations

## External Dependencies

### Chrome Extension APIs
- **chrome.storage.local**: For persisting user data
- **chrome.runtime**: For message passing between components
- **chrome.action**: For managing extension badge and popup
- **chrome.tabs**: For tab-specific functionality

### No External Services
- No API calls to external services
- No third-party libraries or frameworks
- Self-contained merchant detection system

## Deployment Strategy

### Chrome Web Store Distribution
- Standard Chrome extension packaging
- Manifest V3 compliance for modern Chrome versions
- Icons and metadata configured for store listing

### Local Development
- Extension can be loaded unpacked for development
- Hot reload not implemented - requires manual refresh
- Debug console available through Chrome DevTools

### Permissions Model
- **activeTab**: Access to current tab content
- **storage**: Local data persistence
- **scripting**: Content script injection
- **host_permissions**: Access to all websites for merchant detection

### Security Considerations
- No external network requests
- Local storage only
- Content Security Policy compliant
- Minimal permissions requested

## Architecture Decisions

### Pattern-Based Merchant Detection
- **Problem**: Need to identify merchants across thousands of websites
- **Solution**: Domain-based pattern matching with predefined merchant list
- **Rationale**: Simple, fast, and works offline without API dependencies
- **Trade-offs**: Limited to known merchants, requires manual updates

### Local Storage Only
- **Problem**: Need to store user credit card data securely
- **Solution**: Chrome's local storage API with client-side processing
- **Rationale**: Better privacy, no server infrastructure needed
- **Trade-offs**: No cross-device sync, limited to browser storage

### Service Worker Background
- **Problem**: Need persistent background processing for Manifest V3
- **Solution**: Service worker instead of background page
- **Rationale**: Required for modern Chrome extensions
- **Trade-offs**: More complex lifecycle management

### Content Script Injection
- **Problem**: Need to analyze webpage content for merchant detection
- **Solution**: Content script injected into all pages
- **Rationale**: Direct DOM access for reliable merchant detection
- **Trade-offs**: Potential performance impact on page load