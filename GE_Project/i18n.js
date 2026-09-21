(function () {
  const translations = {
    en: {},
    th: {
      'Automatic Work Table': 'ตารางงานอัตโนมัติ',
      'Automated Task Management & Intelligent Work Table': 'ระบบจัดการงานและตารางงานอัจฉริยะ',
      'Task Intake': 'รับงาน',
      'Task Title': 'ชื่องาน',
      'Duration (Hrs)': 'ระยะเวลา (ชั่วโมง)',
      Priority: 'ลำดับความสำคัญ',
      'High Priority': 'ความสำคัญสูง',
      'Medium Priority': 'ความสำคัญปานกลาง',
      'Low Priority': 'ความสำคัญต่ำ',
      'Deadline Time': 'เวลาสิ้นสุด',
      'Add to Pending Backlog': 'เพิ่มในรายการงานค้าง',
      'Pending Backlog': 'งานค้าง',
      Schedule: 'จัดตาราง',
      'Schedule Task': 'จัดตารางงาน',
      Unschedule: 'ยกเลิกการจัดตาราง',
      Delete: 'ลบ',
      High: 'สูง',
      Medium: 'ปานกลาง',
      Low: 'ต่ำ',
      'Short Break': 'พักสั้น',
      'Time Slot': 'ช่วงเวลา',
      Deadline: 'กำหนดส่ง',
      'All tasks have been scheduled': 'จัดตารางงานทั้งหมดแล้ว',
      'All tasks have been scheduled': 'จัดตารางงานทั้งหมดแล้ว',
      'Time Saved': 'เวลาที่ประหยัดได้',
      'Schedule Rate': 'อัตราการจัดตาราง',
      'Risk Alerts': 'การแจ้งเตือนความเสี่ยง',
      "Today's Work Table": 'ตารางงานวันนี้',
      "Today's Schedule": 'ตารางวันนี้',
      'No tasks scheduled yet. Tap "Schedule" or click "Auto Schedule".':
        'ยังไม่มีงานที่จัดตาราง แตะ "จัดตาราง" หรือกด "จัดตารางอัตโนมัติ"',
      'No scheduling risks detected. You will be notified if any task exceeds its deadline.':
        'ไม่พบความเสี่ยงในการจัดตาราง ระบบจะแจ้งเตือนเมื่องานเกินกำหนด',
      'Optimal Schedule:': 'ตารางงานเหมาะสม:',
      'Risk Detected!': 'พบความเสี่ยง!',
      'All assigned tasks are scheduled safely within deadlines and working hours.':
        'งานที่มอบหมายทั้งหมดจัดตารางอย่างปลอดภัยภายในกำหนดส่งและเวลาทำงาน',
      'Auto Schedule': 'จัดตารางอัตโนมัติ',
      Reset: 'รีเซ็ต',
      'Dark Mode': 'โหมดมืด',
      'Light Mode': 'โหมดสว่าง',
      'Log In': 'เข้าสู่ระบบ',
      Login: 'เข้าสู่ระบบ',
      Register: 'สมัครสมาชิก',
      'Create account': 'สร้างบัญชี',
      'Password (8+ characters)': 'รหัสผ่าน (8+ ตัวอักษร)',
      "Don't have an account?": 'ยังไม่มีบัญชีใช่ไหม?',
      'Already have an account?': 'มีบัญชีอยู่แล้วหรือยัง?',
      'Switch to registration form': 'เปลี่ยนเป็นแบบฟอร์มสมัครสมาชิก',
      'Switch to login form': 'เปลี่ยนเป็นแบบฟอร์มเข้าสู่ระบบ',
      Username: 'ชื่อผู้ใช้',
      Password: 'รหัสผ่าน',
      'Confirm password': 'ยืนยันรหัสผ่าน',
      'Full name': 'ชื่อเต็ม',
      'Student ID (optional)': 'รหัสนักศึกษา (ไม่บังคับ)',
      'Major (optional)': 'สาขา (ไม่บังคับ)',
      'Forget password?': 'ลืมรหัสผ่าน?',
      'Remember me': 'จดจำฉัน',
      Settings: 'การตั้งค่า',
      'Go to settings page': 'ไปที่หน้าการตั้งค่า',
      'Log out from your account': 'ออกจากบัญชีของคุณ',
      'Loading profile...': 'กำลังโหลดโปรไฟล์...',
      'Are you sure? This will reload your settings.': 'คุณแน่ใจหรือไม่? การดำเนินการนี้จะโหลดการตั้งค่าใหม่',
      Back: 'ย้อนกลับ',
      'Back to profile': 'กลับไปโปรไฟล์',
      'Back to Main': 'กลับหน้าหลัก',
      'Save Changes': 'บันทึกการเปลี่ยนแปลง',
      'Registration successful. Please log in.': 'สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ',
      'Invalid username or password.': 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
      'Username already in use.': 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว',
      'Settings saved successfully!': 'บันทึกการตั้งค่าสำเร็จ',
      'Failed to save settings.': 'ไม่สามารถบันทึกการตั้งค่าได้',
      'Logout failed.': 'ออกจากระบบไม่สำเร็จ',
      'Active Student Account': 'บัญชีนักศึกษาที่ใช้งานอยู่',
      'Skills & Technologies': 'ทักษะและเทคโนโลยี',
      'Active Projects': 'โครงการที่กำลังทำ',
      'Technical Skills': 'ทักษะด้านเทคนิค',
      'Current Projects': 'โครงการปัจจุบัน',
      'Profile Settings': 'การตั้งค่าโปรไฟล์',
      'Personal & Academic Details': 'ข้อมูลส่วนตัวและการศึกษา',
      'Student ID': 'รหัสนักศึกษา',
      'Faculty / Major': 'คณะ / สาขา',
      'Tech Stacks & Skills': 'ทักษะและเทคโนโลยี',
      'Active Key Projects': 'โครงการสำคัญ',
      'Tasks Completed': 'งานที่เสร็จแล้ว',
      'Total Saved Time': 'เวลาที่ประหยัดทั้งหมด',
      'Efficiency Score': 'คะแนนประสิทธิภาพ',
      'Log Out': 'ออกจากระบบ',
      'Failed to save settings': 'ไม่สามารถบันทึกการตั้งค่าได้',
      'Failed to load settings': 'ไม่สามารถโหลดการตั้งค่าได้',
      'Are you sure? This will reload your settings.': 'ต้องการโหลดการตั้งค่าใหม่หรือไม่',
      'Username and password are required.': 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน',
      'Passwords do not match.': 'รหัสผ่านไม่ตรงกัน',
      'Password must be at least 8 characters.': 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร',
      'Username and full name are required.': 'กรุณากรอกชื่อผู้ใช้และชื่อเต็ม',
      Show: 'แสดง',
      Hide: 'ซ่อน',
    },
    es: {
      'Automatic Work Table': 'Tabla de trabajo automática',
      'Task Intake': 'Entrada de tareas',
      'Task Title': 'Título de tarea',
      'Duration (Hrs)': 'Duración (horas)',
      Priority: 'Prioridad',
      'Deadline Time': 'Hora límite',
      'Add to Pending Backlog': 'Añadir a pendientes',
      'Pending Backlog': 'Pendientes',
      'Time Saved': 'Tiempo ahorrado',
      'Schedule Rate': 'Tasa de planificación',
      'Risk Alerts': 'Alertas de riesgo',
      'Auto Schedule': 'Planificar automáticamente',
      Reset: 'Restablecer',
      'Dark Mode': 'Modo oscuro',
      'Light Mode': 'Modo claro',
      'Log In': 'Iniciar sesión',
      'Login': 'Iniciar sesión',
      'Register': 'Registrarse',
      'Create account': 'Crear cuenta',
      'Password (8+ characters)': 'Contraseña (8+ caracteres)',
      "Don't have an account?": '¿No tienes una cuenta?',
      'Already have an account?': '¿Ya tienes una cuenta?',
      'Switch to registration form': 'Cambiar al formulario de registro',
      'Switch to login form': 'Cambiar al formulario de inicio de sesión',
      Settings: 'Configuración',
      'Go to settings page': 'Ir a la página de configuración',
      'Log out from your account': 'Cerrar sesión de tu cuenta',
      'Are you sure? This will reload your settings.': '¿Está seguro? Esto recargará su configuración.',
      Back: 'Atrás',
      'Save Changes': 'Guardar cambios',
      'Log Out': 'Cerrar sesión',
      'Loading profile...': 'Cargando perfil...',
    },
    fr: {
      'Automatic Work Table': 'Table de travail automatique',
      'Task Intake': 'Saisie des tâches',
      'Task Title': 'Titre de la tâche',
      'Duration (Hrs)': 'Durée (heures)',
      Priority: 'Priorité',
      'Deadline Time': 'Échéance',
      'Add to Pending Backlog': 'Ajouter aux tâches en attente',
      'Pending Backlog': 'Tâches en attente',
      'Time Saved': 'Temps économisé',
      'Schedule Rate': 'Taux de planification',
      'Risk Alerts': 'Alertes de risque',
      'Auto Schedule': 'Planifier automatiquement',
      Reset: 'Réinitialiser',
      'Dark Mode': 'Mode sombre',
      'Light Mode': 'Mode clair',
      'Log In': 'Se connecter',
      'Login': 'Se connecter',
      'Register': 'S’inscrire',
      'Create account': 'Créer un compte',
      'Password (8+ characters)': 'Mot de passe (8+ caractères)',
      "Don't have an account?": 'Vous n’avez pas de compte ?',
      'Already have an account?': 'Vous avez déjà un compte ?',
      'Switch to registration form': 'Passer au formulaire d’inscription',
      'Switch to login form': 'Passer au formulaire de connexion',
      Settings: 'Paramètres',
      'Go to settings page': 'Aller à la page des paramètres',
      'Log out from your account': 'Se déconnecter de votre compte',
      'Are you sure? This will reload your settings.': 'Êtes-vous sûr ? Cela rechargera vos paramètres.',
      Back: 'Retour',
      'Save Changes': 'Enregistrer',
      'Log Out': 'Se déconnecter',
      'Loading profile...': 'Chargement du profil...',
    },
    de: {
      'Automatic Work Table': 'Automatische Arbeitstabelle',
      'Task Intake': 'Aufgabeneingabe',
      'Task Title': 'Aufgabentitel',
      'Duration (Hrs)': 'Dauer (Stunden)',
      Priority: 'Priorität',
      'Deadline Time': 'Frist',
      'Add to Pending Backlog': 'Zu offenen Aufgaben hinzufügen',
      'Pending Backlog': 'Offene Aufgaben',
      'Time Saved': 'Gesparte Zeit',
      'Schedule Rate': 'Planungsrate',
      'Risk Alerts': 'Risiko-Warnungen',
      'Auto Schedule': 'Automatisch planen',
      Reset: 'Zurücksetzen',
      'Dark Mode': 'Dunkler Modus',
      'Light Mode': 'Heller Modus',
      'Log In': 'Anmelden',
      'Login': 'Anmelden',
      'Register': 'Registrieren',
      'Create account': 'Konto erstellen',
      'Password (8+ characters)': 'Passwort (8+ Zeichen)',
      "Don't have an account?": 'Sie haben noch kein Konto?',
      'Already have an account?': 'Sie haben bereits ein Konto?',
      'Switch to registration form': 'Zum Registrierungsformular wechseln',
      'Switch to login form': 'Zum Anmeldeformular wechseln',
      Settings: 'Einstellungen',
      'Go to settings page': 'Zur Einstellungsseite gehen',
      'Log out from your account': 'Von Ihrem Konto abmelden',
      'Are you sure? This will reload your settings.': 'Sind Sie sicher? Dadurch werden Ihre Einstellungen neu geladen.',
      Back: 'Zurück',
      'Save Changes': 'Änderungen speichern',
      'Log Out': 'Abmelden',
      'Loading profile...': 'Profil wird geladen...', 
    },
  };

  let currentLanguage = 'en';

  function translate(value) {
    const languageMap = translations[currentLanguage] || translations.en;
    return languageMap[value] || value;
  }

  function translateTextNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);
    nodes.forEach((textNode) => {
      const value = textNode.nodeValue;
      const trimmed = value.trim();
      if (!trimmed) return;
      const translated = translate(trimmed);
      if (translated !== trimmed) {
        textNode.nodeValue = value.replace(trimmed, translated);
      }
    });
  }

  function apply(language) {
    currentLanguage = translations[language] ? language : 'en';
    document.documentElement.lang = currentLanguage;
    translateTextNodes(document.body);
    document.querySelectorAll('[placeholder], [title], [aria-label], [data-i18n]').forEach((element) => {
      ['placeholder', 'title', 'aria-label'].forEach((attribute) => {
        if (element.hasAttribute(attribute)) {
          const original = element.getAttribute(attribute);
          const translated = translate(original);
          if (translated !== original) {
            element.setAttribute(attribute, translated);
          }
        }
      });
      if (element.dataset && element.dataset.i18n) {
        const translated = translate(element.dataset.i18n);
        if (translated !== element.dataset.i18n) {
          element.textContent = translated;
        }
      }
    });
  }

  window.appTranslate = translate;
  window.translatePage = function () {
    apply(currentLanguage || 'en');
  };
  window.setAppLanguage = apply;
  window.getAppLanguage = () => currentLanguage;

  const observer = new MutationObserver((mutations) => {
    if (currentLanguage === 'en') return;
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) translateTextNodes(node);
      });
    });
  });

  window.initAppLanguage = async function () {
    try {
      const response = await fetch('/api/me', { headers: { Accept: 'application/json' } });
      if (response.ok) {
        const { user } = await response.json();
        apply(user.language || 'en');
      } else {
        apply(localStorage.getItem('language') || 'en');
      }
    } catch (error) {
      apply(localStorage.getItem('language') || 'en');
    }
    observer.observe(document.body, { childList: true, subtree: true });
  };
})();
