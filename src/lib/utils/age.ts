export function calculateAge(birthDate: Date) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

export function getAgeGroup(age: number) {
  if (age >= 5 && age <= 8) return "5-8";
  if (age >= 9 && age <= 12) return "9-12";
  if (age >= 13 && age <= 15) return "13-15";
  if (age >= 16 && age <= 18) return "16-18";
  return "Other";
}
