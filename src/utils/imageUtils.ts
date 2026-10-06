import { ASSETS } from '../data/mockData';

// Fallback image map
export const FALLBACK_IMAGE = ASSETS.heroPad;

// Clean fallback handler for image errors
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  backupUrl: string = FALLBACK_IMAGE
) => {
  const target = e.currentTarget;
  if (target.dataset.triedBackup !== 'true') {
    target.dataset.triedBackup = 'true';
    target.src = backupUrl;
  }
};
