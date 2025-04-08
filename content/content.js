// 简化版内容脚本 - 保留按精准截图和连续截图功能
'use strict';

// 使用全局变量保存实例
var ratioScreenshotInstance = window.ratioScreenshotInstance || null;

// 避免重复初始化
if (window._ratioScreenshotLoaded) {
  console.log("精准截图工具已加载");
  
  // 如果页面已经有实例但出现问题，尝试重置
  if (ratioScreenshotInstance) {
    try {
      console.log("重置现有实例");
      ratioScreenshotInstance.cleanupExistingElements();
    } catch (e) {
      console.error("重置实例时出错:", e);
    }
  }
} else {
  window._ratioScreenshotLoaded = true;
  
  // 创建一个i18n辅助函数，在content.js内部使用，避免导入模块
  var I18nHelper = {
    language: navigator.language || navigator.userLanguage,
    
    getCurrentLanguage: function() {
      var lang = this.language || '';
      if (lang.indexOf('zh') === 0) return 'zh';
      if (lang.indexOf('es') === 0) return 'es';
      if (lang.indexOf('ar') === 0) return 'ar';
      if (lang.indexOf('de') === 0) return 'de';
      if (lang.indexOf('pt') === 0) return 'pt';
      if (lang.indexOf('ja') === 0) return 'ja';
      if (lang.indexOf('fr') === 0) return 'fr';
      if (lang.indexOf('ko') === 0) return 'ko';
      return 'en';
    },
    
    isZh: function() {
      return this.getCurrentLanguage() === 'zh';
    },
    
    getToolbarText: function(key) {
      var translations = {
        zh: {
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
          qualityLabel: "图片质量",
          ratioLabel: "选择比例",
          aiDialog: "智能对话",
          imageQuality: {
            original: "原图质量",
            high: "高清",
            standard: "标准",
            light: "轻量"
          },
          fileSizeEstimate: "约 {0} {1}",
          qrDecode: "解析二维码",
          qrDecoding: "正在解析二维码...",
          qrSuccess: "二维码解析成功，已复制到剪贴板",
          qrNoQRFound: "未检测到有效的二维码",
          qrError: "二维码解析失败: {0}"
        },
        en: {
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
          qualityLabel: "Image Quality",
          ratioLabel: "Select Ratio",
          aiDialog: "AI Chat",
          imageQuality: {
            original: "Original Quality",
            high: "High Quality",
            standard: "Standard",
            light: "Light"
          },
          fileSizeEstimate: "About {0} {1}",
          qrDecode: "Decode QR",
          qrDecoding: "Decoding QR code...",
          qrSuccess: "QR code decoded successfully, copied to clipboard",
          qrNoQRFound: "No valid QR code detected",
          qrError: "QR code decoding failed: {0}"
        },
        es: {
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
          qualityLabel: "Calidad de Imagen",
          ratioLabel: "Seleccionar Proporción",
          aiDialog: "Chat de IA",
          imageQuality: {
            original: "Calidad Original",
            high: "Alta Calidad",
            standard: "Estándar",
            light: "Ligera"
          },
          fileSizeEstimate: "Aproximadamente {0} {1}",
          qrDecode: "Decodificar código QR",
          qrDecoding: "Decodificando código QR...",
          qrSuccess: "Código QR decodificado correctamente, copiado al portapapeles",
          qrNoQRFound: "No se detectó un código QR válido",
          qrError: "Error al decodificar código QR: {0}"
        },
        ar: {
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
          qualityLabel: "جودة الصورة",
          ratioLabel: "اختيار النسبة",
          aiDialog: "محادثة الذكاء الاصطناعي",
          imageQuality: {
            original: "الجودة الأصلية",
            high: "جودة عالية",
            standard: "قياسية",
            light: "خفيفة"
          },
          fileSizeEstimate: "تقريبًا {0} {1}",
          qrDecode: "فك رمز QR",
          qrDecoding: "فك رمز QR...",
          qrSuccess: "تم فك رمز QR بنجاح، تم نسخه إلى الملصق",
          qrNoQRFound: "لم يتم الكشف عن رمز QR صالح",
          qrError: "فشل فك رمز QR: {0}"
        },
        de: {
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
          qualityLabel: "Bildqualität",
          ratioLabel: "Seitenverhältnis wählen",
          aiDialog: "KI Chat",
          imageQuality: {
            original: "Originalqualität",
            high: "Hohe Qualität",
            standard: "Standard",
            light: "Leicht"
          },
          fileSizeEstimate: "Etwa {0} {1}",
          qrDecode: "QR-Code dekodieren",
          qrDecoding: "QR-Code wird decodiert...",
          qrSuccess: "QR-Code erfolgreich dekodiert, in die Zwischenablage kopiert",
          qrNoQRFound: "Kein gültiges QR-Code erkannt",
          qrError: "QR-Code-Dekodierung fehlgeschlagen: {0}"
        },
        pt: {
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
          qualityLabel: "Qualidade de Imagem",
          ratioLabel: "Selecionar Proporção",
          aiDialog: "Chat de IA",
          imageQuality: {
            original: "Qualidade Original",
            high: "Alta Qualidade",
            standard: "Padrão",
            light: "Leve"
          },
          fileSizeEstimate: "Aproximadamente {0} {1}",
          qrDecode: "Decodificar QR Code",
          qrDecoding: "Decodificando QR Code...",
          qrSuccess: "QR Code decodificado com sucesso, copiado para a área de transferência",
          qrNoQRFound: "Nenhum QR Code válido detectado",
          qrError: "Falha ao decodificar QR Code: {0}"
        },
        ja: {
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
          qualityLabel: "画像品質",
          ratioLabel: "比率を選択",
          aiDialog: "AIチャット",
          imageQuality: {
            original: "オリジナル品質",
            high: "高品質",
            standard: "標準",
            light: "軽量"
          },
          fileSizeEstimate: "約 {0} {1}",
          qrDecode: "QRコードを解析",
          qrDecoding: "QRコードを解析中...",
          qrSuccess: "QRコードが正常に解析されました、クリップボードにコピーされました",
          qrNoQRFound: "有効なQRコードが検出されませんでした",
          qrError: "QRコードの解析に失敗しました: {0}"
        },
        fr: {
          saveArea: "Enregistrer Cette Zone",
          copyToClipboard: "Copier",
          saveAllAreas: "Enregistrer Toutes les Zones",
          keepAndContinue: "Conserver et Continuer",
          cancel: "Annuler",
          lockSize: "Verrouiller la Taille",
          lockSizeActive: "✓ Taille Verrouillée",
          magnetic: "Attraction Magnétique",
          magneticActive: "✓ Attraction Magnétique",
          freeRatio: "Ratio Libre",
          qualityLabel: "Qualité d'Image",
          ratioLabel: "Sélectionner le Ratio",
          aiDialog: "Chat IA",
          imageQuality: {
            original: "Qualité Originale",
            high: "Haute Qualité",
            standard: "Standard",
            light: "Légère"
          },
          fileSizeEstimate: "Environ {0} {1}",
          qrDecode: "Décoder le QR Code",
          qrDecoding: "Décodage du QR Code...",
          qrSuccess: "QR Code décodé avec succès, copié dans le presse-papiers",
          qrNoQRFound: "Aucun QR Code valide détecté",
          qrError: "Échec du décodage du QR Code: {0}"
        },
        ko: {
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
          qualityLabel: "이미지 품질",
          ratioLabel: "비율 선택",
          aiDialog: "AI 채팅",
          imageQuality: {
            original: "원본 품질",
            high: "고품질",
            standard: "표준",
            light: "가벼운"
          },
          fileSizeEstimate: "약 {0} {1}",
          qrDecode: "QR 코드 해독",
          qrDecoding: "QR 코드 해독중...",
          qrSuccess: "QR 코드가 성공적으로 해독되었습니다, 클립보드에 복사되었습니다",
          qrNoQRFound: "유효한 QR 코드를 감지하지 못했습니다",
          qrError: "QR 코드 해독에 실패했습니다: {0}"
        }
      };
      
      var lang = this.getCurrentLanguage();
      
      // 处理嵌套的键，如 "imageQuality.original"
      if (key.indexOf('.') > -1) {
        var parts = key.split('.');
        var value = translations[lang];
        
        for (var i = 0; i < parts.length; i++) {
          var part = parts[i];
          if (value && value[part] !== undefined) {
            value = value[part];
          } else {
            value = null;
            break;
          }
        }
        
        if (value) return value;
        
        // 回退逻辑，尝试其他语言
        if (lang !== 'fr') {
          value = translations['fr'];
          for (var j = 0; j < parts.length; j++) {
            var frPart = parts[j];
            if (value && value[frPart] !== undefined) {
              value = value[frPart];
            } else {
              value = null;
              break;
            }
          }
          if (value) return value;
        }
        
        if (lang !== 'ja') {
          value = translations['ja'];
          for (var j = 0; j < parts.length; j++) {
            var jaPart = parts[j];
            if (value && value[jaPart] !== undefined) {
              value = value[jaPart];
            } else {
              value = null;
              break;
            }
          }
          if (value) return value;
        }
        
        if (lang !== 'de') {
          value = translations['de'];
          for (var j = 0; j < parts.length; j++) {
            var dePart = parts[j];
            if (value && value[dePart] !== undefined) {
              value = value[dePart];
            } else {
              value = null;
              break;
            }
          }
          if (value) return value;
        }
        
        if (lang !== 'ar') {
          value = translations['ar'];
          for (var j = 0; j < parts.length; j++) {
            var arPart = parts[j];
            if (value && value[arPart] !== undefined) {
              value = value[arPart];
            } else {
              value = null;
              break;
            }
          }
          if (value) return value;
        }
        
        if (lang !== 'es') {
          value = translations['es'];
          for (var j = 0; j < parts.length; j++) {
            var esPart = parts[j];
            if (value && value[esPart] !== undefined) {
              value = value[esPart];
            } else {
              value = null;
              break;
            }
          }
          if (value) return value;
        }
        
        // 最后尝试英文
        value = translations['en'];
        for (var j = 0; j < parts.length; j++) {
          var enPart = parts[j];
          if (value && value[enPart] !== undefined) {
            value = value[enPart];
          } else {
            return key;
          }
        }
        
        return value;
      }
      
      return translations[lang][key] || 
        (lang !== 'fr' && translations['fr'][key]) ||
        (lang !== 'ja' && translations['ja'][key]) ||
        (lang !== 'de' && translations['de'][key]) || 
        (lang !== 'ar' && translations['ar'][key]) || 
        (lang !== 'es' && translations['es'][key]) || 
        translations['en'][key] || 
        key;
    },
    
    formatFileSizeEstimate: function(size, unit) {
      var template = this.getToolbarText('fileSizeEstimate');
      return template.replace('{0}', size).replace('{1}', unit);
    },
    
    // 获取通知信息的翻译
    getNotificationText: function(key) {
      var notifications = {
        zh: {
          processingScreenshot: "正在处理截图...",
          screenshotSaved: "截图已保存到下载文件夹",
          screenshotLoadFailed: "截图加载失败，请重试",
          getScreenshotFailed: "获取屏幕截图失败，请重试",
          processingAllAreas: "正在处理所有区域的截图...",
          allAreasSaved: "成功保存了 {0} 个区域的截图",
          areaNotVisible: "选定区域几乎完全在可见范围外，无法截图",
          partiallyVisible: "部分区域超出可见范围，已截取可见部分",
          partiallyVisibleArea: "部分选择区域超出可见范围，已截取可见部分",
          areaOutOfView: "选定区域超出可见范围，无法截图。请滚动页面使该区域可见后再试。",
          processingError: "截图处理时出错: {0}",
          saveFailed: "保存截图失败: {0}",
          smartModeEnabled: "已启用智能截图模式，点击选择要截图的元素 (Enter确认, Esc取消)",
          processing: "正在处理复制...",
          copyFailed: "复制失败: {0}",
          canvasContextError: "复制失败: 无法获取Canvas上下文",
          copied: "已复制到剪贴板",
          clipboardAccessDenied: "复制失败: 剪贴板访问被拒绝",
          clipboardApiNotSupported: "复制失败: 不支持剪贴板API",
          imageDataCreateFailed: "复制失败: 无法创建图像数据",
          copyAreaOutOfView: "复制失败: 选择区域超出可见范围",
          imagePreviewShown: "已显示图像预览，请右键复制",
          escape: "取消 (Esc)",
          imageQualitySet: "图片质量已设置为: {0}",
          qrDecoding: "正在解析二维码...",
          qrSuccess: "二维码解析成功，已复制到剪贴板",
          qrNoQRFound: "未检测到有效的二维码",
          qrError: "二维码解析失败: {0}"
        },
        en: {
          processingScreenshot: "Processing screenshot...",
          screenshotSaved: "Screenshot saved to downloads folder",
          screenshotLoadFailed: "Screenshot loading failed, please try again",
          getScreenshotFailed: "Failed to capture screenshot, please try again",
          processingAllAreas: "Processing screenshots for all areas...",
          allAreasSaved: "Successfully saved screenshots of {0} areas",
          areaNotVisible: "Selected area is almost completely out of view, cannot capture",
          partiallyVisible: "Part of the area is out of view, captured visible portion only",
          partiallyVisibleArea: "Part of the selection is out of view, captured visible portion only",
          areaOutOfView: "Selected area is out of view. Please scroll to make it visible and try again.",
          processingError: "Error processing screenshot: {0}",
          saveFailed: "Failed to save screenshot: {0}",
          smartModeEnabled: "Smart screenshot mode enabled, click to select an element (Enter to confirm, Esc to cancel)",
          processing: "Processing copy...",
          copyFailed: "Copy failed: {0}",
          canvasContextError: "Copy failed: Cannot get Canvas context",
          copied: "Copied to clipboard",
          clipboardAccessDenied: "Copy failed: Clipboard access denied",
          clipboardApiNotSupported: "Copy failed: Clipboard API not supported",
          imageDataCreateFailed: "Copy failed: Cannot create image data",
          copyAreaOutOfView: "Copy failed: Selected area is out of view",
          imagePreviewShown: "Image preview shown, right-click to copy",
          escape: "Cancel (Esc)",
          imageQualitySet: "Image quality set to: {0}",
          qrDecoding: "Decoding QR code...",
          qrSuccess: "QR code decoded successfully, copied to clipboard",
          qrNoQRFound: "No valid QR code detected",
          qrError: "QR code decoding failed: {0}"
        },
        es: {
          processingScreenshot: "Procesando captura...",
          screenshotSaved: "Captura guardada en la carpeta de descargas",
          screenshotLoadFailed: "Error al cargar la captura, por favor intente de nuevo",
          getScreenshotFailed: "Error al capturar la pantalla, por favor intente de nuevo",
          processingAllAreas: "Procesando capturas para todas las áreas...",
          allAreasSaved: "Se guardaron correctamente las capturas de {0} áreas",
          areaNotVisible: "El área seleccionada está casi completamente fuera de vista, no se puede capturar",
          partiallyVisible: "Parte del área está fuera de vista, se capturó solo la porción visible",
          partiallyVisibleArea: "Parte de la selección está fuera de vista, se capturó solo la porción visible",
          areaOutOfView: "El área seleccionada está fuera de vista. Por favor, desplácese para hacerla visible e inténtelo de nuevo.",
          processingError: "Error al procesar la captura: {0}",
          saveFailed: "Error al guardar la captura: {0}",
          smartModeEnabled: "Modo de captura inteligente activado, haga clic para seleccionar un elemento (Enter para confirmar, Esc para cancelar)",
          processing: "Procesando copia...",
          copyFailed: "Error al copiar: {0}",
          canvasContextError: "Error al copiar: No se puede obtener el contexto del Canvas",
          copied: "Copiado al portapapeles",
          clipboardAccessDenied: "Error al copiar: Acceso al portapapeles denegado",
          clipboardApiNotSupported: "Error al copiar: API de portapapeles no compatible",
          imageDataCreateFailed: "Error al copiar: No se pueden crear datos de imagen",
          copyAreaOutOfView: "Error al copiar: El área seleccionada está fuera de vista",
          imagePreviewShown: "Vista previa de imagen mostrada, haga clic derecho para copiar",
          escape: "Cancelar (Esc)",
          imageQualitySet: "Calidad de imagen establecida en: {0}",
          qrDecoding: "Decodificando código QR...",
          qrSuccess: "Código QR decodificado correctamente, copiado al portapapeles",
          qrNoQRFound: "No se detectó un código QR válido",
          qrError: "Error al decodificar código QR: {0}"
        },
        ar: {
          processingScreenshot: "جاري معالجة اللقطة...",
          screenshotSaved: "تم حفظ اللقطة في مجلد التنزيلات",
          screenshotLoadFailed: "فشل تحميل اللقطة، يرجى المحاولة مرة أخرى",
          getScreenshotFailed: "فشل التقاط اللقطة، يرجى المحاولة مرة أخرى",
          processingAllAreas: "جاري معالجة لقطات لجميع المناطق...",
          allAreasSaved: "تم حفظ لقطات لـ {0} مناطق بنجاح",
          areaNotVisible: "المنطقة المحددة خارج نطاق الرؤية تقريبًا، لا يمكن الالتقاط",
          partiallyVisible: "جزء من المنطقة خارج نطاق الرؤية، تم التقاط الجزء المرئي فقط",
          partiallyVisibleArea: "جزء من المنطقة المحددة خارج نطاق الرؤية، تم التقاط الجزء المرئي فقط",
          areaOutOfView: "المنطقة المحددة خارج نطاق الرؤية. يرجى التمرير لجعلها مرئية والمحاولة مرة أخرى.",
          processingError: "خطأ في معالجة اللقطة: {0}",
          saveFailed: "فشل حفظ اللقطة: {0}",
          smartModeEnabled: "تم تمكين وضع اللقطة الذكي، انقر لتحديد عنصر (Enter للتأكيد، Esc للإلغاء)",
          processing: "جاري معالجة النسخ...",
          copyFailed: "فشل النسخ: {0}",
          canvasContextError: "فشل النسخ: لا يمكن الحصول على سياق الرسم",
          copied: "تم النسخ إلى الحافظة",
          clipboardAccessDenied: "فشل النسخ: تم رفض الوصول إلى الحافظة",
          clipboardApiNotSupported: "فشل النسخ: واجهة برمجة الحافظة غير مدعومة",
          imageDataCreateFailed: "فشل النسخ: لا يمكن إنشاء بيانات الصورة",
          copyAreaOutOfView: "فشل النسخ: المنطقة المحددة خارج نطاق الرؤية",
          imagePreviewShown: "تم عرض معاينة الصورة، انقر بزر الماوس الأيمن للنسخ",
          escape: "إلغاء (Esc)",
          imageQualitySet: "تم ضبط جودة الصورة على: {0}",
          qrDecoding: "فك رمز QR...",
          qrSuccess: "تم فك رمز QR بنجاح، تم نسخه إلى الملصق",
          qrNoQRFound: "لم يتم الكشف عن رمز QR صالح",
          qrError: "فشل فك رمز QR: {0}"
        },
        de: {
          processingScreenshot: "Screenshot wird verarbeitet...",
          screenshotSaved: "Screenshot im Download-Ordner gespeichert",
          screenshotLoadFailed: "Screenshot-Laden fehlgeschlagen, bitte versuchen Sie es erneut",
          getScreenshotFailed: "Screenshot-Aufnahme fehlgeschlagen, bitte versuchen Sie es erneut",
          processingAllAreas: "Screenshots für alle Bereiche werden verarbeitet...",
          allAreasSaved: "Screenshots von {0} Bereichen erfolgreich gespeichert",
          areaNotVisible: "Ausgewählter Bereich ist fast vollständig außerhalb des sichtbaren Bereichs, kann nicht erfasst werden",
          partiallyVisible: "Ein Teil des Bereichs ist nicht sichtbar, nur der sichtbare Teil wurde erfasst",
          partiallyVisibleArea: "Ein Teil der Auswahl ist nicht sichtbar, nur der sichtbare Teil wurde erfasst",
          areaOutOfView: "Ausgewählter Bereich ist nicht sichtbar. Bitte scrollen Sie, um ihn sichtbar zu machen, und versuchen Sie es erneut.",
          processingError: "Fehler bei der Verarbeitung des Screenshots: {0}",
          saveFailed: "Screenshot konnte nicht gespeichert werden: {0}",
          smartModeEnabled: "Intelligenter Screenshot-Modus aktiviert, klicken Sie, um ein Element auszuwählen (Enter zum Bestätigen, Esc zum Abbrechen)",
          processing: "Kopieren wird verarbeitet...",
          copyFailed: "Kopieren fehlgeschlagen: {0}",
          canvasContextError: "Kopieren fehlgeschlagen: Canvas-Kontext kann nicht abgerufen werden",
          copied: "In die Zwischenablage kopiert",
          clipboardAccessDenied: "Kopieren fehlgeschlagen: Zugriff auf Zwischenablage verweigert",
          clipboardApiNotSupported: "Kopieren fehlgeschlagen: Zwischenablage-API nicht unterstützt",
          imageDataCreateFailed: "Kopieren fehlgeschlagen: Bilddaten können nicht erstellt werden",
          copyAreaOutOfView: "Kopieren fehlgeschlagen: Ausgewählter Bereich ist nicht sichtbar",
          imagePreviewShown: "Bildvorschau angezeigt, Rechtsklick zum Kopieren",
          escape: "Abbrechen (Esc)",
          imageQualitySet: "Bildqualität eingestellt auf: {0}",
          qrDecoding: "QR-Code wird decodiert...",
          qrSuccess: "QR-Code erfolgreich dekodiert, in die Zwischenablage kopiert",
          qrNoQRFound: "Kein gültiges QR-Code erkannt",
          qrError: "QR-Code-Dekodierung fehlgeschlagen: {0}"
        },
        pt: {
          processingScreenshot: "Processando captura...",
          screenshotSaved: "Captura salva na pasta de downloads",
          screenshotLoadFailed: "Falha ao carregar a captura, tente novamente",
          getScreenshotFailed: "Falha ao capturar a tela, tente novamente",
          processingAllAreas: "Processando capturas para todas as áreas...",
          allAreasSaved: "Capturas de {0} áreas salvas com sucesso",
          areaNotVisible: "Área selecionada está quase completamente fora de visão, não é possível capturar",
          partiallyVisible: "Parte da área está fora de visão, apenas a porção visível foi capturada",
          partiallyVisibleArea: "Parte da seleção está fora de visão, apenas a porção visível foi capturada",
          areaOutOfView: "Área selecionada está fora de visão. Por favor, role para torná-la visível e tente novamente.",
          processingError: "Erro ao processar a captura: {0}",
          saveFailed: "Falha ao salvar a captura: {0}",
          smartModeEnabled: "Modo de captura inteligente ativado, clique para selecionar um elemento (Enter para confirmar, Esc para cancelar)",
          processing: "Processando cópia...",
          copyFailed: "Falha ao copiar: {0}",
          canvasContextError: "Falha ao copiar: Não foi possível obter o contexto Canvas",
          copied: "Copiado para a área de transferência",
          clipboardAccessDenied: "Falha ao copiar: Acesso à área de transferência negado",
          clipboardApiNotSupported: "Falha ao copiar: API de área de transferência não suportada",
          imageDataCreateFailed: "Falha ao copiar: Não foi possível criar dados de imagem",
          copyAreaOutOfView: "Falha ao copiar: Área selecionada está fora de visão",
          imagePreviewShown: "Pré-visualização de imagem exibida, clique com o botão direito para copiar",
          escape: "Cancelar (Esc)",
          imageQualitySet: "Qualidade de imagem definida para: {0}",
          qrDecoding: "Decodificando QR Code...",
          qrSuccess: "QR Code decodificado com sucesso, copiado para a área de transferência",
          qrNoQRFound: "Nenhum QR Code válido detectado",
          qrError: "Falha ao decodificar QR Code: {0}"
        },
        ja: {
          processingScreenshot: "画像を処理中...",
          screenshotSaved: "スクリーンショットがダウンロードフォルダに保存されました",
          screenshotLoadFailed: "スクリーンショットの読み込みに失敗しました。再試行してください",
          getScreenshotFailed: "スクリーンショットの取得に失敗しました。再試行してください",
          processingAllAreas: "すべての領域のスクリーンショットを処理中...",
          allAreasSaved: "{0} 個の領域のスクリーンショットが正常に保存されました",
          areaNotVisible: "選択された領域はほぼ完全に画面外にあり、スクリーンショットを取得できません",
          partiallyVisible: "領域の一部が画面外に出ていますが、表示された部分のみがキャプチャされました",
          partiallyVisibleArea: "選択領域の一部が画面外に出ていますが、表示された部分のみがキャプチャされました",
          areaOutOfView: "選択された領域は画面外にあります。スクロールして表示してから再試行してください。",
          processingError: "スクリーンショットの処理中にエラーが発生しました: {0}",
          saveFailed: "スクリーンショットの保存に失敗しました: {0}",
          smartModeEnabled: "スマートスクリーンショットモードが有効になりました。要素をクリックして選択してください (Enterで確認、Escでキャンセル)",
          processing: "コピー中...",
          copyFailed: "コピーに失敗しました: {0}",
          canvasContextError: "キャンバスコンテキストの取得に失敗しました",
          copied: "クリップボードにコピーされました",
          clipboardAccessDenied: "クリップボードへのアクセスが拒否されました",
          clipboardApiNotSupported: "クリップボードAPIがサポートされていません",
          imageDataCreateFailed: "画像データの作成に失敗しました",
          copyAreaOutOfView: "選択領域が画面外にあります",
          imagePreviewShown: "画像プレビューが表示されました。右クリックでコピー",
          escape: "キャンセル (Esc)",
          imageQualitySet: "{0} の画像品質が設定されました",
          qrDecoding: "QRコードを解析中...",
          qrSuccess: "QRコードが正常に解析されました、クリップボードにコピーされました",
          qrNoQRFound: "有効なQRコードが検出されませんでした",
          qrError: "QRコードの解析に失敗しました: {0}"
        },
        fr: {
          processingScreenshot: "Traitement de la capture d'écran...",
          screenshotSaved: "Capture d'écran enregistrée dans le dossier de téléchargement",
          screenshotLoadFailed: "Échec du chargement de la capture d'écran, veuillez réessayer",
          getScreenshotFailed: "Échec de la capture d'écran, veuillez réessayer",
          processingAllAreas: "Traitement des captures d'écran pour toutes les zones...",
          allAreasSaved: "Les captures d'écran de {0} zones ont été enregistrées avec succès",
          areaNotVisible: "La zone sélectionnée est presque complètement hors de vue, impossible de capturer",
          partiallyVisible: "Une partie de la zone est hors de vue, seule la partie visible a été capturée",
          partiallyVisibleArea: "Une partie de la sélection est hors de vue, seule la partie visible a été capturée",
          areaOutOfView: "La zone sélectionnée est hors de vue. Veuillez faire défiler pour la rendre visible et réessayer.",
          processingError: "Erreur lors du traitement de la capture d'écran: {0}",
          saveFailed: "Échec de l'enregistrement de la capture d'écran: {0}",
          smartModeEnabled: "Mode de capture d'écran intelligent activé, cliquez pour sélectionner un élément (Entrée pour confirmer, Échap pour annuler)",
          processing: "Traitement de la copie...",
          copyFailed: "Échec de la copie: {0}",
          canvasContextError: "Échec de la copie: Impossible d'obtenir le contexte Canvas",
          copied: "Copié dans le presse-papiers",
          clipboardAccessDenied: "Échec de la copie: Accès au presse-papiers refusé",
          clipboardApiNotSupported: "Échec de la copie: API de presse-papiers non prise en charge",
          imageDataCreateFailed: "Échec de la copie: Impossible de créer les données d'image",
          copyAreaOutOfView: "Échec de la copie: La zone sélectionnée est hors de vue",
          imagePreviewShown: "Aperçu de l'image affiché, clic droit pour copier",
          escape: "Annuler (Échap)",
          imageQualitySet: "Qualité d'image définie sur: {0}",
          qrDecoding: "Décodage du QR Code...",
          qrSuccess: "QR Code décodé avec succès, copié dans le presse-papiers",
          qrNoQRFound: "Aucun QR Code valide détecté",
          qrError: "Échec du décodage du QR Code: {0}"
        }
      };
      
      var lang = this.getCurrentLanguage();
      var text = notifications[lang] && notifications[lang][key] ? 
                 notifications[lang][key] : 
                 notifications['en'][key] || key;
      
      // 替换参数
      var args = Array.prototype.slice.call(arguments, 1);
      args.forEach(function(param, index) {
        text = text.replace('{' + index + '}', param);
      });
      
      return text;
    }
  };
  
  class RatioScreenshot {
    constructor() {
      // 智能检查模式相关属性
      this.isInspecting = false;
      this.highlightElement = null;
      this.currentElement = null;
      
      // 现有属性
      this.ratio = null;
      this.saveFormat = 'png';
      this.imageQuality = 1.0;
      
      // 状态变量
      this.isActive = false;
      this.isSelecting = false;
      this.isContinuousMode = true; // 默认支持连续截图
      this.startX = 0;
      this.startY = 0;
      this.endX = 0;
      this.endY = 0;
      this.scrollX = 0;
      this.scrollY = 0;
      
      // 锁定尺寸相关变量
      this.isLockSize = false;
      this.lockedWidth = 0;
      this.lockedHeight = 0;
      
      // 磁性吸附相关变量
      this.isMagneticEnabled = false; // 默认关闭磁性吸附
      this.magneticThreshold = 8; // 降低吸附阈值，让吸附不那么激进
      this.magneticStrength = 0.5; // 吸附强度系数 (0-1)，值越小越平滑
      this.nearestEdges = null; // 最近的元素边缘缓存
      this.lastMagneticPosition = null; // 上一次磁性吸附的位置
      this.magneticGuides = { // 磁性辅助线
        horizontal: null,
        vertical: null
      };
      
      // DOM元素
      this.overlay = null;
      this.selection = null;
      this.infoPanel = null;
      this.toolbar = null;
      
      // 保存所有已选择区域
      this.selections = [];
      
      // 事件绑定
      this.handleMouseDown = this.handleMouseDown.bind(this);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleMouseUp = this.handleMouseUp.bind(this);
      this.handleKeyDown = this.handleKeyDown.bind(this);
      this.handleScroll = this.handleScroll.bind(this);
      
      // 初始化监听器
      this.initMessageListener();
      
      // 注入样式
      this.injectStyles();
    }
    
    // 初始化消息监听
    initMessageListener() {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        try {
          console.log("内容脚本收到消息:", message);
          if (message.action === 'initiateScreenshot') {
            // 先确保清理现有元素
            this.cleanupExistingElements();
            
            try {
              this.start(message.options || {});
              sendResponse({ success: true });
            } catch (error) {
              console.error("启动截图失败:", error);
              sendResponse({ success: false, error: error.message });
              
              // 发生错误时，尝试清理
              this.end();
            }
          } 
          else if (message.action === 'screenshotConfirm') {
            // 如果有选择框，执行确认操作
            if (this.selection && this.isActive) {
              console.log("通过快捷键执行确认截图");
              this.captureAndSave();
              sendResponse({ success: true });
            } else {
              console.log("无法执行确认截图，截图模式未激活或无选择框");
              sendResponse({ success: false, error: "截图模式未激活" });
            }
          }
          else if (message.action === 'screenshotCancel') {
            // 如果正在截图，执行取消操作
            if (this.isActive) {
              console.log("通过快捷键执行取消截图");
              
              // 如果在智能检查模式下，先禁用检查
              if (this.isInspecting) {
                console.log("关闭智能检查模式");
                this.disableInspection();
              }
              
              this.end();
              sendResponse({ success: true });
            } else {
              console.log("无法执行取消截图，截图模式未激活");
              sendResponse({ success: false, error: "截图模式未激活" });
            }
          }
          return true;
        } catch (e) {
          console.error("处理消息时发生错误:", e);
          sendResponse({ success: false, error: e.message });
          return true;
        }
      });
    }
    
    // 注入样式表
    injectStyles() {
      const style = document.createElement('style');
      style.textContent = `
        :root {
          --primary-color: #6d28d9;
          --primary-dark: #5b21b6;
          --primary-light: #8b5cf6;
          --black: #18181b;
          --white: #ffffff;
          --gray-100: #f4f4f5;
          --shadow-offset: 4px;
        }
        
        #ratio-screenshot-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: transparent;
          z-index: 9999;
          cursor: crosshair;
          /* pointer-events已通过JavaScript控制 */
        }
        
        #ratio-screenshot-selection {
          position: fixed;
          border: 3px solid var(--white);
          background-color: transparent;
          box-shadow: none;
          z-index: 10000;
          pointer-events: auto;
          box-sizing: border-box;
          /* 添加外层阴影效果使边框在任何背景下都清晰可见 */
          outline: 1px solid rgba(0, 0, 0, 0.5);
        }
        
        #ratio-screenshot-info {
          position: absolute;
          left: 0;
          background-color: rgba(24, 24, 27, 0.7);
          color: var(--white);
          padding: 2px 6px;
          border-radius: 2px;
          font-size: 11px;
          font-weight: normal;
          white-space: nowrap;
          z-index: 10002;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          pointer-events: none;
          border: 1px solid rgba(255, 255, 255, 0.15);
          bottom: -25px; /* 默认显示在底部外侧 */
          opacity: 0.85;
          font-family: 'Consolas', monospace;
          transition: opacity 0.2s;
        }
        
        #ratio-screenshot-info:hover {
          opacity: 1;
        }
        
        .ratio-screenshot-shortcut-info {
          display: flex;
          align-items: center;
          margin-left: 10px;
          font-size: 11px;
          color: var(--black);
          white-space: nowrap;
          opacity: 0.9;
          background-color: rgba(244, 244, 245, 0.9);
          padding: 4px 8px;
          border: 2px solid var(--black);
          box-shadow: 2px 2px 0 var(--black);
        }
        
        .ratio-screenshot-shortcut-info span {
          display: inline-block;
          background-color: rgba(109, 40, 217, 0.2);
          border: 1px solid var(--primary-color);
          border-radius: 2px;
          padding: 1px 4px;
          margin: 0 2px;
          font-family: monospace;
          font-size: 10px;
          font-weight: bold;
        }
        
        .ratio-screenshot-selection-saved {
          position: absolute;
          border: 3px dashed var(--primary-color);
          background-color: rgba(139, 92, 246, 0.1);
          z-index: 9998;
          pointer-events: none;
        }
        
        #ratio-screenshot-toolbar {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(250, 250, 252, 0.75);
          border-radius: 8px;
          border: 2px solid var(--black);
          box-shadow: 3px 3px 0 var(--black);
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 10001;
          max-width: calc(100% - 40px);
          backdrop-filter: blur(4px);
        }
        
        .ratio-screenshot-toolbar-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          width: 100%;
        }
        
        /* 按钮分组容器 */
        .ratio-screenshot-button-group {
          display: flex;
          gap: 4px;
          margin: 0 4px;
          position: relative;
        }
        
        /* 分隔线 */
        .ratio-screenshot-divider {
          width: 1px;
          background-color: rgba(0, 0, 0, 0.2);
          margin: 0 4px;
        }
        
        .ratio-screenshot-button {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          border: 2px solid var(--black);
          cursor: pointer;
          background-color: rgba(244, 244, 245, 0.92);
          color: var(--black);
          box-shadow: 2px 2px 0 var(--black);
          transition: all 0.2s ease;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .ratio-screenshot-button:hover {
          transform: translate(-1px, -1px);
          box-shadow: 3px 3px 0 var(--black);
          background-color: rgba(250, 250, 252, 1);
        }
        
        .ratio-screenshot-button:active {
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0 var(--black);
        }
        
        .ratio-screenshot-button.primary {
          background-color: rgba(109, 40, 217, 0.92);
          color: var(--white);
        }
        
        .ratio-screenshot-button.primary:hover {
          background-color: rgba(124, 58, 237, 0.95);
        }
        
        /* 按钮图标 */
        .ratio-screenshot-button-icon {
          width: 14px;
          height: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        
        select.ratio-screenshot-button {
          padding: 6px 24px 6px 12px;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath fill='%23000' d='M0 0l4 4 4-4z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
        }
        
        .ratio-screenshot-selection-info {
          position: absolute;
          bottom: -25px;
          left: 0;
          color: var(--white);
          background-color: var(--primary-color);
          padding: 2px 8px;
          font-size: 12px;
          font-weight: bold;
          border: 2px solid var(--black);
        }
        
        .ratio-screenshot-magnetic-guide {
          position: fixed;
          z-index: 10002;
          pointer-events: none;
          opacity: 0; /* 隐藏磁性辅助线 */
        }
        
        .ratio-screenshot-magnetic-guide.horizontal {
          height: 1px;
          background-color: #00e5ff;
          width: 100%;
          box-shadow: 0 0 2px rgba(0, 229, 255, 0.8);
        }
        
        .ratio-screenshot-magnetic-guide.vertical {
          width: 1px;
          background-color: #00e5ff;
          height: 100%;
          box-shadow: 0 0 2px rgba(0, 229, 255, 0.8);
        }
        
        .ratio-screenshot-element-highlight {
          position: absolute;
          border: 1px solid rgba(0, 229, 255, 0.5);
          background-color: rgba(0, 229, 255, 0.1);
          pointer-events: none;
          z-index: 9997;
          opacity: 0; /* 隐藏元素高亮 */
        }
        
        .ratio-screenshot-resize-handle {
          position: absolute;
          width: 12px;
          height: 12px;
          background-color: var(--white);
          border: 2px solid var(--primary-color);
          z-index: 10003;
        }
        
        .ratio-screenshot-resize-handle.top-left {
          top: -7px;
          left: -7px;
          cursor: nwse-resize;
        }
        
        .ratio-screenshot-resize-handle.top-right {
          top: -7px;
          right: -7px;
          cursor: nesw-resize;
        }
        
        .ratio-screenshot-resize-handle.bottom-left {
          bottom: -7px;
          left: -7px;
          cursor: nesw-resize;
        }
        
        .ratio-screenshot-resize-handle.bottom-right {
          bottom: -7px;
          right: -7px;
          cursor: nwse-resize;
        }
        
        .ratio-screenshot-resize-handle.top {
          top: -7px;
          left: 50%;
          transform: translateX(-50%);
          cursor: ns-resize;
        }
        
        .ratio-screenshot-resize-handle.right {
          top: 50%;
          right: -7px;
          transform: translateY(-50%);
          cursor: ew-resize;
        }
        
        .ratio-screenshot-resize-handle.bottom {
          bottom: -7px;
          left: 50%;
          transform: translateX(-50%);
          cursor: ns-resize;
        }
        
        .ratio-screenshot-resize-handle.left {
          top: 50%;
          left: -7px;
          transform: translateY(-50%);
          cursor: ew-resize;
        }
        
        .ratio-screenshot-notification {
          position: fixed;
          bottom: 20px;
          top: auto;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(109, 40, 217, 0.9);
          color: var(--white);
          padding: 12px 18px;
          border-radius: 0;
          z-index: 10002;
          font-size: 14px;
          font-weight: bold;
          border: 3px solid var(--black);
          box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--black);
          transition: opacity 0.3s ease;
          max-width: 80%;
          text-align: center;
        }
        
        .ratio-screenshot-move-hint {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.7);
          text-align: center;
          padding-top: 4px;
        }
      `;
      document.head.appendChild(style);
    }
    
    // 开始截图流程
    start(options) {
      // 如果已经处于活动状态，先清理现有元素
      if (this.isActive) {
        this.cleanupExistingElements();
      }
      
      // 设置选项
      this.ratio = options.ratio || 'free';
      this.saveFormat = options.saveFormat || 'png';
      this.imageQuality = options.imageQuality || 1.0;
      
      // 保存检查模式的设置，除非显式传入了false
      if (options.isInspectMode !== undefined) {
        this.isInspectMode = !!options.isInspectMode;
      }
      
      // 如果是智能检查模式，启用元素检查
      if (options.isInspectMode) {
        this.enableInspection();
        return;
      }
      
      // 普通模式的处理逻辑
      this.isActive = true;
      
      // 创建覆盖层
      this.createOverlay();
      
      // 添加事件监听器
      this.addEventListeners();
      
      // 显示工具栏
      this.createToolbar();
    }
    
    // 清理现有截图相关元素
    cleanupExistingElements() {
      const elementsToRemove = [
        'ratio-screenshot-overlay',
        'ratio-screenshot-selection',
        'ratio-screenshot-toolbar',
        'ratio-screenshot-notification'
      ];
      
      // 检查并移除所有指定ID的元素
      elementsToRemove.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          console.log(`预清理: 移除元素 ${id}`);
          element.remove();
        }
      });
      
      // 清理所有辅助性元素
      document.querySelectorAll('.ratio-screenshot-magnetic-guide').forEach(el => el.remove());
      document.querySelectorAll('.ratio-screenshot-element-highlight').forEach(el => el.remove());
      document.querySelectorAll('.ratio-screenshot-resize-handle').forEach(el => el.remove());
      document.querySelectorAll('.ratio-screenshot-selection-saved').forEach(el => el.remove());
    }
    
    // 自动创建选择区域（已弃用 - 现在让用户自己选择区域）
    autoCreateSelection(centerX, centerY) {
      // 此方法已不再使用，保留代码仅供参考
      // 现在用户需要通过鼠标拖动自己创建选择区域
      console.log("autoCreateSelection方法已弃用");
    }
    
    // 创建截图遮罩层
    createOverlay() {
      this.overlay = document.createElement('div');
      this.overlay.id = 'ratio-screenshot-overlay';
      document.body.appendChild(this.overlay);
    }
    
    // 创建选择框
    createSelection(x, y) {
      // 如果在连续模式下，先保存当前选择框（如果有的话）
      if (this.isContinuousMode && this.selection) {
        this.saveCurrentSelectionAsPreview();
      } else if (!this.isContinuousMode) {
        // 在非连续模式下，移除当前选择框
        this.clearCurrentSelection();
      }
      
      this.selection = document.createElement('div');
      this.selection.id = 'ratio-screenshot-selection';
      this.selection.style.left = `${x}px`;
      this.selection.style.top = `${y}px`;
      this.selection.style.width = '10px';  // 使用更合理的初始尺寸，避免选框太小
      this.selection.style.height = '10px'; // 使用更合理的初始尺寸，避免选框太小
      
      // 创建信息面板
      this.infoPanel = document.createElement('div');
      this.infoPanel.id = 'ratio-screenshot-info';
      this.selection.appendChild(this.infoPanel);
      
      document.body.appendChild(this.selection);
    }
    
    // 将当前选择框保存为预览
    saveCurrentSelectionAsPreview() {
      // 如果没有选区，直接返回
      if (!this.selection) return;
      
      // 创建预览元素
      const preview = document.createElement('div');
      preview.className = 'ratio-screenshot-selection-saved';
      
      // 复制选区的位置和大小
      const selectionRect = this.selection.getBoundingClientRect();
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      preview.style.left = `${this.startX}px`;
      preview.style.top = `${this.startY}px`;
      preview.style.width = `${this.endX - this.startX}px`;
      preview.style.height = `${this.endY - this.startY}px`;
      
      // 添加到页面
      document.body.appendChild(preview);
      
      // 保存到选区列表
      this.selections.push({
        element: preview,
        rect: {
          left: this.startX,
          top: this.startY,
          width: this.endX - this.startX,
          height: this.endY - this.startY
        }
      });
      
      // 保存当前模式状态，确保连续截图保持相同模式
      const currentIsInspectMode = this.isInspectMode;
      
      // 清理当前选区和工具栏
      this.clearCurrentSelection();
      
      // 如果工具栏还存在，确保移除
      if (this.toolbar) {
        this.toolbar.remove();
        this.toolbar = null;
        console.log("工具栏已移除");
      }
      
      // 如果是智能检查模式，重新启用检查
      if (currentIsInspectMode) {
        // 保持智能检查模式标志
        this.isInspectMode = true;
        // 重新启用检查功能
        this.enableInspection();
      }
      
      // 重置选区状态
      this.startX = 0;
      this.startY = 0;
      this.endX = 0;
      this.endY = 0;
      
      console.log("已保存当前选区为预览，准备继续截图");
    }
    
    // 清除当前选择框（不影响已保存的选择）
    clearCurrentSelection() {
      // 移除选区
      if (this.selection) {
        this.selection.remove();
        this.selection = null;
      }
      
      // 移除工具栏
      if (this.toolbar) {
        this.toolbar.remove();
        this.toolbar = null;
        console.log("工具栏已移除");
      }
      
      // 移除所有调整大小的手柄
      document.querySelectorAll('.ratio-screenshot-resize-handle').forEach(handle => {
        handle.remove();
      });
      
      // 重置状态
      this.isSelecting = false;
      
      // 清理磁性吸附相关状态
      this.nearestEdges = null;
      this.lastMagneticPosition = null;
      this.clearMagneticGuides();
      
      console.log("已清理当前选区和相关元素");
    }
    
    // 创建工具栏
    createToolbar() {
      // 确保先清理可能存在的旧工具栏
      if (this.toolbar) {
        this.toolbar.remove();
        this.toolbar = null;
      }
      
      this.toolbar = document.createElement('div');
      this.toolbar.id = 'ratio-screenshot-toolbar';
      
      // 创建按钮行
      const primaryRow = this.createPrimaryButtonRow();
      const configRow = this.createConfigRow();
      
      // 添加元素到工具栏
      this.toolbar.appendChild(primaryRow);
      this.toolbar.appendChild(configRow);
      
      // 添加工具栏到文档
      document.body.appendChild(this.toolbar);
    }
    
    // 创建主要按钮行
    createPrimaryButtonRow() {
      const primaryRow = document.createElement('div');
      primaryRow.className = 'ratio-screenshot-toolbar-row';
      
      // 创建保存操作按钮组
      const saveGroup = document.createElement('div');
      saveGroup.className = 'ratio-screenshot-button-group';
      
      // 批量保存按钮 (仅在连续模式且有多个选区时显示)
      if (this.isContinuousMode && this.selections.length > 0) {
        const saveAllButton = document.createElement('button');
        saveAllButton.className = 'ratio-screenshot-button primary';
        this.addButtonContent(saveAllButton, 
          I18nHelper.getToolbarText('saveAllAreas'), 
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M13 5h-2V4c0-.5-.4-1-1-1H6c-.5 0-1 .5-1 1v1H3c-.5 0-1 .5-1 1v5c0 .5.5 1 1 1h10c.6 0 1-.5 1-1V6c0-.5-.4-1-1-1zM6 4h4v1H6V4zm2 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>');
        saveAllButton.addEventListener('click', () => this.captureAndSaveAll());
        saveGroup.appendChild(saveAllButton);
      }
      
      // 保存按钮
      const saveButton = document.createElement('button');
      saveButton.className = 'ratio-screenshot-button primary';
      this.addButtonContent(saveButton, 
        I18nHelper.getToolbarText('saveArea'), 
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M13 5h-2V4c0-.5-.4-1-1-1H6c-.5 0-1 .5-1 1v1H3c-.5 0-1 .5-1 1v5c0 .5.5 1 1 1h10c.6 0 1-.5 1-1V6c0-.5-.4-1-1-1zM6 4h4v1H6V4zm2 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>');
      saveButton.addEventListener('click', () => this.captureAndSave());
      saveGroup.appendChild(saveButton);
      
      // 复制按钮
      const copyButton = document.createElement('button');
      copyButton.className = 'ratio-screenshot-button';
      this.addButtonContent(copyButton, 
        I18nHelper.getToolbarText('copyToClipboard'), 
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M11 1H3c-.5 0-1 .5-1 1v10h2V3h7V1zm2 3H6c-.5 0-1 .5-1 1v10c0 .5.5 1 1 1h7c.5 0 1-.5 1-1V5c0-.5-.5-1-1-1zm-1 10H7V6h5v8z"/></svg>');
      copyButton.title = I18nHelper.isZh() ? '复制截图到剪贴板' : 'Copy screenshot to clipboard';
      copyButton.addEventListener('click', () => this.copyToClipboard());
      saveGroup.appendChild(copyButton);
      
      primaryRow.appendChild(saveGroup);
      
      // 添加分隔线
      const divider1 = document.createElement('div');
      divider1.className = 'ratio-screenshot-divider';
      primaryRow.appendChild(divider1);
      
      // 创建处理操作按钮组
      const processGroup = document.createElement('div');
      processGroup.className = 'ratio-screenshot-button-group';
      
      // 抠图按钮
      const removeBackgroundButton = document.createElement('button');
      removeBackgroundButton.className = 'ratio-screenshot-button';
      this.addButtonContent(removeBackgroundButton, 
        I18nHelper.isZh() ? '抠图' : 'Remove BG', 
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 12c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z"/></svg>');
      removeBackgroundButton.title = I18nHelper.isZh() ? '移除图像背景并复制到剪贴板' : 'Remove background and copy to clipboard';
      removeBackgroundButton.addEventListener('click', () => this.removeBackground());
      processGroup.appendChild(removeBackgroundButton);
      
      // AI对话按钮
      const dialogButton = document.createElement('button');
      dialogButton.className = 'ratio-screenshot-button';
      this.addButtonContent(dialogButton, 
        I18nHelper.getToolbarText('aiDialog'), 
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M8 1C4.1 1 1 3.6 1 7c0 1.7.8 3.3 2 4.4V15l4-2c.3 0 .7.1 1 .1 3.9 0 7-2.6 7-6s-3.1-6-7-6zm2 9H6V8h4v2zm0-4H6V4h4v2z"/></svg>');
      dialogButton.title = this.getAIDialogTitle();
      dialogButton.addEventListener('click', () => this.openAIDialog());
      processGroup.appendChild(dialogButton);
      
      // 二维码解析按钮
      const qrButton = document.createElement('button');
      qrButton.className = 'ratio-screenshot-button';
      this.addButtonContent(qrButton, 
        I18nHelper.getToolbarText('qrDecode'), 
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M6 2H2v4h4V2zM5 5H3V3h2v2zm9-3h-4v4h4V2zm-1 3h-2V3h2v2zm-9 5H2v4h4v-4zm-1 3H3v-2h2v2zm9-3h-4v4h4v-4zm-1 3h-2v-2h2v2zM6 6h1v1H6V6zm3 0h1v1H9V6zm3 0h1v1h-1V6zm0 3h1v1h-1V9zm0 3h1v1h-1v-1zm-3 0h1v1H9v-1zm-3 0h1v1H6v-1zm3-3h1v1H9V9zM6 9h1v1H6V9z"/></svg>');
      qrButton.title = this.getQRDecodeTitle();
      qrButton.addEventListener('click', () => this.decodeQRCode());
      processGroup.appendChild(qrButton);
      
      primaryRow.appendChild(processGroup);
      
      // 创建控制按钮组
      const controlGroup = document.createElement('div');
      controlGroup.className = 'ratio-screenshot-button-group';
      
      // 保持此区域并继续按钮 (仅在连续模式时显示)
      if (this.isContinuousMode) {
        // 添加分隔线
        const divider2 = document.createElement('div');
        divider2.className = 'ratio-screenshot-divider';
        primaryRow.appendChild(divider2);
        
      const keepButton = document.createElement('button');
      keepButton.className = 'ratio-screenshot-button';
        this.addButtonContent(keepButton, 
          I18nHelper.getToolbarText('keepAndContinue'), 
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M2 2v12h12V2H2zm10 10H4V4h8v8zm-1-5H5v3h6V7z"/></svg>');
      keepButton.addEventListener('click', () => {
        console.log(`保持区域并继续，当前模式: ${this.isInspectMode ? '智能检查' : '普通'}`);
        this.saveCurrentSelectionAsPreview();
        
        // 隐藏工具栏
        if (this.toolbar) {
          this.toolbar.style.display = 'none';
        }
        
        // 如果锁定了尺寸，记录当前尺寸
        if (this.isLockSize && this.lockedWidth === 0 && this.lockedHeight === 0) {
          this.lockedWidth = Math.abs(this.endX - this.startX);
          this.lockedHeight = Math.abs(this.endY - this.startY);
          console.log(`锁定截图尺寸: ${this.lockedWidth} × ${this.lockedHeight}`);
        }
      });
        controlGroup.appendChild(keepButton);
        primaryRow.appendChild(controlGroup);
      }
      
      // 添加分隔线
      const divider3 = document.createElement('div');
      divider3.className = 'ratio-screenshot-divider';
      primaryRow.appendChild(divider3);
      
      // 添加取消按钮
      const cancelButton = document.createElement('button');
      cancelButton.className = 'ratio-screenshot-button';
      this.addButtonContent(cancelButton, 
        I18nHelper.getNotificationText('escape'), 
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm3.7 9.3c.4.4.4 1 0 1.4-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3L8 9.4l-2.3 2.3c-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4L6.6 8 4.3 5.7c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0L8 6.6l2.3-2.3c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4L9.4 8l2.3 2.3z"/></svg>');
      cancelButton.onclick = () => {
        console.log("取消按钮被点击");
        this.end();
      };
      primaryRow.appendChild(cancelButton);
      
      return primaryRow;
    }
    
    // 创建配置行
    createConfigRow() {
      const configRow = document.createElement('div');
      configRow.className = 'ratio-screenshot-toolbar-row';
      
      // 创建比例设置组
      const ratioGroup = document.createElement('div');
      ratioGroup.className = 'ratio-screenshot-button-group';
      
      // 添加比例选择下拉菜单
      const ratioSelect = document.createElement('select');
      ratioSelect.className = 'ratio-screenshot-button';
      ratioSelect.title = I18nHelper.getToolbarText('ratioLabel');
      
      // 添加比例选项
      const ratioOptions = [
        { value: 'free', text: I18nHelper.getToolbarText('freeRatio') },
        { value: '16:9', text: '16:9 (Video/Screen)' },
        { value: '4:3', text: '4:3 (Traditional Screen)' },
        { value: '1:1', text: '1:1 (Square/Instagram)' },
        { value: '9:16', text: '9:16 (Mobile Portrait/Stories)' },
        { value: '3:4', text: '3:4 (Instagram/iPad)' },
        { value: '2:1', text: '2:1 (Twitter Landscape)' },
        { value: '1:2', text: '1:2 (Pinterest)' },
        { value: '4:5', text: '4:5 (Instagram Portrait)' },
        { value: '3:2', text: '3:2 (Social Cover)' },
        { value: '21:9', text: '21:9 (Ultrawide)' }
      ];
      
      // 更新比例文本
      const { options } = this.getLocalizedRatioOptions(ratioOptions);
      
      options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        if (option.value === this.ratio) {
          optionElement.selected = true;
        }
        ratioSelect.appendChild(optionElement);
      });
      
      // 添加比例变化事件监听
      ratioSelect.addEventListener('change', () => {
        this.ratio = ratioSelect.value;
        console.log(`比例已更改为: ${this.ratio}`);
        
        // 如果有选择框，根据新比例重新调整大小
        if (this.selection) {
          this.adjustSelectionToRatio();
          this.updateSelectionSizeDisplay();
        }
      });
      
      ratioGroup.appendChild(ratioSelect);
      configRow.appendChild(ratioGroup);
      
      // 添加分隔线
      const divider1 = document.createElement('div');
      divider1.className = 'ratio-screenshot-divider';
      configRow.appendChild(divider1);
      
      // 创建质量设置组
      const qualityGroup = document.createElement('div');
      qualityGroup.className = 'ratio-screenshot-button-group';
      
      // 添加质量选择下拉菜单
      const qualitySelect = document.createElement('select');
      qualitySelect.className = 'ratio-screenshot-button';
      qualitySelect.title = I18nHelper.getToolbarText('qualityLabel');
      qualitySelect.style.minWidth = '85px'; // 设置最小宽度
      
      // 添加质量选项
      const qualityOptions = [
        { value: '1.0', text: I18nHelper.getToolbarText('imageQuality.original') },
        { value: '0.95', text: I18nHelper.getToolbarText('imageQuality.high') },
        { value: '0.85', text: I18nHelper.getToolbarText('imageQuality.standard') },
        { value: '0.7', text: I18nHelper.getToolbarText('imageQuality.light') }
      ];
      
      qualityOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        if (Math.abs(parseFloat(option.value) - this.imageQuality) < 0.05) {
          optionElement.selected = true;
        }
        qualitySelect.appendChild(optionElement);
      });
      
      // 添加质量变化事件监听
      qualitySelect.addEventListener('change', () => {
        this.imageQuality = parseFloat(qualitySelect.value);
        console.log(`图片质量已更改为: ${this.imageQuality}`);
        
        // 估算文件大小
        const fileSize = this.calculateEstimatedFileSize();
        
        // 显示质量信息和大小估计
        const qualityName = qualitySelect.options[qualitySelect.selectedIndex].textContent;
        this.showNotification(I18nHelper.getNotificationText('imageQualitySet', qualityName) + ' ' + fileSize, 2000);
      });
      
      qualityGroup.appendChild(qualitySelect);
      configRow.appendChild(qualityGroup);
      
      // 添加功能切换组
      const toggleGroup = document.createElement('div');
      toggleGroup.className = 'ratio-screenshot-button-group';
      
      // 只在连续模式下显示锁定尺寸按钮
      if (this.isContinuousMode) {
        // 添加分隔线
        const divider2 = document.createElement('div');
        divider2.className = 'ratio-screenshot-divider';
        configRow.appendChild(divider2);
        
        // 添加锁定尺寸按钮
        const lockSizeButton = document.createElement('button');
        lockSizeButton.className = this.isLockSize ? 
          'ratio-screenshot-button primary' : 'ratio-screenshot-button';
        this.addButtonContent(lockSizeButton, 
          this.isLockSize ? I18nHelper.getToolbarText('lockSizeActive') : I18nHelper.getToolbarText('lockSize'), 
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M12 7V5c0-2.2-1.8-4-4-4S4 2.8 4 5v2c-.6 0-1 .4-1 1v6c0 .6.4 1 1 1h8c.6 0 1-.4 1-1V8c0-.6-.4-1-1-1zM6 5c0-1.1.9-2 2-2s2 .9 2 2v2H6V5zm4 7H8.5V9.5h-1V12H6V9h4v3z"/></svg>');
        lockSizeButton.title = this.getLockSizeTitle();
        
        lockSizeButton.addEventListener('click', () => {
          this.isLockSize = !this.isLockSize;
          lockSizeButton.className = this.isLockSize ? 
            'ratio-screenshot-button primary' : 'ratio-screenshot-button';
          this.addButtonContent(lockSizeButton, 
            this.isLockSize ? I18nHelper.getToolbarText('lockSizeActive') : I18nHelper.getToolbarText('lockSize'), 
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M12 7V5c0-2.2-1.8-4-4-4S4 2.8 4 5v2c-.6 0-1 .4-1 1v6c0 .6.4 1 1 1h8c.6 0 1-.4 1-1V8c0-.6-.4-1-1-1zM6 5c0-1.1.9-2 2-2s2 .9 2 2v2H6V5zm4 7H8.5V9.5h-1V12H6V9h4v3z"/></svg>');
          
          if (this.isLockSize) {
            // 记录当前的尺寸
            this.lockedWidth = Math.abs(this.endX - this.startX);
            this.lockedHeight = Math.abs(this.endY - this.startY);
            console.log(`锁定截图尺寸: ${this.lockedWidth} × ${this.lockedHeight}`);
          } else {
            // 清除锁定的尺寸
            this.lockedWidth = 0;
            this.lockedHeight = 0;
            console.log("解除尺寸锁定");
          }
        });
        
        toggleGroup.appendChild(lockSizeButton);
      }
      
      // 添加分隔线
      const divider3 = document.createElement('div');
      divider3.className = 'ratio-screenshot-divider';
      configRow.appendChild(divider3);
      
      // 添加磁性吸附按钮
      const magneticButton = document.createElement('button');
      magneticButton.className = this.isMagneticEnabled ? 
        'ratio-screenshot-button primary' : 'ratio-screenshot-button';
      this.addButtonContent(magneticButton, 
        this.isMagneticEnabled ? I18nHelper.getToolbarText('magneticActive') : I18nHelper.getToolbarText('magnetic'), 
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M14 5h-1V2c0-.6-.4-1-1-1H9v1h3v3h2zm0 2v3h-2v3H9v1h3c.6 0 1-.4 1-1v-3h1V7zM7 2v1H4v3H2v3h2v3h3v1H2c-.6 0-1-.4-1-1V9H0V7h1V3c0-.6.4-1 1-1h5z"/></svg>');
      magneticButton.title = this.getMagneticTitle();
      
      magneticButton.addEventListener('click', () => {
        this.isMagneticEnabled = !this.isMagneticEnabled;
        magneticButton.className = this.isMagneticEnabled ? 
          'ratio-screenshot-button primary' : 'ratio-screenshot-button';
        this.addButtonContent(magneticButton, 
          this.isMagneticEnabled ? I18nHelper.getToolbarText('magneticActive') : I18nHelper.getToolbarText('magnetic'), 
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M14 5h-1V2c0-.6-.4-1-1-1H9v1h3v3h2zm0 2v3h-2v3H9v1h3c.6 0 1-.4 1-1v-3h1V7zM7 2v1H4v3H2v3h2v3h3v1H2c-.6 0-1-.4-1-1V9H0V7h1V3c0-.6.4-1 1-1h5z"/></svg>');
        
        // 清除辅助线
        this.clearMagneticGuides();
      });
      
      toggleGroup.appendChild(magneticButton);
      configRow.appendChild(toggleGroup);
      
      return configRow;
    }
    
    // 添加按钮内容（图标和文本）
    addButtonContent(button, text, iconSvg) {
      // 清空现有内容
      button.innerHTML = '';
      
      // 添加图标（如果提供）
      if (iconSvg) {
        const iconSpan = document.createElement('span');
        iconSpan.className = 'ratio-screenshot-button-icon';
        iconSpan.innerHTML = iconSvg;
        button.appendChild(iconSpan);
      }
      
      // 添加文本
      if (text) {
        const textSpan = document.createElement('span');
        textSpan.textContent = text;
        button.appendChild(textSpan);
      }
    }
    
    // 获取本地化的比例选项
    getLocalizedRatioOptions(ratioOptions) {
      const currentLang = I18nHelper.getCurrentLanguage();
      const updatedOptions = [...ratioOptions];
      
      if (currentLang === 'zh') {
        updatedOptions[1].text = '16:9 (视频/屏幕)';
        updatedOptions[2].text = '4:3 (传统屏幕)';
        updatedOptions[3].text = '1:1 (正方形/Instagram)';
        updatedOptions[4].text = '9:16 (手机竖屏/故事)';
        updatedOptions[5].text = '3:4 (小红书/iPad)';
        updatedOptions[6].text = '2:1 (小红书/Twitter横图)';
        updatedOptions[7].text = '1:2 (Pinterest)';
        updatedOptions[8].text = '4:5 (Instagram竖图)';
        updatedOptions[9].text = '3:2 (SNS封面)';
        updatedOptions[10].text = '21:9 (超宽屏)';
      } else if (currentLang === 'es') {
        updatedOptions[1].text = '16:9 (Video/Pantalla)';
        updatedOptions[2].text = '4:3 (Pantalla Tradicional)';
        updatedOptions[3].text = '1:1 (Cuadrado/Instagram)';
        updatedOptions[4].text = '9:16 (Móvil Vertical/Historias)';
        updatedOptions[5].text = '3:4 (Instagram/iPad)';
        updatedOptions[6].text = '2:1 (Twitter Horizontal)';
        updatedOptions[7].text = '1:2 (Pinterest)';
        updatedOptions[8].text = '4:5 (Instagram Vertical)';
        updatedOptions[9].text = '3:2 (Portada Social)';
        updatedOptions[10].text = '21:9 (Ultraancha)';
      }
      // 保留其他语言的处理
      
      return { options: updatedOptions, lang: currentLang };
    }
    
    // 更新选择框尺寸显示
    updateSelectionSizeDisplay() {
      if (this.toolbar && this.toolbar.querySelector('h3')) {
        const title = this.toolbar.querySelector('h3');
        const width = Math.abs(this.endX - this.startX);
        const height = Math.abs(this.endY - this.startY);
        const currentLang = I18nHelper.getCurrentLanguage();
        title.textContent = `${Math.round(width)} × ${Math.round(height)} ${currentLang === 'zh' ? '像素' : currentLang === 'es' ? 'px' : currentLang === 'ar' ? 'dp' : 'px'} (${this.ratio})`;
      }
    }
    
    // 计算预估文件大小
    calculateEstimatedFileSize() {
        let fileSize = "";
        if (this.selection) {
          const width = Math.abs(this.endX - this.startX);
          const height = Math.abs(this.endY - this.startY);
          const pixelCount = width * height;
          
          // 估算文件大小 (粗略计算)
          let estimatedSizeKB;
          if (this.saveFormat === 'png') {
            estimatedSizeKB = (pixelCount * 0.2) / 1024 * this.imageQuality;
          } else {
            estimatedSizeKB = (pixelCount * 0.08) / 1024 * this.imageQuality;
          }
          
          // 显示有意义的文件大小
          if (estimatedSizeKB > 1024) {
            fileSize = I18nHelper.formatFileSizeEstimate((estimatedSizeKB / 1024).toFixed(1), 'MB');
          } else {
            fileSize = I18nHelper.formatFileSizeEstimate(Math.round(estimatedSizeKB), 'KB');
          }
      }
      return fileSize;
    }
    
    // 获取AI对话按钮标题
    getAIDialogTitle() {
      const currentLang = I18nHelper.getCurrentLanguage();
      if (currentLang === 'zh') return '使用GLM-4V-Flash进行图像对话';
      if (currentLang === 'es') return 'Chatear con la imagen usando GLM-4V-Flash';
      if (currentLang === 'ar') return 'دردشة مع الصورة باستخدام GLM-4V-Flash';
      if (currentLang === 'de') return 'Mit dem Bild chatten mit GLM-4V-Flash';
      if (currentLang === 'pt') return 'Conversar com a imagem usando GLM-4V-Flash';
      if (currentLang === 'ja') return 'GLM-4V-Flashを使用して画像とチャット';
      if (currentLang === 'fr') return 'Discuter avec l\'image en utilisant GLM-4V-Flash';
      if (currentLang === 'ko') return 'GLM-4V-Flash를 사용하여 이미지와 채팅';
      return 'Chat with image using GLM-4V-Flash';
    }
    
    // 获取二维码解码按钮标题
    getQRDecodeTitle() {
      const currentLang = I18nHelper.getCurrentLanguage();
      if (currentLang === 'zh') return '解析截图中的二维码';
      if (currentLang === 'es') return 'Decodificar código QR';
      if (currentLang === 'ar') return 'فك رمز QR';
      if (currentLang === 'de') return 'QR-Code dekodieren';
      if (currentLang === 'pt') return 'Decodificar QR Code';
      if (currentLang === 'ja') return 'QRコードを解析';
      if (currentLang === 'fr') return 'Décoder le QR Code';
      if (currentLang === 'ko') return 'QR 코드 해독';
      return 'Decode QR Code';
    }
    
    // 获取锁定尺寸按钮标题
    getLockSizeTitle() {
        const currentLang = I18nHelper.getCurrentLanguage();
        if (currentLang === 'zh') return '锁定当前尺寸用于连续截图';
        if (currentLang === 'es') return 'Bloquear tamaño para captura continua';
        if (currentLang === 'ar') return 'قفل الحجم للتصوير المستمر';
        if (currentLang === 'de') return 'Größe sperren für fortlaufende Aufnahme';
        if (currentLang === 'pt') return 'Bloquear tamanho para captura contínua';
        if (currentLang === 'ja') return '連続キャプチャのために現在のサイズをロック';
        if (currentLang === 'fr') return 'Verrouiller la taille actuelle pour une capture continue';
        if (currentLang === 'ko') return '연속 캡처를 위한 현재 크기 잠금';
        return 'Lock current size for continuous capture';
    }
    
    // 获取磁性吸附按钮标题
    getMagneticTitle() {
        const currentLang = I18nHelper.getCurrentLanguage();
        if (currentLang === 'zh') return '启用后会自动吸附到页面元素边缘';
        if (currentLang === 'es') return 'Auto-snap para elementos de la página cuando está activado';
        if (currentLang === 'ar') return 'تمكين التقاط التلقائي للعناصر الموجودة على الصفحة عند تمكينه';
        if (currentLang === 'de') return 'Automatisches Einrasten an Seitenelementkanten bei Aktivierung';
        if (currentLang === 'pt') return 'Encaixe automático nos elementos da página quando ativado';
        if (currentLang === 'ja') return '有効にするとページ要素に自動的に吸着';
        if (currentLang === 'fr') return 'Accrochage automatique aux éléments de la page lorsqu\'activé';
        if (currentLang === 'ko') return '활성화시 페이지 요소에 자동으로 스냅';
        return 'Auto-snap to page element edges when enabled';
    }
    
    // 获取移动提示文本
    getLocalizedMoveHint() {
        const currentLang = I18nHelper.getCurrentLanguage();
        if (currentLang === 'zh') 
          return '提示: <strong>拖动边缘</strong>调整大小, <strong>鼠标滚轮</strong>微调位置';
        if (currentLang === 'es') 
          return 'Tip: <strong>Arrastra los bordes</strong> para cambiar el tamaño, <strong>Rueda del mouse</strong> para ajustar la posición';
        if (currentLang === 'ar') 
          return 'تلميح: <strong>سحب الحافة</strong> لتغيير الحجم, <strong>عجلة الماوس</strong> للضبط الدقيق';
        if (currentLang === 'de') 
          return 'Tipp: <strong>Ränder ziehen</strong> zum Größe anpassen, <strong>Mausrad</strong> für Feineinstellung';
        if (currentLang === 'pt') 
          return 'Dica: <strong>Arraste as bordas</strong> para redimensionar, <strong>Roda do mouse</strong> para ajuste fino';
        if (currentLang === 'ja') 
          return 'ヒント: <strong>端をドラッグ</strong>してサイズ変更、<strong>マウスホイール</strong>で微調整';
        if (currentLang === 'fr') 
          return 'Astuce: <strong>Faire glisser les bords</strong> pour redimensionner, <strong>Molette de la souris</strong> pour ajustement fin';
        if (currentLang === 'ko') 
          return '팁: <strong>가장자리 드래그</strong>로 크기 조정, <strong>마우스 휠</strong>로 미세 조정';
        return 'Tip: <strong>Drag edges</strong> to resize, <strong>Mouse wheel</strong> for fine adjustment';
    }
    
    // 添加事件监听
    addEventListeners() {
      this.overlay.addEventListener('mousedown', this.handleMouseDown);
      // 使用保存的绑定函数实例，以便能正确地移除
      this.boundHandleKeyDown = this.boundHandleKeyDown || this.handleKeyDown.bind(this);
      document.addEventListener('keydown', this.boundHandleKeyDown);
    }
    
    // 移除事件监听
    removeEventListeners() {
      if (this.overlay) {
        this.overlay.removeEventListener('mousedown', this.handleMouseDown);
      }
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('mouseup', this.handleMouseUp);
      
      // 移除键盘事件监听器 - 使用保存的绑定函数
      if (this.boundHandleKeyDown) {
        document.removeEventListener('keydown', this.boundHandleKeyDown);
      }
    }
    
    // 处理鼠标按下
    handleMouseDown(e) {
      // 阻止默认行为和事件冒泡
      e.preventDefault();
      e.stopPropagation();
      
      // 隐藏工具栏（如果存在）
      if (this.toolbar) {
        this.toolbar.remove();
        this.toolbar = null;
      }
      
      this.isSelecting = true;
      
      // 重置磁性吸附状态
      this.lastMagneticPosition = null;
      
      // 获取鼠标在文档中的精确位置(包含滚动)
      const pageX = e.pageX;
      const pageY = e.pageY;
      
      // 记录当前页面滚动位置
      this.scrollX = window.scrollX;
      this.scrollY = window.scrollY;
      
      // 保存文档绝对坐标作为起始点
      this.startX = pageX;
      this.startY = pageY;
      
      console.log("开始选择截图区域，文档绝对坐标:", this.startX, this.startY, 
                  "滚动位置:", this.scrollX, this.scrollY);
      
      // 创建选择框(使用视口相对坐标)
      this.createSelection(e.clientX, e.clientY);
      
      // 添加事件监听
      document.addEventListener('mousemove', this.handleMouseMove);
      document.addEventListener('mouseup', this.handleMouseUp);
      window.addEventListener('scroll', this.handleScroll);
    }
    
    // 处理页面滚动
    handleScroll = (e) => {
      if (!this.isSelecting || !this.selection) return;
      
      // 记录新的滚动位置
      const newScrollX = window.scrollX;
      const newScrollY = window.scrollY;
      
      console.log("页面滚动，新滚动位置:", newScrollX, newScrollY);
      
      // 更新记录的滚动位置
      this.scrollX = newScrollX;
      this.scrollY = newScrollY;
      
      // 重新计算选择框在视口中的位置
      this.updateSelectionSize();
    }
    
    // 处理鼠标移动
    handleMouseMove(e) {
      if (!this.isSelecting) return;
      
      // 阻止默认行为和事件冒泡
      e.preventDefault();
      e.stopPropagation();
      
      // 获取鼠标在文档中的精确位置(包含滚动)
      const pageX = e.pageX;
      const pageY = e.pageY;
      
      // 如果启用了锁定尺寸并且已有记录的尺寸
      if (this.isLockSize && this.lockedWidth > 0 && this.lockedHeight > 0) {
        // 计算鼠标位置相对于起始点的方向
        const directionX = pageX >= this.startX ? 1 : -1;
        const directionY = pageY >= this.startY ? 1 : -1;
        
        // 使用锁定的尺寸计算结束点
        this.endX = this.startX + (directionX * this.lockedWidth);
        this.endY = this.startY + (directionY * this.lockedHeight);
        
        console.log("使用锁定尺寸:", this.lockedWidth, this.lockedHeight);
      } else {
        // 更新结束坐标(文档绝对坐标)
        let newEndX = pageX;
        let newEndY = pageY;
        let magneticAppliedX = false;
        let magneticAppliedY = false;
        
        // 应用磁性吸附效果
        if (this.isMagneticEnabled && !this.isLockSize) {
          // 计算选择框的边缘
          const selectionBox = {
            left: Math.min(this.startX, newEndX),
            top: Math.min(this.startY, newEndY),
            right: Math.max(this.startX, newEndX),
            bottom: Math.max(this.startY, newEndY)
          };
          
          // 每隔一段时间更新一次可能的磁性吸附目标
          if (!this.nearestEdges || e.timeStamp - (this._lastMagneticSearch || 0) > 200) {
            this._lastMagneticSearch = e.timeStamp;
            this.findNearestElementEdges(pageX, pageY);
          }
          
          // 应用磁性吸附调整坐标
          if (this.nearestEdges) {
            // 当用户正在向右/向下拖动时，优先吸附右/下边缘
            const isMovingRight = newEndX > this.startX;
            const isMovingDown = newEndY > this.startY;
            
            // 水平方向吸附
            if (this.nearestEdges.horizontal.length > 0) {
              for (const edge of this.nearestEdges.horizontal) {
                // 检查鼠标当前Y坐标是否在元素的垂直范围内(加一定容差)
                const isInVerticalRange = pageY >= edge.top - 30 && pageY <= edge.bottom + 30;
                
                // 检查是否为中心线类型的吸附点
                const isCenterPoint = edge.type === 'centerX';
                
                // 如果是中心线，使用不同的吸附判断逻辑
                if (isCenterPoint || isInVerticalRange) {
                  // 计算选择框中心
                  const selectionCenterX = (selectionBox.left + selectionBox.right) / 2;
                  
                  // 对中心线的吸附
                  if (isCenterPoint) {
                    const distToCenter = Math.abs(selectionCenterX - edge.x);
                    if (distToCenter < this.magneticThreshold) {
                      // 平滑吸附: 根据距离应用一定比例的吸附强度
                      const snapStrength = this.calculateSnapStrength(distToCenter);
                      // 计算新的endX，平滑过渡到目标位置
                      const halfWidth = (selectionBox.right - selectionBox.left) / 2;
                      const targetX = edge.x + (isMovingRight ? halfWidth : -halfWidth);
                      newEndX = this.applySmoothedPosition(newEndX, targetX, snapStrength);
                      this.showVerticalMagneticGuide(edge.x);
                      magneticAppliedX = true;
                      break;
                    }
                  } 
                  // 对左右边缘的吸附
                  else {
                    // 根据移动方向优先考虑不同的边缘
                    if (isMovingRight) {
                      // 判断右边缘的距离
                      const distToRight = Math.abs(selectionBox.right - edge.x);
                      if (distToRight < this.magneticThreshold) {
                        // 平滑吸附
                        const snapStrength = this.calculateSnapStrength(distToRight);
                        const targetX = edge.x - (this.startX - selectionBox.right);
                        newEndX = this.applySmoothedPosition(newEndX, targetX, snapStrength);
                        this.showVerticalMagneticGuide(edge.x);
                        magneticAppliedX = true;
                        break;
                      }
                    } else {
                      // 判断左边缘的距离
                      const distToLeft = Math.abs(selectionBox.left - edge.x);
                      if (distToLeft < this.magneticThreshold) {
                        // 平滑吸附
                        const snapStrength = this.calculateSnapStrength(distToLeft);
                        const targetX = edge.x - (this.startX - selectionBox.left);
                        newEndX = this.applySmoothedPosition(newEndX, targetX, snapStrength);
                        this.showVerticalMagneticGuide(edge.x);
                        magneticAppliedX = true;
                        break;
                      }
                    }
                  }
                }
              }
            }
            
            // 垂直方向吸附
            if (this.nearestEdges.vertical.length > 0) {
              for (const edge of this.nearestEdges.vertical) {
                // 检查鼠标当前X坐标是否在元素的水平范围内(加一定容差)
                const isInHorizontalRange = pageX >= edge.left - 30 && pageX <= edge.right + 30;
                
                // 检查是否为中心线类型的吸附点
                const isCenterPoint = edge.type === 'centerY';
                
                // 如果是中心线，使用不同的吸附判断逻辑
                if (isCenterPoint || isInHorizontalRange) {
                  // 计算选择框中心
                  const selectionCenterY = (selectionBox.top + selectionBox.bottom) / 2;
                  
                  // 对中心线的吸附
                  if (isCenterPoint) {
                    const distToCenter = Math.abs(selectionCenterY - edge.y);
                    if (distToCenter < this.magneticThreshold) {
                      // 平滑吸附
                      const snapStrength = this.calculateSnapStrength(distToCenter);
                      const halfHeight = (selectionBox.bottom - selectionBox.top) / 2;
                      const targetY = edge.y + (isMovingDown ? halfHeight : -halfHeight);
                      newEndY = this.applySmoothedPosition(newEndY, targetY, snapStrength);
                      this.showHorizontalMagneticGuide(edge.y);
                      magneticAppliedY = true;
                      break;
                    }
                  } 
                  // 对上下边缘的吸附
                  else {
                    // 根据移动方向优先考虑不同的边缘
                    if (isMovingDown) {
                      // 判断下边缘的距离
                      const distToBottom = Math.abs(selectionBox.bottom - edge.y);
                      if (distToBottom < this.magneticThreshold) {
                        // 平滑吸附
                        const snapStrength = this.calculateSnapStrength(distToBottom);
                        const targetY = edge.y - (this.startY - selectionBox.bottom);
                        newEndY = this.applySmoothedPosition(newEndY, targetY, snapStrength);
                        this.showHorizontalMagneticGuide(edge.y);
                        magneticAppliedY = true;
                        break;
                      }
                    } else {
                      // 判断上边缘的距离
                      const distToTop = Math.abs(selectionBox.top - edge.y);
                      if (distToTop < this.magneticThreshold) {
                        // 平滑吸附
                        const snapStrength = this.calculateSnapStrength(distToTop);
                        const targetY = edge.y - (this.startY - selectionBox.top);
                        newEndY = this.applySmoothedPosition(newEndY, targetY, snapStrength);
                        this.showHorizontalMagneticGuide(edge.y);
                        magneticAppliedY = true;
                        break;
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          // 非磁性模式下，清除辅助线
          this.clearMagneticGuides();
        }
        
        // 应用比例约束 - 仅在非自由比例模式下应用
        if (this.ratio !== 'free') {
          try {
            const [widthRatio, heightRatio] = this.ratio.split(':').map(Number);
            
            if (widthRatio > 0 && heightRatio > 0) {
              // 在强制比例模式下，确定是根据X还是Y来计算另一维度
              // 如果已经应用了磁性吸附，根据吸附的维度决定
              if (magneticAppliedX && !magneticAppliedY) {
                // X方向已吸附，根据X计算Y
                const width = newEndX - this.startX;
                const height = width * (heightRatio / widthRatio);
                newEndY = this.startY + height;
              } else if (magneticAppliedY && !magneticAppliedX) {
                // Y方向已吸附，根据Y计算X
                const height = newEndY - this.startY;
                const width = height * (widthRatio / heightRatio);
                newEndX = this.startX + width;
              } else {
                // 默认根据X方向计算Y方向
                const width = newEndX - this.startX;
                const height = width * (heightRatio / widthRatio);
                newEndY = this.startY + height;
              }
            }
          } catch (error) {
            console.error("处理比例时出错:", error);
            // 出错时不应用约束
          }
        }
        
        // 更新结束坐标
        this.endX = newEndX;
        this.endY = newEndY;
      }
      
      // 更新选择框
      this.updateSelectionSize();
    }
    
    // 计算吸附强度 - 根据距离返回0到1之间的值，越近越强
    calculateSnapStrength(distance) {
      if (distance >= this.magneticThreshold) return 0;
      // 平滑过渡曲线: 1 - (distance/threshold)^2
      return Math.max(0, Math.min(1, this.magneticStrength * (1 - Math.pow(distance / this.magneticThreshold, 2))));
    }
    
    // 应用平滑过渡到吸附位置
    applySmoothedPosition(currentPos, targetPos, strength) {
      // 记录上一次位置用于防止跳跃
      if (!this.lastMagneticPosition) {
        this.lastMagneticPosition = currentPos;
      }
      
      // 平滑过渡: 当前位置和目标位置按强度加权平均
      let smoothedPosition = currentPos + (targetPos - currentPos) * strength;
      
      // 防止大幅跳跃: 如果新位置变化太大，限制变化量
      const maxJump = 5; // 最大跳跃距离
      const positionDelta = smoothedPosition - this.lastMagneticPosition;
      if (Math.abs(positionDelta) > maxJump) {
        smoothedPosition = this.lastMagneticPosition + (positionDelta > 0 ? maxJump : -maxJump);
      }
      
      // 更新上一次位置
      this.lastMagneticPosition = smoothedPosition;
      
      return smoothedPosition;
    }
    
    // 处理鼠标释放
    handleMouseUp(e) {
      if (!this.isSelecting) return;
      
      // 阻止默认行为和事件冒泡
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      this.isSelecting = false;
      console.log("完成选择截图区域，结束坐标:", this.endX, this.endY);
      
      // 移除滚动事件监听
      window.removeEventListener('scroll', this.handleScroll);
      
      // 重置磁性吸附状态
      this.lastMagneticPosition = null;
      
      // 检查选择框大小
      if (this.selection) {
        const rect = this.selection.getBoundingClientRect();
        if (rect.width < 10 || rect.height < 10) {
          console.log("选择区域太小，忽略");
          this.clearCurrentSelection();
          return;
        }
      }
      
      // 添加调整大小的手柄
      this.addResizeHandles();
      
      // 创建工具栏 - 确保工具栏可见
      this.createToolbar();
      if (this.toolbar) {
        this.toolbar.style.display = 'flex';
        console.log("工具栏已创建并显示");
      }
      
      // 移除鼠标移动和释放事件
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('mouseup', this.handleMouseUp);
      
      // 添加选择框移动功能
      this.makeSelectionMovable();
    }
    
    // 让选择框可移动
    makeSelectionMovable() {
      if (!this.selection) return;
      
      // 保存区域大小
      const width = Math.abs(this.endX - this.startX);
      const height = Math.abs(this.endY - this.startY);
      
      // 改变选择框的鼠标样式
      this.selection.style.cursor = 'move';
      
      // 添加移动事件监听
      let isDragging = false;
      let dragStartX = 0;
      let dragStartY = 0;
      let originalLeft = 0;
      let originalTop = 0;
      
      // 添加mousedown事件监听
      const onMouseDown = (e) => {
        // 阻止事件冒泡，避免触发overlay的mousedown事件
        e.stopPropagation();
        
        // 只有左键点击才响应
        if (e.button !== 0) return;
        
        isDragging = true;
        
        // 记录拖动起始位置（视口相对坐标）
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        
        // 记录选择框原始位置（视口相对坐标）
        const rect = this.selection.getBoundingClientRect();
        originalLeft = rect.left;
        originalTop = rect.top;
        
        // 添加mousemove和mouseup事件监听
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        
        // 防止选中文本等默认行为
        e.preventDefault();
      };
      
      // 添加mousemove事件监听
      const onMouseMove = (e) => {
        if (!isDragging) return;
        
        // 计算移动距离（视口相对坐标）
        const moveX = e.clientX - dragStartX;
        const moveY = e.clientY - dragStartY;
        
        // 计算新位置（视口相对坐标）
        const newLeft = originalLeft + moveX;
        const newTop = originalTop + moveY;
        
        // 更新选择框位置（视口相对坐标）
        this.selection.style.left = `${newLeft}px`;
        this.selection.style.top = `${newTop}px`;
        
        // 更新内部记录的坐标（文档绝对坐标）
        this.startX = newLeft + window.scrollX;
        this.startY = newTop + window.scrollY;
        this.endX = this.startX + width;
        this.endY = this.startY + height;
        
        // 阻止默认行为
        e.preventDefault();
      };
      
      // 添加mouseup事件监听
      const onMouseUp = (e) => {
        isDragging = false;
        
        // 移除事件监听
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        
        // 更新信息面板
        if (this.infoPanel) {
          // 更新信息内容 - 添加比例但简洁展示
          let infoText = `${Math.round(width)}×${Math.round(height)}`;
          
          // 如果不是自由比例，添加比例信息
          if (this.ratio && this.ratio !== 'free') {
            infoText += ` (${this.ratio})`;
          }
          
          this.infoPanel.textContent = infoText;
        }
      };
      
      // 绑定事件到选择框
      this.selection.addEventListener('mousedown', onMouseDown);
      
      // 记录句柄，以便后续清理
      this.selectionMoveHandler = onMouseDown;
      
      // 添加调整大小的控制点
      this.addResizeHandles();
    }
    
    // 添加调整大小的控制点
    addResizeHandles() {
      if (!this.selection) return;
      
      // 控制点位置
      const positions = [
        'top-left', 'top-right', 'bottom-left', 'bottom-right', 
        'top', 'right', 'bottom', 'left'
      ];
      
      // 创建控制点
      positions.forEach(position => {
        const handle = document.createElement('div');
        handle.className = `ratio-screenshot-resize-handle ${position}`;
        this.selection.appendChild(handle);
        
        // 添加事件监听
        handle.addEventListener('mousedown', (e) => {
          e.stopPropagation(); // 防止触发选择框的移动
          
          const startX = e.clientX;
          const startY = e.clientY;
          const startWidth = Math.abs(this.endX - this.startX);
          const startHeight = Math.abs(this.endY - this.startY);
          
          // 记录初始坐标
          const initialStartX = this.startX;
          const initialStartY = this.startY;
          const initialEndX = this.endX;
          const initialEndY = this.endY;
          
          // 调整大小时的鼠标移动处理
          const onResize = (moveEvent) => {
            moveEvent.preventDefault();
            
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;
            
            // 根据控制点位置调整不同的边缘
            if (position.indexOf('left') > -1) {
              this.startX = initialStartX + deltaX;
            } else if (position.indexOf('right') > -1) {
              this.endX = initialEndX + deltaX;
            }
            
            if (position.indexOf('top') > -1) {
              this.startY = initialStartY + deltaY;
            } else if (position.indexOf('bottom') > -1) {
              this.endY = initialEndY + deltaY;
            }
            
            // 如果不是自由比例，应用比例约束
            if (this.ratio !== 'free') {
              try {
                const [widthRatio, heightRatio] = this.ratio.split(':').map(Number);
                
                if (widthRatio > 0 && heightRatio > 0) {
                  // 确定是哪个边被拖动
                  if (position.indexOf('top') > -1 || position.indexOf('bottom') > -1) {
                    // 垂直边被拖动，根据高度计算宽度
                    const height = Math.abs(this.endY - this.startY);
                    const width = height * (widthRatio / heightRatio);
                    
                    // 根据拖动的边调整另一边的坐标
                    if (position.indexOf('left') > -1) {
                      this.startX = this.endX - width * Math.sign(this.endX - initialStartX);
                    } else {
                      this.endX = this.startX + width * Math.sign(initialEndX - this.startX);
                    }
                  } else {
                    // 水平边被拖动，根据宽度计算高度
                    const width = Math.abs(this.endX - this.startX);
                    const height = width * (heightRatio / widthRatio);
                    
                    // 根据拖动的边调整另一边的坐标
                    if (position.indexOf('top') > -1) {
                      this.startY = this.endY - height * Math.sign(this.endY - initialStartY);
                    } else {
                      this.endY = this.startY + height * Math.sign(initialEndY - this.startY);
                    }
                  }
                }
              } catch (error) {
                console.error("应用比例约束时出错:", error);
              }
            }
            
            // 更新选择框
            this.updateSelectionSize();
          };
          
          // 鼠标释放时的处理
          const onResizeEnd = () => {
            document.removeEventListener('mousemove', onResize);
            document.removeEventListener('mouseup', onResizeEnd);
            
            // 确保大小足够
            const width = Math.abs(this.endX - this.startX);
            const height = Math.abs(this.endY - this.startY);
            
            if (width < 10 || height < 10) {
              // 恢复到初始大小
              this.startX = initialStartX;
              this.startY = initialStartY;
              this.endX = initialEndX;
              this.endY = initialEndY;
              this.updateSelectionSize();
            }
          };
          
          document.addEventListener('mousemove', onResize);
          document.addEventListener('mouseup', onResizeEnd);
        });
      });
    }
    
    // 处理键盘事件
    handleKeyDown(e) {
      // 如果在智能检查模式下
      if (this.isInspecting) {
        // ESC键取消智能检查
        if (e.key === 'Escape') {
          console.log("通过Esc键取消智能检查");
          this.disableInspection();
          this.end();
          return;
        }
        
        // Enter键确认当前选中的元素
        if (e.key === 'Enter' && this.currentElement) {
          console.log("通过Enter键确认智能检查元素");
          // 触发捕获并保存当前元素
          this.handleInspectorClick({ 
            target: this.currentElement, 
            preventDefault: () => {}, 
            stopPropagation: () => {} 
          });
          return;
        }
        
        return; // 智能检查模式下，其他键不处理
      }
      
      // 如果没有选择框，不处理键盘事件
      if (!this.selection) return;
      
      // ESC键取消
      if (e.key === 'Escape') {
        this.end();
        return;
      }
      
      // Enter键确认
      if (e.key === 'Enter') {
        this.captureAndSave();
        return;
      }
      
      // Ctrl+C 复制到剪贴板
      if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
        console.log("通过Ctrl+C快捷键复制到剪贴板");
        e.preventDefault(); // 阻止默认的复制行为
        this.copyToClipboard();
        return;
      }
      
      // 箭头键移动选择框
      const moveStep = e.shiftKey ? 10 : 1; // 按住Shift键时移动更大步长
      let didMove = false;
      
      switch (e.key) {
        case 'ArrowUp':
          this.startY -= moveStep;
          this.endY -= moveStep;
          didMove = true;
          break;
        case 'ArrowDown':
          this.startY += moveStep;
          this.endY += moveStep;
          didMove = true;
          break;
        case 'ArrowLeft':
          this.startX -= moveStep;
          this.endX -= moveStep;
          didMove = true;
          break;
        case 'ArrowRight':
          this.startX += moveStep;
          this.endX += moveStep;
          didMove = true;
          break;
      }
      
      // 如果移动了选择框，更新显示
      if (didMove) {
        e.preventDefault(); // 防止页面滚动
        this.updateSelectionSize(this.startX, this.startY, this.endX, this.endY);
      }
    }
    
    // 更新选择框大小
    updateSelectionSize(startX, startY, endX, endY) {
      if (!this.selection) return;
      
      // 使用传入的参数或使用实例变量
      const x1 = startX !== undefined ? startX : this.startX;
      const y1 = startY !== undefined ? startY : this.startY;
      const x2 = endX !== undefined ? endX : this.endX;
      const y2 = endY !== undefined ? endY : this.endY;
      
      // 计算在文档中的绝对位置和尺寸
      const absLeft = Math.min(x1, x2);
      const absTop = Math.min(y1, y2);
      const width = Math.abs(x2 - x1);
      const height = Math.abs(y2 - y1);
      
      // 转换为视口相对坐标(因为position:fixed是相对于视口的)
      const viewportLeft = absLeft - window.scrollX;
      const viewportTop = absTop - window.scrollY;
      
      // 更新选择框样式(使用视口相对坐标)
      this.selection.style.left = `${viewportLeft}px`;
      this.selection.style.top = `${viewportTop}px`;
      this.selection.style.width = `${width}px`;
      this.selection.style.height = `${height}px`;
      
      // 更新信息面板
      if (this.infoPanel) {
        // 更新信息内容 - 添加比例但简洁展示
        let infoText = `${Math.round(width)}×${Math.round(height)}`;
        
        // 如果不是自由比例，添加比例信息
        if (this.ratio && this.ratio !== 'free') {
          infoText += ` (${this.ratio})`;
        }
        
        this.infoPanel.textContent = infoText;
        
        // 智能定位信息面板，根据选择框位置自动调整
        // 检查屏幕边缘位置，避免信息面板超出屏幕范围
        const topSpace = viewportTop;
        const bottomSpace = window.innerHeight - (viewportTop + height);
        const leftSpace = viewportLeft;
        const rightSpace = window.innerWidth - (viewportLeft + width);
        
        // 重置之前可能设置的样式
        this.infoPanel.style.top = '';
        this.infoPanel.style.bottom = '';
        this.infoPanel.style.left = '';
        this.infoPanel.style.right = '';
        
        // 优先尝试放在底部，如果空间不足再考虑放在顶部
        if (bottomSpace >= 30) {
          this.infoPanel.style.bottom = '-25px';
        } else if (topSpace >= 30) {
          this.infoPanel.style.top = '-25px';
        } else {
          // 如果顶部和底部都没有足够空间，则放在选择框内的右下角
          this.infoPanel.style.bottom = '5px';
          this.infoPanel.style.right = '5px';
          // 增加背景不透明度，确保在内部时更容易阅读
          this.infoPanel.style.backgroundColor = 'rgba(24, 24, 27, 0.85)';
          return; // 内部显示时，不需要进一步调整水平位置
        }
        
        // 水平方向调整，优先放在左侧，如果空间不足考虑右侧
        if (leftSpace + width/2 >= this.infoPanel.offsetWidth/2) {
          // 居中或靠左放置
          this.infoPanel.style.left = '0';
          // 如果选择框很窄，可能需要移动到左侧中点
          if (width < this.infoPanel.offsetWidth) {
            this.infoPanel.style.left = `-${(this.infoPanel.offsetWidth - width) / 2}px`;
          }
        } else {
          // 放在右侧
          this.infoPanel.style.right = '0';
        }
      }
    }
    
    // 捕获并保存当前选择框
    captureAndSave() {
      if (!this.selection) {
        console.error("未找到选择框，无法截图");
        return;
      }
      
      console.log("开始捕获当前选择区域");
      
      // 使用我们跟踪的绝对坐标进行截图
      const captureRect = {
        left: Math.min(this.startX, this.endX),
        top: Math.min(this.startY, this.endY),
        width: Math.abs(this.endX - this.startX),
        height: Math.abs(this.endY - this.startY)
      };
      
      console.log("捕获区域坐标(绝对):", captureRect);
      
      // 捕获并保存这个区域
      this.captureArea(captureRect);
    }
    
    // 捕获指定区域
    captureArea(rect) {
      // 显示处理中提示
      const captureMsg = this.showNotification(I18nHelper.getNotificationText('processingScreenshot'));
      
      // 获取当前的滚动位置和视口尺寸
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // 记录截图时的环境信息，用于调试
      console.log("截图环境:", {
        "视口尺寸": { width: viewportWidth, height: viewportHeight },
        "滚动位置": { x: scrollX, y: scrollY },
        "设备像素比": window.devicePixelRatio,
        "选择区域": rect
      });
      
      // 计算选择区域的绝对坐标
      const absoluteRect = {
        left: Math.min(this.startX, this.endX),
        top: Math.min(this.startY, this.endY),
        width: Math.abs(this.endX - this.startX),
        height: Math.abs(this.endY - this.startY)
      };
      
      // 检查选择区域是否在视口范围内
      const isRectVisible = (
        absoluteRect.left >= scrollX && 
        absoluteRect.top >= scrollY && 
        absoluteRect.left + absoluteRect.width <= scrollX + viewportWidth &&
        absoluteRect.top + absoluteRect.height <= scrollY + viewportHeight
      );
      
      // 临时隐藏UI元素，确保截图不包含黑色蒙版和边框
      this.hideUIElementsForCapture();
      
      // 添加短延迟以确保DOM更新已渲染
      setTimeout(() => {
        // 根据区域是否在当前视口内，选择不同的截图方法
        if (isRectVisible) {
          console.log("选择区域在当前视口内，使用标准截图方法");
          
          // 区域在视口内，使用常规方法截图
          chrome.runtime.sendMessage({ 
            action: 'captureScreen',
            debug: {
              scrollX: scrollX,
              scrollY: scrollY,
              viewportWidth: viewportWidth,
              viewportHeight: viewportHeight
            }
          }, response => {
            this.processScreenshotResponse(response, absoluteRect, captureMsg);
          });
        } else {
          console.log("选择区域不在当前视口内，使用全页面截图方法");
          
          // 区域不在当前视口，使用新的全页面截图方法
          chrome.runtime.sendMessage({
            action: 'captureFullPage',
            targetArea: absoluteRect,
            debug: {
              scrollX: scrollX,
              scrollY: scrollY,
              viewportWidth: viewportWidth,
              viewportHeight: viewportHeight
            }
          }, response => {
            this.processScreenshotResponse(response, absoluteRect, captureMsg, true);
          });
        }
      }, 30); // 添加30毫秒延迟，足够DOM更新但不影响用户体验
    }
    
    // 处理截图响应的通用方法
    processScreenshotResponse(response, rect, captureMsg, isFullPageCapture = false) {
      // 恢复UI元素显示
      this.restoreUIElementsAfterCapture();
      
      // 移除提示
      if (captureMsg) captureMsg.remove();
      
      console.log("收到截图响应:", response?.success);
      
      if (response && response.success && response.dataUrl) {
        const image = new Image();
        
        image.onload = () => {
          console.log(`获取到截图，图像尺寸: ${image.width}x${image.height}`);
          
          // 如果是全页面截图，使用响应中的视口信息进行坐标计算
          const viewportInfo = isFullPageCapture ? response.viewportInfo : {
            scrollX: window.scrollX,
            scrollY: window.scrollY,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            dpr: window.devicePixelRatio || 1
          };
          
          // 计算裁剪区域在截图中的相对位置
          const captureRect = {
            left: rect.left - viewportInfo.scrollX,
            top: rect.top - viewportInfo.scrollY,
            width: rect.width,
            height: rect.height
          };
          
          console.log("视口信息:", viewportInfo);
          console.log("计算的裁剪区域:", captureRect);
          
          // 检查是否需要缩放调整(处理设备像素比)
          const scaleX = image.width / viewportInfo.viewportWidth;
          const scaleY = image.height / viewportInfo.viewportHeight;
          
          console.log(`缩放比例: DPR=${viewportInfo.dpr}, 计算比例=${scaleX}x${scaleY}`);
          
          // 应用缩放到裁剪区域
          const scaledRect = {
            left: Math.round(captureRect.left * scaleX),
            top: Math.round(captureRect.top * scaleY),
            width: Math.round(captureRect.width * scaleX),
            height: Math.round(captureRect.height * scaleY)
          };
          
          console.log("最终裁剪区域坐标:", scaledRect);
          
          // 检查裁剪区域是否在图像范围内
          const isRectInImage = (
            scaledRect.left >= 0 && 
            scaledRect.top >= 0 && 
            scaledRect.left + scaledRect.width <= image.width &&
            scaledRect.top + scaledRect.height <= image.height
          );
          
          if (!isRectInImage) {
            console.warn("裁剪区域部分超出图像范围，尝试调整");
            this.processPartialVisibleImage(image, scaledRect);
          } else {
            // 处理和保存截图
            this.processAndSaveImage(image, scaledRect);
          }
          
          // 显示成功提示
          this.showNotification(I18nHelper.getNotificationText('screenshotSaved'), 2000);
          
          // 如果在连续模式下，不结束截图，而是清除当前选择框
          if (this.isContinuousMode) {
            this.clearCurrentSelection();
          } else {
            // 非连续模式下结束截图
            this.end();
          }
        };
        
        image.onerror = (error) => {
          console.error("图片加载失败:", error);
          this.showNotification(I18nHelper.getNotificationText('screenshotLoadFailed'), 3000);
          this.end();
        };
        
        // 设置截图数据到图像对象
        image.src = response.dataUrl;
      } else {
        console.error("截图失败:", response?.error || '未知错误');
        this.showNotification(I18nHelper.getNotificationText('screenshotLoadFailed'), 3000);
        this.end();
      }
    }
    
    // 捕获并保存所有选择区域
    captureAndSaveAll() {
      if (!this.selection) {
        console.error("未找到当前选择框");
        return;
      }
      
      console.log("开始捕获所有选择区域");
      
      // 显示处理中提示
      const captureMsg = this.showNotification(I18nHelper.getNotificationText('processingAllAreas'));
      
      // 获取当前选择框和所有保存的选择
      const currentSelection = {
        left: Math.min(this.startX, this.endX),
        top: Math.min(this.startY, this.endY),
        width: Math.abs(this.endX - this.startX),
        height: Math.abs(this.endY - this.startY),
        // 添加当前选择的比例信息
        ratio: this.ratio
      };
      
      const allAreas = [
        ...this.selections.map(s => s.rect),
        currentSelection
      ];
      
      // 临时隐藏UI元素，确保截图不包含黑色蒙版和边框
      this.hideUIElementsForCapture();
      
      // 按顺序处理每个区域
      this.processAreasSequentially(allAreas, 0, captureMsg);
    }
    
    // 递归处理所有区域
    processAreasSequentially(areas, index, captureMsg) {
      // 所有区域处理完成
      if (index >= areas.length) {
        // 恢复UI元素显示
        this.restoreUIElementsAfterCapture();
        captureMsg.remove();
        
        console.log("所有区域处理完成");
        this.showNotification(I18nHelper.getNotificationText('allAreasSaved', areas.length), 3000);
        
        // 结束截图
        this.end();
        return;
      }
      
      // 获取当前要处理的区域
      const area = areas[index];
      captureMsg.textContent = `正在处理区域 ${index+1}/${areas.length}...`;
      
      // 临时保存当前比例，并设置为当前区域的比例
      const originalRatio = this.ratio;
      if (area.ratio) {
        this.ratio = area.ratio;
        console.log(`临时设置比例为区域 ${index+1} 的保存比例: ${area.ratio}`);
      }
      
      // 获取当前的滚动位置和视口信息
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // 检查区域是否在当前视口内
      const isAreaVisible = (
        area.left >= scrollX && 
        area.top >= scrollY && 
        area.left + area.width <= scrollX + viewportWidth &&
        area.top + area.height <= scrollY + viewportHeight
      );
      
      console.log(`处理区域 ${index+1}/${areas.length}`, area, isAreaVisible ? "在视口内" : "不在视口内");
      
      // 根据区域是否在视口内选择截图方法
      if (isAreaVisible) {
        chrome.runtime.sendMessage({ 
          action: 'captureScreen',
          debug: {
            scrollX: scrollX,
            scrollY: scrollY,
            viewportWidth: viewportWidth,
            viewportHeight: viewportHeight
          }
        }, response => {
          if (response && response.success && response.dataUrl) {
            this.processAreaScreenshot(response, area, index, areas, captureMsg, false, originalRatio);
          } else {
            console.error(`区域 ${index+1} 截图失败:`, response?.error || '未知错误');
            // 恢复原始比例
            this.ratio = originalRatio;
            // 继续处理下一个区域
            this.processAreasSequentially(areas, index + 1, captureMsg);
          }
        });
      } else {
        chrome.runtime.sendMessage({
          action: 'captureFullPage',
          targetArea: area,
          debug: {
            scrollX: scrollX,
            scrollY: scrollY,
            viewportWidth: viewportWidth,
            viewportHeight: viewportHeight
          }
        }, response => {
          if (response && response.success && response.dataUrl) {
            this.processAreaScreenshot(response, area, index, areas, captureMsg, true, originalRatio);
          } else {
            console.error(`区域 ${index+1} 全页面截图失败:`, response?.error || '未知错误');
            // 恢复原始比例
            this.ratio = originalRatio;
            // 继续处理下一个区域
            this.processAreasSequentially(areas, index + 1, captureMsg);
          }
        });
      }
    }
    
    // 处理区域截图
    processAreaScreenshot(response, area, index, areas, captureMsg, isFullPageCapture = false, originalRatio) {
      const image = new Image();
      
      image.onload = () => {
        console.log(`区域 ${index+1} 获取到截图，图像尺寸: ${image.width}x${image.height}`);
        
        // 如果是全页面截图，使用响应中的视口信息
        const viewportInfo = isFullPageCapture ? response.viewportInfo : {
          scrollX: window.scrollX,
          scrollY: window.scrollY,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          dpr: window.devicePixelRatio || 1
        };
        
        // 计算裁剪区域在截图中的相对位置
        const captureRect = {
          left: area.left - viewportInfo.scrollX,
          top: area.top - viewportInfo.scrollY,
          width: area.width,
          height: area.height
        };
        
        // 检查是否需要缩放调整
        const scaleX = image.width / viewportInfo.viewportWidth;
        const scaleY = image.height / viewportInfo.viewportHeight;
        
        // 应用缩放到裁剪区域
        const scaledRect = {
          left: Math.round(captureRect.left * scaleX),
          top: Math.round(captureRect.top * scaleY),
          width: Math.round(captureRect.width * scaleX),
          height: Math.round(captureRect.height * scaleY)
        };
        
        console.log(`区域 ${index+1} 最终裁剪区域:`, scaledRect);
        
        try {
          // 处理和保存截图
          this.processAndSaveImage(image, scaledRect, index);
        } catch (error) {
          console.error(`区域 ${index+1} 处理失败:`, error);
        }
        
        // 恢复原始比例
        if (originalRatio) {
          this.ratio = originalRatio;
          console.log(`区域 ${index+1} 处理完成，恢复原始比例: ${originalRatio}`);
        }
        
        // 继续处理下一个区域
        setTimeout(() => {
          this.processAreasSequentially(areas, index + 1, captureMsg);
        }, 300); // 添加短暂延迟，避免浏览器限制
      };
      
      image.onerror = (error) => {
        console.error(`区域 ${index+1} 图片加载失败:`, error);
        
        // 恢复原始比例
        if (originalRatio) {
          this.ratio = originalRatio;
          console.log(`区域 ${index+1} 加载失败，恢复原始比例: ${originalRatio}`);
        }
        
        // 继续处理下一个区域
        this.processAreasSequentially(areas, index + 1, captureMsg);
      };
      
      // 设置图像源
      image.src = response.dataUrl;
    }
    
    // 处理部分可见的图像
    processPartialVisibleImage(image, rect) {
      console.log("尝试处理部分可见的图像区域");
      
      try {
        // 创建Canvas
        const canvas = document.createElement('canvas');
        canvas.width = rect.width;
        canvas.height = rect.height;
        const ctx = canvas.getContext('2d', { alpha: false });
        
        if (!ctx) {
          console.error("无法获取Canvas上下文");
          return;
        }
        
        // 填充白色背景
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 计算可见的部分
        const visiblePart = {
          left: Math.max(0, rect.left),
          top: Math.max(0, rect.top),
          right: Math.min(image.width, rect.left + rect.width),
          bottom: Math.min(image.height, rect.top + rect.height)
        };
        
        // 计算可见部分的宽度和高度
        const visibleWidth = visiblePart.right - visiblePart.left;
        const visibleHeight = visiblePart.bottom - visiblePart.top;
        
        // 如果可见部分太小，报错提示
        if (visibleWidth < 10 || visibleHeight < 10) {
          console.error("可见部分太小，无法截图");
          this.showNotification(I18nHelper.getNotificationText('areaNotVisible'), 3000);
          return;
        }
        
        // 计算可见部分在canvas中的位置
        const canvasX = visiblePart.left - rect.left;
        const canvasY = visiblePart.top - rect.top;
        
        console.log("绘制可见部分:", {
          source: {
            x: visiblePart.left,
            y: visiblePart.top,
            width: visibleWidth,
            height: visibleHeight
          },
          destination: {
            x: canvasX,
            y: canvasY,
            width: visibleWidth,
            height: visibleHeight
          }
        });
        
        // 只绘制可见部分
        ctx.drawImage(
          image,
          visiblePart.left, visiblePart.top, visibleWidth, visibleHeight,
          canvasX, canvasY, visibleWidth, visibleHeight
        );
        
        // 转换为图像数据并保存，使用用户设置的质量
        const dataUrl = canvas.toDataURL(
          this.saveFormat === 'jpg' ? 'image/jpeg' : 'image/png', 
          this.imageQuality
        );
        this.saveImageToFile(dataUrl, this.saveFormat);
        
        // 显示部分可见的提示
        this.showNotification(I18nHelper.getNotificationText('partiallyVisible'), 3000);
        
        // 如果在连续模式下，不结束截图，而是清除当前选择框
        if (this.isContinuousMode) {
          this.clearCurrentSelection();
        } else {
          // 非连续模式下结束截图
          this.end();
        }
      } catch (error) {
        console.error("处理部分可见图像时出错:", error);
        this.showNotification(I18nHelper.getNotificationText('processingError', error.message), 3000);
        this.end();
      }
    }
    
    // 处理并保存图像
    processAndSaveImage(image, rect, index = 0) {
      const startTime = performance.now();
      
      // 为保存创建画布
        const canvas = document.createElement('canvas');
        canvas.width = rect.width;
        canvas.height = rect.height;
      
      const ctx = canvas.getContext('2d');
      
      // 确保图片绘制在正确位置（考虑到部分可见的滚动元素）
          ctx.drawImage(
            image,
        0, 0, rect.width, rect.height,
            0, 0, rect.width, rect.height
          );
          
      // 获取图像质量
      let quality = 1.0;
      
      // 依据保存格式选择合适的MIME类型
      let mimeType;
      let format = this.saveFormat || 'png';
      
      if (format === 'jpg' || format === 'jpeg') {
        mimeType = 'image/jpeg';
        quality = 0.95; // JPEG默认使用较高质量
        } else {
        mimeType = 'image/png';
      }
      
      try {
        // 转换为dataURL
        const dataUrl = canvas.toDataURL(mimeType, quality);
        
        // 计算处理时间
        const processTime = Math.round(performance.now() - startTime);
        console.log(`图像处理耗时: ${processTime}ms`);
        
        // 保存最近截图数据到background
        chrome.runtime.sendMessage({
          action: 'saveLastScreenshotData',
          dataUrl: dataUrl
        });
        
        // 发送到background脚本进行保存
        chrome.runtime.sendMessage({
          action: 'saveScreenshot',
          dataUrl: dataUrl,
          format: format,
          suffix: index > 0 ? `_${index}` : ''
        }, (response) => {
          if (response && response.success) {
            this.showNotification(`截图已保存 (${Math.round(dataUrl.length / 1024)} KB)`, 3000);
          } else {
            const error = response ? response.error : "未知错误";
            this.showNotification(`保存失败: ${error}`, 5000);
          }
        });
        
        return true;
      } catch (error) {
        console.error('保存图像失败:', error);
        this.showNotification(`保存失败: ${error.message || '未知错误'}`, 5000);
        return false;
      }
    }
    
    // 保存图像到文件
    saveImageToFile(dataUrl, format, index = 0) {
      // 添加序号到文件名
      const filenameSuffix = this.selections.length > 0 ? `-${index+1}` : '';
      
      console.log(`保存图像 ${index+1}，数据大小: ${dataUrl.length}`);
      
      chrome.runtime.sendMessage({
        action: 'saveScreenshot',
        dataUrl: dataUrl,
        format: format,
        suffix: filenameSuffix
      }, saveResponse => {
        if (saveResponse && saveResponse.success) {
          console.log(`区域 ${index+1} 保存成功`);
        } else {
          console.error(`区域 ${index+1} 保存失败:`, saveResponse?.error || '未知错误');
          this.showNotification(I18nHelper.getNotificationText('saveFailed', saveResponse?.error || '未知错误'), 3000);
        }
      });
    }
    
    // 启动新选择流程（用于创建新的选择框）
    startNewSelection() {
      // 如果有锁定的尺寸，在创建新选择框时展示提示
      if (this.isLockSize && this.lockedWidth > 0 && this.lockedHeight > 0) {
        const sizeHint = document.createElement('div');
        sizeHint.className = 'ratio-screenshot-notification';
        sizeHint.textContent = `已锁定尺寸: ${this.lockedWidth} × ${this.lockedHeight}，点击确定选择位置`;
        document.body.appendChild(sizeHint);
        
        // 3秒后自动隐藏提示
        setTimeout(() => {
          sizeHint.style.opacity = '0';
          sizeHint.style.transition = 'opacity 0.5s';
          setTimeout(() => sizeHint.remove(), 500);
        }, 3000);
      }
    }
    
    // 查找鼠标附近元素的边缘
    findNearestElementEdges(mouseX, mouseY) {
      // 创建一个结果对象，存储水平和垂直边缘
      const edges = {
        horizontal: [], // 存储水平边缘 (top, bottom)
        vertical: []    // 存储垂直边缘 (left, right)
      };
      
      // 查找搜索范围内的元素 - 减小搜索半径使吸附更准确
      const searchRadius = 50; // 减小搜索半径
      const elements = this.getElementsNearPoint(mouseX, mouseY, searchRadius);
      
      // 分析每个元素的边缘
      for (const element of elements) {
        const rect = element.getBoundingClientRect();
        
        // 转换为文档绝对坐标
        const absoluteRect = {
          left: rect.left + window.scrollX,
          top: rect.top + window.scrollY,
          right: rect.right + window.scrollX,
          bottom: rect.bottom + window.scrollY,
          width: rect.width,
          height: rect.height
        };
        
        // 只考虑有实际可见大小的元素，忽略太小的元素
        if (absoluteRect.width < 10 || absoluteRect.height < 10) continue;
        
        // 添加水平边缘 (left, right)
        edges.horizontal.push({
          x: absoluteRect.left,
          top: absoluteRect.top,
          bottom: absoluteRect.bottom,
          element: element,
          type: 'left'
        });
        
        edges.horizontal.push({
          x: absoluteRect.right,
          top: absoluteRect.top,
          bottom: absoluteRect.bottom,
          element: element,
          type: 'right'
        });
        
        // 添加水平中心线
        const centerX = absoluteRect.left + (absoluteRect.width / 2);
        edges.horizontal.push({
          x: centerX,
          top: absoluteRect.top,
          bottom: absoluteRect.bottom,
          element: element,
          type: 'centerX'
        });
        
        // 添加垂直边缘 (top, bottom)
        edges.vertical.push({
          y: absoluteRect.top,
          left: absoluteRect.left,
          right: absoluteRect.right,
          element: element,
          type: 'top'
        });
        
        edges.vertical.push({
          y: absoluteRect.bottom,
          left: absoluteRect.left,
          right: absoluteRect.right,
          element: element,
          type: 'bottom'
        });
        
        // 添加垂直中心线
        const centerY = absoluteRect.top + (absoluteRect.height / 2);
        edges.vertical.push({
          y: centerY,
          left: absoluteRect.left,
          right: absoluteRect.right,
          element: element,
          type: 'centerY'
        });
      }
      
      // 根据到鼠标的距离排序边缘
      edges.horizontal.sort((a, b) => Math.abs(mouseX - a.x) - Math.abs(mouseX - b.x));
      edges.vertical.sort((a, b) => Math.abs(mouseY - a.y) - Math.abs(mouseY - b.y));
      
      // 保留最近的几个边缘，减少选择干扰
      this.nearestEdges = {
        horizontal: edges.horizontal.slice(0, 3),
        vertical: edges.vertical.slice(0, 3)
      };
    }
    
    // 获取鼠标附近的元素
    getElementsNearPoint(x, y, radius) {
      const elements = [];
      const centerX = x;
      const centerY = y;
      
      // 查找视口内的所有可见元素
      const allElements = document.querySelectorAll('*');
      
      for (const element of allElements) {
        // 跳过我们自己的界面元素
        if (element.id === 'ratio-screenshot-overlay' || 
            element.id === 'ratio-screenshot-selection' ||
            element.id === 'ratio-screenshot-toolbar' ||
            element.classList.contains('ratio-screenshot-selection-saved') ||
            element.classList.contains('ratio-screenshot-magnetic-guide') ||
            element.classList.contains('ratio-screenshot-element-highlight')) {
          continue;
        }
        
        // 跳过不可见元素
        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
          continue;
        }
        
        const rect = element.getBoundingClientRect();
        
        // 转换为文档绝对坐标
        const absoluteRect = {
          left: rect.left + window.scrollX,
          top: rect.top + window.scrollY,
          right: rect.right + window.scrollX,
          bottom: rect.bottom + window.scrollY,
          width: rect.width,
          height: rect.height
        };
        
        // 检查元素是否在搜索半径内
        if (absoluteRect.left <= centerX + radius && 
            absoluteRect.right >= centerX - radius && 
            absoluteRect.top <= centerY + radius && 
            absoluteRect.bottom >= centerY - radius) {
          elements.push(element);
        }
      }
      
      return elements;
    }
    
    // 显示水平磁性辅助线
    showHorizontalMagneticGuide(y) {
      // 清除之前的水平辅助线
      this.clearMagneticGuides('horizontal');
      
      // 创建新的水平辅助线 - 但实际不会显示因为CSS已设置opacity为0
      const guide = document.createElement('div');
      guide.className = 'ratio-screenshot-magnetic-guide horizontal';
      guide.style.top = `${y - window.scrollY}px`; // 注意转换为视口坐标
      
      document.body.appendChild(guide);
      this.magneticGuides.horizontal = guide;
      
      // 不再添加闪烁动画效果，因为已经隐藏了辅助线
    }
    
    // 显示垂直磁性辅助线
    showVerticalMagneticGuide(x) {
      // 清除之前的垂直辅助线
      this.clearMagneticGuides('vertical');
      
      // 创建新的垂直辅助线 - 但实际不会显示因为CSS已设置opacity为0
      const guide = document.createElement('div');
      guide.className = 'ratio-screenshot-magnetic-guide vertical';
      guide.style.left = `${x - window.scrollX}px`; // 注意转换为视口坐标
      
      document.body.appendChild(guide);
      this.magneticGuides.vertical = guide;
      
      // 不再添加闪烁动画效果，因为已经隐藏了辅助线
    }
    
    // 清除磁性辅助线
    clearMagneticGuides(type = 'all') {
      if (type === 'all' || type === 'horizontal') {
        if (this.magneticGuides.horizontal) {
          this.magneticGuides.horizontal.remove();
          this.magneticGuides.horizontal = null;
        }
      }
      
      if (type === 'all' || type === 'vertical') {
        if (this.magneticGuides.vertical) {
          this.magneticGuides.vertical.remove();
          this.magneticGuides.vertical = null;
        }
      }
    }
    
    // 结束截图流程
    end() {
      console.log("结束截图流程");
      
      // 如果处于智能检查模式，先禁用它
      if (this.isInspecting) {
        this.disableInspection();
      }
      
      // 移除事件监听器
      this.removeEventListeners();
      
      // 清除当前选择框
      this.clearCurrentSelection();
      
      // 清除磁性辅助线
      this.clearMagneticGuides();
      
      // 清除所有已保存的选择预览
      this.selections.forEach(selection => {
        if (selection.element) {
          selection.element.remove();
        }
      });
      
      // 重置状态
      this.isActive = false;
      this.isSelecting = false;
      this.startX = 0;
      this.startY = 0;
      this.endX = 0;
      this.endY = 0;
      this.isLockSize = false;
      this.lockedWidth = 0;
      this.lockedHeight = 0;
      this.nearestEdges = null;
      
      try {
        // 清理所有DOM元素 - 使用安全的方式进行
        this.safeRemove('ratio-screenshot-overlay');
        this.safeRemove('ratio-screenshot-selection');
        this.safeRemove('ratio-screenshot-toolbar');
        this.safeRemove('ratio-screenshot-inspect-cancel');
        
        // 清理所有类名元素
        this.safeRemoveAll('.ratio-screenshot-magnetic-guide');
        this.safeRemoveAll('.ratio-screenshot-element-highlight');
        this.safeRemoveAll('.ratio-screenshot-resize-handle');
        this.safeRemoveAll('.ratio-screenshot-selection-saved');
        this.safeRemoveAll('.ratio-screenshot-notification');
        
        // 清空引用
        this.overlay = null;
        this.selection = null;
        this.infoPanel = null;
        this.toolbar = null;
        this.selections = [];
        
        console.log("截图流程已结束，所有资源已清理");
      } catch (error) {
        console.error("清理资源时出错:", error);
        
        // 即使出错也尝试强制清理
        this.cleanupExistingElements();
      }
    }
    
    // 安全移除单个元素
    safeRemove(id) {
      try {
        const element = document.getElementById(id);
        if (element) {
          element.remove();
        }
      } catch (e) {
        console.warn(`移除元素 ${id} 时出错:`, e);
      }
    }
    
    // 安全移除多个元素
    safeRemoveAll(selector) {
      try {
        document.querySelectorAll(selector).forEach(el => {
          el.remove();
        });
      } catch (e) {
        console.warn(`移除选择器 ${selector} 的元素时出错:`, e);
      }
    }
    
    // 根据比例调整选择框大小
    adjustSelectionToRatio() {
      if (!this.selection || this.ratio === 'free') return;
      
      try {
        // 解析比例
        const [widthRatio, heightRatio] = this.ratio.split(':').map(Number);
        
        if (widthRatio > 0 && heightRatio > 0) {
          // 获取当前选择框的中心点
          const centerX = (this.startX + this.endX) / 2;
          const centerY = (this.startY + this.endY) / 2;
          
          // 计算当前宽度和高度
          const currentWidth = Math.abs(this.endX - this.startX);
          const currentHeight = Math.abs(this.endY - this.startY);
          
          // 决定是根据宽度还是高度来调整 - 保持较大的尺寸不变
          let newWidth, newHeight;
          
          if (currentWidth / currentHeight > widthRatio / heightRatio) {
            // 当前更宽，保持宽度不变，调整高度
            newWidth = currentWidth;
            newHeight = currentWidth * (heightRatio / widthRatio);
          } else {
            // 当前更高，保持高度不变，调整宽度
            newHeight = currentHeight;
            newWidth = currentHeight * (widthRatio / heightRatio);
          }
          
          // 从中心点计算新的起始点和结束点
          const halfWidth = newWidth / 2;
          const halfHeight = newHeight / 2;
          
          // 确定起始点和结束点的方向
          const directionX = this.endX >= this.startX ? 1 : -1;
          const directionY = this.endY >= this.startY ? 1 : -1;
          
          // 更新起始点和结束点，保持相对方向不变
          this.startX = centerX - halfWidth * directionX;
          this.startY = centerY - halfHeight * directionY;
          this.endX = centerX + halfWidth * directionX;
          this.endY = centerY + halfHeight * directionY;
          
          console.log(`根据比例 ${this.ratio} 调整选择框大小为 ${newWidth} × ${newHeight}`);
          
          // 更新选择框显示
          this.updateSelectionSize();
          
          // 更新信息面板
          if (this.infoPanel) {
            this.infoPanel.textContent = `${Math.round(newWidth)} × ${Math.round(newHeight)} (${this.ratio})`;
          }
        }
      } catch (error) {
        console.error("调整选择框比例时出错:", error);
      }
    }
    
    // 临时隐藏截图工具UI元素，确保不会出现在截图中
    hideUIElementsForCapture() {
      console.log("临时隐藏UI元素以进行截图");
      
      // 保存原始可见性状态以便恢复
      this.originalOverlayVisibility = this.overlay ? this.overlay.style.visibility : null;
      this.originalSelectionVisibility = this.selection ? this.selection.style.visibility : null;
      this.originalToolbarVisibility = this.toolbar ? this.toolbar.style.visibility : null;
      this.originalEventBlockerVisibility = this.eventBlocker ? this.eventBlocker.style.visibility : null;
      
      // 隐藏所有相关UI元素
      if (this.overlay) this.overlay.style.visibility = 'hidden';
      if (this.eventBlocker) this.eventBlocker.style.visibility = 'hidden';
      if (this.selection) {
        // 保存选择框的原始样式
        this.originalSelectionStyles = {
          border: this.selection.style.border,
          outline: this.selection.style.outline,
          boxShadow: this.selection.style.boxShadow,
          backgroundColor: this.selection.style.backgroundColor,
          opacity: this.selection.style.opacity,
          pointerEvents: this.selection.style.pointerEvents
        };
        
        // 确保完全移除选择框的所有边框、轮廓和阴影效果
        this.selection.style.border = 'none';
        this.selection.style.outline = 'none';
        this.selection.style.boxShadow = 'none';
        this.selection.style.backgroundColor = 'transparent';
        this.selection.style.opacity = '0';
        this.selection.style.pointerEvents = 'none';
        
        // 临时隐藏任何可能的伪元素样式和子元素
        const tempStyleElement = document.createElement('style');
        tempStyleElement.id = 'ratio-screenshot-temp-style';
        tempStyleElement.textContent = `
          #${this.selection.id}, 
          #${this.selection.id}::before, 
          #${this.selection.id}::after,
          #${this.selection.id} * {
            display: block !important;
            opacity: 0 !important;
            visibility: hidden !important;
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
            background-color: transparent !important;
            pointer-events: none !important;
          }
          
          .ratio-screenshot-selection-saved,
          .ratio-screenshot-selection-saved::before,
          .ratio-screenshot-selection-saved::after {
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
          }
          
          .ratio-screenshot-resize-handle,
          .ratio-screenshot-magnetic-guide,
          .ratio-screenshot-element-highlight {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
          }
        `;
        document.head.appendChild(tempStyleElement);
        this.tempStyleElement = tempStyleElement;
      }
      
      if (this.toolbar) this.toolbar.style.visibility = 'hidden';
      
      // 隐藏所有调整手柄
      const resizeHandles = document.querySelectorAll('.ratio-screenshot-resize-handle');
      this.hiddenResizeHandles = [];
      resizeHandles.forEach(handle => {
        this.hiddenResizeHandles.push({
          element: handle,
          originalVisibility: handle.style.visibility,
          originalOpacity: handle.style.opacity,
          originalDisplay: handle.style.display
        });
        handle.style.visibility = 'hidden';
        handle.style.opacity = '0';
        handle.style.display = 'none';
      });
      
      // 隐藏所有通知消息
      const notifications = document.querySelectorAll('.ratio-screenshot-notification');
      this.hiddenNotifications = [];
      notifications.forEach(notification => {
        this.hiddenNotifications.push({
          element: notification,
          originalVisibility: notification.style.visibility,
          originalOpacity: notification.style.opacity,
          originalDisplay: notification.style.display
        });
        notification.style.visibility = 'hidden';
        notification.style.opacity = '0';
        notification.style.display = 'none';
      });
      
      // 隐藏所有已保存的选择预览
      this.selections.forEach(selection => {
        if (selection.element) {
          selection.originalStyles = {
            visibility: selection.element.style.visibility,
            opacity: selection.element.style.opacity,
            border: selection.element.style.border,
            outline: selection.element.style.outline,
            boxShadow: selection.element.style.boxShadow,
            backgroundColor: selection.element.style.backgroundColor
          };
          selection.element.style.visibility = 'hidden';
          selection.element.style.opacity = '0';
          selection.element.style.border = 'none';
          selection.element.style.outline = 'none';
          selection.element.style.boxShadow = 'none';
          selection.element.style.backgroundColor = 'transparent';
        }
      });
      
      // 隐藏所有磁性吸附参考线
      this.clearMagneticGuides('all');
      
      // 隐藏元素高亮
      const highlights = document.querySelectorAll('.ratio-screenshot-element-highlight');
      highlights.forEach(highlight => {
        highlight.style.display = 'none';
        highlight.style.opacity = '0';
        highlight.style.visibility = 'hidden';
      });
    }
    
    // 恢复UI元素的可见性
    restoreUIElementsAfterCapture() {
      console.log("恢复UI元素可见性");
      
      // 恢复UI元素可见性
      if (this.overlay && this.originalOverlayVisibility !== null) {
        this.overlay.style.visibility = this.originalOverlayVisibility;
      }
      
      if (this.eventBlocker && this.originalEventBlockerVisibility !== null) {
        this.eventBlocker.style.visibility = this.originalEventBlockerVisibility;
      }
      
      if (this.selection) {
        if (this.originalSelectionVisibility !== null) {
          this.selection.style.visibility = this.originalSelectionVisibility;
        }
        
        // 恢复选择框的所有原始样式
        if (this.originalSelectionStyles) {
          Object.entries(this.originalSelectionStyles).forEach(([property, value]) => {
            if (value !== undefined) {
              this.selection.style[property] = value;
            }
          });
        }
        
        // 移除临时样式表
        if (this.tempStyleElement) {
          this.tempStyleElement.remove();
          this.tempStyleElement = null;
        }
      }
      
      if (this.toolbar && this.originalToolbarVisibility !== null) {
        this.toolbar.style.visibility = this.originalToolbarVisibility;
      }
      
      // 恢复调整手柄的可见性
      if (this.hiddenResizeHandles && this.hiddenResizeHandles.length > 0) {
        this.hiddenResizeHandles.forEach(item => {
          if (item.element) {
            item.element.style.visibility = item.originalVisibility;
            item.element.style.opacity = item.originalOpacity;
            item.element.style.display = item.originalDisplay;
          }
        });
        this.hiddenResizeHandles = [];
      }
      
      // 恢复通知消息的可见性
      if (this.hiddenNotifications && this.hiddenNotifications.length > 0) {
        this.hiddenNotifications.forEach(item => {
          if (item.element) {
            item.element.style.visibility = item.originalVisibility;
            item.element.style.opacity = item.originalOpacity;
            item.element.style.display = item.originalDisplay;
          }
        });
        this.hiddenNotifications = [];
      }
      
      // 恢复所有已保存的选择预览
      this.selections.forEach(selection => {
        if (selection.element && selection.originalStyles) {
          Object.entries(selection.originalStyles).forEach(([property, value]) => {
            if (value !== undefined) {
              selection.element.style[property] = value;
            }
          });
        }
      });
    }
    
    // 显示自动消失的通知
    showNotification(message, duration = 3000) {
      // 移除现有通知
      const existingNotifications = document.querySelectorAll('.ratio-screenshot-notification');
      existingNotifications.forEach(notification => notification.remove());
      
      // 创建新通知
      const notification = document.createElement('div');
      notification.className = 'ratio-screenshot-notification';
      notification.textContent = message;
      notification.style.bottom = '20px';
      notification.style.top = 'auto';
      
      document.body.appendChild(notification);
      
      // 设置自动消失
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        
        // 完全移除元素
        setTimeout(() => notification.remove(), 500);
      }, duration);
      
      return notification;
    }

    // 启用元素检查模式
    enableInspection() {
      this.isInspecting = true;
      this.isActive = true; // 添加这一行，标记截图模式为激活状态
      
      // 创建事件阻止层，用于阻止与页面元素的交互
      this.eventBlocker = document.createElement('div');
      this.eventBlocker.id = 'ratio-screenshot-event-blocker';
      this.eventBlocker.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: transparent;
        z-index: 9998;
        cursor: crosshair;
        pointer-events: all;
      `;
      document.body.appendChild(this.eventBlocker);
      
      // 创建高亮显示的元素
      this.highlightElement = document.createElement('div');
      this.highlightElement.style.cssText = `
        position: absolute;
        pointer-events: none;
        z-index: 10000;
        background: rgba(130, 180, 230, 0.2);
        border: 2px solid #5166d6;
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5);
        display: none;
        transition: all 0.2s ease;
        border-radius: 3px;
      `;
      
      // 添加尺寸指示器
      const sizeIndicator = document.createElement('div');
      sizeIndicator.style.cssText = `
        position: absolute;
        top: -25px;
        left: 50%;
        transform: translateX(-50%);
        background: #5166d6;
        color: white;
        padding: 2px 8px;
        border-radius: 3px;
        font-size: 12px;
        pointer-events: none;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.2s ease;
      `;
      this.highlightElement.appendChild(sizeIndicator);
      this.sizeIndicator = sizeIndicator;
      
      document.body.appendChild(this.highlightElement);
      
      // 添加悬浮的取消按钮
      const cancelButton = document.createElement('div');
      cancelButton.id = 'ratio-screenshot-inspect-cancel';
      cancelButton.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fff;
        color: #333;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 8px 16px;
        font-size: 14px;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        z-index: 10001;
        user-select: none;
        transition: all 0.2s ease;
      `;
      cancelButton.textContent = I18nHelper.getNotificationText('escape');
      
      // 悬停效果
      cancelButton.addEventListener('mouseover', () => {
        cancelButton.style.background = '#f5f5f5';
      });
      cancelButton.addEventListener('mouseout', () => {
        cancelButton.style.background = '#fff';
      });
      
      // 点击事件
      cancelButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("取消按钮被点击，退出智能检查模式");
        this.disableInspection();
        this.end();
      });
      
      document.body.appendChild(cancelButton);
      this.cancelButton = cancelButton;
      
      // 修改鼠标样式
      document.body.style.cursor = 'crosshair';

      // 使用我们自定义的事件处理来管理交互
      this.eventBlocker.addEventListener('mousemove', this.handleInspectorMouseMove.bind(this));
      this.eventBlocker.addEventListener('click', this.handleInspectorClick.bind(this));
      this.eventBlocker.addEventListener('wheel', (e) => {
        // 允许滚动事件通过
        // 注意：阻止冒泡但不阻止默认行为
        e.stopPropagation();
      }, { passive: true });
      
      // 滚动事件仍需全局监听
      window.addEventListener('scroll', this.handleInspectorScroll.bind(this));
      
      // 添加键盘事件监听器 - 使用bind确保this指向正确
      // 确保同一个函数实例被用于添加和移除事件监听器
      this.boundHandleKeyDown = this.handleKeyDown.bind(this);
      document.addEventListener('keydown', this.boundHandleKeyDown);
      
      // 显示提示
      this.showNotification(I18nHelper.getNotificationText('smartModeEnabled'), 2000);
    }
    
    // 处理检查模式下的鼠标移动
    handleInspectorMouseMove(e) {
      if (!this.isInspecting) return;
      
      // 在获取元素前临时禁用事件阻止层的指针事件
      if (this.eventBlocker) {
        this.eventBlocker.style.pointerEvents = 'none';
      }
      
      // 检查并高亮鼠标下方的元素
      const element = document.elementFromPoint(e.clientX, e.clientY);
      
      // 立即重新启用事件阻止层的指针事件
      if (this.eventBlocker) {
        this.eventBlocker.style.pointerEvents = 'all';
      }
      
      if (element) {
        this.updateHighlight(element);
        this.currentElement = element;
      }
    }
    
    // 更新高亮显示
    updateHighlight(element) {
      if (!element || !this.highlightElement) return;

      // 获取元素位置和大小
      const rect = element.getBoundingClientRect();
      
      // 计算页面滚动量
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      // 更新高亮元素的位置和大小
      this.highlightElement.style.display = 'block';
      this.highlightElement.style.top = `${rect.top + scrollY}px`;
      this.highlightElement.style.left = `${rect.left + scrollX}px`;
      this.highlightElement.style.width = `${rect.width}px`;
      this.highlightElement.style.height = `${rect.height}px`;
      
      // 更新尺寸指示器
      if (this.sizeIndicator) {
        this.sizeIndicator.textContent = `${Math.round(rect.width)} × ${Math.round(rect.height)}`;
        this.sizeIndicator.style.opacity = '1';
        
        // 如果元素靠近顶部，将尺寸指示器显示在底部
        if (rect.top < 40) {
          this.sizeIndicator.style.top = 'auto';
          this.sizeIndicator.style.bottom = '-25px';
        } else {
          this.sizeIndicator.style.top = '-25px';
          this.sizeIndicator.style.bottom = 'auto';
        }
      }
      
      // 添加动画效果
      this.highlightElement.style.transform = 'scale(1.02)';
      setTimeout(() => {
        this.highlightElement.style.transform = 'scale(1)';
      }, 100);
    }

    // 处理检查模式下的滚动
    handleInspectorScroll() {
      if (this.isInspecting && this.currentElement) {
        this.updateHighlight(this.currentElement);
      }
    }
    
    // 处理检查模式下的点击
    handleInspectorClick(e) {
      if (!this.isInspecting) return;
      
      // 重要：阻止事件传递给页面元素，避免改变页面状态
      e.preventDefault();
      e.stopPropagation();

      // 确保有选中的元素
      if (!this.currentElement) {
        console.log("未找到要截图的元素");
        return;
      }

      // 获取选中元素的位置和大小
      const rect = this.currentElement.getBoundingClientRect();
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      // 关闭检查模式
      this.disableInspection();

      // 切换到截图模式，并设置选区
      this.ratio = 'free'; // 使用自由比例
      
      // 设置标志以在连续截图时保持智能检查模式
      this.isInspectMode = true;
      
      // 启动截图流程 - 保持在智能检查模式
      this.isActive = true;

      // 创建选择框
      this.selection = document.createElement('div');
      this.selection.id = 'ratio-screenshot-selection';
      
      // 设置选择框的位置和大小
      const left = rect.left + scrollX;
      const top = rect.top + scrollY;
      const width = rect.width;
      const height = rect.height;
      
      // 更新内部坐标记录
      this.startX = left;
      this.startY = top;
      this.endX = left + width;
      this.endY = top + height;
      
      // 创建信息面板
      this.infoPanel = document.createElement('div');
      this.infoPanel.id = 'ratio-screenshot-info';
      this.selection.appendChild(this.infoPanel);
      
      document.body.appendChild(this.selection);
      
      // 更新选择框显示
      this.updateSelectionSize();
      
      // 添加调整大小的手柄
      this.addResizeHandles();
      
      // 创建工具栏
      this.createToolbar();
      
      // 添加选择框移动功能
      this.makeSelectionMovable();
      
      // 重新添加键盘事件监听器，确保快捷键正常工作
      this.boundHandleKeyDown = this.boundHandleKeyDown || this.handleKeyDown.bind(this);
      document.addEventListener('keydown', this.boundHandleKeyDown);
    }

    // 禁用元素检查模式
    disableInspection() {
      this.isInspecting = false;
      // 如果不立即要切换到截图模式，则完全退出
      if (!this.selection) {
        this.isActive = false;
      }
      
      // 恢复鼠标样式
      document.body.style.cursor = '';
      
      // 移除事件阻止层
      if (this.eventBlocker) {
        this.eventBlocker.remove();
        this.eventBlocker = null;
      }
      
      // 移除事件监听器
      window.removeEventListener('scroll', this.handleInspectorScroll.bind(this));
      
      // 移除键盘事件监听器 - 使用保存的绑定函数
      if (this.boundHandleKeyDown) {
        document.removeEventListener('keydown', this.boundHandleKeyDown);
      }
      
      // 添加淡出动画
      if (this.highlightElement) {
        this.highlightElement.style.opacity = '0';
        setTimeout(() => {
          if (this.highlightElement) {
            this.highlightElement.remove();
            this.highlightElement = null;
          }
        }, 200);
      }
      
      // 移除取消按钮
      if (this.cancelButton) {
        this.cancelButton.remove();
        this.cancelButton = null;
      }
      
      this.currentElement = null;
    }

    // 将选定区域的截图复制到剪贴板
    copyToClipboard() {
      if (!this.selection) {
        console.error("未找到选择框，无法复制");
        return;
      }
      
      console.log("开始复制当前选择区域到剪贴板");
      
      // 显示处理中提示
      const copyMsg = this.showNotification(I18nHelper.getNotificationText('processing'));
      
      // 使用我们跟踪的绝对坐标进行截图
      const captureRect = {
        left: Math.min(this.startX, this.endX),
        top: Math.min(this.startY, this.endY),
        width: Math.abs(this.endX - this.startX),
        height: Math.abs(this.endY - this.startY)
      };
      
      console.log("复制区域坐标(绝对):", captureRect);
      
      // 获取当前的滚动位置和视口尺寸
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // 检查选择区域是否在视口范围内
      const isRectVisible = (
        captureRect.left >= scrollX && 
        captureRect.top >= scrollY && 
        captureRect.left + captureRect.width <= scrollX + viewportWidth &&
        captureRect.top + captureRect.height <= scrollY + viewportHeight
      );
      
      // 临时隐藏UI元素，确保截图不包含黑色蒙版和边框
      this.hideUIElementsForCapture();
      
      // 添加短延迟确保DOM更新已渲染
      setTimeout(() => {
        // 根据区域是否在当前视口内，选择不同的截图方法
        if (isRectVisible) {
          console.log("选择区域在当前视口内，使用标准截图方法");
          
          // 区域在视口内，使用常规方法截图
          chrome.runtime.sendMessage({ 
            action: 'captureScreen'
          }, response => {
            // 恢复UI元素
            this.restoreUIElementsAfterCapture();
            
            if (response && response.success) {
              // 处理截图数据
              const image = new Image();
              image.onload = () => {
                // 将绝对坐标转换为图像相对坐标 (为了应对设备像素比)
                const devicePixelRatio = window.devicePixelRatio || 1;
                const imageRect = {
                  left: Math.round((captureRect.left - scrollX) * devicePixelRatio),
                  top: Math.round((captureRect.top - scrollY) * devicePixelRatio),
                  width: Math.round(captureRect.width * devicePixelRatio),
                  height: Math.round(captureRect.height * devicePixelRatio)
                };
                
                // 剪切并转换为blob
                this.processImageForClipboard(image, imageRect, copyMsg);
              };
              
              image.onerror = () => {
                console.error("图像加载失败");
                copyMsg.textContent = I18nHelper.getNotificationText('copyFailed');
                setTimeout(() => copyMsg.remove(), 2000);
              };
              
              // 加载图像
              image.src = response.dataUrl;
            } else {
              console.error("截图失败:", response?.error || "未知错误");
              copyMsg.textContent = I18nHelper.getNotificationText('copyFailed', response?.error || "未知错误");
              setTimeout(() => copyMsg.remove(), 2000);
            }
          });
        } else {
          console.log("选择区域不完全在当前视口内，使用滚动截图方法");
          
          // 区域不完全在视口内，通知后台脚本使用分块截图
          chrome.runtime.sendMessage({
            action: 'captureFullPage',
            targetArea: captureRect
          }, response => {
            // 恢复UI元素
            this.restoreUIElementsAfterCapture();
            
            if (response && response.success) {
              // 处理截图数据
              const image = new Image();
              image.onload = () => {
                this.processImageForClipboard(image, {
                  left: 0,
                  top: 0,
                  width: image.width,
                  height: image.height
                }, copyMsg);
              };
              
              image.onerror = () => {
                console.error("图像加载失败");
                copyMsg.textContent = I18nHelper.getNotificationText('copyFailed');
                setTimeout(() => copyMsg.remove(), 2000);
              };
              
              // 加载图像
              image.src = response.dataUrl;
            } else {
              console.error("全页面截图失败:", response?.error || "未知错误");
              copyMsg.textContent = I18nHelper.getNotificationText('copyFailed', response?.error || "未知错误");
              setTimeout(() => copyMsg.remove(), 2000);
            }
          });
        }
      }, 30); // 添加30毫秒延迟，足够DOM更新但不影响用户体验
    }
    
    // 处理图像并复制到剪贴板
    processImageForClipboard(image, rect, notification) {
      try {
        // 创建Canvas并裁剪图像
        const canvas = document.createElement('canvas');
        canvas.width = rect.width;
        canvas.height = rect.height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          console.error("无法获取Canvas上下文");
          notification.textContent = I18nHelper.getNotificationText('canvasContextError');
          setTimeout(() => notification.remove(), 2000);
          return;
        }
        
        // 确保裁剪区域在图像范围内
        if (rect.left >= 0 && rect.top >= 0 && 
            rect.left + rect.width <= image.width && 
            rect.top + rect.height <= image.height) {
            
          // 绘制裁剪区域
          ctx.drawImage(
            image,
            rect.left, rect.top, rect.width, rect.height,
            0, 0, rect.width, rect.height
          );
          
          // 转换Canvas为Blob并复制到剪贴板
          canvas.toBlob(blob => {
            if (blob) {
              try {
                // 创建ClipboardItem并复制到剪贴板
                const clipboardItem = new ClipboardItem({ 'image/png': blob });
                navigator.clipboard.write([clipboardItem])
                  .then(() => {
                    console.log("成功复制到剪贴板");
                    notification.textContent = I18nHelper.getNotificationText('copied');
                    setTimeout(() => notification.remove(), 2000);
                  })
                  .catch(err => {
                    console.error("复制到剪贴板失败:", err);
                    notification.textContent = I18nHelper.getNotificationText('clipboardAccessDenied', err.message || '');
                    setTimeout(() => notification.remove(), 2000);
                  });
              } catch (error) {
                console.error("创建ClipboardItem失败:", error);
                notification.textContent = I18nHelper.getNotificationText('copyFailed', error.message || "不支持剪贴板API");
                setTimeout(() => notification.remove(), 2000);
                
                // 尝试使用旧版方法
                this.copyImageFallback(canvas, notification);
              }
            } else {
              console.error("无法创建Blob");
              notification.textContent = I18nHelper.getNotificationText('copyFailed');
              setTimeout(() => notification.remove(), 2000);
            }
          }, 'image/png');
        } else {
          console.warn("裁剪区域超出可见范围");
          notification.textContent = I18nHelper.getNotificationText('copyAreaOutOfView');
          setTimeout(() => notification.remove(), 2000);
        }
      } catch (error) {
        console.error("处理图像时出错:", error);
        notification.textContent = I18nHelper.getNotificationText('copyFailed', error.message || "处理图像出错");
        setTimeout(() => notification.remove(), 2000);
      }
    }
    
    // 尝试使用替代方法复制图像（兼容性更好但功能有限）
    copyImageFallback(canvas, notification) {
      try {
        // 尝试创建临时链接并模拟点击下载
        const dataUrl = canvas.toDataURL('image/png');
        
        // 提示用户使用右键复制
        const imagePreview = document.createElement('div');
        imagePreview.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #fff;
          padding: 20px;
          border: 2px solid #333;
          box-shadow: 0 0 20px rgba(0,0,0,0.5);
          z-index: 99999;
          text-align: center;
          max-width: 80vw;
          max-height: 80vh;
          overflow: auto;
        `;
        
        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.cssText = `
          padding: 5px 10px;
          margin-top: 10px;
          cursor: pointer;
        `;
        closeButton.onclick = () => imagePreview.remove();
        
        const helpText = document.createElement('p');
        helpText.textContent = '现代浏览器中可直接右键点击图像并选择"复制图像"';
        helpText.style.marginBottom = '10px';
        
        const img = document.createElement('img');
        img.src = dataUrl;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '60vh';
        img.style.border = '1px solid #ccc';
        
        imagePreview.appendChild(helpText);
        imagePreview.appendChild(img);
        imagePreview.appendChild(document.createElement('br'));
        imagePreview.appendChild(closeButton);
        
        document.body.appendChild(imagePreview);
        
        notification.textContent = I18nHelper.getNotificationText('imagePreviewShown');
        setTimeout(() => notification.remove(), 2000);
      } catch (error) {
        console.error("替代复制方法失败:", error);
        notification.textContent = I18nHelper.getNotificationText('copyFailed', error.message);
        setTimeout(() => notification.remove(), 2000);
      }
    }

    // 打开AI对话界面
    openAIDialog() {
      if (!this.selection) {
        console.error("未找到选择框，无法启动对话");
        return;
      }
      
      console.log("开始准备用于AI对话的截图");
      
      // 显示处理中提示
      const dialogMsg = this.showNotification(I18nHelper.getNotificationText('processing'));
      
      // 使用我们跟踪的绝对坐标进行截图
      const captureRect = {
        left: Math.min(this.startX, this.endX),
        top: Math.min(this.startY, this.endY),
        width: Math.abs(this.endX - this.startX),
        height: Math.abs(this.endY - this.startY)
      };
      
      console.log("对话区域坐标(绝对):", captureRect);
      
      // 临时隐藏UI元素，确保截图不包含黑色蒙版和边框
      this.hideUIElementsForCapture();
      
      // 添加短延迟确保DOM更新已渲染
      setTimeout(() => {
        // 获取当前的滚动位置和视口尺寸
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // 检查选择区域是否在视口范围内
        const isRectVisible = (
          captureRect.left >= scrollX && 
          captureRect.top >= scrollY && 
          captureRect.left + captureRect.width <= scrollX + viewportWidth &&
          captureRect.top + captureRect.height <= scrollY + viewportHeight
        );
        
        // 根据区域是否在当前视口内，选择不同的截图方法
        if (isRectVisible) {
          console.log("选择区域在当前视口内，使用标准截图方法");
          
          // 区域在视口内，使用常规方法截图
          chrome.runtime.sendMessage({ 
            action: 'captureScreen'
          }, response => {
            // 恢复UI元素
            this.restoreUIElementsAfterCapture();
            
            if (response && response.success) {
              // 处理截图数据
              const image = new Image();
              image.onload = () => {
                // 将绝对坐标转换为图像相对坐标 (为了应对设备像素比)
                const devicePixelRatio = window.devicePixelRatio || 1;
                const imageRect = {
                  left: Math.round((captureRect.left - scrollX) * devicePixelRatio),
                  top: Math.round((captureRect.top - scrollY) * devicePixelRatio),
                  width: Math.round(captureRect.width * devicePixelRatio),
                  height: Math.round(captureRect.height * devicePixelRatio)
                };
                
                // 剪切并用于对话
                this.processImageForDialog(image, imageRect, dialogMsg);
              };
              
              image.onerror = () => {
                console.error("图像加载失败");
                dialogMsg.textContent = I18nHelper.isZh() ? 
                  "图像处理失败，请重试" : "Image processing failed, please try again";
                setTimeout(() => dialogMsg.remove(), 2000);
              };
              
              // 加载图像
              image.src = response.dataUrl;
            } else {
              console.error("截图失败:", response?.error || "未知错误");
              dialogMsg.textContent = I18nHelper.isZh() ? 
                `截图失败: ${response?.error || "未知错误"}` : 
                `Screenshot failed: ${response?.error || "Unknown error"}`;
              setTimeout(() => dialogMsg.remove(), 2000);
            }
          });
        } else {
          console.log("选择区域不完全在当前视口内，使用滚动截图方法");
          
          // 区域不完全在视口内，通知后台脚本使用分块截图
          chrome.runtime.sendMessage({
            action: 'captureFullPage',
            targetArea: captureRect
          }, response => {
            // 恢复UI元素
            this.restoreUIElementsAfterCapture();
            
            if (response && response.success) {
              // 处理截图数据
              const image = new Image();
              image.onload = () => {
                this.processImageForDialog(image, {
                  left: 0,
                  top: 0,
                  width: image.width,
                  height: image.height
                }, dialogMsg);
              };
              
              image.onerror = () => {
                console.error("图像加载失败");
                dialogMsg.textContent = I18nHelper.isZh() ? 
                  "图像处理失败，请重试" : "Image processing failed, please try again";
                setTimeout(() => dialogMsg.remove(), 2000);
              };
              
              // 加载图像
              image.src = response.dataUrl;
            } else {
              console.error("全页面截图失败:", response?.error || "未知错误");
              dialogMsg.textContent = I18nHelper.isZh() ? 
                `截图失败: ${response?.error || "未知错误"}` : 
                `Screenshot failed: ${response?.error || "Unknown error"}`;
              setTimeout(() => dialogMsg.remove(), 2000);
            }
          });
        }
      }, 30); // 添加30毫秒延迟，足够DOM更新但不影响用户体验
    }
    
    // 处理图像并用于对话
    processImageForDialog(image, rect, notification) {
      try {
        // 创建Canvas并裁剪图像
        const canvas = document.createElement('canvas');
        canvas.width = rect.width;
        canvas.height = rect.height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          console.error("无法获取Canvas上下文");
          notification.textContent = I18nHelper.isZh() ? 
            "Canvas上下文错误" : "Canvas context error";
          setTimeout(() => notification.remove(), 2000);
          return;
        }
        
        // 确保裁剪区域在图像范围内
        if (rect.left >= 0 && rect.top >= 0 && 
            rect.left + rect.width <= image.width && 
            rect.top + rect.height <= image.height) {
            
          // 绘制裁剪区域
          ctx.drawImage(
            image,
            rect.left, rect.top, rect.width, rect.height,
            0, 0, rect.width, rect.height
          );
          
          // 将Canvas转换为base64
          let imageBase64 = canvas.toDataURL('image/jpeg', 0.85).split(',')[1]; // 使用较高质量的JPEG格式
          
          // 计算base64图像大小（字节）
          const imageSize = Math.floor(imageBase64.length * 0.75);
          console.log(`图像大小: ${(imageSize / 1024 / 1024).toFixed(2)} MB`);
          
          // 检查图像大小是否超过5MB
          if (imageSize > 5 * 1024 * 1024) {
            console.log("图像大小超过5MB，进行压缩");
            
            // 使用减少质量和尺寸的方法压缩图像
            this.resizeImageForDialog(canvas, (resizedBase64) => {
              // 移除data:image/jpeg;base64,前缀
              const finalBase64 = resizedBase64.split(',')[1];
              this.launchDialogWithImage(finalBase64, notification);
            });
          } else {
            // 直接使用当前base64
            this.launchDialogWithImage(imageBase64, notification);
          }
        } else {
          console.warn("裁剪区域超出可见范围");
          notification.textContent = I18nHelper.isZh() ? 
            "截图区域超出可见范围" : "Screenshot area out of visible range";
          setTimeout(() => notification.remove(), 2000);
        }
      } catch (error) {
        console.error("处理图像时出错:", error);
        notification.textContent = I18nHelper.isZh() ? 
          `处理图像出错: ${error.message || ""}` : 
          `Error processing image: ${error.message || ""}`;
        setTimeout(() => notification.remove(), 2000);
      }
    }
    
    // 压缩图像以便于对话
    resizeImageForDialog(canvas, callback) {
      try {
        // 创建一个新的、尺寸更小的Canvas
        const maxDimension = 1600; // 最大尺寸限制
        let width = canvas.width;
        let height = canvas.height;
        
        // 如果任一维度超过最大限制，按比例缩小
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.floor(height * (maxDimension / width));
            width = maxDimension;
          } else {
            width = Math.floor(width * (maxDimension / height));
            height = maxDimension;
          }
        }
        
        // 创建新的Canvas并绘制缩小的图像
        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = width;
        resizedCanvas.height = height;
        
        const ctx = resizedCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, 0, width, height);
        
        // 以较低质量导出为JPEG
        const resizedBase64 = resizedCanvas.toDataURL('image/jpeg', 0.7);
        
        // 计算新的大小
        const newSize = Math.floor((resizedBase64.split(',')[1].length) * 0.75);
        console.log(`压缩后图像大小: ${(newSize / 1024 / 1024).toFixed(2)} MB`);
        
        callback(resizedBase64);
      } catch (error) {
        console.error("压缩图像出错:", error);
        callback(canvas.toDataURL('image/jpeg', 0.5)); // 发生错误时尝试更低质量
      }
    }
    
    // 启动对话界面
    launchDialogWithImage(base64Image, notification) {
      // 隐藏通知
      if (notification) {
        notification.remove();
      }
      
      // 结束截图模式
      this.end();
      
      // 创建对话窗口URL
      const dialogUrl = chrome.runtime.getURL('ai_dialog/dialog.html') + 
                        `?image=${encodeURIComponent(base64Image)}`;
      
      // 打开对话窗口
      const dialogWindowWidth = 900;
      const dialogWindowHeight = 700;
      
      // 计算窗口位置，使其居中
      const left = Math.max(0, (window.screen.width - dialogWindowWidth) / 2);
      const top = Math.max(0, (window.screen.height - dialogWindowHeight) / 2);
      
      chrome.runtime.sendMessage({
        action: 'openAIDialog',
        url: dialogUrl,
        options: {
          width: dialogWindowWidth,
          height: dialogWindowHeight,
          left: left,
          top: top,
          type: 'popup'
        }
      });
    }

    // 解析二维码
    decodeQRCode() {
      if (!this.selection) {
        console.error("未找到选择框，无法解析二维码");
        return;
      }

      console.log("开始解析二维码");

      // 显示处理中提示
      const decodeMsg = this.showNotification(I18nHelper.getNotificationText('qrDecoding'));

      // 使用我们跟踪的绝对坐标进行截图
      const captureRect = {
        left: Math.min(this.startX, this.endX),
        top: Math.min(this.startY, this.endY),
        width: Math.abs(this.endX - this.startX),
        height: Math.abs(this.endY - this.startY)
      };

      // 临时隐藏UI元素
      this.hideUIElementsForCapture();

      // 添加短延迟确保DOM更新已渲染
      setTimeout(() => {
        // 获取当前的滚动位置和视口尺寸
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // 检查选择区域是否在视口范围内
        const isRectVisible = (
          captureRect.left >= scrollX && 
          captureRect.top >= scrollY && 
          captureRect.left + captureRect.width <= scrollX + viewportWidth &&
          captureRect.top + captureRect.height <= scrollY + viewportHeight
        );

        // 根据区域是否在当前视口内，选择不同的截图方法
        if (isRectVisible) {
          chrome.runtime.sendMessage({ 
            action: 'captureScreen'
          }, response => {
            this.restoreUIElementsAfterCapture();
            if (response && response.success) {
              this.processQRCodeImage(response.dataUrl, captureRect, scrollX, scrollY, decodeMsg);
            } else {
              console.error("截图失败:", response?.error || "未知错误");
              decodeMsg.textContent = I18nHelper.getNotificationText('qrError', response?.error || "未知错误");
              setTimeout(() => decodeMsg.remove(), 3000);
            }
          });
        } else {
          chrome.runtime.sendMessage({
            action: 'captureFullPage',
            targetArea: captureRect
          }, response => {
            this.restoreUIElementsAfterCapture();
            if (response && response.success) {
              this.processQRCodeImage(response.dataUrl, captureRect, 0, 0, decodeMsg);
            } else {
              console.error("全页面截图失败:", response?.error || "未知错误");
              decodeMsg.textContent = I18nHelper.getNotificationText('qrError', response?.error || "未知错误");
              setTimeout(() => decodeMsg.remove(), 3000);
            }
          });
        }
      }, 30);
    }

    // 处理二维码图像
    processQRCodeImage(dataUrl, rect, scrollX, scrollY, notification) {
      // 首先检查 jsQR 是否可用
      if (typeof jsQR !== 'function') {
        console.error("jsQR 库未加载");
        notification.textContent = I18nHelper.getToolbarText('qrError', "二维码解析库未加载");
        setTimeout(() => notification.remove(), 3000);
        return;
      }

      const image = new Image();
      
      image.onload = () => {
        try {
          // 创建Canvas并裁剪图像
          const canvas = document.createElement('canvas');
          const devicePixelRatio = window.devicePixelRatio || 1;
          
          // 计算实际的裁剪区域（考虑设备像素比）
          const scaledRect = {
            left: Math.round((rect.left - scrollX) * devicePixelRatio),
            top: Math.round((rect.top - scrollY) * devicePixelRatio),
            width: Math.round(rect.width * devicePixelRatio),
            height: Math.round(rect.height * devicePixelRatio)
          };

          canvas.width = scaledRect.width;
          canvas.height = scaledRect.height;
          
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) {
            throw new Error("无法获取Canvas上下文");
          }

          // 绘制裁剪区域
          ctx.drawImage(
            image,
            scaledRect.left, scaledRect.top, 
            scaledRect.width, scaledRect.height,
            0, 0, scaledRect.width, scaledRect.height
          );

          // 获取图像数据
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          // 使用jsQR库解析二维码
          try {
            const code = jsQR(
              imageData.data,
              imageData.width,
              imageData.height,
              {
                inversionAttempts: "dontInvert"
              }
            );

            if (code && code.data) {
              console.log("二维码解析成功:", code.data);
              
              // 复制到剪贴板
              navigator.clipboard.writeText(code.data)
                .then(() => {
                  notification.textContent = I18nHelper.getToolbarText('qrSuccess');
                  setTimeout(() => notification.remove(), 3000);
                })
                .catch(error => {
                  console.error("复制到剪贴板失败:", error);
                  // 如果复制失败，尝试使用备用方法
                  this.copyQRCodeFallback(code.data, notification);
                });
            } else {
              console.log("未检测到二维码");
              notification.textContent = I18nHelper.getToolbarText('qrNoQRFound');
              setTimeout(() => notification.remove(), 3000);
            }
          } catch (qrError) {
            console.error("二维码解析出错:", qrError);
            notification.textContent = I18nHelper.getToolbarText('qrError', "二维码解析失败");
            setTimeout(() => notification.remove(), 3000);
          }
        } catch (error) {
          console.error("处理二维码图像时出错:", error);
          notification.textContent = I18nHelper.getToolbarText('qrError', error.message);
          setTimeout(() => notification.remove(), 3000);
        }
      };

      image.onerror = () => {
        console.error("图像加载失败");
        notification.textContent = I18nHelper.getToolbarText('qrError', "图像加载失败");
        setTimeout(() => notification.remove(), 3000);
      };

      image.src = dataUrl;
    }

    // 添加备用复制方法
    copyQRCodeFallback(text, notification) {
      try {
        // 创建临时文本区域
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        
        // 选择并复制文本
        textarea.select();
        document.execCommand('copy');
        
        // 移除临时元素
        document.body.removeChild(textarea);
        
        // 显示成功消息
        notification.textContent = I18nHelper.getToolbarText('qrSuccess');
        setTimeout(() => notification.remove(), 3000);
      } catch (error) {
        console.error("备用复制方法失败:", error);
        notification.textContent = I18nHelper.getToolbarText('qrError', "复制失败");
        setTimeout(() => notification.remove(), 3000);
      }
    }
    
    // 抠图功能 - 移除图像背景并复制到剪贴板
    removeBackground() {
      if (!this.selection) {
        console.error("未找到选择框，无法抠图");
        return;
      }
      
      console.log("开始抠图处理");
      
      // 显示处理中提示
      const removeMsg = this.showNotification(I18nHelper.isZh() ? "正在抠图处理中..." : "Removing background...");
      
      // 使用我们跟踪的绝对坐标进行截图
      const captureRect = {
        left: Math.min(this.startX, this.endX),
        top: Math.min(this.startY, this.endY),
        width: Math.abs(this.endX - this.startX),
        height: Math.abs(this.endY - this.startY)
      };
      
      console.log("抠图区域坐标(绝对):", captureRect);
      
      // 获取当前的滚动位置和视口尺寸
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // 检查选择区域是否在视口范围内
      const isRectVisible = (
        captureRect.left >= scrollX && 
        captureRect.top >= scrollY && 
        captureRect.left + captureRect.width <= scrollX + viewportWidth &&
        captureRect.top + captureRect.height <= scrollY + viewportHeight
      );
      
      // 临时隐藏UI元素，确保截图不包含黑色蒙版和边框
      this.hideUIElementsForCapture();
      
      // 添加短延迟确保DOM更新已渲染
      setTimeout(() => {
        // 根据区域是否在当前视口内，选择不同的截图方法
        if (isRectVisible) {
          console.log("选择区域在当前视口内，使用标准截图方法");
          
          // 区域在视口内，使用常规方法截图
          chrome.runtime.sendMessage({ 
            action: 'captureScreen'
          }, response => {
            // 恢复UI元素
            this.restoreUIElementsAfterCapture();
            
            if (response && response.success) {
              // 处理截图数据
              const image = new Image();
              image.onload = () => {
                // 将绝对坐标转换为图像相对坐标 (为了应对设备像素比)
                const devicePixelRatio = window.devicePixelRatio || 1;
                const imageRect = {
                  left: Math.round((captureRect.left - scrollX) * devicePixelRatio),
                  top: Math.round((captureRect.top - scrollY) * devicePixelRatio),
                  width: Math.round(captureRect.width * devicePixelRatio),
                  height: Math.round(captureRect.height * devicePixelRatio)
                };
                
                // 剪切并处理抠图
                this.processImageForRemoveBackground(image, imageRect, removeMsg);
              };
              
              image.onerror = () => {
                console.error("图像加载失败");
                removeMsg.textContent = I18nHelper.isZh() ? "抠图失败：图像加载失败" : "Background removal failed: Image loading error";
                setTimeout(() => removeMsg.remove(), 2000);
              };
              
              // 加载图像
              image.src = response.dataUrl;
            } else {
              console.error("截图失败:", response?.error || "未知错误");
              removeMsg.textContent = I18nHelper.isZh() ? 
                `抠图失败：${response?.error || "未知错误"}` : 
                `Background removal failed: ${response?.error || "Unknown error"}`;
              setTimeout(() => removeMsg.remove(), 2000);
            }
          });
        } else {
          console.log("选择区域不完全在当前视口内，使用滚动截图方法");
          
          // 区域不完全在视口内，通知后台脚本使用分块截图
          chrome.runtime.sendMessage({
            action: 'captureFullPage',
            targetArea: captureRect
          }, response => {
            // 恢复UI元素
            this.restoreUIElementsAfterCapture();
            
            if (response && response.success) {
              // 处理截图数据
              const image = new Image();
              image.onload = () => {
                this.processImageForRemoveBackground(image, {
                  left: 0,
                  top: 0,
                  width: image.width,
                  height: image.height
                }, removeMsg);
              };
              
              image.onerror = () => {
                console.error("图像加载失败");
                removeMsg.textContent = I18nHelper.isZh() ? "抠图失败：图像加载失败" : "Background removal failed: Image loading error";
                setTimeout(() => removeMsg.remove(), 2000);
              };
              
              // 加载图像
              image.src = response.dataUrl;
            } else {
              console.error("全页面截图失败:", response?.error || "未知错误");
              removeMsg.textContent = I18nHelper.isZh() ? 
                `抠图失败：${response?.error || "未知错误"}` : 
                `Background removal failed: ${response?.error || "Unknown error"}`;
              setTimeout(() => removeMsg.remove(), 2000);
            }
          });
        }
      }, 30); // 添加30毫秒延迟，足够DOM更新但不影响用户体验
    }
    
    // 处理图像并进行抠图
    processImageForRemoveBackground(image, rect, notification) {
      try {
        // 创建Canvas并裁剪图像
        const canvas = document.createElement('canvas');
        canvas.width = rect.width;
        canvas.height = rect.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        if (!ctx) {
          console.error("无法获取Canvas上下文");
          notification.textContent = I18nHelper.isZh() ? "抠图失败：无法获取Canvas上下文" : "Background removal failed: Cannot get canvas context";
          setTimeout(() => notification.remove(), 2000);
          return;
        }
        
        // 确保裁剪区域在图像范围内
        if (rect.left >= 0 && rect.top >= 0 && 
            rect.left + rect.width <= image.width && 
            rect.top + rect.height <= image.height) {
            
          // 先绘制一个完全透明的背景，确保支持透明度
          ctx.clearRect(0, 0, rect.width, rect.height);
          
          // 绘制裁剪区域
          ctx.drawImage(
            image,
            rect.left, rect.top, rect.width, rect.height,
            0, 0, rect.width, rect.height
          );
          
          console.log("正在处理抠图...");
          
          // 获取图像数据
          const imageData = ctx.getImageData(0, 0, rect.width, rect.height);
          const data = imageData.data;
          
          // 改进的背景移除算法 - 包含多项优化
          this.simpleBackgroundRemoval(imageData);
          
          // 将处理后的数据放回canvas
          ctx.putImageData(imageData, 0, 0);
          
          console.log("抠图处理完成，准备复制到剪贴板");
          
          // 转换Canvas为Blob并复制到剪贴板
          canvas.toBlob(blob => {
            if (blob) {
              try {
                // 创建ClipboardItem并复制到剪贴板
                const clipboardItem = new ClipboardItem({ 'image/png': blob });
                navigator.clipboard.write([clipboardItem])
                  .then(() => {
                    console.log("成功将抠图结果复制到剪贴板");
                    notification.textContent = I18nHelper.isZh() ? "抠图完成并已复制到剪贴板" : "Background removed and copied to clipboard";
                    setTimeout(() => notification.remove(), 2000);
                  })
                  .catch(err => {
                    console.error("复制到剪贴板失败:", err);
                    notification.textContent = I18nHelper.isZh() ? 
                      `复制到剪贴板失败：${err.message || ''}` : 
                      `Clipboard access denied: ${err.message || ''}`;
                    setTimeout(() => notification.remove(), 2000);
                  });
              } catch (error) {
                console.error("创建ClipboardItem失败:", error);
                notification.textContent = I18nHelper.isZh() ? 
                  `抠图失败：${error.message || "不支持剪贴板API"}` : 
                  `Background removal failed: ${error.message || "Clipboard API not supported"}`;
                setTimeout(() => notification.remove(), 2000);
                
                // 尝试使用旧版方法
                this.copyImageFallback(canvas, notification);
              }
            } else {
              console.error("无法创建Blob");
              notification.textContent = I18nHelper.isZh() ? "抠图失败：无法创建Blob" : "Background removal failed: Cannot create Blob";
              setTimeout(() => notification.remove(), 2000);
            }
          }, 'image/png');
        } else {
          console.warn("裁剪区域超出可见范围");
          notification.textContent = I18nHelper.isZh() ? "抠图区域超出可见范围" : "Selected area is out of view";
          setTimeout(() => notification.remove(), 2000);
        }
      } catch (error) {
        console.error("处理图像时出错:", error);
        notification.textContent = I18nHelper.isZh() ? 
          `抠图失败：${error.message || "处理图像出错"}` : 
          `Background removal failed: ${error.message || "Image processing error"}`;
        setTimeout(() => notification.remove(), 2000);
      }
    }
    
    // 改进的背景移除算法 - 包含多项优化
    simpleBackgroundRemoval(imageData) {
      try {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        
        // 优化1: 更智能的背景色检测 - 不仅使用四个角落，还采样边缘区域
        const sampleSize = 10; // 采样区域大小
        const bgSamples = [];
        
        // 采样四个角落区域
        const corners = [
          {x: 0, y: 0},                     // 左上
          {x: width - sampleSize, y: 0},    // 右上
          {x: 0, y: height - sampleSize},   // 左下
          {x: width - sampleSize, y: height - sampleSize}  // 右下
        ];
        
        // 从每个角落区域收集样本
        for (const corner of corners) {
          for (let y = 0; y < sampleSize; y++) {
            for (let x = 0; x < sampleSize; x++) {
              const i = (corner.y + y) * width + (corner.x + x);
              const idx = i * 4;
              bgSamples.push({
                r: data[idx],
                g: data[idx + 1],
                b: data[idx + 2]
              });
            }
          }
        }
        
        // 采样上下边缘中间区域
        const edgeSampleCount = 5;
        const edgeStep = Math.floor(width / (edgeSampleCount + 1));
        
        // 上边缘
        for (let x = edgeStep; x < width; x += edgeStep) {
          for (let y = 0; y < sampleSize; y++) {
            const i = y * width + x;
            const idx = i * 4;
            bgSamples.push({
              r: data[idx],
              g: data[idx + 1],
              b: data[idx + 2]
            });
          }
        }
        
        // 下边缘
        for (let x = edgeStep; x < width; x += edgeStep) {
          for (let y = 0; y < sampleSize; y++) {
            const i = (height - 1 - y) * width + x;
            const idx = i * 4;
            bgSamples.push({
              r: data[idx],
              g: data[idx + 1],
              b: data[idx + 2]
            });
          }
        }
        
        // 左右边缘
        const vEdgeStep = Math.floor(height / (edgeSampleCount + 1));
        
        // 左边缘
        for (let y = vEdgeStep; y < height; y += vEdgeStep) {
          for (let x = 0; x < sampleSize; x++) {
            const i = y * width + x;
            const idx = i * 4;
            bgSamples.push({
              r: data[idx],
              g: data[idx + 1],
              b: data[idx + 2]
            });
          }
        }
        
        // 右边缘
        for (let y = vEdgeStep; y < height; y += vEdgeStep) {
          for (let x = 0; x < sampleSize; x++) {
            const i = y * width + (width - 1 - x);
            const idx = i * 4;
            bgSamples.push({
              r: data[idx],
              g: data[idx + 1],
              b: data[idx + 2]
            });
          }
        }
        
        // 计算样本颜色的中位数值 (比平均值更健壮)
        const rValues = bgSamples.map(c => c.r).sort((a, b) => a - b);
        const gValues = bgSamples.map(c => c.g).sort((a, b) => a - b);
        const bValues = bgSamples.map(c => c.b).sort((a, b) => a - b);
        
        const getMedian = arr => {
          const mid = Math.floor(arr.length / 2);
          return arr.length % 2 === 0 ? (arr[mid - 1] + arr[mid]) / 2 : arr[mid];
        };
        
        const bgColor = {
          r: Math.round(getMedian(rValues)),
          g: Math.round(getMedian(gValues)),
          b: Math.round(getMedian(bValues))
        };
        
        console.log("检测到的背景色:", bgColor);
        
        // 优化2: 自适应阈值 - 根据背景色样本的标准差动态调整
        function getStandardDeviation(values, mean) {
          return Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
        }
        
        const rMean = rValues.reduce((sum, val) => sum + val, 0) / rValues.length;
        const gMean = gValues.reduce((sum, val) => sum + val, 0) / gValues.length;
        const bMean = bValues.reduce((sum, val) => sum + val, 0) / bValues.length;
        
        const rStdDev = getStandardDeviation(rValues, rMean);
        const gStdDev = getStandardDeviation(gValues, gMean);
        const bStdDev = getStandardDeviation(bValues, bMean);
        
        // 计算平均标准差，并根据它调整阈值
        const avgStdDev = (rStdDev + gStdDev + bStdDev) / 3;
        // 设置基础阈值与动态部分
        const baseThreshold = 25;
        const threshold = Math.max(baseThreshold, Math.min(avgStdDev * 1.5, 50));
        
        console.log("自适应阈值:", threshold, "背景标准差:", avgStdDev);
        
        // 颜色距离计算函数 - 优化3: 使用加权欧氏距离，人眼对绿色更敏感
        const calcColorDistance = (color1, color2) => {
          return Math.sqrt(
            0.299 * Math.pow(color1.r - color2.r, 2) +
            0.587 * Math.pow(color1.g - color2.g, 2) +
            0.114 * Math.pow(color1.b - color2.b, 2)
          );
        };
        
        // 创建Alpha掩码 - 优化4: 使用Uint8ClampedArray避免手动裁剪值范围
        const alphaMask = new Uint8ClampedArray(width * height);
        
        // 第一步：标记所有像素的透明度
        for (let i = 0; i < width * height; i++) {
          const idx = i * 4;
          const pixelColor = {
            r: data[idx],
            g: data[idx + 1],
            b: data[idx + 2]
          };
          
          // 计算与背景色的距离
          const distance = calcColorDistance(pixelColor, bgColor);
          
          // 设置透明度 - 优化5: 使用平滑的S型曲线而非线性过渡
          if (distance < threshold) {
            alphaMask[i] = 0; // 完全透明
          } else if (distance < threshold * 2) {
            // 使用平滑的S曲线过渡 - 减少突变，更自然
            const t = (distance - threshold) / threshold;
            // 应用平滑步进函数 3t² - 2t³
            const smoothT = 3 * t * t - 2 * t * t * t;
            alphaMask[i] = Math.round(smoothT * 255);
          } else {
            alphaMask[i] = 255; // 完全不透明
          }
        }
        
        // 优化6: 对前景样本进行空间分区，提高颜色查找效率
        const gridSize = 20;
        const gridCols = Math.ceil(width / gridSize);
        const gridRows = Math.ceil(height / gridSize);
        const colorGrid = Array(gridRows).fill().map(() => Array(gridCols).fill().map(() => []));
        
        // 第二步：收集前景色样本并放入网格
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const i = y * width + x;
            if (alphaMask[i] === 255) { // 只收集完全不透明的像素
              const idx = i * 4;
              const gridX = Math.floor(x / gridSize);
              const gridY = Math.floor(y / gridSize);
              
              colorGrid[gridY][gridX].push({
                r: data[idx],
                g: data[idx + 1],
                b: data[idx + 2],
                x: x,
                y: y
              });
            }
          }
        }
        
        // 第三步：平滑边缘（解决锯齿问题）
        const smoothedMask = new Uint8ClampedArray(width * height);
        smoothedMask.set(alphaMask);
        
        // 优化7: 使用两次不同半径的模糊，更有效地消除锯齿
        // 第一次：较大半径模糊
        const applyGaussianBlur = (input, output, radius) => {
          const sigma = radius / 3;
          const twoSigmaSq = 2 * sigma * sigma;
          const kernelSize = Math.ceil(radius) * 2 + 1;
          const halfKernel = Math.floor(kernelSize / 2);
          
          // 生成高斯核
          const kernel = [];
          let kernelSum = 0;
          
          for (let y = -halfKernel; y <= halfKernel; y++) {
            for (let x = -halfKernel; x <= halfKernel; x++) {
              const dist = x * x + y * y;
              const weight = Math.exp(-dist / twoSigmaSq);
              kernel.push({ x, y, weight });
              kernelSum += weight;
            }
          }
          
          // 标准化核权重
          for (let i = 0; i < kernel.length; i++) {
            kernel[i].weight /= kernelSum;
          }
          
          // 应用模糊
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const i = y * width + x;
              
              // 只处理半透明区域
              if (input[i] > 0 && input[i] < 255) {
                let sum = 0;
                
                for (const k of kernel) {
                  const nx = x + k.x;
                  const ny = y + k.y;
                  
                  if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    const ni = ny * width + nx;
                    sum += input[ni] * k.weight;
                  }
                }
                
                output[i] = Math.round(sum);
              }
            }
          }
        };
        
        // 应用两次模糊
        applyGaussianBlur(alphaMask, smoothedMask, 2.0);  // 半径2.0的模糊
        alphaMask.set(smoothedMask);
        applyGaussianBlur(alphaMask, smoothedMask, 1.0);  // 半径1.0的模糊
        
        // 第四步：修复边缘颜色（解决边缘颜色突兀问题）
        // 优化8: 更高效的边缘颜色寻找算法
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const i = y * width + x;
            const idx = i * 4;
            
            // 只处理半透明区域
            if (smoothedMask[i] > 0 && smoothedMask[i] < 255) {
              // 寻找最近的前景色
              const gridX = Math.floor(x / gridSize);
              const gridY = Math.floor(y / gridSize);
              
              let nearestColor = null;
              let minDistance = Infinity;
              
              // 先检查当前网格
              let found = false;
              
              // 搜索3x3的相邻网格，先从当前开始
              for (let dy = -1; dy <= 1 && !found; dy++) {
                for (let dx = -1; dx <= 1 && !found; dx++) {
                  const gx = gridX + dx;
                  const gy = gridY + dy;
                  
                  if (gx >= 0 && gx < gridCols && gy >= 0 && gy < gridRows) {
                    const samples = colorGrid[gy][gx];
                    
                    if (samples.length > 0) {
                      // 限制在每个网格中检查的样本数量
                      const maxCheck = Math.min(20, samples.length);
                      
                      for (let s = 0; s < maxCheck; s++) {
                        const sample = samples[s];
                        const distance = Math.sqrt(Math.pow(x - sample.x, 2) + Math.pow(y - sample.y, 2));
                        
                        if (distance < minDistance) {
                          minDistance = distance;
                          nearestColor = sample;
                          
                          // 如果找到很近的颜色，就提前结束
                          if (distance < 5) {
                            found = true;
                            break;
                          }
                        }
                      }
                    }
                  }
                }
              }
              
              // 如果找到了前景色，使用它
              if (nearestColor) {
                data[idx] = nearestColor.r;
                data[idx + 1] = nearestColor.g;
                data[idx + 2] = nearestColor.b;
              }
              
              // 应用平滑后的透明度
              data[idx + 3] = smoothedMask[i];
            } else if (smoothedMask[i] === 0) {
              // 完全透明
              data[idx + 3] = 0;
            } else {
              // 完全不透明
              data[idx + 3] = 255;
            }
          }
        }
        
        console.log("抠图处理成功完成");
      } catch (error) {
        console.error("抠图过程发生错误:", error);
      }
    }
  }

  // 创建截图工具实例
  ratioScreenshotInstance = new RatioScreenshot();
} 

// 同时保留向后兼容性
window.ratioScreenshot = ratioScreenshotInstance;