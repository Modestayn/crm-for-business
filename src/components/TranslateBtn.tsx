import { useTranslation } from 'react-i18next';

export const TranslateBtn = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
  };
  return (
    <div>
      <div>
        <select
          onChange={changeLanguage}
          defaultValue={i18n.language}
          className='px-3 py-1 bg-gray-300 rounded mx-2'
        >
          <option value='uk'>Ukrainian</option>
          <option value='en'>English</option>
        </select>
      </div>
    </div>
  );
};
