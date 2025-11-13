import { useState, useEffect } from 'react';
import { storage } from 'wxt/utils/storage';
import './App.css';

type Language = 'en' | 'zh_CN';

// Define a typed storage item for preferred language
const preferredLanguageStorage = storage.defineItem<Language>('local:preferredLanguage', {
  fallback: 'en',
});

const languages = {
  en: { name: 'English', flag: '🇺🇸' },
  zh_CN: { name: '中文', flag: '🇨🇳' }
};

const translations = {
  en: {
    title: 'WorldLabs Extension Settings',
    languageSetting: 'Language Settings',
    selectLanguage: 'Select Display Language',
    currentLanguage: 'Current Language',
    extensionStatus: 'Extension Status',
    extensionEnabled: 'Extension is enabled',
    instructions: 'Instructions',
    instruction1: 'Visit marble.worldlabs.ai to use the extension',
    instruction2: 'Click the 📋 button on world pages to view details',
    instruction3: 'Language settings are applied immediately',
    saveSettings: 'Save Settings',
    settingsSaved: 'Settings saved successfully!'
  },
  zh_CN: {
    title: 'WorldLabs 扩展设置',
    languageSetting: '语言设置',
    selectLanguage: '选择显示语言',
    currentLanguage: '当前语言',
    extensionStatus: '扩展状态',
    extensionEnabled: '扩展已启用',
    instructions: '使用说明',
    instruction1: '访问 marble.worldlabs.ai 使用扩展功能',
    instruction2: '在世界页面点击 📋 按钮查看详情',
    instruction3: '语言设置会立即生效',
    saveSettings: '保存设置',
    settingsSaved: '设置保存成功！'
  }
};

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [savedLanguage, setSavedLanguage] = useState<Language>('en');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  useEffect(() => {
    // Load saved language from storage using WXT API
    const loadLanguage = async () => {
      try {
        const savedLanguage = await preferredLanguageStorage.getValue();
        console.log('Loaded preferred language:', savedLanguage);
        setSelectedLanguage(savedLanguage);
        setSavedLanguage(savedLanguage);
      } catch (error) {
        console.error('Failed to load language:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadLanguage();
  }, []);

  // Show loading state while initializing
  if (!isLoaded) {
    return (
      <div style={{
        width: '380px',
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'system-ui'
      }}>
        Loading...
      </div>
    );
  }

  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
  };

  const saveSettings = async () => {
    console.log('Saving settings with language:', selectedLanguage);
    try {
      // Save using WXT storage API
      await preferredLanguageStorage.setValue(selectedLanguage);
      setSavedLanguage(selectedLanguage);

      // Verify the save
      const savedLanguage = await preferredLanguageStorage.getValue();
      console.log('Verified saved language:', savedLanguage);

      try {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        if (tabs[0] && tabs[0].id) {
          try {
            await browser.tabs.sendMessage(tabs[0].id, {
              type: 'LANGUAGE_CHANGED',
              language: selectedLanguage
            });
          } catch (error) {
            // Content script might not be injected, that's ok
            console.log('Content script not available:', error);
          }
        }
      } catch (tabError) {
        console.log('Tab query error:', tabError);
      }

      // Show success message
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const t = translations[selectedLanguage];

  return (
    <div className="extension-popup">
      <div className="popup-header">
        <h2>{t.title}</h2>
      </div>

      <div className="popup-content">
        <div className="settings-section">
          <h3>{t.languageSetting}</h3>
          <div className="current-language-info">
            <span>{t.currentLanguage}: </span>
            <strong>{languages[selectedLanguage].flag} {languages[selectedLanguage].name}</strong>
          </div>

          <div className="language-selector">
            <label>{t.selectLanguage}:</label>
            <div className="language-options">
              {Object.entries(languages).map(([key, value]) => (
                <button
                  key={key}
                  className={`language-option ${selectedLanguage === key ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(key as Language)}
                >
                  <span className="flag">{value.flag}</span>
                  <span className="name">{value.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="status-section">
          <h3>{t.extensionStatus}</h3>
          <div className="status-item">
            <span className="status-indicator">✅</span>
            <span>{t.extensionEnabled}</span>
          </div>
        </div>

        <div className="instructions-section">
          <h3>{t.instructions}</h3>
          <ul>
            <li>{t.instruction1}</li>
            <li>{t.instruction2}</li>
            <li>{t.instruction3}</li>
          </ul>
        </div>

        <div className="action-section">
          <button
            className="save-button"
            onClick={saveSettings}
            disabled={selectedLanguage === savedLanguage}
          >
            {t.saveSettings}
          </button>
          {showSaveSuccess && (
            <div className="success-message">
              {t.settingsSaved}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
