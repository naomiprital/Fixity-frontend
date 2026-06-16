import { PagesEnum } from "@/enums/PagesEnum";

export const capitalizeFirstLetter = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const getDefaultPathForRole = (role?: string): string => {
  if (!role) return '/';
  
  switch (role) {
    case 'Official':
      return `/${PagesEnum.OFFICIAL_DASHBOARD}`;
    case 'Worker':
      return `/${PagesEnum.WORKER_POOL}`;
    case 'Manager':
      return `/${PagesEnum.MANAGER_DASHBOARD}`;
    case 'HR':
      return `/${PagesEnum.HR_STAFF}`;
    case 'Citizen':
    default:
      return `/${PagesEnum.CITIZEN_HOME}`;
  }
};
