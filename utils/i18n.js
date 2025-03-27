// 语言配置
const i18n = {
  zh: {
    title: "精准截图",
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
    copyToClipboard: "复制:",
    commonRatios: "常用比例",
    mobileRatios: "手机/竖屏",
    socialMediaRatios: "社交媒体",
    otherRatios: "其他",
    footer: "精准截图 v1.5 - 一键智能精准截图",
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
      imageQuality: {
        original: "原图质量",
        high: "高清",
        standard: "标准",
        light: "轻量"
      },
      fileSizeEstimate: "约 {size} {unit}"
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
    }
  },
  en: {
    title: "Precision Screenshot",
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
    copyToClipboard: "Copy:",
    commonRatios: "Common Ratios",
    mobileRatios: "Mobile/Portrait",
    socialMediaRatios: "Social Media",
    otherRatios: "Others",
    footer: "Precision Screenshot v1.5 - Smart Screenshot Tool",
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
      imageQuality: {
        original: "Original Quality",
        high: "High Quality",
        standard: "Standard",
        light: "Light"
      },
      fileSizeEstimate: "About {size} {unit}"
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
    }
  },
  es: {
    title: "Captura de Pantalla Precisa",
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
    }
  },
  ar: {
    title: "لقطة شاشة دقيقة",
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
    }
  },
  de: {
    title: "Präzisions-Screenshot",
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
    // Toolbar-Texte
    toolbar: {
      saveArea: "Diesen Bereich speichern",
      copyToClipboard: "Kopieren",
      saveAllAreas: "Alle Bereiche speichern",
      keepAndContinue: "Beibehalten und fortfahren",
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
      fileSizeEstimate: "Etwa {size} {unit}"
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
          "3:2": "3:2 (Social Media Cover)"
        }
      },
      other: {
        label: "Sonstige",
        options: {
          "21:9": "21:9 (Ultrabreit)",
          "free": "Freies Seitenverhältnis"
        }
      }
    }
  },
  pt: {
    title: "Captura de Tela Precisa",
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
    }
  },
  ja: {
    title: "精密スクリーンショット",
    description: "ウェブページの内容をスマートに認識し、ワンクリックで設定比率のスクリーンショットを撮影",
    startButton: "スクリーンショット開始",
    capturing: "キャプチャ中...",
    normalMode: "通常モード",
    inspectMode: "スマートモード",
    ratioLabel: "比率を選択",
    formatLabel: "保存形式",
    shortcuts: "ショートカット",
    openPopup: "拡張ポップアップを開く",
    startScreenshot: "スクリーンショット開始:",
    confirmScreenshot: "スクリーンショット確認:",
    cancelScreenshot: "スクリーンショットキャンセル:",
    copyToClipboard: "コピー:",
    commonRatios: "一般的な比率",
    mobileRatios: "モバイル/縦向き",
    socialMediaRatios: "ソーシャルメディア",
    otherRatios: "その他",
    footer: "精密スクリーンショット v1.5 - スマートスクリーンショットツール",
    // ツールバーテキスト
    toolbar: {
      saveArea: "この領域を保存",
      copyToClipboard: "コピー",
      saveAllAreas: "すべての領域を保存",
      keepAndContinue: "保持して続行",
      cancel: "キャンセル",
      lockSize: "サイズをロック",
      lockSizeActive: "✓ サイズロック中",
      magnetic: "マグネットスナップ",
      magneticActive: "✓ マグネットスナップ",
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
          "16:9": "16:9 (ビデオ/スクリーン)",
          "4:3": "4:3 (従来のスクリーン)",
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
    }
  },
  fr: {
    title: "Capture d'Écran Précise",
    description: "Reconnaissance intelligente du contenu web, captures d'écran avec proportions prédéfinies en un clic",
    startButton: "Démarrer la Capture",
    capturing: "Capture en cours...",
    normalMode: "Mode Normal",
    inspectMode: "Mode Intelligent",
    ratioLabel: "Sélectionner le Ratio",
    formatLabel: "Format de Sauvegarde",
    shortcuts: "Raccourcis",
    openPopup: "Ouvrir la Fenêtre d'Extension",
    startScreenshot: "Démarrer la Capture:",
    confirmScreenshot: "Confirmer la Capture:",
    cancelScreenshot: "Annuler la Capture:",
    copyToClipboard: "Copier:",
    commonRatios: "Ratios Courants",
    mobileRatios: "Mobile/Portrait",
    socialMediaRatios: "Réseaux Sociaux",
    otherRatios: "Autres",
    footer: "Capture d'Écran Précise v1.5 - Outil de Capture Intelligent",
    // Textes de la barre d'outils
    toolbar: {
      saveArea: "Enregistrer Cette Zone",
      copyToClipboard: "Copier",
      saveAllAreas: "Enregistrer Toutes les Zones",
      keepAndContinue: "Conserver et Continuer",
      cancel: "Annuler",
      lockSize: "Verrouiller la Taille",
      lockSizeActive: "✓ Taille Verrouillée",
      magnetic: "Accrochage Magnétique",
      magneticActive: "✓ Accrochage Magnétique",
      freeRatio: "Ratio Libre",
      imageQuality: {
        original: "Qualité Originale",
        high: "Haute Qualité",
        standard: "Standard",
        light: "Légère"
      },
      fileSizeEstimate: "Environ {size} {unit}"
    },
    ratioGroups: {
      common: {
        label: "Ratios Courants",
        options: {
          "16:9": "16:9 (Vidéo/Écran)",
          "4:3": "4:3 (Écran Traditionnel)",
          "1:1": "1:1 (Carré/Instagram)"
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
        label: "Réseaux Sociaux",
        options: {
          "2:1": "2:1 (Twitter Paysage)",
          "1:2": "1:2 (Pinterest)",
          "4:5": "4:5 (Instagram Portrait)",
          "3:2": "3:2 (Couverture Sociale)"
        }
      },
      other: {
        label: "Autres",
        options: {
          "21:9": "21:9 (Ultra-large)",
          "free": "Ratio Libre"
        }
      }
    }
  },
  ko: {
    title: "정밀 스크린샷",
    description: "웹 페이지 콘텐츠 스마트 인식, 원클릭 프리셋 비율 스크린샷",
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
    // 툴바 텍스트
    toolbar: {
      saveArea: "이 영역 저장",
      copyToClipboard: "복사",
      saveAllAreas: "모든 영역 저장",
      keepAndContinue: "유지 및 계속",
      cancel: "취소",
      lockSize: "크기 잠금",
      lockSizeActive: "✓ 크기 잠금됨",
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
          "1:1": "1:1 (정사각형/인스타그램)"
        }
      },
      mobile: {
        label: "모바일/세로",
        options: {
          "9:16": "9:16 (모바일 세로/스토리)",
          "3:4": "3:4 (인스타그램/아이패드)"
        }
      },
      social: {
        label: "소셜 미디어",
        options: {
          "2:1": "2:1 (트위터 가로)",
          "1:2": "1:2 (핀터레스트)",
          "4:5": "4:5 (인스타그램 세로)",
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
    }
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
  const lang = getCurrentLanguage();
  
  // 处理嵌套的键，例如 "toolbar.saveArea"
  if (key.includes('.')) {
    const parts = key.split('.');
    let value = i18n[lang];
    
    for (const part of parts) {
      if (value && value[part] !== undefined) {
        value = value[part];
      } else {
        value = null;
        break;
      }
    }
    
    if (value) return value;
    
    // 如果在当前语言中找不到，尝试韩语（如果当前语言不是韩语）
    if (lang !== 'ko') {
      value = i18n['ko'];
      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          value = null;
          break;
        }
      }
      
      if (value) return value;
    }
    
    // 如果在当前语言和韩语中都找不到，尝试法语（如果当前语言不是法语）
    if (lang !== 'fr') {
      value = i18n['fr'];
      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          value = null;
          break;
        }
      }
      
      if (value) return value;
    }
    
    // 如果在当前语言、韩语和法语中都找不到，尝试日语（如果当前语言不是日语）
    if (lang !== 'ja') {
      value = i18n['ja'];
      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          value = null;
          break;
        }
      }
      
      if (value) return value;
    }
    
    // 如果在当前语言、韩语、法语和日语中都找不到，尝试葡萄牙语（如果当前语言不是葡萄牙语）
    if (lang !== 'pt') {
      value = i18n['pt'];
      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          value = null;
          break;
        }
      }
      
      if (value) return value;
    }
    
    // 如果在当前语言、韩语、法语、日语和葡萄牙语中都找不到，尝试德语（如果当前语言不是德语）
    if (lang !== 'de') {
      value = i18n['de'];
      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          value = null;
          break;
        }
      }
      
      if (value) return value;
    }
    
    // 如果在当前语言、韩语、法语、日语、葡萄牙语和德语中都找不到，尝试阿拉伯语（如果当前语言不是阿拉伯语）
    if (lang !== 'ar') {
      value = i18n['ar'];
      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          value = null;
          break;
        }
      }
      
      if (value) return value;
    }
    
    // 如果在当前语言、韩语、法语、日语、葡萄牙语、德语和阿拉伯语中都找不到，尝试西班牙语（如果当前语言不是西班牙语）
    if (lang !== 'es') {
      value = i18n['es'];
      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          value = null;
          break;
        }
      }
      
      if (value) return value;
    }
    
    // 如果在所有语言中都找不到，尝试英语
    value = i18n['en'];
    for (const part of parts) {
      if (value && value[part] !== undefined) {
        value = value[part];
      } else {
        return key; // 如果英语中也没有，返回原始键
      }
    }
    
    return value;
  }
  
  return i18n[lang][key] || 
         (lang !== 'ko' && i18n['ko'][key]) ||
         (lang !== 'fr' && i18n['fr'][key]) ||
         (lang !== 'ja' && i18n['ja'][key]) ||
         (lang !== 'pt' && i18n['pt'][key]) || 
         (lang !== 'de' && i18n['de'][key]) || 
         (lang !== 'ar' && i18n['ar'][key]) || 
         (lang !== 'es' && i18n['es'][key]) || 
         i18n['en'][key] || 
         key;
}

// 获取工具栏文本
function getToolbarText(key) {
  return getText(`toolbar.${key}`);
}

// 获取比例组标签
function getRatioGroupLabel(groupKey) {
  const lang = getCurrentLanguage();
  return i18n[lang].ratioGroups[groupKey].label || i18n['en'].ratioGroups[groupKey].label || groupKey;
}

// 获取比例选项文本
function getRatioOptionText(groupKey, ratioKey) {
  const lang = getCurrentLanguage();
  return i18n[lang].ratioGroups[groupKey].options[ratioKey] || 
         i18n['en'].ratioGroups[groupKey].options[ratioKey] || 
         ratioKey;
}

// 格式化文件大小估计
function formatFileSizeEstimate(size, unit) {
  const template = getText('toolbar.fileSizeEstimate');
  return template.replace('{size}', size).replace('{unit}', unit);
}

// 导出函数
export { 
  getCurrentLanguage, 
  getText, 
  getToolbarText,
  getRatioGroupLabel, 
  getRatioOptionText,
  formatFileSizeEstimate
}; 