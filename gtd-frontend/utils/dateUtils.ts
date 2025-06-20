export const formatDate = (dateString: string, options?: Intl.DateTimeFormatOptions): string => {
  const date = new Date(dateString);
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return date.toLocaleDateString('en-US', options || defaultOptions);
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  
  return date.toDateString() === today.toDateString();
};

export const isYesterday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return date.toDateString() === yesterday.toDateString();
};

export const getRelativeTime = (dateString: string): string => {
  if (isToday(dateString)) {
    return 'Today';
  }
  
  if (isYesterday(dateString)) {
    return 'Yesterday';
  }
  
  return formatDate(dateString);
}; 