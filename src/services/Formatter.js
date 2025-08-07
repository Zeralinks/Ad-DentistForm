// usePhoneFormatter.js
import { useEffect, useState } from 'react';

const usePhoneFormatter = (phone) => {
  const [formatted, setFormatted] = useState(phone);

  useEffect(() => {
    const digits = phone.replace(/\D/g, '').slice(0, 15);
    let result = '';
    for (let i = 0; i < digits.length; i++) {
      result += digits[i];
      if (i === 2 || i === 5 || i === 8) result += ' ';
    }
    setFormatted(result);
  }, [phone]);

  return formatted;
};

export default usePhoneFormatter;