import { useEffect, useState } from 'react'
import { animate, motion } from 'framer-motion'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import {
  ArrowDownRight, ArrowUpRight, Bell, LayoutDashboard, LineChart, Search,
  Settings, Users, Wallet, Zap,
} from 'lucide-react'
import ChatWidget from './ChatWidget'
import { clients, kpis, regions, revenue, segments } from './data'

const fmt = (n) => Math.round(n).toLocaleString('ru-RU')

function Counter({ value, suffix = '' }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    const c = animate(0, value, { duration: 1.4, ease: 'easeOut', onUpdate: setV })
    return () => c.stop()
  }, [value])
  return <>{fmt(v)}{suffix}</>
}

const card = (i) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.06 * i, duration: 0.5, ease: 'easeOut' },
})

const tooltipStyle = {
  contentStyle: { background: '#11131c', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, fontSize: 12 },
  labelStyle: { color: '#94a3b8' },
}

const statusColor = {
  'Активен': 'bg-emerald-500/15 text-emerald-300',
  'На проверке': 'bg-amber-500/15 text-amber-300',
  'Риск': 'bg-rose-500/15 text-rose-300',
}

const nav = [
  { icon: LayoutDashboard, label: 'Обзор', active: true },
  { icon: LineChart, label: 'Аналитика' },
  { icon: Users, label: 'Клиенты' },
  { icon: Wallet, label: 'Финансы' },
  { icon: Settings, label: 'Настройки' },
]

export default function App() {
  return (
    <div className="relative flex min-h-full">
      {/* Сайдбар */}
      <aside className="glass sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-y-0 border-l-0 p-5 lg:flex">
        <div className="mb-10 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400">
            <Zap className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">Ctrl+C Ctrl+V</span>
        </div>
        <nav className="space-y-1">
          {nav.map(({ icon: Icon, label, active }) => (
            <a key={label} href="#" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <Icon className="h-4 w-4" /> {label}
            </a>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-400/10 p-4">
          <p className="text-sm font-semibold">ИИ-ассистент</p>
          <p className="mt-1 text-xs text-slate-400">Тот же ИИ доступен в Telegram-боте 24/7</p>
        </div>
      </aside>

      <main className="relative min-w-0 flex-1 px-4 py-6 sm:px-8">
        {/* Шапка */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Добрый вечер 👋</h1>
            <p className="mt-1 text-sm text-slate-400">Вот что происходит с вашим бизнесом сегодня</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass hidden items-center gap-2 rounded-xl px-3 py-2 sm:flex">
              <Search className="h-4 w-4 text-slate-500" />
              <input placeholder="Поиск…" className="w-44 bg-transparent text-sm outline-none placeholder:text-slate-500" />
            </div>
            <button className="glass relative rounded-xl p-2.5">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-sm font-semibold">S</div>
          </div>
        </header>

        {/* KPI */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((k, i) => (
            <motion.div key={k.label} {...card(i)} whileHover={{ y: -4 }} className="glass rounded-2xl p-5">
              <p className="text-sm text-slate-400">{k.label}</p>
              <p className="mt-3 text-2xl font-bold tracking-tight"><Counter value={k.value} suffix={k.suffix} /></p>
              <p className={`mt-2 flex items-center gap-1 text-xs font-medium ${k.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {k.delta >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {Math.abs(k.delta)}% <span className="text-slate-500">к прошлому месяцу</span>
              </p>
            </motion.div>
          ))}
        </section>

        {/* Графики */}
        <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
          <motion.div {...card(4)} className="glass rounded-2xl p-5 xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">Выручка, млн ₸</p>
                <p className="text-xs text-slate-500">Факт и ИИ-прогноз</p>
              </div>
              <div className="flex gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-indigo-400" />Факт</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-cyan-400" />Прогноз</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenue}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,.05)" vertical={false} />
                <XAxis dataKey="m" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={36} />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="revenue" name="Факт" stroke="#818cf8" strokeWidth={2.5} fill="url(#g1)" />
                <Area type="monotone" dataKey="forecast" name="Прогноз" stroke="#22d3ee" strokeWidth={2} strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div {...card(5)} className="glass rounded-2xl p-5">
            <p className="font-semibold">Сегменты клиентов</p>
            <p className="text-xs text-slate-500">Доля в выручке</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={segments} dataKey="value" innerRadius={60} outerRadius={85} paddingAngle={4} stroke="none">
                  {segments.map((s) => <Cell key={s.name} fill={s.color} />)}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {segments.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-300"><span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />{s.name}</span>
                  <span className="font-medium">{s.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
          <motion.div {...card(6)} className="glass rounded-2xl p-5">
            <p className="mb-4 font-semibold">Регионы Казахстана, %</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={regions} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <Tooltip {...tooltipStyle} cursor={{ fill: 'rgba(255,255,255,.03)' }} />
                <Bar dataKey="value" name="Доля" radius={[0, 8, 8, 0]} fill="#a78bfa" barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Таблица */}
          <motion.div {...card(7)} className="glass overflow-hidden rounded-2xl xl:col-span-2">
            <div className="flex items-center justify-between p-5">
              <p className="font-semibold">Ключевые клиенты</p>
              <span className="text-xs text-slate-500">ИИ-скоринг надёжности</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="text-left text-xs text-slate-500">
                  <tr className="border-y border-white/5">
                    <th className="px-5 py-3 font-medium">Компания</th>
                    <th className="px-5 py-3 font-medium">Контакт</th>
                    <th className="px-5 py-3 font-medium">Сумма</th>
                    <th className="px-5 py-3 font-medium">Статус</th>
                    <th className="px-5 py-3 font-medium">Скоринг</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr key={c.company} className="border-b border-white/5 transition hover:bg-white/[.03]">
                      <td className="px-5 py-3.5">
                        <p className="font-medium">{c.company}</p>
                        <p className="text-xs text-slate-500">{c.city}</p>
                      </td>
                      <td className="px-5 py-3.5 text-slate-300">{c.contact}</td>
                      <td className="px-5 py-3.5 font-medium">{fmt(c.amount)} ₸</td>
                      <td className="px-5 py-3.5">
                        <span className={`rounded-lg px-2.5 py-1 text-xs font-medium ${statusColor[c.status]}`}>{c.status}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${c.score}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className={`h-full rounded-full ${c.score >= 80 ? 'bg-emerald-400' : c.score >= 60 ? 'bg-amber-400' : 'bg-rose-400'}`}
                            />
                          </div>
                          <span className="text-xs text-slate-400">{c.score}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>
      </main>

      <ChatWidget />
    </div>
  )
}
