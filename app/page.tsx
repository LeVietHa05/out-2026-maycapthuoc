'use client';

import Link from 'next/link';
import { useAppSettings } from './providers';

export default function Home() {
  const { language, theme, setLanguage, setTheme, t } = useAppSettings();

  return (
    <div className="min-h-screen bg-background px-6 py-12 text-foreground">
      <div className="mx-auto max-w-5xl rounded-[2rem] bg-white p-10 shadow-2xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
        <div className="flex flex-col gap-10">
          <div className="space-y-3 text-center">
            <p className="text-sm uppercase tracking-[0.25em] text-primary">Welcome  </p>
            <h1 className="text-4xl font-bold sm:text-5xl">{t.welcomeTitle}</h1>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              {t.welcomeDescription}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
              <h2 className="text-xl font-semibold">{t.selectLanguage}</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setLanguage('vn')}
                  className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                    language === 'vn'
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700'
                  }`}
                >
                  {t.languageVietnamese}
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                    language === 'en'
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700'
                  }`}
                >
                  {t.languageEnglish}
                </button>
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
              <h2 className="text-xl font-semibold">{t.selectTheme}</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setTheme('light')}
                  className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                    theme === 'light'
                      ? 'bg-secondary text-white shadow-lg'
                      : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700'
                  }`}
                >
                  {t.themeLight}
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                    theme === 'dark'
                      ? 'bg-secondary text-white shadow-lg'
                      : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700'
                  }`}
                >
                  {t.themeDark}
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-1 justify-center">
            <Link
              href="/list"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-4 text-base font-semibold text-white transition hover:bg-blue-700"
            >
              {t.startShopping}
            </Link>
            {/* <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-4 text-base font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
            >
              {t.adminPage}
            </Link> */}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-100 p-6 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <h3 className="text-lg font-semibold">{t.currentSettings}</h3>
            <p className="mt-3 text-sm leading-6">
              {t.languageEnglish}: {language === 'en' ? '✓' : '✕'} · {t.languageVietnamese}: {language === 'vn' ? '✓' : '✕'}
              <br />
              {t.themeLight}: {theme === 'light' ? '✓' : '✕'} · {t.themeDark}: {theme === 'dark' ? '✓' : '✕'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
