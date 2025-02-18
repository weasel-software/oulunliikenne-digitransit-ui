import Cookies from 'universal-cookie';

export const prepareAlertParams = (params) => {
  const cookies = new Cookies();
  return {
    ...params,
    language: cookies.get('lang') ?? 'fi',
  };
};

// todo: find a bettwen way to get user language, language link is not functioning in this view
