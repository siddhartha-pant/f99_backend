// src/utils/progression.logic.ts


//  DOUBLE PROGRESSION LOGIC
export function getNextWeight(
  sets: { weight: number; reps: number }[],
  repRange: string = "8-12"
): number {

  if (!sets || sets.length === 0) return 0;

  const [, max] = repRange.split("-").map(Number);

  const allSetsHitMax = sets.every(s => s.reps >= max);

  if (allSetsHitMax) {
    return sets[0].weight + 2.5; // increase weight
  }

  return sets[0].weight; // keep same
}


//  WEEKLY DIFFICULTY PROGRESSION
export function adjustDifficulty(program: any) {

  program.currentWeek += 1;

  program.workouts.forEach((workout: any) => {
    workout.exercises.forEach((ex: any) => {

      // Every 2 weeks → increase sets
      if (program.currentWeek % 2 === 0) {
        ex.sets += 1;
      }

      // Every 4 weeks → slightly increase intensity
      if (program.currentWeek % 4 === 0) {
        if (ex.reps.includes("-")) {
          const [min, max] = ex.reps.split("-").map(Number);
          ex.reps = `${min}-${max - 1}`; // harder
        }
      }
    });
  });

  return program;
}


//  OPTIONAL: Detect PR (Personal Record)
export function detectPR(
  previousMax: number,
  currentSets: { weight: number; reps: number }[]
): boolean {

  const currentMax = Math.max(...currentSets.map(s => s.weight));

  return currentMax > previousMax;
}
