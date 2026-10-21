# Smart Quiz Builder (Unofficial)

Practice tool for Azure fundamentals concepts. **Unofficial: not affiliated with or endorsed by Microsoft.**
All questions are original. No Microsoft logos are used.

**Stack:** React + Vite, Supabase (Postgres, Auth, Row Level Security).

## Features
Sign up and sign in, topic list, one quiz per topic, instant explanations (why the answer is correct, and what each other option is about), Previous and Next buttons, results screen, and a dashboard showing strengths (75%+), developing topics (60-74%), and weaknesses (under 60%).

## 1. Set up Supabase
1. Create a project at supabase.com.
2. Open **SQL Editor**, paste all of `supabase/schema.sql`, and run it. This creates the tables, security rules, topics, and 8 sample questions.
3. Open **Authentication > Providers > Email**. For quick testing, turn off "Confirm email" (turn it back on for real use).
4. Open **Project Settings > API** and copy the Project URL and the anon public key.

## 2. Run locally
```
cp .env.example .env     # paste your URL and anon key
npm install
npm run dev
```

## 3. Push to GitHub
```
git init
git add .
git commit -m "Smart Quiz Builder (unofficial) first version"
git branch -M main
git remote add origin https://github.com/YOUR-USER/smart-quiz-builder.git
git push -u origin main
```
Never commit `.env`. It is already in `.gitignore`. The anon key is safe in the browser only because Row Level Security is enabled.

## 4. Go live
**Option A: Lovable.** Lovable's GitHub integration is built around projects created in Lovable, so check its current docs on whether an existing repo can be imported. The reliable route:
1. Create a new Lovable project and connect your Supabase project.
2. Paste the prompt below to generate the same app.
3. Connect GitHub from Lovable, then copy over any files from this repo you prefer (for example `Dashboard.jsx` logic and `schema.sql`) and refine in Cursor.

**Option B: Vercel or Netlify (works for this repo as is).** Import the GitHub repo, set build command `npm run build`, output `dist`, and add the environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

### Lovable prompt
```
Build "Smart Quiz Builder (Unofficial)", an Azure fundamentals practice app.
Show "Unofficial practice tool. Not affiliated with or endorsed by Microsoft." in a top banner and the footer. No Microsoft logos.
Use Supabase tables: topics, questions (options jsonb, correct_index, explanation, distractor_notes jsonb), attempts (user_id, topic_id, score, total).
Pages: login/sign up; topic list; quiz with Previous/Next; results; dashboard.
After each answer show: why the correct option is correct, and for every other option what it actually describes.
Dashboard: overall accuracy, strengths (>=75%), weaknesses (<60%), per-topic progress bars, recent quizzes, and a "focus next" recommendation.
Modern, minimal, accessible (not colour-only feedback). Enable Row Level Security: users only see their own attempts.
```

## 5. Add more questions
Add rows in Supabase **Table Editor > questions**, or extend the SQL insert. `distractor_notes` must have 4 entries, with an empty string for the correct option. Verify every explanation against Microsoft Learn before publishing.

## 6. Tool map (for your presentation)
Claude: question design, prompts, code scaffold. Lovable: UI prototype and hosting. Supabase: database and auth. Cursor: debugging and polish. Document timings for each stage.

## File map
`src/App.jsx` shell and navigation, `Auth.jsx` login and sign up, `Topics.jsx` topic list, `Quiz.jsx` quiz and results, `Dashboard.jsx` strengths and weaknesses, `index.css` styling, `supabase/schema.sql` database.
