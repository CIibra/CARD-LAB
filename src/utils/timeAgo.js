export function timeAgo(dateInput) {
  const date = new Date(dateInput);
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);

  if (diffSec < 60) return "À l'instant";
  if (diffSec < 3600) {
    const min = Math.floor(diffSec / 60);
    return `Il y a ${min} min`;
  }
  if (diffSec < 86400) {
    const h = Math.floor(diffSec / 3600);
    return `Il y a ${h} h`;
  }
  const days = Math.floor(diffSec / 86400);
  if (days < 30) return `Depuis ${days} jour${days > 1 ? 's' : ''}`;
  return 'Depuis plus d\'un mois';
}
