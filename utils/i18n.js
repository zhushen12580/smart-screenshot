// 语言配置
const i18n = {
  zh: {
    title: "精准截图",
    tagline: "一键智能精准截图",
    description: "智能识别网页内容，一键完成预设比例截图",
    startButton: "开始截图",
    capturing: "截图中...",
    normalMode: "普通模式",
    inspectMode: "智能模式",
    ratioLabel: "选择比例",
    formatLabel: "保存格式",
    shortcuts: "快捷键",
    openPopup: "打开扩展弹出窗口",
    startScreenshot: "开始截图:",
    confirmScreenshot: "确认截图:",
    cancelScreenshot: "取消截图:",
    copyToClipboard: "复制截图:",
    commonRatios: "常用比例",
    mobileRatios: "手机/竖屏",
    socialMediaRatios: "社交媒体",
    otherRatios: "其他",
    footer: "精准截图 v1.5 - 一键智能精准截图",
    // 快速操作按钮
    quickActions_share: "分享美好",
    quickActions_feedback: "创造美好",
    quickActions_shareSuccess: "分享文本已复制到剪贴板！",
    quickActions_shareFailed: "复制失败，请重试",
    // 标题提示文本
    titleTips: {
      aiDialog: "与截图内容进行智能对话",
      qrDecode: "解析截图中的二维码",
      lockSize: "锁定当前尺寸用于连续截图",
      magnetic: "启用后会自动吸附到页面元素边缘",
      move: "拖动选择区域 (Space + 拖动)"
    },
    // 分享介绍文本
    shareIntroText: {
      title: "🔍 精准截图 | 高效智能的屏幕截图工具",
      features_title: "✨ 特色功能：",
      feature1: "✅ 支持多种屏幕比例，适合社交媒体分享",
      feature2: "✅ 智能模式自动识别界面元素边缘",
      feature3: "✅ 智能识别二维码、支持与截图智能对话",
      feature4: "✅ 一键抠图、智能优化图像效果",
      download: "👉 立即下载体验：https://puzzledu.com/shot"
    },
    // 工具栏文本
    toolbar: {
      saveArea: "保存此区域",
      copyToClipboard: "复制",
      saveAllAreas: "保存所有区域",
      keepAndContinue: "保持此区域并继续",
      cancel: "取消",
      lockSize: "锁定尺寸",
      lockSizeActive: "✓ 锁定尺寸",
      magnetic: "磁性吸附",
      magneticActive: "✓ 磁性吸附",
      freeRatio: "自由比例",
      scrollScreenshot: "长截图",
      imageQuality: {
        original: "原图质量",
        high: "高清",
        standard: "标准",
        light: "轻量"
      },
      fileSizeEstimate: "约 {size} {unit}"
    },
    // 长截图配置
    scrollScreenshotConfig: {
      title: "长截图设置",
      heightLabel: "滚动高度:",
      heightUnit: "像素",
      autoHeight: "自动到页面底部",
      customHeight: "自定义高度:",
      manualControl: "手动滚动控制",
      manualControlDesc: "进入滚动模式，您可以手动滚动页面到想要的位置，然后点击停止按钮完成长截图",
      confirm: "开始长截图",
      cancel: "取消",
      currentSelectionSize: "当前选区: {width} × {height}",
      estimatedFinalSize: "预计长截图: {width} × {height}",
      warning: "注意：长截图可能需要较长时间，请耐心等待"
    },
    ratioGroups: {
      common: {
        label: "常用比例",
        options: {
          "16:9": "16:9 (视频/屏幕)",
          "4:3": "4:3 (传统屏幕)",
          "1:1": "1:1 (正方形/Instagram)"
        }
      },
      mobile: {
        label: "手机/竖屏",
        options: {
          "9:16": "9:16 (手机竖屏/故事)",
          "3:4": "3:4 (小红书/iPad)"
        }
      },
      social: {
        label: "社交媒体",
        options: {
          "2:1": "2:1 (小红书/Twitter横图)",
          "1:2": "1:2 (Pinterest)",
          "4:5": "4:5 (Instagram竖图)",
          "3:2": "3:2 (SNS封面)"
        }
      },
      other: {
        label: "其他",
        options: {
          "21:9": "21:9 (超宽屏)",
          "free": "自由比例"
        }
      }
    },
    // 选项页面翻译
    options: {
      title: "精准截图设置",
      shortcuts_section: "快捷键设置",
      shortcuts_desc: "配置常用操作的快捷键，使用更加便捷",
      shortcut_start: "开始截图:",
      shortcut_confirm: "确认截图:",
      shortcut_cancel: "取消截图:",
      click_to_set: "点击设置快捷键",
      default_prefix: "默认:",
      clear: "清除",
      save_shortcuts: "保存快捷键",
      reset_defaults: "恢复默认",
      shortcut_note: "注意: 这里设置的是扩展内部使用的快捷键。",
      chrome_shortcut_note: "Chrome浏览器也提供了快捷键配置，可以在 扩展管理页面 中设置。",
      extension_page: "扩展管理页面",
      api_section: "API设置",
      glm4v_api: "智谱GLM-4V API密钥:",
      deepseek_api: "DeepSeek API密钥:",
      input_api_key: "输入API密钥",
      save_api_settings: "保存API设置", 
      about_section: "关于",
      version_prefix: "精准截图 版本",
      rights_reserved: "保留所有权利。",
      feedback: "问题反馈",
      privacy_policy: "隐私政策"
    },
    // popup设置链接文本
    settings_link: "设置"
  },
  en: {
    title: "Precision Screenshot",
    tagline: "Smart screenshot with one click",
    description: "Smart webpage content recognition, one-click preset ratio screenshots",
    startButton: "Start Screenshot",
    capturing: "Capturing...",
    normalMode: "Normal Mode",
    inspectMode: "Smart Mode",
    ratioLabel: "Select Ratio",
    formatLabel: "Save Format",
    shortcuts: "Shortcuts",
    openPopup: "Open Extension Popup",
    startScreenshot: "Start Screenshot:",
    confirmScreenshot: "Confirm Screenshot:",
    cancelScreenshot: "Cancel Screenshot:",
    copyToClipboard: "Copy Screenshot:",
    commonRatios: "Common Ratios",
    mobileRatios: "Mobile/Portrait",
    socialMediaRatios: "Social Media",
    otherRatios: "Others",
    footer: "Precision Screenshot v1.5 - Smart Screenshot Tool",
    // 快速操作按钮
    quickActions_share: "Share with Others",
    quickActions_feedback: "Create Beauty",
    quickActions_shareSuccess: "Share text copied to clipboard!",
    quickActions_shareFailed: "Copy failed, please try again",
    // 标题提示文本
    titleTips: {
      aiDialog: "Have an intelligent conversation about the screenshot content",
      qrDecode: "Decode QR code in the screenshot",
      lockSize: "Lock current size for continuous capture",
      magnetic: "Auto-snap to page element edges when enabled",
      move: "Drag selection area (Space + drag)"
    },
    // 分享介绍文本
    shareIntroText: {
      title: "🔍 Precision Screenshot | Efficient Smart Screenshot Tool",
      features_title: "✨ Features:",
      feature1: "✅ Support for multiple screen ratios, ideal for social media sharing",
      feature2: "✅ Smart mode automatically recognizes UI element edges",
      feature3: "✅ QR code recognition and AI image conversation",
      feature4: "✅ One-click background removal and smart image optimization",
      download: "👉 Download now: https://puzzledu.com/shot"
    },
    // 工具栏文本
    toolbar: {
      saveArea: "Save This Area",
      copyToClipboard: "Copy",
      saveAllAreas: "Save All Areas",
      keepAndContinue: "Keep & Continue",
      cancel: "Cancel",
      lockSize: "Lock Size",
      lockSizeActive: "✓ Lock Size",
      magnetic: "Magnetic Snap",
      magneticActive: "✓ Magnetic Snap",
      freeRatio: "Free Ratio",
      scrollScreenshot: "Long Screenshot",
      imageQuality: {
        original: "Original Quality",
        high: "High Quality",
        standard: "Standard",
        light: "Light"
      },
      fileSizeEstimate: "About {size} {unit}"
    },
    // 长截图配置
    scrollScreenshotConfig: {
      title: "Long Screenshot Settings",
      heightLabel: "Scroll Height:",
      heightUnit: "pixels",
      autoHeight: "Auto to page bottom",
      customHeight: "Custom height:",
      manualControl: "Manual scroll control",
      manualControlDesc: "Enter scroll mode, manually scroll to desired position, then click stop to complete long screenshot",
      confirm: "Start Long Screenshot",
      cancel: "Cancel",
      currentSelectionSize: "Current selection: {width} × {height}",
      estimatedFinalSize: "Estimated final: {width} × {height}",
      warning: "Note: Long screenshot may take a while, please be patient"
    },
    ratioGroups: {
      common: {
        label: "Common Ratios",
        options: {
          "16:9": "16:9 (Video/Screen)",
          "4:3": "4:3 (Traditional Screen)",
          "1:1": "1:1 (Square/Instagram)"
        }
      },
      mobile: {
        label: "Mobile/Portrait",
        options: {
          "9:16": "9:16 (Mobile Portrait/Stories)",
          "3:4": "3:4 (Instagram/iPad)"
        }
      },
      social: {
        label: "Social Media",
        options: {
          "2:1": "2:1 (Twitter Landscape)",
          "1:2": "1:2 (Pinterest)",
          "4:5": "4:5 (Instagram Portrait)",
          "3:2": "3:2 (Social Cover)"
        }
      },
      other: {
        label: "Others",
        options: {
          "21:9": "21:9 (Ultrawide)",
          "free": "Free Ratio"
        }
      }
    },
    // 选项页面翻译
    options: {
      title: "Precision Screenshot Settings",
      shortcuts_section: "Shortcut Settings",
      shortcuts_desc: "Configure shortcuts for common operations for more convenient use",
      shortcut_start: "Start Screenshot:",
      shortcut_confirm: "Confirm Screenshot:",
      shortcut_cancel: "Cancel Screenshot:",
      click_to_set: "Click to set shortcut",
      default_prefix: "Default:",
      clear: "Clear",
      save_shortcuts: "Save Shortcuts",
      reset_defaults: "Reset Defaults",
      shortcut_note: "Note: These shortcuts are used within the extension.",
      chrome_shortcut_note: "Chrome browser also provides shortcut configuration in the Extensions page.",
      extension_page: "Extensions page",
      api_section: "API Settings",
      glm4v_api: "Zhipu GLM-4V API Key:",
      deepseek_api: "DeepSeek API Key:",
      input_api_key: "Enter API key",
      save_api_settings: "Save API Settings", 
      about_section: "About",
      version_prefix: "Precision Screenshot version",
      rights_reserved: "All rights reserved.",
      feedback: "Feedback",
      privacy_policy: "Privacy Policy"
    },
    // popup设置链接文本
    settings_link: "Settings"
  },
  es: {
    title: "Captura de Pantalla Precisa",
    tagline: "Captura inteligente con un clic",
    description: "Reconocimiento inteligente del contenido web, capturas con proporciones preestablecidas con un clic",
    startButton: "Iniciar Captura",
    capturing: "Capturando...",
    normalMode: "Modo Normal",
    inspectMode: "Modo Inteligente",
    ratioLabel: "Seleccionar Proporción",
    formatLabel: "Formato de Guardado",
    shortcuts: "Atajos",
    openPopup: "Abrir Ventana de Extensión",
    startScreenshot: "Iniciar Captura:",
    confirmScreenshot: "Confirmar Captura:",
    cancelScreenshot: "Cancelar Captura:",
    copyToClipboard: "Copiar:",
    commonRatios: "Proporciones Comunes",
    mobileRatios: "Móvil/Vertical",
    socialMediaRatios: "Redes Sociales",
    otherRatios: "Otros",
    footer: "Captura de Pantalla Precisa v1.5 - Herramienta Inteligente de Captura",
    // 快速操作按钮
    quickActions_share: "Compartir",
    quickActions_feedback: "Crear Belleza",
    quickActions_shareSuccess: "¡Texto para compartir copiado al portapapeles!",
    quickActions_shareFailed: "Error al copiar, inténtalo de nuevo",
    // 标题提示文本
    titleTips: {
      aiDialog: "Mantener una conversación inteligente sobre el contenido de la captura",
      qrDecode: "Decodificar código QR en la captura",
      lockSize: "Bloquear tamaño para captura continua",
      magnetic: "Auto-snap para elementos de la página cuando está activado",
      move: "Arrastrar área de selección (Espacio + arrastrar)"
    },
    // 分享介绍文本
    shareIntroText: {
      title: "🔍 Captura de Pantalla Precisa | Herramienta de captura inteligente y eficiente",
      features_title: "✨ Características:",
      feature1: "✅ Soporte para múltiples proporciones de pantalla, ideal para redes sociales",
      feature2: "✅ El modo inteligente reconoce automáticamente los bordes de los elementos",
      feature3: "✅ Reconocimiento de códigos QR y conversas de imágenes con IA",
      feature4: "✅ Eliminación de fondo con un clic y optimización inteligente de imágenes",
      download: "👉 Descarga ahora: https://puzzledu.com/shot"
    },
    // Textos de la barra de herramientas
    toolbar: {
      saveArea: "Guardar Esta Área",
      copyToClipboard: "Copiar",
      saveAllAreas: "Guardar Todas las Áreas",
      keepAndContinue: "Mantener y Continuar",
      cancel: "Cancelar",
      lockSize: "Bloquear Tamaño",
      lockSizeActive: "✓ Tamaño Bloqueado",
      magnetic: "Ajuste Magnético",
      magneticActive: "✓ Ajuste Magnético",
      freeRatio: "Proporción Libre",
      imageQuality: {
        original: "Calidad Original",
        high: "Alta Calidad",
        standard: "Estándar",
        light: "Ligera"
      },
      fileSizeEstimate: "Aproximadamente {size} {unit}"
    },
    ratioGroups: {
      common: {
        label: "Proporciones Comunes",
        options: {
          "16:9": "16:9 (Video/Pantalla)",
          "4:3": "4:3 (Pantalla Tradicional)",
          "1:1": "1:1 (Cuadrado/Instagram)"
        }
      },
      mobile: {
        label: "Móvil/Vertical",
        options: {
          "9:16": "9:16 (Móvil Vertical/Historias)",
          "3:4": "3:4 (Instagram/iPad)"
        }
      },
      social: {
        label: "Redes Sociales",
        options: {
          "2:1": "2:1 (Twitter Horizontal)",
          "1:2": "1:2 (Pinterest)",
          "4:5": "4:5 (Instagram Vertical)",
          "3:2": "3:2 (Portada Social)"
        }
      },
      other: {
        label: "Otros",
        options: {
          "21:9": "21:9 (Ultraancha)",
          "free": "Proporción Libre"
        }
      }
    },
    // 选项页面翻译
    options: {
      title: "Configuración de Captura de Pantalla Precisa",
      shortcuts_section: "Configuración de Atajos",
      shortcuts_desc: "Configure atajos para operaciones comunes para un uso más conveniente",
      shortcut_start: "Iniciar Captura:",
      shortcut_confirm: "Confirmar Captura:",
      shortcut_cancel: "Cancelar Captura:",
      click_to_set: "Haga clic para establecer atajo",
      default_prefix: "Predeterminado:",
      clear: "Borrar",
      save_shortcuts: "Guardar Atajos",
      reset_defaults: "Restablecer Valores",
      shortcut_note: "Nota: Estos atajos se utilizan dentro de la extensión.",
      chrome_shortcut_note: "El navegador Chrome también proporciona configuración de atajos en la página de Extensiones.",
      extension_page: "página de Extensiones",
      api_section: "Configuración de API",
      glm4v_api: "Clave API de Zhipu GLM-4V:",
      deepseek_api: "Clave API de DeepSeek:",
      input_api_key: "Introducir clave API",
      save_api_settings: "Guardar Configuración API", 
      about_section: "Acerca de",
      version_prefix: "Captura de Pantalla Precisa versión",
      rights_reserved: "Todos los derechos reservados.",
      feedback: "Comentarios",
      privacy_policy: "Política de Privacidad"
    },
    // popup设置链接文本
    settings_link: "Configuración"
  },
  ar: {
    title: "لقطة شاشة دقيقة",
    tagline: "لقطة ذكية بنقرة واحدة",
    description: "التعرف الذكي على محتوى صفحة الويب، لقطات شاشة بنسب محددة مسبقًا بنقرة واحدة",
    startButton: "بدء اللقطة",
    capturing: "جاري التقاط...",
    normalMode: "الوضع العادي",
    inspectMode: "الوضع الذكي",
    ratioLabel: "اختيار النسبة",
    formatLabel: "تنسيق الحفظ",
    shortcuts: "اختصارات",
    openPopup: "فتح نافذة الإضافة",
    startScreenshot: "بدء اللقطة:",
    confirmScreenshot: "تأكيد اللقطة:",
    cancelScreenshot: "إلغاء اللقطة:",
    copyToClipboard: "نسخ:",
    commonRatios: "النسب الشائعة",
    mobileRatios: "الجوال/عمودي",
    socialMediaRatios: "وسائل التواصل الاجتماعي",
    otherRatios: "أخرى",
    footer: "لقطة شاشة دقيقة الإصدار 1.5 - أداة لقطة شاشة ذكية",
    // أزرار العمليات السريعة
    quickActions_share: "مشاركة الجمال",
    quickActions_feedback: "إبداع الجمال",
    quickActions_shareSuccess: "تم نسخ نص المشاركة إلى الحافظة!",
    quickActions_shareFailed: "فشل النسخ، يرجى المحاولة مرة أخرى",
    // 分享介绍文本
    shareIntroText: {
      title: "🔍 لقطة شاشة دقيقة | أداة لقطة شاشة ذكية وفعالة",
      features_title: "✨ الميزات:",
      feature1: "✅ دعم لنسب شاشة متعددة، مثالية لمشاركة وسائل التواصل الاجتماعي",
      feature2: "✅ الوضع الذكي يتعرف تلقائيًا على حواف عناصر واجهة المستخدم",
      feature3: "✅ التعرف على رمز الاستجابة السريعة ومحادثة الصور بالذكاء الاصطناعي",
      feature4: "✅ إزالة الخلفية بنقرة واحدة وتحسين الصورة الذكي",
      download: "👉 قم بالتنزيل الآن: https://puzzledu.com/shot"
    },
    // نصوص شريط الأدوات
    toolbar: {
      saveArea: "حفظ هذه المنطقة",
      copyToClipboard: "نسخ",
      saveAllAreas: "حفظ جميع المناطق",
      keepAndContinue: "الاحتفاظ والمتابعة",
      cancel: "إلغاء",
      lockSize: "قفل الحجم",
      lockSizeActive: "✓ الحجم مقفل",
      magnetic: "التقاط مغناطيسي",
      magneticActive: "✓ التقاط مغناطيسي",
      freeRatio: "نسبة حرة",
      imageQuality: {
        original: "الجودة الأصلية",
        high: "جودة عالية",
        standard: "قياسية",
        light: "خفيفة"
      },
      fileSizeEstimate: "تقريبًا {size} {unit}"
    },
    ratioGroups: {
      common: {
        label: "النسب الشائعة",
        options: {
          "16:9": "16:9 (فيديو/شاشة)",
          "4:3": "4:3 (شاشة تقليدية)",
          "1:1": "1:1 (مربع/انستجرام)"
        }
      },
      mobile: {
        label: "الجوال/عمودي",
        options: {
          "9:16": "9:16 (جوال عمودي/قصص)",
          "3:4": "3:4 (انستجرام/آيباد)"
        }
      },
      social: {
        label: "وسائل التواصل الاجتماعي",
        options: {
          "2:1": "2:1 (تويتر أفقي)",
          "1:2": "1:2 (بينتريست)",
          "4:5": "4:5 (انستجرام عمودي)",
          "3:2": "3:2 (غلاف اجتماعي)"
        }
      },
      other: {
        label: "أخرى",
        options: {
          "21:9": "21:9 (شاشة عريضة جدًا)",
          "free": "نسبة حرة"
        }
      }
    },
    // 选项页面翻译
    options: {
      title: "إعدادات لقطة شاشة دقيقة",
      shortcuts_section: "إعدادات الاختصارات",
      shortcuts_desc: "تكوين اختصارات للعمليات الشائعة لاستخدام أكثر ملاءمة",
      shortcut_start: "بدء اللقطة:",
      shortcut_confirm: "تأكيد اللقطة:",
      shortcut_cancel: "إلغاء اللقطة:",
      click_to_set: "انقر لتعيين الاختصار",
      default_prefix: "افتراضي:",
      clear: "مسح",
      save_shortcuts: "حفظ الاختصارات",
      reset_defaults: "إعادة تعيين الافتراضيات",
      shortcut_note: "ملاحظة: تُستخدم هذه الاختصارات داخل الامتداد.",
      chrome_shortcut_note: "يوفر متصفح Chrome أيضًا تكوين الاختصارات في صفحة الملحقات.",
      extension_page: "صفحة الملحقات",
      api_section: "إعدادات API",
      glm4v_api: "مفتاح API لـ Zhipu GLM-4V:",
      deepseek_api: "مفتاح API لـ DeepSeek:",
      input_api_key: "أدخل مفتاح API",
      save_api_settings: "حفظ إعدادات API", 
      about_section: "حول",
      version_prefix: "لقطة شاشة دقيقة الإصدار",
      rights_reserved: "جميع الحقوق محفوظة.",
      feedback: "ردود الفعل",
      privacy_policy: "سياسة الخصوصية"
    },
    // popup设置链接文本
    settings_link: "الإعدادات"
  },
  de: {
    title: "Präzisions-Screenshot",
    tagline: "Intelligentes Screenshot mit einem Klick",
    description: "Intelligente Erkennung von Webseiteninhalten, Bildschirmfotos mit voreingestellten Seitenverhältnissen mit einem Klick",
    startButton: "Screenshot starten",
    capturing: "Aufnahme läuft...",
    normalMode: "Normaler Modus",
    inspectMode: "Intelligenter Modus",
    ratioLabel: "Seitenverhältnis wählen",
    formatLabel: "Speicherformat",
    shortcuts: "Tastenkürzel",
    openPopup: "Erweiterungsfenster öffnen",
    startScreenshot: "Screenshot starten:",
    confirmScreenshot: "Screenshot bestätigen:",
    cancelScreenshot: "Screenshot abbrechen:",
    copyToClipboard: "Kopieren:",
    commonRatios: "Gängige Seitenverhältnisse",
    mobileRatios: "Mobil/Hochformat",
    socialMediaRatios: "Soziale Medien",
    otherRatios: "Sonstige",
    footer: "Präzisions-Screenshot v1.5 - Intelligentes Screenshot-Tool",
    // Schnellaktionsbuttons
    quickActions_share: "Teilen",
    quickActions_feedback: "Schönheit schaffen",
    quickActions_shareSuccess: "Freigabetext in Zwischenablage kopiert!",
    quickActions_shareFailed: "Kopieren fehlgeschlagen, bitte erneut versuchen",
    // 分享介绍文本
    shareIntroText: {
      title: "🔍 Präzisions-Screenshot | Effizientes intelligentes Screenshot-Tool",
      features_title: "✨ Funktionen:",
      feature1: "✅ Unterstützung für mehrere Bildschirmverhältnisse, ideal für Social-Media-Sharing",
      feature2: "✅ Der Smart-Modus erkennt automatisch die Kanten von UI-Elementen",
      feature3: "✅ QR-Code-Erkennung und KI-Bildkonversation",
      feature4: "✅ Hintergrundentfernung mit einem Klick und intelligente Bildoptimierung",
      download: "👉 Jetzt herunterladen: https://puzzledu.com/shot"
    },
    // Toolbar-Texte
    toolbar: {
      saveArea: "Diesen Bereich speichern",
      copyToClipboard: "Kopieren",
      saveAllAreas: "Alle Bereiche speichern",
      keepAndContinue: "Behalten & Fortfahren",
      cancel: "Abbrechen",
      lockSize: "Größe sperren",
      lockSizeActive: "✓ Größe gesperrt",
      magnetic: "Magnetisches Einrasten",
      magneticActive: "✓ Magnetisches Einrasten",
      freeRatio: "Freies Seitenverhältnis",
      imageQuality: {
        original: "Originalqualität",
        high: "Hohe Qualität",
        standard: "Standard",
        light: "Leicht"
      },
      fileSizeEstimate: "Ungefähr {size} {unit}"
    },
    ratioGroups: {
      common: {
        label: "Gängige Seitenverhältnisse",
        options: {
          "16:9": "16:9 (Video/Bildschirm)",
          "4:3": "4:3 (Traditioneller Bildschirm)",
          "1:1": "1:1 (Quadrat/Instagram)"
        }
      },
      mobile: {
        label: "Mobil/Hochformat",
        options: {
          "9:16": "9:16 (Mobil Hochformat/Stories)",
          "3:4": "3:4 (Instagram/iPad)"
        }
      },
      social: {
        label: "Soziale Medien",
        options: {
          "2:1": "2:1 (Twitter Querformat)",
          "1:2": "1:2 (Pinterest)",
          "4:5": "4:5 (Instagram Hochformat)",
          "3:2": "3:2 (Social Cover)"
        }
      },
      other: {
        label: "Sonstige",
        options: {
          "21:9": "21:9 (Ultra-large)",
          "free": "Freies Seitenverhältnis"
        }
      }
    },
    // 选项页面翻译
    options: {
      title: "Precision Screenshot Settings",
      shortcuts_section: "Shortcut Settings",
      shortcuts_desc: "Configure shortcuts for common operations for more convenient use",
      shortcut_start: "Start Screenshot:",
      shortcut_confirm: "Confirm Screenshot:",
      shortcut_cancel: "Cancel Screenshot:",
      click_to_set: "Click to set shortcut",
      default_prefix: "Default:",
      clear: "Clear",
      save_shortcuts: "Save Shortcuts",
      reset_defaults: "Reset Defaults",
      shortcut_note: "Note: These shortcuts are used within the extension.",
      chrome_shortcut_note: "Chrome browser also provides shortcut configuration in the Extensions page.",
      extension_page: "Extensions page",
      api_section: "API Settings",
      glm4v_api: "Zhipu GLM-4V API Key:",
      deepseek_api: "DeepSeek API Key:",
      input_api_key: "Enter API key",
      save_api_settings: "Save API Settings", 
      about_section: "About",
      version_prefix: "Precision Screenshot version",
      rights_reserved: "All rights reserved.",
      feedback: "Feedback",
      privacy_policy: "Privacy Policy"
    },
    // popup设置链接文本
    settings_link: "Settings"
  },
  pt: {
    title: "Captura de Tela Precisa",
    tagline: "Captura precisa com um clique",
    description: "Reconhecimento inteligente de conteúdo web, capturas de tela com proporções predefinidas com um clique",
    startButton: "Iniciar Captura",
    capturing: "Capturando...",
    normalMode: "Modo Normal",
    inspectMode: "Modo Inteligente",
    ratioLabel: "Selecionar Proporção",
    formatLabel: "Formato de Salvamento",
    shortcuts: "Atalhos",
    openPopup: "Abrir Janela de Extensão",
    startScreenshot: "Iniciar Captura:",
    confirmScreenshot: "Confirmar Captura:",
    cancelScreenshot: "Cancelar Captura:",
    copyToClipboard: "Copiar:",
    commonRatios: "Proporções Comuns",
    mobileRatios: "Móvel/Retrato",
    socialMediaRatios: "Redes Sociais",
    otherRatios: "Outros",
    footer: "Captura de Tela Precisa v1.5 - Ferramenta Inteligente de Captura",
    // Textos da barra de ferramentas
    toolbar: {
      saveArea: "Salvar Esta Área",
      copyToClipboard: "Copiar",
      saveAllAreas: "Salvar Todas as Áreas",
      keepAndContinue: "Manter e Continuar",
      cancel: "Cancelar",
      lockSize: "Bloquear Tamanho",
      lockSizeActive: "✓ Tamanho Bloqueado",
      magnetic: "Ajuste Magnético",
      magneticActive: "✓ Ajuste Magnético",
      freeRatio: "Proporção Livre",
      imageQuality: {
        original: "Qualidade Original",
        high: "Alta Qualidade",
        standard: "Padrão",
        light: "Leve"
      },
      fileSizeEstimate: "Aproximadamente {size} {unit}"
    },
    ratioGroups: {
      common: {
        label: "Proporções Comuns",
        options: {
          "16:9": "16:9 (Vídeo/Tela)",
          "4:3": "4:3 (Tela Tradicional)",
          "1:1": "1:1 (Quadrado/Instagram)"
        }
      },
      mobile: {
        label: "Móvel/Retrato",
        options: {
          "9:16": "9:16 (Móvel Retrato/Stories)",
          "3:4": "3:4 (Instagram/iPad)"
        }
      },
      social: {
        label: "Redes Sociais",
        options: {
          "2:1": "2:1 (Twitter Paisagem)",
          "1:2": "1:2 (Pinterest)",
          "4:5": "4:5 (Instagram Retrato)",
          "3:2": "3:2 (Capa Social)"
        }
      },
      other: {
        label: "Outros",
        options: {
          "21:9": "21:9 (Ultralargo)",
          "free": "Proporção Livre"
        }
      }
    },
    // 标题提示文本
    titleTips: {
      aiDialog: "Ter uma conversa inteligente sobre o conteúdo da captura de tela",
      qrDecode: "Decodificar código QR na captura de tela",
      lockSize: "Bloquear tamanho atual para captura contínua",
      magnetic: "Ajuste automático às bordas dos elementos da página quando ativado",
      move: "Arrastar área de seleção (Espaço + arrastar)"
    },
    // 分享介绍文本
    shareIntroText: {
      title: "🔍 Captura de Tela Precisa | Ferramenta de Captura Inteligente e Eficiente",
      features_title: "✨ Características:",
      feature1: "✅ Suporte para múltiplas proporções de tela, ideal para compartilhamento em redes sociais",
      feature2: "✅ Modo inteligente reconhece automaticamente as bordas dos elementos da interface",
      feature3: "✅ Reconhecimento de código QR e conversas de imagem com IA",
      feature4: "✅ Remoção de fundo com um clique e otimização inteligente de imagem",
      download: "👉 Baixe agora: https://puzzledu.com/shot"
    },
    // 选项页面翻译
    options: {
      title: "Precision Screenshot Settings",
      shortcuts_section: "Shortcut Settings",
      shortcuts_desc: "Configure shortcuts for common operations for more convenient use",
      shortcut_start: "Start Screenshot:",
      shortcut_confirm: "Confirm Screenshot:",
      shortcut_cancel: "Cancel Screenshot:",
      click_to_set: "Click to set shortcut",
      default_prefix: "Default:",
      clear: "Clear",
      save_shortcuts: "Save Shortcuts",
      reset_defaults: "Reset Defaults",
      shortcut_note: "Note: These shortcuts are used within the extension.",
      chrome_shortcut_note: "Chrome browser also provides shortcut configuration in the Extensions page.",
      extension_page: "Extensions page",
      api_section: "API Settings",
      glm4v_api: "Zhipu GLM-4V API Key:",
      deepseek_api: "DeepSeek API Key:",
      input_api_key: "Enter API key",
      save_api_settings: "Save API Settings", 
      about_section: "About",
      version_prefix: "Precision Screenshot version",
      rights_reserved: "All rights reserved.",
      feedback: "Feedback",
      privacy_policy: "Privacy Policy"
    },
    // popup设置链接文本
    settings_link: "Settings"
  },
  ja: {
    title: "精密スクリーンショット",
    tagline: "スマートなスクリーンショット",
    description: "スマートなウェブコンテンツ認識、ワンクリックでプリセット比率のスクリーンショット",
    startButton: "スクリーンショットを開始",
    capturing: "キャプチャ中...",
    normalMode: "通常モード",
    inspectMode: "スマートモード",
    ratioLabel: "比率を選択",
    formatLabel: "保存形式",
    shortcuts: "ショートカット",
    openPopup: "拡張機能ポップアップを開く",
    startScreenshot: "スクリーンショット開始:",
    confirmScreenshot: "スクリーンショット確認:",
    cancelScreenshot: "スクリーンショットキャンセル:",
    copyToClipboard: "コピー:",
    commonRatios: "一般的な比率",
    mobileRatios: "モバイル/縦向き",
    socialMediaRatios: "ソーシャルメディア",
    otherRatios: "その他",
    footer: "精密スクリーンショット v1.5 - スマートスクリーンショットツール",
    // クイックアクションボタン
    quickActions_share: "シェアする",
    quickActions_feedback: "美を創造する",
    quickActions_shareSuccess: "共有テキストがクリップボードにコピーされました！",
    quickActions_shareFailed: "コピーに失敗しました、再試行してください",
    // ツールバーテキスト
    toolbar: {
      saveArea: "この領域を保存",
      copyToClipboard: "コピー",
      saveAllAreas: "すべての領域を保存",
      keepAndContinue: "保持して続行",
      cancel: "キャンセル",
      lockSize: "サイズをロック",
      lockSizeActive: "✓ サイズロック",
      magnetic: "マグネティックスナップ",
      magneticActive: "✓ マグネティックスナップ",
      freeRatio: "自由比率",
      imageQuality: {
        original: "オリジナル品質",
        high: "高品質",
        standard: "標準",
        light: "軽量"
      },
      fileSizeEstimate: "約 {size} {unit}"
    },
    ratioGroups: {
      common: {
        label: "一般的な比率",
        options: {
          "16:9": "16:9 (ビデオ/画面)",
          "4:3": "4:3 (従来の画面)",
          "1:1": "1:1 (正方形/Instagram)"
        }
      },
      mobile: {
        label: "モバイル/縦向き",
        options: {
          "9:16": "9:16 (モバイル縦向き/ストーリー)",
          "3:4": "3:4 (Instagram/iPad)"
        }
      },
      social: {
        label: "ソーシャルメディア",
        options: {
          "2:1": "2:1 (Twitter横向き)",
          "1:2": "1:2 (Pinterest)",
          "4:5": "4:5 (Instagram縦向き)",
          "3:2": "3:2 (ソーシャルカバー)"
        }
      },
      other: {
        label: "その他",
        options: {
          "21:9": "21:9 (ウルトラワイド)",
          "free": "自由比率"
        }
      }
    },
    // 标题提示文本
    titleTips: {
      aiDialog: "スクリーンショットの内容に対するインテリジェントな会話を続ける",
      qrDecode: "スクリーンショットのQRコードをデコード",
      lockSize: "連続キャプチャのために現在のサイズをロック",
      magnetic: "アクティブ化されるとページ要素の縁に自動的にスナップ",
      move: "選択領域をドラッグ (スペース + ドラッグ)"
    },
    // 选项页面翻译
    options: {
      title: "Precision Screenshot Settings",
      shortcuts_section: "Shortcut Settings",
      shortcuts_desc: "Configure shortcuts for common operations for more convenient use",
      shortcut_start: "Start Screenshot:",
      shortcut_confirm: "Confirm Screenshot:",
      shortcut_cancel: "Cancel Screenshot:",
      click_to_set: "Click to set shortcut",
      default_prefix: "Default:",
      clear: "Clear",
      save_shortcuts: "Save Shortcuts",
      reset_defaults: "Reset Defaults",
      shortcut_note: "Note: These shortcuts are used within the extension.",
      chrome_shortcut_note: "Chrome browser also provides shortcut configuration in the Extensions page.",
      extension_page: "Extensions page",
      api_section: "API Settings",
      glm4v_api: "Zhipu GLM-4V API Key:",
      deepseek_api: "DeepSeek API Key:",
      input_api_key: "Enter API key",
      save_api_settings: "Save API Settings", 
      about_section: "About",
      version_prefix: "Precision Screenshot version",
      rights_reserved: "All rights reserved.",
      feedback: "Feedback",
      privacy_policy: "Privacy Policy"
    },
    // popup设置链接文本
    settings_link: "Settings"
  },
  ko: {
    title: "정밀 스크린샷",
    tagline: "스마트한 스크린샷",
    description: "스마트 웹페이지 콘텐츠 인식, 원클릭 프리셋 비율 스크린샷",
    startButton: "스크린샷 시작",
    capturing: "캡처 중...",
    normalMode: "일반 모드",
    inspectMode: "스마트 모드",
    ratioLabel: "비율 선택",
    formatLabel: "저장 형식",
    shortcuts: "단축키",
    openPopup: "확장 팝업 열기",
    startScreenshot: "스크린샷 시작:",
    confirmScreenshot: "스크린샷 확인:",
    cancelScreenshot: "스크린샷 취소:",
    copyToClipboard: "복사:",
    commonRatios: "일반 비율",
    mobileRatios: "모바일/세로",
    socialMediaRatios: "소셜 미디어",
    otherRatios: "기타",
    footer: "정밀 스크린샷 v1.5 - 스마트 스크린샷 도구",
    // 빠른 액션 버튼
    quickActions_share: "공유하기",
    quickActions_feedback: "아름다움 창조",
    quickActions_shareSuccess: "공유 텍스트가 클립보드에 복사되었습니다!",
    quickActions_shareFailed: "복사 실패, 다시 시도하세요",
    // 툴바 텍스트
    toolbar: {
      saveArea: "이 영역 저장",
      copyToClipboard: "복사",
      saveAllAreas: "모든 영역 저장",
      keepAndContinue: "유지 및 계속",
      cancel: "취소",
      lockSize: "크기 잠금",
      lockSizeActive: "✓ 크기 잠금",
      magnetic: "자석 스냅",
      magneticActive: "✓ 자석 스냅",
      freeRatio: "자유 비율",
      imageQuality: {
        original: "원본 품질",
        high: "고품질",
        standard: "표준",
        light: "가벼움"
      },
      fileSizeEstimate: "약 {size} {unit}"
    },
    ratioGroups: {
      common: {
        label: "일반 비율",
        options: {
          "16:9": "16:9 (비디오/화면)",
          "4:3": "4:3 (전통적인 화면)",
          "1:1": "1:1 (정사각형/Instagram)"
        }
      },
      mobile: {
        label: "모바일/세로",
        options: {
          "9:16": "9:16 (모바일 세로/스토리)",
          "3:4": "3:4 (Instagram/iPad)"
        }
      },
      social: {
        label: "소셜 미디어",
        options: {
          "2:1": "2:1 (Twitter 가로)",
          "1:2": "1:2 (Pinterest)",
          "4:5": "4:5 (Instagram 세로)",
          "3:2": "3:2 (소셜 커버)"
        }
      },
      other: {
        label: "기타",
        options: {
          "21:9": "21:9 (울트라와이드)",
          "free": "자유 비율"
        }
      }
    },
    // 标题提示文本
    titleTips: {
      aiDialog: "스크린샷 내용에 대한 지능형 대화 나누기",
      qrDecode: "스크린샷의 QR 코드 해독",
      lockSize: "연속 캡처를 위한 현재 크기 잠금",
      magnetic: "활성화되면 페이지 요소 가장자리에 자동으로 스냅",
      move: "선택 영역 드래그 (스페이스 + 드래그)"
    },
    // 选项页面翻译
    options: {
      title: "Precision Screenshot Settings",
      shortcuts_section: "Shortcut Settings",
      shortcuts_desc: "Configure shortcuts for common operations for more convenient use",
      shortcut_start: "Start Screenshot:",
      shortcut_confirm: "Confirm Screenshot:",
      shortcut_cancel: "Cancel Screenshot:",
      click_to_set: "Click to set shortcut",
      default_prefix: "Default:",
      clear: "Clear",
      save_shortcuts: "Save Shortcuts",
      reset_defaults: "Reset Defaults",
      shortcut_note: "Note: These shortcuts are used within the extension.",
      chrome_shortcut_note: "Chrome browser also provides shortcut configuration in the Extensions page.",
      extension_page: "Extensions page",
      api_section: "API Settings",
      glm4v_api: "Zhipu GLM-4V API Key:",
      deepseek_api: "DeepSeek API Key:",
      input_api_key: "Enter API key",
      save_api_settings: "Save API Settings", 
      about_section: "About",
      version_prefix: "Precision Screenshot version",
      rights_reserved: "All rights reserved.",
      feedback: "Feedback",
      privacy_policy: "Privacy Policy"
    },
    // popup设置链接文本
    settings_link: "Settings"
  },
  pt_BR: {
    title: "Captura de Tela Precisa",
    tagline: "Captura precisa com um clique",
    description: "Reconhecimento inteligente de conteúdo web, capturas de tela com proporções predefinidas com um clique",
    startButton: "Iniciar Captura",
    capturing: "Capturando...",
    normalMode: "Modo Normal",
    inspectMode: "Modo Inteligente",
    ratioLabel: "Selecionar Proporção",
    formatLabel: "Formato de Salvamento",
    shortcuts: "Atalhos",
    openPopup: "Abrir Popup da Extensão",
    startScreenshot: "Iniciar Captura:",
    confirmScreenshot: "Confirmar Captura:",
    cancelScreenshot: "Cancelar Captura:",
    copyToClipboard: "Copiar:",
    commonRatios: "Proporções Comuns",
    mobileRatios: "Móvel/Retrato",
    socialMediaRatios: "Mídias Sociais",
    otherRatios: "Outros",
    footer: "Captura de Tela Precisa v1.5 - Ferramenta Inteligente de Captura",
    // Botões de ação rápida
    quickActions_share: "Compartilhar",
    quickActions_feedback: "Criar Beleza",
    quickActions_shareSuccess: "Texto de compartilhamento copiado para a área de transferência!",
    quickActions_shareFailed: "Falha ao copiar, tente novamente",
    // Textos da barra de ferramentas
    toolbar: {
      saveArea: "Salvar Esta Área",
      copyToClipboard: "Copiar",
      saveAllAreas: "Salvar Todas as Áreas",
      keepAndContinue: "Manter e Continuar",
      cancel: "Cancelar",
      lockSize: "Travar Tamanho",
      lockSizeActive: "✓ Tamanho Travado",
      magnetic: "Ajuste Magnético",
      magneticActive: "✓ Ajuste Magnético",
      freeRatio: "Proporção Livre",
      imageQuality: {
        original: "Qualidade Original",
        high: "Alta Qualidade",
        standard: "Padrão",
        light: "Leve"
      },
      fileSizeEstimate: "Aproximadamente {size} {unit}"
    },
    ratioGroups: {
      common: {
        label: "Proporções Comuns",
        options: {
          "16:9": "16:9 (Vídeo/Tela)",
          "4:3": "4:3 (Tela Tradicional)",
          "1:1": "1:1 (Quadrado/Instagram)"
        }
      },
      mobile: {
        label: "Móvel/Retrato",
        options: {
          "9:16": "9:16 (Celular Retrato/Stories)",
          "3:4": "3:4 (Instagram/iPad)"
        }
      },
      social: {
        label: "Mídias Sociais",
        options: {
          "2:1": "2:1 (Twitter Paisagem)",
          "1:2": "1:2 (Pinterest)",
          "4:5": "4:5 (Instagram Retrato)",
          "3:2": "3:2 (Capa Social)"
        }
      },
      other: {
        label: "Outros",
        options: {
          "21:9": "21:9 (Ultralargo)",
          "free": "Proporção Livre"
        }
      }
    },
    // 标题提示文本
    titleTips: {
      aiDialog: "Ter uma conversa inteligente sobre o conteúdo da captura de tela",
      qrDecode: "Decodificar código QR na captura de tela",
      lockSize: "Bloquear tamanho atual para captura contínua",
      magnetic: "Ajuste automático às bordas dos elementos da página quando ativado",
      move: "Arrastar área de seleção (Espaço + arrastar)"
    },
    // 选项页面翻译
    options: {
      title: "Precision Screenshot Settings",
      shortcuts_section: "Shortcut Settings",
      shortcuts_desc: "Configure shortcuts for common operations for more convenient use",
      shortcut_start: "Start Screenshot:",
      shortcut_confirm: "Confirm Screenshot:",
      shortcut_cancel: "Cancel Screenshot:",
      click_to_set: "Click to set shortcut",
      default_prefix: "Default:",
      clear: "Clear",
      save_shortcuts: "Save Shortcuts",
      reset_defaults: "Reset Defaults",
      shortcut_note: "Note: These shortcuts are used within the extension.",
      chrome_shortcut_note: "Chrome browser also provides shortcut configuration in the Extensions page.",
      extension_page: "Extensions page",
      api_section: "API Settings",
      glm4v_api: "Zhipu GLM-4V API Key:",
      deepseek_api: "DeepSeek API Key:",
      input_api_key: "Enter API key",
      save_api_settings: "Save API Settings", 
      about_section: "About",
      version_prefix: "Precision Screenshot version",
      rights_reserved: "All rights reserved.",
      feedback: "Feedback",
      privacy_policy: "Privacy Policy"
    },
    // popup设置链接文本
    settings_link: "Settings"
  }
};

// 获取当前语言
function getCurrentLanguage() {
  const uiLang = chrome.i18n.getUILanguage();
  if (uiLang.startsWith('zh')) return 'zh';
  if (uiLang.startsWith('es')) return 'es';
  if (uiLang.startsWith('ar')) return 'ar';
  if (uiLang.startsWith('de')) return 'de';
  if (uiLang.startsWith('pt')) return 'pt';
  if (uiLang.startsWith('ja')) return 'ja';
  if (uiLang.startsWith('fr')) return 'fr';
  if (uiLang.startsWith('ko')) return 'ko';
  return 'en';
}

// 获取翻译文本
function getText(key) {
  if (!key) return '';
  
  const currentLanguage = getCurrentLanguage();
  
  // 处理嵌套键，例如 "options.title"
  if (key.includes('.')) {
    const keys = key.split('.');
    let result = i18n[currentLanguage];
    
    // 逐层访问嵌套对象
    for (const k of keys) {
      if (result && typeof result[k] !== 'undefined') {
        result = result[k];
      } else {
        // 如果在当前语言中找不到，尝试使用英语
        result = null;
        break;
      }
    }
    
    if (result !== null) {
      return result;
    }
    
    // 尝试从英文中获取嵌套键
    result = i18n.en;
    for (const k of keys) {
      if (result && typeof result[k] !== 'undefined') {
        result = result[k];
      } else {
        // 如果在英语中也找不到
        return key; // 返回原始键
      }
    }
    
    return result;
  }
  
  // 非嵌套键的处理，增加健壮性检查
  if (i18n[currentLanguage] && typeof i18n[currentLanguage][key] !== 'undefined') {
    return i18n[currentLanguage][key];
  }
  
  // 如果在当前语言中找不到，尝试使用英语
  if (i18n.en && typeof i18n.en[key] !== 'undefined') {
    return i18n.en[key];
  }
  
  // 如果都找不到，返回键本身
  return key;
}

// 获取工具栏文本
function getToolbarText(key) {
  if (!key) return '';
  
  const currentLanguage = getCurrentLanguage();
  
  // 增加健壮性检查
  if (i18n[currentLanguage] && 
      i18n[currentLanguage].toolbar && 
      typeof i18n[currentLanguage].toolbar[key] !== 'undefined') {
    return i18n[currentLanguage].toolbar[key];
  }
  
  // 回退到英文
  if (i18n.en && 
      i18n.en.toolbar && 
      typeof i18n.en.toolbar[key] !== 'undefined') {
    return i18n.en.toolbar[key];
  }
  
  // 都找不到，返回键本身
  return key;
}

// 获取分享介绍文本
function getShareIntroText() {
  const currentLanguage = getCurrentLanguage();
  
  // 默认英文文本，确保即使翻译不完整也有回退选项
  const defaultText = {
    title: "🔍 Precision Screenshot | Efficient Smart Screenshot Tool",
    features_title: "✨ Features:",
    feature1: "✅ Support for multiple screen ratios, ideal for social media sharing",
    feature2: "✅ Smart mode automatically recognizes UI element edges",
    feature3: "✅ QR code recognition and AI image conversation",
    feature4: "✅ One-click background removal and smart image optimization",
    download: "👉 Download now: https://puzzledu.com/shot"
  };
  
  // 尝试获取当前语言的分享文本
  let text = defaultText;
  
  if (i18n[currentLanguage] && i18n[currentLanguage].shareIntroText) {
    // 使用当前语言文本，但为缺失部分使用默认文本
    text = {
      title: i18n[currentLanguage].shareIntroText.title || defaultText.title,
      features_title: i18n[currentLanguage].shareIntroText.features_title || defaultText.features_title,
      feature1: i18n[currentLanguage].shareIntroText.feature1 || defaultText.feature1,
      feature2: i18n[currentLanguage].shareIntroText.feature2 || defaultText.feature2,
      feature3: i18n[currentLanguage].shareIntroText.feature3 || defaultText.feature3,
      feature4: i18n[currentLanguage].shareIntroText.feature4 || defaultText.feature4,
      download: i18n[currentLanguage].shareIntroText.download || defaultText.download
    };
  } else if (i18n.en && i18n.en.shareIntroText) {
    // 如果当前语言没有分享文本，使用英文
    text = {
      title: i18n.en.shareIntroText.title || defaultText.title,
      features_title: i18n.en.shareIntroText.features_title || defaultText.features_title,
      feature1: i18n.en.shareIntroText.feature1 || defaultText.feature1,
      feature2: i18n.en.shareIntroText.feature2 || defaultText.feature2,
      feature3: i18n.en.shareIntroText.feature3 || defaultText.feature3,
      feature4: i18n.en.shareIntroText.feature4 || defaultText.feature4,
      download: i18n.en.shareIntroText.download || defaultText.download
    };
  }
  
  // 组合成完整的分享文本
  return (text.title || "") + "\n\n" + 
         (text.features_title || "") + "\n" + 
         (text.feature1 || "") + "\n" + 
         (text.feature2 || "") + "\n" + 
         (text.feature3 || "") + "\n" + 
         (text.feature4 || "") + "\n\n" + 
         (text.download || "");
}

// 获取比例组标签
function getRatioGroupLabel(groupKey) {
  const currentLanguage = getCurrentLanguage();
  
  // 增强健壮性检查，确保所有路径上的对象都存在
  if (i18n[currentLanguage] && 
      i18n[currentLanguage].ratioGroups && 
      i18n[currentLanguage].ratioGroups[groupKey] && 
      i18n[currentLanguage].ratioGroups[groupKey].label) {
    return i18n[currentLanguage].ratioGroups[groupKey].label;
  }
  
  // 回退到英文
  if (i18n.en && 
      i18n.en.ratioGroups && 
      i18n.en.ratioGroups[groupKey] && 
      i18n.en.ratioGroups[groupKey].label) {
    return i18n.en.ratioGroups[groupKey].label;
  }
  
  // 都找不到，返回原始键
  return groupKey;
}

// 获取比例选项文本
function getRatioOptionText(groupKey, ratioKey) {
  const currentLanguage = getCurrentLanguage();
  
  // 增强健壮性检查
  if (i18n[currentLanguage] && 
      i18n[currentLanguage].ratioGroups && 
      i18n[currentLanguage].ratioGroups[groupKey] && 
      i18n[currentLanguage].ratioGroups[groupKey].options && 
      i18n[currentLanguage].ratioGroups[groupKey].options[ratioKey]) {
    return i18n[currentLanguage].ratioGroups[groupKey].options[ratioKey];
  }
  
  // 回退到英文
  if (i18n.en && 
      i18n.en.ratioGroups && 
      i18n.en.ratioGroups[groupKey] && 
      i18n.en.ratioGroups[groupKey].options && 
      i18n.en.ratioGroups[groupKey].options[ratioKey]) {
    return i18n.en.ratioGroups[groupKey].options[ratioKey];
  }
  
  // 都找不到，返回原始键
  return ratioKey;
}

// 获取标题提示文本
function getTitleTip(key) {
  const currentLanguage = getCurrentLanguage();
  
  // 增强健壮性检查
  if (i18n[currentLanguage] && 
      i18n[currentLanguage].titleTips && 
      i18n[currentLanguage].titleTips[key]) {
    return i18n[currentLanguage].titleTips[key];
  }
  
  // 回退到英文
  if (i18n.en && 
      i18n.en.titleTips && 
      i18n.en.titleTips[key]) {
    return i18n.en.titleTips[key];
  }
  
  // 都找不到，返回原始键
  return key;
}

// 格式化文件大小估计
function formatFileSizeEstimate(size, unit) {
  const currentLanguage = getCurrentLanguage();
  
  // 增强健壮性检查
  let template = "About {size} {unit}"; // 默认模板
  
  if (i18n[currentLanguage] && 
      i18n[currentLanguage].toolbar && 
      i18n[currentLanguage].toolbar.fileSizeEstimate) {
    template = i18n[currentLanguage].toolbar.fileSizeEstimate;
  } else if (i18n.en && 
             i18n.en.toolbar && 
             i18n.en.toolbar.fileSizeEstimate) {
    template = i18n.en.toolbar.fileSizeEstimate;
  }
  
  return template.replace("{size}", size).replace("{unit}", unit);
}

// 更新所有带有data-i18n属性的元素的文本
function updateI18nTexts() {
  // 更新普通文本
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = getText(key);
  });

  // 更新placeholder属性
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    element.placeholder = getText(key);
  });

  // 更新比例选择器的组标签和选项
  const ratioSelect = document.getElementById('ratio-select');
  if (ratioSelect) {
    ratioSelect.querySelectorAll('optgroup').forEach(group => {
      const groupKey = group.getAttribute('data-group');
      group.label = getRatioGroupLabel(groupKey);
      
      group.querySelectorAll('option').forEach(option => {
        const optionKey = option.getAttribute('data-option');
        option.textContent = getRatioOptionText(groupKey, optionKey);
      });
    });
  }
}

// 获取长截图配置文本
function getScrollScreenshotConfigText(key) {
  const currentLanguage = getCurrentLanguage();
  
  // 尝试获取当前语言的长截图配置文本
  if (i18n[currentLanguage] && 
      i18n[currentLanguage].scrollScreenshotConfig && 
      typeof i18n[currentLanguage].scrollScreenshotConfig[key] !== 'undefined') {
    return i18n[currentLanguage].scrollScreenshotConfig[key];
  }
  
  // 回退到英文
  if (i18n.en && 
      i18n.en.scrollScreenshotConfig && 
      typeof i18n.en.scrollScreenshotConfig[key] !== 'undefined') {
    return i18n.en.scrollScreenshotConfig[key];
  }
  
  // 都找不到，返回键本身
  return key;
}

// 导出函数
export { 
  getCurrentLanguage, 
  getText, 
  getToolbarText,
  getShareIntroText,
  getTitleTip,
  getRatioGroupLabel, 
  getRatioOptionText,
  formatFileSizeEstimate,
  getScrollScreenshotConfigText,
  updateI18nTexts
}; 