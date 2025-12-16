# Portfolio Integration Guide

This guide shows you how to add the TriLLM button to your portfolio website at ruthwikdovala.com.

## 1. Deploy TriLLM First

Deploy the TriLLM frontend to get a live URL (see DEPLOYMENT.md).

After deployment, you'll have a URL like:
- `https://trillm.vercel.app`

## 2. Add TriLLM Button to Your Portfolio

### Option A: Add to Navigation (Recommended)

In `src/pages/App.tsx`, add this to your desktop navigation:

```tsx
{/* TriLLM - Featured Project */}
<li>
  <a
    href="https://trillm.vercel.app"
    target="_blank"
    rel="noopener noreferrer"
    className="chip bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
    title="Try TriLLM - AI Meta-Search"
  >
    ✨ TriLLM
  </a>
</li>
```

Add the same to your mobile navigation menu.

### Option B: Add to Projects Page

In `src/pages/Projects.tsx`, add TriLLM to the projects array:

```tsx
{
  title: '✨ TriLLM - Triple LLM Intelligence',
  link: 'https://trillm.vercel.app',
  tags: ['React', 'TypeScript', 'Node.js', 'OpenAI', 'Anthropic', 'Google AI', 'Vite', 'Tailwind CSS'],
  bullets: [
    'Built an AI meta-search engine that queries ChatGPT, Claude, and Gemini simultaneously to provide the best answer.',
    'Developed responsive React frontend with TypeScript, Vite, and Tailwind CSS featuring real-time loading states and intelligent response ranking.',
    'Designed RESTful API backend with Node.js/Express to orchestrate parallel LLM queries and implement scoring algorithms.',
    'Deployed production-ready application with CI/CD pipeline using Vercel and Railway for scalable infrastructure.'
  ]
}
```

And update the project link rendering to support "Live Demo" links:

```tsx
{p.link && (
  <a
    href={p.link}
    target="_blank"
    rel="noreferrer"
    className="mt-2 inline-flex items-center gap-1 text-xs underline text-accent hover:text-accent2"
  >
    {p.publication ? (
      <>
        <BookOpen size={14} />
        Publication
      </>
    ) : (
      <>
        <ExternalLink size={14} />
        Live Demo
      </>
    )}
    <ExternalLink size={13} />
  </a>
)}
```

### Option C: Simple Link Anywhere

Add this anywhere on your portfolio:

```tsx
<a
  href="https://trillm.vercel.app"
  target="_blank"
  rel="noopener noreferrer"
  className="your-custom-styles"
>
  Try TriLLM →
</a>
```

## 3. That's It!

The two repositories remain completely separate:
- **trillm** → Your TriLLM application
- **ruthwikdovala.com** → Your portfolio (you add the button manually)

Both work independently, connected only by the URL link!

## Quick Summary

1. ✅ Deploy TriLLM to Vercel
2. ✅ Copy the URL (e.g., `https://trillm.vercel.app`)
3. ✅ Add button/link to your portfolio manually
4. ✅ Push your portfolio changes
5. ✅ Done!

---

**Note**: Replace `https://trillm.vercel.app` with your actual deployment URL after deploying!
