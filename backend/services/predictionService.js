const QUOTES = [
  "Your body knows its own rhythm — trust it.",
  "Every cycle is a new chapter of your story.",
  "You bloom differently in every season.",
  "Strength lives quietly in your softness.",
  "You are the moon — ever-changing, always whole.",
  "Your flow is not a flaw; it's your nature.",
  "Be gentle with yourself. You're doing beautifully.",
  "Every month, you begin again. That's quiet power.",
  "Your rhythm is uniquely yours — wear it like a crown.",
  "You carry the tides within you.",
];

function randomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

// pg returns DATE columns as JS Date objects in local timezone.
// Using getFullYear/Month/Date (local) avoids UTC-midnight-to-string
// conversion shifting the date by one day in non-UTC timezones.
function toUTC(d) {
  return typeof d === 'string'
    ? Date.UTC(...d.split('-').map((v, i) => (i === 1 ? +v - 1 : +v)))
    : Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d, n) {
  const r = new Date(d);
  r.setUTCDate(r.getUTCDate() + n);
  return r;
}

function fmt(d) {
  return d.toISOString().split('T')[0];
}

// Algorithm:
//   1. Average cycle length  = mean gap between consecutive starts (15–90d), default 28
//   2. Average period length = mean completed-cycle duration, default 5
//   3. Next period    = last start + avgCycleLength
//   4. Ovulation      = next period − 14 days  (fixed luteal phase)
//   5. Fertile window = ovulation − 5 days to ovulation + 1 day
function computePrediction(cycles) {
  if (!cycles || cycles.length === 0) return null;

  const sorted = [...cycles].sort((a, b) => toUTC(a.start_date) - toUTC(b.start_date));

  const withEnd = sorted.filter(c => c.end_date);
  const avgPeriodLength =
    withEnd.length > 0
      ? Math.round(
          withEnd.reduce((sum, c) => sum + Math.round((toUTC(c.end_date) - toUTC(c.start_date)) / 86400000) + 1, 0) /
            withEnd.length
        )
      : 5;

  let totalLen = 0, count = 0;
  for (let i = 1; i < sorted.length; i++) {
    const gap = Math.round((toUTC(sorted[i].start_date) - toUTC(sorted[i - 1].start_date)) / 86400000);
    if (gap >= 15 && gap <= 90) { totalLen += gap; count++; }
  }
  const avgCycleLength = count > 0 ? Math.round(totalLen / count) : 28;

  const lastStart       = new Date(toUTC(sorted[sorted.length - 1].start_date));
  const nextPeriodStart = addDays(lastStart, avgCycleLength);
  const nextPeriodEnd   = addDays(nextPeriodStart, avgPeriodLength - 1);
  const ovulation       = addDays(nextPeriodStart, -14);
  const fertileStart    = addDays(ovulation, -5);
  const fertileEnd      = addDays(ovulation, 1);

  return {
    avgCycleLength,
    avgPeriodLength,
    nextPeriodStart: fmt(nextPeriodStart),
    nextPeriodEnd:   fmt(nextPeriodEnd),
    ovulationDate:   fmt(ovulation),
    fertileStart:    fmt(fertileStart),
    fertileEnd:      fmt(fertileEnd),
    dataPoints:      sorted.length,
  };
}

module.exports = { computePrediction, randomQuote };
