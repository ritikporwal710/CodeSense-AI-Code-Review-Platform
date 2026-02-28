# AI Code Review 🚀

An intelligent code review assistant that provides automated, deep analysis and optimization suggestions for your code. Save time, improve quality, and learn best practices with every review.

![AI Code Review Dashboard](https://raw.githubusercontent.com/yourusername/ai-code-review/main/docs/dashboard-preview.png) _(Placeholder for app screenshot)_

## ✨ Key Features

### 🧠 Intelligent AI Analysis

- **Deep Code Insights**: Powered by Llama 3.3 (via Groq API) for fast and accurate code understanding.
- **Multi-Language Support**: Review code in JavaScript, TypeScript, Python, Java, Go, and more.
- **Categorized Feedback**: Identifies issues in **Security, Performance, Readability, Maintainability, and Bugs**.
- **Actionable Suggestions**: Get specific line-by-line recommendations with concrete code examples for fixes.

### 🛠️ Optimization & Learning

- **Full Code Optimization**: Automatically generates a rewritten, optimized version of your code following production-level best practices.
- **Scoring System**: Receive an overall quality score (0-100) for every submission to track your progress.
- **Mentorship Style**: Feedback is written like a senior engineer mentoring a junior, focusing on the "why" behind every suggestion.

### 📋 History & Management

- **Personal Dashboard**: Track all your past reviews, scores, and improvements in one place.
- **Detailed Review History**: Drill down into any previous review to see the original code vs. the optimized version.
- **Secure Authentication**: Built-in user sign-in and sign-up with JWT-based security.

---

## 🛠️ Technology Stack

### Backend

- **Runtime**: Node.js & Express (TypeScript)
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **AI Engine**: Groq (Llama 3.3 70B via OpenAI SDK)
- **Validation**: Zod
- **Connectivity**: Ngrok (for local webhook testing)
- **Logging**: Winston

### Frontend

- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4
- **Components**: Shadcn UI & Radix UI
- **State Management**: Zustand
- **Routing**: React Router 7
- **Icons**: Lucide React
- **Charts**: Recharts

---

## 🚀 Roadmap (Planned Features)

We are currently working on deep GitHub integration to make the review process even more seamless:

### 🔗 Phase 1: GitHub OAuth

- Connect your GitHub account for one-click sign-in.
- Secure profile synchronization (Avatar, Repos, etc.).

### 📂 Phase 2: Direct Repository Integration

- Browse your GitHub repositories and files directly from the dashboard.
- Import code for review without ever having to copy and paste.

### 🤖 Phase 3: Automated Pull Request Reviews

- **GitHub App & Webhooks**: Automatic AI reviews triggered every time a PR is opened or updated.
- **Inline PR Comments**: AI feedback posted directly as comments on the specific lines of code in your PR.
- **CI/CD Integration**: Block merges if the AI score falls below a certain threshold.

---

## 🚦 Getting Started

### Prerequisites

- Node.js (v18+)
- Docker (for running PostgreSQL)
- Groq API Key (Free tier available)

### Quick Setup

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/ai-code-review.git
    cd ai-code-review
    ```

2.  **Setup Backend**

    ```bash
    cd ai-code-review-backend
    cp .env.example .env
    # Add your DATABASE_URL and GROQ_API_KEY to .env
    npm install
    npm run db:push
    npm run dev
    ```

3.  **Setup Frontend**

    ```bash
    cd ../ai-code-review-frontend
    npm install
    npm run dev
    ```

4.  **Open the App**
    Navigate to `http://localhost:5173` in your browser.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

[MIT](LICENSE)
