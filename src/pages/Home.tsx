import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const passos = [
  {
    numero: '01',
    titulo: 'Descubra',
    descricao: 'Explore livros por título, autor e categoria.',
    icone: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path strokeLinecap="round" d="m16 16 4.2 4.2M8 10.8h5.6M10.8 8v5.6" />
      </svg>
    ),
  },
  {
    numero: '02',
    titulo: 'Organize',
    descricao: 'Acompanhe o que quer ler, está lendo ou já terminou.',
    icone: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v16H7.5A2.5 2.5 0 0 0 5 21.5v-16ZM5 5.5v16M9 7h7M9 10h7M9 13h5" />
      </svg>
    ),
  },
  {
    numero: '03',
    titulo: 'Personalize',
    descricao: 'Salve livros do catálogo ou cadastre os seus.',
    icone: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.2s-7.5-4.4-7.5-10.1A4.15 4.15 0 0 1 12 7.7a4.15 4.15 0 0 1 7.5 2.4c0 5.7-7.5 10.1-7.5 10.1Z" />
      </svg>
    ),
  },
]

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1">
        <section className="relative isolate overflow-hidden border-b border-blue-100 bg-gradient-to-br from-white via-white to-blue-50">
          <div
            aria-hidden="true"
            className="absolute -right-40 -top-52 -z-10 h-[38rem] w-[38rem] rounded-full border border-blue-100/80"
          />
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-32 -z-10 h-[30rem] w-[30rem] rounded-full border border-blue-100/70"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-10 left-[43%] -z-10 h-40 w-40 rounded-full bg-blue-100/50 blur-3xl"
          />

          <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-[1.03fr_0.97fr] lg:gap-12 lg:py-28">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-blue-800 shadow-sm shadow-blue-900/5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                Seu espaço para ler mais
              </div>
              <h1 className="mt-6 text-4xl font-semibold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.6rem]">
                Cada leitura merece
                <span className="mt-1 block text-blue-700">um lugar especial.</span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Descubra seu próximo livro, organize suas leituras e guarde
                cada história que acompanha você.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/catalogo"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/15 transition hover:-translate-y-0.5 hover:bg-blue-800"
                >
                  Explorar catálogo
                  <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.69L10.22 5.03a.75.75 0 1 1 1.06-1.06l5.5 5.5a.75.75 0 0 1 0 1.06l-5.5 5.5a.75.75 0 1 1-1.06-1.06l4.22-4.22H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link
                  to="/minha-biblioteca"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/90 px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                >
                  Minha biblioteca
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-2.5 text-sm text-slate-500">
                <svg aria-hidden="true" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Zm3.27 5.77-3.75 4.5a.75.75 0 0 1-1.1.06l-1.75-1.75a.75.75 0 1 1 1.06-1.06l1.17 1.17 3.22-3.86a.75.75 0 0 1 1.15.94Z" />
                </svg>
                <span>Seu catálogo de livros, do seu jeito.</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[34rem]">
              <div
                aria-hidden="true"
                className="absolute -inset-5 rounded-[2rem] bg-blue-100/70 blur-2xl"
              />
              <div className="relative rounded-[1.7rem] border border-blue-100 bg-white p-4 shadow-2xl shadow-blue-950/10 sm:p-6">
                <div className="rounded-[1.25rem] bg-slate-950 p-5 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-blue-200/80">SUA COLEÇÃO</p>
                      <h2 className="mt-1.5 text-lg font-semibold text-white sm:text-xl">
                        Minha biblioteca
                      </h2>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-blue-100">
                      <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v16H7.5A2.5 2.5 0 0 0 5 21.5v-16ZM5 5.5v16M9 7h7M9 10h7M9 13h5" />
                      </svg>
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-2.5 sm:gap-3">
                    <div className="rounded-xl border border-white/10 bg-white/[0.06] p-3 sm:p-3.5">
                      <p className="text-lg font-semibold text-white">01</p>
                      <p className="mt-1 text-[11px] text-slate-300 sm:text-xs">Quero ler</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.06] p-3 sm:p-3.5">
                      <p className="text-lg font-semibold text-white">02</p>
                      <p className="mt-1 text-[11px] text-slate-300 sm:text-xs">Lendo</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.06] p-3 sm:p-3.5">
                      <p className="text-lg font-semibold text-white">08</p>
                      <p className="mt-1 text-[11px] text-slate-300 sm:text-xs">Já li</p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.06] p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">Continue sua jornada</p>
                      <span className="text-xs text-blue-200">Sua estante</span>
                    </div>

                    <div className="mt-4 flex items-end justify-center gap-3 sm:gap-4">
                      <div className="relative h-36 w-[27%] max-w-[6.8rem] overflow-hidden rounded-lg bg-gradient-to-b from-blue-500 to-blue-800 p-3 shadow-lg shadow-black/20 sm:h-44">
                        <span className="absolute -right-6 -top-5 h-20 w-20 rounded-full border border-white/20" />
                        <span className="absolute -right-2 top-0 h-12 w-12 rounded-full border border-white/20" />
                        <div className="relative flex h-full flex-col justify-between">
                          <span className="text-[8px] font-medium uppercase tracking-[0.18em] text-blue-100 sm:text-[9px]">Uma história</span>
                          <span className="text-xs font-semibold leading-4 text-white sm:text-sm sm:leading-5">Novos<br />caminhos</span>
                          <span className="h-px w-6 bg-blue-200/70" />
                        </div>
                      </div>
                      <div className="relative z-10 h-44 w-[31%] max-w-[7.7rem] overflow-hidden rounded-lg border border-blue-100 bg-gradient-to-br from-white to-blue-100 p-3 shadow-xl shadow-black/25 sm:h-52">
                        <span className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-blue-200/70" />
                        <span className="absolute bottom-0 right-0 h-20 w-20 rounded-full border border-blue-300/60" />
                        <div className="relative flex h-full flex-col justify-between">
                          <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-blue-700 sm:text-[9px]">Próxima Página</span>
                          <span className="text-sm font-semibold leading-5 text-slate-900 sm:text-base sm:leading-6">Entre<br />páginas</span>
                          <span className="h-1 w-7 rounded-full bg-blue-600" />
                        </div>
                      </div>
                      <div className="relative h-32 w-[27%] max-w-[6.8rem] overflow-hidden rounded-lg bg-gradient-to-b from-slate-500 to-slate-700 p-3 shadow-lg shadow-black/20 sm:h-40">
                        <span className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full border border-white/20" />
                        <div className="relative flex h-full flex-col justify-between">
                          <span className="text-[8px] font-medium uppercase tracking-[0.18em] text-slate-200 sm:text-[9px]">Seu tempo</span>
                          <span className="text-xs font-semibold leading-4 text-white sm:text-sm sm:leading-5">Um passo<br />de cada vez</span>
                          <span className="h-px w-6 bg-slate-300/70" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <p className="text-xs text-slate-300">Cada livro, uma nova descoberta.</p>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
                      <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 17.5s-7-4.05-7-9.4a3.86 3.86 0 0 1 7-2.27 3.86 3.86 0 0 1 7 2.27c0 5.35-7 9.4-7 9.4Z" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-5 hidden items-center gap-3 rounded-xl border border-blue-100 bg-white px-4 py-3 shadow-lg shadow-blue-950/10 sm:flex">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Zm3.27 5.77-3.75 4.5a.75.75 0 0 1-1.1.06l-1.75-1.75a.75.75 0 1 1 1.06-1.06l1.17 1.17 3.22-3.86a.75.75 0 0 1 1.15.94Z" />
                  </svg>
                </span>
                <span>
                  <span className="block text-xs font-semibold text-slate-900">Organize do seu jeito</span>
                  <span className="mt-0.5 block text-[11px] text-slate-500">Simples e pessoal</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-blue-700">Como funciona</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                Um jeito leve de cuidar das suas leituras.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-600">
              Da descoberta de um livro ao registro da última página, sua
              jornada fica organizada em um só lugar.
            </p>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {passos.map((passo) => (
              <article
                key={passo.numero}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-950/5"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 p-2.5 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                    {passo.icone}
                  </span>
                  <span className="text-xs font-medium text-slate-400">{passo.numero}</span>
                </div>
                <h3 className="mt-5 text-base font-semibold text-slate-900">{passo.titulo}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{passo.descricao}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-blue-100 bg-blue-50/60">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 px-6 py-12 md:flex-row md:items-center md:px-10">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                Pronto para encontrar sua próxima leitura?
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Explore o catálogo e comece a montar sua biblioteca.
              </p>
            </div>
            <Link
              to="/catalogo"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
            >
              Ir para o catálogo
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
