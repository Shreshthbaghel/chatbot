# 🤖 AI Chatbot with Gemini API

A modern, responsive chatbot web application built with React and Google's Gemini AI API. Features both local development and production deployment capabilities with a beautiful dark/light theme interface.

![Chatbot Demo](./src/assets/desktop_dark.png)

## ✨ Features

- **AI-Powered Conversations**: Integrated with Google Gemini 1.5 Flash for intelligent responses
- **Responsive Design**: Mobile-first approach that works on all devices
- **Dark/Light Theme**: Toggle between themes with smooth transitions
- **Enhanced Text Formatting**: Automatic formatting for code blocks, headings, and lists
- **Copy to Clipboard**: Easily copy AI responses
- **Real-time Loading States**: Visual feedback during AI processing
- **Local & Production Ready**: Works seamlessly in development and production

## 🚀 Live Demo

**Production**: [https://chatbot-ecru-five.vercel.app/] 
**Repository**: [https://github.com/Shreshthbaghel/chatbot]

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome
- **AI API**: Google Gemini 1.5 Flash
- **Local Server**: Express.js
- **Deployment**: Vercel (Serverless Functions)
- **Environment**: Node.js

## 📱 Screenshots

### Desktop View
![Desktop](./src/assets/desktop.png)

### Mobile View
![Mobile](./src/assets/mobile_light.jpg)

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- Google Gemini API Key ([Get it here](https://makersuite.google.com/app/apikey))

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shreshthbaghel/chatbot/tree/main
   cd ai-chatbot-gemini
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in root directory
   touch .env
   ```
   
   Add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   NODE_ENV=development
   ```

4. **Start local development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:3001`

### Production Deployment (Vercel)

1. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

2. **Set environment variables in Vercel**
   - Go to your Vercel dashboard
   - Add `GEMINI_API_KEY` in Environment Variables
   - Redeploy if necessary

## 📁 Project Structure

```
ai-chatbot-gemini/
├── api/
│   └── chat.js          # Vercel serverless function
├── public/
│   ├── index.html       # Main HTML file
│   └── api.js          # Frontend API calls
├── src/
│   ├── App.jsx         # Main React component
│   ├── App.css         # Styling
│   └── ToggleSwitch.jsx # Theme toggle component
├── server.js           # Local development server
├── package.json
├── .env                # Environment variables (local)
└── README.md
```

## 🎨 Key Features Breakdown

### Responsive Design
- **Mobile-first approach** with Tailwind CSS breakpoints
- **Flexible layouts** that adapt to screen sizes
- **Touch-friendly** interface for mobile devices

### AI Response Formatting
- **Code syntax highlighting** for programming content
- **Automatic heading detection** from markdown-style text
- **List formatting** for bullet points and numbered lists
- **Paragraph separation** for better readability

### User Experience
- **Enter key submission** for natural chat flow
- **Loading indicators** with animated spinners
- **Copy functionality** for easy response sharing
- **Smooth animations** and transitions

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `NODE_ENV` | Environment mode | No |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Development Notes

This project was developed with assistance from Claude AI for:
- UI/UX improvements and responsive design optimization
- Code structure enhancement and best practices
- Modern React patterns implementation

The core functionality, API integration, and deployment architecture were implemented independently.

## 🐛 Known Issues

- None currently reported. Please create an issue if you find any bugs.

## 📈 Future Enhancements

- [ ] Message history persistence
- [ ] Multiple conversation threads
- [ ] File upload support
- [ ] Voice input/output
- [ ] Custom AI model selection
- [ ] Export conversation feature

## 🙏 Acknowledgments

- **Google Gemini AI** for providing the powerful language model
- **Vercel** for seamless deployment platform
- **Claude AI** for UI/UX optimization assistance
- **React & Tailwind communities** for excellent documentation

## 📞 Contact

**Your Name** - [shreshthbaghel@gmail.com]  
**Project Link**: [https://github.com/yourusername/ai-chatbot-gemini]

---

⭐ **Star this repository if you found it helpful!**