export const calculateGoals = (user: any, diaryEntries: any[]) => {
  const bodyFatStart = 15;
  const bodyFatTarget = 8;
  const benchTarget = 100;
  const ohpTarget = 60;

  const avgRating =
    diaryEntries.length > 0
      ? diaryEntries.reduce((a, e) => a + Number(e.rating), 0) /
        diaryEntries.length
      : 5;

  const performanceMultiplier = Math.min(1.2, Math.max(0.5, avgRating / 7));

  const benchCurrent = 80 + diaryEntries.length * 0.3 * performanceMultiplier;
  const ohpCurrent = 55 + diaryEntries.length * 0.2 * performanceMultiplier;

  const calculateProgress = (current: number, target: number) =>
    Math.max(0, Math.min(100, (current / target) * 100));

  const calculateETA = (current: number, weeklyRate: number) => {
    if (current <= 0) return "—";
    const remaining = 100 - current;
    const weeks = Math.ceil(remaining / weeklyRate);
    return weeks <= 1 ? "Almost there" : `${weeks} weeks`;
  };

  return [
    {
      title: "Cut to 8% Body Fat",
      progress: calculateProgress(
        bodyFatStart - (user.bodyFat || 15),
        bodyFatStart - bodyFatTarget,
      ),
      eta: calculateETA(
        bodyFatStart - (user.bodyFat || 15),
        0.4 * performanceMultiplier,
      ),
    },
    {
      title: "Bench 100kg",
      progress: calculateProgress(benchCurrent, benchTarget),
      eta: calculateETA(benchCurrent, 2.5 * performanceMultiplier),
    },
    {
      title: "OHP 60kg",
      progress: calculateProgress(ohpCurrent, ohpTarget),
      eta: calculateETA(ohpCurrent, 1.5 * performanceMultiplier),
    },
  ];
};

export const calculateStreak = (diaryEntries: any[]) => {
  if (!diaryEntries || diaryEntries.length === 0) return 0;

  // Sort by date descending (newest first)
  const sorted = [...diaryEntries].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  let streak = 0;
  let current = new Date();
  current.setHours(0, 0, 0, 0); // normalize to start of day

  for (const entry of sorted) {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);

    if (entryDate.getTime() === current.getTime()) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else if (entryDate.getTime() < current.getTime()) {
      // Gap found → stop counting streak
      break;
    }
  }

  return streak;
};
