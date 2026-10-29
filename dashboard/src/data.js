// Демо-данные. Когда Егор даст реальную базу — замени этот файл или грузи с API Орика.

export const kpis = [
  { label: 'Выручка за месяц', value: 184_250_000, suffix: ' ₸', delta: 12.4 },
  { label: 'Активные клиенты', value: 1284, delta: 8.1 },
  { label: 'Средний чек', value: 143_500, suffix: ' ₸', delta: -2.3 },
  { label: 'Экономия клиентов', value: 37_900_000, suffix: ' ₸', delta: 21.7 },
]

export const revenue = [
  { m: 'Янв', revenue: 92, forecast: 90 },
  { m: 'Фев', revenue: 104, forecast: 101 },
  { m: 'Мар', revenue: 98, forecast: 108 },
  { m: 'Апр', revenue: 121, forecast: 115 },
  { m: 'Май', revenue: 133, forecast: 128 },
  { m: 'Июн', revenue: 129, forecast: 137 },
  { m: 'Июл', revenue: 147, forecast: 144 },
  { m: 'Авг', revenue: 158, forecast: 152 },
  { m: 'Сен', revenue: 166, forecast: 163 },
  { m: 'Окт', revenue: 184, forecast: 175 },
]

export const regions = [
  { name: 'Алматы', value: 38 },
  { name: 'Астана', value: 27 },
  { name: 'Шымкент', value: 12 },
  { name: 'Актобе', value: 9 },
  { name: 'Караганда', value: 8 },
  { name: 'Другие', value: 6 },
]

export const segments = [
  { name: 'МСБ', value: 54, color: '#818cf8' },
  { name: 'Корпорации', value: 28, color: '#22d3ee' },
  { name: 'Госсектор', value: 18, color: '#c084fc' },
]

export const clients = [
  { company: 'ТОО «Актобе Агро Трейд»', city: 'Актобе', contact: 'Жумабаев Ерлан', amount: 12_400_000, status: 'Активен', score: 92 },
  { company: 'ТОО «Steppe Logistics»', city: 'Астана', contact: 'Ахметова Динара', amount: 8_750_000, status: 'Активен', score: 87 },
  { company: 'ИП «Сарыарка Строй»', city: 'Караганда', contact: 'Нурланов Арман', amount: 5_120_000, status: 'На проверке', score: 71 },
  { company: 'ТОО «Almaty Digital Hub»', city: 'Алматы', contact: 'Ким Виктория', amount: 15_900_000, status: 'Активен', score: 95 },
  { company: 'ТОО «Шымкент Фуд»', city: 'Шымкент', contact: 'Оспанов Бауыржан', amount: 3_480_000, status: 'Риск', score: 48 },
  { company: 'ТОО «Каспий Энерджи»', city: 'Атырау', contact: 'Серикова Айгерим', amount: 21_300_000, status: 'Активен', score: 89 },
]
