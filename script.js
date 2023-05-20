document.addEventListener("DOMContentLoaded", () => {

  const countries = {
        "am-ET": "Amharic",
        "ar-SA": "Arabic",
        "be-BY": "Bielarus",
        "bem-ZM": "Bemba",
        "bi-VU": "Bislama",
        "bjs-BB": "Bajan",
        "bn-IN": "Bengali",
        "bo-CN": "Tibetan",
        "br-FR": "Breton",
        "bs-BA": "Bosnian",
        "ca-ES": "Catalan",
        "cop-EG": "Coptic",
        "cs-CZ": "Czech",
        "cy-GB": "Welsh",
        "da-DK": "Danish",
        "dz-BT": "Dzongkha",
        "de-DE": "German",
        "dv-MV": "Maldivian",
        "el-GR": "Greek",
        "en-GB": "English",
        "es-ES": "Spanish",
        "et-EE": "Estonian",
        "eu-ES": "Basque",
        "fa-IR": "Persian",
        "fi-FI": "Finnish",
        "fn-FNG": "Fanagalo",
        "fo-FO": "Faroese",
        "fr-FR": "French",
        "gl-ES": "Galician",
        "gu-IN": "Gujarati",
        "ha-NE": "Hausa",
        "he-IL": "Hebrew",
        "hi-IN": "Hindi",
        "hr-HR": "Croatian",
        "hu-HU": "Hungarian",
        "id-ID": "Indonesian",
        "is-IS": "Icelandic",
        "it-IT": "Italian",
        "ja-JP": "Japanese",
        "kk-KZ": "Kazakh",
        "km-KM": "Khmer",
        "kn-IN": "Kannada",
        "ko-KR": "Korean",
        "ku-TR": "Kurdish",
        "ky-KG": "Kyrgyz",
        "la-VA": "Latin",
        "lo-LA": "Lao",
        "lv-LV": "Latvian",
        "men-SL": "Mende",
        "mg-MG": "Malagasy",
        "mi-NZ": "Maori",
        "ms-MY": "Malay",
        "mt-MT": "Maltese",
        "my-MM": "Burmese",
        "ne-NP": "Nepali",
        "niu-NU": "Niuean",
        "nl-NL": "Dutch",
        "no-NO": "Norwegian",
        "ny-MW": "Nyanja",
        "ur-PK": "Pakistani",
        "pau-PW": "Palauan",
        "pa-IN": "Panjabi",
        "ps-PK": "Pashto",
        "pis-SB": "Pijin",
        "pl-PL": "Polish",
        "pt-PT": "Portuguese",
        "rn-BI": "Kirundi",
        "ro-RO": "Romanian",
        "ru-RU": "Russian",
        "sg-CF": "Sango",
        "si-LK": "Sinhala",
        "sk-SK": "Slovak",
        "sm-WS": "Samoan",
        "sn-ZW": "Shona",
        "so-SO": "Somali",
        "sq-AL": "Albanian",
        "sr-RS": "Serbian",
        "sv-SE": "Swedish",
        "sw-SZ": "Swahili",
        "ta-LK": "Tamil",
        "te-IN": "Telugu",
        "tet-TL": "Tetum",
        "tg-TJ": "Tajik",
        "th-TH": "Thai",
        "ti-TI": "Tigrinya",
        "tk-TM": "Turkmen",
        "tl-PH": "Tagalog",
        "tn-BW": "Tswana",
        "to-TO": "Tongan",
        "tr-TR": "Turkish",
        "uk-UA": "Ukrainian",
        "uz-UZ": "Uzbek",
        "vi-VN": "Vietnamese",
        "wo-SN": "Wolof",
        "xh-ZA": "Xhosa",
        "yi-YD": "Yiddish",
        "zu-ZA": "Zulu"
    };
    const fromText = document.querySelector(".from-text");
    const toText = document.querySelector(".to-text");
    const exchangeIcon = document.querySelector(".exchange");
    const selectTags = document.querySelectorAll("select");
    const icons = document.querySelectorAll(".row i");
    const translateBtn = document.querySelector("button");
    
  // Populate the select dropdowns with options
  selectTags.forEach((tag, id) => {
    for (let countryCode in countries) {
      let selected =
      id === 0
        ? countryCode === "en-GB"
          ? "selected"
          : ""
        : countryCode === "hi-IN"
        ? "selected"
        : "";
    let option = `<option ${selected} value="${countryCode}">${countries[countryCode]}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
    }
  });

  // Exchange selected languages
  exchangeIcon.addEventListener("click", () => {
    let tempText = fromText.value;
    let tempLang = selectTags[0].value;
    fromText.value = toText.value;
    toText.value = tempText;
    selectTags[0].value = selectTags[1].value;
    selectTags[1].value = tempLang;
  });

  // Clear "to" text when "from" text is empty
  fromText.addEventListener("keyup", () => {
    if (!fromText.value) {
      toText.value = "";
    }
  });

  // Translate text when Translate button is clicked
  translateBtn.addEventListener("click", () => {
    let text = fromText.value.trim();
    let translateFrom = selectTags[0].value;
    let translateTo = selectTags[1].value;
    if (!text) return;
    toText.setAttribute("placeholder", "Translating...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        toText.value = data.responseData.translatedText;
        data.matches.forEach((data) => {
          if (data.id === 0) {
            toText.value = data.translation;
          }
        });
        toText.setAttribute("placeholder", "Translation");
      });
  });

  // Handle icon clicks (copy and speak)
  icons.forEach((icon) => {
    icon.addEventListener("click", ({ target }) => {
      if (!fromText.value || !toText.value) return;
      if (target.classList.contains("fa-copy")) {
        if (target.id == "from") {
          navigator.clipboard.writeText(fromText.value);
        } else {
          navigator.clipboard.writeText(toText.value);
        }
      } else {
        let utterance;
        if (target.id == "from") {
          utterance = new SpeechSynthesisUtterance(fromText.value);
          utterance.lang = selectTags[0].value;
        } else {
          utterance = new SpeechSynthesisUtterance(toText.value);
          utterance.lang = selectTags[1].value;
        }
        speechSynthesis.speak(utterance);
      }
      });
    });
});