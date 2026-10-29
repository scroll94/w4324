// Демо-данные лежат в data.json — их же читают ИИ-бот (bot/ai.py) и облачный чат (worker/).
// Когда Егор даст реальную базу — замени data.json.
import data from './data.json'

export const { kpis, revenue, regions, segments, clients } = data
