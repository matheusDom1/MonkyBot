const { getOrCreateUser } = require('./economy/balanceService.js');
const { updateUserBalanceRepository, updateDate } = require('../repositories/userRepository.js');
const { getCooldown, updateLastDaily } = require('../repositories/cooldownsRepository.js');

const DAILY_REWARD = 100;
const DAILY_TIMEZONE = "America/Sao_Paulo";

const getDateParts = (date, timeZone = DAILY_TIMEZONE) => {
    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });

    const parts = formatter.formatToParts(date);
    return {
        year: Number(parts.find((part) => part.type === "year")?.value),
        month: Number(parts.find((part) => part.type === "month")?.value),
        day: Number(parts.find((part) => part.type === "day")?.value)
    };
};

const formatLastDaily = (timestamp) => {
    if (!timestamp) return "nunca";

    const date = new Date(Number(timestamp));
    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
        timeZone: DAILY_TIMEZONE
    }).format(date);
};

const isSameDay = (timestamp, now = new Date()) => {
    if (timestamp == null) return false;

    const milliseconds = Number(timestamp);

    if (Number.isNaN(milliseconds)) return false;

    const lastDate = new Date(milliseconds);

    if (Number.isNaN(lastDate.getTime())) return false;

    const lastParts = getDateParts(lastDate);
    const currentParts = getDateParts(now);

    return (
        lastParts.year === currentParts.year &&
        lastParts.month === currentParts.month &&
        lastParts.day === currentParts.day
    );
};

const dailyService = async (userId) => {
    const user = await getOrCreateUser(userId);
    const cooldown = await getCooldown(userId);
    const lastDaily = cooldown?.lastDaily ?? null;
    if (isSameDay(lastDaily)) {
        return {
            claimed: false,
            message: `🍌 Você já coletou sua recompensa diária hoje.`
        };
    }

    const currentBalance = user?.moedas ?? 0;
    const reward = DAILY_REWARD;
    const newBalance = currentBalance + reward;

    await updateUserBalanceRepository(userId, newBalance);
    await updateLastDaily(userId, Date.now());

    return {
        claimed: true,
        reward,
        newBalance,
        lastDaily: Date.now(),
        lastDailyFormatted: formatLastDaily(Date.now()),
        message: "Recompensa diária coletada com sucesso!"
    };
};

module.exports = {
    dailyService
};