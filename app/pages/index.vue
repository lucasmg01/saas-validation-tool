<script setup lang="ts">
useSeoMeta({
  title: 'Outil de validation SaaS gratuit | Orange Bleu',
  description:
    "Verifie si ton idee de SaaS merite d'etre developpee. 7 checkpoints en 15 minutes.",
  ogTitle: 'Outil de validation SaaS gratuit | Orange Bleu',
  ogDescription:
    "Verifie si ton idee de SaaS merite d'etre developpee. 7 checkpoints en 15 minutes.",
  ogImage: '/og-image.svg'
})
</script>

<template>
  <main class="relative isolate overflow-hidden">
    <div class="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-5 py-16 sm:px-8">
      <section class="panel rounded-3xl p-8 md:p-12">
        <p class="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
          Orange Bleu · SaaS Studio
        </p>

        <h1 class="font-display text-3xl font-bold leading-tight text-white md:text-5xl">
          Ton idee de SaaS merite-t-elle d'etre developpee ?
        </h1>

        <p class="mt-4 max-w-3xl text-base leading-relaxed text-slate-200 md:text-xl">
          7 checkpoints en 15 minutes. Si tu bloques sur 2, ne lance pas le dev.
        </p>

        <div class="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <NuxtLink
            to="/test"
            class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
          >
            Commencer le test
          </NuxtLink>

          <NuxtLink
            to="/results"
            class="inline-flex items-center justify-center rounded-xl border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-400 hover:text-white"
          >
            Voir un exemple de resultat
          </NuxtLink>
        </div>

        <dl class="mt-10 grid gap-4 text-sm text-slate-300 md:grid-cols-3">
          <div class="rounded-2xl border border-slate-700/70 bg-slate-900/50 p-4">
            <dt class="text-xs uppercase tracking-[0.18em] text-cyan-200">Rapide</dt>
            <dd class="mt-2 text-base font-semibold text-white">15 minutes</dd>
          </div>
          <div class="rounded-2xl border border-slate-700/70 bg-slate-900/50 p-4">
            <dt class="text-xs uppercase tracking-[0.18em] text-cyan-200">Actionnable</dt>
            <dd class="mt-2 text-base font-semibold text-white">Score + reco par checkpoint</dd>
          </div>
          <div class="rounded-2xl border border-slate-700/70 bg-slate-900/50 p-4">
            <dt class="text-xs uppercase tracking-[0.18em] text-cyan-200">Sans risque</dt>
            <dd class="mt-2 text-base font-semibold text-white">Avant d'ecrire du code</dd>
          </div>
        </dl>
      </section>
    </div>
  </main>
</template>
